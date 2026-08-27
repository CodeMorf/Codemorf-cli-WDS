import React, { useState } from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  CircleDot, 
  Edit3, 
  Trash2, 
  Plus, 
  Play, 
  RotateCcw, 
  FileCode2, 
  Terminal, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ImplementationPlanStep } from '../types';

interface PlanModeProps {
  steps: ImplementationPlanStep[];
  onApproveStep: (stepId: number) => void;
  onApproveAll: () => void;
  onModifyPlan: () => void;
  onCancelPlan: () => void;
}

export const PlanMode: React.FC<PlanModeProps> = ({
  steps,
  onApproveStep,
  onApproveAll,
  onModifyPlan,
  onCancelPlan
}) => {
  const [isDryRunRunning, setIsDryRunRunning] = useState(false);
  const [dryRunLogs, setDryRunLogs] = useState<string[]>([]);

  const handleSimulateDryRun = () => {
    setIsDryRunRunning(true);
    setDryRunLogs([
      '[Dry-Run] Verificando árbol de sintaxis abstracta (AST)...',
      '[Dry-Run] Simulando inserción de tablas tenant_id en server/db/schema.ts...',
      '[Dry-Run] 0 conflictos de Git detectados contra branch master.',
      '[Dry-Run] Estimación de impacto: +5 archivos, ~180 líneas modificadas.',
      '[Dry-Run] Verificación completada con éxito. Plan listo para aprobación.'
    ]);
  };

  const getActionBadge = (action: ImplementationPlanStep['action']) => {
    switch (action) {
      case 'create':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40';
      case 'modify':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/40';
      case 'delete':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/40';
      case 'test':
      case 'command':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/40';
    }
  };

  const getStatusIcon = (status: ImplementationPlanStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'in_progress':
        return <CircleDot size={16} className="text-cyan-400 animate-spin" />;
      case 'approved':
        return <CheckCircle2 size={16} className="text-cyan-400" />;
      case 'pending':
        return <CircleDot size={16} className="text-gray-600" />;
    }
  };

  return (
    <div id="plan-mode-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-950/80 text-blue-400 border border-blue-800/50 rounded-lg">
            <FolderKanban size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Implementation Plan Mode (Zero-Risk Staging)</h2>
            <p className="text-[11px] text-gray-400">
              Genera y aprueba el plan arquitectónico paso a paso antes de que los agentes toquen el código
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDryRun}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#242936] hover:bg-[#2e3546] text-gray-200 border border-[#353c4d] font-medium rounded-lg transition-colors"
          >
            <Sparkles size={13} className="text-cyan-400" />
            <span>Simular Dry-Run</span>
          </button>
          <button
            onClick={onApproveAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-cyan-900/30"
          >
            <CheckCircle2 size={13} />
            <span>Approve Plan & Ejecutar</span>
          </button>
          <button
            onClick={onModifyPlan}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252a36] hover:bg-[#303646] text-gray-300 border border-[#353c4d] rounded-lg transition-colors"
          >
            <Edit3 size={13} />
            <span>Modify</span>
          </button>
          <button
            onClick={onCancelPlan}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 rounded-lg transition-colors"
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 bg-[#1a1c25] border border-[#272c3a] rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-200 text-sm">
                Plan Activo: Migración a SaaS Multi-Tenant y Docker Compose
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">
                5 pasos secuenciales estructurados para garantizar compatibilidad hacia atrás.
              </p>
            </div>
            <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/50 rounded-full font-mono text-xs">
              Estado: Listo para aprobación
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className="p-4 rounded-xl bg-[#14161c] border border-[#252a38] hover:border-[#353c4e] transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="mt-0.5">{getStatusIcon(step.status)}</div>
                    <div>
                      <div className="font-semibold text-gray-100 text-sm flex items-center gap-2">
                        <span>Paso {step.id}: {step.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono uppercase ${getActionBadge(step.action)}`}>
                          {step.action}
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <FileCode2 size={12} />
                        <span>{step.fileTarget}</span>
                      </div>
                    </div>
                  </div>

                  {step.status === 'pending' && (
                    <button
                      onClick={() => onApproveStep(step.id)}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 rounded text-xs transition-colors font-medium"
                    >
                      Aprobar este paso
                    </button>
                  )}
                </div>

                <p className="text-gray-300 text-xs leading-relaxed pl-7">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Dry-Run / Impact Simulator Terminal */}
        <div className="w-80 bg-[#12141a] border-l border-[#232734] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#232734] bg-[#181a22] flex items-center gap-2">
            <Terminal size={14} className="text-cyan-400" />
            <span className="font-semibold text-gray-200">Terminal de Simulación</span>
          </div>

          <div className="flex-1 p-4 bg-[#0e1014] font-mono text-[11px] overflow-y-auto space-y-1.5 text-gray-300 select-text">
            <div className="text-gray-500">// CodeMorf Plan Dry-Run Engine v3.8</div>
            {dryRunLogs.length === 0 ? (
              <div className="text-gray-600 italic py-6 text-center">
                Haz clic en "Simular Dry-Run" para verificar impactos antes de aplicar cambios.
              </div>
            ) : (
              dryRunLogs.map((log, lIdx) => (
                <div key={lIdx} className="leading-relaxed text-emerald-400">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
