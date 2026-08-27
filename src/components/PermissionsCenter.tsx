import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Terminal, 
  FolderKanban, 
  GitBranch, 
  Database, 
  Globe, 
  Wifi, 
  Check, 
  X, 
  AlertTriangle, 
  Lock, 
  Unlock,
  Sparkles,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { PermissionCategory, PermissionLevel } from '../types';

interface PermissionsCenterProps {
  permissions: PermissionCategory[];
  onUpdatePermissionMode: (categoryId: string, mode: PermissionCategory['mode']) => void;
  globalPermissionLevel?: PermissionLevel;
  onUpdateGlobalPermissionLevel?: (level: PermissionLevel) => void;
}

export const PermissionsCenter: React.FC<PermissionsCenterProps> = ({
  permissions,
  onUpdatePermissionMode,
  globalPermissionLevel = 'ask_confirmation',
  onUpdateGlobalPermissionLevel
}) => {
  const [showSimulatedRequest, setShowSimulatedRequest] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<PermissionLevel>(globalPermissionLevel);

  const handleSelectLevel = (level: PermissionLevel) => {
    setSelectedLevel(level);
    if (onUpdateGlobalPermissionLevel) {
      onUpdateGlobalPermissionLevel(level);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderKanban':
        return <FolderKanban size={18} className="text-cyan-400" />;
      case 'Terminal':
        return <Terminal size={18} className="text-emerald-400" />;
      case 'GitBranch':
        return <GitBranch size={18} className="text-purple-400" />;
      case 'Database':
        return <Database size={18} className="text-amber-400" />;
      case 'Globe':
        return <Globe size={18} className="text-sky-400" />;
      case 'Wifi':
        return <Wifi size={18} className="text-rose-400" />;
      default:
        return <Shield size={18} className="text-cyan-400" />;
    }
  };

  const getModeColor = (mode: PermissionCategory['mode']) => {
    switch (mode) {
      case 'Always Allow':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40';
      case 'Allow This Session':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/40';
      case 'Ask Every Time':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/40';
      case 'Always Deny':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/40';
    }
  };

  return (
    <div id="permissions-center-view" className="flex-1 flex flex-col overflow-hidden bg-[#14151c] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-14 px-6 border-b border-[#232734] bg-[#171922] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-950/80 text-rose-400 border border-rose-800/50 rounded-xl shadow-inner">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-100">Centro de Seguridad & 3 Niveles de Permisos</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono text-[10px]">
                Windows Sandbox Protection
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Controla con precisión el grado de autonomía de los agentes sobre el disco local, terminal PowerShell y red.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulatedRequest(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg transition-colors shadow-md shadow-amber-900/30"
          >
            <ShieldAlert size={13} />
            <span>Simular Diálogo de Aprobación</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl">
        {/* 3 Tipos de Permisos Principales */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-cyan-400" />
                <span>3 Tipos de Permiso de los Agentes</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Elige el nivel de confianza global o aplica por proyecto individual.
              </p>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">Modo Activo: {selectedLevel}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Solo Lectura */}
            <div
              onClick={() => handleSelectLevel('read_only')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                selectedLevel === 'read_only'
                  ? 'bg-[#152033] border-blue-500/80 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500'
                  : 'bg-[#151720] border-[#252a38] hover:border-blue-900/60'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-blue-950/80 text-blue-400 border border-blue-800/50 rounded-xl">
                    <Lock size={18} />
                  </div>
                  {selectedLevel === 'read_only' && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold text-[10px]">
                      ACTIVO
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">1. Solo Lectura</h4>
                  <p className="text-[11px] text-blue-200/70 font-mono mt-0.5">Modo Análisis / Seguro</p>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed">
                  El agente puede leer código fuente, responder preguntas y buscar archivos. <strong>No puede modificar archivos ni ejecutar comandos en la terminal de Windows.</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-blue-900/30 text-[10px] text-blue-300 font-mono flex items-center gap-1">
                <Check size={12} />
                <span>Zero Write Risk (Seguro)</span>
              </div>
            </div>

            {/* 2. Confirmación Previa */}
            <div
              onClick={() => handleSelectLevel('ask_confirmation')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                selectedLevel === 'ask_confirmation'
                  ? 'bg-[#152833] border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
                  : 'bg-[#151720] border-[#252a38] hover:border-cyan-900/60'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-xl">
                    <Shield size={18} />
                  </div>
                  {selectedLevel === 'ask_confirmation' && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black font-bold text-[10px]">
                      ACTIVO (Recomendado)
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">2. Confirmar Previo</h4>
                  <p className="text-[11px] text-cyan-200/70 font-mono mt-0.5">Modo Semi-Autónomo</p>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed">
                  El agente redacta planes y diffs, pero <strong>solicita confirmación interactiva en pantalla antes de escribir cambios en disco o correr scripts</strong>.
                </p>
              </div>

              <div className="pt-2 border-t border-cyan-900/30 text-[10px] text-cyan-300 font-mono flex items-center gap-1">
                <Check size={12} />
                <span>Control Humano en el Bucle</span>
              </div>
            </div>

            {/* 3. Acceso Total Autónomo */}
            <div
              onClick={() => handleSelectLevel('full_access')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                selectedLevel === 'full_access'
                  ? 'bg-[#291e17] border-amber-500/80 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500'
                  : 'bg-[#151720] border-[#252a38] hover:border-amber-900/60'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-amber-950/80 text-amber-400 border border-amber-800/50 rounded-xl">
                    <Zap size={18} />
                  </div>
                  {selectedLevel === 'full_access' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px]">
                      ACTIVO
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">3. Acceso Total</h4>
                  <p className="text-[11px] text-amber-200/70 font-mono mt-0.5">Modo Agente Autónomo</p>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed">
                  El agente tiene <strong>permiso continuo para crear archivos, ejecutar compilaciones y comandos en Windows PowerShell</strong> sin detenerse a pedir confirmación.
                </p>
              </div>

              <div className="pt-2 border-t border-amber-900/30 text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <Zap size={12} />
                <span>Máxima Velocidad de Desarrollo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Granular Sub-system Permissions */}
        <div className="space-y-3 pt-4 border-t border-[#232734]">
          <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
            <ShieldCheck size={14} className="text-rose-400" />
            <span>Permisos Granulares por Subsistema</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.map((perm) => (
              <div
                key={perm.id}
                className="p-5 rounded-xl bg-[#161822] border border-[#252a38] hover:border-[#353c4e] transition-all space-y-4 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#1c1f28] rounded-xl border border-[#2c3242]">
                      {getIcon(perm.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100 text-sm">{perm.name}</h3>
                      <p className="text-gray-400 text-xs mt-0.5">{perm.description}</p>
                    </div>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="space-y-1.5 pt-2 border-t border-[#232734]">
                  <label className="text-gray-400 text-[11px] font-medium">Nivel de Acceso:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Ask Every Time', 'Allow This Session', 'Always Allow', 'Always Deny'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => onUpdatePermissionMode(perm.id, mode)}
                        className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-medium transition-all ${
                          perm.mode === mode
                            ? getModeColor(mode)
                            : 'bg-[#1a1c24] border-[#292e3c] text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allowed Patterns */}
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] uppercase font-semibold text-gray-500">Patrones Permitidos:</span>
                  <div className="flex flex-wrap gap-1">
                    {perm.allowedPatterns.map((pat, pIdx) => (
                      <span key={pIdx} className="px-2 py-0.5 bg-[#1f232e] text-cyan-300 font-mono text-[10px] rounded border border-[#2c3242]">
                        {pat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Agent Permission Modal */}
      {showSimulatedRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#181a24] border border-[#303648] rounded-2xl shadow-2xl overflow-hidden text-xs space-y-4">
            {/* Header */}
            <div className="px-5 py-4 bg-[#1f2330] border-b border-[#2d3446] flex items-center gap-3">
              <div className="p-2 bg-amber-950 text-amber-400 border border-amber-700/50 rounded-xl">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 text-sm">Solicitud de Permiso del Agente (Nivel 2)</h3>
                <p className="text-gray-400 text-xs">Backend Agent solicita ejecutar comando en terminal de Windows</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-2 space-y-3">
              <div className="p-3 bg-[#111318] rounded-xl border border-[#272c3c] font-mono text-xs text-amber-300">
                PS C:\Users\Kitgiz\Projects\ErogaAI&gt; npm install drizzle-orm pg --save
              </div>

              <p className="text-gray-300 leading-relaxed">
                Este comando descargará e instalará los paquetes ORM en el proyecto local. ¿Deseas autorizar la ejecución?
              </p>
            </div>

            {/* Actions Grid */}
            <div className="px-5 py-4 bg-[#14161e] border-t border-[#292e3e] flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSimulatedRequest(false)}
                className="px-3.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-lg transition-colors font-medium"
              >
                Rechazar
              </button>
              <button
                onClick={() => setShowSimulatedRequest(false)}
                className="px-3.5 py-1.5 bg-[#252a38] hover:bg-[#31374a] text-gray-200 border border-[#373e52] rounded-lg transition-colors"
              >
                Permitir una vez
              </button>
              <button
                onClick={() => setShowSimulatedRequest(false)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-950"
              >
                Permitir Siempre en este Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
