import React, { useState } from 'react';
import {
  MessageSquarePlus,
  GitPullRequest,
  Globe,
  Clock,
  Puzzle,
  Pin,
  FolderKanban,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Bot,
  ListTodo,
  Shield,
  Terminal,
  Cpu,
  Brain,
  Zap,
  Sliders,
  Settings,
  Mic,
  Download,
  LayoutDashboard,
  Server,
  Code2
} from 'lucide-react';
import { MainView, ProjectItem } from '../types';

interface SidebarProps {
  currentView: MainView;
  onSelectView: (view: MainView) => void;
  projects: ProjectItem[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  projects,
  activeProjectId,
  onSelectProject,
  onNewChat,
  onOpenSettings
}) => {
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  return (
    <aside 
      id="codex-left-sidebar"
      className="w-64 bg-[#14151a] text-[#c0c5d0] border-r border-[#222631] flex flex-col justify-between shrink-0 select-none text-xs h-full"
    >
      {/* Top Primary Actions */}
      <div className="p-3 border-b border-[#1f232e] space-y-1">
        {/* Nuevo Chat Button */}
        <button
          id="new-chat-btn"
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg font-medium transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <MessageSquarePlus size={15} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Nuevo chat</span>
          </div>
          <kbd className="text-[9px] bg-black/40 text-cyan-200/70 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono">
            Ctrl+N
          </kbd>
        </button>

        {/* Primary shortcuts matching Codex screenshot */}
        <div className="pt-2 space-y-0.5">
          <button
            onClick={() => onSelectView('workspace')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
              currentView === 'workspace' 
                ? 'bg-[#232734] text-white font-medium shadow-inner' 
                : 'hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles size={14} className={currentView === 'workspace' ? 'text-cyan-400' : 'text-gray-500'} />
            <span>Agent Workspace</span>
          </button>

          <button
            onClick={() => onSelectView('git')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left ${
              currentView === 'git' 
                ? 'bg-[#232734] text-white font-medium' 
                : 'hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GitPullRequest size={14} className={currentView === 'git' ? 'text-purple-400' : 'text-gray-500'} />
              <span>Pull requests</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#272b38] text-gray-400 rounded-full font-mono">
              3
            </span>
          </button>

          <button
            onClick={() => onSelectView('browser')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
              currentView === 'browser' 
                ? 'bg-[#232734] text-white font-medium' 
                : 'hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
            }`}
          >
            <Globe size={14} className={currentView === 'browser' ? 'text-sky-400' : 'text-gray-500'} />
            <span>Sitios (Browser)</span>
          </button>

          <button
            onClick={() => onSelectView('automations')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
              currentView === 'automations' 
                ? 'bg-[#232734] text-white font-medium' 
                : 'hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock size={14} className={currentView === 'automations' ? 'text-amber-400' : 'text-gray-500'} />
            <span>Programadas (Cron)</span>
          </button>

          <button
            onClick={() => onSelectView('extensions')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left ${
              currentView === 'extensions' 
                ? 'bg-[#232734] text-white font-medium' 
                : 'hover:bg-white/[0.04] text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Puzzle size={14} className={currentView === 'extensions' ? 'text-emerald-400' : 'text-gray-500'} />
              <span>Complementos</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800/40 rounded-full font-mono">
              6
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Center Section */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Centro de Comando Multi-Módulos */}
        <div>
          <div 
            className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
            onClick={() => setToolsOpen(!toolsOpen)}
          >
            <span>Módulos de Control</span>
            {toolsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </div>

          {toolsOpen && (
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => onSelectView('multi-agent')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'multi-agent' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <Bot size={13} className="text-cyan-400" />
                <span>Multi-Agent Manager</span>
              </button>

              <button
                onClick={() => onSelectView('tasks')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'tasks' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <ListTodo size={13} className="text-amber-400" />
                <span>Tareas & Kanban</span>
              </button>

              <button
                onClick={() => onSelectView('plan')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'plan' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <FolderKanban size={13} className="text-blue-400" />
                <span>Plan Mode (Blueprint)</span>
              </button>

              <button
                onClick={() => onSelectView('permissions')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'permissions' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <Shield size={13} className="text-rose-400" />
                <span>Centro de Permisos</span>
              </button>

              <button
                onClick={() => onSelectView('terminal')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'terminal' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <Terminal size={13} className="text-emerald-400" />
                <span>Terminal Integrada</span>
              </button>

              <button
                onClick={() => onSelectView('files')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'files' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <Code2 size={13} className="text-indigo-400" />
                <span>Editor & Archivos</span>
              </button>

              <button
                onClick={() => onSelectView('memory')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'memory' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <Brain size={13} className="text-pink-400" />
                <span>Memoria del Agente</span>
              </button>

              <button
                onClick={() => onSelectView('skills')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'skills' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <Zap size={13} className="text-yellow-400" />
                <span>Skills Center</span>
              </button>

              <button
                onClick={() => onSelectView('mcp')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'mcp' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <Server size={13} className="text-teal-400" />
                <span>MCP Servers Hub</span>
              </button>

              <button
                onClick={() => onSelectView('dashboard')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  currentView === 'dashboard' ? 'bg-[#232734] text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <LayoutDashboard size={13} className="text-purple-400" />
                <span>Dashboard General</span>
              </button>
            </div>
          )}
        </div>

        {/* Sección Anclados (Direct from screenshot) */}
        <div>
          <div 
            className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
            onClick={() => setPinnedOpen(!pinnedOpen)}
          >
            <div className="flex items-center gap-1.5">
              <Pin size={11} className="text-cyan-400" />
              <span>Anclados</span>
            </div>
            {pinnedOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </div>

          {pinnedOpen && (
            <div className="mt-1 space-y-0.5">
              <button 
                onClick={() => onSelectProject('proj-allsender')}
                className="w-full text-left px-2 py-1.5 rounded text-gray-300 hover:bg-white/[0.03] hover:text-white truncate transition-colors"
              >
                Locate Auth Allsender server
              </button>
              <button 
                onClick={() => onSelectProject('proj-allsender')}
                className="w-full text-left px-2 py-1.5 rounded text-gray-300 hover:bg-white/[0.03] hover:text-white truncate transition-colors"
              >
                Verifica ERP Allsender en servidor
              </button>
              <button 
                onClick={() => onSelectProject('proj-restapp')}
                className="w-full text-left px-2 py-1.5 rounded text-gray-300 hover:bg-white/[0.03] hover:text-white truncate transition-colors"
              >
                Localiza RESTAPP AllSender
              </button>
              <div className="px-2 py-1 text-gray-400 text-[11px] flex items-center justify-between">
                <span>📁 Marketing</span>
                <span className="text-[10px] text-gray-400">Sin chats</span>
              </div>
            </div>
          )}
        </div>

        {/* Sección Proyectos (Direct from screenshot) */}
        <div>
          <div 
            className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
            onClick={() => setProjectsOpen(!projectsOpen)}
          >
            <div className="flex items-center gap-1.5">
              <FolderKanban size={11} className="text-cyan-400" />
              <span>Proyectos</span>
            </div>
            {projectsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </div>

          {projectsOpen && (
            <div className="mt-1 space-y-1">
              {/* grupo.SHIP24GO */}
              <div 
                className="px-2 py-1 rounded hover:bg-white/[0.03] cursor-pointer"
                onClick={() => onSelectProject('proj-ship24go')}
              >
                <div className="text-gray-300 font-medium truncate">📁 grupo.SHIP24GO</div>
                <div className="text-[11px] text-gray-400 pl-4 truncate">Hola</div>
              </div>

              {/* Plataforma de gastos -> Construye ErogaAI SaaS local (ACTIVE) */}
              <div 
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  activeProjectId === 'proj-eroga' 
                    ? 'bg-[#212530] border border-cyan-500/40 text-cyan-200 shadow-sm' 
                    : 'hover:bg-white/[0.03]'
                }`}
                onClick={() => {
                  onSelectProject('proj-eroga');
                  onSelectView('workspace');
                }}
              >
                <div className="text-gray-300 font-medium text-xs flex items-center justify-between">
                  <span>📁 Plataforma de gastos</span>
                  {activeProjectId === 'proj-eroga' && (
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                  )}
                </div>
                <div className="text-xs font-semibold text-cyan-300 pl-2 mt-0.5 truncate">
                  Construye ErogaAI SaaS local
                </div>
              </div>

              {/* vps nuevo */}
              <div 
                className="px-2 py-1 rounded hover:bg-white/[0.03] cursor-pointer"
                onClick={() => onSelectProject('proj-vps')}
              >
                <div className="text-gray-300 font-medium truncate">📁 vps nuevo</div>
                <div className="text-[11px] text-gray-400 pl-4 truncate">Investiga acceso al VPS</div>
                <div className="text-[11px] text-gray-400 pl-4 truncate">Accede al VPS trucloud</div>
              </div>

              {/* CodeMorf */}
              <div 
                className="px-2 py-1 rounded hover:bg-white/[0.03] cursor-pointer"
                onClick={() => onSelectProject('proj-codemorf-scraper')}
              >
                <div className="text-gray-300 font-medium truncate">📁 CodeMorf</div>
                <div className="text-[11px] text-gray-400 pl-4 truncate">Crear scraper de prospectos RD</div>
              </div>

              {/* buscador de clientes redes sociales */}
              <div className="px-2 py-1 rounded hover:bg-white/[0.03] cursor-pointer">
                <div className="text-gray-300 font-medium truncate">📁 buscador de clientes redes</div>
                <div className="text-[11px] text-gray-400 pl-4 truncate">Evaluar automatización de Zernior</div>
              </div>

              {/* RESTAPP */}
              <div className="px-2 py-1 rounded hover:bg-white/[0.03] cursor-pointer" onClick={() => onSelectProject('proj-restapp')}>
                <div className="text-gray-300 font-medium truncate">📁 RESTAPP</div>
                <div className="text-[11px] text-gray-400 pl-4">Sin chats</div>
              </div>

              {/* app familiar */}
              <div className="px-2 py-1 text-gray-400 hover:text-gray-300 cursor-pointer">
                📁 app familiar
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Pill matching screenshot */}
      <div className="p-3 bg-[#111216] border-t border-[#1f232e] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-purple-900/80 border border-purple-600/50 text-purple-200 font-bold text-xs flex items-center justify-center shadow-inner">
            K
          </div>
          <div>
            <div className="font-semibold text-gray-200 text-xs">Kitgiz</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>Conectado</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          <button 
            className="p-1 hover:text-cyan-400 hover:bg-white/5 rounded transition-colors flex items-center gap-1 text-[11px]"
            title="Dictado por Voz"
          >
            <Mic size={13} />
            <span className="text-[10px]">Voz</span>
          </button>
          <button 
            className="p-1 hover:text-cyan-400 hover:bg-white/5 rounded transition-colors"
            title="Descargar sesión / Actualizaciones"
          >
            <Download size={13} />
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-1 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="Ajustes"
          >
            <Settings size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};
