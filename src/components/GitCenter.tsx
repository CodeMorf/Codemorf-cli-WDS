import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  GitMerge, 
  ArrowDown, 
  ArrowUp, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileCode2, 
  User, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const GitCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'changes' | 'commits' | 'prs'>('changes');
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('master');
  const [stagedFiles, setStagedFiles] = useState([
    { path: '.env.example', status: 'modified', additions: 3, deletions: 0 },
    { path: 'server/db/schema.ts', status: 'modified', additions: 50, deletions: 0 },
    { path: 'src/components/ErogaDashboard.tsx', status: 'added', additions: 180, deletions: 0 }
  ]);

  const commits = [
    { hash: '7f9a2b1', message: 'feat(auth): integrate multi-agent sandbox and JWT expiry', author: 'Frontend Agent', time: 'Hace 15 min', passedTests: true },
    { hash: '3e1c94d', message: 'refactor(server): mount Vite dev middleware in Express', author: 'Kitgiz', time: 'Hace 2 horas', passedTests: true },
    { hash: '1a88f02', message: 'init: bootstrap AI Studio export repository', author: 'CodeMorf AutoInit', time: 'Ayer', passedTests: true }
  ];

  const pullRequests = [
    {
      id: 14,
      title: 'feat: Multi-tenant SaaS structure with PostgreSQL and Drizzle',
      branch: 'feat/multi-tenant',
      target: 'master',
      status: 'Open (Ready for review)',
      reviewers: ['Security Auditor', 'Kitgiz'],
      checks: '4 / 4 checks passed',
      filesChanged: 14,
      additions: 644,
      deletions: 0
    },
    {
      id: 13,
      title: 'fix: Cross-Origin Isolation headers for WebAssembly Tauri runner',
      branch: 'fix/wasm-headers',
      target: 'master',
      status: 'Merged',
      reviewers: ['Backend Agent'],
      checks: 'All checks passed',
      filesChanged: 2,
      additions: 18,
      deletions: 4
    }
  ];

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    alert(`Commit creado: "${commitMessage}" en branch ${selectedBranch}`);
    setCommitMessage('');
  };

  return (
    <div id="git-center-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header & Toolbar */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-purple-950/80 text-purple-400 border border-purple-800/50 rounded-lg">
            <GitBranch size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Git & GitHub Command Center</h2>
            <p className="text-[11px] text-gray-400">
              Control de versiones integrado, staging, diff visual y revisión de Pull Requests
            </p>
          </div>
        </div>

        {/* Git Action Buttons matching spec */}
        <div className="flex items-center gap-2">
          {/* Branch Switcher */}
          <div className="flex items-center gap-1.5 bg-[#12141a] border border-[#2c3242] px-2.5 py-1 rounded-lg">
            <GitBranch size={12} className="text-purple-400" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-gray-200 outline-none font-mono text-xs cursor-pointer"
            >
              <option value="master">master</option>
              <option value="develop">develop</option>
              <option value="feat/multi-tenant">feat/multi-tenant</option>
              <option value="feat/frontend-ui">feat/frontend-ui</option>
            </select>
          </div>

          <button
            onClick={() => alert('Pulling latest commits from remote...')}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#222634] hover:bg-[#2c3246] text-gray-300 rounded-md transition-colors"
            title="Git Pull"
          >
            <ArrowDown size={12} className="text-emerald-400" />
            <span>Pull</span>
          </button>

          <button
            onClick={() => alert('Pushing branch to origin master...')}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#222634] hover:bg-[#2c3246] text-gray-300 rounded-md transition-colors"
            title="Git Push"
          >
            <ArrowUp size={12} className="text-cyan-400" />
            <span>Push</span>
          </button>

          <button
            onClick={() => setActiveTab('prs')}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-md transition-colors shadow-md shadow-cyan-900/30"
          >
            <GitPullRequest size={12} />
            <span>Create PR</span>
          </button>
        </div>
      </div>

      {/* Tabs Subheader */}
      <div className="px-6 border-b border-[#232734] bg-[#14161c] flex gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('changes')}
          className={`py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'changes' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>Cambios & Staging</span>
          <span className="px-1.5 py-0.2 bg-[#262b3a] rounded-full text-[10px] font-mono">{stagedFiles.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('commits')}
          className={`py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'commits' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>Historial de Commits</span>
          <span className="px-1.5 py-0.2 bg-[#262b3a] rounded-full text-[10px] font-mono">{commits.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('prs')}
          className={`py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'prs' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>Pull Requests</span>
          <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 border border-purple-800/40 rounded-full text-[10px] font-mono">
            {pullRequests.length}
          </span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'changes' && (
          <div className="max-w-4xl space-y-6">
            {/* Commit Form Box */}
            <form onSubmit={handleCommit} className="p-4 bg-[#14161d] border border-[#252a38] rounded-xl space-y-3">
              <div className="font-semibold text-gray-200">Crear Commit en {selectedBranch}</div>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="feat(auth): mensaje descriptivo del cambio..."
                className="w-full bg-[#101218] border border-[#2a2f3e] rounded-lg px-3 py-2 text-gray-200 outline-none focus:border-cyan-500 font-mono text-xs"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commitMessage.trim()}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Commit a {selectedBranch}
                </button>
              </div>
            </form>

            {/* Changed Files Table */}
            <div className="space-y-2">
              <div className="font-semibold text-gray-300 text-xs">Archivos en Staging</div>
              <div className="border border-[#252a38] rounded-xl overflow-hidden bg-[#13151b]">
                {stagedFiles.map((file, idx) => (
                  <div key={idx} className="p-3 border-b border-[#202432] flex items-center justify-between hover:bg-white/[0.02]">
                    <div className="flex items-center gap-2.5 font-mono">
                      <FileCode2 size={14} className="text-cyan-400" />
                      <span className="text-gray-200">{file.path}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-emerald-400">+{file.additions}</span>
                      <span className="text-rose-400">-{file.deletions}</span>
                      <span className="px-2 py-0.5 rounded bg-[#202432] text-gray-400 text-[10px] uppercase">
                        {file.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'commits' && (
          <div className="max-w-4xl space-y-3">
            {commits.map((c, idx) => (
              <div key={idx} className="p-4 bg-[#14161d] border border-[#252a38] rounded-xl flex items-center justify-between hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-950/70 text-purple-400 border border-purple-800/40 rounded-lg">
                    <GitCommit size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200 text-sm">{c.message}</div>
                    <div className="flex items-center gap-3 text-gray-400 text-[11px] mt-1">
                      <span className="flex items-center gap-1 font-mono text-cyan-400">
                        {c.hash}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {c.author}
                      </span>
                      <span>•</span>
                      <span>{c.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800/50">
                    <CheckCircle2 size={11} />
                    <span>CI Tests Pass</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prs' && (
          <div className="max-w-4xl space-y-4">
            {pullRequests.map((pr) => (
              <div key={pr.id} className="p-5 bg-[#14161d] border border-[#252a38] rounded-xl space-y-3 shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-950 text-cyan-400 border border-cyan-800/50 rounded-xl">
                      <GitPullRequest size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100 text-sm flex items-center gap-2">
                        <span>#{pr.id} {pr.title}</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-full text-[10px]">
                          {pr.status}
                        </span>
                      </h3>
                      <div className="text-gray-400 font-mono text-xs mt-1">
                        {pr.branch} → {pr.target}
                      </div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors">
                    Revisar & Merge
                  </button>
                </div>

                <div className="pt-3 border-t border-[#232734] flex items-center justify-between text-gray-400 text-xs">
                  <div className="flex items-center gap-4">
                    <span>Revisores: {pr.reviewers.join(', ')}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono">{pr.checks}</span>
                  </div>
                  <div className="font-mono text-cyan-400">
                    +{pr.additions} / -{pr.deletions} líneas en {pr.filesChanged} archivos
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
