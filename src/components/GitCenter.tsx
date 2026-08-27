import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, GitBranch, GitCommit, RefreshCw, Terminal } from 'lucide-react';
import { getLastWorkspace, setLastWorkspace } from '../lib/runtimeSettings';
import { isTauri, nativeGit, runNativeCommand } from '../lib/native';

type CommitRow = { hash: string; author: string; date: string; message: string };

export const GitCenter: React.FC = () => {
  const [cwd, setCwd] = useState(getLastWorkspace(''));
  const [status, setStatus] = useState('');
  const [branch, setBranch] = useState('');
  const [commits, setCommits] = useState<CommitRow[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastError, setLastError] = useState('');

  const runGit = async (args: string[]) => {
    if (!isTauri()) throw new Error('Git real requiere CodeMorf Desktop.');
    if (!cwd.trim()) throw new Error('Selecciona/escribe la ruta de un repositorio.');
    setLastWorkspace(cwd);
    return nativeGit(args, cwd);
  };

  const refresh = async () => {
    setBusy(true); setLastError('');
    try {
      const [s, b, l] = await Promise.all([
        runGit(['status', '--short', '--branch']),
        runGit(['branch', '--show-current']),
        runGit(['log', '-n', '30', '--pretty=format:%h%x1f%an%x1f%ad%x1f%s', '--date=relative'])
      ]);
      setStatus(s.stdout || s.stderr);
      setBranch(b.stdout.trim());
      setCommits(l.stdout.split('\n').filter(Boolean).map(line => {
        const [hash, author, date, ...msg] = line.split('\x1f');
        return { hash, author, date, message: msg.join('\x1f') };
      }));
    } catch (e) { setLastError(String(e)); }
    finally { setBusy(false); }
  };

  useEffect(() => { if (isTauri() && cwd) refresh(); }, []);

  const action = async (args: string[]) => {
    setBusy(true); setLastError('');
    try {
      const r = await runGit(args);
      if (r.code !== 0) throw new Error(r.stderr || r.stdout || `git exited ${r.code}`);
      await refresh();
    } catch (e) { setLastError(String(e)); setBusy(false); }
  };

  const commit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    await action(['commit', '-m', commitMessage.trim()]);
    setCommitMessage('');
  };

  const createPr = async () => {
    setBusy(true); setLastError('');
    try {
      if (!isTauri()) throw new Error('Disponible en CodeMorf Desktop.');
      const title = window.prompt('Título del Pull Request');
      if (!title) return;
      const r = await runNativeCommand(`gh pr create --fill --title ${JSON.stringify(title)}`, cwd || undefined, 'powershell');
      if (r.code !== 0) throw new Error(r.stderr || r.stdout || 'gh pr create falló. Instala GitHub CLI y autentícate con gh auth login.');
      window.alert(r.stdout.trim() || 'Pull Request creado.');
    } catch (e) { setLastError(String(e)); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      <div className="px-5 py-3 border-b border-[#232734] bg-[#181a22] flex items-center gap-3">
        <GitBranch size={17} className="text-purple-400"/>
        <input value={cwd} onChange={e => setCwd(e.target.value)} onBlur={() => setLastWorkspace(cwd)} placeholder="C:\\ruta\\repositorio" className="flex-1 bg-[#101217] border border-[#2b303e] rounded px-3 py-1.5 font-mono outline-none focus:border-cyan-500"/>
        <button onClick={refresh} disabled={busy} className="p-2 bg-[#242836] rounded"><RefreshCw size={13} className={busy ? 'animate-spin' : ''}/></button>
        <button onClick={() => action(['pull', '--ff-only'])} disabled={busy} className="px-3 py-1.5 bg-[#242836] rounded flex items-center gap-1"><ArrowDown size={12}/> Pull</button>
        <button onClick={() => action(['push'])} disabled={busy} className="px-3 py-1.5 bg-[#242836] rounded flex items-center gap-1"><ArrowUp size={12}/> Push</button>
        <button onClick={createPr} disabled={busy} className="px-3 py-1.5 bg-cyan-600 rounded">Create PR</button>
      </div>

      {lastError && <div className="px-5 py-2 bg-rose-950/60 text-rose-300 border-b border-rose-900 whitespace-pre-wrap">{lastError}</div>}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] overflow-hidden">
        <section className="p-5 overflow-auto border-r border-[#232734]">
          <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Working Tree</h3><span className="font-mono text-cyan-300">{branch || '—'}</span></div>
          <pre className="min-h-48 whitespace-pre-wrap bg-[#101217] border border-[#242a38] rounded-lg p-3 font-mono text-[11px] text-gray-300">{status || 'Pulsa actualizar para leer git status real.'}</pre>
          <div className="mt-3 flex gap-2">
            <button onClick={() => action(['add', '-A'])} disabled={busy} className="px-3 py-1.5 bg-[#242836] rounded">Stage all</button>
            <button onClick={() => action(['reset'])} disabled={busy} className="px-3 py-1.5 bg-[#242836] rounded">Unstage all</button>
            <button onClick={() => action(['diff', '--check'])} disabled={busy} className="px-3 py-1.5 bg-[#242836] rounded">Diff check</button>
          </div>
          <form onSubmit={commit} className="mt-4 flex gap-2">
            <input value={commitMessage} onChange={e => setCommitMessage(e.target.value)} placeholder="Mensaje de commit" className="flex-1 bg-[#101217] border border-[#2b303e] rounded px-3 py-2 outline-none"/>
            <button disabled={busy || !commitMessage.trim()} className="px-4 py-2 bg-cyan-600 disabled:opacity-50 rounded">Commit</button>
          </form>
        </section>

        <section className="p-5 overflow-auto">
          <div className="flex items-center gap-2 mb-3"><GitCommit size={15} className="text-purple-400"/><h3 className="font-semibold">Commits reales</h3></div>
          <div className="space-y-2">
            {commits.length === 0 ? <div className="text-gray-500">Sin commits cargados.</div> : commits.map(c => (
              <div key={c.hash} className="p-3 bg-[#14161d] border border-[#252a38] rounded-lg">
                <div className="font-medium text-gray-100">{c.message}</div>
                <div className="mt-1 font-mono text-[10px] text-gray-500">{c.hash} · {c.author} · {c.date}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-[11px] text-gray-500 flex gap-2 items-start"><Terminal size={13}/> Los PR usan GitHub CLI (`gh`). Si no está instalado/autenticado, CodeMorf muestra el error real.</div>
        </section>
      </div>
    </div>
  );
};
