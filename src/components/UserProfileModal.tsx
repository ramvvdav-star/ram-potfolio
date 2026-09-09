import React from 'react';
import {
  X,
  User as UserIcon,
  Shield,
  Key,
  Calendar,
  LogOut,
  Sliders,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  Terminal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const UserProfileModal: React.FC = () => {
  const {
    currentUser,
    isProfileModalOpen,
    setIsProfileModalOpen,
    setIsAdminOpen,
    setIsAuthModalOpen,
    logout,
    siteSettings,
  } = useApp();

  const [copiedId, setCopiedId] = React.useState(false);

  if (!isProfileModalOpen) return null;

  const handleCopyId = (id: string) => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleClose = () => {
    soundFx.playKeyClick();
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-300 font-bold">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wider">OPERATOR PROFILE // DOSSIER</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {currentUser ? (
            <>
              {/* User Identity Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="w-14 h-14 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-lg font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <UserIcon className="w-7 h-7 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-sm truncate">{currentUser.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        currentUser.role === 'admin'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs truncate">{currentUser.email}</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">
                    Auth Provider: {currentUser.provider === 'supabase' ? 'Supabase Cloud Auth' : 'Local Storage Engine'}
                  </p>
                </div>
              </div>

              {/* Security Telemetry */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 uppercase text-[10px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-400" /> MEMBER SINCE
                  </span>
                  <div className="text-zinc-200 font-bold">{currentUser.joinedDate || '2026'}</div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                  <span className="text-zinc-500 uppercase text-[10px] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> CLEARANCE LEVEL
                  </span>
                  <div className="text-emerald-400 font-bold">
                    {currentUser.role === 'admin' ? 'ROOT // LEVEL 0' : 'RESEARCHER // L2'}
                  </div>
                </div>
              </div>

              {/* Operator ID Box */}
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 uppercase text-[10px]">OPERATOR UID</span>
                  <div className="text-zinc-300 font-mono text-[11px] truncate max-w-[280px]">
                    {currentUser.id}
                  </div>
                </div>
                <button
                  onClick={() => handleCopyId(currentUser.id)}
                  className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1 text-[10px]"
                >
                  {copiedId ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      handleClose();
                      setIsAdminOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>LAUNCH ADMIN CONTROL CENTER</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="w-full py-2 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>TERMINATE OPERATOR SESSION</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">NO ACTIVE SESSION</h4>
                <p className="text-zinc-400 text-xs mt-1">
                  You are viewing {siteSettings.brandName || 'RAM.SEC'} as an unauthorized guest.
                </p>
              </div>
              <button
                onClick={() => {
                  handleClose();
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>SIGN IN OR REQUEST ACCESS</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
