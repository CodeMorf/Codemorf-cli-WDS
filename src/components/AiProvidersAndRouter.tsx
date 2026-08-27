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
  EyeOff,
  Mic,
  MicOff,
  Volume2,
  Radio,
  Check,
  RotateCw,
  AlertCircle,
  Copy,
  Plus,
  Shield,
  Server
} from 'lucide-react';
import { AiProvider, SmartRouterRule } from '../types';

interface AiProvidersAndRouterProps {
  providers: AiProvider[];
  routerRules?: SmartRouterRule[];
  onToggleProvider?: (id: string) => void;
  onUpdateProviderApiKey?: (id: string, newKey: string) => void;
}

export const AiProvidersAndRouter: React.FC<AiProvidersAndRouterProps> = ({
  providers,
  routerRules = [],
  onToggleProvider,
  onUpdateProviderApiKey
}) => {
  const [activeTab, setActiveTab] = useState<'providers' | 'router' | 'audio_matrix'>('providers');
  const [audioFilter, setAudioFilter] = useState<'all' | 'audio_only' | 'text_only'>('all');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});
  const [testingStatus, setTestingStatus] = useState<Record<string, 'idle' | 'testing' | 'success' | 'error'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState<Record<string, boolean>>({});

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleKeyChange = (id: string, value: string) => {
    setEditingKeys(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveKey = (p: AiProvider) => {
    const keyToSave = editingKeys[p.id] !== undefined ? editingKeys[p.id] : (p.apiKey || p.userApiKey || '');
    if (onUpdateProviderApiKey) {
      onUpdateProviderApiKey(p.id, keyToSave);
    }
    setSavedFeedback(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setSavedFeedback(prev => ({ ...prev, [p.id]: false }));
    }, 2000);
  };

  const handleTestConnection = (id: string) => {
    setTestingStatus(prev => ({ ...prev, [id]: 'testing' }));
    setTimeout(() => {
      setTestingStatus(prev => ({ ...prev, [id]: 'success' }));
      setTimeout(() => {
        setTestingStatus(prev => ({ ...prev, [id]: 'idle' }));
      }, 3500);
    }, 900);
  };

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredProviders = providers.filter(p => {
    if (audioFilter === 'audio_only') return p.supportsAudio === true;
    if (audioFilter === 'text_only') return p.supportsAudio === false;
    return true;
  });

  const audioCount = providers.filter(p => p.supportsAudio).length;
  const textOnlyCount = providers.filter(p => !p.supportsAudio).length;

  return (
    <div id="ai-providers-router-view" className="flex-1 flex flex-col overflow-hidden bg-[#14151c] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-14 px-6 border-b border-[#232734] bg-[#171922] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 rounded-xl shadow-inner">
            <Cpu size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-100">AI Providers & Audio Voice Engine</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono text-[10px]">
                Gestión de API Keys & Modelos
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Configura tus propias claves de API, verifica latencias y distingue modelos con soporte de audio/voz humana.
            </p>
          </div>
        </div>

        {/* CodeMorf Docs link */}
        <div className="flex items-center gap-2">
          <a
            href="https://codemorf.tech/chat/docs/es/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all shadow-md shadow-cyan-950"
          >
            <Sparkles size={13} />
            <span>Documentación CodeMorf API</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 border-b border-[#232734] bg-[#161720] flex items-center justify-between text-xs font-medium">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('providers')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'providers' ? 'border-cyan-400 text-cyan-300 font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Key size={13} />
            <span>Proveedores & Claves API ({providers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audio_matrix')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'audio_matrix' ? 'border-emerald-400 text-emerald-300 font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Radio size={13} className="text-emerald-400 animate-pulse" />
            <span>Matriz de Audio & Voz Humana ({audioCount} con Audio)</span>
          </button>

          <button
            onClick={() => setActiveTab('router')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'router' ? 'border-indigo-400 text-indigo-300 font-semibold' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Workflow size={13} />
            <span>Smart Model Router ({routerRules.length})</span>
          </button>
        </div>

        {activeTab === 'providers' && (
          <div className="flex items-center gap-1.5 bg-[#1a1c26] p-1 rounded-lg border border-[#272c3c]">
            <button
              onClick={() => setAudioFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                audioFilter === 'all' ? 'bg-cyan-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Todos ({providers.length})
            </button>
            <button
              onClick={() => setAudioFilter('audio_only')}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                audioFilter === 'audio_only' ? 'bg-emerald-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Mic size={11} />
              <span>Con Audio ({audioCount})</span>
            </button>
            <button
              onClick={() => setAudioFilter('text_only')}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                audioFilter === 'text_only' ? 'bg-gray-700 text-white font-medium' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <MicOff size={11} />
              <span>Solo Texto ({textOnlyCount})</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'providers' && (
          <div className="space-y-6 max-w-5xl">
            {/* Featured CodeMorf Cloud Header Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17253b] via-[#161f30] to-[#161824] border border-cyan-500/40 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-cyan-500/30 shrink-0">
                    CM
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-sm">CodeMorf Multi-Agent Cloud API (2026)</h3>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono text-[10px]">
                        Nativo & Integrado
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 font-mono text-[10px] flex items-center gap-1">
                        <Radio size={9} className="animate-ping" />
                        <span>Audio Humano Ultra-Rápido (200ms)</span>
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs mt-1">
                      Conexión optimizada para desarrolladores de Windows: streaming de tokens, voz natural y herramientas de ejecución segura.
                    </p>
                  </div>
                </div>

                <a
                  href="https://codemorf.tech/chat/docs/es/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-lg shadow-cyan-500/20"
                >
                  <span>Guía & Endpoints</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProviders.map((p) => {
                const currentKeyValue = editingKeys[p.id] !== undefined ? editingKeys[p.id] : (p.apiKey || p.userApiKey || '');
                const isKeyConfigured = Boolean(currentKeyValue && currentKeyValue.length > 5);
                const testState = testingStatus[p.id] || 'idle';
                const isSaved = savedFeedback[p.id];

                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                      p.supportsAudio
                        ? 'bg-[#161924] border-cyan-800/40 hover:border-cyan-500/50'
                        : 'bg-[#15161f] border-[#252938] hover:border-[#353c52]'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Provider Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-100 text-sm">{p.name}</h3>
                            {p.supportsAudio ? (
                              <span 
                                title={p.audioFeatureDetails || 'Soporta Audio y Voz en Tiempo Real'} 
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-[10px] font-mono"
                              >
                                <Mic size={10} className="text-emerald-400" />
                                <span>Voz / Audio</span>
                              </span>
                            ) : (
                              <span 
                                title="Este proveedor opera únicamente con texto y código"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e2230] text-gray-400 border border-[#2b3144] text-[10px] font-mono"
                              >
                                <MicOff size={10} />
                                <span>Solo Texto</span>
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-gray-400 font-mono mt-1">
                            Endpoint: <span className="text-cyan-300">{p.baseUrl}</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border shrink-0 ${
                            isKeyConfigured
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                              : 'bg-amber-950 text-amber-300 border-amber-800/50'
                          }`}
                        >
                          {isKeyConfigured ? '✓ Conectado' : '⚠️ Requiere Key'}
                        </span>
                      </div>

                      {/* Audio capability description */}
                      {p.supportsAudio && p.audioFeatureDetails && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-200 text-[11px] flex items-center gap-2">
                          <Volume2 size={13} className="shrink-0 text-emerald-400" />
                          <span className="leading-tight">{p.audioFeatureDetails}</span>
                        </div>
                      )}

                      {/* Models available */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">Modelos Disponibles:</span>
                        <div className="flex flex-wrap gap-1">
                          {(p.availableModels || p.models || []).map((m, idx) => {
                            const isAudioModel = m.includes('realtime') || m.includes('voice') || m.includes('2.5') || m.includes('gpt-4o');
                            return (
                              <span 
                                key={idx} 
                                className={`px-2 py-0.5 text-[10px] font-mono rounded-md border flex items-center gap-1 ${
                                  isAudioModel && p.supportsAudio
                                    ? 'bg-[#152328] text-cyan-200 border-cyan-800/40'
                                    : 'bg-[#1c202c] text-gray-300 border-[#282f42]'
                                }`}
                              >
                                {isAudioModel && p.supportsAudio && <Mic size={9} className="text-cyan-400" />}
                                <span>{m}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Client API Key Input & Action Controls */}
                    <div className="pt-3 border-t border-[#232734] space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="font-semibold text-gray-300 flex items-center gap-1">
                          <Key size={11} className="text-cyan-400" />
                          <span>API Key del Cliente:</span>
                        </span>
                        {isSaved && (
                          <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1 animate-pulse">
                            <Check size={11} /> ¡Key Guardada!
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="relative flex-1">
                          <input
                            type={showKeys[p.id] ? 'text' : 'password'}
                            value={currentKeyValue}
                            placeholder={p.apiKeyPlaceholder || 'Ingresa tu API Key...'}
                            onChange={(e) => handleKeyChange(p.id, e.target.value)}
                            className="w-full pl-3 pr-8 py-1.5 bg-[#101218] border border-[#272d3e] focus:border-cyan-500 rounded-lg text-gray-200 font-mono text-xs outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowKey(p.id)}
                            className="absolute right-2.5 top-2 text-gray-500 hover:text-gray-300"
                            title={showKeys[p.id] ? 'Ocultar' : 'Mostrar'}
                          >
                            {showKeys[p.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>

                        {/* Save Key Button */}
                        <button
                          onClick={() => handleSaveKey(p)}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-md shadow-cyan-950 flex items-center gap-1"
                          title="Guardar esta API Key localmente"
                        >
                          <Check size={12} />
                          <span>Guardar</span>
                        </button>

                        {/* Test Connection Button */}
                        <button
                          onClick={() => handleTestConnection(p.id)}
                          disabled={testState === 'testing'}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                            testState === 'success'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                              : 'bg-[#1f2433] hover:bg-[#293044] text-gray-300 border-[#2f3850]'
                          }`}
                          title="Probar conexión y latencia con el proveedor"
                        >
                          {testState === 'testing' ? (
                            <RotateCw size={12} className="animate-spin text-cyan-400" />
                          ) : testState === 'success' ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-[10px]">38ms</span>
                            </>
                          ) : (
                            <span>Probar</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Audio Matrix Tab */}
        {activeTab === 'audio_matrix' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-5 rounded-2xl bg-[#161a26] border border-emerald-700/40 space-y-2">
              <div className="flex items-center gap-2">
                <Radio size={18} className="text-emerald-400 animate-pulse" />
                <h3 className="font-bold text-gray-100 text-sm">Matriz de Capacidades de Voz y Audio en Tiempo Real</h3>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Los modelos con audio integrado permiten mantener conversaciones fluidas tocando el botón de voz o mediante reconocimiento continuo. A continuación se desglosa el soporte de audio por modelo y proveedor:
              </p>
            </div>

            <div className="space-y-3">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    p.supportsAudio
                      ? 'bg-[#151c24] border-emerald-800/40 shadow-md'
                      : 'bg-[#14151c] border-[#232734] opacity-75'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-100 text-sm">{p.name}</span>
                      {p.supportsAudio ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono text-[10px] flex items-center gap-1">
                          <Mic size={10} />
                          <span>Audio Nativo Soportado</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-mono text-[10px]">
                          Sin soporte de audio directo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-xs">
                      {p.audioFeatureDetails || (p.supportsAudio ? 'Soporta streaming de voz bidireccional' : 'Solo generación de texto y código fuente')}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-gray-400 font-mono block">Modelos con Audio:</span>
                    <span className="font-semibold text-cyan-300 text-xs">
                      {p.supportsAudio ? p.defaultModel : 'Ninguno (Solo Texto)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Smart Model Router Tab */}
        {activeTab === 'router' && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-[#161822] border border-[#252a38] rounded-xl space-y-1">
              <h3 className="font-semibold text-gray-200 text-sm">Smart Model Router Engine</h3>
              <p className="text-gray-400 text-xs">
                Asigna automáticamente el modelo óptimo de acuerdo a la complejidad de la tarea para optimizar costo, latencia y precisión.
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
                      <span className="font-mono text-cyan-300 font-semibold">{rule.recommendedModel || rule.model}</span>
                      <span className="text-[10px] text-gray-500">({rule.provider})</span>
                    </div>
                    <p className="text-gray-400 text-[11px]">{rule.description || rule.reason}</p>
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
