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
  Layers,
  Archive,
  ArchiveRestore,
  Trash2,
  Shield,
  Lock,
  Zap,
  Tag,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ProjectItem, PermissionLevel } from '../types';
import { CodeMorfLogo } from './CodeMorfLogo';

interface ProjectSelectorProps {
  projects: ProjectItem[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onImportZip: (fileName: string) => void;
  onOpenNewProject: () => void;
  onArchiveProject: (id: string) => void;
  onUnarchiveProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onImportZip,
  onOpenNewProject,
  onArchiveProject,
  onUnarchiveProject,
  onDeleteProject
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [filterTab, setFilterTab] = useState<'active' | 'archived' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

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

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.techStack && p.techStack.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'active') return !p.isArchived;
    if (filterTab === 'archived') return !!p.isArchived;
    return true;
  });

  const activeCount = projects.filter(p => !p.isArchived).length;
  const archivedCount = projects.filter(p => !!p.isArchived).length;

  const renderPermissionBadge = (level?: PermissionLevel) => {
    switch (level) {
      case 'read_only':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800/50 text-[10px] font-mono">
            <Lock size={10} />
            <span>1. Solo Lectura</span>
          </span>
        );
      case 'full_access':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800/50 text-[10px] font-mono">
            <Zap size={10} />
            <span>3. Acceso Total</span>
          </span>
        );
      case 'ask_confirmation':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/50 text-[10px] font-mono">
            <Shield size={10} />
            <span>2. Confirmar Previo</span>
          </span>
        );
    }
  };

  return (
    <div id="project-selector-view" className="flex-1 flex flex-col overflow-y-auto bg-[#13141b] text-gray-200 text-xs p-6 md:p-10 items-center">
      <div className="w-full max-w-5xl space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <CodeMorfLogo size={36} />
            <h1 className="text-2xl font-bold text-white tracking-tight">CodeMorf CLI — AI Studio Local Hub</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Gestor integral de proyectos en Windows. Crea nuevos espacios de trabajo, gestiona permisos de ejecución por proyecto y archiva proyectos completados.
          </p>
        </div>

        {/* Action Bar & Dropzone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Create New Project Card */}
          <div 
            onClick={onOpenNewProject}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#162033] to-[#121624] border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl hover:shadow-cyan-950/40 group"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 group-hover:scale-105 transition-transform">
                <FolderPlus size={24} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 text-[10px] font-mono">
                Windows
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Crear Nuevo Proyecto
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Inicializa una carpeta local en Windows con soporte multi-agente y permisos configurables.
              </p>
            </div>
            <div className="pt-3 border-t border-cyan-900/40 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Configurar nuevo entorno</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Dropzone for AI Studio ZIP */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`md:col-span-2 p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col justify-between space-y-3 ${
              dragOver
                ? 'border-cyan-400 bg-cyan-950/30'
                : 'border-[#2c3346] bg-[#171923] hover:border-cyan-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-950/40">
                {isUploading ? <Sparkles size={20} className="animate-spin text-cyan-400" /> : <FileArchive size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-100">
                  {isUploading ? 'Desempaquetando ZIP de AI Studio...' : 'Importar ZIP de AI Studio o Clonar Repo'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Detección automática de package.json, scripts de Windows y dependencias locales.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-500 font-mono">Arrastra tu archivo .zip aquí</span>
              <label className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors shadow-lg shadow-cyan-900/30">
                <Upload size={13} />
                <span>Examinar Archivos</span>
                <input type="file" accept=".zip" onChange={handleFileInput} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Project Management Header & Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#232734] pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-100">Proyectos en el Sistema</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#1e2230] text-gray-300 font-mono text-[11px]">
                {filteredProjects.length}
              </span>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2.5 py-1.5 bg-[#181a24] border border-[#272c3c] focus:border-cyan-500 rounded-lg text-gray-200 text-xs outline-none"
                />
              </div>

              <div className="flex bg-[#181a24] p-1 rounded-lg border border-[#272c3c]">
                <button
                  onClick={() => setFilterTab('active')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    filterTab === 'active'
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Activos ({activeCount})
                </button>
                <button
                  onClick={() => setFilterTab('archived')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterTab === 'archived'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Archive size={11} />
                  <span>Archivados ({archivedCount})</span>
                </button>
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    filterTab === 'all'
                      ? 'bg-[#293042] text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Todos
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#282d3e] rounded-2xl space-y-3 bg-[#161822]/50">
              <FolderOpen size={32} className="mx-auto text-gray-600" />
              <p className="text-sm text-gray-400 font-medium">No se encontraron proyectos con ese filtro</p>
              <button
                onClick={onOpenNewProject}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl"
              >
                Crear un Proyecto Ahora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((proj) => {
                const isSelected = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative group ${
                      isSelected
                        ? 'bg-[#181c28] border-cyan-500/70 shadow-lg shadow-cyan-950/30'
                        : proj.isArchived
                        ? 'bg-[#14151c] border-[#222532] opacity-80'
                        : 'bg-[#151720] border-[#252a38] hover:border-[#384054]'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {renderPermissionBadge(proj.permissionLevel)}
                          {proj.techStack && (
                            <span className="px-2 py-0.5 rounded-md bg-[#1d212d] text-gray-300 text-[10px] font-mono border border-[#2b3142]">
                              {proj.techStack}
                            </span>
                          )}
                          {proj.isArchived && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/40 text-[10px] font-mono">
                              Archivado
                            </span>
                          )}
                        </div>

                        {/* Quick action buttons (Archive / Delete) */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {proj.isArchived ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUnarchiveProject(proj.id);
                              }}
                              title="Restaurar proyecto"
                              className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-950/80 rounded-lg transition-colors"
                            >
                              <ArchiveRestore size={13} />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onArchiveProject(proj.id);
                              }}
                              title="Archivar proyecto"
                              className="p-1.5 text-gray-400 hover:text-amber-300 hover:bg-[#252a3a] rounded-lg transition-colors"
                            >
                              <Archive size={13} />
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToDelete(proj);
                            }}
                            title="Eliminar proyecto"
                            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Title and Path */}
                      <div 
                        onClick={() => onSelectProject(proj.id)}
                        className="cursor-pointer"
                      >
                        <h3 className="font-semibold text-gray-100 text-sm flex items-center gap-2 hover:text-cyan-300 transition-colors">
                          <span>{proj.name}</span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 text-[10px] font-mono">
                              Activo
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {proj.description || proj.lastPromptSnippet}
                        </p>
                      </div>

                      <div className="text-[11px] text-gray-500 font-mono truncate">
                        📁 {proj.path}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[#232734] flex items-center justify-between text-[11px] text-gray-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} />
                        <span>{proj.lastActive}</span>
                      </span>

                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Abrir Workspace</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#161822] border border-rose-900/50 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 bg-rose-950/80 rounded-xl border border-rose-800/40">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">¿Eliminar Proyecto?</h3>
                <p className="text-xs text-gray-400">Esta acción removerá el proyecto del registro local</p>
              </div>
            </div>

            <div className="p-3 bg-[#111319] rounded-xl border border-[#242836] space-y-1">
              <div className="font-medium text-gray-200 text-xs">{projectToDelete.name}</div>
              <div className="text-[11px] text-gray-500 font-mono">{projectToDelete.path}</div>
            </div>

            <p className="text-xs text-gray-300">
              ¿Estás seguro de que deseas eliminar este proyecto? Los archivos en tu disco no se borrarán sin confirmación adicional.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 bg-[#222634] hover:bg-[#2b3144] text-gray-300 rounded-xl text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-950"
              >
                Sí, Eliminar Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

