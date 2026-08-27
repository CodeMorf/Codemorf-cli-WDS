import React, { useState } from 'react';
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  ExternalLink, 
  Camera, 
  Video, 
  Code2, 
  Terminal, 
  Activity, 
  Maximize2,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export const IntegratedBrowser: React.FC = () => {
  const [url, setUrl] = useState('http://localhost:5173/dashboard');
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'network' | 'dom'>('preview');
  const [isRecording, setIsRecording] = useState(false);
  const [screenshotTaken, setScreenshotTaken] = useState(false);

  const consoleLogs = [
    { type: 'info', text: '[Vite] connected.', time: '09:40:02' },
    { type: 'info', text: '[Auth] Token verified successfully for admin@eroga.ai', time: '09:40:05' },
    { type: 'warn', text: '[React Router] Deprecation warning for future v7 flags', time: '09:40:12' },
    { type: 'success', text: '[API] GET /api/expenses?tenantId=1 (200 OK - 24ms)', time: '09:40:18' }
  ];

  const networkRequests = [
    { method: 'GET', path: '/api/v1/auth/session', status: 200, type: 'fetch', size: '1.2 KB', time: '14ms' },
    { method: 'GET', path: '/api/v1/expenses', status: 200, type: 'fetch', size: '8.4 KB', time: '28ms' },
    { method: 'POST', path: '/api/v1/expenses/create', status: 201, type: 'fetch', size: '2.1 KB', time: '45ms' },
    { method: 'GET', path: '/assets/index.js', status: 200, type: 'script', size: '142 KB', time: '8ms' }
  ];

  const handleCaptureScreenshot = () => {
    setScreenshotTaken(true);
    setTimeout(() => setScreenshotTaken(false), 2500);
  };

  return (
    <div id="integrated-browser-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Browser Navigation Bar */}
      <div className="h-12 px-4 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-1.5 text-gray-400">
          <button className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-colors" title="Atrás">
            <ArrowLeft size={14} />
          </button>
          <button className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-colors" title="Adelante">
            <ArrowRight size={14} />
          </button>
          <button className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-colors" title="Recargar">
            <RotateCw size={14} />
          </button>
        </div>

        {/* URL Address Bar */}
        <div className="flex-1 max-w-2xl flex items-center gap-2 bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-1 text-xs text-gray-200">
          <Lock size={12} className="text-emerald-400 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-xs text-cyan-300"
          />
          <span className="text-[10px] text-gray-500 font-mono">HMR 5173</span>
        </div>

        {/* Browser Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCaptureScreenshot}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#232734] hover:bg-[#2c3242] text-gray-300 rounded-md transition-colors"
            title="Capturar pantalla para análisis visual"
          >
            <Camera size={13} className="text-cyan-400" />
            <span>Screenshot</span>
          </button>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              isRecording
                ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                : 'bg-[#232734] hover:bg-[#2c3242] text-gray-300'
            }`}
          >
            <Video size={13} className={isRecording ? 'text-rose-400' : 'text-purple-400'} />
            <span>{isRecording ? 'Grabando...' : 'Record Session'}</span>
          </button>

          <button
            onClick={() => window.open(url, '_blank')}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="Abrir en ventana externa"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {screenshotTaken && (
        <div className="bg-emerald-950 text-emerald-300 px-4 py-1.5 text-center text-xs border-b border-emerald-800 animate-fadeIn">
          ✓ Screenshot capturado y añadido a la memoria visual del agente.
        </div>
      )}

      {/* Main Browser Canvas & DevTools Split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Rendered Web App Sandbox */}
        <div className="flex-1 bg-[#0f1117] overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-4xl bg-[#161821] border border-[#272c3c] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
            {/* Embedded ErogaAI UI Preview */}
            <div className="flex items-center justify-between border-b border-[#252a3a] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                  E
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">ErogaAI — Panel de Gastos SaaS</h1>
                  <p className="text-xs text-gray-400">Ambiente de desarrollo local conectado a Express & SQLite/Postgres</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                  Live Preview OK
                </span>
              </div>
            </div>

            {/* Metric KPI Cards in Simulated Web App */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#1c1f2b] border border-[#2c3246] space-y-1">
                <span className="text-gray-400 text-xs">Total Gastos Agosto</span>
                <div className="text-xl font-bold text-white font-mono">$18,450.00</div>
                <span className="text-emerald-400 text-[10px]">+12% vs mes anterior</span>
              </div>
              <div className="p-4 rounded-xl bg-[#1c1f2b] border border-[#2c3246] space-y-1">
                <span className="text-gray-400 text-xs">Comprobantes SAT Validados</span>
                <div className="text-xl font-bold text-cyan-300 font-mono">142 CFDI</div>
                <span className="text-cyan-400 text-[10px]">100% timbrado</span>
              </div>
              <div className="p-4 rounded-xl bg-[#1c1f2b] border border-[#2c3246] space-y-1">
                <span className="text-gray-400 text-xs">Tenants Activos</span>
                <div className="text-xl font-bold text-purple-300 font-mono">4 Orgs</div>
                <span className="text-gray-400 text-[10px]">Multi-tenant isolation</span>
              </div>
            </div>

            {/* Simulated Table */}
            <div className="space-y-2">
              <div className="font-semibold text-gray-200 text-xs">Últimos Movimientos Registrados</div>
              <div className="border border-[#252a3a] rounded-lg overflow-hidden font-mono text-xs">
                <div className="grid grid-cols-4 bg-[#1e2230] p-2.5 font-semibold text-gray-400 text-[11px]">
                  <span>Concepto</span>
                  <span>Categoría</span>
                  <span>Monto</span>
                  <span>Estado</span>
                </div>
                <div className="grid grid-cols-4 p-2.5 border-t border-[#232736] hover:bg-white/[0.02]">
                  <span className="text-gray-200">Servidores AWS Cloud</span>
                  <span className="text-gray-400">Infraestructura</span>
                  <span className="text-emerald-400 font-semibold">$3,200.00</span>
                  <span className="text-cyan-300">Aprobado</span>
                </div>
                <div className="grid grid-cols-4 p-2.5 border-t border-[#232736] hover:bg-white/[0.02]">
                  <span className="text-gray-200">Licencias JetBrains Pro</span>
                  <span className="text-gray-400">Software</span>
                  <span className="text-emerald-400 font-semibold">$890.00</span>
                  <span className="text-cyan-300">Aprobado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DevTools Lateral Inspector */}
        <div className="w-full md:w-80 bg-[#14151b] border-t md:border-t-0 md:border-l border-[#232734] flex flex-col overflow-hidden">
          {/* DevTools Tabs */}
          <div className="flex border-b border-[#232734] bg-[#181a22] text-xs">
            <button
              onClick={() => setActiveTab('console')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'console' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/[0.02]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Consola (4)
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'network' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/[0.02]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Network (4)
            </button>
            <button
              onClick={() => setActiveTab('dom')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'dom' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/[0.02]' : 'text-gray-400 hover:text-white'
              }`}
            >
              DOM Tree
            </button>
          </div>

          {/* DevTools Content */}
          <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-2 select-text">
            {activeTab === 'console' && (
              <div className="space-y-1.5">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-[#101217] border border-[#202430]">
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>[{log.type.toUpperCase()}]</span>
                      <span>{log.time}</span>
                    </div>
                    <div className="text-gray-300 mt-0.5">{log.text}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-1">
                {networkRequests.map((req, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#101217] border border-[#202430] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-cyan-400">{req.method}</span>
                        <span className="text-gray-300 truncate max-w-[140px]">{req.path}</span>
                      </div>
                      <div className="text-[10px] text-gray-500">{req.type} • {req.size}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">{req.status}</span>
                      <div className="text-[10px] text-gray-500">{req.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'dom' && (
              <div className="text-gray-400 space-y-1">
                <div>&lt;html lang="es" class="dark"&gt;</div>
                <div className="pl-3">&lt;head&gt;...&lt;/head&gt;</div>
                <div className="pl-3">&lt;body&gt;</div>
                <div className="pl-6 text-cyan-300">&lt;div id="root"&gt;</div>
                <div className="pl-9 text-yellow-300">&lt;Dashboard layout="modern"&gt;</div>
                <div className="pl-12 text-gray-500">&lt;!-- ExpensesTable rendered --&gt;</div>
                <div className="pl-9 text-yellow-300">&lt;/Dashboard&gt;</div>
                <div className="pl-6 text-cyan-300">&lt;/div&gt;</div>
                <div className="pl-3">&lt;/body&gt;</div>
                <div>&lt;/html&gt;</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
