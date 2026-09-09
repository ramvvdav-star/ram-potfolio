import React from 'react';
import {
  Shield,
  Terminal,
  Lock,
  Github,
  Twitter,
  Mail,
  Sliders,
  ArrowUp,
  Heart,
  Radio,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const Footer: React.FC = () => {
  const { siteSettings, liveStatus, setIsTerminalOpen, setIsAdminOpen, setIsAuthModalOpen, currentUser } = useApp();

  const scrollToTop = () => {
    soundFx.playKeyClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-zinc-800/80 bg-[#04060a] text-zinc-400 font-mono text-xs pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-wider">
                {siteSettings.brandName}
              </span>
            </div>

            <p className="text-zinc-300 italic font-sans text-sm">
              &ldquo;{siteSettings.tagline}&rdquo;
            </p>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-md font-sans">
              Cybersecurity portfolio, vulnerability research journal, and personal security engineering sandbox for Ram. Specializing in offensive security, Linux kernel hardening, web exploitation, and defensive architecture.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteSettings.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.twitterUrl || (siteSettings.socialHandle?.startsWith('http') ? siteSettings.socialHandle : `https://x.com/${siteSettings.socialHandle?.replace('@', '')}`)}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400 hover:text-cyan-300 hover:border-zinc-700 transition-colors"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteSettings.email}`}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 hover:text-emerald-300 hover:border-zinc-700 transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  soundFx.playKeyClick();
                  setIsTerminalOpen(true);
                }}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 hover:text-emerald-300 hover:border-zinc-700 transition-colors"
                title="Launch Terminal"
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <div className="text-zinc-200 font-bold uppercase text-xs tracking-wider">
              NAVIGATION
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  &gt; About & Journey
                </a>
              </li>
              <li>
                <a href="#arsenal" className="hover:text-emerald-400 transition-colors">
                  &gt; Arsenal & Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-emerald-400 transition-colors">
                  &gt; Security Projects
                </a>
              </li>
              <li>
                <a href="#writeups" className="hover:text-emerald-400 transition-colors">
                  &gt; Research Write-ups
                </a>
              </li>
              <li>
                <a href="#dailylog" className="hover:text-emerald-400 transition-colors">
                  &gt; Daily Research Log
                </a>
              </li>
              <li>
                <a href="#lab" className="hover:text-emerald-400 transition-colors">
                  &gt; Personal Security Lab
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">
                  &gt; Contact & PGP
                </a>
              </li>
            </ul>
          </div>

          {/* Security Posture & Admin */}
          <div className="space-y-3">
            <div className="text-zinc-200 font-bold uppercase text-xs tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              SYSTEM TELEMETRY
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>SOC STATUS:</span>
                <span className="text-emerald-400 font-bold">{liveStatus.systemStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>THREAT LEVEL:</span>
                <span className="text-amber-400 font-bold">{liveStatus.threatLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>LAB TESTBED:</span>
                <span className="text-cyan-400 font-bold">{liveStatus.labStatus}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-footer-admin-cms"
                onClick={() => {
                  soundFx.playKeyClick();
                  setIsAdminOpen(true);
                }}
                className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>ADMIN CMS & CONTROL CENTER</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} RAM.SEC • All rights reserved. Designed for defensive security research and educational exploration.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
