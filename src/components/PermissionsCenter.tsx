import React, { useEffect, useState } from 'react';
import { Database, FolderKanban, GitBranch, Globe, Lock, Shield, Terminal, Unlock, Wifi, Zap } from 'lucide-react';
import type { PermissionCategory, PermissionLevel } from '../types';
import { getPermissionLevel, setPermissionLevel } from '../lib/runtimeSettings';

interface PermissionsCenterProps {
  permissions: PermissionCategory[];
  onUpdatePermissionMode: (categoryId: string, mode: PermissionCategory['mode']) => void;
  globalPermissionLevel?: PermissionLevel;
  onUpdateGlobalPermissionLevel?: (level: PermissionLevel) => void;
}

export const PermissionsCenter: React.FC<PermissionsCenterProps> = ({ permissions, onUpdatePermissionMode, globalPermissionLevel = 'ask_confirmation', onUpdateGlobalPermissionLevel }) => {
  const [selected, setSelected] = useState<PermissionLevel>(() => getPermissionLevel(globalPermissionLevel));

  useEffect(() => {
    setPermissionLevel(selected);
    onUpdateGlobalPermissionLevel?.(selected);
  }, [selected]);

  const icon = (name: string) => {
    if (name === 'Terminal') return <Terminal size={16} className="text-emerald-400"/>;
    if (name === 'GitBranch') return <GitBranch size={16} className="text-purple-400"/>;
    if (name === 'Database') return <Database size={16} className="text-amber-400"/>;
    if (name === 'Globe') return <Globe size={16} className="text-sky-400"/>;
    if (name === 'Wifi') return <Wifi size={16} className="text-rose-400"/>;
    return <FolderKanban size={16} className="text-cyan-400"/>;
  };

  const choices: Array<{ id: PermissionLevel; title: string; subtitle: string; icon: React.ReactNode; accent: string }> = [
    { id: 'read_only', title: 'Solo lectura', subtitle: 'Bloquea escritura y tareas agentic con ejecución.', icon: <Lock size={20}/>, accent: 'border-blue-600 text-blue-300' },
    { id: 'ask_confirmation', title: 'Confirmar por tarea', subtitle: 'Antes de dar autonomía al agente, CodeMorf pide autorización.', icon: <Shield size={20}/>, accent: 'border-cyan-600 text-cyan-300' },
    { id: 'full_access', title: 'Acceso total', subtitle: 'El agente puede usar sus herramientas sin confirmación previa.', icon: <Zap size={20}/>, accent: 'border-amber-600 text-amber-300' }
  ];

  return <div className="flex-1 overflow-auto bg-[#14151c] text-gray-200">
    <div className="px-6 py-4 border-b border-[#232734] bg-[#171922] flex items-center gap-3">
      <Shield size={20} className="text-cyan-400"/>
      <div><h2 className="font-semibold">Permisos reales del runtime</h2><p className="text-xs text-gray-500">Se guardan localmente y controlan Workspace y editor nativo.</p></div>
    </div>
    <div className="p-6 max-w-5xl space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {choices.map(c => <button key={c.id} onClick={() => setSelected(c.id)} className={`text-left p-5 rounded-xl border bg-[#171920] transition ${selected === c.id ? `${c.accent} ring-1 ring-current` : 'border-[#292e3b] text-gray-300'}`}>
          <div className="flex items-center justify-between"><span>{c.icon}</span>{selected === c.id && <span className="text-[10px] font-mono">ACTIVO</span>}</div>
          <div className="mt-3 font-semibold">{c.title}</div><div className="mt-1 text-xs text-gray-400 leading-relaxed">{c.subtitle}</div>
        </button>)}
      </div>
      <div className="p-4 rounded-xl border border-[#292e3b] bg-[#111318] text-xs text-gray-400 flex gap-2"><Unlock size={15} className="text-cyan-400 shrink-0"/><span>En <b>Confirmar por tarea</b>, el Workspace muestra una autorización antes de iniciar el turno Grok Build con herramientas. El editor también confirma antes de escribir.</span></div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Políticas granulares</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {permissions.map(p => <div key={p.id} className="p-4 rounded-xl border border-[#292e3b] bg-[#171920]">
            <div className="flex gap-3 items-start"><div className="p-2 rounded bg-[#20232d]">{icon(p.icon)}</div><div className="flex-1"><div className="font-medium text-sm">{p.name}</div><div className="text-xs text-gray-500 mt-1">{p.description}</div></div></div>
            <select value={p.mode} onChange={e => onUpdatePermissionMode(p.id, e.target.value as PermissionCategory['mode'])} className="mt-3 w-full bg-[#101217] border border-[#303647] rounded px-3 py-2 text-xs">
              <option>Ask Every Time</option><option>Allow This Session</option><option>Always Allow</option><option>Always Deny</option>
            </select>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
};
