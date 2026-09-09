import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Terminal,
  ShieldCheck,
  ShieldAlert,
  Compass,
  Cpu,
  Flame,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const HeroSection: React.FC = () => {
  const { siteSettings, liveStatus, setIsTerminalOpen, setActiveSection } = useApp();
  const [copied, setCopied] = useState(false);

  // Animated terminal typing simulation
  const [terminalStage, setTerminalStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setTerminalStage(1), 400),   // type whoami
      setTimeout(() => setTerminalStage(2), 1100),  // output Ram
      setTimeout(() => setTerminalStage(3), 1900),  // type cat mission.txt
      setTimeout(() => setTerminalStage(4), 2700),  // output mission
      setTimeout(() => setTerminalStage(5), 3600),  // type systemctl status security
      setTimeout(() => setTerminalStage(6), 4400),  // output systemctl
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const copyMission = () => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText('Break it. Understand it. Secure it. — Ram');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    soundFx.playKeyClick();
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden bg-grid-cyber bg-radial-gradient"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Brand & Hero Messaging */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold">{siteSettings.brandName}</span>
            <span className="text-zinc-600">/</span>
            <span>CYBERSECURITY RESEARCHER</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            <span>{siteSettings.headlineMain || 'offensive mindset. defensive results.'}</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 block sm:inline">
              {siteSettings.headlineSub || 'meet ram.'}
            </span>
          </h1>

          {/* Subtitle Positioning */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
            Cybersecurity professional focused on offensive security, defensive engineering, Linux, web application security, OSINT and security research.
          </p>

          {/* Positioning Tags */}
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs text-zinc-400">
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Offensive Security
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Defensive Engineering
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Linux & eBPF
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /> Python Tooling
            </span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              id="cta-explore-work"
              onClick={() => scrollToSection('projects')}
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-sm tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="cta-enter-lab"
              onClick={() => scrollToSection('lab')}
              className="px-6 py-3 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 text-emerald-300 font-mono text-sm tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>ENTER THE LAB</span>
            </button>
          </div>

          {/* Quick Real-Time Metrics bar under hero */}
          <div className="pt-4 flex items-center gap-6 text-xs font-mono text-zinc-400 border-t border-zinc-800/80">
            <div>
              <span className="text-zinc-500">LOCATION: </span>
              <span className="text-zinc-200">{siteSettings.location}</span>
            </div>
            <div>
              <span className="text-zinc-500">SOCIAL: </span>
              <span className="text-emerald-400">{siteSettings.socialHandle}</span>
            </div>
            <div>
              <span className="text-zinc-500">STATUS: </span>
              <span className="text-emerald-400 font-semibold">{liveStatus.systemStatus}</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Tech Hero Terminal Window */}
        <div className="lg:col-span-5">
          <div className="relative group">
            {/* Subtle glow backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-transparent rounded-2xl blur-xl group-hover:from-emerald-500/30 transition-all opacity-80" />

            {/* Terminal Window Card */}
            <div className="relative rounded-xl border border-zinc-700/80 bg-[#080c14]/95 shadow-2xl overflow-hidden font-mono text-xs">
              {/* Window Title Bar */}
              <div className="px-4 py-3 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-[11px] text-zinc-400 ml-2 font-medium">
                    ram@sec: ~ (live session)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyMission}
                    className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Copy mission statement"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playKeyClick();
                      setIsTerminalOpen(true);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60 transition-colors"
                  >
                    INTERACT
                  </button>
                </div>
              </div>

              {/* Terminal Screen Contents */}
              <div className="p-5 space-y-3 min-h-[290px] text-zinc-200">
                {/* Stage 1: whoami */}
                {terminalStage >= 1 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="text-emerald-400 font-bold">ram@sec:~$</span>
                      <span>whoami</span>
                    </div>
                    {terminalStage >= 2 && (
                      <div className="text-emerald-300 font-semibold pl-4">
                        Ram
                      </div>
                    )}
                  </div>
                )}

                {/* Stage 2: cat mission.txt */}
                {terminalStage >= 3 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="text-emerald-400 font-bold">ram@sec:~$</span>
                      <span>cat mission.txt</span>
                    </div>
                    {terminalStage >= 4 && (
                      <div className="text-zinc-300 pl-4 border-l-2 border-emerald-500/40 space-y-0.5">
                        <div className="text-emerald-400 font-medium">Break it.</div>
                        <div className="text-teal-300 font-medium">Understand it.</div>
                        <div className="text-cyan-300 font-medium">Secure it.</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stage 3: systemctl status security */}
                {terminalStage >= 5 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="text-emerald-400 font-bold">ram@sec:~$</span>
                      <span>systemctl status security</span>
                    </div>
                    {terminalStage >= 6 && (
                      <div className="text-zinc-300 pl-4 space-y-1 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">●</span>
                          <span>security.service - <strong className="text-emerald-400">ACTIVE</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">●</span>
                          <span>network - <strong className="text-emerald-400">SECURE</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">●</span>
                          <span>threat_monitor - <strong className="text-cyan-400">RUNNING</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Idle Prompt with Blinking Cursor */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-emerald-400 font-bold">ram@sec:~$</span>
                  <span className="inline-block w-2 h-4 bg-emerald-400 animate-cursor"></span>
                </div>
              </div>

              {/* Terminal Footer Indicator */}
              <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 text-[10px] text-zinc-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  PROBE TELEMETRY: NOMINAL
                </span>
                <button
                  onClick={() => setIsTerminalOpen(true)}
                  className="text-emerald-400 hover:underline"
                >
                  Launch full shell &gt;_
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
