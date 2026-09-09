import React, { useState } from 'react';
import {
  FolderGit2,
  Github,
  ExternalLink,
  Shield,
  Layers,
  CheckCircle2,
  AlertCircle,
  Terminal,
  X,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project, ProjectCategory, ProjectStatus } from '../types';
import { soundFx } from '../utils/audio';

export const ProjectsSection: React.FC = () => {
  const { projects = [], selectedProject, setSelectedProject } = useApp();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('ALL');

  const safeProjects = Array.isArray(projects) ? projects : [];

  const categories: ProjectCategory[] = [
    'ALL',
    'WEB SECURITY',
    'NETWORK',
    'PYTHON',
    'OSINT',
    'LINUX',
    'RESEARCH',
  ];

  const filteredProjects = safeProjects.filter((proj) => {
    if (activeCategory === 'ALL') return true;
    return proj.category === activeCategory;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40';
      case 'COMPLETED':
        return 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40';
      case 'RESEARCH':
        return 'border-amber-500/40 text-amber-400 bg-amber-950/40';
      case 'ARCHIVED':
        return 'border-zinc-700 text-zinc-400 bg-zinc-900';
    }
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <FolderGit2 className="w-3.5 h-3.5" /> REPOSITORIES // SECURITY ENGINEERING
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Featured Projects
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-1">
            Production security tools, packet inspectors, and offensive/defensive testbeds.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`tab-project-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            id={`project-card-${proj.id}`}
            className="rounded-xl border border-zinc-800/80 bg-[#090d16]/80 backdrop-blur-sm p-6 hover:border-zinc-700 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header: Status and Category */}
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                    proj.status
                  )}`}
                >
                  {proj.status}
                </span>
                <span className="text-zinc-500 text-[11px]">{proj.date}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold font-mono text-white group-hover:text-emerald-300 transition-colors mb-2">
                {proj.name}
              </h3>

              {/* Short Description */}
              <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-4">
                {proj.shortDescription}
              </p>

              {/* Security Concepts highlight */}
              <div className="space-y-2 mb-4 font-mono text-xs">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> KEY SECURITY CONCEPTS:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {proj.securityConcepts.slice(0, 3).map((concept) => (
                    <span
                      key={concept}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer: Tech stack and Action Buttons */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-3 font-mono text-xs">
              <div className="flex flex-wrap gap-1 text-[10px] text-zinc-500">
                {proj.technologies.slice(0, 4).map((tech) => (
                  <span key={tech} className="text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  id={`btn-open-detail-${proj.id}`}
                  onClick={() => {
                    soundFx.playKeyClick();
                    setSelectedProject(proj);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>CASE STUDY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {proj.githubLink && (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a
                      href={proj.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded border border-zinc-800 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rich Project Detail Modal */}
      {selectedProject && (
        <div
          id="project-detail-modal-overlay"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            id="project-detail-modal"
            className="w-full max-w-3xl max-h-[85vh] bg-[#090d16] border border-zinc-700 rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(
                    selectedProject.status
                  )}`}
                >
                  {selectedProject.status}
                </span>
                <span className="text-xs font-mono text-zinc-400">{selectedProject.category}</span>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
              <div>
                <h2 className="text-2xl font-bold font-mono text-white mb-2">
                  {selectedProject.name}
                </h2>
                <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                  {selectedProject.shortDescription}
                </p>
              </div>

              {/* Problem vs Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-rose-950/10 border border-rose-500/20 space-y-2">
                  <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> SECURITY PROBLEM
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {selectedProject.problem}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-950/10 border border-emerald-500/20 space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ENGINEERED SOLUTION
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              {/* Security Concepts in detail */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  Security Principles & Threat Mitigations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedProject.securityConcepts || []).map((concept) => (
                    <span
                      key={concept}
                      className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200"
                    >
                      🛡️ {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                  Architecture & Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {(selectedProject.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500">Repository date: {selectedProject.date}</span>
              <div className="flex items-center gap-3">
                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GITHUB CODE</span>
                  </a>
                )}
                {selectedProject.liveDemo && (
                  <a
                    href={selectedProject.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>LAUNCH DEMO</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
