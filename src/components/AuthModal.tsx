import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User as UserIcon,
  Key,
  X,
  AlertCircle,
  CheckCircle2,
  Database,
  RefreshCw,
  Terminal,
  Settings,
  HelpCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';
import { UserRole } from '../types';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

type AuthViewMode = 'login' | 'signup' | 'forgot' | 'supabase_settings';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    signup,
    resetPassword,
    setIsAdminOpen,
    isSupabaseConfigured,
    supabaseConfig,
    setSupabaseCredentials,
  } = useApp();

  const [mode, setMode] = useState<AuthViewMode>('login');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('ramsec2026');
  const [email, setEmail] = useState('admin@sec.local');
  const [selectedRole, setSelectedRole] = useState<UserRole>('researcher');

  // Supabase Custom Config state
  const [customUrl, setCustomUrl] = useState(supabaseConfig.url || '');
  const [customKey, setCustomKey] = useState(supabaseConfig.anonKey || '');
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    soundFx.playKeyClick();

    try {
      if (mode === 'login') {
        const res = await login(username, password);
        if (res.success) {
          setSuccess('Authentication approved. Session token issued.');
          setTimeout(() => {
            setIsAuthModalOpen(false);
            const uLower = username.toLowerCase();
            if (
              uLower === 'admin' ||
              uLower === 'ram' ||
              uLower.includes('admin') ||
              password === 'ramsec2026'
            ) {
              setIsAdminOpen(true);
            }
          }, 600);
        } else {
          setError(res.error || 'Authentication challenge rejected.');
        }
      } else if (mode === 'signup') {
        const res = await signup(username, password, email, selectedRole);
        if (res.success) {
          setSuccess(`Account registered [${selectedRole.toUpperCase()}]. Session active.`);
          setTimeout(() => {
            setIsAuthModalOpen(false);
            if (selectedRole === 'admin') {
              setIsAdminOpen(true);
            }
          }, 700);
        } else {
          setError(res.error || 'User registration rejected.');
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccess(res.message);
        } else {
          setError(res.error || 'Password recovery failed.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    setError(null);
    setSuccess(null);

    const res = setSupabaseCredentials(customUrl, customKey);
    if (res.success) {
      setSuccess('Supabase configuration updated successfully!');
      setTimeout(() => {
        setSuccess(null);
        setMode('login');
      }, 1000);
    } else {
      setError(res.error || 'Failed to save configuration');
    }
  };

  const handleCopySql = () => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleQuickLogin = async (usr: string, pass: string, isAdminTarget: boolean = false) => {
    soundFx.playKeyClick();
    setError(null);
    setLoading(true);
    const res = await login(usr, pass);
    setLoading(false);
    if (res.success) {
      setSuccess(`Authenticated as ${usr}`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        if (isAdminTarget) {
          setIsAdminOpen(true);
        }
      }, 400);
    } else {
      setError(res.error || 'Quick authentication failed.');
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-lg bg-[#090d16] border border-zinc-700/80 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wider">
              {mode === 'login' && 'OPERATOR AUTHENTICATION'}
              {mode === 'signup' && 'PROVISION NEW IDENTITY'}
              {mode === 'forgot' && 'PASSPHRASE RECOVERY'}
              {mode === 'supabase_settings' && 'SUPABASE ENGINE CONFIG'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playKeyClick();
                setMode(mode === 'supabase_settings' ? 'login' : 'supabase_settings');
                setError(null);
                setSuccess(null);
              }}
              title="Supabase Settings"
              className={`p-1.5 rounded transition-colors ${
                mode === 'supabase_settings'
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Supabase Engine Status Banner */}
        <div className="px-6 py-2 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured
                  ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                  : 'bg-cyan-400'
              }`}
            />
            <span className="text-zinc-300">
              {isSupabaseConfigured ? (
                <span className="text-emerald-400 font-semibold">
                  Supabase Cloud Auth: CONNECTED
                </span>
              ) : (
                <span className="text-cyan-300">
                  Supabase Sandbox Engine: ACTIVE
                </span>
              )}
            </span>
          </div>
          <button
            onClick={() => setMode(mode === 'supabase_settings' ? 'login' : 'supabase_settings')}
            className="text-[10px] text-zinc-400 hover:text-zinc-200 underline decoration-zinc-600"
          >
            {isSupabaseConfigured ? 'View Config' : 'Connect Cloud DB'}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 font-mono text-xs max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* MODE: SUPABASE SETTINGS */}
          {mode === 'supabase_settings' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed">
                Connect your real Supabase project by providing your Project URL and Public Anon Key.
                Authentication, profiles, and role management sync directly with Supabase Auth!
              </div>

              <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
                <div>
                  <label className="text-zinc-400 text-[10px] tracking-wider uppercase">
                    VITE_SUPABASE_URL
                  </label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full mt-1 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 text-[10px] tracking-wider uppercase">
                    VITE_SUPABASE_ANON_KEY
                  </label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="w-full mt-1 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:border-emerald-500 outline-none font-sans"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Save & Connect Supabase</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomUrl('');
                      setCustomKey('');
                      setSupabaseCredentials('', '');
                      setSuccess('Switched to Sandbox Engine');
                    }}
                    className="py-2.5 px-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                  >
                    Reset to Local
                  </button>
                </div>
              </form>

              {/* SQL Schema helper */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowSqlSchema(!showSqlSchema)}
                  className="w-full flex items-center justify-between text-zinc-400 hover:text-emerald-400 text-[11px]"
                >
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" /> Supabase SQL Schema & RLS Setup
                  </span>
                  {showSqlSchema ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showSqlSchema && (
                  <div className="space-y-2 bg-zinc-950 p-3 rounded border border-zinc-800">
                    <p className="text-[10px] text-zinc-400">
                      Copy this SQL script into your Supabase Dashboard -&gt; SQL Editor to generate the `profiles` table, automated sign-up trigger, and Row Level Security (RLS) policies:
                    </p>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleCopySql}
                        className="py-1 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                      </button>
                    </div>
                    <pre className="text-[9px] text-zinc-500 overflow-x-auto max-h-40 p-2 bg-black/50 rounded border border-zinc-800/60 font-mono">
                      {SUPABASE_SQL_SCHEMA}
                    </pre>
                  </div>
                )}
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playKeyClick();
                    setMode('login');
                  }}
                  className="text-emerald-400 hover:underline text-[11px]"
                >
                  &larr; Return to Login
                </button>
              </div>
            </div>
          )}

          {/* MODE: LOGIN / SIGNUP / FORGOT PASSWORD */}
          {mode !== 'supabase_settings' && (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username / Identifier */}
                {mode !== 'forgot' && (
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5" /> IDENTIFIER (USERNAME OR EMAIL)
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50"
                      placeholder="e.g. admin or analyst@sec.local"
                    />
                  </div>
                )}

                {/* Email (required for signup and forgot password) */}
                {(mode === 'signup' || mode === 'forgot') && (
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 uppercase text-[10px] tracking-wider">
                      VERIFIED EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50"
                      placeholder="operator@sec.local"
                    />
                  </div>
                )}

                {/* Role selection for signup */}
                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 uppercase text-[10px] tracking-wider">
                      ASSIGN CLEARANCE LEVEL / ROLE
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('researcher')}
                        className={`py-2 px-2 text-[10px] rounded border font-mono transition-colors ${
                          selectedRole === 'researcher'
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Researcher
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('analyst')}
                        className={`py-2 px-2 text-[10px] rounded border font-mono transition-colors ${
                          selectedRole === 'analyst'
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        SOC Analyst
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('admin')}
                        className={`py-2 px-2 text-[10px] rounded border font-mono transition-colors ${
                          selectedRole === 'admin'
                            ? 'border-amber-500 bg-amber-950/40 text-amber-300 font-bold'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Admin CMS
                      </button>
                    </div>
                  </div>
                )}

                {/* Password field */}
                {mode !== 'forgot' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-zinc-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                        <Key className="w-3.5 h-3.5" /> PASSPHRASE KEY
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playKeyClick();
                            setMode('forgot');
                            setError(null);
                            setSuccess(null);
                          }}
                          className="text-[10px] text-zinc-500 hover:text-emerald-400 underline"
                        >
                          Forgot key?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50 font-sans"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {mode === 'login' && (loading ? 'CHALLENGING AUTH...' : 'VERIFY CREDENTIALS')}
                    {mode === 'signup' && (loading ? 'PROVISIONING USER...' : 'PROVISION ACCOUNT')}
                    {mode === 'forgot' && (loading ? 'TRANSMITTING RECOVERY...' : 'SEND RECOVERY LINK')}
                  </span>
                </button>
              </form>

              {/* Quick Fill Testing Credentials buttons for evaluation */}
              {mode === 'login' && (
                <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                    <span>EVALUATION OPERATOR ACCOUNTS:</span>
                    <span className="text-[9px] text-zinc-600">Click to fill</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('admin');
                        setPassword('ramsec2026');
                        soundFx.playKeyClick();
                      }}
                      className="py-1.5 px-2 rounded border border-amber-500/30 bg-amber-950/20 text-amber-300 text-[10px] hover:bg-amber-950/40 text-center"
                    >
                      Admin
                      <div className="text-[8px] text-amber-500/70">ramsec2026</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('researcher');
                        setPassword('researcher123');
                        soundFx.playKeyClick();
                      }}
                      className="py-1.5 px-2 rounded border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-[10px] hover:bg-emerald-950/40 text-center"
                    >
                      Researcher
                      <div className="text-[8px] text-emerald-500/70">researcher123</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('analyst');
                        setPassword('analyst123');
                        soundFx.playKeyClick();
                      }}
                      className="py-1.5 px-2 rounded border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-[10px] hover:bg-cyan-950/40 text-center"
                    >
                      SOC Analyst
                      <div className="text-[8px] text-cyan-500/70">analyst123</div>
                    </button>
                  </div>

                  {/* Direct One-click launch shortcuts */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin', 'ramsec2026', true)}
                      className="flex-1 py-2 px-2.5 rounded-lg border border-amber-500/50 bg-amber-950/40 text-amber-300 text-xs font-bold hover:bg-amber-950/70 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>One-Click Login as Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('researcher', 'researcher123', false)}
                      className="flex-1 py-2 px-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-bold hover:bg-emerald-950/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Login as Researcher</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mode Toggle Footer */}
              <div className="text-center pt-2 space-y-1">
                {mode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playKeyClick();
                      setMode('signup');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-zinc-400 hover:text-emerald-400 text-[11px] underline"
                  >
                    Need a new account? Register operator identity &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playKeyClick();
                      setMode('login');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-zinc-400 hover:text-emerald-400 text-[11px] underline"
                  >
                    &larr; Already have an account? Return to login
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
