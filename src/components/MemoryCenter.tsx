import React, { useEffect, useMemo, useState } from 'react';
import { Brain, Pin, Plus, Search, Trash2 } from 'lucide-react';
import type { MemoryItem } from '../types';
import { isTauri, memoryDelete, memoryList, memoryUpsert } from '../lib/native';

interface MemoryCenterProps {
  memories: MemoryItem[];
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'updatedAt'>) => void;
  onDeleteMemory: (id: string) => void;
  onTogglePin: (id: string) => void;
}

type NativeRow = { id: number; scope: string; key: string; value: string; pinned: boolean; updated_at: string };

function rowToMemory(row: NativeRow): MemoryItem {
  let payload: any = {};
  try { payload = JSON.parse(row.value); } catch { payload = { content: row.value }; }
  return {
    id: `native:${row.id}`,
    category: (payload.category || row.scope) as MemoryItem['category'],
    title: row.key,
    content: payload.content || '',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    pinned: row.pinned,
    updatedAt: new Date(row.updated_at).toLocaleString()
  };
}

export const MemoryCenter: React.FC<MemoryCenterProps> = ({ memories, onAddMemory, onDeleteMemory, onTogglePin }) => {
  const [nativeMemories, setNativeMemories] = useState<MemoryItem[] | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('Project Memory');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    if (!isTauri()) return;
    try {
      const rows = await memoryList();
      setNativeMemories(rows.map(rowToMemory));
      setError('');
    } catch (e) { setError(String(e)); }
  };

  useEffect(() => { refresh(); }, []);
  const source = nativeMemories ?? memories;
  const categories = ['All', 'User Memory', 'Workspace Memory', 'Project Memory', 'Agent Memory', 'Task Memory'];
  const filtered = useMemo(() => source.filter(m => {
    if (categoryFilter !== 'All' && m.category !== categoryFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q));
  }), [source, categoryFilter, query]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (isTauri()) {
      try {
        await memoryUpsert(category, title.trim(), JSON.stringify({ category, content: content.trim(), tags: parsedTags }), false);
        await refresh();
      } catch (err) { setError(String(err)); return; }
    } else {
      onAddMemory({ title: title.trim(), content: content.trim(), category, tags: parsedTags, pinned: false });
    }
    setTitle(''); setContent(''); setTags(''); setShowAdd(false);
  };

  const remove = async (item: MemoryItem) => {
    if (item.id.startsWith('native:') && isTauri()) {
      await memoryDelete(Number(item.id.slice(7)));
      await refresh();
    } else onDeleteMemory(item.id);
  };

  const togglePin = async (item: MemoryItem) => {
    if (item.id.startsWith('native:') && isTauri()) {
      await memoryUpsert(item.category, item.title, JSON.stringify({ category: item.category, content: item.content, tags: item.tags }), !item.pinned);
      await refresh();
    } else onTogglePin(item.id);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      <div className="px-6 py-3 border-b border-[#232734] bg-[#181a22] flex items-center gap-3">
        <Brain size={18} className="text-pink-400"/>
        <div className="flex-1"><h2 className="font-semibold text-sm">Memory Center</h2><p className="text-[11px] text-gray-500">{isTauri() ? 'SQLite local persistente' : 'Preview en memoria del navegador'}</p></div>
        <button onClick={() => setShowAdd(true)} className="px-3 py-1.5 bg-cyan-600 rounded flex items-center gap-1"><Plus size={13}/> Añadir</button>
      </div>
      {error && <div className="px-6 py-2 bg-rose-950/40 text-rose-300 border-b border-rose-900">{error}</div>}
      <div className="px-6 py-3 border-b border-[#232734] flex flex-wrap gap-2 items-center bg-[#14161c]">
        {categories.map(cat => <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-2.5 py-1 rounded-full ${categoryFilter === cat ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50' : 'bg-[#20232c] text-gray-400'}`}>{cat}</button>)}
        <div className="ml-auto flex items-center gap-2 bg-[#101217] border border-[#2a3040] rounded px-3 py-1.5"><Search size={12}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar memoria" className="bg-transparent outline-none"/></div>
      </div>
      <div className="flex-1 overflow-auto p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
        {filtered.map(mem => <article key={mem.id} className={`p-4 rounded-xl border ${mem.pinned ? 'border-cyan-600/60 bg-[#1a1d27]' : 'border-[#252a38] bg-[#14161d]'}`}>
          <div className="flex items-start justify-between gap-2"><span className="text-[10px] font-mono text-cyan-300">{mem.category}</span><div className="flex gap-1"><button onClick={() => togglePin(mem)} className={mem.pinned ? 'text-cyan-400' : 'text-gray-500'}><Pin size={12}/></button><button onClick={() => remove(mem)} className="text-gray-500 hover:text-rose-400"><Trash2 size={12}/></button></div></div>
          <h3 className="mt-2 font-semibold text-gray-100">{mem.title}</h3>
          <p className="mt-2 text-gray-300 leading-relaxed whitespace-pre-wrap">{mem.content}</p>
          <div className="mt-3 pt-2 border-t border-[#232734] flex flex-wrap gap-1">{mem.tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#222631] text-gray-400">#{tag}</span>)}</div>
          <div className="mt-2 text-[10px] text-gray-600 font-mono">{mem.updatedAt}</div>
        </article>)}
      </div>

      {showAdd && <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"><form onSubmit={add} className="w-full max-w-md p-5 rounded-xl bg-[#181a22] border border-[#303647] space-y-3">
        <h3 className="font-semibold text-sm">Guardar memoria persistente</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className="w-full bg-[#101217] border border-[#2b303e] rounded px-3 py-2 outline-none" required/>
        <select value={category} onChange={e => setCategory(e.target.value as MemoryItem['category'])} className="w-full bg-[#101217] border border-[#2b303e] rounded px-3 py-2"><option>User Memory</option><option>Workspace Memory</option><option>Project Memory</option><option>Agent Memory</option><option>Task Memory</option></select>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Contenido" rows={5} className="w-full bg-[#101217] border border-[#2b303e] rounded px-3 py-2 outline-none" required/>
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tags, separadas, por comas" className="w-full bg-[#101217] border border-[#2b303e] rounded px-3 py-2 outline-none"/>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowAdd(false)} className="px-3 py-2 bg-[#252a36] rounded">Cancelar</button><button className="px-3 py-2 bg-cyan-600 rounded">Guardar</button></div>
      </form></div>}
    </div>
  );
};
