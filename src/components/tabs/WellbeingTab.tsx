import React, { useState } from 'react';
import {
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  Smile,
  Activity,
  AlertOctagon,
  Sparkles,
  PhoneCall,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Building,
  HelpCircle,
  Wind,
} from 'lucide-react';
import { Language, HealthTriageResult } from '../../types/campus';

interface WellbeingTabProps {
  language: Language;
  onOpenSos: () => void;
}

export const WellbeingTab: React.FC<WellbeingTabProps> = ({ language, onOpenSos }) => {
  const isBn = language === 'bn';

  const [selectedSymptom, setSelectedSymptom] = useState<string>('food_poisoning');
  const [feverScale, setFeverScale] = useState<number>(100);
  const [durationDays, setDurationDays] = useState<number>(2);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // Breathing relaxation loop
  const handleToggleBreathing = () => {
    if (isBreathingActive) {
      setIsBreathingActive(false);
      return;
    }

    setIsBreathingActive(true);
    setBreathingStep('inhale');

    // 4-4-4 Box breathing cycle
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount = (stepCount + 1) % 3;
      if (stepCount === 0) setBreathingStep('inhale');
      else if (stepCount === 1) setBreathingStep('hold');
      else setBreathingStep('exhale');
    }, 4000);

    setTimeout(() => {
      clearInterval(interval);
      setIsBreathingActive(false);
    }, 60000); // 1 minute cycle
  };

  // Deterministic 4-Tier Campus Health Triage based on student symptoms
  const triageResult: HealthTriageResult = React.useMemo(() => {
    if (selectedSymptom === 'chest_pain' || feverScale >= 104) {
      return {
        tier: 'emergency',
        titleBn: 'জরুরি সতর্কতা: অবিলম্বে মেডিকেল সহায়তা প্রয়োজন',
        titleEn: 'Critical Red Flag: Immediate Emergency Care Needed',
        badgeBn: 'টিয়ার ৪: জরুরি অ্যাম্বুলেন্স / হাসপাতাল',
        badgeEn: 'Tier 4: Immediate Hospital Emergency',
        urgencyLevel: 'critical',
        recommendationBn: 'এই লক্ষণগুলো হলের মধ্যে বসে থাকা যাবে না। অবিলম্বে কুমিরা ক্যাম্পাস অ্যাম্বুলেন্স অথবা ৯৯৯-এ কল করে চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল (CMCH) বা নিকটস্থ ক্লিনিকে যান।',
        recommendationEn: 'Do not stay in the dormitory. Immediately call the campus ambulance or 999 to proceed to CMCH or the nearest hospital emergency.',
        campusFacility: 'Campus Ambulance & CMCH Emergency',
        campusFacilityHours: '24/7 Hours Available',
        questionsForDoctor: ['রক্তচাপ ও ইসিজি করানো দরকার কি?', 'শ্বাসকষ্টের তীব্রতা কতটুকু?'],
        redFlagWarning: 'রুমমেট বা হল প্রভোস্টকে এখনই জানান। নিজে একা হাঁটার চেষ্টা করবেন না।',
      };
    }

    if (selectedSymptom === 'food_poisoning' || feverScale >= 102 || durationDays >= 3) {
      return {
        tier: 'campus_medical',
        titleBn: 'কুমিরা ক্যাম্পাস মেডিকেল সেন্টারে ডাক্তার দেখান',
        titleEn: 'Visit IIUC Kumira Campus Medical Center',
        badgeBn: 'টিয়ার ২: ক্যাম্পাস মেডিকেল সেন্টার',
        badgeEn: 'Tier 2: Campus Medical Center',
        urgencyLevel: 'moderate',
        recommendationBn: 'ডাইনিং বা বাইরের খাবারের কারণে গ্যাস্ট্রো বা ইনফেকশনের লক্ষণ। ওআরএস (স্যালাইন) পান করুন এবং ক্যাম্পাস মেডিকেলে কর্তব্যরত মেডিকেল অফিসারের পরামর্শ নিন।',
        recommendationEn: 'Likely food contamination or persistent fever. Maintain hydration with ORS and visit the campus medical officer.',
        campusFacility: 'IIUC Kumira Medical Center (Near Central Library)',
        campusFacilityHours: '08:30 AM - 04:30 PM (Emergency Room open till 09:00 PM)',
        questionsForDoctor: ['সিবিসি বা স্টুল টেস্ট করানোর প্রয়োজন আছে কি?', 'অ্যান্টিবায়োটিক প্রয়োজন নাকি স্যালাইনে সুস্থ হবে?'],
      };
    }

    return {
      tier: 'hall_rest',
      titleBn: 'হলে বিশ্রাম ও প্রাথমিক শুশ্রূষা (Dormitory Rest & Hydration)',
      titleEn: 'Dormitory Self-Care & Hydration',
      badgeBn: 'টিয়ার ১: হলে বিশ্রাম ও সেলফ-কেয়ার',
      badgeEn: 'Tier 1: Hall Rest & Monitoring',
      urgencyLevel: 'low',
      recommendationBn: 'লক্ষণগুলো মৃদু মনে হচ্ছে। পর্যাপ্ত পানি ও লেবুর শরবত পান করুন, প্যারাসিটামল গ্রহণ করুন এবং বিশ্রাম নিন। ২ দিনের মধ্যে উন্নতি না হলে ক্যাম্পাস মেডিকেলে যাবেন।',
      recommendationEn: 'Symptoms appear mild. Hydrate well, take rest, and monitor. If symptoms persist beyond 48 hours, consult campus doctors.',
      campusFacility: 'Hall First-Aid Box / Hall Assistant Provost',
      campusFacilityHours: 'Always available in dorm',
      questionsForDoctor: ['প্যারাসিটামল দিনে কয়বার সেব্য?', 'পানি শূন্যতার কোনো লক্ষণ আছে কি?'],
    };
  }, [selectedSymptom, feverScale, durationDays]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 4-Tier Health Triage Section */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold mb-2">
              <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
              <span>{isBn ? 'ক্যাম্পাস স্বাস্থ্য ট্রায়াজ সহায়ক' : '4-Tier Campus Clinical Triage'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {isBn ? 'হলে হঠাৎ অসুস্থতা? লক্ষণ যাচাই করে সঠিক সিদ্ধান্ত নিন' : 'Evaluate Student Sickness Safely'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBn
                ? 'আইআইইউসি শিক্ষার্থীদের জন্য তৈরি: হলে বিশ্রাম, কুমিরা মেডিকেলে যাওয়া নাকি জরুরি চিকিৎসা দরকার তা জানুন।'
                : 'Deterministic triage for IIUC students: Know whether to rest in dorm, visit Kumira clinic, or seek emergency care.'}
            </p>
          </div>

          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isBn ? 'জরুরি হল এসওএস' : 'Emergency SOS'}</span>
          </button>
        </div>

        {/* Input Parameters: Symptom, Fever & Days */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1.5">
              {isBn ? 'প্রধান লক্ষণ বা সমস্যা' : 'Primary Sickness Type'}
            </label>
            <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="food_poisoning">পেটব্যথা, পাতলা পায়খানা বা বমি (Food Contamination)</option>
              <option value="fever_cold">জ্বর, সর্দি ও গলাব্যথা (Seasonal Fever/Cold)</option>
              <option value="exam_headache">পরীক্ষার অতিরিক্ত চাপ ও মাথাধরা (Stress Migraine)</option>
              <option value="dengue_suspect">তীব্র গা ব্যথা, চোখের পেছনে ব্যথা (Suspected Dengue)</option>
              <option value="chest_pain">বুকে তীব্র চাপ বা শ্বাসকষ্ট (Severe Red Flag)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1.5">
              {isBn ? `শরীরের তাপমাত্রা: ${feverScale}°F` : `Fever Temperature: ${feverScale}°F`}
            </label>
            <input
              type="range"
              min={98}
              max={105}
              step={0.5}
              value={feverScale}
              onChange={(e) => setFeverScale(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>98°F (স্বাভাবিক)</span>
              <span>101°F</span>
              <span>105°F (বিপজ্জনক)</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1.5">
              {isBn ? `কতদিন ধরে চলছে: ${durationDays} দিন` : `Duration: ${durationDays} Days`}
            </label>
            <input
              type="range"
              min={1}
              max={7}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>১ দিন</span>
              <span>৩ দিন</span>
              <span>৭+ দিন</span>
            </div>
          </div>
        </div>

        {/* Dynamic Triage Output Banner */}
        <div
          className={`p-5 rounded-3xl border transition-all ${
            triageResult.urgencyLevel === 'critical'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : triageResult.urgencyLevel === 'moderate'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  triageResult.urgencyLevel === 'critical'
                    ? 'bg-rose-600 text-white'
                    : triageResult.urgencyLevel === 'moderate'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isBn ? triageResult.badgeBn : triageResult.badgeEn}
              </span>

              <h4 className="text-base sm:text-lg font-black mt-2">
                {isBn ? triageResult.titleBn : triageResult.titleEn}
              </h4>

              <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                {isBn ? triageResult.recommendationBn : triageResult.recommendationEn}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <strong>প্রস্তাবিত স্থান:</strong> {triageResult.campusFacility} ({triageResult.campusFacilityHours})
            </div>
            {triageResult.redFlagWarning && (
              <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded">
                ⚠ {triageResult.redFlagWarning}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mind-Care Pre-Exam Grounding Widget ("মন-কথা" de-stress) */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white p-5 sm:p-7 rounded-3xl border border-purple-700/50 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold">
              <Smile className="w-3.5 h-3.5 text-purple-400" />
              <span>{isBn ? 'মন-কথা: পরীক্ষার পূর্বপ্রস্তুতি ও উদ্বেগ প্রশমন' : 'Mind-Care: Pre-Exam De-Stress'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isBn ? 'পরীক্ষার আগে অতিরিক্ত ভয় বা প্যানিক লাগছে?' : 'Pre-Exam Panic or Academic Burnout?'}
            </h3>

            <p className="text-xs sm:text-sm text-purple-200 max-w-xl leading-relaxed">
              {isBn
                ? 'বক্স-ব্রিদিং (৪-৪-৪ রিল্যাক্সেশন) টেকনিক মস্তিষ্কে অতিরিক্ত কর্টিসল হরমোন কমিয়ে তাৎক্ষণিক মনোযোগ ফিরিয়ে আনে। নিচের বাটনে চাপ দিয়ে ১ মিনিট শ্বাসচর্চা করুন।'
                : 'Scientific 4-4-4 box breathing reduces cortisol and restores mental focus before exams. Tap below to start a 1-minute guided exercise.'}
            </p>

            <div className="pt-2">
              <button
                onClick={handleToggleBreathing}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
                  isBreathingActive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <Wind className="w-4 h-4" />
                <span>
                  {isBreathingActive
                    ? isBn
                      ? 'শ্বাসচর্চা থামান'
                      : 'Stop Session'
                    : isBn
                    ? '১ মিনিটের শ্বাসচর্চা শুরু করুন'
                    : 'Start 1-Min Breathing Exercise'}
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Breathing Visualizer */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-purple-400/30 flex flex-col items-center justify-center p-4 relative shrink-0">
            <div
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                isBreathingActive
                  ? breathingStep === 'inhale'
                    ? 'bg-emerald-500/30 scale-110 border-2 border-emerald-400'
                    : breathingStep === 'hold'
                    ? 'bg-amber-500/30 scale-105 border-2 border-amber-400'
                    : 'bg-purple-500/30 scale-90 border-2 border-purple-400'
                  : 'bg-purple-800/40 border border-purple-500/20'
              }`}
            >
              <span className="text-base sm:text-lg font-black text-white capitalize">
                {isBreathingActive
                  ? isBn
                    ? breathingStep === 'inhale'
                      ? 'শ্বাস নিন (Inhale)'
                      : breathingStep === 'hold'
                      ? 'ধরে রাখুন (Hold)'
                      : 'ধীরে ছাড়ুন (Exhale)'
                    : breathingStep
                  : isBn
                  ? 'প্রশান্ত মন'
                  : 'Calm Mind'}
              </span>
              <span className="text-[10px] text-purple-200 mt-1">
                {isBreathingActive ? '৪ সেকেন্ড' : 'Box 4-4-4'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
