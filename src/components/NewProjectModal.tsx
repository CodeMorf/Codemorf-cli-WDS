import React, { useState } from 'react';
import { 
  FolderPlus, 
  X, 
  Folder, 
  GitBranch, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Check, 
  Terminal, 
  Shield, 
  Lock, 
  Zap,
  Info
} from 'lucide-react';
import { ProjectItem, PermissionLevel } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Omit<ProjectItem, 'id' | 'lastActive' | 'status' | 'filesCount'>) => void;
}

const TECH_STACKS = [
  { id: 'react-vite', name: 'React 19 + Vite + Tailwind', desc: 'Frontend SPA moderno y reactivo' },
  { id: 'nextjs', name: 'Next.js 15 App Router + Prisma', desc: 'Full-stack SSR con PostgreSQL / SQLite' },
  { id: 'node-express', name: 'Node.js + Express + TypeScript', desc: 'Microservicios REST y APIs seguras' },
  { id: 'python-fastapi', name: 'Python 3.12 + FastAPI + AI', desc: 'Modelos de machine learning y scrapers' },
  { id: 'laravel', name: 'Laravel 11 + Filament Admin', desc: 'ERP robusto y facturación' },
  { id: 'tauri-windows', name: 'Tauri 2.0 + Rust + React (Windows)', desc: 'Aplicación de escritorio nativa para Windows' }
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [name, setName] = useState('');
  const [path, setPath] = useState('C:/Users/Kitgiz/Projects/');
  const [category, setCategory] = useState('Proyectos');
  const [techStack, setTechStack] = useState('React 19 + Vite + Tailwind');
  const [description, setDescription] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>('ask_confirmation');
  const [initGit, setInitGit] = useState(true);
  const [defaultBranch, setDefaultBranch] = useState('main');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sanitizedPath = path.endsWith('/') || path.endsWith('\\')
      ? `${path}${name.toLowerCase().replace(/\s+/g, '-')}`
      : `${path}/${name.toLowerCase().replace(/\s+/g, '-')}`;

    onCreateProject({
      name: name.trim(),
      path: sanitizedPath,
      category,
      branch: defaultBranch,
      lastPromptSnippet: 'Proyecto creado. Esperando primera instrucción...',
      pinned: false,
      isArchived: false,
      permissionLevel,
      techStack,
      description: description.trim() || `Proyecto ${name} inicializado con ${techStack}`,
      createdDate: new Date().toISOString().split('T')[0]
    });

    // Reset fields
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        id="new-project-modal"
        className="w-full max-w-2xl bg-[#14161f] border border-[#262b3a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232736] bg-[#181a24] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-950 to-blue-950 text-cyan-400 border border-cyan-800/50 rounded-xl shadow-inner">
              <FolderPlus size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Crear Nuevo Proyecto en Windows</h2>
              <p className="text-xs text-gray-400">
                Configura el espacio de trabajo local, permisos de ejecución y stack tecnológico
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252a3a] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-gray-200">
          {/* Project Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[11px] font-medium text-gray-300">
                Nombre del Proyecto <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (path === 'C:/Users/Kitgiz/Projects/' || path.startsWith('C:/Users/Kitgiz/Projects/')) {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
                    setPath(`C:/Users/Kitgiz/Projects/${slug}`);
                  }
                }}
                placeholder="Ej. Tienda NextGen SaaS"
                className="w-full px-3.5 py-2.5 bg-[#1a1d28] border border-[#2b3142] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-gray-100 placeholder-gray-500 text-xs transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-gray-300">
                Categoría / Etiqueta
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a1d28] border border-[#2b3142] focus:border-cyan-500 rounded-xl text-gray-100 text-xs outline-none"
              >
                <option value="Proyectos">Proyectos</option>
                <option value="SaaS & Cloud">SaaS & Cloud</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="ERP & Finanzas">ERP & Finanzas</option>
                <option value="Multi-Agente AI">Multi-Agente AI</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="CodeMorf">CodeMorf</option>
              </select>
            </div>
          </div>

          {/* Directory Path on Windows */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-gray-300 flex items-center justify-between">
              <span>Ruta en Disco Local (Windows)</span>
              <span className="text-[10px] text-gray-500 font-mono">Compatible con NTFS / SSD</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <Folder size={14} />
              </span>
              <input
                type="text"
                required
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#1a1d28] border border-[#2b3142] focus:border-cyan-500 rounded-xl text-gray-100 font-mono text-[11px] outline-none"
              />
            </div>
          </div>

          {/* 3 Tipos de Permisos para el Agente en este proyecto */}
          <div className="space-y-2">
            <label className="block text-[11px] font-medium text-gray-300 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-cyan-400" />
              <span>Nivel de Permisos de Seguridad para el Agente (3 Modos)</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Level 1: Solo Lectura */}
              <div
                onClick={() => setPermissionLevel('read_only')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  permissionLevel === 'read_only'
                    ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/50 shadow-md'
                    : 'bg-[#181a24] border-[#252a38] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-blue-900/60 text-blue-300">
                      <Lock size={12} />
                    </span>
                    <span className="font-semibold text-gray-100 text-xs">1. Solo Lectura</span>
                  </div>
                  {permissionLevel === 'read_only' && <Check size={14} className="text-blue-400" />}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Inspección y análisis. El agente no puede modificar archivos ni ejecutar comandos en terminal.
                </p>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40 self-start">
                  Máxima Seguridad
                </span>
              </div>

              {/* Level 2: Confirmación Previa */}
              <div
                onClick={() => setPermissionLevel('ask_confirmation')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  permissionLevel === 'ask_confirmation'
                    ? 'bg-cyan-950/40 border-cyan-500/80 ring-1 ring-cyan-500/50 shadow-md'
                    : 'bg-[#181a24] border-[#252a38] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-cyan-900/60 text-cyan-300">
                      <Shield size={12} />
                    </span>
                    <span className="font-semibold text-gray-100 text-xs">2. Confirmar Previo</span>
                  </div>
                  {permissionLevel === 'ask_confirmation' && <Check size={14} className="text-cyan-400" />}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Semi-automático. El agente genera planes y diffs, pero te pide confirmación antes de escribir o ejecutar.
                </p>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 self-start">
                  Recomendado
                </span>
              </div>

              {/* Level 3: Acceso Total */}
              <div
                onClick={() => setPermissionLevel('full_access')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  permissionLevel === 'full_access'
                    ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/50 shadow-md'
                    : 'bg-[#181a24] border-[#252a38] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-amber-900/60 text-amber-300">
                      <Zap size={12} />
                    </span>
                    <span className="font-semibold text-gray-100 text-xs">3. Acceso Total</span>
                  </div>
                  {permissionLevel === 'full_access' && <Check size={14} className="text-amber-400" />}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Full-Auto autónomo. Crea archivos, corre comandos de terminal y compila sin interrupciones.
                </p>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40 self-start">
                  Agente Autónomo
                </span>
              </div>
            </div>
          </div>

          {/* Tech Stack Selection */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-gray-300">
              Stack Tecnológico Base
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TECH_STACKS.map((stack) => (
                <div
                  key={stack.id}
                  onClick={() => setTechStack(stack.name)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    techStack === stack.name
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                      : 'bg-[#1a1d28] border-[#2b3142] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold text-[11px]">{stack.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{stack.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-gray-300">
              Descripción / Objetivo Inicial (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe las metas principales que los agentes deben resolver en este proyecto..."
              className="w-full px-3.5 py-2 bg-[#1a1d28] border border-[#2b3142] focus:border-cyan-500 rounded-xl text-gray-100 placeholder-gray-500 text-xs outline-none resize-none"
            />
          </div>

          {/* Git Repository Initialization */}
          <div className="pt-2 border-t border-[#232736] flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={initGit}
                onChange={(e) => setInitGit(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-[#1a1d28] border-[#2b3142] focus:ring-cyan-500"
              />
              <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium">
                <GitBranch size={13} className="text-purple-400" />
                <span>Inicializar repositorio Git local</span>
              </div>
            </label>

            {initGit && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">Rama:</span>
                <input
                  type="text"
                  value={defaultBranch}
                  onChange={(e) => setDefaultBranch(e.target.value)}
                  className="w-20 px-2 py-1 bg-[#1a1d28] border border-[#2b3142] rounded-lg text-gray-200 font-mono text-[11px] text-center"
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#232736] bg-[#181a24] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#222634] hover:bg-[#2c3246] text-gray-300 rounded-xl text-xs font-medium transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-cyan-950"
          >
            <FolderPlus size={14} />
            <span>Crear Proyecto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
