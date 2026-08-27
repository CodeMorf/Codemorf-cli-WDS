use chrono::Utc;
use rusqlite::{params, Connection};
use serde::Serialize;
use std::{collections::HashMap, fs, path::PathBuf, process::Stdio, sync::Mutex};
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    process::{Child, ChildStdin, Command},
};

#[derive(Default)]
struct GrokRuntime {
    processes: Mutex<HashMap<String, GrokProcess>>,
}

struct GrokProcess {
    child: Child,
    stdin: ChildStdin,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CommandResult { code: i32, stdout: String, stderr: String }

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DirEntryInfo { name: String, path: String, is_dir: bool, size: Option<u64> }

#[derive(Serialize)]
struct GrokStatus { installed: bool, path: Option<String>, version: Option<String> }

#[derive(Serialize)]
struct MemoryRow { id: i64, scope: String, key: String, value: String, pinned: bool, updated_at: String }

fn app_db_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("codemorf-memory.sqlite3"))
}

fn open_db(app: &AppHandle) -> Result<Connection, String> {
    let conn = Connection::open(app_db_path(app)?).map_err(|e| e.to_string())?;
    conn.execute_batch("CREATE TABLE IF NOT EXISTS memories (id INTEGER PRIMARY KEY AUTOINCREMENT, scope TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, pinned INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL, UNIQUE(scope, key));").map_err(|e| e.to_string())?;
    Ok(conn)
}

#[tauri::command]
async fn run_command(command: String, cwd: Option<String>, shell: Option<String>) -> Result<CommandResult, String> {
    let shell = shell.unwrap_or_else(|| "powershell".into());
    let mut cmd = if cfg!(target_os = "windows") {
        if shell == "cmd" { let mut c = Command::new("cmd.exe"); c.args(["/D", "/S", "/C", &command]); c }
        else { let mut c = Command::new("powershell.exe"); c.args(["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", &command]); c }
    } else { let mut c = Command::new("sh"); c.args(["-lc", &command]); c };
    if let Some(cwd) = cwd { cmd.current_dir(cwd); }
    let output = cmd.output().await.map_err(|e| e.to_string())?;
    Ok(CommandResult { code: output.status.code().unwrap_or(-1), stdout: String::from_utf8_lossy(&output.stdout).to_string(), stderr: String::from_utf8_lossy(&output.stderr).to_string() })
}

#[tauri::command]
async fn git_command(args: Vec<String>, cwd: String) -> Result<CommandResult, String> {
    let output = Command::new("git").args(args).current_dir(cwd).output().await.map_err(|e| e.to_string())?;
    Ok(CommandResult { code: output.status.code().unwrap_or(-1), stdout: String::from_utf8_lossy(&output.stdout).to_string(), stderr: String::from_utf8_lossy(&output.stderr).to_string() })
}

#[tauri::command]
fn read_dir(path: String) -> Result<Vec<DirEntryInfo>, String> {
    let mut result = Vec::new();
    for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let metadata = entry.metadata().map_err(|e| e.to_string())?;
        result.push(DirEntryInfo { name: entry.file_name().to_string_lossy().to_string(), path: entry.path().to_string_lossy().to_string(), is_dir: metadata.is_dir(), size: if metadata.is_file() { Some(metadata.len()) } else { None } });
    }
    result.sort_by(|a, b| b.is_dir.cmp(&a.is_dir).then_with(|| a.name.to_lowercase().cmp(&b.name.to_lowercase())));
    Ok(result)
}

#[tauri::command] fn read_text_file(path: String) -> Result<String, String> { fs::read_to_string(path).map_err(|e| e.to_string()) }
#[tauri::command] fn write_text_file(path: String, content: String) -> Result<(), String> { fs::write(path, content).map_err(|e| e.to_string()) }

fn resolve_grok_binary() -> Option<PathBuf> {
    if let Ok(custom) = std::env::var("CODEMORF_GROK_CLI") { let path = PathBuf::from(custom); if path.exists() { return Some(path); } }
    if let Ok(path) = which::which("grok") { return Some(path); }
    if let Ok(home) = std::env::var("USERPROFILE") { let path = PathBuf::from(home).join(".grok").join("bin").join("grok.exe"); if path.exists() { return Some(path); } }
    None
}

#[tauri::command]
async fn grok_detect() -> GrokStatus {
    if let Some(path) = resolve_grok_binary() {
        let version = Command::new(&path).arg("--version").output().await.ok().map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string());
        GrokStatus { installed: true, path: Some(path.to_string_lossy().to_string()), version }
    } else { GrokStatus { installed: false, path: None, version: None } }
}

#[tauri::command]
async fn grok_start(app: AppHandle, runtime: State<'_, GrokRuntime>, runtime_id: String, cwd: String, always_approve: bool) -> Result<(), String> {
    {
        let guard = runtime.processes.lock().map_err(|_| "No se pudo bloquear runtimes Grok".to_string())?;
        if guard.contains_key(&runtime_id) { return Ok(()); }
    }
    let binary = resolve_grok_binary().ok_or_else(|| "Grok Build CLI no está instalado. Instálalo con el instalador oficial de xAI y ejecuta `grok login`.".to_string())?;
    let mut command = Command::new(binary);
    command.arg("agent"); if always_approve { command.arg("--always-approve"); } command.arg("stdio");
    command.current_dir(cwd).stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped());
    let mut child = command.spawn().map_err(|e| format!("No se pudo iniciar Grok Build: {e}"))?;
    let stdin = child.stdin.take().ok_or("Grok stdin no disponible")?;
    let stdout = child.stdout.take().ok_or("Grok stdout no disponible")?;
    let stderr = child.stderr.take().ok_or("Grok stderr no disponible")?;
    let stdout_event = format!("grok://message/{runtime_id}");
    let stderr_event = format!("grok://stderr/{runtime_id}");
    let app_stdout = app.clone();
    tauri::async_runtime::spawn(async move { let mut lines = BufReader::new(stdout).lines(); while let Ok(Some(line)) = lines.next_line().await { let _ = app_stdout.emit(&stdout_event, line); } });
    tauri::async_runtime::spawn(async move { let mut lines = BufReader::new(stderr).lines(); while let Ok(Some(line)) = lines.next_line().await { let _ = app.emit(&stderr_event, line); } });
    runtime.processes.lock().map_err(|_| "No se pudo bloquear runtimes Grok".to_string())?.insert(runtime_id, GrokProcess { child, stdin });
    Ok(())
}

#[tauri::command]
async fn grok_send(runtime: State<'_, GrokRuntime>, runtime_id: String, payload: String) -> Result<(), String> {
    let mut proc = runtime.processes.lock().map_err(|_| "No se pudo bloquear runtimes Grok".to_string())?.remove(&runtime_id).ok_or("Grok Build no está iniciado")?;
    proc.stdin.write_all(payload.as_bytes()).await.map_err(|e| e.to_string())?;
    proc.stdin.write_all(b"\n").await.map_err(|e| e.to_string())?;
    proc.stdin.flush().await.map_err(|e| e.to_string())?;
    runtime.processes.lock().map_err(|_| "No se pudo bloquear runtimes Grok".to_string())?.insert(runtime_id, proc);
    Ok(())
}

#[tauri::command]
async fn grok_stop(runtime: State<'_, GrokRuntime>, runtime_id: String) -> Result<(), String> {
    let proc = runtime.processes.lock().map_err(|_| "No se pudo bloquear runtimes Grok".to_string())?.remove(&runtime_id);
    if let Some(mut proc) = proc { let _ = proc.child.kill().await; }
    Ok(())
}

#[tauri::command]
fn open_external(url: String) -> Result<(), String> {
    if !(url.starts_with("http://") || url.starts_with("https://")) { return Err("Solo se permiten URLs http/https".into()); }
    open::that(url).map_err(|e| e.to_string())
}

#[tauri::command]
fn memory_list(app: AppHandle, scope: Option<String>) -> Result<Vec<MemoryRow>, String> {
    let conn = open_db(&app)?; let mut rows = Vec::new();
    if let Some(scope) = scope {
        let mut stmt = conn.prepare("SELECT id, scope, key, value, pinned, updated_at FROM memories WHERE scope = ?1 ORDER BY pinned DESC, updated_at DESC").map_err(|e| e.to_string())?;
        let iter = stmt.query_map([scope], |row| Ok(MemoryRow { id: row.get(0)?, scope: row.get(1)?, key: row.get(2)?, value: row.get(3)?, pinned: row.get::<_, i64>(4)? != 0, updated_at: row.get(5)? })).map_err(|e| e.to_string())?;
        for item in iter { rows.push(item.map_err(|e| e.to_string())?); }
    } else {
        let mut stmt = conn.prepare("SELECT id, scope, key, value, pinned, updated_at FROM memories ORDER BY pinned DESC, updated_at DESC").map_err(|e| e.to_string())?;
        let iter = stmt.query_map([], |row| Ok(MemoryRow { id: row.get(0)?, scope: row.get(1)?, key: row.get(2)?, value: row.get(3)?, pinned: row.get::<_, i64>(4)? != 0, updated_at: row.get(5)? })).map_err(|e| e.to_string())?;
        for item in iter { rows.push(item.map_err(|e| e.to_string())?); }
    }
    Ok(rows)
}

#[tauri::command]
fn memory_upsert(app: AppHandle, scope: String, key: String, value: String, pinned: bool) -> Result<i64, String> {
    let conn = open_db(&app)?; let now = Utc::now().to_rfc3339();
    conn.execute("INSERT INTO memories(scope, key, value, pinned, updated_at) VALUES(?1, ?2, ?3, ?4, ?5) ON CONFLICT(scope, key) DO UPDATE SET value=excluded.value, pinned=excluded.pinned, updated_at=excluded.updated_at", params![scope, key, value, pinned as i64, now]).map_err(|e| e.to_string())?;
    conn.query_row("SELECT id FROM memories WHERE scope=?1 AND key=?2", params![scope, key], |r| r.get(0)).map_err(|e| e.to_string())
}
#[tauri::command] fn memory_delete(app: AppHandle, id: i64) -> Result<(), String> { open_db(&app)?.execute("DELETE FROM memories WHERE id=?1", [id]).map_err(|e| e.to_string())?; Ok(()) }

pub fn run() {
    tauri::Builder::default().manage(GrokRuntime::default()).invoke_handler(tauri::generate_handler![run_command, git_command, read_dir, read_text_file, write_text_file, grok_detect, grok_start, grok_send, grok_stop, open_external, memory_list, memory_upsert, memory_delete]).run(tauri::generate_context!()).expect("error while running CodeMorf CLI");
}
