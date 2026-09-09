import React, { useState } from 'react';
import {
  User,
  Shield,
  MapPin,
  Share2,
  Download,
  Calendar,
  GraduationCap,
  Award,
  CheckCircle2,
  ExternalLink,
  Flame,
  FileCode,
  ArrowUpRight,
  Printer,
  X,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const AboutSection: React.FC = () => {
  const { siteSettings, timeline = [], certifications = [], education = [], currentUser, setIsAdminOpen } = useApp();
  const safeTimeline = Array.isArray(timeline) ? timeline : [];
  const safeCertifications = Array.isArray(certifications) ? certifications : [];
  const safeEducation = Array.isArray(education) ? education : [];
  const [activeTimelineYear, setActiveTimelineYear] = useState<string>('2026');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Section Header */}
      <div className="mb-12">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
          <User className="w-3.5 h-3.5" /> DOSSIER // IDENTITY & JOURNEY
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
          About Ram
        </h2>
        <p className="text-zinc-400 text-sm font-mono mt-1">
          Cybersecurity Professional • Security Researcher • Systems Builder
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Profile Card, Philosophy & Resume */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border border-zinc-800 bg-[#090d15]/90 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Profile Image Area */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-950 p-1 shadow-[0_0_15px_rgba(16,185,129,0.15)] relative">
                  <img
                    src={siteSettings.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"}
                    alt={`${siteSettings.name} - Cybersecurity Professional`}
                    className="w-full h-full object-cover rounded-lg grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                  />
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => {
                        soundFx.playKeyClick();
                        setIsAdminOpen(true);
                      }}
                      title="Update profile picture in Admin CMS"
                      className="absolute inset-1 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-mono text-emerald-300 transition-opacity rounded-lg cursor-pointer"
                    >
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span>EDIT PHOTO</span>
                    </button>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-[10px] font-mono text-emerald-300">
                  {siteSettings.brandName || 'RAM.SEC'}
                </div>
              </div>

              {/* Bio Highlights */}
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white font-mono">{siteSettings.name}</h3>
                <div className="text-xs text-emerald-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Offensive & Defensive Security</span>
                </div>
                <div className="text-xs text-zinc-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{siteSettings.location}</span>
                </div>
                <div className="text-xs text-zinc-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-zinc-400">Social:</span>
                  <a
                    href={siteSettings.twitterUrl || (siteSettings.socialHandle?.startsWith('http') ? siteSettings.socialHandle : `https://x.com/${siteSettings.socialHandle?.replace('@', '')}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    {siteSettings.socialHandle}
                  </a>
                </div>
              </div>
            </div>

            {/* Professional Summary Text */}
            <div className="mt-6 pt-5 border-t border-zinc-800/80 text-sm text-zinc-300 leading-relaxed space-y-3 font-sans">
              <p>
                I am a dedicated cybersecurity professional and offensive security practitioner based in India. My passion lies in understanding complex software architectures, dissecting authorization boundaries, and building resilient defensive protections.
              </p>
              <p className="text-xs text-zinc-400">
                I believe that true security engineering requires both the adversary mindset (how to systematically compromise an architecture) and engineering craft (how to write clean, maintainable, kernel-hardened software).
              </p>
            </div>

            {/* Security Philosophy Box */}
            <div className="mt-5 p-4 rounded-lg bg-zinc-950/80 border border-emerald-500/30 font-mono text-xs space-y-1.5">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                SECURITY PHILOSOPHY
              </div>
              <p className="text-zinc-300 italic text-[11px] leading-relaxed">
                &ldquo;{siteSettings.tagline || 'offensive mindset. defensive results. meet ram.'} Break it, understand the fundamental failure mode, and engineer zero-trust remediations.&rdquo;
              </p>
            </div>

            {/* Resume Action */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                id="btn-view-resume"
                onClick={() => {
                  soundFx.playKeyClick();
                  setIsResumeModalOpen(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>VIEW / DOWNLOAD RESUME</span>
              </button>
            </div>
          </div>

          {/* Education & Certifications Accordion / Cards */}
          <div className="rounded-xl border border-zinc-800 bg-[#090d15]/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-mono">
              <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> CERTIFICATIONS
              </span>
              <span className="text-zinc-400">STATUS</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {safeCertifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-white">{cert.title}</div>
                    <div className="text-[11px] text-zinc-400">{cert.issuer} • {cert.date}</div>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        cert.status === 'VERIFIED'
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40'
                          : cert.status === 'IN PROGRESS'
                          ? 'border-amber-500/40 text-amber-400 bg-amber-950/40'
                          : 'border-zinc-700 text-zinc-400 bg-zinc-900'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-800">
              <div className="text-zinc-200 font-bold font-mono text-xs flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" /> FORMAL EDUCATION
              </div>
              {safeEducation.map((edu) => (
                <div key={edu.id} className="text-xs font-mono space-y-1">
                  <div className="text-zinc-200 font-medium">{edu.degree}</div>
                  <div className="text-zinc-400 text-[11px]">{edu.institution} ({edu.period})</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Journey Timeline & Research Focus */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-[#090d15]/80 p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="text-xs font-mono text-emerald-400 tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> INTERACTIVE EVOLUTION TIMELINE
              </div>
              <div className="flex gap-1.5 font-mono text-xs">
                {safeTimeline.map((t) => (
                  <button
                    key={t.year}
                    onClick={() => {
                      soundFx.playKeyClick();
                      setActiveTimelineYear(t.year);
                    }}
                    className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                      activeTimelineYear === t.year
                        ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t.year}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Active Node Details */}
            <div className="space-y-6">
              {safeTimeline.map((item) => {
                const isSelected = activeTimelineYear === item.year;
                return (
                  <div
                    key={item.id}
                    id={`timeline-node-${item.year}`}
                    onClick={() => setActiveTimelineYear(item.year)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500/50 bg-emerald-950/15 shadow-lg shadow-emerald-950/10'
                        : 'border-zinc-800/60 bg-zinc-950/40 hover:border-zinc-700 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-mono text-sm font-bold">
                            [{item.year}]
                          </span>
                          <h4 className="text-base font-bold text-white font-mono">
                            {item.title}
                          </h4>
                        </div>
                        <div className="text-xs text-zinc-400 font-mono mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                      <span
                        className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
                          isSelected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-700'
                        }`}
                      />
                    </div>

                    <p className="mt-3 text-sm text-zinc-300 leading-relaxed font-sans">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {(item.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Active Research Focus Callout */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-zinc-500 uppercase tracking-widest text-[10px]">CURRENT LEARNING & FOCUS:</span>
                <div className="text-emerald-300 font-semibold mt-0.5">
                  Linux Kernel eBPF Driver Internals & API Authorization Testing
                </div>
              </div>
              <a
                href="#writeups"
                className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 shrink-0"
              >
                Read latest findings <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Downloadable / Printable Resume Modal */}
      {isResumeModalOpen && (
        <div
          id="resume-modal-overlay"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsResumeModalOpen(false)}
        >
          <div
            id="resume-modal-content"
            className="w-full max-w-3xl max-h-[85vh] bg-[#0c1017] border border-zinc-700 rounded-xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">RAM_RESUME_SECURITY_2026.PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT / PDF</span>
                </button>
                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Formatted Resume Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-zinc-200 font-sans text-sm">
              <div className="border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold font-mono text-white tracking-tight">Ram</h1>
                <p className="text-xs font-mono text-emerald-400 mt-1">
                  Cybersecurity Professional • Security Researcher • Systems Builder
                </p>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Email: {siteSettings.email} • Social: {siteSettings.socialHandle} • Location: {siteSettings.location}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-2">
                  Executive Summary
                </h3>
                <p className="text-xs leading-relaxed text-zinc-300">
                  Offensive and defensive cybersecurity practitioner specializing in Web Application Security (OWASP Top 10, BOLA/IDOR), Linux Kernel Hardening (SecComp, eBPF), and Python security automation. Proven track record building security tools, orchestrating reproducible CTF sandboxes, and auditing production REST APIs.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-2">
                  Technical Arsenal
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
                  <div>• Offensive: Penetration Testing, Burp Suite, Nmap, Gobuster</div>
                  <div>• Defensive: Linux Hardening, SecComp, Auditd, iptables</div>
                  <div>• Networking: TCP/IP Analysis, Wireshark, eBPF / XDP</div>
                  <div>• Programming: Python, Bash, TypeScript, SQL</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-2">
                  Key Security Projects
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-white font-mono">SentinelForge</strong> — Automated REST API authorization & BOLA security testing framework.
                  </div>
                  <div>
                    <strong className="text-white font-mono">NetSpecter</strong> — High-throughput eBPF packet filter and SYN flood mitigater.
                  </div>
                  <div>
                    <strong className="text-white font-mono">TraceHound</strong> — Passive OSINT & Certificate Transparency asset mapper.
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 flex justify-between text-[11px] font-mono text-zinc-400">
                <span>VERIFIED RESUME // RAM.SEC</span>
                <span>UPDATED: 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
