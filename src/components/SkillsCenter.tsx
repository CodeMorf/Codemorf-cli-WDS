import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Check, 
  Settings, 
  ShieldCheck, 
  Layers, 
  Database, 
  Rocket, 
  CheckCircle2, 
  GitPullRequest, 
  FileCode2, 
  Atom
} from 'lucide-react';
import { SkillItem } from '../types';

interface SkillsCenterProps {
  skills: SkillItem[];
  onToggleSkill: (id: string) => void;
}

export const SkillsCenter: React.FC<SkillsCenterProps> = ({
  skills,
  onToggleSkill
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom size={20} className="text-cyan-400" />;
      case 'FileCode2':
        return <FileCode2 size={20} className="text-blue-400" />;
      case 'Layers':
        return <Layers size={20} className="text-rose-400" />;
      case 'Database':
        return <Database size={20} className="text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck size={20} className="text-emerald-400" />;
      case 'Rocket':
        return <Rocket size={20} className="text-purple-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 size={20} className="text-teal-400" />;
      case 'GitPullRequest':
        return <GitPullRequest size={20} className="text-sky-400" />;
      default:
        return <Zap size={20} className="text-yellow-400" />;
    }
  };

  return (
    <div id="skills-center-view" className="flex-1 flex flex-col overflow-hidden bg-[#16171e] text-gray-200 text-xs">
      {/* Top Header */}
      <div className="h-12 px-6 border-b border-[#232734] bg-[#181a22] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-yellow-950/80 text-yellow-400 border border-yellow-800/50 rounded-lg">
            <Zap size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Agent Skills & Domain Capabilities</h2>
            <p className="text-[11px] text-gray-400">
              Activa o personaliza las habilidades especializadas inyectadas en el prompt de los agentes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-cyan-900/30"
          >
            <Plus size={13} />
            <span>Create Skill</span>
          </button>
        </div>
      </div>

      {/* Skills Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                skill.enabled
                  ? 'bg-[#181a24] border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : 'bg-[#14161c] border-[#252a38] opacity-70 hover:opacity-100'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-[#1c1f2b] rounded-xl border border-[#2d3346]">
                    {getIcon(skill.icon)}
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => onToggleSkill(skill.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      skill.enabled ? 'bg-cyan-500' : 'bg-[#292e3d]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        skill.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-100 text-sm">{skill.name}</h3>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    v{skill.version} • por {skill.author}
                  </div>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed">{skill.description}</p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#232734] flex items-center justify-between text-[11px] text-gray-400">
                <span className="font-mono text-cyan-300">{skill.rulesCount} directivas de IA</span>
                <button
                  onClick={() => alert(`Configuración de reglas para: ${skill.name}`)}
                  className="p-1 hover:text-white rounded hover:bg-white/5 transition-colors"
                >
                  <Settings size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
