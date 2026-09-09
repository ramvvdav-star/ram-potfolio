import React, { useState, useEffect } from 'react';
import {
  Shield,
  Terminal,
  Search,
  User as UserIcon,
  Menu,
  X,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const Navbar: React.FC = () => {
  const {
    siteSettings,
    liveStatus,
    currentUser,
    isTerminalOpen,
    setIsTerminalOpen,
    setIsCommandPaletteOpen,
    setIsAuthModalOpen,
    setIsProfileModalOpen,
    setIsAdminOpen,
    toggleAudioEffects,
    activeSection,
    setActiveSection,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'ABOUT', href: '#about' },
    { name: 'ARSENAL', href: '#arsenal' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'WRITE-UPS', href: '#writeups' },
    { name: 'DAILY LOG', href: '#dailylog' },
    { name: 'LAB', href: '#lab' },
    { name: 'CONTACT', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    soundFx.playKeyClick();
    setMobileMenuOpen(false);
    const id = href.replace('#', '');
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="global-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#07090e]/90 backdrop-blur-md border-zinc-800/80 shadow-lg shadow-black/40 py-2.5'
          : 'bg-[#07090e]/60 backdrop-blur-sm border-zinc-800/40 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            id="brand-logo-link"
            className="group flex items-center gap-2.5 text-zinc-100 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded border border-emerald-500/40 bg-emerald-950/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm tracking-wider font-bold text-white flex items-center gap-1.5">
                {siteSettings.brandName}
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-widest hidden sm:inline-block">
                SEC.RESEARCH
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-mono tracking-wider">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                id={`nav-${link.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`px-2.5 py-1.5 rounded transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Status Indicator Pill */}
          <div
            id="navbar-status-pill"
            onClick={() => handleNavClick('#status-panel')}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/70 text-[11px] font-mono cursor-pointer hover:border-zinc-700 transition-colors"
            title="System Status"
          >
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-zinc-400">STATUS:</span>
            <span className="text-emerald-400 font-semibold">{liveStatus.systemStatus}</span>
          </div>

          {/* Audio toggle button */}
          <button
            id="btn-toggle-audio"
            onClick={() => {
              toggleAudioEffects();
              soundFx.playKeyClick();
            }}
            className={`p-1.5 rounded border transition-colors ${
              siteSettings.audioEffects
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 bg-zinc-900/50'
            }`}
            title={siteSettings.audioEffects ? 'Sound FX Enabled' : 'Sound FX Muted'}
            aria-label="Toggle sound effects"
          >
            {siteSettings.audioEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Command Palette Trigger */}
          <button
            id="btn-open-command-palette"
            onClick={() => {
              soundFx.playKeyClick();
              setIsCommandPaletteOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 bg-zinc-900/60 text-xs font-mono transition-colors"
            title="Search & Commands (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 bg-zinc-800 text-zinc-400 text-[10px] rounded border border-zinc-700 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Terminal Launcher */}
          <button
            id="btn-open-terminal"
            onClick={() => {
              soundFx.playKeyClick();
              setIsTerminalOpen(!isTerminalOpen);
            }}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono transition-all ${
              isTerminalOpen
                ? 'border-emerald-500 text-emerald-300 bg-emerald-950/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 bg-zinc-900/60'
            }`}
            title="Toggle Interactive Terminal"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>TERMINAL</span>
          </button>

          {/* Always-accessible Admin CMS Button */}
          <button
            id="btn-navbar-admin-cms"
            onClick={() => {
              soundFx.playKeyClick();
              setIsAdminOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 text-xs font-mono transition-colors shadow-[0_0_10px_rgba(245,158,11,0.15)] cursor-pointer"
            title="Open Admin CMS Control Center"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>ADMIN</span>
          </button>

          {/* User Profile / Login Action Button */}
          {currentUser ? (
            <button
              id="btn-navbar-profile"
              onClick={() => {
                soundFx.playKeyClick();
                setIsProfileModalOpen(true);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 transition-colors"
              title={`Logged in as ${currentUser.name} (${currentUser.role})`}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-emerald-500/50"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-xs font-mono text-zinc-300 hidden md:inline-block max-w-[90px] truncate">
                {currentUser.name}
              </span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border hidden sm:inline-block ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    : currentUser.role === 'analyst'
                    ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {(currentUser.role || 'researcher').toUpperCase()}
              </span>
            </button>
          ) : (
            <button
              id="btn-navbar-login"
              onClick={() => {
                soundFx.playKeyClick();
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-300 bg-zinc-900/70 text-xs font-mono transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>LOGIN</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 bg-zinc-900/50"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden fixed inset-x-0 top-[53px] bottom-0 bg-[#07090e]/95 backdrop-blur-xl border-t border-zinc-800/80 p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <span>SYSTEM NAVIGATION</span>
              <span className="text-emerald-400 font-semibold">{liveStatus.systemStatus}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 font-mono text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                    activeSection === link.href.replace('#', '')
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : 'border-zinc-800/60 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-zinc-500 text-xs">→</span>
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsTerminalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs font-mono font-medium"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                LAUNCH TERMINAL
              </button>

              <button
                id="btn-mobile-admin-cms"
                onClick={() => {
                  soundFx.playKeyClick();
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 text-xs font-mono font-medium shadow-[0_0_10px_rgba(245,158,11,0.15)] cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                ADMIN DASHBOARD (CMS)
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 text-xs font-mono text-zinc-500 flex justify-between items-center">
            <span>RAM.SEC // DIGITAL HQ</span>
            <span>{siteSettings.location}</span>
          </div>
        </div>
      )}
    </header>
  );
};
