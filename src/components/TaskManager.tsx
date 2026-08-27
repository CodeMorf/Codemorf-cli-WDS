import React, { useState } from 'react';
import { 
  ListTodo, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  FolderGit2, 
  Bot, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { KanbanTask } from '../types';

interface TaskManagerProps {
  tasks: KanbanTask[];
  onAddTask: (task: Omit<KanbanTask, 'id'>) => void;
  onMoveTask: (taskId: string, targetColumn: KanbanTask['column']) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onMoveTask
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAgent, setNewAgent] = useState('Frontend Agent');
  const [newPriority, setNewPriority] = useState<KanbanTask['priority']>('High');
  const [newDescription, setNewDescription] = useState('');

  const columns: KanbanTask['column'][] = ['BACKLOG', 'TODO', 'WORKING', 'VERIFY', 'DONE'];

  const filteredTasks = tasks.filter(t => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle,
      column: 'TODO',
      agent: newAgent,
      priority: newPriority,
      project: 'ErogaAI SaaS',
      branch: 'feat/task-new',
      progress: 10,
      date: 'Hoy',
      description: newDescription || 'Tarea autogenerada para el agente.',
      tags: ['Autonomous', 'Agent']
    });
    setNewTitle('');
    setNewDescription('');
    setShowNewModal(false);
  };

  const getPriorityBadge = (priority: KanbanTask['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/50';
      case 'High':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/50';
      case 'Medium':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/50';
      case 'Low':
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div id="task-manager-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-950/80 text-amber-400 border border-amber-800/50 rounded-lg">
            <ListTodo size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Task Manager & Kanban Board</h2>
            <p className="text-[11px] text-gray-400">
              {tasks.length} tareas asignadas y sincronizadas con los agentes del proyecto
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5 bg-[#1f232e] border border-[#2b303e] rounded-lg px-2.5 py-1 text-xs">
            <Filter size={12} className="text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-gray-300 outline-none cursor-pointer"
            >
              <option value="all">Todas las prioridades</option>
              <option value="Critical">Crítica</option>
              <option value="High">Alta</option>
              <option value="Medium">Media</option>
              <option value="Low">Baja</option>
            </select>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-cyan-900/30"
          >
            <Plus size={13} />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.column === col);
          return (
            <div
              key={col}
              className="w-72 bg-[#13151b] border border-[#232734] rounded-xl flex flex-col overflow-hidden shrink-0 shadow-lg"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-[#232734] bg-[#181a22] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-200 text-xs">{col}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#252a36] text-gray-400 rounded-full font-mono">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 p-2.5 overflow-y-auto space-y-2.5">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-[#1a1c25] border border-[#272c3a] hover:border-cyan-500/50 transition-all shadow-sm space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-200 text-xs leading-snug">{task.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono shrink-0 ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-2">{task.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>Progreso</span>
                        <span className="font-mono">{task.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#12141a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] px-1.5 py-0.2 bg-[#232734] text-gray-400 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer with Agent & Column Switcher */}
                    <div className="pt-2 border-t border-[#232734] flex items-center justify-between text-[10px] text-gray-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <Bot size={11} className="text-cyan-400 shrink-0" />
                        <span className="truncate">{task.agent}</span>
                      </div>

                      {/* Quick Move Dropdown */}
                      <select
                        value={task.column}
                        onChange={(e) => onMoveTask(task.id, e.target.value as any)}
                        className="bg-[#242936] text-gray-300 border border-[#313748] rounded px-1.5 py-0.5 text-[10px] outline-none cursor-pointer"
                      >
                        {columns.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-600 text-xs border border-dashed border-[#232734] rounded-lg">
                    Sin tareas
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-md bg-[#181a22] border border-[#2e3444] rounded-xl shadow-2xl p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#292f3e] pb-3">
              <h3 className="font-semibold text-gray-100 text-sm">Crear Nueva Tarea</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Título de la tarea</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej: Implementar autenticación JWT en backend"
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Agente asignado</label>
                <select
                  value={newAgent}
                  onChange={(e) => setNewAgent(e.target.value)}
                  className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none"
                >
                  <option value="Frontend Agent">Frontend Agent</option>
                  <option value="Backend Agent">Backend Agent</option>
                  <option value="QA Test Agent">QA Test Agent</option>
                  <option value="Security Auditor">Security Auditor</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Prioridad</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none"
                >
                  <option value="Low">Baja</option>
                  <option value="Medium">Media</option>
                  <option value="High">Alta</option>
                  <option value="Critical">Crítica</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Descripción y criterios de aceptación</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Detalla lo que el agente debe completar..."
                rows={3}
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 bg-[#252a36] hover:bg-[#2f3545] text-gray-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
              >
                Guardar Tarea
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
