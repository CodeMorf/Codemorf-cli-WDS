import React, { useState } from 'react';
import { Check, Columns2, Copy, Play, Sparkles, Square, Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import { getLastWorkspace, setLastWorkspace } from '../lib/runtimeSettings';
import { isTauri, runNativeCommand, type ShellKind } from '../lib/native';

type TabId = 'powershell' | 'cmd' | 'agent';

export const TerminalPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('powershell');
  const [commandInput, setCommandInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [running, setRunning] = useState(false);
  const [cwd, setCwd] = useState(getLastWorkspace(''));
  const [logs, setLogs] = useState<Record<TabId, string[]>>({
    powershell: ['CodeMorf Native Terminal — PowerShell'],
    cmd: ['CodeMorf Native Terminal — CMD'],
    agent: ['Grok Build usa su propio proceso ACP desde el Workspace.']
  });

  const shellForTab = (tab: TabId): ShellKind => tab === 'cmd' ? 'cmd' : 'powershell';

  const append = (tab: TabId, ...lines: string[]) => {
    setLogs(prev => ({ ...prev, [tab]: [...prev[tab], ...lines] }));
  };

  const handleRunCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd || running) return;

    if (activeTab === 'agent') {
      append('agent', '> ' + cmd, 'Usa el Workspace principal para enviar prompts al runtime Grok ACP.');
      setCommandInput('');
      return;
    }

    if (cmd === 'clear' || cmd === 'cls') {
      setLogs(prev => ({ ...prev, [activeTab]: [] }));
      setCommandInput('');
      return;
    }

    if (!isTauri()) {
      append(activeTab, '> ' + cmd, '[WEB PREVIEW] La ejecución real está disponible en CodeMorf Desktop (Tauri).');
      setCommandInput('');
      return;
    }

    setRunning(true);
    setLastWorkspace(cwd);
    append(activeTab, `${shellForTab(activeTab) === 'cmd' ? 'CMD' : 'PS'} ${cwd || '(directorio de la app)'}> ${cmd}`);
    setCommandInput('');
    try {
      const result = await runNativeCommand(cmd, cwd || undefined, shellForTab(activeTab));
      const output = [result.stdout.trim(), result.stderr.trim()].filter(Boolean).join('\n');
      append(activeTab, output || `(exit code ${result.code}, sin salida)`, `[exit ${result.code}]`);
    } catch (error) {
      append(activeTab, `[ERROR] ${String(error)}`);
    } finally {
      setRunning(false);
    }
  };

  const copyLogs = async () => {
    await navigator.clipboard.writeText(logs[activeTab].join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0e1015] text-gray-200 text-xs">
      <div className="px-4 py-2 border-b border-[#232734] bg-[#161820] flex items-center gap-3">
        <TerminalIcon size={15} className="text-cyan-400" />
        <input
          value={cwd}
          onChange={e => setCwd(e.target.value)}
          onBlur={() => setLastWorkspace(cwd)}
          placeholder="C:\\ruta\\del\\proyecto"
          className="flex-1 bg-[#101217] border border-[#2a3040] rounded px-3 py-1.5 font-mono outline-none focus:border-cyan-500"
        />
        <span className={`px-2 py-1 rounded border ${isTauri() ? 'text-emerald-300 border-emerald-800 bg-emerald-950/50' : 'text-amber-300 border-amber-800 bg-amber-950/50'}`}>
          {isTauri() ? 'Native Windows' : 'Web preview'}
        </span>
      </div>

      <div className="h-11 px-4 border-b border-[#232734] bg-[#161820] flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(['powershell', 'cmd', 'agent'] as TabId[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded font-mono ${activeTab === tab ? 'bg-[#0e1015] text-cyan-300 border border-[#303748]' : 'text-gray-400 hover:text-white'}`}>
              {tab === 'agent' ? <Sparkles size={12} className="inline mr-1" /> : null}{tab === 'powershell' ? 'PowerShell' : tab === 'cmd' ? 'CMD' : 'Agent'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsSplit(v => !v)} className="p-1.5 hover:bg-white/5 rounded"><Columns2 size={13}/></button>
          <button onClick={copyLogs} className="p-1.5 hover:bg-white/5 rounded">{copied ? <Check size={13} className="text-emerald-400"/> : <Copy size={13}/>}</button>
          <button onClick={() => setLogs(prev => ({ ...prev, [activeTab]: [] }))} className="p-1.5 hover:bg-white/5 rounded"><Trash2 size={13}/></button>
        </div>
      </div>

      <div className={`flex-1 overflow-auto p-4 font-mono text-[12px] whitespace-pre-wrap ${isSplit ? 'grid grid-cols-2 gap-4' : ''}`}>
        <div>{logs[activeTab].map((line, i) => <div key={i} className={line.startsWith('[ERROR]') ? 'text-rose-400' : line.startsWith('[exit 0]') ? 'text-emerald-400' : line.startsWith('PS ') || line.startsWith('CMD ') ? 'text-cyan-300' : 'text-gray-300'}>{line}</div>)}</div>
        {isSplit && <div className="border-l border-[#232734] pl-4 text-gray-400">{logs.powershell.map((line, i) => <div key={i}>{line}</div>)}</div>}
      </div>

      <form onSubmit={handleRunCommand} className="p-2.5 bg-[#12141c] border-t border-[#232734] flex items-center gap-2 font-mono">
        <span className="text-emerald-400">{activeTab === 'cmd' ? 'CMD>' : activeTab === 'agent' ? 'AGENT>' : 'PS>'}</span>
        <input value={commandInput} onChange={e => setCommandInput(e.target.value)} disabled={running} placeholder={running ? 'Ejecutando…' : 'Escribe un comando real…'} className="flex-1 bg-transparent outline-none" />
        <button type="submit" disabled={running} className="px-3 py-1 bg-cyan-600 disabled:opacity-50 rounded flex items-center gap-1">{running ? <Square size={11}/> : <Play size={11}/>} {running ? 'Ejecutando' : 'Ejecutar'}</button>
      </form>
    </div>
  );
};
