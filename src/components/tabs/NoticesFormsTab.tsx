import React from 'react';
import {
  FileText,
  Printer,
  FileCheck,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../../types/campus';

interface NoticesFormsTabProps {
  language: Language;
}

export const NoticesFormsTab: React.FC<NoticesFormsTabProps> = ({ language }) => {
  const isBn = language === 'bn';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 sm:p-7 rounded-3xl border border-blue-600/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-xs font-bold mb-3">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>{isBn ? 'প্রশাসনিক নোটিশ ও ছুটির ফরম' : 'Campus Notices & Official Applications'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isBn
              ? 'নোটিশের জটিলতা শেষ — ১ ক্লিকে ছুটির ও পরীক্ষার ছাড়পত্রের দরখাস্ত'
              : 'Campus Notice Scanner & 1-Click Official Leave Letter Generator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {isBn
              ? 'অসুস্থতা বা জরুরি প্রয়োজনে ক্লাস/পরীক্ষা মিস হলে ডিন বা বিভাগীয় প্রধানের কাছে পেশ করার মতো স্ট্যান্ডার্ড দরখাস্ত স্বয়ংক্রিয়ভাবে তৈরি ও প্রিন্ট করুন।'
              : 'Generate and print official academic leave and exam exemption applications formatted for IIUC university authorities.'}
          </p>
        </div>
      </div>
    </div>
  );
};
