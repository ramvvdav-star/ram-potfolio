/**
 * RAM.SEC Supabase PostgreSQL Full Migration Schema
 * Designed for immediate copy/paste into the Supabase SQL Query Editor.
 */

export const SUPABASE_POSTGRES_SCHEMA = `-- RAM.SEC Cyber Operations - Complete Supabase PostgreSQL Schema
-- Run this script in the Supabase SQL Editor to provision all portfolio telemetry tables.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'researcher',
  avatar_url TEXT,
  saved_articles TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Security Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
  security_concepts TEXT[] DEFAULT ARRAY[]::TEXT[],
  github_link TEXT,
  live_demo TEXT,
  date TEXT,
  status TEXT DEFAULT 'ACTIVE',
  category TEXT DEFAULT 'RESEARCH',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Technical Write-Ups Table
CREATE TABLE IF NOT EXISTS public.writeups (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  reading_time TEXT,
  difficulty TEXT DEFAULT 'INTERMEDIATE',
  category TEXT DEFAULT 'Security Research',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  references TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Daily SecOps Log Table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  worked_on TEXT NOT NULL,
  learned TEXT NOT NULL,
  failed TEXT NOT NULL,
  will_try_next TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Contact Inquiries / Transmission Log
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Audit Log Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  severity TEXT DEFAULT 'INFO',
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writeups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Published writeups are viewable by everyone" ON public.writeups FOR SELECT USING (published = true);
CREATE POLICY "Daily logs are viewable by everyone" ON public.daily_logs FOR SELECT USING (true);

-- Authenticated Insert Policies
CREATE POLICY "Anyone can submit a contact transmission" ON public.contact_messages FOR INSERT WITH CHECK (true);
`;
