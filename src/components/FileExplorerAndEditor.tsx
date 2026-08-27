import React, { useEffect, useMemo, useState } from 'react';
import { FileCode2, Folder, FolderOpen, RefreshCw, Save, Search } from 'lucide-react';
import { getLastWorkspace, getPermissionLevel, setLastWorkspace } from '../lib/runtimeSettings';
import { isTauri, listDirectory, readTextFile, writeTextFile } from '../lib/native';

type Entry = { name: string; path: string; isDir: boolean; size: number | null };

export const FileExplorerAndEditor: React.FC = () => {
  const [cwd, setCwd] = useState(getLastWorkspace(''));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentDir, setCurrentDir] = useState(cwd);
  const [activeFile, setActiveFile] = useState('');
  const [content, setContent] = useState('');
  const [original, setOriginal] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const modified = content !== original;
  const filtered = useMemo(() => entries.filter(e => e.name.toLowerCase().includes(query.toLowerCase())), [entries, query]);

  const openDir = async (path: string) => {
    if (!isTauri()) { setError('El filesystem real está disponible en CodeMorf Desktop.'); return; }
    setBusy(true); setError('');
    try {
      const data = await listDirectory(path);
      setEntries(data);
      setCurrentDir(path);
      setCwd(path);
      setLastWorkspace(path);
    } catch (e) { setError(String(e)); }
    finally { setBusy(false); }
  };

  useEffect(() => { if (isTauri() && cwd) openDir(cwd); }, []);

  const openEntry = async (entry: Entry) => {
    if (entry.isDir) { await openDir(entry.path); return; }
    setBusy(true); setError('');
    try {
      const text = await readTextFile(entry.path);
      setActiveFile(entry.path);
      setContent(text);
      setOriginal(text);
    } catch (e) { setError(`No se pudo abrir como texto: ${String(e)}`); }
    finally { setBusy(false); }
  };

  const save = async () => {
    if (!activeFile || !modified) return;
    const permission = getPermissionLevel();
    if (permission === 'read_only') { setError('Modo Solo Lectura: escritura bloqueada.'); return; }
    if (permission === 'ask_confirmation' && !window.confirm(`¿Permitir que CodeMorf escriba este archivo?\n\n${activeFile}`)) return;
    setBusy(true); setError('');
    try {
      await writeTextFile(activeFile, content);
      setOriginal(content);
    } catch (e) { setError(String(e)); }
    finally { setBusy(false); }
  };

  const parentDir = () => {
    const normalized = currentDir.replace(/[\\/]+$/, '');
    const idx = Math.max(normalized.lastIndexOf('\\'), normalized.lastIndexOf('/'));
    return idx > 2 ? normalized.slice(0, idx) : normalized;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#15171d] text-gray-200 text-xs">
      <div className="px-4 py-2 border-b border-[#232734] flex gap-2 bg-[#191b23]">
        <input value={cwd} onChange={e => setCwd(e.target.value)} placeholder="C:\\ruta\\proyecto" className="flex-1 bg-[#101217] border border-[#2a3040] rounded px-3 py-1.5 font-mono outline-none"/>
        <button onClick={() => openDir(cwd)} disabled={busy} className="px-3 py-1.5 bg-cyan-600 rounded flex items-center gap-1"><FolderOpen size={13}/> Abrir</button>
        <button onClick={() => openDir(currentDir)} disabled={busy || !currentDir} className="p-2 bg-[#242836] rounded"><RefreshCw size={13} className={busy ? 'animate-spin' : ''}/></button>
      </div>
      {error && <div className="px-4 py-2 text-rose-300 bg-rose-950/40 border-b border-rose-900">{error}</div>}
      <div className="flex-1 grid grid-cols-[300px_1fr] overflow-hidden">
        <aside className="border-r border-[#232734] overflow-auto bg-[#12141a]">
          <div className="p-2 border-b border-[#232734]">
            <div className="flex items-center gap-2 bg-[#0f1116] border border-[#292e3c] rounded px-2 py-1.5"><Search size={12}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filtrar archivos" className="bg-transparent outline-none flex-1"/></div>
          </div>
          {currentDir && <button onClick={() => openDir(parentDir())} className="w-full text-left px-3 py-2 text-gray-400 hover:bg-white/5">..</button>}
          {filtered.map(entry => <button key={entry.path} onClick={() => openEntry(entry)} className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-white/5 ${activeFile === entry.path ? 'bg-cyan-950/30 text-cyan-300' : ''}`}>
            {entry.isDir ? <Folder size={14} className="text-amber-300"/> : <FileCode2 size={14} className="text-cyan-400"/>}
            <span className="truncate">{entry.name}</span>
            {!entry.isDir && entry.size != null && <span className="ml-auto text-[10px] text-gray-600">{entry.size} B</span>}
          </button>)}
        </aside>
        <section className="flex flex-col overflow-hidden">
          <div className="h-10 px-3 border-b border-[#232734] flex items-center justify-between bg-[#171920]">
            <span className="font-mono text-[11px] truncate">{activeFile || 'Selecciona un archivo de texto'}</span>
            <button onClick={save} disabled={!modified || busy} className="px-3 py-1 bg-cyan-600 disabled:opacity-40 rounded flex items-center gap-1"><Save size={12}/> Guardar</button>
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} spellCheck={false} disabled={!activeFile} className="flex-1 resize-none bg-[#0e1015] text-gray-200 p-4 outline-none font-mono text-[12px] leading-5"/>
        </section>
      </div>
    </div>
  );
};
