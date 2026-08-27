import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  CircleDot, 
  Clock, 
  Terminal, 
  FileCode2, 
  Search, 
  Globe, 
  ShieldCheck,
  Cpu,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityTimelineItem } from '../types';

interface GrokCodexLoaderProps {
  isRunning: boolean;
  workingTimeText?: string;
  elapsedSeconds?: number;
  currentStepIndex?: number;
  onStop?: () => void;
  timelineItems?: ActivityTimelineItem[];
  customMessage?: string;
}

export const GrokCodexLoader: React.FC<GrokCodexLoaderProps> = ({
  isRunning,
  workingTimeText = 'Ha trabajado durante 10s',
  elapsedSeconds = 10,
  currentStepIndex = 2,
  onStop,
  timelineItems = [],
  customMessage
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [seconds, setSeconds] = useState(elapsedSeconds);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(elapsedSeconds);
    }
    return () => clearInterval(interval);
  }, [isRunning, elapsedSeconds]);

  const defaultSteps = [
    { label: 'Analizar prompt e intenciones del usuario', icon: Sparkles, status: 'completed', duration: '180ms' },
    { label: 'Lectura de archivos de workspace: src/auth/login.ts, .env.example', icon: FileCode2, status: 'completed', duration: '340ms' },
    { label: 'Búsqueda contextual de símbolos authenticateUser y JWT', icon: Search, status: isRunning ? 'active' : 'completed', duration: '120ms' },
    { label: 'Aplicar diff quirúrgico en 14 archivos de backend y UI', icon: Terminal, status: isRunning ? 'active' : 'completed', duration: '520ms' },
    { label: 'Ejecutar suite Vitest: 27 pruebas superadas en 820ms', icon: CheckCircle2, status: isRunning ? 'pending' : 'completed', duration: '820ms' },
    { label: 'Validar renderizado en navegador integrado y preview local', icon: Globe, status: isRunning ? 'pending' : 'completed', duration: '410ms' }
  ];

  return (
    <div className="my-3 max-w-2xl rounded-xl border border-[#2b303d] bg-[#16181e]/90 overflow-hidden shadow-lg backdrop-blur-md transition-all">
      {/* Header status bar matching Codex */}
      <div 
        className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] select-none border-b border-[#232732]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* Codex & Grok glowing animated wave or status badge */}
          {isRunning ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40">
              <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                <span className="w-1 bg-cyan-400 rounded-full animate-grok-wave-1 h-3" />
                <span className="w-1 bg-sky-400 rounded-full animate-grok-wave-2 h-4" />
                <span className="w-1 bg-blue-500 rounded-full animate-grok-wave-3 h-2.5" />
                <span className="w-1 bg-indigo-400 rounded-full animate-grok-wave-4 h-3.5" />
                <span className="w-1 bg-cyan-300 rounded-full animate-grok-wave-5 h-2" />
              </div>
              <span className="text-[11px] font-medium text-cyan-300 tracking-tight">
                Pensando y ejecutando acciones...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Clock size={13} className="text-gray-400" />
              <span className="font-medium text-gray-300">
                {isRunning ? `Trabajando... (${seconds}s)` : `Ha trabajado durante ${seconds}s`}
              </span>
            </div>
          )}

          {customMessage && (
            <span className="text-xs text-gray-400 italic truncate max-w-xs">
              {customMessage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isRunning && onStop && (
            <button
              id="stop-agent-execution-btn"
              onClick={(e) => {
                e.stopPropagation();
                onStop();
              }}
              className="flex items-center gap-1 px-2 py-0.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 rounded text-[11px] font-medium transition-colors"
            >
              <Square size={10} className="fill-rose-400" />
              <span>Detener</span>
            </button>
          )}

          <div className="text-gray-400 hover:text-white transition-colors p-0.5">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </div>
      </div>

      {/* Expandable Execution Process & Reasoning Steps */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 bg-[#12141a]/60 space-y-2.5 text-xs border-t border-[#1e222c]"
          >
            {/* Grok glowing linear shimmer indicator when running */}
            {isRunning && (
              <div className="w-full h-1 bg-[#1a1e28] rounded-full overflow-hidden relative">
                <div className="absolute inset-0 animate-codex-shimmer" />
              </div>
            )}

            <div className="space-y-2 pt-1">
              {defaultSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isStepActive = isRunning && idx === currentStepIndex;
                const isStepDone = !isRunning || idx < currentStepIndex;

                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-2.5 p-1.5 rounded-lg transition-colors ${
                      isStepActive 
                        ? 'bg-cyan-950/40 border border-cyan-800/40 text-cyan-200' 
                        : isStepDone 
                          ? 'text-gray-300 hover:bg-white/[0.02]' 
                          : 'text-gray-500 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isStepActive ? (
                        <div className="relative flex items-center justify-center">
                          <CircleDot size={13} className="text-cyan-400 animate-spin" />
                          <span className="absolute w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse-ring" />
                        </div>
                      ) : isStepDone ? (
                        <CheckCircle2 size={13} className="text-emerald-400" />
                      ) : (
                        <CircleDot size={13} className="text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isStepActive ? 'text-cyan-300' : ''}`}>
                          {step.label}
                        </span>
                        {step.duration && (
                          <span className="text-[10px] font-mono text-gray-500 ml-2 shrink-0">
                            {step.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro execution telemetry stats */}
            <div className="pt-2 mt-2 border-t border-[#1f2430] flex items-center justify-between text-[10px] text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Cpu size={10} className="text-cyan-400" />
                  <span>Modelo: CodeMorf Ultra Coder 2026</span>
                </span>
                <span>•</span>
                <span>Contexto: 18.4k tokens</span>
              </div>
              <span className="text-emerald-400 font-mono">0 errores detectados</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
