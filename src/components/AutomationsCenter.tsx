import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  GitBranch, 
  Workflow,
  Terminal,
  X,
  Check,
  CalendarDays,
  FileCode,
  Layers,
  Activity
} from 'lucide-react';
import { AutomationJob } from '../types';

interface AutomationsCenterProps {
  automations: (AutomationJob | any)[];
  onToggleAutomation: (id: string) => void;
  onRunNow: (id: string) => void;
  onCreateAutomation?: (newJob: Partial<AutomationJob>) => void;
}

export const AutomationsCenter: React.FC<AutomationsCenterProps> = ({
  automations,
  onToggleAutomation,
  onRunNow,
  onCreateAutomation
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const [viewLogsJob, setViewLogsJob] = useState<any | null>(null);

  // Form State for new automation
  const [newName, setNewName] = useState('');
  const [newSchedule, setNewSchedule] = useState('Cada noche a las 02:00 AM (0 2 * * *)');
  const [newTriggerType, setNewTriggerType] = useState<'cron' | 'interval' | 'git_hook' | 'manual'>('cron');
  const [newTargetAgent, setNewTargetAgent] = useState('Frontend & QA Agent');
  const [newDescription, setNewDescription] = useState('');
  const [newPrompt, setNewPrompt] = useState('Ejecutar build de producción, correr tests Vitest y verificar migraciones.');

  const handleRun = (id: string) => {
    setRunningJobId(id);
    onRunNow(id);
    setTimeout(() => {
      setRunningJobId(null);
    }, 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (onCreateAutomation) {
      onCreateAutomation({
        name: newName.trim(),
        schedule: newSchedule,
        trigger: newSchedule,
        triggerType: newTriggerType,
        targetAgent: newTargetAgent,
        description: newDescription || 'Automatización programada en segundo plano',
        actionPrompt: newPrompt,
        enabled: true,
        nextRun: 'Próxima ejecución programada',
        lastStatus: 'idle',
        lastRun: 'Nunca ejecutado',
        executionLogs: [
          `[Schedule] Creado disparador ${newSchedule}`,
          `[Agent] Asignado a ${newTargetAgent}`
        ]
      });
    }

    setShowCreateModal(false);
    setNewName('');
    setNewDescription('');
  };

  return (
    <div id="automations-center-view" className="flex-1 flex flex-col overflow-hidden bg-[#14151c] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-14 px-6 border-b border-[#232734] bg-[#171922] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 rounded-xl shadow-inner">
            <Workflow size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-100">Programación & Automatizaciones CI/CD en Windows</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono text-[10px]">
                Cron & Background Jobs
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Disparadores automáticos por cron, intervalos o webhooks de Git sin supervisión manual.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors shadow-md shadow-cyan-950"
          >
            <Plus size={13} />
            <span>Nueva Tarea Programada</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map((auto) => {
            const isRunning = runningJobId === auto.id;
            return (
              <div
                key={auto.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-md ${
                  auto.enabled
                    ? 'bg-[#181a24] border-cyan-500/40 shadow-cyan-950/20'
                    : 'bg-[#14161c] border-[#252a38] opacity-70'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-100 text-sm">{auto.name}</h3>
                        {auto.triggerType && (
                          <span className="px-2 py-0.5 rounded-md bg-[#1f2330] text-cyan-300 border border-cyan-800/40 text-[9px] font-mono uppercase">
                            {auto.triggerType}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1.5">
                        <Clock size={11} className="text-cyan-400" />
                        <span>{auto.schedule || auto.trigger}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleAutomation(auto.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        auto.enabled ? 'bg-cyan-500' : 'bg-[#282d3c]'
                      }`}
                      title={auto.enabled ? 'Pausar automatización' : 'Habilitar automatización'}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          auto.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">{auto.description}</p>

                  {auto.targetAgent && (
                    <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                      <Bot size={12} className="text-cyan-400" />
                      <span>Agente: {auto.targetAgent}</span>
                    </div>
                  )}
                </div>

                {/* Status & Run Now */}
                <div className="pt-3 border-t border-[#232734] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${auto.lastStatus === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="text-gray-400">
                      {auto.lastRun ? `Última: ${auto.lastRun}` : 'Listo para ejecutar'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {auto.executionLogs && auto.executionLogs.length > 0 && (
                      <button
                        onClick={() => setViewLogsJob(auto)}
                        className="px-2.5 py-1 bg-[#191d29] hover:bg-[#222838] text-gray-300 rounded-lg text-xs font-mono transition-colors"
                      >
                        Logs
                      </button>
                    )}

                    <button
                      onClick={() => handleRun(auto.id)}
                      disabled={isRunning}
                      className="px-3 py-1 bg-[#222634] hover:bg-[#2c3246] text-cyan-300 border border-cyan-800/40 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      {isRunning ? (
                        <RotateCw size={11} className="animate-spin text-cyan-400" />
                      ) : (
                        <Play size={11} className="fill-cyan-400 text-cyan-400" />
                      )}
                      <span>{isRunning ? 'Ejecutando...' : 'Ejecutar Ahora'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Automation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#161824] border border-[#2c3246] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#252a3a] pb-3">
              <div className="flex items-center gap-2">
                <Workflow size={18} className="text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Programar Nueva Automatización</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] text-gray-300 font-semibold block mb-1">Nombre de la Automatización:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Escaneo nocturno de seguridad y tests"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101218] border border-[#272c3e] focus:border-cyan-500 rounded-xl text-gray-200 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-300 font-semibold block mb-1">Tipo de Disparador:</label>
                  <select
                    value={newTriggerType}
                    onChange={(e: any) => setNewTriggerType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#101218] border border-[#272c3e] rounded-xl text-gray-200 text-xs outline-none"
                  >
                    <option value="cron">Cron Programado (Horario)</option>
                    <option value="interval">Intervalo Recurrente</option>
                    <option value="git_hook">Git Push / PR Trigger</option>
                    <option value="manual">Bajo Demanda (Manual)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 font-semibold block mb-1">Agente Responsable:</label>
                  <select
                    value={newTargetAgent}
                    onChange={(e) => setNewTargetAgent(e.target.value)}
                    className="w-full px-3 py-2 bg-[#101218] border border-[#272c3e] rounded-xl text-gray-200 text-xs outline-none"
                  >
                    <option value="Frontend & QA Agent">Frontend & QA Agent</option>
                    <option value="Backend Database Agent">Backend Database Agent</option>
                    <option value="Security Auditor Agent">Security Auditor Agent</option>
                    <option value="CodeMorf Orchestrator">CodeMorf Orchestrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-300 font-semibold block mb-1">Expresión de Horario / Frecuencia:</label>
                <input
                  type="text"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101218] border border-[#272c3e] rounded-xl text-gray-200 font-mono text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 font-semibold block mb-1">Instrucción / Prompt para el Agente:</label>
                <textarea
                  rows={3}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101218] border border-[#272c3e] rounded-xl text-gray-200 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#232734]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#222634] hover:bg-[#2b3144] text-gray-300 rounded-xl text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-cyan-950"
                >
                  Guardar y Activar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Execution Logs Drawer Modal */}
      {viewLogsJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141620] border border-[#2a2f42] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#252a38] pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Logs de Ejecución: {viewLogsJob.name}</h3>
              </div>
              <button onClick={() => setViewLogsJob(null)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-[#0d0e14] rounded-xl border border-[#202434] font-mono text-xs text-gray-300 space-y-1.5 max-h-60 overflow-y-auto">
              {(viewLogsJob.executionLogs || []).map((log: string, idx: number) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-cyan-400">{log}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewLogsJob(null)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
