export type ThreatLevel = 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
export type SystemStatus = 'OPERATIONAL' | 'MONITORING' | 'MAINTENANCE' | 'DEGRADED';
export type LabStatus = 'ONLINE' | 'STANDBY' | 'BUSY' | 'OFFLINE';

export interface LiveStatus {
  systemStatus: SystemStatus;
  threatLevel: ThreatLevel;
  labStatus: LabStatus;
  currentFocus: string;
  lastUpdate: string;
  uptime: string;
  activeProbesCount: number;
}

export interface PersonalMetrics {
  securityProjects: number;
  writeups: number;
  labHours: number;
  tools: number;
  certifications: number;
  githubProjects: number;
}

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'RESEARCH' | 'ARCHIVED';
export type ProjectCategory = 'ALL' | 'WEB SECURITY' | 'NETWORK' | 'PYTHON' | 'OSINT' | 'LINUX' | 'RESEARCH';

export interface Project {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  problem: string;
  solution: string;
  technologies: string[];
  securityConcepts: string[];
  githubLink: string;
  liveDemo?: string;
  date: string;
  status: ProjectStatus;
  category: ProjectCategory;
  featured?: boolean;
}

export type WriteUpDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
export type WriteUpCategory = 
  | 'Web Security' 
  | 'Linux' 
  | 'Networking' 
  | 'OSINT' 
  | 'CTF' 
  | 'Threat Intelligence' 
  | 'Defensive Security' 
  | 'Security Research';

export interface WriteUp {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
  difficulty: WriteUpDifficulty;
  category: WriteUpCategory;
  tags: string[];
  references?: string[];
  featured?: boolean;
  published: boolean;
  views: number;
}

export interface DailyLog {
  id: string;
  date: string;
  title: string;
  workedOn: string;
  learned: string;
  failed: string;
  willTryNext: string;
  tags: string[];
}

export type SkillCategory = 
  | 'OFFENSIVE SECURITY' 
  | 'DEFENSIVE SECURITY' 
  | 'NETWORKING' 
  | 'PROGRAMMING' 
  | 'OSINT' 
  | 'TOOLS';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  projectsUsingIt: string[];
  iconName: string;
  proficiencyPercent: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  status: 'VERIFIED' | 'IN PROGRESS' | 'PLANNED';
  date: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  highlights: string[];
}

export interface LabExperiment {
  id: string;
  title: string;
  category: 'Web Security' | 'Linux' | 'Network' | 'CTF' | 'Forensics';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'Active' | 'Completed' | 'Draft';
  summary: string;
  environment: string;
  toolsUsed: string[];
  findings: string;
  authorizedDisclaimer: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export type UserRole = 'admin' | 'researcher' | 'analyst' | 'guest';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinedDate: string;
  savedArticles: string[]; // writeUp IDs
  lastLogin?: string;
  provider?: 'supabase' | 'local';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: 'INFO' | 'WARNING' | 'ALERT';
  details: string;
}

export interface SiteSettings {
  name: string;
  brandName: string;
  tagline: string;
  headlineMain?: string;
  headlineSub?: string;
  positioning: string;
  location: string;
  profileImage?: string;
  socialHandle: string;
  twitterUrl?: string;
  githubUrl: string;
  linkedinUrl: string;
  telegramUrl?: string;
  discordHandle?: string;
  email: string;
  phone?: string;
  pgpPublicKey?: string;
  audioEffects: boolean;
}
