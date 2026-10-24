import React from 'react';
import {
  GraduationCap,
  Bus,
  PhoneCall,
  Globe,
  Sparkles,
  ShieldAlert,
  Clock,
  HeartPulse,
} from 'lucide-react';
import { Language } from '../types/campus';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenSosModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenSosModal,
}) => {
  const isBn = language === 'bn';

  return (
    <header className="bg-slate-900 text-white border-b-4 border-emerald-600 shadow-md no-print sticky top-0 z-40">
      {/* Top Banner Alert / Emergency Hotlines */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 text-[11px] sm:text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-400">IIUC Kumira Campus Active</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">
              {isBn ? 'কুমিরা ক্যাম্পাস ও চট্টগ্রাম সিটি সার্ভিস' : 'Kumira Campus & CTG City Services'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSosModal}
              className="flex items-center gap-1.5 text-rose-300 hover:text-white bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 px-2 py-0.5 rounded text-[11px] font-bold transition active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{isBn ? 'জরুরি এসওএস / হল হেল্প' : 'Emergency SOS / Hall Help'}</span>
            </button>

            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 text-[11px] font-semibold transition cursor-pointer"
              title="Toggle Language / ভাষা পরিবর্তন করুন"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'EN' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>IIUC CampusMate</span>
                  <span className="text-emerald-400 text-sm sm:text-base font-semibold">
                    (ক্যাম্পাস-সাথী)
                  </span>
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  Gemma 4 + ElevenLabs
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                {isBn
                  ? 'হাতের লেখার নোট থেকে কুইজ • কুমিরা বাসের সময়সূচী • নোটিশ ও ছুটির আবেদন • ক্যাম্পাস হেলথ'
                  : 'Handwritten Notes to Quiz • Kumira Bus Navigator • Notices & Leave Generator • Student Care'}
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <div className="bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-slate-300">
              <Bus className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? '১৬টি বাস রুট' : '16 Bus Routes'}</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'ওপেন-সোর্স এআই' : 'Open-Weights AI'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
