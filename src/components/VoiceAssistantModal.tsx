import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Zap,
  Radio,
  Globe,
  Terminal,
  FileCode2,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Bot,
  UserCheck,
  Play
} from 'lucide-react';
import { MainView, ProjectItem } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string, model: string) => void;
  onNavigateToView: (view: MainView) => void;
  onOpenDiffModal: () => void;
  onNewChat: () => void;
  activeProject: ProjectItem;
}

// Check for Web Speech API
const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  onNavigateToView,
  onOpenDiffModal,
  onNewChat,
  activeProject
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastAgentReply, setLastAgentReply] = useState(
    'Hola. Soy tu asistente de voz en tiempo real con tono humano. Toca con el dedo para hablarme o dime qué necesitas en Windows.'
  );
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.02);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [autoListenAfterReply, setAutoListenAfterReply] = useState(true);
  const [executedAction, setExecutedAction] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load Voices (prioritizing Natural Spanish Human voices)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      // Priority ranking for human-like natural Spanish voices
      const prioritySpanish = voices.find(
        (v) =>
          v.name.includes('Natural') ||
          v.name.includes('Google español') ||
          v.name.includes('Helena') ||
          v.name.includes('Jorge') ||
          v.name.includes('Paulina') ||
          v.name.includes('Monica') ||
          v.lang.startsWith('es')
      );

      if (prioritySpanish && !selectedVoiceName) {
        setSelectedVoiceName(prioritySpanish.name);
      } else if (voices.length > 0 && !selectedVoiceName) {
        setSelectedVoiceName(voices[0].name);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, [selectedVoiceName]);

  // Initialize Speech Synthesis and Greeting on Open
  useEffect(() => {
    if (isOpen) {
      speakHumanText(
        `CodeMorf Asistente de voz conectado para ${activeProject.name}. Toca con el dedo y hablemos a tiempo real.`
      );
    } else {
      stopListening();
      stopSpeaking();
    }
  }, [isOpen]);

  // Handle Speech Recognition setup
  useEffect(() => {
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        setIsListening(true);
        startAudioVisualizer();
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(currentInterim);
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceCommand(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        stopAudioVisualizer();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioVisualizer();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      stopAudioVisualizer();
    };
  }, []);

  // Audio visualizer setup
  const startAudioVisualizer = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneStreamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioMeter = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animationFrameRef.current = requestAnimationFrame(updateAudioMeter);
          };
          updateAudioMeter();
        }
      }
    } catch (err) {
      let step = 0;
      const interval = setInterval(() => {
        if (!isListening) {
          clearInterval(interval);
          setAudioLevel(0);
          return;
        }
        step += 0.2;
        setAudioLevel(Math.round(40 + Math.sin(step) * 35));
      }, 80);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((t) => t.stop());
      microphoneStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  const startListening = () => {
    stopSpeaking();
    setTranscript('');
    setInterimTranscript('');
    setExecutedAction(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start exception, retrying:', err);
        try {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 100);
        } catch (e) {}
      }
    } else {
      const fallbackSpeech = prompt('Escribe lo que deseas decir al Asistente de Voz:');
      if (fallbackSpeech) {
        setTranscript(fallbackSpeech);
        handleVoiceCommand(fallbackSpeech);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    stopAudioVisualizer();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Human-Tuned Speech Synthesis Engine
  const speakHumanText = (text: string, onEndCallback?: () => void) => {
    stopSpeaking();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Filter out technical artifacts for a natural human cadence
    const cleanText = text
      .replace(/[*#`_~>\[\]\(\)]/g, '')
      .replace(/https?:\/\/\S+/g, 'enlace web')
      .replace(/(\r\n|\n|\r)/gm, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = voiceVolume;

    const voices = window.speechSynthesis.getVoices();
    let chosenVoice = voices.find((v) => v.name === selectedVoiceName);

    if (!chosenVoice) {
      chosenVoice = voices.find(
        (v) =>
          v.name.includes('Natural') ||
          v.name.includes('Google español') ||
          v.name.includes('Helena') ||
          v.name.includes('Jorge') ||
          v.lang.startsWith('es')
      );
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEndCallback) {
        onEndCallback();
      } else if (autoListenAfterReply) {
        setTimeout(() => {
          if (isOpen) startListening();
        }, 500);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Smart Voice Command Router
  const handleVoiceCommand = (command: string) => {
    const lower = command.toLowerCase().trim();
    let reply = '';
    let actionLabel: string | null = null;

    if (lower.includes('terminal') || lower.includes('consola') || lower.includes('powershell')) {
      onNavigateToView('terminal');
      reply = 'Abriendo la terminal de Windows en este momento.';
      actionLabel = 'Navegado a Terminal';
    } else if (lower.includes('navegador') || lower.includes('browser') || lower.includes('web') || lower.includes('sitio')) {
      onNavigateToView('browser');
      reply = 'Abriendo el navegador web para previsualizar tu app.';
      actionLabel = 'Navegado a Navegador';
    } else if (lower.includes('archivo') || lower.includes('explorador') || lower.includes('código') || lower.includes('editor')) {
      onNavigateToView('files');
      reply = 'Abriendo el explorador de archivos y editor de código.';
      actionLabel = 'Navegado a Archivos';
    } else if (lower.includes('git') || lower.includes('commit') || lower.includes('push') || lower.includes('rama')) {
      onNavigateToView('git');
      reply = 'Abriendo el centro Git de control de versiones.';
      actionLabel = 'Navegado a Git';
    } else if (lower.includes('diferencia') || lower.includes('diff') || lower.includes('cambios')) {
      onOpenDiffModal();
      reply = 'Mostrando los cambios y diferencias en el código.';
      actionLabel = 'Abierto Visor de Diffs';
    } else if (lower.includes('multi agente') || lower.includes('agentes') || lower.includes('equipo')) {
      onNavigateToView('multi-agent');
      reply = 'Abriendo el panel de agentes paralelos.';
      actionLabel = 'Navegado a Multi-Agente';
    } else if (lower.includes('plan') || lower.includes('blueprint') || lower.includes('pasos')) {
      onNavigateToView('plan');
      reply = 'Mostrando la hoja de ruta y pasos del plan.';
      actionLabel = 'Navegado a Plan';
    } else if (lower.includes('tarea') || lower.includes('kanban') || lower.includes('pendiente')) {
      onNavigateToView('tasks');
      reply = 'Abriendo tu tablero Kanban de tareas.';
      actionLabel = 'Navegado a Tareas';
    } else if (lower.includes('proveedor') || lower.includes('provider') || lower.includes('api key') || lower.includes('clave')) {
      onNavigateToView('providers');
      reply = 'Abriendo el gestor de proveedores de IA y claves de API.';
      actionLabel = 'Navegado a Proveedores AI';
    } else if (lower.includes('permiso') || lower.includes('seguridad')) {
      onNavigateToView('permissions');
      reply = 'Abriendo el centro de seguridad y los 3 niveles de permisos.';
      actionLabel = 'Navegado a Permisos';
    } else if (lower.includes('nuevo chat') || lower.includes('limpiar') || lower.includes('reiniciar')) {
      onNewChat();
      reply = 'Nuevo hilo de conversación iniciado en el workspace.';
      actionLabel = 'Nuevo Chat Creado';
    } else if (lower.includes('prueba') || lower.includes('test') || lower.includes('vitest')) {
      onSendMessage('Ejecuta todas las pruebas unitarias con Vitest y genera reporte de cobertura.', '5.6 Luna Muy alto');
      reply = 'Ejecutando la suite de pruebas unitarias.';
      actionLabel = 'Ejecutando Tests';
    } else {
      onSendMessage(command, '5.6 Luna Muy alto');
      reply = `Entendido. Enviando solicitud al agente: "${command}". Procesando cambios en ${activeProject.name}.`;
      actionLabel = 'Enviado al Agente Codex';
    }

    setLastAgentReply(reply);
    setExecutedAction(actionLabel);
    speakHumanText(reply);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gradient-to-b from-[#181a24] to-[#12141c] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center p-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 text-xs font-mono mb-4 shadow-inner">
          <Radio size={13} className={isListening ? 'text-rose-400 animate-pulse' : 'text-cyan-400'} />
          <span>CodeMorf Voice • Voz Humana en Tiempo Real</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Dynamic Glowing Orb Visualizer */}
        <div className="relative my-3 flex items-center justify-center">
          {/* Animated Glow Rings */}
          <div
            className={`absolute rounded-full transition-all duration-300 pointer-events-none ${
              isListening
                ? 'bg-rose-500/20 w-44 h-44 animate-ping'
                : isSpeaking
                ? 'bg-cyan-500/20 w-44 h-44 animate-pulse'
                : 'bg-cyan-500/10 w-36 h-36'
            }`}
          />
          <div
            className={`absolute rounded-full transition-all duration-200 pointer-events-none ${
              isListening
                ? 'bg-rose-500/30 w-36 h-36'
                : isSpeaking
                ? 'bg-cyan-400/30 w-36 h-36'
                : 'bg-cyan-500/20 w-28 h-28'
            }`}
            style={{
              transform: `scale(${1 + audioLevel / 120})`
            }}
          />

          {/* Center Interactive Touch / Talk Button */}
          <button
            id="voice-touch-orb-btn"
            onClick={toggleListening}
            className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer select-none active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-rose-600/50 scale-105 ring-4 ring-rose-400/40'
                : isSpeaking
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/50 scale-100 ring-4 ring-cyan-400/40 animate-pulse'
                : 'bg-gradient-to-tr from-[#252a38] to-[#1c202c] hover:from-cyan-900/60 hover:to-[#222838] text-cyan-300 border-2 border-cyan-500/40'
            }`}
            title="Toca con el dedo o pulsa para hablar en tiempo real"
          >
            {isListening ? (
              <>
                <Mic size={36} className="animate-bounce" />
                <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Escuchando</span>
              </>
            ) : isSpeaking ? (
              <>
                <Volume2 size={36} className="animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Hablando</span>
              </>
            ) : (
              <>
                <Mic size={34} />
                <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Toca para hablar</span>
              </>
            )}
          </button>
        </div>

        {/* Live Audio Level Waveform Bars */}
        <div className="flex items-center justify-center gap-1 h-6 my-1">
          {[...Array(16)].map((_, i) => {
            const barHeight = isListening || isSpeaking
              ? Math.max(4, Math.min(24, (audioLevel * (1 + Math.sin(i * 0.6))) / 3.5))
              : 4;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-75 ${
                  isListening
                    ? 'bg-rose-400'
                    : isSpeaking
                    ? 'bg-cyan-400'
                    : 'bg-gray-700'
                }`}
                style={{ height: `${barHeight}px` }}
              />
            );
          })}
        </div>

        {/* Live Speech Recognition Transcript */}
        <div className="w-full min-h-[64px] bg-[#111319]/90 border border-[#232734] rounded-2xl p-3.5 my-2 flex flex-col justify-center text-center">
          {isListening ? (
            <div className="text-gray-200 text-sm font-medium">
              {interimTranscript || transcript || (
                <span className="text-gray-500 italic animate-pulse">
                  Habla ahora... por ejemplo: "Abre la terminal" o "Muestra los permisos"
                </span>
              )}
            </div>
          ) : (
            <div className="text-gray-300 text-sm font-medium leading-relaxed">
              "{lastAgentReply}"
            </div>
          )}

          {executedAction && (
            <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 size={12} />
              <span>Acción ejecutada: {executedAction}</span>
            </div>
          )}
        </div>

        {/* Human Voice Tuning Options Dropdown Toggle */}
        <div className="w-full my-2">
          <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-medium"
            >
              <UserCheck size={12} />
              <span>Voz Humana: {selectedVoiceName ? selectedVoiceName.split('-')[0].trim() : 'Natural Española'}</span>
              <Sliders size={11} className="ml-1 opacity-75" />
            </button>

            <button
              onClick={() => speakHumanText('Probando modulación de voz humana en CodeMorf.')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1e2332] hover:bg-[#283044] text-gray-300 text-[10px]"
              title="Probar sintetizador de voz"
            >
              <Play size={9} className="fill-current text-cyan-400" />
              <span>Probar Voz</span>
            </button>
          </div>

          {showVoiceSettings && (
            <div className="mt-2 p-3 bg-[#131620] border border-[#262c3e] rounded-xl text-left space-y-2.5">
              <div>
                <label className="text-[10px] text-gray-400 font-semibold block mb-1">Seleccionar Voz Natural del Sistema:</label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full p-1.5 bg-[#191d29] border border-[#2c3348] rounded-lg text-xs text-gray-200 outline-none"
                >
                  {availableVoices.map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Cadencia / Velocidad:</span>
                    <span className="font-mono text-cyan-300">{speechRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-[#252b3d] rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Tono Natural:</span>
                    <span className="font-mono text-cyan-300">{speechPitch}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.05"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-[#252b3d] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="w-full my-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              'Abre la terminal de Windows',
              'Ver los 3 tipos de permisos',
              'Configurar API keys de proveedores',
              'Abre el navegador web',
              'Explora los archivos',
              'Ejecuta las pruebas unitarias',
              'Muestra los cambios diff'
            ].map((suggest, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(suggest);
                  handleVoiceCommand(suggest);
                }}
                className="px-2.5 py-1 rounded-full bg-[#1b1f2b] hover:bg-cyan-950/80 border border-[#272d3e] hover:border-cyan-700 text-[11px] text-gray-300 hover:text-cyan-300 transition-all flex items-center gap-1"
              >
                <span>{suggest}</span>
                <ArrowRight size={10} className="opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Voice Controls Bar */}
        <div className="w-full pt-3 border-t border-[#222632] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakHumanText(lastAgentReply);
                }
              }}
              className="p-1.5 rounded-lg bg-[#1a1d27] hover:bg-[#252936] text-gray-300 flex items-center gap-1.5 text-[11px]"
            >
              {isSpeaking ? <VolumeX size={13} className="text-rose-400" /> : <Volume2 size={13} className="text-cyan-400" />}
              <span>{isSpeaking ? 'Silenciar' : 'Repetir'}</span>
            </button>

            <button
              onClick={() => setAutoListenAfterReply(!autoListenAfterReply)}
              className={`px-2 py-1 rounded-lg text-[11px] transition-colors ${
                autoListenAfterReply
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                  : 'bg-[#1a1d27] text-gray-500'
              }`}
              title="Escuchar automáticamente después de hablar"
            >
              Auto-escucha: {autoListenAfterReply ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="text-[11px] text-gray-500 font-mono">
            Proyecto: <span className="text-cyan-400">{activeProject.name}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
