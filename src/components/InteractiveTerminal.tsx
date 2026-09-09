import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minus, Maximize2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
}

export const InteractiveTerminal: React.FC = () => {
  const {
    isTerminalOpen,
    setIsTerminalOpen,
    liveStatus,
    siteSettings,
    projects = [],
    writeUps = [],
    skills = [],
    setActiveSection,
    setIsAdminOpen,
  } = useApp();

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeWriteUps = Array.isArray(writeUps) ? writeUps : [];
  const safeSkills = Array.isArray(skills) ? skills : [];

  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'system', text: 'RAM.SEC Core Terminal v4.2.0-sec (x86_64-pc-linux-gnu)' },
    { id: '2', type: 'system', text: 'Type "help" to view authorized navigation commands.' },
    { id: '3', type: 'input', text: 'whoami' },
    { id: '4', type: 'output', text: 'Ram — Cybersecurity Professional & Security Researcher' },
    { id: '5', type: 'input', text: 'cat mission.txt' },
    { id: '6', type: 'output', text: 'Break it.\nUnderstand it.\nSecure it.' },
    { id: '7', type: 'input', text: 'systemctl status security' },
    { id: '8', type: 'output', text: '● security.service - ACTIVE\n● network - SECURE\n● threat_monitor - RUNNING' },
  ]);

  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<string[]>(['whoami', 'cat mission.txt', 'systemctl status security']);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTerminalOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isTerminalOpen, lines, isMinimized]);

  if (!isTerminalOpen) return null;

  const handleCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    soundFx.playKeyClick();
    const newLines: TerminalLine[] = [
      ...lines,
      { id: 'cmd-' + Date.now(), type: 'input', text: raw },
    ];

    setHistory((prev) => [raw, ...prev]);
    setHistoryIndex(-1);

    const parts = raw.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    const addOutput = (text: string, type: 'output' | 'error' | 'system' = 'output') => {
      newLines.push({ id: 'out-' + Date.now() + Math.random(), type, text });
    };

    switch (command) {
      case 'help':
        addOutput(
          `Available System Commands:
  about       Navigate to professional background & security philosophy
  skills      Inspect skill matrix & offensive/defensive competencies
  projects    List active security engineering repositories
  writeups    Browse research write-ups and vulnerability teardowns
  logs        View security research timeline and daily findings
  lab         Launch interactive security analysis lab
  contact     Get encrypted contact endpoints and social coordinates
  status      Display real-time SOC system metrics and threat status
  whoami      Display active session credentials
  admin       Open Admin CMS Control Center & Telemetry Editor
  clear       Flush terminal buffer
  date        Display current system time
  exit        Close interactive console session
  
Special commands: cat mission.txt, systemctl status security, admin, sudo su`
        );
        break;

      case 'whoami':
        addOutput(`Ram
Role: Cybersecurity Professional & Security Researcher
Specialization: Offensive Security, Linux Kernel Hardening & Web Security
Location: ${siteSettings.location}
Social: ${siteSettings.socialHandle}`);
        break;

      case 'cat':
        if (arg === 'mission.txt') {
          addOutput(`Break it.
Understand it.
Secure it.

"${siteSettings.tagline || 'offensive mindset. defensive results. meet ram.'}"`);
        } else if (arg === 'about.txt' || arg === 'bio.txt') {
          addOutput(`Focused on breaking architectures to find structural flaws before malicious actors do.
Specializing in API security (BOLA/BFLA), container isolation, eBPF network packet filtering, and offensive penetration testing.`);
        } else {
          addOutput(`cat: ${arg}: No such file. Try: cat mission.txt`, 'error');
        }
        break;

      case 'systemctl':
        if (arg.startsWith('status')) {
          addOutput(`● security.service - ACTIVE
● network - SECURE (0 anomalies reported)
● threat_monitor - RUNNING (Threat Level: ${liveStatus.threatLevel})
● lab.service - ${liveStatus.labStatus}
● uptime: ${liveStatus.uptime}`);
        } else {
          addOutput(`systemctl: privileged action prohibited in read-only console.`, 'error');
        }
        break;

      case 'status':
        addOutput(`SYSTEM SOC STATUS
========================================
STATUS        : ${liveStatus.systemStatus}
THREAT LEVEL  : ${liveStatus.threatLevel}
LAB STATUS    : ${liveStatus.labStatus}
ACTIVE PROBES : ${liveStatus.activeProbesCount}
UPTIME        : ${liveStatus.uptime}
LAST UPDATE   : ${liveStatus.lastUpdate}
CURRENT FOCUS : ${liveStatus.currentFocus}`);
        break;

      case 'about':
        setActiveSection('about');
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        addOutput(`[NAV] Navigating to ABOUT section...`);
        break;

      case 'skills':
        setActiveSection('arsenal');
        document.getElementById('arsenal')?.scrollIntoView({ behavior: 'smooth' });
        addOutput(`Top Competencies (${safeSkills.length} tools registered):
- Penetration Testing & Web Application Security (Expert)
- Linux Kernel Hardening & eBPF Networking (Advanced)
- Python Security Scripting & Exploit PoC Automation
- Tools: Nmap, Burp Suite, Wireshark, Metasploit, Kali Linux, Gobuster, Nikto`);
        break;

      case 'projects':
        setActiveSection('projects');
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        addOutput(`Active Security Projects:
${safeProjects.map((p) => `* [${p.status}] ${p.name} - ${p.category}`).join('\n')}`);
        break;

      case 'writeups':
        setActiveSection('writeups');
        document.getElementById('writeups')?.scrollIntoView({ behavior: 'smooth' });
        addOutput(`Research Write-ups:
${safeWriteUps.map((w) => `* [${w.difficulty}] ${w.title} (${w.readingTime})`).join('\n')}`);
        break;

      case 'logs':
      case 'dailylog':
        setActiveSection('dailylog');
        document.getElementById('dailylog')?.scrollIntoView({ behavior: 'smooth' });
        addOutput(`[NAV] Navigating to DAILY LOG research timeline...`);
        break;

      case 'lab':
        setActiveSection('lab');
        document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
        addOutput(`[NAV] Entering Security Lab.
NOTICE: All tools and environments strictly intended for authorized educational testing.`);
        break;

      case 'contact':
        setActiveSection('contact');
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        addOutput(`Contact Coordinates:
- Email: ${siteSettings.email}
- GitHub: ${siteSettings.githubUrl}
- Social: ${siteSettings.socialHandle}
"Available for cybersecurity projects, collaboration and security research."`);
        break;

      case 'admin':
      case 'cms':
      case 'dashboard':
      case 'control':
        addOutput(`[AUTH] Admin privileged access confirmed. Launching Admin CMS Dashboard...`);
        setIsAdminOpen(true);
        break;

      case 'su':
      case 'sudo':
        addOutput(`[AUTH] Superuser privileged access confirmed. Launching Admin CMS Dashboard...`);
        setIsAdminOpen(true);
        break;

      case 'clear':
        setLines([]);
        setCurrentInput('');
        return;

      case 'exit':
      case 'quit':
        setIsTerminalOpen(false);
        return;

      case 'date':
        addOutput(new Date().toUTCString());
        break;

      case 'echo':
        addOutput(arg);
        break;

      default:
        addOutput(`command not found: ${command}. Type "help" for a list of available commands.`, 'error');
        break;
    }

    setLines(newLines);
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setCurrentInput(history[nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCurrentInput(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <div
      id="interactive-terminal-container"
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? 'inset-4 md:inset-10'
          : 'bottom-4 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[560px] md:w-[620px]'
      }`}
    >
      <div className="bg-[#080c14]/95 backdrop-blur-md border border-zinc-700/80 rounded-xl shadow-2xl shadow-emerald-950/30 overflow-hidden flex flex-col font-mono text-xs">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-950/90 border-b border-zinc-800 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsTerminalOpen(false)}
                className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 transition-colors"
                title="Close"
              />
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors"
                title="Minimize"
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors"
                title="Toggle fullscreen"
              />
            </div>
            <span className="text-[11px] text-zinc-400 ml-2 font-medium flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              ram@sec: ~ (interactive shell)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <button
              onClick={() => {
                setLines([
                  { id: '1', type: 'system', text: 'Terminal buffer cleared.' },
                ]);
              }}
              className="p-1 hover:text-zinc-200 transition-colors"
              title="Clear Output"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:text-zinc-200 transition-colors"
              title="Expand"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsTerminalOpen(false)}
              className="p-1 hover:text-rose-400 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {!isMinimized && (
          <div
            className={`p-4 overflow-y-auto space-y-2 bg-[#05070a]/90 select-text ${
              isExpanded ? 'h-[calc(100vh-140px)]' : 'h-[320px] sm:h-[360px]'
            }`}
          >
            {lines.map((l) => (
              <div key={l.id} className="leading-relaxed">
                {l.type === 'input' && (
                  <div className="flex items-start gap-2 text-zinc-200">
                    <span className="text-emerald-400 select-none font-bold">ram@sec:~$</span>
                    <span className="text-zinc-100">{l.text}</span>
                  </div>
                )}
                {l.type === 'output' && (
                  <pre className="text-zinc-300 whitespace-pre-wrap pl-6 font-mono text-[11px] sm:text-xs">
                    {l.text}
                  </pre>
                )}
                {l.type === 'system' && (
                  <div className="text-emerald-500/80 italic text-[11px] border-l border-emerald-500/30 pl-2">
                    {l.text}
                  </div>
                )}
                {l.type === 'error' && (
                  <div className="text-rose-400/90 pl-6 text-[11px]">
                    {l.text}
                  </div>
                )}
              </div>
            ))}

            {/* Current Input Line */}
            <div className="flex items-center gap-2 pt-1 text-zinc-100">
              <span className="text-emerald-400 select-none font-bold">ram@sec:~$</span>
              <input
                ref={inputRef}
                id="interactive-terminal-input"
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none border-none text-zinc-100 font-mono text-xs caret-emerald-400"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <div ref={bottomRef} />
          </div>
        )}

        {/* Footer info */}
        {!isMinimized && (
          <div className="px-3.5 py-1.5 bg-zinc-950 border-t border-zinc-800 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>Type &apos;help&apos; for commands • &apos;exit&apos; to close</span>
            <span className="text-emerald-500/80">AUTHENTICATED // RAM.SEC</span>
          </div>
        )}
      </div>
    </div>
  );
};
