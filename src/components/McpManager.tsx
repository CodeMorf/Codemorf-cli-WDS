import React, { useState } from 'react';
import { 
  Network, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  Terminal, 
  Server, 
  Wrench, 
  Database, 
  FolderGit2, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { McpServerItem } from '../types';

interface McpManagerProps {
  servers: McpServerItem[];
  onToggleServer: (id: string) => void;
  onAddServer: (server: Omit<McpServerItem, 'id'>) => void;
}

export const McpManager: React.FC<McpManagerProps> = ({
  servers,
  onToggleServer,
  onAddServer
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [transport, setTransport] = useState<'stdio' | 'sse'>('stdio');
  const [command, setCommand] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !command.trim()) return;
    onAddServer({
      name,
      transport,
      command,
      status: 'connected',
      toolsCount: 4,
      resourcesCount: 2,
      promptsCount: 1
    });
    setName('');
    setCommand('');
    setShowAddModal(false);
  };

  return (
    <div id="mcp-manager-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 rounded-lg">
            <Network size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Model Context Protocol (MCP) Manager</h2>
            <p className="text-[11px] text-gray-400">
              Conecta herramientas externas, servidores de base de datos y plugins vía protocolo estándar MCP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-cyan-900/30"
          >
            <Plus size={13} />
            <span>Add MCP Server</span>
          </button>
        </div>
      </div>

      {/* Servers List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-xl bg-[#14161c] border border-[#252a38] hover:border-[#353c4e] transition-all space-y-4 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1c1f2b] rounded-xl border border-[#2b3040]">
                    <Server size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100 text-sm">{srv.name}</h3>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      Transport: <span className="text-purple-300 font-semibold">{srv.transport.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                    srv.status === 'connected'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                      : 'bg-rose-950 text-rose-300 border-rose-800/50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${srv.status === 'connected' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span>{srv.status === 'connected' ? 'Connected' : 'Disconnected'}</span>
                </span>
              </div>

              {/* Command box */}
              <div className="p-2.5 bg-[#101217] rounded-lg border border-[#222734] font-mono text-[11px] text-gray-300 truncate">
                <span className="text-cyan-400">$ </span>{srv.command}
              </div>

              {/* Counts & Actions */}
              <div className="pt-2 border-t border-[#232734] flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3 text-[11px]">
                  <span>{srv.toolsCount} Tools</span>
                  <span>•</span>
                  <span>{srv.resourcesCount} Resources</span>
                  <span>•</span>
                  <span>{srv.promptsCount} Prompts</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleServer(srv.id)}
                    className="p-1.5 bg-[#202430] hover:bg-[#2c3242] text-gray-300 rounded transition-colors"
                    title="Reconectar servidor MCP"
                  >
                    <RotateCw size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add MCP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="w-full max-w-md bg-[#181a22] border border-[#2e3444] rounded-xl shadow-2xl p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#292f3e] pb-3">
              <h3 className="font-semibold text-gray-100 text-sm">Registrar Nuevo MCP Server</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Nombre del Servidor</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Postgres Schema Inspector MCP"
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Transporte Protocolar</label>
              <select
                value={transport}
                onChange={(e) => setTransport(e.target.value as any)}
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 outline-none"
              >
                <option value="stdio">stdio (Standard I/O CLI)</option>
                <option value="sse">sse (Server-Sent Events HTTP)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium">Comando de arranque o URL</label>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="npx -y @modelcontextprotocol/server-postgres postgresql://..."
                className="w-full bg-[#12141a] border border-[#2b303e] rounded-lg px-3 py-2 text-gray-200 font-mono outline-none focus:border-cyan-500"
                required
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
                Conectar MCP
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
