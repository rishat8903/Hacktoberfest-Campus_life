import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ShieldAlert,
  Globe,
  Radio,
  Volume2,
} from 'lucide-react';
import { Language, VoiceConfig } from '../types/campus';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenSosModal: () => void;
  onOpenVoiceModal: () => void;
  voiceConfig: VoiceConfig;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenSosModal,
  onOpenVoiceModal,
  voiceConfig,
}) => {
  const isBn = language === 'bn';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 no-print transition-all">
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
              <span>Gemma 4 • ElevenLabs Multimodal</span>
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

      {/* Main Elevated Nav Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-6 h-6 text-emerald-100" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 leading-none font-display">
                  Campus<span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">Mate</span>
                </h1>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  IIUC Copilot
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium hidden sm:block">
                {isBn
                  ? 'হাতের লেখার নোট থেকে কুইজ • কুমিরা বাস • নোটিশ ও ছুটির দরখাস্ত • স্টুডেন্ট কেয়ার'
                  : 'Handwritten Notes to Quiz • Kumira Bus • Notices & Leave Letters • 24/7 Care'}
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
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

            {/* Language Switcher Button (Upscale style glass pill) */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-bold border border-slate-300/80 transition active:scale-95 cursor-pointer shadow-xs"
              title="Toggle Bengali / English"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'EN (English)' : 'বাংলা (BN)'}</span>
            </button>

            {/* Quick Emergency Button */}
            <button
              onClick={onOpenSosModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isBn ? 'জরুরি হেল্প' : 'Help & SOS'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
