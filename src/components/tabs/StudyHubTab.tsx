import React from 'react';
import {
  BookOpen,
  Camera,
  Upload,
  Sparkles,
  HelpCircle,
  Volume2,
  CheckCircle,
  FileQuestion,
  FileText,
} from 'lucide-react';
import { Language } from '../../types/campus';

interface StudyHubTabProps {
  language: Language;
}

export const StudyHubTab: React.FC<StudyHubTabProps> = ({ language }) => {
  const isBn = language === 'bn';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-5 sm:p-7 rounded-3xl border border-emerald-700/40 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isBn ? 'ওপেন-সোর্স জেম্মা ভিশন ও অডিও' : 'Open-Weights Gemma Multimodal AI'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isBn
              ? 'লেকচার নোট বা স্লাইডের ছবি তুলুন — সাথে সাথে বাংলায় ব্যাখ্যা ও প্র্যাকটিস কুইজ'
              : 'Snap Lecture Notes or Slides — Instant Bilingual Concept Breakdown & Mock Quiz'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {isBn
              ? 'ক্লাসের জটিল টপিক, অ্যালগরিদম বা আরবি/ইসলামিক স্টাডিজ কোর্স বুঝতে সমস্যা? ছবি আপলোড করলেই জেম্মা ৪ হাতের লেখা পড়ে সহজ বাংলায় বুঝিয়ে দেবে এবং ৩টি সেলফ-টেস্ট প্রশ্ন তৈরি করবে।'
              : 'Struggling with hard topics, algorithms, or course slides? Snap a photo of your handwritten notebook to get instant explanations and exam practice tests.'}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              <span>{isBn ? 'নোটের ছবি তুলুন' : 'Capture Note Photo'}</span>
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-xs sm:text-sm border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? 'গ্যালারি / পিডিএফ আপলোড' : 'Upload File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {isBn ? 'হাতের লেখার বাংলা/ইংরেজি ওসিআর' : 'Handwriting Multimodal OCR'}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {isBn
              ? 'অস্পষ্ট ক্লাসনোট বা খাতায় লেখা সমীকরণ নির্ভুলভাবে শনাক্ত করে ডিজিটাল ফরম্যাটে রূপান্তর।'
              : 'Accurately parses handwritten equations, diagrams, and bullet notes into structured formats.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
            <FileQuestion className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {isBn ? 'স্বয়ংক্রিয় প্র্যাকটিস কুইজ' : 'Instant Practice Quizzes'}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {isBn
              ? 'টপিকভিত্তিক ৪ অপশনবিশিষ্ট কুইজ যা পরীক্ষার পূর্বপ্রস্তুতির জন্য অত্যন্ত কার্যকর।'
              : 'Generates targeted 4-option mock quizzes with instant rationale checking for exam prep.'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3">
            <Volume2 className="w-5 h-5 text-purple-700" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {isBn ? 'ইলেভেনল্যাবস অডিও ভয়েস' : 'ElevenLabs Voice Tutor'}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {isBn
              ? 'বাসে যাতায়াত বা বিশ্রামের সময় কানে হেডফোন দিয়ে লেকচারের সারসংক্ষেপ শোনার সুবিধা।'
              : 'Listen to natural, clear voice audio summaries while commuting on university buses.'}
          </p>
        </div>
      </div>
    </div>
  );
};
