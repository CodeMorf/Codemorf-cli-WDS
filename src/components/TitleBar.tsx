import React, { useState } from 'react';
import {
  Search,
  Bell,
  Minus,
  Square,
  X,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  Settings as SettingsIcon,
  ShieldCheck,
  FolderGit2,
  Terminal,
  Globe,
  SlidersHorizontal,
  Layers,
  HelpCircle,
  Mic,
  Radio
} from 'lucide-react';
import { CodeMorfLogo } from './CodeMorfLogo';
import { MainView, ThemeMode } from '../types';

interface TitleBarProps {
  currentView: MainView;
  onSelectView: (view: MainView) => void;
  activeProjectName: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenVoiceAssistant: () => void;
  unreadNotificationsCount: number;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  currentView,
  onSelectView,
  activeProjectName,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onOpenNotifications,
  onOpenSettings,
  onOpenVoiceAssistant,
  unreadNotificationsCount
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = {
    archivo: [
      { label: 'Nuevo Chat de Agente', shortcut: 'Ctrl+N', action: () => onSelectView('workspace') },
      { label: 'Abrir Proyecto...', shortcut: 'Ctrl+O', action: () => onSelectView('welcome') },
      { label: 'Clonar Repositorio GitHub...', shortcut: 'Ctrl+Shift+G', action: () => onSelectView('git') },
      { divider: true },
      { label: 'Guardar Sesión de Agente', shortcut: 'Ctrl+S', action: () => {} },
      { label: 'Exportar Workspace a ZIP', shortcut: 'Ctrl+E', action: () => {} },
      { divider: true },
      { label: 'Cerrar Proyecto', shortcut: 'Ctrl+W', action: () => onSelectView('welcome') },
      { label: 'Salir de CodeMorf CLI', shortcut: 'Alt+F4', action: () => {} }
    ],
    edicion: [
      { label: 'Deshacer Último Diff', shortcut: 'Ctrl+Z', action: () => {} },
      { label: 'Rehacer Acción', shortcut: 'Ctrl+Y', action: () => {} },
      { divider: true },
      { label: 'Copiar Contexto de Agente', shortcut: 'Ctrl+C', action: () => {} },
      { label: 'Limpiar Historial de Chat', shortcut: 'Ctrl+L', action: () => {} },
      { divider: true },
      { label: 'Configurar Reglas de Agente', shortcut: 'Ctrl+,', action: onOpenSettings }
    ],
    ver: [
      { label: 'Agent Workspace (Chat & Loader)', shortcut: 'Alt+1', action: () => onSelectView('workspace') },
      { label: 'Multi-Agent Manager', shortcut: 'Alt+2', action: () => onSelectView('multi-agent') },
      { label: 'Kanban Task Board', shortcut: 'Alt+3', action: () => onSelectView('tasks') },
      { label: 'Plan Generator Mode', shortcut: 'Alt+4', action: () => onSelectView('plan') },
      { label: 'Navegador Integrado', shortcut: 'Alt+5', action: () => onSelectView('browser') },
      { label: 'Git / GitHub Center', shortcut: 'Alt+6', action: () => onSelectView('git') },
      { label: 'Terminal Integrada', shortcut: 'Alt+7', action: () => onSelectView('terminal') },
      { label: 'Memoria & Skills', shortcut: 'Alt+8', action: () => onSelectView('memory') },
      { divider: true },
      { label: 'Alternar Modo Oscuro / Claro', shortcut: 'Ctrl+T', action: onToggleTheme }
    ],
    ayuda: [
      { label: 'Documentación Oficial CodeMorf', shortcut: 'F1', action: () => window.open('https://codemorf.tech/chat/docs/es/', '_blank') },
      { label: 'Ver Atajos de Teclado (Command Palette)', shortcut: 'Ctrl+K', action: onOpenCommandPalette },
      { label: 'MCP Documentation & Protocol', shortcut: '', action: () => onSelectView('mcp') },
      { divider: true },
      { label: 'Acerca de CodeMorf CLI (v3.8 Windows)', shortcut: '', action: onOpenSettings }
    ]
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  return (
    <header 
      id="windows-titlebar"
      className="h-10 bg-[#16171a] text-[#c9cdd4] border-b border-[#252830] flex items-center justify-between px-2 text-xs select-none z-50 shrink-0 relative"
      onClick={() => activeMenu && setActiveMenu(null)}
    >
      {/* Left section: Logo & App Menu */}
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-1.5 py-0.5 rounded hover:bg-white/5 cursor-pointer" onClick={() => onSelectView('welcome')}>
          <CodeMorfLogo size={20} showText={true} textClassName="text-xs tracking-wider" />
          <span className="text-[10px] uppercase font-semibold text-cyan-400/80 bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-800/40">
            CLI 2026
          </span>
        </div>

        {/* Windows Menus: Archivo, Edición, Ver, Ayuda */}
        <nav className="flex items-center ml-2 space-x-0.5 text-[#b0b5c0]">
          {(['archivo', 'edicion', 'ver', 'ayuda'] as const).map((menu) => (
            <div key={menu} className="relative">
              <button
                id={`menu-btn-${menu}`}
                onClick={() => handleMenuClick(menu)}
                className={`px-2 py-1 rounded transition-colors capitalize ${
                  activeMenu === menu ? 'bg-[#2b2f3a] text-white' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {menu}
              </button>

              {activeMenu === menu && (
                <div
                  id={`dropdown-${menu}`}
                  className="absolute left-0 top-full mt-1 w-64 bg-[#1e2128] border border-[#313642] shadow-2xl rounded-md py-1 z-50 text-xs text-[#d1d5db] backdrop-blur-md"
                >
                  {menuItems[menu].map((item, idx) => (
                    'divider' in item ? (
                      <div key={idx} className="h-px bg-[#2f3442] my-1" />
                    ) : (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(item.action)}
                        className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-600/20 hover:text-cyan-300 transition-colors text-left"
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[10px] text-gray-500 font-mono ml-3">{item.shortcut}</span>
                        )}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Center section: Active Project Pill & Quick Switcher */}
      <div className="flex items-center gap-2">
        <button
          id="active-project-pill"
          onClick={() => onSelectView('welcome')}
          className="flex items-center gap-2 px-3 py-1 bg-[#1e2128] hover:bg-[#282d38] border border-[#2d323f] rounded-full transition-all text-[#e2e8f0] shadow-sm max-w-[320px] truncate"
          title="Cambiar proyecto activo"
        >
          <FolderGit2 size={13} className="text-cyan-400 shrink-0" />
          <span className="font-medium truncate">{activeProjectName}</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 rounded-full">
            master
          </span>
          <ChevronDown size={12} className="text-gray-400 shrink-0" />
        </button>

        {/* Global Search / Command Palette shortcut button */}
        <button
          id="global-search-trigger"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#1e2128]/70 hover:bg-[#252a35] border border-[#2d323f] rounded-md text-gray-400 hover:text-gray-200 transition-colors"
        >
          <Search size={12} className="text-gray-400" />
          <span className="text-[11px]">Buscar / Comandos</span>
          <kbd className="text-[9px] bg-[#121316] px-1.5 py-0.5 rounded border border-[#313642] font-mono text-gray-400">Ctrl+K</kbd>
        </button>
      </div>

      {/* Right section: Quick actions, Theme, Notifications & Windows Controls */}
      <div className="flex items-center gap-1">
        {/* Voice Assistant Touch / Mic button */}
        <button
          id="voice-assistant-titlebar-btn"
          onClick={onOpenVoiceAssistant}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-rose-900/60 to-pink-900/60 hover:from-rose-800/80 hover:to-pink-800/80 text-rose-200 border border-rose-700/50 rounded-full transition-all text-[11px] shadow-sm animate-pulse"
          title="Toca con el dedo o pulsa para hablar en tiempo real con el Asistente de Voz"
        >
          <Mic size={12} className="text-rose-400" />
          <span className="font-semibold hidden sm:inline">Voz Tiempo Real</span>
        </button>

        {/* Model Status Pill */}
        <div 
          onClick={() => onSelectView('providers')}
          className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-800/40 rounded text-cyan-300 cursor-pointer hover:border-cyan-500/60 transition-all text-[11px]"
          title="Configuración de Proveedor AI CodeMorf"
        >
          <Sparkles size={11} className="text-cyan-400 animate-pulse" />
          <span className="font-semibold">CodeMorf API 2026</span>
        </div>

        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          className="p-1.5 text-gray-400 hover:text-yellow-300 hover:bg-white/5 rounded transition-colors"
          title={`Tema actual: ${theme}. Haz clic para alternar`}
        >
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        {/* Notifications Bell */}
        <button
          id="notifications-bell-btn"
          onClick={onOpenNotifications}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors relative"
          title="Centro de notificaciones"
        >
          <Bell size={14} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-cyan-500 text-black font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Settings button */}
        <button
          id="settings-bar-btn"
          onClick={onOpenSettings}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          title="Ajustes de CodeMorf CLI"
        >
          <SettingsIcon size={14} />
        </button>

        {/* Native Windows Controls (_ □ ✕) */}
        <div className="flex items-center ml-2 border-l border-[#252830] pl-1">
          <button
            id="win-minimize-btn"
            className="w-8 h-7 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Minimizar"
          >
            <Minus size={13} />
          </button>
          <button
            id="win-maximize-btn"
            className="w-8 h-7 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Maximizar"
          >
            <Square size={11} />
          </button>
          <button
            id="win-close-btn"
            className="w-9 h-7 flex items-center justify-center hover:bg-rose-600 text-gray-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
