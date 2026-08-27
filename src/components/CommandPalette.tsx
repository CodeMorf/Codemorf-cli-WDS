import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bot,
  Terminal,
  FolderGit2,
  Globe,
  Settings,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Brain,
  Puzzle,
  Server,
  FileCode2,
  X,
  ArrowRight,
  Mic
} from 'lucide-react';
import { MainView, ProjectItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: MainView) => void;
  projects: ProjectItem[];
  onSelectProject: (projectId: string) => void;
  onNewChat: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  projects,
  onSelectProject,
  onNewChat,
  onOpenVoiceAssistant
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'cmd-voice-assistant',
      title: 'Asistente de Voz en Tiempo Real',
      subtitle: 'Toca con el dedo o pulsa para hablar y ejecutar comandos',
      icon: <Mic size={16} className="text-rose-400" />,
      category: 'Acciones Rápidas',
      action: () => {
        if (onOpenVoiceAssistant) onOpenVoiceAssistant();
        onClose();
      }
    },
    {
      id: 'cmd-new-chat',
      title: 'Nuevo Chat con Agente',
      subtitle: 'Crear un nuevo hilo de trabajo con Codex & Grok Loader',
      icon: <Sparkles size={16} className="text-cyan-400" />,
      category: 'Acciones Rápidas',
      action: () => { onNewChat(); onSelectView('workspace'); onClose(); }
    },
    {
      id: 'cmd-workspace',
      title: 'Agent Workspace',
      subtitle: 'Abrir el chat central, visualizador de diffs y timeline',
      icon: <Bot size={16} className="text-cyan-400" />,
      category: 'Navegación',
      action: () => { onSelectView('workspace'); onClose(); }
    },
    {
      id: 'cmd-multi-agent',
      title: 'Multi-Agent Manager',
      subtitle: 'Gestionar agentes Frontend, Backend, QA y Security en paralelo',
      icon: <Bot size={16} className="text-blue-400" />,
      category: 'Navegación',
      action: () => { onSelectView('multi-agent'); onClose(); }
    },
    {
      id: 'cmd-browser',
      title: 'Navegador Integrado',
      subtitle: 'Inspeccionar localhost:5173, localhost:4000 y capturas DOM',
      icon: <Globe size={16} className="text-sky-400" />,
      category: 'Navegación',
      action: () => { onSelectView('browser'); onClose(); }
    },
    {
      id: 'cmd-git',
      title: 'Git & GitHub Center',
      subtitle: 'Gestionar ramas, pull requests, staging de archivos y commits',
      icon: <FolderGit2 size={16} className="text-purple-400" />,
      category: 'Navegación',
      action: () => { onSelectView('git'); onClose(); }
    },
    {
      id: 'cmd-terminal',
      title: 'Terminal Integrada',
      subtitle: 'Consola PowerShell / Bash para compilaciones y tests',
      icon: <Terminal size={16} className="text-emerald-400" />,
      category: 'Navegación',
      action: () => { onSelectView('terminal'); onClose(); }
    },
    {
      id: 'cmd-plan',
      title: 'Plan Mode (Blueprints)',
      subtitle: 'Planificador paso a paso para arquitecturas y migraciones',
      icon: <Zap size={16} className="text-amber-400" />,
      category: 'Navegación',
      action: () => { onSelectView('plan'); onClose(); }
    },
    {
      id: 'cmd-permissions',
      title: 'Centro de Permisos',
      subtitle: 'Configurar permisos de archivos, terminal, red y base de datos',
      icon: <Shield size={16} className="text-rose-400" />,
      category: 'Navegación',
      action: () => { onSelectView('permissions'); onClose(); }
    },
    {
      id: 'cmd-mcp',
      title: 'MCP Servers Hub',
      subtitle: 'Model Context Protocol: GitHub, PostgreSQL, Filesystem',
      icon: <Server size={16} className="text-teal-400" />,
      category: 'Herramientas',
      action: () => { onSelectView('mcp'); onClose(); }
    },
    {
      id: 'cmd-memory',
      title: 'Memoria del Agente',
      subtitle: 'Preferencias de usuario, arquitectura de proyectos y stack',
      icon: <Brain size={16} className="text-pink-400" />,
      category: 'Herramientas',
      action: () => { onSelectView('memory'); onClose(); }
    },
    {
      id: 'cmd-extensions',
      title: 'Complementos & Extensiones',
      subtitle: 'Marketplace de extensiones de CodeMorf y plugins',
      icon: <Puzzle size={16} className="text-emerald-400" />,
      category: 'Herramientas',
      action: () => { onSelectView('extensions'); onClose(); }
    },
    {
      id: 'cmd-providers',
      title: 'Proveedores AI & Smart Router',
      subtitle: 'CodeMorf API, Grok-3, Claude 3.7, OpenAI, Gemini',
      icon: <Sparkles size={16} className="text-cyan-400" />,
      category: 'Configuración',
      action: () => { onSelectView('providers'); onClose(); }
    }
  ];

  const projectActions = projects.map((p) => ({
    id: `proj-${p.id}`,
    title: p.name,
    subtitle: `${p.path} • ${p.branch}`,
    icon: <FolderGit2 size={16} className="text-yellow-400" />,
    category: 'Proyectos Recientes',
    action: () => {
      onSelectProject(p.id);
      onSelectView('workspace');
      onClose();
    }
  }));

  const allItems = [...actions, ...projectActions];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#181a22] border border-[#2b3040] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#262b3a] flex items-center gap-3 bg-[#1c1f2a]">
          <Search size={18} className="text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Escribe un comando, busca un proyecto o abre una herramienta..."
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          )}
          <kbd className="text-[10px] bg-[#121318] text-gray-400 px-2 py-0.5 rounded border border-[#2c3242] font-mono shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              No se encontraron comandos o proyectos que coincidan con "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                  selectedIndex === idx
                    ? 'bg-cyan-950/70 border border-cyan-700/50 text-white'
                    : 'text-gray-300 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded-lg bg-[#222736] shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-xs text-gray-200 truncate flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-[10px] text-gray-500 font-normal px-1.5 py-0.2 bg-[#222736] rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-gray-500">
                  {selectedIndex === idx && (
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                      Ejecutar <ArrowRight size={10} />
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-[#14161e] border-t border-[#232734] flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navegar</span>
            <span>↵ Seleccionar</span>
            <span>ESC Cerrar</span>
          </div>
          <span className="text-cyan-400/80 font-sans">CodeMorf CLI v3.8</span>
        </div>
      </div>
    </div>
  );
};
