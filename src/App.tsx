import React, { useState } from 'react';
import { Header } from './components/Header';
import { Campus3DHero } from './components/Campus3DHero';
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
      {/* Unified Top Header with integrated segmented navigation, voice controls, language & SOS */}
      <Header
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        voiceConfig={voiceConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6">
        {/* Interactive Three.js 3D Hero Showcase */}
        <Campus3DHero
          activeTab={activeTab}
          onNavigateTab={setActiveTab}
          language={language}
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
              IIUC CampusMate — Student Academic & Campus Life Portal
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Built for International Islamic University Chittagong • Kumira Campus
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
