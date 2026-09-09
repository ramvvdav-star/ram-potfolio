import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  Terminal,
  Shield,
  FileText,
  FolderGit2,
  Cpu,
  BookOpen,
  Calendar,
  X,
  Sliders,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

interface SearchResult {
  id: string;
  type: 'NAV' | 'PROJECT' | 'WRITEUP' | 'SKILL' | 'LOG' | 'ACTION';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    projects,
    writeUps,
    skills,
    dailyLogs,
    setSelectedProject,
    setSelectedWriteUp,
    setIsTerminalOpen,
    setIsAdminOpen,
    setIsAuthModalOpen,
    setIsProfileModalOpen,
    currentUser,
    setActiveSection,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
        soundFx.playKeyClick();
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const navigateTo = (sectionId: string) => {
    setIsCommandPaletteOpen(false);
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Build candidate results
  const allResults: SearchResult[] = [
    // Navigation items
    {
      id: 'nav-home',
      type: 'NAV',
      title: 'Home',
      subtitle: 'Hero headline, active mission statement & SOC quick metrics',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      action: () => navigateTo('hero'),
    },
    {
      id: 'nav-about',
      type: 'NAV',
      title: 'About Ram',
      subtitle: 'Security background, engineering journey, philosophy & resume',
      icon: <User className="w-4 h-4 text-cyan-400" />,
      action: () => navigateTo('about'),
    },
    {
      id: 'nav-arsenal',
      type: 'NAV',
      title: 'Arsenal (Skills Matrix)',
      subtitle: 'Offensive security, defensive engineering, networking & tooling',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      action: () => navigateTo('arsenal'),
    },
    {
      id: 'nav-projects',
      type: 'NAV',
      title: 'Projects',
      subtitle: 'SentinelForge, NetSpecter, TraceHound and security frameworks',
      icon: <FolderGit2 className="w-4 h-4 text-emerald-400" />,
      action: () => navigateTo('projects'),
    },
    {
      id: 'nav-writeups',
      type: 'NAV',
      title: 'Security Write-ups & Research',
      subtitle: 'Technical cybersecurity articles, API exploits & kernel defense',
      icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
      action: () => navigateTo('writeups'),
    },
    {
      id: 'nav-dailylog',
      type: 'NAV',
      title: 'Daily Log',
      subtitle: 'Personal cybersecurity research journal and learning timeline',
      icon: <Calendar className="w-4 h-4 text-purple-400" />,
      action: () => navigateTo('dailylog'),
    },
    {
      id: 'nav-lab',
      type: 'NAV',
      title: 'Security Lab',
      subtitle: 'Interactive security analyzers, token inspectors & CTF sandboxes',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => navigateTo('lab'),
    },
    {
      id: 'nav-contact',
      type: 'NAV',
      title: 'Contact',
      subtitle: 'Send direct encrypted message, collaborate or reach out',
      icon: <FileText className="w-4 h-4 text-zinc-400" />,
      action: () => navigateTo('contact'),
    },
    {
      id: 'action-terminal',
      type: 'ACTION',
      title: 'Open Interactive Terminal',
      subtitle: 'Execute shell commands: help, whoami, status, cat mission.txt',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsTerminalOpen(true);
      },
    },
    {
      id: 'action-admin',
      type: 'ACTION',
      title: 'Open Admin CMS & Control Center',
      subtitle: 'Manage projects, write-ups, daily logs, SOC status & database (Ctrl/Cmd+Alt+A)',
      icon: <Sliders className="w-4 h-4 text-amber-400" />,
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsAdminOpen(true);
      },
    },
    // Projects
    ...(Array.isArray(projects) ? projects : []).map((p) => ({
      id: `proj-${p.id}`,
      type: 'PROJECT' as const,
      title: p.name,
      subtitle: `${p.category} • ${p.shortDescription.substring(0, 70)}...`,
      icon: <FolderGit2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setIsCommandPaletteOpen(false);
        setSelectedProject(p);
      },
    })),
    // Write-ups
    ...(Array.isArray(writeUps) ? writeUps : []).map((w) => ({
      id: `wu-${w.id}`,
      type: 'WRITEUP' as const,
      title: w.title,
      subtitle: `${w.category} • ${w.difficulty} • ${w.readingTime}`,
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setIsCommandPaletteOpen(false);
        setSelectedWriteUp(w);
      },
    })),
    // Skills
    ...(Array.isArray(skills) ? skills : []).map((s) => ({
      id: `skill-${s.id}`,
      type: 'SKILL' as const,
      title: s.name,
      subtitle: `${s.category} • Experience: ${s.experienceLevel}`,
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      action: () => {
        navigateTo('arsenal');
      },
    })),
    // Daily Logs
    ...(Array.isArray(dailyLogs) ? dailyLogs : []).map((l) => ({
      id: `log-${l.id}`,
      type: 'LOG' as const,
      title: `${l.date}: ${l.title}`,
      subtitle: `Worked on: ${l.workedOn.substring(0, 65)}...`,
      icon: <Calendar className="w-4 h-4 text-purple-400" />,
      action: () => {
        navigateTo('dailylog');
      },
    })),
  ];

  // Filter based on query
  const filtered = query.trim()
    ? allResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : allResults.slice(0, 10);

  // Keyboard navigation within results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        soundFx.playKeyClick();
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      id="command-palette-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4 animate-in fade-in duration-150"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        id="command-palette-modal"
        className="w-full max-w-2xl bg-[#0b0f17] border border-zinc-700/80 rounded-xl shadow-2xl shadow-emerald-950/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 gap-3 bg-zinc-900/60">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command, project, write-up, skill, or press ESC..."
            className="w-full bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 font-mono text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-mono rounded border border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center font-mono text-zinc-500 text-xs">
              NO MATCHING SIGNALS IN SYSTEM DATABASE FOR "{(query || '').toUpperCase()}"
            </div>
          ) : (
            filtered.map((res, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={res.id}
                  id={`cmd-result-${res.id}`}
                  onClick={() => {
                    soundFx.playKeyClick();
                    res.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-white'
                      : 'hover:bg-zinc-900/60 border border-transparent text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 shrink-0">
                      {res.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-mono font-medium truncate flex items-center gap-2">
                        <span>{res.title}</span>
                        <span className="text-[10px] uppercase px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">
                          {res.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">{res.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 ml-2 ${
                      isSelected ? 'text-emerald-400' : 'text-zinc-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-emerald-400/80 font-mono">RAM.SEC // QUERY ROUTER</span>
        </div>
      </div>
    </div>
  );
};
