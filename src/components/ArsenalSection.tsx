import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Network,
  Code,
  Search,
  Wrench,
  Radio,
  ExternalLink,
  Sliders,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SkillCategory, Skill } from '../types';
import { soundFx } from '../utils/audio';

export const ArsenalSection: React.FC = () => {
  const { skills = [], setSelectedProject, projects = [] } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const categories: (string | SkillCategory)[] = [
    'ALL',
    'OFFENSIVE SECURITY',
    'DEFENSIVE SECURITY',
    'NETWORKING',
    'PROGRAMMING',
    'OSINT',
    'TOOLS',
  ];

  const filteredSkills = safeSkills.filter((skill) => {
    const matchesCat = activeCategory === 'ALL' || skill.category === activeCategory;
    const matchesQuery =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getExperienceBadge = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40';
      case 'Advanced':
        return 'border-cyan-500/50 text-cyan-400 bg-cyan-950/40';
      case 'Intermediate':
        return 'border-amber-500/50 text-amber-400 bg-amber-950/40';
      default:
        return 'border-zinc-700 text-zinc-400 bg-zinc-900';
    }
  };

  const handleProjectClick = (projectName: string) => {
    const found = safeProjects.find((p) => p.name.toLowerCase().includes(projectName.toLowerCase()));
    if (found) {
      soundFx.playKeyClick();
      setSelectedProject(found);
    }
  };

  return (
    <section id="arsenal" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Cpu className="w-3.5 h-3.5" /> COMPETENCY MATRIX // TOOLING & DISCIPLINES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Security Arsenal
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-1">
            Offensive vectors, defensive hardening, network internals & specialized tools.
          </p>
        </div>

        {/* Search tool filter */}
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter skills or tools..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/70 text-xs font-mono text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-arsenal-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            onClick={() => {
              soundFx.playKeyClick();
              setActiveCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full p-12 text-center font-mono text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            NO ARSENAL COMPONENTS FOUND MATCHING ACTIVE FILTER CRITERIA
          </div>
        ) : (
          filteredSkills.map((skill) => (
            <div
              key={skill.id}
              id={`skill-card-${skill.id}`}
              className="p-5 rounded-xl border border-zinc-800/80 bg-[#090d16]/70 backdrop-blur-sm hover:border-zinc-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Name, category, level */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-mono text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getExperienceBadge(
                      skill.experienceLevel
                    )}`}
                  >
                    {skill.experienceLevel}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                  {skill.description}
                </p>
              </div>

              {/* Footer: Proficiency bar and Projects using it */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80 font-mono text-xs">
                {/* Proficiency Visual Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>PROFICIENCY</span>
                    <span className="text-emerald-400 font-semibold">{skill.proficiencyPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiencyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Projects Using It Tags */}
                {skill.projectsUsingIt && skill.projectsUsingIt.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-zinc-400">USED IN:</span>
                    {skill.projectsUsingIt.map((projName) => (
                      <button
                        key={projName}
                        onClick={() => handleProjectClick(projName)}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 hover:bg-emerald-950/60 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-300 transition-colors cursor-pointer"
                        title="View related project"
                      >
                        {projName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
