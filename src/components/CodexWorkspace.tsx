import React, { useState, useRef, useEffect } from 'react';
import {
  FolderGit2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play,
  Square,
  Wrench,
  Globe,
  FileCode2,
  Sparkles,
  Send,
  Plus,
  ShieldAlert,
  Mic,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  SlidersHorizontal,
  Columns2,
  Terminal,
  Activity,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ProjectItem, ActivityTimelineItem } from '../types';
import { GrokCodexLoader } from './GrokCodexLoader';
import { DiffViewerModal } from './DiffViewerModal';

interface CodexWorkspaceProps {
  project: ProjectItem;
  messages: ChatMessage[];
  onSendMessage: (text: string, model: string) => void;
  isAgentRunning: boolean;
  onStopAgent: () => void;
  onOpenDiffModal: () => void;
  timeline: ActivityTimelineItem[];
  onNavigateToView: (view: any) => void;
  onOpenVoiceAssistant?: () => void;
}

export const CodexWorkspace: React.FC<CodexWorkspaceProps> = ({
  project,
  messages,
  onSendMessage,
  isAgentRunning,
  onStopAgent,
  onOpenDiffModal,
  timeline,
  onNavigateToView,
  onOpenVoiceAssistant
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('5.6 Luna Muy alto');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showOpenInDropdown, setShowOpenInDropdown] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [hasFullAccess, setHasFullAccess] = useState(true);
  const [expandedFiles, setExpandedFiles] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice dictation handling
  const toggleVoiceDictation = () => {
    if (onOpenVoiceAssistant) {
      onOpenVoiceAssistant();
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      const text = prompt('Dictado por voz: Escribe tu consulta:');
      if (text) setInputText((prev) => (prev ? prev + ' ' + text : text));
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
    } else {
      try {
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.onstart = () => setIsVoiceActive(true);
        recognition.onresult = (e: any) => {
          const speechResult = e.results[0][0].transcript;
          setInputText((prev) => (prev ? prev + ' ' + speechResult : speechResult));
        };
        recognition.onerror = () => setIsVoiceActive(false);
        recognition.onend = () => setIsVoiceActive(false);
        recognition.start();
      } catch (err) {
        setIsVoiceActive(false);
      }
    }
  };
  const modelsList = [
    { id: 'codemorf-2026', name: 'CodeMorf API 2026', badge: 'Ultra Coder', provider: 'CodeMorf' },
    { id: 'luna-5.6', name: '5.6 Luna Muy alto', badge: 'Codex Standard', provider: 'Luna Core' },
    { id: 'claude-3.7', name: 'Claude 3.7 Sonnet', badge: 'Hybrid Reasoning', provider: 'Anthropic' },
    { id: 'grok-3', name: 'xAI Grok-3 Coding', badge: 'Fast Reasoning', provider: 'xAI' },
    { id: 'gpt-4o', name: 'GPT-4o Omni', badge: 'Multimodal', provider: 'OpenAI' },
    { id: 'deepseek-r1', name: 'DeepSeek R1', badge: 'Architecture Pro', provider: 'OpenRouter' }
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAgentRunning) return;
    onSendMessage(inputText, selectedModel);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <div id="codex-main-workspace" className="flex-1 flex overflow-hidden bg-[#16171d] text-[#e1e4ea] select-text relative">
      {/* Central Chat & Code Stream */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Workspace Top Breadcrumb Header matching screenshot */}
        <div className="h-11 px-4 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2.5">
            <FolderGit2 size={15} className="text-cyan-400" />
            <span className="font-semibold text-gray-200 text-xs truncate max-w-sm">
              {project.name}
            </span>
            <span className="text-gray-500 font-mono text-xs">...</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Abrir en... Dropdown */}
            <div className="relative">
              <button
                id="open-in-btn"
                onClick={() => setShowOpenInDropdown(!showOpenInDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#222633] hover:bg-[#2c3242] border border-[#2e3444] rounded-md text-gray-300 transition-colors"
              >
                <ExternalLink size={12} className="text-cyan-400" />
                <span>Abrir en</span>
                <ChevronDown size={11} className="text-gray-400" />
              </button>

              {showOpenInDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-[#1e212b] border border-[#303646] rounded-lg shadow-xl py-1 z-50 text-xs">
                  <button 
                    onClick={() => { setShowOpenInDropdown(false); onNavigateToView('browser'); }}
                    className="w-full px-3 py-1.5 text-left hover:bg-cyan-600/20 flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <Globe size={13} className="text-sky-400" />
                    <span>Navegador Integrado</span>
                  </button>
                  <button 
                    onClick={() => { setShowOpenInDropdown(false); onNavigateToView('terminal'); }}
                    className="w-full px-3 py-1.5 text-left hover:bg-cyan-600/20 flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <Terminal size={13} className="text-emerald-400" />
                    <span>Terminal de Windows</span>
                  </button>
                  <button 
                    onClick={() => { setShowOpenInDropdown(false); onNavigateToView('files'); }}
                    className="w-full px-3 py-1.5 text-left hover:bg-cyan-600/20 flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <FileCode2 size={13} className="text-indigo-400" />
                    <span>Editor de Código</span>
                  </button>
                </div>
              )}
            </div>

            {/* Layout inspector toggle */}
            <button
              onClick={() => setShowInspector(!showInspector)}
              className={`p-1.5 rounded-md transition-colors ${
                showInspector ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/40' : 'bg-[#222633] text-gray-400 hover:text-white'
              }`}
              title="Panel lateral de entorno y contexto"
            >
              <Columns2 size={13} />
            </button>
          </div>
        </div>

        {/* Chat Messages Scroll Container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {/* Tool Execution Badges */}
              {msg.toolBadges && msg.toolBadges.length > 0 && (
                <div className="space-y-1.5 max-w-2xl">
                  {msg.toolBadges.map((badge, bIdx) => (
                    <div
                      key={bIdx}
                      className="flex items-center gap-2 text-[11px] text-gray-400 bg-white/[0.02] px-3 py-1.5 rounded-lg border border-[#222632]"
                    >
                      {badge.type === 'browser_action' ? (
                        <Globe size={13} className="text-sky-400 shrink-0" />
                      ) : (
                        <Wrench size={13} className="text-cyan-400 shrink-0" />
                      )}
                      <span>{badge.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Codex Diff File Card matching screenshot: "Se han editado 14 archivos +644 -0 [Deshacer] [Revisión]" */}
              {msg.diffSummary && (
                <div className="max-w-2xl bg-[#14161c] border border-[#272b38] rounded-xl overflow-hidden shadow-lg">
                  <div className="px-4 py-3 bg-[#191c24] flex items-center justify-between border-b border-[#272b38]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 bg-cyan-950 text-cyan-400 border border-cyan-800/40 rounded-md">
                        <FileCode2 size={15} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-200 text-xs">
                          Se han editado {msg.diffSummary.totalFiles} archivos
                        </span>
                        <div className="flex items-center gap-1 font-mono text-[11px] mt-0.5">
                          <span className="text-emerald-400 font-semibold">+{msg.diffSummary.additions}</span>
                          <span className="text-rose-400 font-semibold">-{msg.diffSummary.deletions}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert('Se han deshecho los cambios en el árbol local')}
                        className="px-2.5 py-1 bg-[#222530] hover:bg-[#2c3040] text-gray-300 rounded text-xs transition-colors"
                      >
                        Deshacer
                      </button>
                      <button
                        onClick={onOpenDiffModal}
                        className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 font-medium rounded text-xs transition-colors shadow-sm"
                      >
                        Revisión
                      </button>
                    </div>
                  </div>

                  {/* Files List Preview */}
                  <div className="p-3 space-y-1.5 font-mono text-xs text-gray-300">
                    {(expandedFiles ? msg.diffSummary.files : msg.diffSummary.files.slice(0, 3)).map((file, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/[0.02]">
                        <span className="truncate max-w-md text-gray-300">{file.path}</span>
                        <div className="flex items-center gap-1 text-[11px] shrink-0">
                          <span className="text-emerald-400">+{file.additions}</span>
                          <span className="text-rose-400">-{file.deletions}</span>
                        </div>
                      </div>
                    ))}

                    {msg.diffSummary.files.length > 3 && (
                      <button
                        onClick={() => setExpandedFiles(!expandedFiles)}
                        className="w-full text-left pt-1 px-2 text-[11px] text-gray-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        <span>
                          {expandedFiles ? 'Ocultar archivos' : `Mostrar ${msg.diffSummary.files.length - 3} archivos más`}
                        </span>
                        {expandedFiles ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* User Message Bubble */}
              {msg.sender === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-xl bg-[#232733] border border-[#313748] rounded-2xl rounded-tr-sm px-4 py-3 text-xs md:text-sm text-gray-100 shadow-md">
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              )}

              {/* Agent Message Content & Signature Grok/Codex Loader */}
              {msg.sender === 'agent' && (
                <div className="max-w-2xl space-y-3">
                  {/* Working Time Badge & Reasoning Step Viewer */}
                  {msg.workingTime && (
                    <GrokCodexLoader
                      isRunning={false}
                      workingTimeText={msg.workingTime}
                      elapsedSeconds={10}
                    />
                  )}

                  {/* Main Agent Markdown Text */}
                  <div className="text-xs md:text-sm text-gray-200 leading-relaxed bg-[#13151b]/80 border border-[#202430] p-4 rounded-xl space-y-3">
                    <div className="prose prose-invert max-w-none text-xs md:text-sm">
                      {msg.content.split('\n\n').map((para, pIdx) => {
                        if (para.startsWith('>')) {
                          return (
                            <blockquote key={pIdx} className="border-l-2 border-cyan-400 pl-3 italic text-gray-400 my-2">
                              {para.replace(/^>\s*/, '')}
                            </blockquote>
                          );
                        }
                        return <p key={pIdx} className="whitespace-pre-wrap">{para}</p>;
                      })}
                    </div>

                    {/* Agent Message Action Bar */}
                    <div className="pt-2 border-t border-[#1e222c] flex items-center justify-between text-gray-500 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                          title="Copiar respuesta"
                        >
                          {copiedMsgId === msg.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                        <button className="hover:text-cyan-300 transition-colors" title="Útil">
                          <ThumbsUp size={13} />
                        </button>
                        <button className="hover:text-rose-400 transition-colors" title="No útil">
                          <ThumbsDown size={13} />
                        </button>
                        <button className="hover:text-cyan-300 transition-colors" title="Reintentar respuesta">
                          <RotateCcw size={13} />
                        </button>
                      </div>

                      <span className="text-[10px] text-gray-600 font-mono">
                        CodeMorf CLI Engine • {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Live Agent Running Loader if active */}
          {isAgentRunning && (
            <div className="max-w-2xl">
              <GrokCodexLoader
                isRunning={true}
                onStop={onStopAgent}
                workingTimeText="Pensando y ejecutando acciones..."
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 md:px-12 py-1 flex items-center gap-2 overflow-x-auto text-[11px] text-gray-400 shrink-0">
          <span className="text-gray-600 font-medium">Sugerencias:</span>
          <button
            onClick={() => setInputText('Crea un script de migraciones para PostgreSQL con Drizzle ORM')}
            className="px-2.5 py-1 bg-[#1c1f28] hover:bg-[#252a36] hover:text-cyan-300 border border-[#2b303e] rounded-full transition-all whitespace-nowrap"
          >
            ⚡ Crear migraciones PostgreSQL
          </button>
          <button
            onClick={() => setInputText('Genera un plan de implementación para convertir a multi-tenant')}
            className="px-2.5 py-1 bg-[#1c1f28] hover:bg-[#252a36] hover:text-cyan-300 border border-[#2b303e] rounded-full transition-all whitespace-nowrap"
          >
            📐 Generar plan multi-tenant
          </button>
          <button
            onClick={() => setInputText('Ejecuta la suite de pruebas unitarias y abre el navegador integrado')}
            className="px-2.5 py-1 bg-[#1c1f28] hover:bg-[#252a36] hover:text-cyan-300 border border-[#2b303e] rounded-full transition-all whitespace-nowrap"
          >
            🧪 Probar y abrir navegador
          </button>
        </div>

        {/* Bottom Input Dock matching Codex Screenshot */}
        <div className="p-4 md:px-12 bg-[#16171d] border-t border-[#232734] shrink-0">
          <div className="max-w-3xl mx-auto relative rounded-2xl bg-[#1e2029] border border-[#2d3342] shadow-2xl p-2.5 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
            <textarea
              id="codex-prompt-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pide lo que quieras"
              rows={2}
              className="w-full bg-transparent text-gray-100 text-xs md:text-sm placeholder-gray-500 resize-none outline-none px-2 py-1 leading-relaxed font-sans"
            />

            {/* Bottom Controls inside the pill input */}
            <div className="flex items-center justify-between pt-2 border-t border-[#292e3d] text-xs">
              <div className="flex items-center gap-2">
                {/* Plus button to add context / files */}
                <button
                  id="add-context-btn"
                  onClick={() => alert('Selecciona archivos o capturas del workspace para adjuntar')}
                  className="w-6 h-6 rounded-full bg-[#2a2f3d] hover:bg-[#353c4d] text-gray-300 flex items-center justify-center transition-colors"
                  title="Adjuntar archivo o contexto"
                >
                  <Plus size={14} />
                </button>

                {/* Acceso Completo Permission Pill */}
                <button
                  id="full-access-toggle-btn"
                  onClick={() => setHasFullAccess(!hasFullAccess)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                    hasFullAccess
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                      : 'bg-[#2a2f3d] text-gray-400'
                  }`}
                  title="Permisos del agente en el sistema"
                >
                  <ShieldAlert size={12} className={hasFullAccess ? 'text-amber-400' : 'text-gray-400'} />
                  <span>{hasFullAccess ? 'Acceso completo' : 'Acceso restringido'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Model Selector Dropdown matching "5.6 Luna Muy alto ⌵" */}
                <div className="relative">
                  <button
                    id="model-selector-dropdown-btn"
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#272b38] hover:bg-[#313748] border border-[#343b4d] rounded-lg text-gray-300 transition-colors text-xs font-medium"
                  >
                    <Sparkles size={12} className="text-cyan-400" />
                    <span>{selectedModel}</span>
                    <ChevronDown size={11} className="text-gray-400" />
                  </button>

                  {showModelDropdown && (
                    <div className="absolute right-0 bottom-full mb-2 w-72 bg-[#1c1f28] border border-[#313748] rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                      <div className="px-2 py-1 text-[10px] uppercase font-semibold text-gray-500">
                        Seleccionar Modelo de Inteligencia
                      </div>
                      {modelsList.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModel(m.name);
                            setShowModelDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                            selectedModel === m.name
                              ? 'bg-cyan-950/80 border border-cyan-800/50 text-cyan-200 font-medium'
                              : 'text-gray-300 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-gray-200">{m.name}</div>
                            <div className="text-[10px] text-gray-500">{m.provider}</div>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#272b38] text-cyan-300 font-mono">
                            {m.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Real-Time Voice Assistant Touch / Mic Button */}
                <button
                  id="voice-assistant-prompt-btn"
                  onClick={toggleVoiceDictation}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
                    isVoiceActive
                      ? 'bg-rose-900/80 text-rose-200 border border-rose-600/60 animate-pulse'
                      : 'bg-[#222736] hover:bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 hover:border-cyan-600/60'
                  }`}
                  title="Toca con el dedo o pulsa para hablar en tiempo real"
                >
                  <Mic size={13} className={isVoiceActive ? 'text-rose-400' : 'text-cyan-400'} />
                  <span className="text-[11px] font-medium hidden sm:inline">
                    {isVoiceActive ? 'Escuchando...' : 'Voz Real'}
                  </span>
                </button>

                {/* Send / Stop Button */}
                {isAgentRunning ? (
                  <button
                    onClick={onStopAgent}
                    className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-md shadow-rose-900/30"
                    title="Detener agente"
                  >
                    <Square size={13} className="fill-white" />
                  </button>
                ) : (
                  <button
                    id="send-prompt-btn"
                    onClick={() => handleSend()}
                    disabled={!inputText.trim()}
                    className={`p-1.5 rounded-lg transition-all ${
                      inputText.trim()
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-md shadow-cyan-900/40'
                        : 'bg-[#2a2f3d] text-gray-600 cursor-not-allowed'
                    }`}
                    title="Enviar mensaje (Enter)"
                  >
                    <ArrowUp size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Context & Environment Inspector Panel matching screenshot */}
      <AnimatePresence>
        {showInspector && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-72 bg-[#14151a] border-l border-[#222631] flex flex-col justify-between overflow-y-auto text-xs shrink-0 select-none p-3 space-y-4"
          >
            {/* Section 1: Entorno */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <span>Entorno</span>
                <Plus size={13} className="text-gray-500 hover:text-white cursor-pointer" />
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={onOpenDiffModal}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-[#1b1e27] hover:bg-[#232733] border border-[#282d3b] text-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileCode2 size={13} className="text-cyan-400" />
                    <span>Cambios</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">+14</span>
                </button>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#1b1e27] border border-[#282d3b] text-gray-300">
                  <div className="flex items-center gap-2">
                    <Layers size={13} className="text-sky-400" />
                    <span>Local</span>
                  </div>
                  <ChevronDown size={12} className="text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#1b1e27] border border-[#282d3b] text-gray-300">
                  <div className="flex items-center gap-2">
                    <FolderGit2 size={13} className="text-purple-400" />
                    <span className="font-mono">master</span>
                  </div>
                  <ChevronDown size={12} className="text-gray-400" />
                </div>

                <button 
                  onClick={() => onNavigateToView('git')}
                  className="w-full py-1.5 bg-[#232733] hover:bg-[#2c3242] border border-[#303646] text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Commit o push</span>
                </button>

                <div className="text-[11px] text-gray-400 px-1 italic">
                  Estado de la pull request no disponible
                </div>
              </div>
            </div>

            {/* Section 2: Procesos de contexto matching screenshot */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Procesos de contexto
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded-lg bg-[#1a1c24] border border-[#262b38] flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-gray-200 truncate">node server/index.js</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    :4000
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#1a1c24] border border-[#262b38] flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-mono text-gray-200 truncate">npm run dev:client</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    :5173
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Fuentes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <span>Fuentes</span>
                <Plus size={13} className="text-gray-500 hover:text-white cursor-pointer" />
              </div>

              <div className="p-2 rounded-lg bg-[#1a1c24] border border-[#262b38] space-y-1">
                <div className="flex items-center gap-1.5 text-gray-300 font-mono text-[11px] truncate">
                  <FileText size={12} className="text-cyan-400 shrink-0" />
                  <span className="truncate"># PROMPT COMPLETO — ErogaAI Saa...</span>
                </div>
                <button 
                  onClick={() => alert('Visualizando prompt completo exportado de AI Studio')}
                  className="text-[10px] text-cyan-400 hover:underline pt-0.5"
                >
                  Ver todo
                </button>
              </div>
            </div>

            {/* Quick module jumps */}
            <div className="pt-2 border-t border-[#202430] space-y-1">
              <div className="text-[10px] font-semibold text-gray-400 uppercase">Atajos Rápidos</div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button 
                  onClick={() => onNavigateToView('browser')}
                  className="p-1.5 rounded bg-[#1c1f28] hover:bg-[#252a36] text-gray-300 flex items-center gap-1.5"
                >
                  <Globe size={11} className="text-sky-400" />
                  <span>Navegador</span>
                </button>
                <button 
                  onClick={() => onNavigateToView('tasks')}
                  className="p-1.5 rounded bg-[#1c1f28] hover:bg-[#252a36] text-gray-300 flex items-center gap-1.5"
                >
                  <Activity size={11} className="text-amber-400" />
                  <span>Kanban</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
