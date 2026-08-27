import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode2, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  Sparkles,
  FileText,
  Settings,
  Code2
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  modified?: boolean;
}

export const FileExplorerAndEditor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    src: true,
    'src/components': true,
    server: true,
    'server/db': true
  });
  const [activeFilePath, setActiveFilePath] = useState('server/db/schema.ts');
  const [copied, setCopied] = useState(false);

  const fileTree: FileNode = {
    name: 'ErogaAI-Root',
    type: 'folder',
    path: '',
    children: [
      {
        name: 'src',
        type: 'folder',
        path: 'src',
        children: [
          {
            name: 'components',
            type: 'folder',
            path: 'src/components',
            children: [
              {
                name: 'ErogaDashboard.tsx',
                type: 'file',
                path: 'src/components/ErogaDashboard.tsx',
                modified: true,
                content: `import React, { useState } from 'react';
import { ExpensesTable } from './ExpensesTable';

export function ErogaDashboard() {
  const [expenses, setExpenses] = useState([]);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100">
      <h1 className="text-2xl font-bold text-cyan-400">ErogaAI SaaS Dashboard</h1>
      <p className="text-slate-400">Gestión multi-empresa y comprobantes SAT</p>
      <ExpensesTable data={expenses} />
    </div>
  );
}`
              },
              {
                name: 'ExpensesTable.tsx',
                type: 'file',
                path: 'src/components/ExpensesTable.tsx',
                modified: false,
                content: `import React from 'react';

export function ExpensesTable({ data }: { data: any[] }) {
  return (
    <table className="w-full text-left mt-4 border border-slate-800">
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Monto</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}><td>{item.title}</td><td>{item.amount}</td></tr>
        ))}
      </tbody>
    </table>
  );
}`
              }
            ]
          },
          {
            name: 'App.tsx',
            type: 'file',
            path: 'src/App.tsx',
            modified: true,
            content: `import React from 'react';
import { ErogaDashboard } from './components/ErogaDashboard';

export default function App() {
  return <ErogaDashboard />;
}`
          },
          {
            name: 'main.tsx',
            type: 'file',
            path: 'src/main.tsx',
            modified: false,
            content: `import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);`
          }
        ]
      },
      {
        name: 'server',
        type: 'folder',
        path: 'server',
        children: [
          {
            name: 'db',
            type: 'folder',
            path: 'server/db',
            children: [
              {
                name: 'schema.ts',
                type: 'file',
                path: 'server/db/schema.ts',
                modified: true,
                content: `import { pgTable, serial, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow()
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  title: text('title').notNull(),
  category: text('category').notNull(),
  amount: numeric('amount').notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow()
});`
              }
            ]
          },
          {
            name: 'index.ts',
            type: 'file',
            path: 'server/index.ts',
            modified: true,
            content: `import express from 'express';
import { db } from './db';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(PORT, () => {
  console.log('Server active on port ' + PORT);
});`
          }
        ]
      },
      {
        name: '.env.example',
        type: 'file',
        path: '.env.example',
        modified: true,
        content: `PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eroga_db
JWT_SECRET=codemorf_hyper_secure_key_2026`
      },
      {
        name: 'package.json',
        type: 'file',
        path: 'package.json',
        modified: true,
        content: `{
  "name": "eroga-ai-saas",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build"
  },
  "dependencies": {
    "drizzle-orm": "^0.39.0",
    "express": "^4.21.2",
    "react": "^19.0.0"
  }
}`
      },
      {
        name: 'README.md',
        type: 'file',
        path: 'README.md',
        modified: true,
        content: `# ErogaAI SaaS Local

Proyecto autónomo exportado de Google AI Studio e integrado con CodeMorf CLI.
- Backend: Express + Drizzle ORM + PostgreSQL
- Frontend: React 19 + Tailwind CSS
- Multi-Agent Support: Compatible con agentes autónomos paralelos.`
      }
    ]
  };

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const findFileContent = (node: FileNode, path: string): string => {
    if (node.path === path && node.content) return node.content;
    if (node.children) {
      for (const child of node.children) {
        const res = findFileContent(child, path);
        if (res) return res;
      }
    }
    return '// Archivo vacío';
  };

  const activeContent = findFileContent(fileTree, activeFilePath);

  const renderTree = (node: FileNode) => {
    if (node.type === 'folder') {
      const isOpen = openFolders[node.path];
      return (
        <div key={node.path} className="space-y-0.5">
          {node.name !== 'ErogaAI-Root' && (
            <button
              onClick={() => toggleFolder(node.path)}
              className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/[0.04] text-gray-400 hover:text-gray-200 text-left"
            >
              {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {isOpen ? <FolderOpen size={13} className="text-cyan-400" /> : <Folder size={13} className="text-gray-400" />}
              <span className="truncate">{node.name}</span>
            </button>
          )}
          {isOpen && node.children && (
            <div className={node.name !== 'ErogaAI-Root' ? 'pl-3.5 space-y-0.5 border-l border-[#222632] ml-2' : 'space-y-0.5'}>
              {node.children.map(child => renderTree(child))}
            </div>
          )}
        </div>
      );
    }

    const isSelected = activeFilePath === node.path;
    return (
      <button
        key={node.path}
        onClick={() => setActiveFilePath(node.path)}
        className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-colors font-mono text-[11px] ${
          isSelected
            ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-800/40 font-medium'
            : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <FileCode2 size={12} className={isSelected ? 'text-cyan-400' : 'text-gray-500'} />
          <span className="truncate">{node.name}</span>
        </div>
        {node.modified && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Modificado por agente" />
        )}
      </button>
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="file-explorer-editor-view" className="flex-1 flex overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* File Tree Explorer Sidebar */}
      <div className="w-64 bg-[#14151b] border-r border-[#232734] flex flex-col overflow-hidden shrink-0">
        <div className="p-3 border-b border-[#232734] bg-[#181a22] flex items-center justify-between">
          <span className="font-semibold text-gray-200 text-xs uppercase tracking-wider">Explorador de Archivos</span>
          <span className="text-[10px] text-emerald-400 font-mono">+14 mod</span>
        </div>

        {/* Search File Filter */}
        <div className="p-2 border-b border-[#232734]">
          <div className="flex items-center gap-2 bg-[#101217] px-2.5 py-1 rounded-lg border border-[#2a2f3e] text-xs">
            <Search size={12} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar archivos..."
              className="w-full bg-transparent outline-none text-gray-200 text-xs"
            />
          </div>
        </div>

        {/* File Tree List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {renderTree(fileTree)}
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#121319]">
        {/* Editor Tabs & Breadcrumbs */}
        <div className="h-10 px-4 border-b border-[#232734] bg-[#161820] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#121319] border-t-2 border-cyan-400 text-cyan-300 font-semibold rounded-t">
              <FileCode2 size={13} className="text-cyan-400" />
              <span>{activeFilePath.split('/').pop()}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-gray-500 text-[11px] hidden md:inline ml-2">{activeFilePath}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#222530] hover:bg-[#2c3040] text-gray-300 rounded text-xs transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Code Content View with Line Numbers & Minimap */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto font-mono text-[12px] leading-relaxed select-text space-y-0.5">
            {activeContent.split('\n').map((line, idx) => (
              <div key={idx} className="flex items-start gap-4 hover:bg-white/[0.02]">
                <span className="w-8 text-right text-gray-600 select-none text-[11px] shrink-0 font-mono">
                  {idx + 1}
                </span>
                <pre className="font-mono text-gray-200 whitespace-pre-wrap flex-1">{line}</pre>
              </div>
            ))}
          </div>

          {/* Minimap preview simulation */}
          <div className="w-20 bg-[#0e1014] border-l border-[#202430] hidden lg:block p-1 text-[4px] leading-tight text-gray-600 font-mono select-none overflow-hidden opacity-50">
            {activeContent.split('\n').slice(0, 40).map((line, idx) => (
              <div key={idx} className="truncate">{line || ' '}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
