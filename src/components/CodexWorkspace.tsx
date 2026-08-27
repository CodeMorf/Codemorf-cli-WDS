import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Bot, CheckCircle2, FileText, FolderGit2, Send, ShieldAlert, Square, Terminal, Wrench } from 'lucide-react';
import type { ActivityTimelineItem, ChatMessage, ProjectItem } from '../types';
import { GrokAcpClient } from '../lib/grokAcp';
import { detectGrok, isTauri } from '../lib/native';
import { getLastWorkspace, getPermissionLevel, setLastWorkspace } from '../lib/runtimeSettings';

interface CodexWorkspaceProps {
  project: ProjectItem;
  messages: ChatMessage[];
  onSendMessage: (text: string, model: string) => void;
  isAgentRunning: boolean;
  onStopAgent: () => void;
  onOpenDiffModal: () => void;
  timeline: ActivityTimelineItem[];
  onNavigateToView: (view: any) => void;
  onOpenVoiceAssistant?: () => void;
}

type RuntimeLine = { id: string; role: 'user' | 'agent' | 'tool' | 'error'; text: string; time: string };

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function extractUpdate(message: any): { role: RuntimeLine['role']; text: string } | null {
  if (message?.method === 'codemorf/stderr') return { role: 'error', text: message.params?.text || 'Grok stderr' };
  if (message?.method !== 'session/update') return null;
  const update = message?.params?.update || {};
  const kind = update.sessionUpdate || update.type || '';
  const content = update.content || update.message || update;
  const text = content?.text || content?.content?.text || content?.content || update?.text;
  if (kind === 'agent_message_chunk' && text) return { role: 'agent', text: String(text) };
  if (kind === 'agent_thought_chunk' && text) return { role: 'tool', text: `Pensando: ${String(text)}` };
  if (kind === 'tool_call') return { role: 'tool', text: `Tool: ${update.title || update.name || update.toolCall?.title || 'acción iniciada'}` };
  if (kind === 'tool_call_update') return { role: 'tool', text: `Tool update: ${update.status || update.toolCall?.status || update.title || 'progreso'}` };
  if (kind === 'plan') return { role: 'tool', text: `Plan actualizado por el agente.` };
  return null;
}

export const CodexWorkspace: React.FC<CodexWorkspaceProps> = ({
  project,
  messages,
  onSendMessage,
  isAgentRunning,
  onStopAgent,
  onOpenDiffModal,
  timeline,
  onNavigateToView,
  onOpenVoiceAssistant
}) => {
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState(project.path || getLastWorkspace(''));
  const [runtimeLines, setRuntimeLines] = useState<RuntimeLine[]>([]);
  const [running, setRunning] = useState(false);
  const [runtimeStatus, setRuntimeStatus] = useState<'checking' | 'ready' | 'missing' | 'web'>('checking');
  const [runtimeInfo, setRuntimeInfo] = useState('');
  const clientRef = useRef<GrokAcpClient | null>(null);
  const unUpdateRef = useRef<(() => void) | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = project.path || getLastWorkspace('');
    if (next) { setCwd(next); setLastWorkspace(next); }
  }, [project.id, project.path]);

  useEffect(() => {
    let live = true;
    if (!isTauri()) { setRuntimeStatus('web'); setRuntimeInfo('Preview web: usa CodeMorf Desktop para ejecutar Grok Build.'); return; }
    detectGrok().then(s => {
      if (!live) return;
      setRuntimeStatus(s.installed ? 'ready' : 'missing');
      setRuntimeInfo(s.installed ? `${s.version || 'Grok Build'} · ${s.path || ''}` : 'Grok Build CLI no detectado. Instala el CLI oficial y ejecuta grok login.');
    }).catch(e => { if (live) { setRuntimeStatus('missing'); setRuntimeInfo(String(e)); } });
    return () => { live = false; unUpdateRef.current?.(); clientRef.current?.stop().catch(() => undefined); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [runtimeLines, running]);

  const append = (role: RuntimeLine['role'], text: string) => {
    setRuntimeLines(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, text, time: now() }]);
  };

  const ensureClient = async (alwaysApprove: boolean) => {
    if (clientRef.current?.sessionId && clientRef.current.cwd === cwd) return clientRef.current;
    if (clientRef.current) await clientRef.current.stop().catch(() => undefined);
    const client = new GrokAcpClient();
    unUpdateRef.current?.();
    unUpdateRef.current = client.onUpdate(message => {
      const update = extractUpdate(message);
      if (update) append(update.role, update.text);
    });
    await client.start(cwd, alwaysApprove);
    clientRef.current = client;
    setLastWorkspace(cwd);
    append('tool', `Sesión Grok ACP iniciada: ${client.sessionId}`);
    return client;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || running) return;

    if (!isTauri()) {
      // Preserve the visual prototype in browser preview, but clearly identify it as preview.
      append('user', text);
      append('error', 'Este navegador no puede lanzar procesos locales. Abre CodeMorf Desktop para ejecución real.');
      setInput('');
      return;
    }
    if (!cwd.trim()) { append('error', 'Define una ruta de workspace válida.'); return; }
    if (runtimeStatus !== 'ready') { append('error', runtimeInfo || 'Grok Build no está listo.'); return; }

    const permission = getPermissionLevel();
    if (permission === 'read_only') {
      append('error', 'Modo Solo Lectura activo. Para permitir que un agente de coding ejecute herramientas, cambia a Confirmación o Acceso Total.');
      return;
    }
    if (permission === 'ask_confirmation') {
      const ok = window.confirm(`CodeMorf va a dar a Grok Build acceso de ejecución para ESTA tarea dentro de:\n\n${cwd}\n\nEl agente puede editar archivos y ejecutar comandos necesarios. ¿Continuar?`);
      if (!ok) return;
    }

    setInput('');
    append('user', text);
    setRunning(true);
    try {
      const client = await ensureClient(true);
      await client.prompt(text);
      append('tool', 'Turno ACP completado. El estado de la sesión queda persistido en Grok Build.');
    } catch (e) {
      append('error', String(e));
    } finally {
      setRunning(false);
    }
  };

  const stop = async () => {
    setRunning(false);
    await clientRef.current?.cancel().catch(() => undefined);
    onStopAgent();
    append('tool', 'Solicitud de cancelación enviada al runtime.');
  };

  const shownMessages = useMemo(() => isTauri() ? runtimeLines : [
    ...messages.slice(-3).map(m => ({ id: m.id, role: m.sender === 'user' ? 'user' as const : 'agent' as const, text: m.content, time: m.timestamp })),
    ...runtimeLines
  ], [messages, runtimeLines]);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#15171d] text-gray-200">
      <section className="flex-1 flex flex-col min-w-0">
        <header className="px-5 py-3 border-b border-[#242936] bg-[#191b23] flex items-center gap-3">
          <FolderGit2 size={17} className="text-cyan-400"/>
          <div className="min-w-0"><div className="font-semibold truncate">{project.name}</div><div className="text-[10px] text-gray-500 font-mono">{project.branch}</div></div>
          <input value={cwd} onChange={e => setCwd(e.target.value)} onBlur={() => setLastWorkspace(cwd)} className="ml-3 flex-1 bg-[#101217] border border-[#2a3040] rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-cyan-500" placeholder="C:\\workspace"/>
          <span className={`text-[10px] px-2 py-1 rounded border ${runtimeStatus === 'ready' ? 'text-emerald-300 border-emerald-800 bg-emerald-950/50' : runtimeStatus === 'missing' ? 'text-rose-300 border-rose-800 bg-rose-950/50' : 'text-amber-300 border-amber-800 bg-amber-950/50'}`}>{runtimeStatus === 'ready' ? 'Grok ACP listo' : runtimeStatus === 'missing' ? 'Grok no instalado' : runtimeStatus === 'web' ? 'Web preview' : 'Detectando…'}</span>
        </header>

        <div className="flex-1 overflow-auto px-5 py-5 space-y-3">
          {shownMessages.length === 0 && <div className="h-full flex items-center justify-center"><div className="max-w-lg text-center"><Bot size={36} className="mx-auto text-cyan-400 mb-3"/><h2 className="text-lg font-semibold">CodeMorf Agent Workspace</h2><p className="mt-2 text-sm text-gray-400">Escribe una tarea. En Desktop será enviada a un proceso Grok Build real por ACP/JSON-RPC.</p></div></div>}
          {shownMessages.map(line => <div key={line.id} className={`max-w-3xl rounded-xl border p-3 ${line.role === 'user' ? 'ml-auto bg-cyan-950/30 border-cyan-800/40' : line.role === 'error' ? 'bg-rose-950/30 border-rose-800/40' : line.role === 'tool' ? 'bg-[#111318] border-[#2a3040]' : 'bg-[#191c24] border-[#2a3040]'}`}>
            <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">{line.role} · {line.time}</div>
            <div className="text-sm whitespace-pre-wrap leading-6">{line.text}</div>
          </div>)}
          {running && <div className="max-w-3xl p-3 rounded-xl border border-cyan-800/40 bg-cyan-950/20 text-cyan-300 flex items-center gap-2"><Activity size={14} className="animate-pulse"/> Grok Build está trabajando…</div>}
          <div ref={endRef}/>
        </div>

        <div className="p-4 border-t border-[#242936] bg-[#171920]">
          <div className="text-[10px] text-gray-500 mb-2 truncate">{runtimeInfo}</div>
          <div className="flex gap-2 items-end">
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} rows={3} placeholder="Pide al agente que inspeccione, edite, pruebe y verifique el proyecto…" className="flex-1 resize-none bg-[#101217] border border-[#2c3242] rounded-xl p-3 outline-none focus:border-cyan-500 text-sm"/>
            {running ? <button onClick={stop} className="h-11 px-4 rounded-lg bg-rose-600 flex items-center gap-1"><Square size={13}/> Stop</button> : <button onClick={send} className="h-11 px-4 rounded-lg bg-cyan-600 flex items-center gap-1"><Send size={13}/> Ejecutar</button>}
          </div>
        </div>
      </section>

      <aside className="w-72 border-l border-[#242936] bg-[#12141a] hidden xl:flex flex-col">
        <div className="p-4 border-b border-[#242936]"><div className="text-xs font-semibold">Herramientas reales</div></div>
        <div className="p-3 space-y-2 text-xs">
          <button onClick={() => onNavigateToView('terminal')} className="w-full text-left p-2.5 rounded-lg bg-[#191c24] hover:bg-[#20242e] flex items-center gap-2"><Terminal size={13} className="text-emerald-400"/> PowerShell / CMD</button>
          <button onClick={() => onNavigateToView('files')} className="w-full text-left p-2.5 rounded-lg bg-[#191c24] hover:bg-[#20242e] flex items-center gap-2"><FileText size={13} className="text-cyan-400"/> Filesystem</button>
          <button onClick={() => onNavigateToView('git')} className="w-full text-left p-2.5 rounded-lg bg-[#191c24] hover:bg-[#20242e] flex items-center gap-2"><Wrench size={13} className="text-purple-400"/> Git / GitHub</button>
          <button onClick={() => onNavigateToView('permissions')} className="w-full text-left p-2.5 rounded-lg bg-[#191c24] hover:bg-[#20242e] flex items-center gap-2"><ShieldAlert size={13} className="text-amber-400"/> Permisos</button>
        </div>
        <div className="mt-auto p-4 border-t border-[#242936] text-[10px] text-gray-500 space-y-1"><div className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={11}/> ACP session persistence</div><div>Sin respuestas simuladas en Desktop.</div></div>
      </aside>
    </div>
  );
};
