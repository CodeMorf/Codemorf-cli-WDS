import React, { useState } from 'react';
import { 
  Brain, 
  Search, 
  Plus, 
  Pin, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Tag, 
  FolderKanban, 
  User, 
  Bot, 
  Check, 
  Flame
} from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryCenterProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'updatedAt'>) => void;
  onDeleteMemory: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const MemoryCenter: React.FC<MemoryCenterProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  onTogglePin
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('Project Memory');
  const [tags, setTags] = useState('');

  const categories = ['All', 'User Memory', 'Workspace Memory', 'Project Memory', 'Agent Memory', 'Task Memory'];

  const filteredMemories = memories.filter((m) => {
    if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddMemory({
      title,
      content,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      pinned: false
    });
    setTitle('');
    setContent('');
    setTags('');
    setShowAddModal(false);
  };

  const getCategoryColor = (cat: MemoryItem['category']) => {
    switch (cat) {
      case 'User Memory':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/40';
      case 'Workspace Memory':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/40';
      case 'Project Memory':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/40';
      case 'Agent Memory':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40';
      case 'Task Memory':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/40';
    }
  };

  return (
    <div id="memory-center-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-pink-950/80 text-pink-400 border border-pink-800/50 rounded-lg">
            <Brain size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Neural Memory & Cognitive Context Center</h2>
            <p className="text-[11px] text-gray-400">
              Persistencia de hechos, reglas de usuario, credenciales locales y directivas de arquitectura
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-cyan-900/30"
          >
            <Plus size={13} />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 px-6 border-b border-[#232734] bg-[#14161d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
                  : 'bg-[#1b1e27] text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-[#101217] px-3 py-1.5 rounded-lg border border-[#282d3c] text-xs w-64">
          <Search size={12} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en memorias..."
            className="w-full bg-transparent outline-none text-gray-200 text-xs"
          />
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                mem.pinned
                  ? 'bg-[#1c1e28] border-cyan-500/50 shadow-md shadow-cyan-950/20'
                  : 'bg-[#14161d] border-[#252a38] hover:border-[#353c4e]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${getCategoryColor(mem.category)}`}>
                    {mem.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(mem.id)}
                      className={`p-1 rounded transition-colors ${mem.pinned ? 'text-cyan-400 bg-cyan-950/50' : 'text-gray-500 hover:text-gray-300'}`}
                      title={mem.pinned ? 'Desanclar' : 'Anclar memoria'}
                    >
                      <Pin size={12} className={mem.pinned ? 'fill-cyan-400' : ''} />
                    </button>
                    <button
                      onClick={() => onDeleteMemory(mem.id)}
                      className="p-1 text-gray-500 hover:text-rose-400 rounded transition-colors"
                      title="Olvidar / Eliminar"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-100 text-sm leading-snug">{mem.title}</h3>
                <p className="text-gray-300 text-xs leading-relaxed">{mem.content}</p>
              </div>

              {/* Tags & Footer */}
              <div className="pt-2 border-t border-[#232734] flex items-center justify-between text-[10px] text-gray-500">
                <div className="flex flex-wrap gap-1">
                  {mem.tags.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.2 bg-[#202432] text-gray-400 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="font-mono">{mem.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMemory}
            className="w-full max-w-md bg-[#181a22] border border-[#2e3444] rounded-xl shadow-2xl p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#292f3e] pb-3">
              <h3 className="font-semibold text-gray-100 text-sm">Añadir Hecho a la Memoria del Agente</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Título de la memoria</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Estructura de carpetas de microservicios"
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none"
              >
                <option value="User Memory">User Memory</option>
                <option value="Workspace Memory">Workspace Memory</option>
                <option value="Project Memory">Project Memory</option>
                <option value="Agent Memory">Agent Memory</option>
                <option value="Task Memory">Task Memory</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Contenido contextual</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe la regla o directiva para los agentes..."
                rows={3}
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Etiquetas (separadas por comas)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Database, SQL, Auth"
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-[#252a36] hover:bg-[#2f3545] text-gray-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
              >
                Guardar Memoria
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
