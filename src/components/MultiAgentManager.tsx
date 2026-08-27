import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  Cpu, 
  FolderGit2, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Plus, 
  Settings,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { AgentInfo } from '../types';

interface MultiAgentManagerProps {
  agents: AgentInfo[];
  onToggleAgent: (agentId: string) => void;
  onRunAll: () => void;
  onStopAll: () => void;
}

export const MultiAgentManager: React.FC<MultiAgentManagerProps> = ({
  agents,
  onToggleAgent,
  onRunAll,
  onStopAll
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agent-frontend');
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const getStatusColor = (status: AgentInfo['status']) => {
    switch (status) {
      case 'Editing':
      case 'Running':
      case 'Thinking':
        return 'bg-cyan-950 text-cyan-300 border-cyan-700/50';
      case 'Testing':
        return 'bg-violet-950 text-violet-300 border-violet-700/50';
      case 'Completed':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/50';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div id="multi-agent-manager" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-lg">
            <Bot size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Multi-Agent Parallel Orchestration</h2>
            <p className="text-[11px] text-gray-400">
              Gestión de {agents.length} agentes autónomos ejecutándose en ramas y terminales independientes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-cyan-900/30"
          >
            <Play size={12} className="fill-white" />
            <span>Ejecutar Todos en Paralelo</span>
          </button>
          <button
            onClick={onStopAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252a36] hover:bg-[#303646] text-gray-300 border border-[#353c4d] rounded-lg transition-colors"
          >
            <Pause size={12} />
            <span>Pausar Todos</span>
          </button>
        </div>
      </div>

      {/* Main Body with Agent Cards Grid & Active Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Grid of Agent Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e222d] border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                      : 'bg-[#16181f] border-[#262b38] hover:border-[#373e52]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.avatarColor} p-0.5 shadow-md flex items-center justify-center text-black font-bold text-sm`}>
                        <Bot size={20} className="text-black" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-100 text-sm flex items-center gap-2">
                          <span>{agent.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#2a2f3e] text-cyan-300 rounded font-mono">
                            {agent.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5 flex items-center gap-2">
                          <FolderGit2 size={11} className="text-gray-500" />
                          <span>{agent.branch}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>

                  {/* Current Task Box */}
                  <div className="mt-3 p-2.5 bg-[#12141a] rounded-lg border border-[#232734] text-xs">
                    <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                      Tarea Activa:
                    </div>
                    <p className="text-gray-200 line-clamp-2">{agent.currentTask}</p>
                  </div>

                  {/* Agent Metrics Bar */}
                  <div className="mt-3 pt-3 border-t border-[#232734] flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-gray-500" />
                        <span className="font-mono">{agent.duration}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap size={11} className="text-amber-400" />
                        <span>{agent.actionsCount} acciones</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span>CPU: {agent.cpuUsage}</span>
                      <span>RAM: {agent.memoryUsage}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail / Agent Terminal Panel */}
        <div className="w-96 bg-[#13151b] border-l border-[#232734] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#232734] bg-[#181a22] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-emerald-400" />
              <span className="font-semibold text-gray-200">
                Terminal: {selectedAgent.role} Agent
              </span>
            </div>
            <button
              onClick={() => onToggleAgent(selectedAgent.id)}
              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 rounded text-xs transition-colors"
            >
              Reiniciar Agente
            </button>
          </div>

          {/* Modified Files Section */}
          <div className="p-3 border-b border-[#232734] bg-[#14161d] space-y-1.5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Archivos Modificados ({selectedAgent.modifiedFiles.length})
            </div>
            <div className="space-y-1">
              {selectedAgent.modifiedFiles.map((file, fIdx) => (
                <div key={fIdx} className="px-2 py-1 bg-[#1a1c25] rounded font-mono text-[11px] text-cyan-300 truncate">
                  {file}
                </div>
              ))}
            </div>
          </div>

          {/* Live Agent Terminal Stream */}
          <div className="flex-1 p-4 bg-[#0e1014] font-mono text-[11px] overflow-y-auto space-y-1 text-gray-300 select-text">
            <div className="text-gray-500 mb-2">// CodeMorf Agent Isolated Sandbox v3.8</div>
            <div className="text-gray-400">// Worktree Branch: {selectedAgent.branch}</div>
            {selectedAgent.terminalLogs.map((log, lIdx) => (
              <div key={lIdx} className="leading-relaxed">
                <span className="text-cyan-500">{'>'}</span> {log}
              </div>
            ))}
            <div className="flex items-center gap-2 text-cyan-400 animate-pulse pt-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Escuchando eventos de workspace...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
