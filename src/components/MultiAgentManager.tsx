import React, { useRef, useState } from 'react';
import { Bot, FolderGit2, Pause, Play, Terminal } from 'lucide-react';
import type { AgentInfo } from '../types';
import { GrokAcpClient } from '../lib/grokAcp';
import { isTauri, nativeGit } from '../lib/native';
import { getLastWorkspace, getPermissionLevel, setLastWorkspace } from '../lib/runtimeSettings';

interface MultiAgentManagerProps {
  agents: AgentInfo[];
  onToggleAgent: (agentId: string) => void;
  onRunAll: () => void;
  onStopAll: () => void;
}

type RuntimeState = { status: string; worktree?: string; sessionId?: string; logs: string[] };

function textFromUpdate(message: any): string | null {
  if (message?.method === 'codemorf/stderr') return `[stderr] ${message.params?.text || ''}`;
  if (message?.method !== 'session/update') return null;
  const u = message?.params?.update || {};
  const kind = u.sessionUpdate || 'update';
  const text = u?.content?.text || u?.text || u?.title || u?.status;
  return text ? `[${kind}] ${String(text)}` : `[${kind}]`;
}

export const MultiAgentManager: React.FC<MultiAgentManagerProps> = ({ agents, onRunAll, onStopAll }) => {
  const [root, setRoot] = useState(getLastWorkspace(''));
  const [selectedId, setSelectedId] = useState(agents[0]?.id || '');
  const [runtime, setRuntime] = useState<Record<string, RuntimeState>>({});
  const clients = useRef(new Map<string, GrokAcpClient>());

  const patch = (id: string, value: Partial<RuntimeState>) => setRuntime(prev => ({ ...prev, [id]: { status: 'Idle', logs: [], ...(prev[id] || {}), ...value } }));
  const log = (id: string, line: string) => setRuntime(prev => ({ ...prev, [id]: { status: prev[id]?.status || 'Running', worktree: prev[id]?.worktree, sessionId: prev[id]?.sessionId, logs: [...(prev[id]?.logs || []), line].slice(-300) } }));

  const worktreePath = (id: string) => `${root.replace(/[\\/]+$/, '')}\\.codemorf\\worktrees\\${id}`;

  const startAgent = async (agent: AgentInfo) => {
    if (!isTauri()) { patch(agent.id, { status: 'Error', logs: ['Multi-agent real requiere CodeMorf Desktop.'] }); return; }
    if (!root.trim()) { patch(agent.id, { status: 'Error', logs: ['Define la ruta del repositorio.'] }); return; }
    const permission = getPermissionLevel();
    if (permission === 'read_only') { patch(agent.id, { status: 'Blocked', logs: ['Modo Solo Lectura.'] }); return; }

    const wt = worktreePath(agent.id);
    patch(agent.id, { status: 'Preparing', worktree: wt, logs: [`Preparando worktree aislado: ${wt}`] });
    try {
      setLastWorkspace(root);
      const prune = await nativeGit(['worktree', 'prune'], root);
      if (prune.code !== 0) log(agent.id, prune.stderr);
      const add = await nativeGit(['worktree', 'add', '-B', `codemorf/${agent.id}`, wt, 'HEAD'], root);
      if (add.code !== 0 && !add.stderr.includes('already exists')) throw new Error(add.stderr || add.stdout);

      const old = clients.current.get(agent.id);
      if (old) await old.stop().catch(() => undefined);
      const client = new GrokAcpClient(`multi-${agent.id}`);
      client.onUpdate(msg => { const line = textFromUpdate(msg); if (line) log(agent.id, line); });
      clients.current.set(agent.id, client);
      patch(agent.id, { status: 'Starting', worktree: wt });
      await client.start(wt, true);
      patch(agent.id, { status: 'Running', sessionId: client.sessionId, worktree: wt });
      log(agent.id, `ACP session: ${client.sessionId}`);
      await client.prompt(`${agent.currentTask}\n\nTrabaja exclusivamente dentro de este worktree. Inspecciona, implementa, ejecuta tests relevantes y verifica tu diff antes de terminar.`);
      patch(agent.id, { status: 'Completed', sessionId: client.sessionId, worktree: wt });
      log(agent.id, 'Turno completado. Los cambios quedan aislados en su branch/worktree.');
    } catch (e) {
      patch(agent.id, { status: 'Failed', worktree: wt });
      log(agent.id, String(e));
    }
  };

  const runAll = async () => {
    if (getPermissionLevel() === 'ask_confirmation') {
      const ok = window.confirm(`Ejecutar ${agents.length} agentes Grok en paralelo, cada uno en un Git worktree aislado bajo:\n${root}\\.codemorf\\worktrees\\ ?`);
      if (!ok) return;
    }
    onRunAll();
    await Promise.allSettled(agents.map(startAgent));
  };

  const stopAll = async () => {
    await Promise.allSettled([...clients.current.values()].map(c => c.stop()));
    clients.current.clear();
    setRuntime(prev => Object.fromEntries(Object.entries(prev).map(([id, s]) => [id, { ...s, status: 'Stopped', logs: [...s.logs, 'Runtime detenido.'] }])));
    onStopAll();
  };

  const selected = agents.find(a => a.id === selectedId) || agents[0];
  const selectedRuntime = selected ? runtime[selected.id] : undefined;

  return <div className="flex-1 flex flex-col overflow-hidden bg-[#15171d] text-gray-200 text-xs">
    <header className="px-5 py-3 border-b border-[#242936] bg-[#191b23] flex items-center gap-3">
      <Bot size={18} className="text-cyan-400"/><div><div className="font-semibold">Multi-Agent Orchestration</div><div className="text-[10px] text-gray-500">Procesos Grok ACP independientes + Git worktrees</div></div>
      <input value={root} onChange={e => setRoot(e.target.value)} onBlur={() => setLastWorkspace(root)} placeholder="C:\\repositorio" className="ml-4 flex-1 bg-[#101217] border border-[#2a3040] rounded px-3 py-1.5 font-mono outline-none"/>
      <button onClick={runAll} className="px-3 py-1.5 bg-cyan-600 rounded flex items-center gap-1"><Play size={12}/> Ejecutar todos</button>
      <button onClick={stopAll} className="px-3 py-1.5 bg-[#292e3a] rounded flex items-center gap-1"><Pause size={12}/> Detener</button>
    </header>
    <div className="flex-1 grid grid-cols-[1fr_380px] overflow-hidden">
      <div className="p-5 overflow-auto grid md:grid-cols-2 gap-3 content-start">
        {agents.map(agent => { const r = runtime[agent.id]; return <button key={agent.id} onClick={() => setSelectedId(agent.id)} className={`text-left p-4 rounded-xl border ${selectedId === agent.id ? 'border-cyan-600 bg-[#1a1d26]' : 'border-[#292e3b] bg-[#171920]'}`}>
          <div className="flex items-start gap-3"><Bot size={20} className="text-cyan-400"/><div className="flex-1 min-w-0"><div className="font-semibold text-sm">{agent.name}</div><div className="text-[10px] text-gray-500 font-mono">{agent.role} · codemorf/{agent.id}</div></div><span className="px-2 py-0.5 rounded bg-[#20242e] text-[10px] text-cyan-300">{r?.status || 'Idle'}</span></div>
          <div className="mt-3 p-2.5 bg-[#101217] rounded text-gray-300">{agent.currentTask}</div>
          {r?.worktree && <div className="mt-2 text-[10px] font-mono text-gray-500 truncate"><FolderGit2 size={10} className="inline mr-1"/>{r.worktree}</div>}
        </button>; })}
      </div>
      <aside className="border-l border-[#242936] bg-[#0e1015] flex flex-col overflow-hidden">
        <div className="p-3 border-b border-[#242936] flex items-center gap-2"><Terminal size={14} className="text-emerald-400"/><span className="font-semibold">{selected?.name || 'Agente'}</span></div>
        <div className="p-3 border-b border-[#242936] text-[10px] text-gray-500 font-mono break-all">Session: {selectedRuntime?.sessionId || '—'}<br/>Worktree: {selectedRuntime?.worktree || '—'}</div>
        <div className="flex-1 overflow-auto p-3 font-mono text-[11px] whitespace-pre-wrap space-y-1">{(selectedRuntime?.logs || ['Sin ejecución todavía.']).map((line, i) => <div key={i} className={line.includes('stderr') || line.includes('Error') ? 'text-rose-400' : 'text-gray-300'}>{line}</div>)}</div>
      </aside>
    </div>
  </div>;
};
