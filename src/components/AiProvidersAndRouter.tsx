import React, { useState } from 'react';
import { 
  Cpu, 
  ExternalLink, 
  Key, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Workflow, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { AiProviderConfig, ModelRouterRule } from '../types';

interface AiProvidersAndRouterProps {
  providers: AiProviderConfig[];
  routerRules: ModelRouterRule[];
  onToggleProvider: (id: string) => void;
}

export const AiProvidersAndRouter: React.FC<AiProvidersAndRouterProps> = ({
  providers,
  routerRules,
  onToggleProvider
}) => {
  const [activeTab, setActiveTab] = useState<'providers' | 'router'>('providers');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="ai-providers-router-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-lg">
            <Cpu size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">AI Providers & Smart Model Router</h2>
            <p className="text-[11px] text-gray-400">
              Configura CodeMorf API, Google Gemini, Grok, Anthropic y enrutamiento inteligente por tipo de tarea
            </p>
          </div>
        </div>

        {/* CodeMorf Docs link */}
        <div className="flex items-center gap-2">
          <a
            href="https://codemorf.tech/chat/docs/es/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all shadow-md shadow-cyan-950"
          >
            <Sparkles size={13} />
            <span>Documentación CodeMorf API</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-[#232734] bg-[#14161c] flex gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('providers')}
          className={`py-2.5 border-b-2 transition-colors ${
            activeTab === 'providers' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Proveedores & Modelos Conectados ({providers.length})
        </button>

        <button
          onClick={() => setActiveTab('router')}
          className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'router' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Workflow size={13} />
          <span>Reglas de Smart Model Router</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'providers' && (
          <div className="space-y-4 max-w-5xl">
            {/* CodeMorf Featured Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17263c] to-[#1a1c28] border border-cyan-500/40 shadow-xl space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-black text-base shadow-lg shadow-cyan-500/30">
                    CM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">CodeMorf Multi-Agent Cloud API</h3>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono text-[10px]">
                        Recomendado / Nativo
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs mt-0.5">
                      Orquestación de agentes con baja latencia, auto-recovery de errores y caching de contexto.
                    </p>
                  </div>
                </div>

                <a
                  href="https://codemorf.tech/chat/docs/es/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <span>Ver Guía de API</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-[#14161c] border border-[#252a38] hover:border-[#353c4e] transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-100 text-sm">{p.name}</h3>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Modelo por defecto: <span className="text-cyan-300">{p.defaultModel}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                        p.isConfigured
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                          : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}
                    >
                      {p.isConfigured ? '✓ Configurado' : 'Sin API Key'}
                    </span>
                  </div>

                  {/* Models supported */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Modelos Disponibles:</span>
                    <div className="flex flex-wrap gap-1">
                      {p.models.map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#1f232e] text-gray-300 font-mono text-[10px] rounded border border-[#2c3242]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* API Key field */}
                  <div className="pt-2 border-t border-[#232734] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px]">
                      <Key size={12} />
                      <span>{showKeys[p.id] ? p.apiKey : '••••••••••••••••••••••••'}</span>
                    </div>

                    <button
                      onClick={() => toggleShowKey(p.id)}
                      className="p-1 text-gray-500 hover:text-gray-300 rounded"
                    >
                      {showKeys[p.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'router' && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-[#14161c] border border-[#252a38] rounded-xl space-y-1">
              <h3 className="font-semibold text-gray-200 text-sm">Smart Model Router Engine</h3>
              <p className="text-gray-400 text-xs">
                Asigna automáticamente el modelo óptimo de acuerdo a la complejidad de la tarea para optimizar costo y precisión.
              </p>
            </div>

            <div className="space-y-3">
              {routerRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 bg-[#14161d] border border-[#252a38] rounded-xl flex items-center justify-between hover:border-cyan-500/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-100 text-xs">{rule.taskType}</span>
                      <span className="text-gray-500 text-[11px]">→</span>
                      <span className="font-mono text-cyan-300 font-semibold">{rule.model}</span>
                      <span className="text-[10px] text-gray-500">({rule.provider})</span>
                    </div>
                    <p className="text-gray-400 text-[11px]">{rule.reason}</p>
                  </div>

                  <span className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/40 rounded text-[10px] font-mono">
                    Activo
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
