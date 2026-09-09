import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected?: boolean;
}

export interface LocalUserAccount {
  user: User;
  passwordHash?: string;
}

const SUPABASE_CONFIG_KEY = 'RAM_SEC_SUPABASE_CONFIG';
const LOCAL_ACCOUNTS_KEY = 'RAM_SEC_LOCAL_ACCOUNTS';

export const DEFAULT_OPERATOR_ACCOUNTS: LocalUserAccount[] = [
  {
    user: {
      id: 'usr-admin-01',
      name: 'Ram',
      username: 'ram',
      email: 'ram@ramsec.internal',
      role: 'admin',
      joinedDate: 'Jan 2024',
      savedArticles: [],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      provider: 'local',
    },
    passwordHash: 'admin123',
  },
  {
    user: {
      id: 'usr-guest-02',
      name: 'Security Researcher',
      username: 'researcher',
      email: 'researcher@lab.internal',
      role: 'researcher',
      joinedDate: 'Mar 2026',
      savedArticles: [],
      provider: 'local',
    },
    passwordHash: 'researcher123',
  },
];

let supabaseInstance: SupabaseClient | null = null;

export const getActiveSupabaseConfig = (): SupabaseConfig => {
  if (typeof window === 'undefined') {
    return { url: '', anonKey: '', connected: false };
  }
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return { ...parsed, connected: true };
      }
    }
  } catch (_) {}
  return { url: '', anonKey: '', connected: false };
};

export const initSupabase = (): SupabaseClient | null => {
  const config = getActiveSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
};

export const isSupabaseConnected = (): boolean => {
  const config = getActiveSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

export const saveCustomSupabaseConfig = (
  configOrUrl: SupabaseConfig | string,
  maybeAnonKey?: string
): void => {
  if (typeof window === 'undefined') return;
  try {
    const config: SupabaseConfig =
      typeof configOrUrl === 'string'
        ? { url: configOrUrl, anonKey: maybeAnonKey || '' }
        : configOrUrl;

    if (!config.url || !config.anonKey) {
      localStorage.removeItem(SUPABASE_CONFIG_KEY);
      supabaseInstance = null;
    } else {
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
      supabaseInstance = createClient(config.url, config.anonKey);
    }
  } catch (e) {
    console.error('Failed to save Supabase config to local storage', e);
  }
};

export const getLocalUserAccounts = (): LocalUserAccount[] => {
  if (typeof window === 'undefined') return DEFAULT_OPERATOR_ACCOUNTS;
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return DEFAULT_OPERATOR_ACCOUNTS;
};

export const saveLocalUserAccounts = (accounts: LocalUserAccount[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts locally', e);
  }
};

export const SUPABASE_SQL_SCHEMA = `-- RAM.SEC Supabase Essential Setup
-- Run this in your Supabase SQL Editor to prepare authentication & telemetry

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'researcher',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT USING (true);
`;
