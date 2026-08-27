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
  Workflow
} from 'lucide-react';
import { AutomationTask } from '../types';

interface AutomationsCenterProps {
  automations: AutomationTask[];
  onToggleAutomation: (id: string) => void;
  onRunNow: (id: string) => void;
}

export const AutomationsCenter: React.FC<AutomationsCenterProps> = ({
  automations,
  onToggleAutomation,
  onRunNow
}) => {
  return (
    <div id="automations-center-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 rounded-lg">
            <Workflow size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Automations & CI/CD Background Agents</h2>
            <p className="text-[11px] text-gray-400">
              Disparadores automáticos nocturnos, escaneos de seguridad y generación de PRs sin intervención humana
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Crear nueva automatización')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-cyan-900/30"
          >
            <Plus size={13} />
            <span>New Automation</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map((auto) => (
            <div
              key={auto.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-md ${
                auto.enabled
                  ? 'bg-[#181a24] border-cyan-500/40 shadow-cyan-950/20'
                  : 'bg-[#14161c] border-[#252a38] opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-100 text-sm">{auto.name}</h3>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-1.5">
                      <Clock size={11} className="text-cyan-400" />
                      <span>{auto.trigger}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleAutomation(auto.id)}
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                      auto.enabled ? 'bg-cyan-500' : 'bg-[#282d3c]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        auto.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed">{auto.description}</p>
              </div>

              {/* Status & Run Now */}
              <div className="pt-3 border-t border-[#232734] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className={`w-2 h-2 rounded-full ${auto.lastStatus === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-gray-400">Última ejecución: {auto.lastRun}</span>
                </div>

                <button
                  onClick={() => onRunNow(auto.id)}
                  className="px-3 py-1 bg-[#222634] hover:bg-[#2c3246] text-cyan-300 border border-cyan-800/40 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Play size={11} className="fill-cyan-400" />
                  <span>Ejecutar Ahora</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
