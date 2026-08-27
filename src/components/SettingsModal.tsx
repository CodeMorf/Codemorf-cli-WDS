import React, { useState } from 'react';
import {
  X,
  Settings as SettingsIcon,
  Sparkles,
  Shield,
  Terminal,
  Cpu,
  Monitor,
  Key,
  FolderGit2,
  Check,
  RotateCcw
} from 'lucide-react';
import { ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'models' | 'permissions' | 'shortcuts' | 'about'>('general');
  const [autoRunCommands, setAutoRunCommands] = useState(false);
  const [streamSpeed, setStreamSpeed] = useState('ultra-fast');
  const [soundEffects, setSoundEffects] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#171922] border border-[#2d3242] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-xs">
        {/* Header */}
        <div className="h-12 px-5 bg-[#1b1e28] border-b border-[#2a2f3e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <SettingsIcon size={16} className="text-cyan-400" />
            <h3 className="font-semibold text-sm text-gray-100">Ajustes de CodeMorf CLI</h3>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/40 px-1.5 py-0.5 rounded font-mono">
              v3.8.0-win64
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <X size={16} />
          </button>
        </div>

        {/* Body with Left Nav & Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation */}
          <div className="w-48 bg-[#14151c] border-r border-[#242835] p-2 space-y-1 shrink-0">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                activeTab === 'general' ? 'bg-cyan-950/80 text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
              }`}
            >
              <Monitor size={14} className="text-cyan-400" />
              <span>General & Tema</span>
            </button>

            <button
              onClick={() => setActiveTab('models')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                activeTab === 'models' ? 'bg-cyan-950/80 text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
              }`}
            >
              <Cpu size={14} className="text-purple-400" />
              <span>Modelos & Motor</span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                activeTab === 'permissions' ? 'bg-cyan-950/80 text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
              }`}
            >
              <Shield size={14} className="text-rose-400" />
              <span>Seguridad & Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                activeTab === 'shortcuts' ? 'bg-cyan-950/80 text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
              }`}
            >
              <Terminal size={14} className="text-emerald-400" />
              <span>Atajos de Teclado</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                activeTab === 'about' ? 'bg-cyan-950/80 text-cyan-300 font-medium' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
              }`}
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Acerca de</span>
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-gray-300">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-100 text-sm mb-1">Apariencia y Sistema</h4>
                  <p className="text-[11px] text-gray-400">Personaliza la interfaz de escritorio de Windows para CodeMorf.</p>
                </div>

                <div className="p-3 bg-[#13151b] border border-[#272b38] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Tema de Interfaz</div>
                    <div className="text-[11px] text-gray-400">Alterna entre modo oscuro profundo (Codex Dark) y modo claro.</div>
                  </div>
                  <button
                    onClick={onToggleTheme}
                    className="px-3 py-1.5 bg-[#222634] hover:bg-[#2c3244] border border-[#333a4d] rounded-lg font-medium text-gray-200"
                  >
                    {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                  </button>
                </div>

                <div className="p-3 bg-[#13151b] border border-[#272b38] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Efectos Sonoros y Loader Grok</div>
                    <div className="text-[11px] text-gray-400">Animación visual interactiva en tiempo real al generar respuestas.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEffects}
                    onChange={(e) => setSoundEffects(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-[#222634] border-gray-700 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-[#13151b] border border-[#272b38] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Velocidad de Streaming de Tokens</div>
                    <div className="text-[11px] text-gray-400">Latencia de renderizado de código generado.</div>
                  </div>
                  <select
                    value={streamSpeed}
                    onChange={(e) => setStreamSpeed(e.target.value)}
                    className="bg-[#222634] border border-[#333a4d] text-gray-200 rounded-lg px-2.5 py-1 outline-none text-xs"
                  >
                    <option value="ultra-fast">Ultra Rápido (2026 Engine)</option>
                    <option value="balanced">Balanceado (Animación fluida)</option>
                    <option value="raw">Instantáneo (Sin delays)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-100 text-sm mb-1">Configuración del Motor AI</h4>
                  <p className="text-[11px] text-gray-400">Modelo predeterminado y enrutamiento inteligente por tipo de tarea.</p>
                </div>

                <div className="p-3 bg-[#13151b] border border-[#272b38] rounded-xl space-y-2">
                  <div className="font-medium text-gray-200">Proveedor Principal Recomendado</div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-xs">
                    <Sparkles size={14} className="text-cyan-400" />
                    <span>CodeMorf API 2026 — Modelo 5.6 Luna Ultra Alto Coder</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Optimizado para soporte multihilo, edición de hasta 40 archivos concurrentes y sandbox local.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-100 text-sm mb-1">Sandbox y Permisos</h4>
                  <p className="text-[11px] text-gray-400">Límites de ejecución automática y seguridad del sistema de archivos.</p>
                </div>

                <div className="p-3 bg-[#13151b] border border-[#272b38] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-200">Auto-ejecutar comandos terminal seguros</div>
                    <div className="text-[11px] text-gray-400">Permite a los agentes correr `npm test`, `git status` sin pedir confirmación manual.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRunCommands}
                    onChange={(e) => setAutoRunCommands(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-[#222634] border-gray-700 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-100 text-sm">Atajos de Teclado Globales</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#13151b] border border-[#272b38] flex items-center justify-between">
                    <span>Command Palette / Buscar</span>
                    <kbd className="bg-[#222634] px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300">Ctrl+K</kbd>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#13151b] border border-[#272b38] flex items-center justify-between">
                    <span>Nuevo Chat de Agente</span>
                    <kbd className="bg-[#222634] px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300">Ctrl+N</kbd>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#13151b] border border-[#272b38] flex items-center justify-between">
                    <span>Alternar Navegador</span>
                    <kbd className="bg-[#222634] px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300">Alt+5</kbd>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#13151b] border border-[#272b38] flex items-center justify-between">
                    <span>Terminal Integrada</span>
                    <kbd className="bg-[#222634] px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300">Alt+7</kbd>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-100">CodeMorf CLI 2026</h3>
                  <p className="text-gray-400 text-[11px] mt-1">
                    Plataforma de desarrollo y orquestación multi-agente para Windows Desktop.
                  </p>
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  Versión: 3.8.0 • Build 2026.08 • Protocolo MCP v1.2
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 px-5 bg-[#14151d] border-t border-[#252a38] flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#222634] hover:bg-[#2a3040] text-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-900/40"
          >
            {savedSuccess ? (
              <>
                <Check size={14} className="text-emerald-300" />
                <span>Guardado</span>
              </>
            ) : (
              <span>Guardar Cambios</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
