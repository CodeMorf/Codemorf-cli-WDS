import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  ListTodo, 
  GitCommit, 
  GitPullRequest, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Terminal, 
  FolderKanban, 
  Play, 
  ArrowRight,
  Globe,
  Sparkles
} from 'lucide-react';
import { AppState, ViewMode } from '../types';

interface DashboardViewProps {
  state: AppState;
  onNavigate: (view: ViewMode) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigate
}) => {
  return (
    <div id="dashboard-main-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-lg">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">CodeMorf Multi-Agent Mission Control</h2>
            <p className="text-[11px] text-gray-400">
              Resumen en tiempo real del workspace, agentes paralelos y métricas del proyecto
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('workspace')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-cyan-900/30"
          >
            <Sparkles size={13} />
            <span>Abrir Codex Chat Workspace</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Metrics Grid matching spec */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[#14161c] border border-[#252a38] space-y-1">
            <div className="text-gray-400 text-[11px] flex items-center gap-1">
              <FolderKanban size={12} className="text-cyan-400" />
              <span>Proyectos</span>
            </div>
            <div className="text-xl font-bold text-gray-100 font-mono">{state.projects.length}</div>
            <div className="text-[10px] text-cyan-400">Activos en local</div>
          </div>

          <div className="p-4 rounded-xl bg-[#14161c] border border-[#252a38] space-y-1">
            <div className="text-gray-400 text-[11px] flex items-center gap-1">
              <Bot size={12} className="text-emerald-400" />
              <span>Agentes Activos</span>
            </div>
            <div className="text-xl font-bold text-emerald-300 font-mono">
              {state.agents.filter(a => a.status !== 'Idle').length}
            </div>
            <div className="text-[10px] text-emerald-400">Paralelos 100% aislados</div>
          </div>

          <div className="p-4 rounded-xl bg-[#14161c] border border-[#252a38] space-y-1">
            <div className="text-gray-400 text-[11px] flex items-center gap-1">
              <ListTodo size={12} className="text-amber-400" />
              <span>Tareas Hoy</span>
            </div>
            <div className="text-xl font-bold text-amber-300 font-mono">{state.tasks.length}</div>
            <div className="text-[10px] text-amber-400">5 completadas hoy</div>
          </div>

          <div className="p-4 rounded-xl bg-[#14161c] border border-[#252a38] space-y-1">
            <div className="text-gray-400 text-[11px] flex items-center gap-1">
              <CheckCircle2 size={12} className="text-teal-400" />
              <span>Tests Ejecutados</span>
            </div>
            <div className="text-xl font-bold text-teal-300 font-mono">187</div>
            <div className="text-[10px] text-teal-400">100% Passing</div>
          </div>

          <div className="p-4 rounded-xl bg-[#14161c] border border-[#252a38] space-y-1">
            <div className="text-gray-400 text-[11px] flex items-center gap-1">
              <GitCommit size={12} className="text-purple-400" />
              <span>Commits</span>
            </div>
            <div className="text-xl font-bold text-purple-300 font-mono">16</div>
            <div className="text-[10px] text-purple-400">En 3 ramas</div>
          </div>

          <div className="p-4 rounded-xl bg-[#14161c] border border-[#252a38] space-y-1">
            <div className="text-gray-400 text-[11px] flex items-center gap-1">
              <GitPullRequest size={12} className="text-pink-400" />
              <span>Pull Requests</span>
            </div>
            <div className="text-xl font-bold text-pink-300 font-mono">3</div>
            <div className="text-[10px] text-pink-400">1 listo para merge</div>
          </div>
        </div>

        {/* Live Parallel Agents Running Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-200 text-sm">Estado de Agentes en Paralelo</h3>
            <button
              onClick={() => onNavigate('agents')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium text-xs"
            >
              <span>Ver centro de orquestación</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => onNavigate('agents')}
                className="p-4 rounded-xl bg-[#14161c] border border-[#252a38] hover:border-cyan-500/50 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.avatarColor} flex items-center justify-center font-bold text-black text-xs`}>
                      <Bot size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-200">{agent.name}</div>
                      <div className="text-[10px] text-cyan-300 font-mono">{agent.branch}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-mono">
                    {agent.status}
                  </span>
                </div>

                <p className="text-gray-400 text-[11px] line-clamp-1">{agent.currentTask}</p>

                <div className="pt-2 border-t border-[#232734] flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>Acciones: {agent.actionsCount}</span>
                  <span>Uso RAM: {agent.memoryUsage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('browser')}
            className="p-4 rounded-xl bg-[#171922] border border-[#272c3c] hover:border-cyan-500/50 text-left transition-all space-y-2 group"
          >
            <div className="p-2 bg-blue-950 text-blue-400 rounded-lg w-fit">
              <Globe size={18} />
            </div>
            <h4 className="font-semibold text-gray-100 group-hover:text-cyan-300 transition-colors">Navegador Local Integrado</h4>
            <p className="text-gray-400 text-xs">Inspecciona el preview live de Vite con DevTools, capturas y consola.</p>
          </button>

          <button
            onClick={() => onNavigate('tasks')}
            className="p-4 rounded-xl bg-[#171922] border border-[#272c3c] hover:border-cyan-500/50 text-left transition-all space-y-2 group"
          >
            <div className="p-2 bg-amber-950 text-amber-400 rounded-lg w-fit">
              <ListTodo size={18} />
            </div>
            <h4 className="font-semibold text-gray-100 group-hover:text-amber-300 transition-colors">Kanban & Tareas Autónomas</h4>
            <p className="text-gray-400 text-xs">Organiza sprints y asigna tareas concurrentes a los agentes.</p>
          </button>

          <button
            onClick={() => onNavigate('git')}
            className="p-4 rounded-xl bg-[#171922] border border-[#272c3c] hover:border-cyan-500/50 text-left transition-all space-y-2 group"
          >
            <div className="p-2 bg-purple-950 text-purple-400 rounded-lg w-fit">
              <GitPullRequest size={18} />
            </div>
            <h4 className="font-semibold text-gray-100 group-hover:text-purple-300 transition-colors">Git & Pull Requests</h4>
            <p className="text-gray-400 text-xs">Revisa diffs visuales y fusiona branches generadas por la IA.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
