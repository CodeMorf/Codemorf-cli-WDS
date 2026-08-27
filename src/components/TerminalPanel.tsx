import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Plus, 
  Columns2, 
  Trash2, 
  Copy, 
  X, 
  Check, 
  Play, 
  Square,
  Sparkles
} from 'lucide-react';

export const TerminalPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'term1' | 'frontend' | 'backend' | 'agent'>('agent');
  const [commandInput, setCommandInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSplit, setIsSplit] = useState(false);

  const [termLogs, setTermLogs] = useState<Record<string, string[]>>({
    agent: [
      'CodeMorf Agent Daemon v3.8.0-win64',
      'Sandboxed in workspace: C:/Users/Kitgiz/Projects/ErogaAI',
      '[09:42:10] Agent initialized with permissions: [FILES, TERMINAL, DB]',
      '[09:43:00] Running AST parser on src/auth/login.ts... OK',
      '[09:44:15] Executing: npm test -- --runInBand',
      'PASS tests/unit/calc.test.ts',
      'PASS tests/unit/auth.test.ts',
      'Test Suites: 2 passed, 2 total',
      'Tests:       27 passed, 27 total',
      'Time:        820ms',
      'All tests passed successfully.'
    ],
    frontend: [
      '> eroga-client@1.0.0 dev',
      '> vite --port=5173 --host=0.0.0.0',
      '',
      '  VITE v6.2.3  ready in 218 ms',
      '',
      '  ➜  Local:   http://localhost:5173/',
      '  ➜  Network: http://192.168.1.120:5173/',
      '  ➜  press h + enter to show help'
    ],
    backend: [
      '> eroga-server@1.0.0 dev',
      '> tsx server.ts',
      '',
      '[DB] PostgreSQL connection established on port 5432 (pool size: 10)',
      '[Express] Server listening on http://localhost:4000',
      '[Route] Loaded 18 API routes in 42ms'
    ],
    term1: [
      'Microsoft Windows [Versión 10.0.22631.4112]',
      '(c) Microsoft Corporation. Todos los derechos reservados.',
      '',
      'C:\\Users\\Kitgiz\\Projects\\ErogaAI> git status',
      'On branch master',
      'Your branch is up to date with \'origin/master\'.'
    ]
  });

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    let reply = `Command executed: ${cmd}`;

    if (cmd === 'help') {
      reply = 'Comandos disponibles (PowerShell/Windows/Bash):\n  - dir / ls: Listar archivos en directorio de trabajo\n  - npm run dev / npm test / npm run build: Scripts del proyecto\n  - git status / git log / git commit: Control de versiones\n  - ipconfig / whoami / ver / systeminfo: Información del sistema Windows\n  - cls / clear: Limpiar pantalla\n  - drizzle-kit push / npx prisma: Migraciones base de datos';
    } else if (cmd === 'clear' || cmd === 'cls') {
      setTermLogs(prev => ({ ...prev, [activeTab]: [] }));
      setCommandInput('');
      return;
    } else if (cmd === 'dir' || cmd === 'ls') {
      reply = ` Directory of C:\\Users\\Kitgiz\\Projects\\ErogaAI\n\n08/26/2026  09:40 PM    <DIR>          .\n08/26/2026  09:40 PM    <DIR>          ..\n08/26/2026  09:35 PM    <DIR>          src\n08/26/2026  09:35 PM    <DIR>          server\n08/26/2026  09:35 PM    <DIR>          public\n08/26/2026  09:38 PM             1,420 package.json\n08/26/2026  09:38 PM               680 tsconfig.json\n08/26/2026  09:38 PM               412 vite.config.ts\n               3 File(s)          2,512 bytes\n               5 Dir(s)  312,852,193,280 bytes free`;
    } else if (cmd === 'whoami') {
      reply = 'DESKTOP-WIN11\\Kitgiz';
    } else if (cmd === 'ver') {
      reply = 'Microsoft Windows [Versión 10.0.22631.4112]';
    } else if (cmd === 'ipconfig') {
      reply = 'Configuración IP de Windows\n\nAdaptador de Ethernet Ethernet 2:\n   Sufijo DNS específico para la conexión. . : localdomain\n   Vínculo: dirección IPv6 local. . . : fe80::a1b2:c3d4:e5f6:7890%12\n   Dirección IPv4. . . . . . . . . . . . . . : 192.168.1.120\n   Máscara de subred . . . . . . . . . . . . : 255.255.255.0\n   Puerta de enlace predeterminada . . . . . : 192.168.1.1';
    } else if (cmd.includes('npm run build') || cmd.includes('build')) {
      reply = 'vite v6.2.3 building for production...\n✓ 142 modules transformed.\ndist/index.html                   0.92 kB │ gzip:  0.48 kB\ndist/assets/index-C7v9a21b.css   24.12 kB │ gzip:  5.80 kB\ndist/assets/index-Bx87c2aa.js   412.30 kB │ gzip: 128.45 kB\n✓ built in 640ms';
    } else if (cmd.includes('npm test')) {
      reply = '✓ 27 tests passed across 4 suites in 0.82s.\nPASS tests/unit/calc.test.ts\nPASS tests/unit/auth.test.ts\nPASS tests/unit/db.test.ts';
    } else if (cmd.includes('git status')) {
      reply = 'On branch master\nYour branch is up to date with \'origin/master\'.\nNothing to commit, working tree clean.';
    } else if (cmd.includes('drizzle-kit push')) {
      reply = '[DrizzleKit] Reading config from drizzle.config.ts\n[DrizzleKit] Connecting to PostgreSQL on port 5432...\n[DrizzleKit] Applied 4 schema changes successfully.';
    }

    setTermLogs(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), `> ${cmd}`, reply]
    }));
    setCommandInput('');
  };

  const handleCopyLogs = () => {
    const text = (termLogs[activeTab] || []).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="terminal-integrated-view" className="flex-1 flex flex-col overflow-hidden bg-[#0e1015] text-gray-200 text-xs">
      {/* Terminal Toolbar */}
      <div className="h-11 px-4 border-b border-[#232734] bg-[#161820] flex items-center justify-between shrink-0">
        {/* Terminal Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('agent')}
            className={`px-3 py-1.5 rounded-t-md font-mono text-xs flex items-center gap-2 transition-colors ${
              activeTab === 'agent'
                ? 'bg-[#0e1015] text-cyan-300 border-t-2 border-cyan-400 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles size={12} className="text-cyan-400" />
            <span>Agent Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('frontend')}
            className={`px-3 py-1.5 rounded-t-md font-mono text-xs flex items-center gap-2 transition-colors ${
              activeTab === 'frontend'
                ? 'bg-[#0e1015] text-cyan-300 border-t-2 border-cyan-400 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Frontend (5173)</span>
          </button>

          <button
            onClick={() => setActiveTab('backend')}
            className={`px-3 py-1.5 rounded-t-md font-mono text-xs flex items-center gap-2 transition-colors ${
              activeTab === 'backend'
                ? 'bg-[#0e1015] text-cyan-300 border-t-2 border-cyan-400 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Backend (4000)</span>
          </button>

          <button
            onClick={() => setActiveTab('term1')}
            className={`px-3 py-1.5 rounded-t-md font-mono text-xs flex items-center gap-2 transition-colors ${
              activeTab === 'term1'
                ? 'bg-[#0e1015] text-cyan-300 border-t-2 border-cyan-400 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <TerminalIcon size={12} />
            <span>Terminal 1 (CMD)</span>
          </button>

          <button className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-gray-300">
            <Plus size={14} />
          </button>
        </div>

        {/* Toolbar Buttons matching spec: Split, Clear, Kill, Copy */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSplit(!isSplit)}
            className={`p-1.5 rounded transition-colors ${isSplit ? 'bg-cyan-950 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            title="Split Terminal"
          >
            <Columns2 size={13} />
          </button>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 text-gray-400 hover:text-white rounded transition-colors flex items-center gap-1"
            title="Copiar contenido de terminal"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>

          <button
            onClick={() => setTermLogs(prev => ({ ...prev, [activeTab]: [] }))}
            className="p-1.5 text-gray-400 hover:text-rose-400 rounded transition-colors"
            title="Limpiar terminal"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Terminal View Content */}
      <div className={`flex-1 p-4 font-mono text-[12px] overflow-y-auto space-y-1 select-text ${isSplit ? 'grid grid-cols-2 gap-4' : ''}`}>
        <div className="space-y-1">
          {(termLogs[activeTab] || []).map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              {log.startsWith('>') ? (
                <span className="text-cyan-400 font-bold">{log}</span>
              ) : log.includes('PASS') || log.includes('passed') ? (
                <span className="text-emerald-400">{log}</span>
              ) : log.includes('ERR') || log.includes('failed') ? (
                <span className="text-rose-400">{log}</span>
              ) : (
                <span className="text-gray-300">{log}</span>
              )}
            </div>
          ))}
        </div>

        {isSplit && (
          <div className="border-l border-[#232734] pl-4 space-y-1">
            <div className="text-gray-500 font-semibold mb-2">// Split View: Frontend Logs</div>
            {(termLogs.frontend || []).map((log, idx) => (
              <div key={idx} className="text-cyan-300/80">{log}</div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Command Input prompt */}
      <form onSubmit={handleRunCommand} className="p-2.5 bg-[#12141c] border-t border-[#232734] flex items-center gap-2 font-mono text-xs">
        <span className="text-emerald-400 font-bold">PS C:\Users\Kitgiz\ErogaAI&gt;</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Escribe un comando (ej: npm test, git status, help)..."
          className="flex-1 bg-transparent text-gray-100 outline-none font-mono text-xs"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium transition-colors"
        >
          Ejecutar
        </button>
      </form>
    </div>
  );
};
