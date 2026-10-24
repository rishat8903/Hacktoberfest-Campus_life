import React from 'react';
import {
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  Smile,
  Activity,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../types/campus';

interface WellbeingTabProps {
  language: Language;
  onOpenSos: () => void;
}

export const WellbeingTab: React.FC<WellbeingTabProps> = ({ language, onOpenSos }) => {
  const isBn = language === 'bn';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white p-5 sm:p-7 rounded-3xl border border-rose-600/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-xs font-bold mb-3">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>{isBn ? 'ক্যাম্পাস স্বাস্থ্য ও মানসিক প্রশান্তি' : 'Campus Health & Mind Care'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isBn
              ? 'হলে হঠাৎ অসুস্থতা বা পরীক্ষার তীব্র চাপ? ৪-ধাপ ট্রায়াজ ও পরামর্শ'
              : 'Dorm Sickness or Pre-Exam Anxiety? 4-Tier Health Triage & Grounding'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {isBn
              ? 'নিরাপদ নিয়মে লক্ষণ পরীক্ষা করুন — হলে রেস্ট নেবেন, কুমিরা ক্যাম্পাসের মেডিকেল সেন্টারে যাবেন, নাকি জরুরি ভিত্তিতে হাসপাতালে যাবেন।'
              : 'Safely evaluate symptoms using deterministic campus triage. Know whether to rest in the hall or seek immediate medical care.'}
          </p>
        </div>

        <button
          onClick={onOpenSos}
          className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-sm shadow-md transition active:scale-95 cursor-pointer shrink-0"
        >
          <ShieldAlert className="w-5 h-5 text-rose-200" />
          <span>{isBn ? 'জরুরি এসওএস পাঠান' : 'Trigger SOS Alert'}</span>
        </button>
      </div>
    </div>
  );
};
