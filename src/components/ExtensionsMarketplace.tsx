import React, { useState } from 'react';
import { 
  Puzzle, 
  Search, 
  Download, 
  Star, 
  Check, 
  RotateCw, 
  Sparkles, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { ExtensionItem } from '../types';

interface ExtensionsMarketplaceProps {
  extensions: ExtensionItem[];
  onToggleInstall: (id: string) => void;
}

export const ExtensionsMarketplace: React.FC<ExtensionsMarketplaceProps> = ({
  extensions,
  onToggleInstall
}) => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed' | 'updates'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Development', 'AI', 'MCP', 'Git', 'Browser', 'Database', 'DevOps'];

  const filteredExtensions = extensions.filter(ext => {
    if (activeTab === 'installed' && !ext.installed) return false;
    if (activeTab === 'updates' && !ext.hasUpdate) return false;
    if (selectedCategory !== 'All' && ext.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return ext.name.toLowerCase().includes(q) || ext.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div id="extensions-marketplace-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-lg">
            <Puzzle size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Extensions & MCP Ecosystem Marketplace</h2>
            <p className="text-[11px] text-gray-400">
              Instala complementos, analizadores de código y conectores de protocolo MCP
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#101217] px-3 py-1.5 rounded-lg border border-[#282d3c] text-xs w-64">
          <Search size={12} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar extensiones o MCP..."
            className="w-full bg-transparent outline-none text-gray-200 text-xs"
          />
        </div>
      </div>

      {/* Tabs & Categories Bar */}
      <div className="px-6 border-b border-[#232734] bg-[#14161c] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'marketplace' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'installed' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>Instalados</span>
            <span className="px-1.5 py-0.2 bg-[#252a38] text-gray-400 rounded-full font-mono text-[10px]">
              {extensions.filter(e => e.installed).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'updates' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>Actualizaciones</span>
            {extensions.some(e => e.hasUpdate) && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExtensions.map((ext) => (
            <div
              key={ext.id}
              className="p-5 rounded-xl bg-[#14161c] border border-[#252a38] hover:border-[#353c4e] transition-all flex flex-col justify-between space-y-4 shadow-md"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-100 text-sm">{ext.name}</h3>
                    <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                      por {ext.author} • v{ext.version}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#1f232e] text-cyan-300 rounded border border-[#2d3344] font-mono">
                    {ext.category}
                  </span>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
                  {ext.description}
                </p>
              </div>

              {/* Footer with Rating & Install Button */}
              <div className="pt-3 border-t border-[#232734] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star size={11} className="fill-amber-400" />
                    <span>{ext.rating}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Download size={11} />
                    <span>{ext.downloads}</span>
                  </span>
                </div>

                <button
                  onClick={() => onToggleInstall(ext.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    ext.installed
                      ? 'bg-[#232734] text-gray-300 hover:bg-rose-950/60 hover:text-rose-300 border border-[#2f3546]'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950'
                  }`}
                >
                  {ext.installed ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span>Instalado</span>
                    </>
                  ) : (
                    <span>Instalar</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
