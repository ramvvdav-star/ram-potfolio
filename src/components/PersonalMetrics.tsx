import React from 'react';
import {
  FolderGit2,
  BookOpen,
  Clock,
  Wrench,
  Award,
  GitFork,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PersonalMetrics: React.FC = () => {
  const { metrics, projects = [], writeUps = [], skills = [] } = useApp();

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeWriteUps = Array.isArray(writeUps) ? writeUps : [];
  const safeSkills = Array.isArray(skills) ? skills : [];

  // Truthful metrics derived from actual system state or admin configuration
  const metricCards = [
    {
      id: 'metric-projects',
      label: 'Security Projects',
      value: metrics?.securityProjects && metrics.securityProjects > 0 ? `${metrics.securityProjects}` : 'Building',
      sublabel: `${safeProjects.filter((p) => p.status === 'ACTIVE').length} active repositories`,
      icon: <FolderGit2 className="w-5 h-5 text-emerald-400" />,
      accent: 'border-emerald-500/30 bg-emerald-950/10',
    },
    {
      id: 'metric-writeups',
      label: 'Research Write-ups',
      value: metrics?.writeups && metrics.writeups > 0 ? `${metrics.writeups}` : 'Building',
      sublabel: `${safeWriteUps.filter((w) => w.published).length} published teardowns`,
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
      accent: 'border-cyan-500/30 bg-cyan-950/10',
    },
    {
      id: 'metric-labhours',
      label: 'Lab & Research Hours',
      value: metrics?.labHours && metrics.labHours > 0 ? `${metrics.labHours}+` : 'Building',
      sublabel: 'Dedicated security sandbox hours',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      accent: 'border-amber-500/30 bg-amber-950/10',
    },
    {
      id: 'metric-tools',
      label: 'Arsenal Tools & Skills',
      value: metrics?.tools && metrics.tools > 0 ? `${metrics.tools}` : 'Building',
      sublabel: `${safeSkills.length} profiled in matrix`,
      icon: <Wrench className="w-5 h-5 text-purple-400" />,
      accent: 'border-purple-500/30 bg-purple-950/10',
    },
    {
      id: 'metric-certifications',
      label: 'Certifications',
      value: metrics?.certifications && metrics.certifications > 0 ? `${metrics.certifications}` : 'Building',
      sublabel: 'Verified & active targets',
      icon: <Award className="w-5 h-5 text-teal-400" />,
      accent: 'border-teal-500/30 bg-teal-950/10',
    },
    {
      id: 'metric-github',
      label: 'GitHub Repositories',
      value: metrics?.githubProjects && metrics.githubProjects > 0 ? `${metrics.githubProjects}` : 'Building',
      sublabel: 'Open-source tools & PoCs',
      icon: <GitFork className="w-5 h-5 text-indigo-400" />,
      accent: 'border-indigo-500/30 bg-indigo-950/10',
    },
  ];

  return (
    <section id="metrics" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-zinc-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> VERIFIED TRACK RECORD
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-mono">
            Personal Security Metrics
          </h2>
        </div>
        <div className="text-xs font-mono text-zinc-400 mt-2 sm:mt-0">
          Source of truth: Live portfolio registry
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className={`p-4 rounded-xl border ${card.accent} bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700 transition-all group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60"></span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-xs font-mono font-medium text-zinc-300 mt-1">
                {card.label}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {card.sublabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
