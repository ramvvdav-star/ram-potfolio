import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LiveStatus,
  PersonalMetrics,
  Project,
  WriteUp,
  DailyLog,
  Skill,
  TimelineItem,
  CertificationItem,
  EducationItem,
  LabExperiment,
  SiteSettings,
  User,
  UserRole,
  AuditLog,
  Message,
} from '../types';
import {
  initialSiteSettings,
  initialLiveStatus,
  initialMetrics,
  initialSkills,
  initialProjects,
  initialWriteUps,
  initialDailyLogs,
  initialTimeline,
  initialCertifications,
  initialEducation,
  initialLabExperiments,
  initialUser,
  initialAuditLogs,
} from '../data/initialData';
import { soundFx } from '../utils/audio';
import {
  initSupabase,
  isSupabaseConnected,
  getActiveSupabaseConfig,
  saveCustomSupabaseConfig,
  getLocalUserAccounts,
  saveLocalUserAccounts,
  DEFAULT_OPERATOR_ACCOUNTS,
  SupabaseConfig,
} from '../lib/supabase';

interface AppContextType {
  siteSettings: SiteSettings;
  liveStatus: LiveStatus;
  metrics: PersonalMetrics;
  skills: Skill[];
  projects: Project[];
  writeUps: WriteUp[];
  dailyLogs: DailyLog[];
  timeline: TimelineItem[];
  certifications: CertificationItem[];
  education: EducationItem[];
  labExperiments: LabExperiment[];
  messages: Message[];
  contactMessages: Message[];
  currentUser: User | null;
  auditLogs: AuditLog[];
  registeredUsers: User[];
  isSupabaseConfigured: boolean;
  supabaseConfig: SupabaseConfig;

  // Navigation & Modals
  activeSection: string;
  setActiveSection: (section: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  selectedWriteUp: WriteUp | null;
  setSelectedWriteUp: (wu: WriteUp | null) => void;

  // Actions
  updateLiveStatus: (status: Partial<LiveStatus>) => void;
  updateMetrics: (metrics: Partial<PersonalMetrics>) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addWriteUp: (wu: Omit<WriteUp, 'id' | 'views'>) => void;
  updateWriteUp: (id: string, wu: Partial<WriteUp>) => void;
  deleteWriteUp: (id: string) => void;
  incrementWriteUpViews: (id: string) => void;
  toggleSaveArticle: (id: string) => void;
  addDailyLog: (log: Omit<DailyLog, 'id'>) => void;
  updateDailyLog: (id: string, log: Partial<DailyLog>) => void;
  deleteDailyLog: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  sendMessage: (msg: { name: string; email: string; subject: string; message: string }) => boolean;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  login: (emailOrUser: string, roleOrPass?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, password?: string, email?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
  updateUserProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUserAccount: (userId: string) => void;
  setSupabaseCredentials: (url: string, anonKey: string) => { success: boolean; error?: string };
  logout: () => void;
  toggleAudioEffects: () => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'RAM_SEC_';

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore quota issues
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(() => {
    const loaded = getStored<SiteSettings>('settings', initialSiteSettings);
    if (!loaded?.headlineMain || loaded?.tagline === 'Ram breaks things to keep them safe.') {
      return {
        ...initialSiteSettings,
        ...loaded,
        tagline: 'offensive mindset. defensive results. meet ram.',
        headlineMain: 'offensive mindset. defensive results.',
        headlineSub: 'meet ram.',
        profileImage: loaded?.profileImage || initialSiteSettings.profileImage,
      };
    }
    return { ...initialSiteSettings, ...loaded };
  });
  const [liveStatus, setLiveStatusState] = useState<LiveStatus>(() => getStored('liveStatus', initialLiveStatus));
  const [metrics, setMetricsState] = useState<PersonalMetrics>(() => getStored('metrics', initialMetrics));
  const [skills, setSkillsState] = useState<Skill[]>(() => getStored('skills', initialSkills));
  const [projects, setProjectsState] = useState<Project[]>(() => getStored('projects', initialProjects));
  const [writeUps, setWriteUpsState] = useState<WriteUp[]>(() => getStored('writeUps', initialWriteUps));
  const [dailyLogs, setDailyLogsState] = useState<DailyLog[]>(() => getStored('dailyLogs', initialDailyLogs));
  const [timeline] = useState<TimelineItem[]>(() => getStored('timeline', initialTimeline));
  const [certifications] = useState<CertificationItem[]>(() => getStored('certifications', initialCertifications));
  const [education] = useState<EducationItem[]>(() => getStored('education', initialEducation));
  const [labExperiments] = useState<LabExperiment[]>(() => getStored('labExperiments', initialLabExperiments));
  const [messages, setMessagesState] = useState<Message[]>(() => getStored('messages', []));
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const isAuthActive = localStorage.getItem('RAM_SEC_AUTH_ACTIVE');
      if (isAuthActive !== 'true') {
        // Clean up any legacy auto-saved mock admin user so it never opens as admin automatically
        const stored = localStorage.getItem(STORAGE_PREFIX + 'user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.id === 'user-ram-admin' || parsed.id === 'usr-admin-01' || parsed.username === 'admin')) {
              localStorage.removeItem(STORAGE_PREFIX + 'user');
            }
          } catch (_) {}
        }
        return null;
      }
      const stored = localStorage.getItem(STORAGE_PREFIX + 'user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [auditLogs, setAuditLogsState] = useState<AuditLog[]>(() => getStored('auditLogs', initialAuditLogs));
  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConfig>(getActiveSupabaseConfig);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(isSupabaseConnected);
  const [registeredUsers, setRegisteredUsersState] = useState<User[]>(() => {
    const accs = getLocalUserAccounts();
    return accs.map((a) => a.user);
  });

  // Modals & Active states
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedWriteUp, setSelectedWriteUp] = useState<WriteUp | null>(null);

  // Sync Supabase Auth listener
  useEffect(() => {
    const supabase = initSupabase();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const role: UserRole = meta.role || 'researcher';
          const userObj: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: meta.name || meta.full_name || (session.user.email ? session.user.email.split('@')[0] : 'Operator'),
            username: meta.username || (session.user.email ? session.user.email.split('@')[0] : 'operator'),
            role: role,
            joinedDate: new Date(session.user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            savedArticles: meta.savedArticles || [],
            avatar: role === 'admin' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' : undefined,
            provider: 'supabase',
          };
          setCurrentUserState(userObj);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const role: UserRole = meta.role || 'researcher';
          const userObj: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: meta.name || meta.full_name || (session.user.email ? session.user.email.split('@')[0] : 'Operator'),
            username: meta.username || (session.user.email ? session.user.email.split('@')[0] : 'operator'),
            role: role,
            joinedDate: new Date(session.user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            savedArticles: meta.savedArticles || [],
            avatar: role === 'admin' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' : undefined,
            provider: 'supabase',
          };
          setCurrentUserState(userObj);
          setStored('user', userObj);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const handleSetIsAdminOpen = (open: boolean) => {
    setIsAdminOpen(open);
    if (open) {
      soundFx.playKeyClick();
      if (!currentUser) {
        addAudit('ADMIN_ATTEMPT', 'Unauthenticated visitor accessed Admin CMS portal (Clearance Verification Required)', 'WARNING');
      } else if (currentUser.role !== 'admin') {
        addAudit('ADMIN_ATTEMPT', `User ${currentUser.email} (${currentUser.role}) accessed Admin CMS (Level 3 Clearance Required)`, 'ALERT');
      } else {
        addAudit('ADMIN_ACCESS', `Admin ${currentUser.email} accessed Control Center CMS`);
      }
      try {
        if (window.location.hash !== '#admin') {
          window.history.replaceState(null, '', '#admin');
        }
      } catch (_) {}
    } else {
      try {
        if (window.location.hash === '#admin') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch (_) {}
    }
  };

  // Support direct URL navigation (#admin or /admin) and keyboard shortcut (Ctrl/Cmd + Alt + A)
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || hash === '#admin-dashboard' || path === '/admin') {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleSetIsAdminOpen(!isAdminOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentUser, isAdminOpen]);

  // Sync soundFx config
  useEffect(() => {
    soundFx.setEnabled(siteSettings.audioEffects);
  }, [siteSettings.audioEffects]);

  // Dynamic status timestamp refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStatusState((prev) => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC',
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync state to local storage
  useEffect(() => { setStored('settings', siteSettings); }, [siteSettings]);
  useEffect(() => { setStored('liveStatus', liveStatus); }, [liveStatus]);
  useEffect(() => { setStored('metrics', metrics); }, [metrics]);
  useEffect(() => { setStored('skills', skills); }, [skills]);
  useEffect(() => { setStored('projects', projects); }, [projects]);
  useEffect(() => { setStored('writeUps', writeUps); }, [writeUps]);
  useEffect(() => { setStored('dailyLogs', dailyLogs); }, [dailyLogs]);
  useEffect(() => { setStored('messages', messages); }, [messages]);
  useEffect(() => { setStored('user', currentUser); }, [currentUser]);
  useEffect(() => { setStored('auditLogs', auditLogs); }, [auditLogs]);

  // Audit log helper
  const addAudit = (action: string, details: string, severity: 'INFO' | 'WARNING' | 'ALERT' = 'INFO') => {
    const newLog: AuditLog = {
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      action,
      actor: currentUser ? currentUser.email : 'anonymous',
      severity,
      details,
    };
    setAuditLogsState((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const updateLiveStatus = (status: Partial<LiveStatus>) => {
    setLiveStatusState((prev) => {
      const updated = { ...prev, ...status, lastUpdate: 'Just now' };
      addAudit('STATUS_UPDATE', `Live status updated to ${updated.systemStatus} / Threat: ${updated.threatLevel}`);
      return updated;
    });
  };

  const updateMetrics = (newMetrics: Partial<PersonalMetrics>) => {
    setMetricsState((prev) => {
      const updated = { ...prev, ...newMetrics };
      addAudit('METRICS_UPDATE', 'Personal metrics updated by admin');
      return updated;
    });
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettingsState((prev) => {
      const updated = { ...prev, ...settings };
      addAudit('SETTINGS_UPDATE', 'Site configuration modified');
      return updated;
    });
  };

  const addProject = (proj: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...proj,
      id: 'proj-' + Date.now(),
    };
    setProjectsState((prev) => [newProj, ...prev]);
    setMetricsState((m) => ({ ...m, securityProjects: m.securityProjects + 1 }));
    addAudit('PROJECT_CREATE', `Created project: ${newProj.name}`);
  };

  const updateProject = (id: string, proj: Partial<Project>) => {
    setProjectsState((prev) => prev.map((p) => (p.id === id ? { ...p, ...proj } : p)));
    addAudit('PROJECT_UPDATE', `Updated project id: ${id}`);
  };

  const deleteProject = (id: string) => {
    setProjectsState((prev) => prev.filter((p) => p.id !== id));
    setMetricsState((m) => ({ ...m, securityProjects: Math.max(0, m.securityProjects - 1) }));
    addAudit('PROJECT_DELETE', `Deleted project id: ${id}`, 'WARNING');
  };

  const addWriteUp = (wu: Omit<WriteUp, 'id' | 'views'>) => {
    const newWu: WriteUp = {
      ...wu,
      id: 'wu-' + Date.now(),
      views: 1,
    };
    setWriteUpsState((prev) => [newWu, ...prev]);
    setMetricsState((m) => ({ ...m, writeups: m.writeups + 1 }));
    addAudit('WRITEUP_CREATE', `Published write-up: ${newWu.title}`);
  };

  const updateWriteUp = (id: string, wu: Partial<WriteUp>) => {
    setWriteUpsState((prev) => prev.map((w) => (w.id === id ? { ...w, ...wu } : w)));
    addAudit('WRITEUP_UPDATE', `Updated write-up id: ${id}`);
  };

  const deleteWriteUp = (id: string) => {
    setWriteUpsState((prev) => prev.filter((w) => w.id !== id));
    setMetricsState((m) => ({ ...m, writeups: Math.max(0, m.writeups - 1) }));
    addAudit('WRITEUP_DELETE', `Deleted write-up id: ${id}`, 'WARNING');
  };

  const incrementWriteUpViews = (id: string) => {
    setWriteUpsState((prev) => prev.map((w) => (w.id === id ? { ...w, views: (w.views || 0) + 1 } : w)));
  };

  const toggleSaveArticle = (id: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const exists = currentUser.savedArticles.includes(id);
    const updatedArticles = exists
      ? currentUser.savedArticles.filter((item) => item !== id)
      : [...currentUser.savedArticles, id];
    setCurrentUserState({ ...currentUser, savedArticles: updatedArticles });
    soundFx.playKeyClick();
  };

  const addDailyLog = (log: Omit<DailyLog, 'id'>) => {
    const newLog: DailyLog = { ...log, id: 'log-' + Date.now() };
    setDailyLogsState((prev) => [newLog, ...prev]);
    addAudit('DAILY_LOG_CREATE', `Added log entry: ${newLog.title}`);
  };

  const updateDailyLog = (id: string, log: Partial<DailyLog>) => {
    setDailyLogsState((prev) => prev.map((l) => (l.id === id ? { ...l, ...log } : l)));
    addAudit('DAILY_LOG_UPDATE', `Updated log entry id: ${id}`);
  };

  const deleteDailyLog = (id: string) => {
    setDailyLogsState((prev) => prev.filter((l) => l.id !== id));
    addAudit('DAILY_LOG_DELETE', `Removed log entry id: ${id}`);
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = { ...skill, id: 'skill-' + Date.now() };
    setSkillsState((prev) => [...prev, newSkill]);
    setMetricsState((m) => ({ ...m, tools: m.tools + 1 }));
    addAudit('SKILL_CREATE', `Added skill/tool: ${newSkill.name}`);
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setSkillsState((prev) => prev.map((s) => (s.id === id ? { ...s, ...skill } : s)));
  };

  const deleteSkill = (id: string) => {
    setSkillsState((prev) => prev.filter((s) => s.id !== id));
    setMetricsState((m) => ({ ...m, tools: Math.max(0, m.tools - 1) }));
  };

  const sendMessage = (msg: { name: string; email: string; subject: string; message: string }): boolean => {
    if (!msg.name || !msg.email || !msg.message) return false;
    const newMsg: Message = {
      ...msg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      read: false,
    };
    setMessagesState((prev) => [newMsg, ...prev]);
    addAudit('MESSAGE_RECEIVED', `Inquiry received from ${msg.name} (${msg.email})`);
    soundFx.playSuccessTone();
    return true;
  };

  const markMessageRead = (id: string) => {
    setMessagesState((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessagesState((prev) => prev.filter((m) => m.id !== id));
  };

  const login = async (
    emailOrUser: string,
    roleOrPass: string = 'researcher'
  ): Promise<{ success: boolean; error?: string }> => {
    if (!emailOrUser || !emailOrUser.trim()) {
      return { success: false, error: 'Identifier (email or username) is required' };
    }
    const cleanId = emailOrUser.trim();
    const idLower = cleanId.toLowerCase();
    const passOrRole = roleOrPass ? roleOrPass.trim() : '';

    const supabase = initSupabase();

    // 1. If Supabase is connected, attempt live Supabase authentication
    if (supabase) {
      try {
        let emailToUse = cleanId;
        if (!cleanId.includes('@')) {
          const matched = registeredUsers.find((u) => u.username?.toLowerCase() === idLower);
          if (matched) {
            emailToUse = matched.email;
          } else {
            emailToUse = `${idLower}@sec.local`;
          }
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password: passOrRole,
        });

        if (error) {
          addAudit('AUTH_FAILED', `Supabase authentication failed for ${cleanId}: ${error.message}`, 'WARNING');
          // Allow fallback to local admin if testing with default seed credentials
          const isDefaultAdmin = (idLower === 'admin' || idLower === 'ram') && passOrRole === 'ramsec2026';
          if (!isDefaultAdmin) {
            return { success: false, error: error.message };
          }
        } else if (data.user) {
          const userMeta = data.user.user_metadata || {};
          const role: UserRole =
            userMeta.role ||
            (idLower.includes('admin') || idLower.includes('ram') ? 'admin' : 'researcher');

          const loggedInUser: User = {
            id: data.user.id,
            email: data.user.email || emailToUse,
            name: userMeta.name || userMeta.full_name || cleanId.split('@')[0],
            username: userMeta.username || cleanId.split('@')[0].toLowerCase(),
            role: role,
            joinedDate: new Date(data.user.created_at).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            }),
            savedArticles: userMeta.savedArticles || [],
            avatar: role === 'admin'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
              : undefined,
            provider: 'supabase',
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem('RAM_SEC_AUTH_ACTIVE', 'true');
          }
          setCurrentUserState(loggedInUser);
          setStored('user', loggedInUser);
          addAudit('USER_LOGIN', `User ${loggedInUser.email} authenticated via Supabase [Role: ${role.toUpperCase()}]`);
          soundFx.playSuccessTone();
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase auth attempt error:', err);
      }
    }

    // 2. High-security Local/Sandbox verification
    const accounts = getLocalUserAccounts();
    const matchedAccount = accounts.find(
      (acc) =>
        acc.user.username?.toLowerCase() === idLower ||
        acc.user.email.toLowerCase() === idLower
    );

    if (matchedAccount) {
      if (passOrRole && matchedAccount.passwordHash && matchedAccount.passwordHash !== passOrRole) {
        addAudit('AUTH_FAILED', `Authentication rejected for ${cleanId} (Invalid credentials)`, 'WARNING');
        return { success: false, error: 'Incorrect passphrase / access key rejected.' };
      }
      const u: User = {
        ...matchedAccount.user,
        lastLogin: new Date().toLocaleTimeString(),
        provider: 'local',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('RAM_SEC_AUTH_ACTIVE', 'true');
      }
      setCurrentUserState(u);
      setStored('user', u);
      addAudit('USER_LOGIN', `Operator ${u.email} authenticated [Role: ${u.role.toUpperCase()}]`);
      soundFx.playSuccessTone();
      return { success: true };
    }

    // 3. Admin fallback shortcut
    if (
      idLower === 'admin' ||
      idLower === 'ram' ||
      idLower === 'ramvvdav@gmail.com' ||
      idLower === 'ram.security@proton.me'
    ) {
      if (passOrRole && passOrRole !== 'ramsec2026' && passOrRole !== 'admin') {
        return { success: false, error: 'Invalid administrator credentials' };
      }
      const adminUser: User = {
        id: 'usr-admin-01',
        name: 'Ram (Admin)',
        username: 'admin',
        email: 'admin@sec.local',
        role: 'admin',
        joinedDate: 'Jan 2024',
        savedArticles: ['wu-1', 'wu-2'],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        provider: 'local',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('RAM_SEC_AUTH_ACTIVE', 'true');
      }
      setCurrentUserState(adminUser);
      setStored('user', adminUser);
      addAudit('USER_LOGIN', `Administrator ${adminUser.email} authenticated with elevated privileges`);
      soundFx.playSuccessTone();
      return { success: true };
    }

    return {
      success: false,
      error: 'User not registered. Please create an account or verify credentials.',
    };
  };

  const signup = async (
    username: string,
    password?: string,
    email?: string,
    role: UserRole = 'researcher'
  ): Promise<{ success: boolean; error?: string }> => {
    if (!username || username.trim().length < 2) {
      return { success: false, error: 'Username must be at least 2 characters' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password passphrase must be at least 6 characters' };
    }
    const cleanUser = username.trim();
    const userEmail = email && email.includes('@') ? email.trim() : `${cleanUser.toLowerCase()}@sec.local`;

    const supabase = initSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userEmail,
          password: password,
          options: {
            data: {
              username: cleanUser.toLowerCase(),
              name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
              role: role,
            },
          },
        });

        if (error) {
          addAudit('AUTH_SIGNUP_ERR', `Supabase signup rejection: ${error.message}`, 'WARNING');
          return { success: false, error: error.message };
        }

        const newUser: User = {
          id: data.user?.id || 'usr-' + Date.now(),
          name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
          username: cleanUser.toLowerCase(),
          email: userEmail,
          role: role,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          savedArticles: [],
          provider: 'supabase',
        };

        setCurrentUserState(newUser);
        setStored('user', newUser);

        setRegisteredUsersState((prev) => {
          const next = [...prev.filter((u) => u.email !== newUser.email), newUser];
          return next;
        });

        addAudit('USER_REGISTER', `New user registered via Supabase: ${cleanUser} (${userEmail}) [${role.toUpperCase()}]`);
        soundFx.playSuccessTone();
        return { success: true };
      } catch (err: any) {
        console.warn('Supabase sign up error:', err);
      }
    }

    // Local / Sandbox user provisioning
    const accounts = getLocalUserAccounts();
    if (
      accounts.some(
        (a) =>
          a.user.username?.toLowerCase() === cleanUser.toLowerCase() ||
          a.user.email.toLowerCase() === userEmail.toLowerCase()
      )
    ) {
      return { success: false, error: 'An account with this handle or email already exists' };
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
      username: cleanUser.toLowerCase(),
      email: userEmail,
      role: role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      savedArticles: [],
      provider: 'local',
    };

    const nextAccounts = [...accounts, { user: newUser, passwordHash: password }];
    saveLocalUserAccounts(nextAccounts);
    setRegisteredUsersState(nextAccounts.map((a) => a.user));
    if (typeof window !== 'undefined') {
      localStorage.setItem('RAM_SEC_AUTH_ACTIVE', 'true');
    }
    setCurrentUserState(newUser);
    setStored('user', newUser);

    addAudit('USER_REGISTER', `New account provisioned: ${cleanUser} (${userEmail}) [Role: ${role.toUpperCase()}]`);
    soundFx.playSuccessTone();
    return { success: true };
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, message: '', error: 'Valid email address is required' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const supabase = initSupabase();

    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
        if (error) {
          return { success: false, message: '', error: error.message };
        }
        addAudit('PASSWORD_RESET_REQ', `Supabase password recovery email dispatched to ${cleanEmail}`);
        return {
          success: true,
          message: `Password recovery transmission dispatched to ${cleanEmail}. Please check your inbox.`,
        };
      } catch (err: any) {
        console.warn('Supabase reset password error:', err);
      }
    }

    addAudit('PASSWORD_RESET_REQ', `Recovery challenge generated for ${cleanEmail}`);
    return {
      success: true,
      message: `Recovery challenge generated for ${cleanEmail}. With a live Supabase project and SMTP configured, an automated reset link is dispatched to your email.`,
    };
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'No active session' };
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUserState(updatedUser);
    setStored('user', updatedUser);

    setRegisteredUsersState((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );

    const accounts = getLocalUserAccounts();
    const nextAccounts = accounts.map((acc) =>
      acc.user.id === currentUser.id ? { ...acc, user: updatedUser } : acc
    );
    saveLocalUserAccounts(nextAccounts);

    const supabase = initSupabase();
    if (supabase) {
      try {
        await supabase.auth.updateUser({
          data: {
            name: updatedUser.name,
            username: updatedUser.username,
          },
        });
      } catch (_) {}
    }

    addAudit('PROFILE_UPDATED', `User ${updatedUser.email} profile updated`);
    soundFx.playSuccessTone();
    return { success: true };
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    if (!currentUser || currentUser.role !== 'admin') {
      addAudit('UNAUTHORIZED_ACCESS', `Unauthorized role modification attempt by ${currentUser?.email || 'guest'}`, 'ALERT');
      return;
    }

    setRegisteredUsersState((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    const accounts = getLocalUserAccounts();
    const nextAccounts = accounts.map((acc) =>
      acc.user.id === userId ? { ...acc, user: { ...acc.user, role: newRole } } : acc
    );
    saveLocalUserAccounts(nextAccounts);

    if (currentUser.id === userId) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUserState(updated);
      setStored('user', updated);
    }

    addAudit('ROLE_MODIFIED', `Admin ${currentUser.email} updated role for user ${userId} to ${newRole.toUpperCase()}`, 'WARNING');
    soundFx.playSuccessTone();
  };

  const deleteUserAccount = (userId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      addAudit('UNAUTHORIZED_ACCESS', `Unauthorized user deletion attempt by ${currentUser?.email || 'guest'}`, 'ALERT');
      return;
    }

    setRegisteredUsersState((prev) => prev.filter((u) => u.id !== userId));

    const accounts = getLocalUserAccounts();
    const nextAccounts = accounts.filter((acc) => acc.user.id !== userId);
    saveLocalUserAccounts(nextAccounts);

    if (currentUser.id === userId) {
      logout();
    }

    addAudit('USER_DELETED', `Admin ${currentUser.email} deleted user account ${userId}`, 'ALERT');
    soundFx.playKeyClick();
  };

  const setSupabaseCredentials = (url: string, anonKey: string): { success: boolean; error?: string } => {
    try {
      saveCustomSupabaseConfig(url, anonKey);
      const connected = isSupabaseConnected();
      setIsSupabaseConfigured(connected);
      setSupabaseConfigState(getActiveSupabaseConfig());
      if (connected) {
        addAudit('SUPABASE_CONFIG', `Live Supabase project connected: ${url}`);
        soundFx.playSuccessTone();
        return { success: true };
      } else if (!url && !anonKey) {
        addAudit('SUPABASE_CONFIG', 'Supabase credentials reset to Sandbox Local Engine');
        soundFx.playKeyClick();
        return { success: true };
      } else {
        return { success: false, error: 'Invalid Supabase URL or Anon Key. URL must start with https://' };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to save configuration' };
    }
  };

  const logout = async () => {
    const supabase = initSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (_) {}
    }
    if (currentUser) {
      addAudit('USER_LOGOUT', `User ${currentUser.email} signed out`);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('RAM_SEC_AUTH_ACTIVE');
      localStorage.removeItem(STORAGE_PREFIX + 'user');
    }
    setCurrentUserState(null);
    setStored('user', null);
    setIsAdminOpen(false);
    setIsProfileModalOpen(false);
    soundFx.playKeyClick();
  };

  const toggleAudioEffects = () => {
    setSiteSettingsState((prev) => ({
      ...prev,
      audioEffects: !prev.audioEffects,
    }));
  };

  const resetToDefaults = () => {
    setSiteSettingsState(initialSiteSettings);
    setLiveStatusState(initialLiveStatus);
    setMetricsState(initialMetrics);
    setSkillsState(initialSkills);
    setProjectsState(initialProjects);
    setWriteUpsState(initialWriteUps);
    setDailyLogsState(initialDailyLogs);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('RAM_SEC_AUTH_ACTIVE');
      localStorage.removeItem(STORAGE_PREFIX + 'user');
    }
    setCurrentUserState(null);
    setMessagesState([]);
    setAuditLogsState(initialAuditLogs);
    localStorage.clear();
    addAudit('SYSTEM_RESET', 'All portfolio records restored to pristine seed state', 'WARNING');
  };

  return (
    <AppContext.Provider
      value={{
        siteSettings,
        liveStatus,
        metrics,
        skills,
        projects,
        writeUps,
        dailyLogs,
        timeline,
        certifications,
        education,
        labExperiments,
        messages,
        contactMessages: messages,
        currentUser,
        auditLogs,
        registeredUsers,
        isSupabaseConfigured,
        supabaseConfig,
        activeSection,
        setActiveSection,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isTerminalOpen,
        setIsTerminalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAdminOpen,
        setIsAdminOpen: handleSetIsAdminOpen,
        selectedProject,
        setSelectedProject,
        selectedWriteUp,
        setSelectedWriteUp,
        updateLiveStatus,
        updateMetrics,
        updateSiteSettings,
        addProject,
        updateProject,
        deleteProject,
        addWriteUp,
        updateWriteUp,
        deleteWriteUp,
        incrementWriteUpViews,
        toggleSaveArticle,
        addDailyLog,
        updateDailyLog,
        deleteDailyLog,
        addSkill,
        updateSkill,
        deleteSkill,
        sendMessage,
        markMessageRead,
        deleteMessage,
        login,
        signup,
        resetPassword,
        updateUserProfile,
        updateUserRole,
        deleteUserAccount,
        setSupabaseCredentials,
        logout,
        toggleAudioEffects,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
