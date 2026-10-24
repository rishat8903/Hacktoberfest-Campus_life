import React from 'react';
import {
  BookOpen,
  Bus,
  FileText,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { ActiveTab, Language } from '../types/campus';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const isBn = language === 'bn';

  const tabs = [
    {
      id: 'study' as ActiveTab,
      labelBn: 'নোট ও কুইজ এআই',
      labelEn: 'Study Hub & Quiz',
      subBn: 'ছবি থেকে কুইজ ও ব্যাখ্যা',
      subEn: 'Handwriting to Quiz',
      icon: BookOpen,
      badge: 'Gemma 4',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'bus' as ActiveTab,
      labelBn: 'কুমিরা বাস নেভিগেটর',
      labelEn: 'Kumira Bus Navigator',
      subBn: 'পরবর্তী বাস ও সময়সূচী',
      subEn: 'Next Bus & Timetable',
      icon: Bus,
      badge: 'Live',
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'notices' as ActiveTab,
      labelBn: 'নোটিশ ও ছুটির আবেদন',
      labelEn: 'Notices & Leave Gen',
      subBn: 'অফিসিয়াল ছুটির দরখাস্ত',
      subEn: 'OCR Notice & Letter',
      icon: FileText,
      badge: 'Print Ready',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
    {
      id: 'wellbeing' as ActiveTab,
      labelBn: 'ক্যাম্পাস কেয়ার ও ট্রায়াজ',
      labelEn: 'Campus Care & SOS',
      subBn: 'অসুস্থতা ও স্টাডি ডি-স্ট্রেস',
      subEn: 'Health Triage & Support',
      icon: HeartPulse,
      badge: '24/7',
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-[94px] sm:top-[74px] z-30 no-print shadow-sm">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition whitespace-nowrap shrink-0 text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="leading-tight">
                  <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                    {tab.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isActive
                            ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-600'
                            : tab.badgeColor
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {isBn ? tab.subBn : tab.subEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
