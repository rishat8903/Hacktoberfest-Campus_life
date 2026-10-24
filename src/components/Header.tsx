import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ShieldAlert,
  Globe,
  Radio,
  Volume2,
  BookOpen,
  Bus,
  FileText,
  HeartPulse,
} from 'lucide-react';
import { ActiveTab, Language, VoiceConfig } from '../types/campus';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenSosModal: () => void;
  onOpenVoiceModal: () => void;
  voiceConfig: VoiceConfig;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenSosModal,
  onOpenVoiceModal,
  voiceConfig,
  activeTab,
  onTabChange,
}) => {
  const isBn = language === 'bn';

  const tabs = [
    {
      id: 'study' as ActiveTab,
      labelBn: 'নোট ও কুইজ এআই',
      labelEn: 'Study Hub & Quiz',
      subBn: 'ছবি থেকে কুইজ',
      subEn: 'Notes to Practice Quiz',
      icon: BookOpen,
      accentColor: 'text-emerald-600 bg-emerald-50',
      activeBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'bus' as ActiveTab,
      labelBn: 'কুমিরা বাস শিডিউল',
      labelEn: 'Kumira Bus Timetable',
      subBn: 'পরবর্তী বাস ট্র্যাকিং',
      subEn: '16 Live Routes',
      icon: Bus,
      accentColor: 'text-amber-600 bg-amber-50',
      activeBg: 'bg-amber-600 text-white',
    },
    {
      id: 'notices' as ActiveTab,
      labelBn: 'কভার পেজ ও দরখাস্ত',
      labelEn: 'Lab Cover & Leave Gen',
      subBn: 'A4 প্রিন্ট ফরম',
      subEn: 'A4 PDF Ready',
      icon: FileText,
      accentColor: 'text-blue-600 bg-blue-50',
      activeBg: 'bg-blue-600 text-white',
    },
    {
      id: 'wellbeing' as ActiveTab,
      labelBn: 'স্টুডেন্ট কেয়ার ও কাউন্সেলিং',
      labelEn: 'Student Care & Counseling',
      subBn: 'মন-সাথী সাপোর্ট',
      subEn: 'Triage & Support',
      icon: HeartPulse,
      accentColor: 'text-emerald-600 bg-emerald-50',
      activeBg: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/90 sticky top-0 z-40 no-print transition-all shadow-xs">
      {/* Top micro-bar for Live Campus Status and Emergency Hotline */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-[11px] border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 tracking-wide uppercase text-[10px]">
              IIUC Kumira Campus
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-300">
              {isBn ? 'কুমিরা ক্যাম্পাস ও চট্টগ্রাম সিটি পরিবহন সার্ভিস লাইভ' : 'Kumira Campus & City Bus Services Active'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300 text-[10px]">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>{isBn ? '২৪/৭ ক্যাম্পাস সার্ভিস' : '24/7 Campus Services'}</span>
            </span>

            <button
              onClick={onOpenSosModal}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 hover:text-white hover:bg-rose-600 border border-rose-500/30 text-[10px] font-bold transition active:scale-95 cursor-pointer shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{isBn ? 'জরুরি হল এসওএস (SOS)' : 'Emergency Hall SOS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Elevated Nav Bar: Branding & Tools */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-6 h-6 text-emerald-100" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 leading-none font-display">
                  Campus<span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">Mate</span>
                </h1>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  IIUC Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium hidden md:block">
                {isBn
                  ? 'আন্তর্জাতিক ইসলামী বিশ্ববিদ্যালয় চট্টগ্রাম • কুমিরা ক্যাম্পাস'
                  : 'International Islamic University Chittagong • Student Portal'}
              </p>
            </div>
          </div>

          {/* Right Action Tools: Voice, Language, SOS */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Voice Settings Trigger */}
            <button
              onClick={onOpenVoiceModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-bold border border-purple-200 transition active:scale-95 cursor-pointer shadow-xs"
              title="Configure ElevenLabs Voice & Speakers"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Voice:</span>
              <span>{voiceConfig.name.split(' ')[0]}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-200 text-purple-950 font-bold uppercase">
                {voiceConfig.speechLang}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-bold border border-slate-300/80 transition active:scale-95 cursor-pointer shadow-xs"
              title="Toggle Bengali / English"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Emergency Button */}
            <button
              onClick={onOpenSosModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'জরুরি হেল্প' : 'Help & SOS'}</span>
              <span className="sm:hidden">SOS</span>
            </button>
          </div>
        </div>

        {/* Clean Integrated Segmented Pill Navigation (Zero Overlap & 100% Responsive) */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-2xl transition-all duration-200 cursor-pointer text-left border ${
                    isActive
                      ? 'bg-emerald-900 text-white border-emerald-800 shadow-md font-bold'
                      : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 border-slate-200/80 font-medium'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? tab.activeBg : tab.accentColor
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="leading-tight truncate">
                    <div className="text-xs sm:text-sm font-bold truncate">
                      {isBn ? tab.labelBn : tab.labelEn}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 truncate ${
                        isActive ? 'text-slate-300 font-medium' : 'text-slate-500'
                      }`}
                    >
                      {isBn ? tab.subBn : tab.subEn}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
