import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HeroBanner } from './components/HeroBanner';
import { EmergencySosModal } from './components/EmergencySosModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { StudyHubTab } from './components/tabs/StudyHubTab';
import { BusNavigatorTab } from './components/tabs/BusNavigatorTab';
import { NoticesFormsTab } from './components/tabs/NoticesFormsTab';
import { WellbeingTab } from './components/tabs/WellbeingTab';
import { ActiveTab, Language, VoiceConfig } from './types/campus';
import { getStoredVoiceConfig } from './utils/audioService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('study');
  const [language, setLanguage] = useState<Language>('en'); // Default to clean academic English
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>(getStoredVoiceConfig());

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header with branding, voice controls, language switcher & emergency hotline */}
      <Header
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        voiceConfig={voiceConfig}
      />

      {/* Primary Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6">
        {/* Upscale-inspired Hero Banner */}
        <HeroBanner
          language={language}
          onNavigateTab={setActiveTab}
          onOpenSos={() => setIsSosModalOpen(true)}
        />

        {/* Tab Modules */}
        <div style={{ display: activeTab === 'study' ? 'block' : 'none' }}>
          <StudyHubTab
            language={language}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            voiceConfig={voiceConfig}
          />
        </div>

        <div style={{ display: activeTab === 'bus' ? 'block' : 'none' }}>
          <BusNavigatorTab
            language={language}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            voiceConfig={voiceConfig}
          />
        </div>

        <div style={{ display: activeTab === 'notices' ? 'block' : 'none' }}>
          <NoticesFormsTab language={language} />
        </div>

        <div style={{ display: activeTab === 'wellbeing' ? 'block' : 'none' }}>
          <WellbeingTab
            language={language}
            onOpenSos={() => setIsSosModalOpen(true)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            voiceConfig={voiceConfig}
          />
        </div>
      </main>

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        language={language}
      />

      {/* Voice & Speaker Studio Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        onConfigChange={(newCfg) => setVoiceConfig(newCfg)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-4 text-xs no-print mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-200">
              IIUC CampusMate — Intelligent Open-Source AI Campus Life Copilot
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Built for Hacktoberfest Hack Day • Powered by Gemma 4 Multimodal & ElevenLabs Multilingual V2
            </p>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            <span>International Islamic University Chittagong (IIUC) • Kumira Campus</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
