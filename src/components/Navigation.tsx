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
      subEn: 'Handwritten to Quiz',
      icon: BookOpen,
      badge: 'Gemma 4',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'bus' as ActiveTab,
      labelBn: 'কুমিরা বাস নেভিগেটর',
      labelEn: 'Kumira Bus Navigator',
      subBn: 'পরবর্তী বাস ও সময়সূচী',
      subEn: 'Live Timetable',
      icon: Bus,
      badge: '16 Routes',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'notices' as ActiveTab,
      labelBn: 'কভার পেজ ও ছুটির ফরম',
      labelEn: 'Lab Cover & Leave Gen',
      subBn: '১-ক্লিকে কভার ও দরখাস্ত প্রিন্ট',
      subEn: 'A4 Cover & Letter Gen',
      icon: FileText,
      badge: 'A4 Print',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'wellbeing' as ActiveTab,
      labelBn: 'ক্যাম্পাস কেয়ার ও ট্রায়াজ',
      labelEn: 'Care & Mental Health AI',
      subBn: 'লক্ষণ ট্রায়াজ ও এআই কাউন্সিলর',
      subEn: 'Triage & Mental Health AI',
      icon: HeartPulse,
      badge: 'Counselor AI',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
  ];

  return (
    <nav className="sticky top-[58px] sm:top-[68px] z-30 no-print px-4 py-2 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-200/70 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none border border-slate-300/60 shadow-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 min-w-[170px] sm:min-w-0 flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left relative ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md font-bold scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-300/70 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="leading-tight truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold truncate">
                      {isBn ? tab.labelBn : tab.labelEn}
                    </span>
                    {tab.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border hidden lg:inline-block ${tab.badgeColor}`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 truncate ${
                      isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {isBn ? tab.subBn : tab.subEn}
                  </div>
                </div>

                {isActive && (
                  <span className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
