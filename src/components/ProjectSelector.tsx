import React, { useState } from 'react';
import { 
  FolderPlus, 
  Upload, 
  FolderOpen, 
  GitBranch, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Check, 
  FileArchive, 
  Layers
} from 'lucide-react';
import { ProjectItem } from '../types';
import { CodeMorfLogo } from './CodeMorfLogo';

interface ProjectSelectorProps {
  projects: ProjectItem[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onImportZip: (fileName: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onImportZip
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onImportZip('ai-studio-project-export.zip');
    }, 1200);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const name = e.target.files[0].name;
      setTimeout(() => {
        setIsUploading(false);
        onImportZip(name);
      }, 1000);
    }
  };

  return (
    <div id="project-selector-view" className="flex-1 flex flex-col overflow-y-auto bg-[#13141b] text-gray-200 text-xs p-8 items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <CodeMorfLogo size={36} />
            <h1 className="text-2xl font-bold text-white tracking-tight">CodeMorf CLI — AI Studio Local Hub</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Bienvenido al entorno de desarrollo local para proyectos exportados de Google AI Studio. 
            Convierte cualquier prototipo en un SaaS de producción multi-tenant con orquestación multi-agente.
          </p>
        </div>

        {/* Dropzone for AI Studio ZIP */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center space-y-3 ${
            dragOver
              ? 'border-cyan-400 bg-cyan-950/30'
              : 'border-[#2c3346] bg-[#171923] hover:border-cyan-500/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/40">
            {isUploading ? <Sparkles size={24} className="animate-spin text-cyan-400" /> : <FileArchive size={24} />}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-100">
              {isUploading ? 'Desempaquetando ZIP de AI Studio e inicializando agentes...' : 'Arrastra aquí el ZIP exportado de AI Studio'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Desempaquetado automático, detección de package.json, configuración de SQLite / PostgreSQL local y Express
            </p>
          </div>

          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg cursor-pointer transition-colors shadow-lg shadow-cyan-900/30">
              <Upload size={14} />
              <span>Seleccionar Archivo ZIP o Carpeta</span>
              <input type="file" accept=".zip" onChange={handleFileInput} className="hidden" />
            </label>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#232734] pb-2">
            <h2 className="text-sm font-semibold text-gray-200">Proyectos Locales Recientes</h2>
            <span className="text-xs text-gray-400">{projects.length} proyectos encontrados</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => {
              const isSelected = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-[#1c1f2b] border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                      : 'bg-[#151720] border-[#252a38] hover:border-[#373e52]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-100 text-sm flex items-center gap-2">
                        <span>{proj.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 text-[10px] font-mono">
                            Activo
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{proj.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#232734] flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{proj.lastOpened}</span>
                    </span>
                    <span className="text-cyan-300 flex items-center gap-1">
                      <span>Abrir Workspace</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
