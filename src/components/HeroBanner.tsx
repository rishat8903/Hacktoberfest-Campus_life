import React from 'react';
import {
  Sparkles,
  BookOpen,
  Bus,
  FileCheck,
  HeartPulse,
  ArrowRight,
  GraduationCap,
  PlayCircle,
} from 'lucide-react';
import { ActiveTab, Language } from '../types/campus';

interface HeroBannerProps {
  language: Language;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenSos: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onNavigateTab,
  onOpenSos,
}) => {
  const isBn = language === 'bn';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl mb-6">
      {/* Decorative ambient glowing orbs (Upscale aesthetic) */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-1/2 -right-16 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl">
        {/* Glowing Pill Tag */}
        <div className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold mb-4 text-emerald-300 shadow-xs transition cursor-default">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {isBn
              ? 'আইআইইউসি কুমিরা ক্যাম্পাস ডেইলি কোপাইলট • জেম্মা ৪ ও ইলেভেনল্যাবস'
              : 'IIUC Kumira Campus Daily Copilot • Powered by Gemma 4 & ElevenLabs'}
          </span>
        </div>

        {/* Expressive Title with Stylized Curved Underline SVG */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
          {isBn ? (
            <>
              ক্যাম্পাস লাইফ ও পড়াশোনার সব জটিলতা শেষ{' '}
              <span className="relative inline-block text-emerald-400">
                এক ক্লিকে
                <svg
                  className="absolute -bottom-2 left-0 w-full animate-draw-underline"
                  height="10"
                  viewBox="0 0 200 10"
                  fill="none"
                >
                  <path
                    d="M2 8C60 2 140 2 198 8"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </>
          ) : (
            <>
              Ace Your University Life & Exams at{' '}
              <span className="relative inline-block text-emerald-400">
                Kumira
                <svg
                  className="absolute -bottom-2 left-0 w-full animate-draw-underline"
                  height="10"
                  viewBox="0 0 200 10"
                  fill="none"
                >
                  <path
                    d="M2 8C60 2 140 2 198 8"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </>
          )}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-3 max-w-2xl leading-relaxed font-normal">
          {isBn
            ? 'হাতে লেখা নোটের ছবি তুলে সাথে সাথে কুইজ তৈরি, কুমিরা ⇄ চট্টগ্রাম সিটির পরবর্তী বাসের সময়সূচী, ফেসবুকের ছড়ানো নোটিশ ডিকোড এবং অফিসিয়াল ছুটির দরখাস্ত তৈরি।'
            : 'Turn photos of lecture notes into practice quizzes, navigate Kumira university buses in real-time, decode scattered campus notices, and generate 1-click official leave applications.'}
        </p>

        {/* Quick Action Interactive Cards (Upscale style grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <button
            onClick={() => onNavigateTab('study')}
            className="group p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 backdrop-blur-md transition-all duration-300 text-left cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-white">
              {isBn ? 'নোট টু কুইজ' : 'Notes to Quiz'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {isBn ? 'ছবি দেখে ব্যাখ্যা ও কুইজ' : 'Gemma 4 Multimodal'}
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('bus')}
            className="group p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 backdrop-blur-md transition-all duration-300 text-left cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Bus className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-white">
              {isBn ? 'কুমিরা বাস শিডিউল' : 'Kumira Bus Timetable'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {isBn ? 'পরবর্তী বাস কাউন্টডাউন' : 'Live Counter Delays'}
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('notices')}
            className="group p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 backdrop-blur-md transition-all duration-300 text-left cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-white">
              {isBn ? 'ছুটির দরখাস্ত প্রিন্ট' : 'Leave Letter Gen'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {isBn ? 'ডিন/চেয়ারম্যানের ফরম' : 'A4 PDF Ready'}
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('wellbeing')}
            className="group p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 backdrop-blur-md transition-all duration-300 text-left cursor-pointer hover:-translate-y-1 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-white">
              {isBn ? 'ক্যাম্পাস কেয়ার ও SOS' : 'Campus Care & SOS'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {isBn ? '৪-ধাপ ট্রায়াজ ও হল হেল্প' : '4-Tier Health Triage'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
