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
  Sparkles
} from 'lucide-react';
import { PermissionCategory } from '../types';

interface PermissionsCenterProps {
  permissions: PermissionCategory[];
  onUpdatePermissionMode: (categoryId: string, mode: PermissionCategory['mode']) => void;
}

export const PermissionsCenter: React.FC<PermissionsCenterProps> = ({
  permissions,
  onUpdatePermissionMode
}) => {
  const [showSimulatedRequest, setShowSimulatedRequest] = useState(false);

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
    <div id="permissions-center-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-rose-950/80 text-rose-400 border border-rose-800/50 rounded-lg">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Permissions & Security Sandbox Center</h2>
            <p className="text-[11px] text-gray-400">
              Control granular de acceso al sistema de archivos, terminal, Git, base de datos y red
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulatedRequest(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg transition-colors shadow-md shadow-amber-900/30"
          >
            <ShieldAlert size={13} />
            <span>Simular Solicitud de Permiso del Agente</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissions.map((perm) => (
            <div
              key={perm.id}
              className="p-5 rounded-xl bg-[#14161c] border border-[#252a38] hover:border-[#353c4e] transition-all space-y-4 shadow-md"
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

      {/* Simulated Agent Permission Modal */}
      {showSimulatedRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#181a24] border border-[#303648] rounded-xl shadow-2xl overflow-hidden text-xs space-y-4">
            {/* Header */}
            <div className="px-5 py-4 bg-[#1f2330] border-b border-[#2d3446] flex items-center gap-3">
              <div className="p-2 bg-amber-950 text-amber-400 border border-amber-700/50 rounded-xl">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 text-sm">Solicitud de Permiso del Agente</h3>
                <p className="text-gray-400 text-xs">Backend Agent solicita ejecutar un comando en la base de datos</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-2 space-y-3">
              <div className="p-3 bg-[#111318] rounded-lg border border-[#272c3c] font-mono text-xs text-amber-300">
                $ npx drizzle-kit push --config=drizzle.config.ts
              </div>

              <p className="text-gray-300 leading-relaxed">
                Este comando aplicará las migraciones SQL a la base de datos PostgreSQL local en el puerto 5432.
              </p>
            </div>

            {/* Actions Grid */}
            <div className="px-5 py-4 bg-[#14161e] border-t border-[#292e3e] flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSimulatedRequest(false)}
                className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-lg transition-colors font-medium"
              >
                Deny
              </button>
              <button
                onClick={() => setShowSimulatedRequest(false)}
                className="px-3 py-1.5 bg-[#252a38] hover:bg-[#31374a] text-gray-200 border border-[#373e52] rounded-lg transition-colors"
              >
                Allow Once
              </button>
              <button
                onClick={() => setShowSimulatedRequest(false)}
                className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 rounded-lg transition-colors"
              >
                Allow This Session
              </button>
              <button
                onClick={() => setShowSimulatedRequest(false)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-950"
              >
                Always Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
