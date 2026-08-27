import React, { useState } from 'react';
import { X, FileCode2, Check, RotateCcw, Copy, ExternalLink, ChevronRight } from 'lucide-react';

interface DiffFile {
  path: string;
  additions: number;
  deletions: number;
  contentDiff?: string;
}

interface DiffViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: DiffFile[];
  totalAdditions: number;
  totalDeletions: number;
  onUndoChanges?: () => void;
}

export const DiffViewerModal: React.FC<DiffViewerModalProps> = ({
  isOpen,
  onClose,
  files,
  totalAdditions,
  totalDeletions,
  onUndoChanges
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = files[selectedFileIndex] || files[0];

  const handleCopyDiff = () => {
    if (currentFile?.contentDiff) {
      navigator.clipboard.writeText(currentFile.contentDiff);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      id="diff-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        id="diff-modal-container"
        className="w-full max-w-5xl h-[80vh] bg-[#16181e] border border-[#2d3342] rounded-xl shadow-2xl flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#1c1f27] border-b border-[#2d3342] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-lg">
              <FileCode2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-200 text-sm">Revisión de Cambios Multicódigo</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                  +{totalAdditions} líneas
                </span>
                {totalDeletions > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-950/70 text-rose-300 border border-rose-800/40">
                    -{totalDeletions} líneas
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-[11px]">
                {files.length} archivos modificados por el agente en esta sesión
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onUndoChanges && (
              <button
                onClick={onUndoChanges}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 rounded-md transition-colors font-medium"
              >
                <RotateCcw size={12} />
                <span>Deshacer Todos</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body with Sidebar & Diff View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Files List Sidebar */}
          <div className="w-72 bg-[#12141a] border-r border-[#262b38] overflow-y-auto p-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Archivos ({files.length})
            </div>

            {files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                  selectedFileIndex === idx
                    ? 'bg-cyan-950/60 border border-cyan-800/50 text-cyan-200 font-medium'
                    : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode2 size={13} className={selectedFileIndex === idx ? 'text-cyan-400' : 'text-gray-500'} />
                  <span className="truncate">{file.path}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] shrink-0 ml-2">
                  <span className="text-emerald-400">+{file.additions}</span>
                  {file.deletions > 0 && <span className="text-rose-400">-{file.deletions}</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Diff Content View */}
          <div className="flex-1 flex flex-col bg-[#14161c] overflow-hidden">
            {/* Sub-header with current file path & actions */}
            <div className="px-4 py-2 bg-[#181a22] border-b border-[#262b38] flex items-center justify-between font-mono">
              <div className="flex items-center gap-2 text-gray-300 truncate">
                <span className="text-gray-500">diff --git a/{currentFile?.path} b/{currentFile?.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDiff}
                  className="flex items-center gap-1 px-2 py-1 bg-[#202430] hover:bg-[#2a3040] text-gray-300 rounded text-[11px] transition-colors"
                >
                  {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copied ? 'Copiado' : 'Copiar Diff'}</span>
                </button>
              </div>
            </div>

            {/* Code Diff lines */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed select-text space-y-1">
              <div className="text-gray-500 mb-2">@@ -1,0 +1,{currentFile?.additions} @@ {currentFile?.path}</div>
              
              {currentFile?.contentDiff ? (
                currentFile.contentDiff.split('\n').map((line, lIdx) => {
                  const isAdd = line.startsWith('+');
                  const isDel = line.startsWith('-');
                  return (
                    <div
                      key={lIdx}
                      className={`px-2 py-0.5 rounded flex items-start gap-3 ${
                        isAdd
                          ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500'
                          : isDel
                            ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500'
                            : 'text-gray-400'
                      }`}
                    >
                      <span className="w-6 text-gray-600 select-none text-right shrink-0">{lIdx + 1}</span>
                      <pre className="font-mono whitespace-pre-wrap break-all flex-1">{line}</pre>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 italic py-8 text-center">
                  + Cambios aplicados automáticamente en este archivo sin conflictos.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#1a1c24] border-t border-[#262b38] flex items-center justify-between text-[11px]">
          <span className="text-gray-400">
            Los cambios se guardan localmente en el workspace de Windows.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-900/30"
            >
              Aceptar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
