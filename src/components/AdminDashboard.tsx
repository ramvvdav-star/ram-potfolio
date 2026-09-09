import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  FolderGit2,
  BookOpen,
  Calendar,
  Activity,
  Cpu,
  Mail,
  FileCode,
  ListOrdered,
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Copy,
  AlertCircle,
  Database,
  Lock,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  KeyRound,
  ExternalLink,
  RefreshCw,
  Image,
  Upload,
  Camera,
  Globe,
  MapPin,
  AtSign,
  Phone,
  Linkedin,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project, WriteUp, DailyLog, Skill, LiveStatus, PersonalMetrics, UserRole, SiteSettings } from '../types';
import { SUPABASE_POSTGRES_SCHEMA } from '../utils/exportSql';
import { soundFx } from '../utils/audio';

type AdminTab =
  | 'STATUS'
  | 'PROFILE'
  | 'METRICS'
  | 'USERS'
  | 'PROJECTS'
  | 'WRITEUPS'
  | 'LOGS'
  | 'SKILLS'
  | 'MESSAGES'
  | 'AUDIT'
  | 'SQL_EXPORT';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    currentUser,
    siteSettings,
    updateSiteSettings,
    liveStatus,
    updateLiveStatus,
    metrics,
    updateMetrics,
    projects = [],
    addProject,
    updateProject,
    deleteProject,
    writeUps = [],
    addWriteUp,
    updateWriteUp,
    deleteWriteUp,
    dailyLogs = [],
    addDailyLog,
    deleteDailyLog,
    skills = [],
    addSkill,
    deleteSkill,
    messages = [],
    contactMessages = [],
    deleteMessage,
    auditLogs = [],
    registeredUsers = [],
    updateUserRole,
    deleteUserAccount,
    signup,
    login,
    isSupabaseConfigured,
    supabaseConfig,
    setIsAuthModalOpen,
  } = useApp();

  const safeContactMessages = (contactMessages && Array.isArray(contactMessages) ? contactMessages : (messages && Array.isArray(messages) ? messages : []));
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeWriteUps = Array.isArray(writeUps) ? writeUps : [];
  const safeDailyLogs = Array.isArray(dailyLogs) ? dailyLogs : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];
  const safeUsers = Array.isArray(registeredUsers) ? registeredUsers : [];

  const [activeTab, setActiveTab] = useState<AdminTab>('STATUS');
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // New User Provisioning State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('researcher');
  const [userActionMsg, setUserActionMsg] = useState<string | null>(null);

  // Forms states
  // 0. Profile Picture, Headline & Social Media Form
  const [profileForm, setProfileForm] = useState<SiteSettings>(() => ({ ...siteSettings }));
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  React.useEffect(() => {
    if (siteSettings) {
      setProfileForm({ ...siteSettings });
    }
  }, [siteSettings]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (PNG, JPG, WebP, SVG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageUploadError('Image size exceeds 10MB limit. Please select a smaller photo.');
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        // High quality downscaling to max 800px to maintain crisp clarity with lightweight storage
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setProfileForm((prev) => ({ ...prev, profileImage: compressedDataUrl }));
        } else {
          setProfileForm((prev) => ({ ...prev, profileImage: result }));
        }
        setIsUploadingImage(false);
        soundFx.playSuccessTone();
      };
      img.onerror = () => {
        setImageUploadError('Failed to process image file.');
        setIsUploadingImage(false);
      };
      img.src = result;
    };
    reader.onerror = () => {
      setImageUploadError('Failed to read image file from disk.');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(profileForm);
    soundFx.playSuccessTone();
    setSaveBanner('Profile picture, headline, and social media settings updated successfully!');
    setTimeout(() => setSaveBanner(null), 4000);
  };

  // 1. Live Status Form
  const [statusForm, setStatusForm] = useState<LiveStatus>({ ...liveStatus });

  // 2. Metrics Form
  const [metricsForm, setMetricsForm] = useState<PersonalMetrics>({ ...metrics });

  // 3. New Project Form
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    name: '',
    category: 'WEB SECURITY',
    shortDescription: '',
    problem: '',
    solution: '',
    technologies: ['Python', 'Docker'],
    securityConcepts: ['Zero Trust', 'Least Privilege'],
    githubLink: 'https://github.com/ram-sec/new-tool',
    date: '2026',
    status: 'ACTIVE',
  });

  // 4. New Write-up Form
  const [isAddingWriteUp, setIsAddingWriteUp] = useState(false);
  const [newWriteUp, setNewWriteUp] = useState<Omit<WriteUp, 'id' | 'views'>>({
    title: '',
    slug: '',
    excerpt: '',
    author: 'Ram',
    date: 'Sep 2026',
    readingTime: '6 min read',
    difficulty: 'INTERMEDIATE',
    category: 'Web Security',
    tags: ['Security', 'Audit'],
    content: '### Executive Overview\n\nEnter research details here...',
    featured: false,
    published: true,
  });

  // 5. New Daily Log Form
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLog, setNewLog] = useState<Omit<DailyLog, 'id'>>({
    date: '10 SEP 2026',
    title: '',
    workedOn: '',
    learned: '',
    failed: '',
    willTryNext: '',
    tags: ['Research', 'Audit'],
  });

  // 6. New Skill Form
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    category: 'OFFENSIVE SECURITY',
    experienceLevel: 'Advanced',
    proficiencyPercent: 85,
    description: '',
    projectsUsingIt: ['SentinelForge'],
  });

  if (!isAdminOpen) return null;

  const showNotification = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    updateLiveStatus(statusForm);
    showNotification('SOC Live Telemetry status successfully updated.');
  };

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    updateMetrics(metricsForm);
    showNotification('Portfolio metrics successfully calibrated.');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    addProject(newProject);
    setIsAddingProject(false);
    showNotification(`Project "${newProject.name}" successfully committed.`);
  };

  const handleCreateWriteUp = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    addWriteUp(newWriteUp);
    setIsAddingWriteUp(false);
    showNotification(`Write-up "${newWriteUp.title}" published.`);
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    addDailyLog(newLog);
    setIsAddingLog(false);
    showNotification(`Daily log "${newLog.title}" recorded in journal.`);
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    addSkill(newSkill);
    setIsAddingSkill(false);
    showNotification(`Skill "${newSkill.name}" registered into Arsenal matrix.`);
  };

  const copySqlSchema = () => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText(SUPABASE_POSTGRES_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    setUserActionMsg(null);
    if (!newUserUsername || !newUserPassword) {
      setUserActionMsg('Username and passphrase key are required');
      return;
    }
    const res = await signup(newUserUsername, newUserPassword, newUserEmail, newUserRole);
    if (res.success) {
      showNotification(`Account "${newUserUsername}" created [${newUserRole.toUpperCase()}].`);
      setIsAddingUser(false);
      setNewUserUsername('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('researcher');
    } else {
      setUserActionMsg(res.error || 'Failed to provision operator account');
    }
  };

  if (!isAdminOpen) return null;

  // Clearance Gate: If user is not authenticated as admin, show 403 Access Denied Gate
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div
        id="admin-403-overlay"
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-in fade-in duration-150"
        onClick={() => setIsAdminOpen(false)}
      >
        <div
          id="admin-403-card"
          className="w-full max-w-md bg-[#090d16] border border-rose-500/50 rounded-2xl overflow-hidden shadow-2xl p-6 text-center space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">
              RAM.SEC SECURITY GATEWAY
            </div>
            <h3 className="text-base font-bold text-rose-300 tracking-wider mt-1">
              ACCESS DENIED // 403 FORBIDDEN
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Level 3 (Administrator) Clearance Required
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-left text-zinc-300 space-y-2">
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span className="text-zinc-500">Active Operator:</span>
              <span className="text-zinc-200 font-bold">{currentUser ? `${currentUser.name}` : 'Anonymous Visitor'}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span className="text-zinc-500">Assigned Role:</span>
              <span className="text-amber-400 uppercase font-bold">{currentUser?.role || 'Guest (No Role)'}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span className="text-zinc-500">Required Role:</span>
              <span className="text-emerald-400 font-bold">ADMINISTRATOR</span>
            </div>
            <p className="text-[10px] text-zinc-500 pt-1 leading-relaxed">
              Offensive tools, database exports, and site telemetry controls are protected under strict Role-Based Access Control (RBAC).
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                soundFx.playKeyClick();
                setIsAdminOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Authenticate as Administrator (admin / ramsec2026)</span>
            </button>

            <button
              onClick={() => {
                soundFx.playKeyClick();
                setIsAdminOpen(false);
              }}
              className="w-full py-2 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer"
            >
              Return to Public Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="admin-dashboard-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-150"
      onClick={() => setIsAdminOpen(false)}
    >
      <div
        id="admin-dashboard-card"
        className="w-full max-w-6xl max-h-[92vh] bg-[#090d16] border border-zinc-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dashboard Top Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-wider flex items-center gap-2">
                <span>RAM.SEC // CONTROL CENTER & CMS</span>
                <span className="px-2 py-0.2 rounded bg-amber-950/60 text-amber-400 border border-amber-500/40 text-[10px]">
                  ADMIN PRIVILEGED
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Session Operator: {currentUser?.name || currentUser?.username || 'admin'} • Real-time synchronization
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {saveBanner && (
          <div className="bg-emerald-950/70 border-b border-emerald-500/40 px-6 py-2 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{saveBanner}</span>
          </div>
        )}

        {/* Main Content Area: Sidebar Tabs + Working Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-56 bg-zinc-950/80 border-r border-zinc-800 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0 font-mono text-xs">
            <button
              onClick={() => setActiveTab('STATUS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'STATUS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>SOC Live Status</span>
            </button>

            <button
              id="admin-tab-profile"
              onClick={() => setActiveTab('PROFILE')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'PROFILE'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Picture & Socials</span>
            </button>

            <button
              onClick={() => setActiveTab('METRICS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'METRICS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Metrics Calibration</span>
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'USERS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Users className="w-4 h-4 text-pink-400" />
              <span>Identity & Users ({safeUsers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('PROJECTS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'PROJECTS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              <span>Projects ({safeProjects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('WRITEUPS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'WRITEUPS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Write-ups ({safeWriteUps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('LOGS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'LOGS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Daily Log ({safeDailyLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('SKILLS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'SKILLS'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Arsenal Skills ({safeSkills.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('MESSAGES')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'MESSAGES'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-400" />
              <span>Inquiries ({safeContactMessages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                activeTab === 'AUDIT'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <ListOrdered className="w-4 h-4 text-zinc-400" />
              <span>Audit Trail</span>
            </button>

            <div className="pt-3 mt-3 border-t border-zinc-800">
              <button
                onClick={() => setActiveTab('SQL_EXPORT')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                  activeTab === 'SQL_EXPORT'
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>SQL Schema Export</span>
              </button>
            </div>
          </div>

          {/* Right Working Panel */}
          <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-zinc-200">
            {/* Tab: Website Identity, Picture & Social Media Comms */}
            {activeTab === 'PROFILE' && (
              <form onSubmit={handleSaveProfileSettings} className="max-w-4xl space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-emerald-400" />
                      Picture, Headline & Social Media Settings
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Upload your portrait photo, configure your hero headline, and manage public contact endpoints in real-time.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>SAVE SETTINGS</span>
                    </button>
                  </div>
                </div>

                {/* Section 1: Portrait Picture Uploader */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Image className="w-4 h-4 text-emerald-400" />
                      <span>WEBSITE DOSSIER PICTURE</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      Displayed on the About/Dossier dossier card & hero sections
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Visual Preview */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative w-44 h-44 rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-900 shadow-[0_0_20px_rgba(16,185,129,0.15)] group">
                        <img
                          src={profileForm.profileImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'}
                          alt="Dossier Portrait Preview"
                          className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[10px] text-emerald-400 font-bold tracking-wider">
                            ACTIVE AVATAR
                          </span>
                        </div>
                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                            <span className="text-[10px] text-emerald-300">Processing...</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 text-center">
                        Hover to preview full color / dossier grayscale
                      </span>
                    </div>

                    {/* Upload Controls */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="space-y-2">
                        <label className="text-zinc-400 font-semibold block text-[11px]">
                          UPLOAD NEW IMAGE FROM DISK
                        </label>
                        <div className="flex flex-wrap gap-2 items-center">
                          <input
                            type="file"
                            id="profile-avatar-file-input"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="profile-avatar-file-input"
                            className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500/60 text-emerald-400 font-bold flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <Upload className="w-4 h-4" />
                            <span>CHOOSE IMAGE FILE</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileForm((prev) => ({
                                ...prev,
                                profileImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                              }));
                              soundFx.playKeyClick();
                            }}
                            className="px-3 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer text-[11px]"
                          >
                            Reset to Default Dossier
                          </button>
                        </div>
                        {imageUploadError && (
                          <div className="text-rose-400 text-xs flex items-center gap-1.5 pt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{imageUploadError}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-zinc-500">
                          Supports PNG, JPG, WebP, SVG. Automatically optimized for retina screens and instant loading.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                        <label className="text-zinc-400 font-semibold block text-[11px]">
                          OR PROVIDE IMAGE WEB URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={profileForm.profileImage || ''}
                            onChange={(e) =>
                              setProfileForm((prev) => ({ ...prev, profileImage: e.target.value }))
                            }
                            placeholder="https://images.unsplash.com/... or https://avatars.githubusercontent.com/..."
                            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Headline & Core Branding */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>HERO HEADLINE & BRANDING</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        HEADLINE LEAD PHRASE
                      </label>
                      <input
                        type="text"
                        value={profileForm.headlineMain || ''}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, headlineMain: e.target.value }))
                        }
                        placeholder="offensive mindset. defensive results."
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none font-bold"
                      />
                      <span className="text-[10px] text-zinc-500">
                        White high-impact lead text in the hero section
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        HEADLINE ACCENT PHRASE
                      </label>
                      <input
                        type="text"
                        value={profileForm.headlineSub || ''}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, headlineSub: e.target.value }))
                        }
                        placeholder="meet ram."
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-emerald-400 text-xs focus:outline-none font-bold"
                      />
                      <span className="text-[10px] text-zinc-500">
                        Emerald highlighted callout (e.g., &ldquo;meet ram.&rdquo;)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        SITE TAGLINE & MISSION STATEMENT
                      </label>
                      <input
                        type="text"
                        value={profileForm.tagline || ''}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, tagline: e.target.value }))
                        }
                        placeholder="offensive mindset. defensive results. meet ram."
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        PORTFOLIO BRAND LOGO TEXT
                      </label>
                      <input
                        type="text"
                        value={profileForm.brandName || ''}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, brandName: e.target.value }))
                        }
                        placeholder="RAM.SEC"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        PROFESSIONAL POSITIONING SUBTITLE
                      </label>
                      <input
                        type="text"
                        value={profileForm.positioning || ''}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, positioning: e.target.value }))
                        }
                        placeholder="Offensive Security & Systems Hardening"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Contact & Communication Endpoints */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>CONTACT & DIRECT REACHABILITY</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        PRIMARY EMAIL ADDRESS
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={profileForm.email || ''}
                          onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                          }
                          placeholder="ram@cybersec.lab"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-zinc-200 text-xs focus:outline-none font-semibold text-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        PHONE / SIGNAL SECURE
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={profileForm.phone || ''}
                          onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          placeholder="+1 (555) 019-4829"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-zinc-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        BASE LOCATION / TIMEZONE
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={profileForm.location || ''}
                          onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, location: e.target.value }))
                          }
                          placeholder="San Francisco, CA // UTC-7"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-zinc-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Social Media & Platform Links */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>SOCIAL MEDIA PROFILES & HANDLES</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        X / TWITTER USERNAME OR LINK
                      </label>
                      <div className="relative">
                        <AtSign className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={profileForm.socialHandle || ''}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              socialHandle: e.target.value,
                              twitterUrl: e.target.value.startsWith('http')
                                ? e.target.value
                                : `https://x.com/${e.target.value.replace('@', '')}`,
                            }))
                          }
                          placeholder="@RAM_56688"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-zinc-200 text-xs focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500">
                        Links to Twitter / X across header, contact dossier, and footer
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        GITHUB PROFILE URL
                      </label>
                      <input
                        type="url"
                        value={profileForm.githubUrl || ''}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, githubUrl: e.target.value }))
                        }
                        placeholder="https://github.com/ram-sec"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        LINKEDIN PROFILE URL
                      </label>
                      <div className="relative">
                        <Linkedin className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          value={profileForm.linkedinUrl || ''}
                          onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                          }
                          placeholder="https://linkedin.com/in/ram-security"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-zinc-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        TELEGRAM ENCRYPTED HANDLE / URL
                      </label>
                      <div className="relative">
                        <MessageSquare className="w-3.5 h-3.5 text-sky-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={profileForm.telegramUrl || ''}
                          onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, telegramUrl: e.target.value }))
                          }
                          placeholder="https://t.me/ram_sec"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-zinc-200 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-zinc-400 font-semibold block text-[11px]">
                        DISCORD SEC OPS TAG
                      </label>
                      <input
                        type="text"
                        value={profileForm.discordHandle || ''}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, discordHandle: e.target.value }))
                        }
                        placeholder="ram.sec#0001"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: PGP Public Key */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>PGP PUBLIC KEY BLOCK</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      Allows visitors to send end-to-end encrypted vulnerability reports
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={profileForm.pgpPublicKey || ''}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, pgpPublicKey: e.target.value }))
                    }
                    placeholder="-----BEGIN PGP PUBLIC KEY BLOCK----- ..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg p-3 text-zinc-300 text-[11px] font-mono focus:outline-none"
                  />
                </div>

                {/* Save Button Footer */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-zinc-500 text-[11px]">
                    Changes apply immediately to your active session and persist across browser reloads.
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE ALL IDENTITY & SOCIAL CHANGES</span>
                  </button>
                </div>
              </form>
            )}

            {/* 0. Tab: Identity & Access Management (IAM) */}
            {activeTab === 'USERS' && (
              <div className="max-w-4xl space-y-6">
                <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-400" />
                      Identity & Access Management (IAM)
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Manage operator accounts, assign clearance roles, and synchronize with Supabase Auth.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playKeyClick();
                        setIsAddingUser(!isAddingUser);
                        setUserActionMsg(null);
                      }}
                      className="py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isAddingUser ? 'Cancel Provision' : 'Provision Operator'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playKeyClick();
                        setIsAuthModalOpen(true);
                      }}
                      className="py-2 px-3 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Supabase Settings</span>
                    </button>
                  </div>
                </div>

                {/* Supabase Engine Status Bar */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSupabaseConfigured
                          ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]'
                          : 'bg-cyan-400'
                      }`}
                    />
                    <div>
                      <span className="text-zinc-400">Authentication Backend: </span>
                      <span className={isSupabaseConfigured ? 'text-emerald-300 font-bold' : 'text-cyan-300 font-bold'}>
                        {isSupabaseConfigured ? 'Supabase Cloud Auth Active' : 'Local Supabase Sandbox Active'}
                      </span>
                      {isSupabaseConfigured && (
                        <span className="text-zinc-500 text-[10px] ml-2">({supabaseConfig.url})</span>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Row Level Security (RLS) & Role Metadata Synced
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Accounts</div>
                    <div className="text-xl font-bold text-white mt-1">{safeUsers.length}</div>
                    <div className="text-[10px] text-zinc-500">Registered Operators</div>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-amber-500/30">
                    <div className="text-[10px] text-amber-400/80 uppercase tracking-wider">Administrators</div>
                    <div className="text-xl font-bold text-amber-300 mt-1">
                      {safeUsers.filter((u) => u.role === 'admin').length}
                    </div>
                    <div className="text-[10px] text-amber-500/60">Level 3 Clearance</div>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-emerald-500/30">
                    <div className="text-[10px] text-emerald-400/80 uppercase tracking-wider">Researchers</div>
                    <div className="text-xl font-bold text-emerald-300 mt-1">
                      {safeUsers.filter((u) => u.role === 'researcher').length}
                    </div>
                    <div className="text-[10px] text-emerald-500/60">Level 2 Clearance</div>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-cyan-500/30">
                    <div className="text-[10px] text-cyan-400/80 uppercase tracking-wider">SOC Analysts</div>
                    <div className="text-xl font-bold text-cyan-300 mt-1">
                      {safeUsers.filter((u) => u.role === 'analyst').length}
                    </div>
                    <div className="text-[10px] text-cyan-500/60">Level 1 Clearance</div>
                  </div>
                </div>

                {/* New Operator Form */}
                {isAddingUser && (
                  <form
                    onSubmit={handleCreateUser}
                    className="p-5 rounded-xl bg-zinc-950 border border-emerald-500/40 space-y-4 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <h4 className="font-bold text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Provision New Operator Identity
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingUser(false)}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {userActionMsg && (
                      <div className="p-2.5 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                        {userActionMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Username / Handle</label>
                        <input
                          type="text"
                          required
                          value={newUserUsername}
                          onChange={(e) => setNewUserUsername(e.target.value)}
                          placeholder="e.g. jdoe"
                          className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Official Email</label>
                        <input
                          type="email"
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="jdoe@sec.local"
                          className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Passphrase Key</label>
                        <input
                          type="password"
                          required
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500 font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Clearance Role</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                          className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500 font-mono"
                        >
                          <option value="researcher">Researcher (Level 2)</option>
                          <option value="analyst">SOC Analyst (Level 1)</option>
                          <option value="admin">Administrator (Level 3 CMS)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingUser(false)}
                        className="py-2 px-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold"
                      >
                        Save & Provision
                      </button>
                    </div>
                  </form>
                )}

                {/* Registered Users Table */}
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                    <span className="font-bold text-zinc-300 text-xs tracking-wider">OPERATOR DIRECTORY</span>
                    <span className="text-[11px] text-zinc-500">{safeUsers.length} active identity records</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[10px] text-zinc-400 uppercase">
                        <tr>
                          <th className="py-2.5 px-4">Operator</th>
                          <th className="py-2.5 px-4">Email</th>
                          <th className="py-2.5 px-4">Role / Clearance</th>
                          <th className="py-2.5 px-4">Provider</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                        {safeUsers.map((u) => {
                          const isCurrent = currentUser?.id === u.id || currentUser?.username === u.username;
                          return (
                            <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-[11px] text-zinc-200 shrink-0">
                                    {(u.name || u.username || 'U')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      <span>{u.name}</span>
                                      {isCurrent && (
                                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[9px]">
                                          YOU
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-zinc-500">@{u.username}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-zinc-400 text-[11px]">{u.email}</td>
                              <td className="py-3 px-4">
                                <select
                                  value={u.role || 'researcher'}
                                  onChange={(e) => {
                                    soundFx.playKeyClick();
                                    updateUserRole(u.id, e.target.value as UserRole);
                                    showNotification(`Updated @${u.username}'s role to ${e.target.value.toUpperCase()}`);
                                  }}
                                  className={`py-1 px-2 rounded border text-[10px] font-mono outline-none cursor-pointer ${
                                    u.role === 'admin'
                                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 font-bold'
                                      : u.role === 'analyst'
                                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 font-bold'
                                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold'
                                  }`}
                                >
                                  <option value="admin" className="bg-zinc-900 text-amber-300">
                                    Admin (Level 3)
                                  </option>
                                  <option value="researcher" className="bg-zinc-900 text-emerald-300">
                                    Researcher (Level 2)
                                  </option>
                                  <option value="analyst" className="bg-zinc-900 text-cyan-300">
                                    SOC Analyst (Level 1)
                                  </option>
                                </select>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] border ${
                                    u.provider === 'supabase'
                                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                                      : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                                  }`}
                                >
                                  {u.provider === 'supabase' ? 'Supabase' : 'Local'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  disabled={isCurrent}
                                  onClick={() => {
                                    if (confirm(`Revoke identity for @${u.username}?`)) {
                                      soundFx.playKeyClick();
                                      deleteUserAccount(u.id);
                                      showNotification(`Account @${u.username} deleted.`);
                                    }
                                  }}
                                  className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors disabled:opacity-20 disabled:hover:text-zinc-500 cursor-pointer"
                                  title={isCurrent ? 'Cannot delete active session account' : 'Delete Account'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Session Testing Quick Switchers */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                    <span>ROLE SIMULATION & EVALUATION SWITCHER:</span>
                    <span className="text-zinc-600">Test clearance boundaries</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Quickly switch active sessions to verify that Researchers and SOC Analysts cannot edit CMS content, while Administrators have full governance:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playKeyClick();
                        login('researcher', 'researcher123');
                        showNotification('Switched session to Researcher (Alice Vance)');
                      }}
                      className="py-1.5 px-3 rounded-lg border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 text-xs hover:bg-emerald-950/50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Switch to Researcher (Alice Vance)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playKeyClick();
                        login('analyst', 'analyst123');
                        showNotification('Switched session to SOC Analyst (Bob Miller)');
                      }}
                      className="py-1.5 px-3 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs hover:bg-cyan-950/50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Switch to Analyst (Bob Miller)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playKeyClick();
                        login('admin', 'ramsec2026');
                        showNotification('Switched session to Administrator (Ram)');
                      }}
                      className="py-1.5 px-3 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 text-xs hover:bg-amber-950/50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Switch to Admin (Ram)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Tab: SOC Live Status Editor */}
            {activeTab === 'STATUS' && (
              <form onSubmit={handleSaveStatus} className="max-w-2xl space-y-5">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    SOC Real-Time Telemetry Settings
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    These values populate the Live Status Panel on the homepage.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">System Status</label>
                    <select
                      value={statusForm.systemStatus}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, systemStatus: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    >
                      <option value="OPERATIONAL">OPERATIONAL</option>
                      <option value="MONITORING">MONITORING</option>
                      <option value="DEGRADED">DEGRADED</option>
                      <option value="INCIDENT RESPONSE">INCIDENT RESPONSE</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Threat Level</label>
                    <select
                      value={statusForm.threatLevel}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, threatLevel: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    >
                      <option value="LOW">LOW</option>
                      <option value="GUARDED">GUARDED</option>
                      <option value="ELEVATED">ELEVATED</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Lab Status</label>
                    <select
                      value={statusForm.labStatus}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, labStatus: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    >
                      <option value="ONLINE">ONLINE</option>
                      <option value="RESEARCHING">RESEARCHING</option>
                      <option value="SANDBOX ACTIVE">SANDBOX ACTIVE</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">System Uptime</label>
                    <input
                      type="text"
                      value={statusForm.uptime}
                      onChange={(e) => setStatusForm({ ...statusForm, uptime: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-zinc-400 text-[11px] uppercase">Current Research Focus</label>
                    <input
                      type="text"
                      value={statusForm.currentFocus}
                      onChange={(e) => setStatusForm({ ...statusForm, currentFocus: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>COMMIT STATUS CHANGES</span>
                </button>
              </form>
            )}

            {/* 2. Tab: Metrics Calibration */}
            {activeTab === 'METRICS' && (
              <form onSubmit={handleSaveMetrics} className="max-w-2xl space-y-5">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Verified Portfolio Metrics Editor
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Update counts of verified achievements. If value is 0, &apos;Building&apos; is automatically rendered.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Security Projects</label>
                    <input
                      type="number"
                      value={metricsForm.securityProjects}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, securityProjects: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Research Write-ups</label>
                    <input
                      type="number"
                      value={metricsForm.writeups}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, writeups: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Lab Hours</label>
                    <input
                      type="number"
                      value={metricsForm.labHours}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, labHours: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Arsenal Tools</label>
                    <input
                      type="number"
                      value={metricsForm.tools}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, tools: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">Certifications</label>
                    <input
                      type="number"
                      value={metricsForm.certifications}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, certifications: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[11px] uppercase">GitHub Repos</label>
                    <input
                      type="number"
                      value={metricsForm.githubProjects}
                      onChange={(e) =>
                        setMetricsForm({ ...metricsForm, githubProjects: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>CALIBRATE METRICS</span>
                </button>
              </form>
            )}

            {/* 3. Tab: Projects Manager */}
            {activeTab === 'PROJECTS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-purple-400" />
                      Project Showcase Management
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Manage repositories, threat models, and live demonstrators.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingProject(!isAddingProject)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingProject ? 'CANCEL' : 'ADD NEW PROJECT'}</span>
                  </button>
                </div>

                {isAddingProject && (
                  <form onSubmit={handleCreateProject} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold text-emerald-400">Register New Security Project</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Project Name (e.g. AuthShield)"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      >
                        <option value="WEB SECURITY">WEB SECURITY</option>
                        <option value="NETWORK">NETWORK</option>
                        <option value="PYTHON">PYTHON</option>
                        <option value="OSINT">OSINT</option>
                        <option value="LINUX">LINUX</option>
                        <option value="RESEARCH">RESEARCH</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Short description..."
                        className="sm:col-span-2 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                        value={newProject.shortDescription}
                        onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                      />
                      <textarea
                        placeholder="Security problem addressed..."
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                        value={newProject.problem}
                        onChange={(e) => setNewProject({ ...newProject, problem: e.target.value })}
                      />
                      <textarea
                        placeholder="Engineered defensive solution..."
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                        value={newProject.solution}
                        onChange={(e) => setNewProject({ ...newProject, solution: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-emerald-500 text-zinc-950 font-bold"
                    >
                      SAVE PROJECT
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{proj.name}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                            {proj.category}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            [{proj.status}]
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1 line-clamp-1">
                          {proj.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${proj.name}"?`)) {
                              deleteProject(proj.id);
                            }
                          }}
                          className="p-2 rounded bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Tab: Write-ups Manager */}
            {activeTab === 'WRITEUPS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      Security Write-ups & Research CMS
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Publish vulnerabilities, technical write-ups, and CTF analyses.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingWriteUp(!isAddingWriteUp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingWriteUp ? 'CANCEL' : 'WRITE NEW ARTICLE'}</span>
                  </button>
                </div>

                {isAddingWriteUp && (
                  <form onSubmit={handleCreateWriteUp} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold text-emerald-400">Publish New Security Write-up</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Article Title"
                        value={newWriteUp.title}
                        onChange={(e) => setNewWriteUp({ ...newWriteUp, title: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <select
                        value={newWriteUp.difficulty}
                        onChange={(e) => setNewWriteUp({ ...newWriteUp, difficulty: e.target.value as any })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      >
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                        <option value="ELITE">ELITE</option>
                      </select>
                      <textarea
                        rows={2}
                        placeholder="Executive Excerpt..."
                        className="sm:col-span-2 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                        value={newWriteUp.excerpt}
                        onChange={(e) => setNewWriteUp({ ...newWriteUp, excerpt: e.target.value })}
                      />
                      <textarea
                        rows={6}
                        placeholder="Markdown Content..."
                        className="sm:col-span-2 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono"
                        value={newWriteUp.content}
                        onChange={(e) => setNewWriteUp({ ...newWriteUp, content: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-emerald-500 text-zinc-950 font-bold"
                    >
                      PUBLISH WRITE-UP
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {writeUps.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{w.title}</span>
                          <span className="text-[10px] text-zinc-400">({w.category})</span>
                          {w.featured && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{w.excerpt}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Delete write-up "${w.title}"?`)) {
                              deleteWriteUp(w.id);
                            }
                          }}
                          className="p-2 rounded bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete write-up"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Tab: Daily Log Manager */}
            {activeTab === 'LOGS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Daily Research Log Journal
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Document real-time laboratory hypotheses, discoveries, and troubleshooting.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingLog(!isAddingLog)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingLog ? 'CANCEL' : 'RECORD NEW ENTRY'}</span>
                  </button>
                </div>

                {isAddingLog && (
                  <form onSubmit={handleCreateLog} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold text-emerald-400">Record Security Log Entry</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Date (e.g. 10 SEP 2026)"
                        value={newLog.date}
                        onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Log Title"
                        value={newLog.title}
                        onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <textarea
                        placeholder="What I worked on..."
                        value={newLog.workedOn}
                        onChange={(e) => setNewLog({ ...newLog, workedOn: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <textarea
                        placeholder="What I learned..."
                        value={newLog.learned}
                        onChange={(e) => setNewLog({ ...newLog, learned: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <textarea
                        placeholder="What failed..."
                        value={newLog.failed}
                        onChange={(e) => setNewLog({ ...newLog, failed: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <textarea
                        placeholder="What I will try next..."
                        value={newLog.willTryNext}
                        onChange={(e) => setNewLog({ ...newLog, willTryNext: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-emerald-500 text-zinc-950 font-bold"
                    >
                      COMMIT LOG TO DATABASE
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {dailyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">[{log.date}]</span>
                          <span className="text-white font-bold">{log.title}</span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{log.workedOn}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Delete log entry?`)) {
                            deleteDailyLog(log.id);
                          }
                        }}
                        className="p-2 rounded bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Tab: Skills Manager */}
            {activeTab === 'SKILLS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-teal-400" />
                      Arsenal Competency Matrix
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Update offensive, defensive, and tooling skill proficiencies.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingSkill(!isAddingSkill)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingSkill ? 'CANCEL' : 'ADD SKILL'}</span>
                  </button>
                </div>

                {isAddingSkill && (
                  <form onSubmit={handleCreateSkill} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Skill Name (e.g. eBPF Filtering)"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      >
                        <option value="OFFENSIVE SECURITY">OFFENSIVE SECURITY</option>
                        <option value="DEFENSIVE SECURITY">DEFENSIVE SECURITY</option>
                        <option value="NETWORKING">NETWORKING</option>
                        <option value="PROGRAMMING">PROGRAMMING</option>
                        <option value="OSINT">OSINT</option>
                        <option value="TOOLS">TOOLS</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Proficiency % (1-100)"
                        value={newSkill.proficiencyPercent}
                        onChange={(e) => setNewSkill({ ...newSkill, proficiencyPercent: parseInt(e.target.value) || 50 })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <input
                        type="text"
                        placeholder="Description..."
                        value={newSkill.description}
                        onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                        className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-500 text-zinc-950 font-bold">
                      SAVE SKILL
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white">{s.name}</div>
                        <div className="text-[10px] text-zinc-500">{s.category} • {s.proficiencyPercent}%</div>
                      </div>
                      <button
                        onClick={() => deleteSkill(s.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Tab: Contact Inquiries Viewer */}
            {activeTab === 'MESSAGES' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-rose-400" />
                    Secure Inquiries Inbox ({safeContactMessages.length})
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Messages transmitted through the site&apos;s contact endpoint.
                  </p>
                </div>

                {safeContactMessages.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                    No inquiries received yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {safeContactMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{msg.name}</span>
                            <span className="text-zinc-400 text-[11px]">&lt;{msg.email}&gt;</span>
                            <span className="px-2 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-emerald-400">
                              {msg.inquiryType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-[10px]">{msg.timestamp}</span>
                            {deleteMessage && (
                              <button
                                onClick={() => deleteMessage(msg.id)}
                                className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-zinc-300 font-semibold">{msg.subject}</div>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 8. Tab: Audit Trail */}
            {activeTab === 'AUDIT' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-zinc-400" />
                    Security Event Audit Log
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Immutable activity log tracking administrator actions, authentications, and data modifications.
                  </p>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-[11px] font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-zinc-500">{log.timestamp}</span>
                        <span className="font-bold text-emerald-400">[{log.action}]</span>
                        <span className="text-zinc-300">{log.details}</span>
                      </div>
                      <div className="text-zinc-500 text-[10px]">
                        user: {log.user} • ip: {log.ip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Tab: Database SQL Schema Export */}
            {activeTab === 'SQL_EXPORT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      PostgreSQL / Supabase Schema Exporter
                    </h3>
                    <p className="text-zinc-400 text-xs">
                      Deploy ready DDL SQL script to migrate this portfolio to Supabase or any PostgreSQL instance.
                    </p>
                  </div>
                  <button
                    onClick={copySqlSchema}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'COPIED TO CLIPBOARD' : 'COPY SQL DDL'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-[400px]">
                  {SUPABASE_POSTGRES_SCHEMA}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
