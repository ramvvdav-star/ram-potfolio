/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveStatusPanel } from './components/LiveStatusPanel';
import { PersonalMetrics } from './components/PersonalMetrics';
import { AboutSection } from './components/AboutSection';
import { ArsenalSection } from './components/ArsenalSection';
import { ProjectsSection } from './components/ProjectsSection';
import { WriteUpsSection } from './components/WriteUpsSection';
import { DailyLogSection } from './components/DailyLogSection';
import { SecurityLabSection } from './components/SecurityLabSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#06080d] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden">
        {/* Navigation Bar */}
        <Navbar />

        {/* Core Layout Content */}
        <main className="relative z-10">
          <HeroSection />
          <LiveStatusPanel />
          <PersonalMetrics />
          <AboutSection />
          <ArsenalSection />
          <ProjectsSection />
          <WriteUpsSection />
          <DailyLogSection />
          <SecurityLabSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Overlays & Modals */}
        <CommandPalette />
        <InteractiveTerminal />
        <AuthModal />
        <UserProfileModal />
        <AdminDashboard />
      </div>
    </AppProvider>
  );
}

