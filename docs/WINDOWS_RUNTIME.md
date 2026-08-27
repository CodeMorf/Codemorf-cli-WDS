# CodeMorf CLI — Windows Runtime

CodeMorf Desktop is a Tauri 2 + React desktop application. Native operations execute in Rust, outside the browser sandbox.

```text
React UI
  -> Tauri invoke/events
Rust runtime
  -> PowerShell / CMD
  -> Git / GitHub CLI
  -> local filesystem
  -> SQLite memory
  -> N x Grok Build ACP processes
       -> isolated Git worktrees for multi-agent jobs
```

## Requirements

- Windows 10/11 x64
- Git for Windows
- Node.js 22+ and Rust only when building from source
- Grok Build CLI for agentic coding
- GitHub CLI (`gh`) if Create PR is required

## Install Grok Build on Windows

Use the official xAI PowerShell installer:

```powershell
irm https://x.ai/cli/install.ps1 | iex
grok
grok --version
```

The first Grok launch opens browser authentication. `XAI_API_KEY` is also supported by the upstream CLI.

CodeMorf searches `grok` in PATH, `%USERPROFILE%\.grok\bin\grok.exe`, or `CODEMORF_GROK_CLI` when explicitly configured.

CodeMorf does not bundle or impersonate the xAI executable.

## ACP integration

Each CodeMorf coding-agent runtime launches:

```text
grok agent --always-approve stdio
```

and communicates using ACP JSON-RPC over stdin/stdout. CodeMorf gates that autonomy with its own permission mode before starting an agent turn:

- **Read only** — agentic execution is blocked.
- **Confirm per task** — user approves the task before Grok receives tool autonomy.
- **Full access** — no CodeMorf confirmation dialog.

ACP sessions are long-lived. The Workspace reuses its session while the project path is unchanged.

## Multi-agent

The Multi-Agent Manager can launch multiple independent Grok ACP processes. Before an agent starts, CodeMorf creates an isolated Git worktree:

```text
<repo>\.codemorf\worktrees\<agent-id>
branch: codemorf/<agent-id>
```

This prevents parallel agents from editing the same checkout. Each agent has its own ACP process, session ID, branch and live event stream.

## Terminal

The Terminal view invokes real PowerShell or CMD via Rust and displays actual stdout, stderr and exit code. It does not emulate command results.

## Files

The Files view lists real directories, opens text files and writes changes through Rust. Read-only and confirm-per-task policies are enforced before writes.

## Git and GitHub

The Git Center invokes the installed Git executable for status, history, stage, commit, pull, push and diff checks. Create PR invokes the installed GitHub CLI (`gh`) and therefore uses the user's own GitHub authentication.

## Browser

The Browser view loads the requested URL in a real embedded frame. Sites that deny embedding through CSP/X-Frame-Options must be opened externally. Fake Console/Network/DOM data has been removed.

## Memory

Memory is stored locally in SQLite under the CodeMorf application-data directory (`codemorf-memory.sqlite3`). Add, delete and pin operations are persisted by the Rust backend.

## Build

```powershell
npm install
npm run lint
npm run build
npm run desktop:dev
npm run desktop:build
```

`desktop:build` creates MSI and NSIS bundles under `src-tauri/target/release/bundle/`.

The GitHub Actions workflow performs TypeScript validation, web build, `cargo check`, Tauri packaging, and uploads the resulting Windows installers as an artifact.

## Security boundaries

- No API key is committed to the repository.
- CodeMorf does not elevate to Administrator automatically.
- Native shell/filesystem operations stay behind Tauri commands.
- Grok autonomy is gated by CodeMorf's permission setting.
- Multi-agent work is isolated with Git worktrees.
