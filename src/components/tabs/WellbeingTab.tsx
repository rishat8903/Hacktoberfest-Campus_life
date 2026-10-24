import React, { useState, useRef, useEffect } from 'react';
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
  Square,
  Sliders,
  Send,
  User,
  Bot,
  MessageSquare,
  Mic,
  MicOff,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  PhoneForwarded,
  ArrowRight,
} from 'lucide-react';
import { Language, HealthTriageResult, VoiceConfig, MentalHealthMessage } from '../../types/campus';
import { playVoiceSpeech, stopVoiceAudio, getStoredVoiceConfig } from '../../utils/audioService';

interface WellbeingTabProps {
  language: Language;
  onOpenSos: () => void;
  onOpenVoiceModal?: () => void;
  voiceConfig?: VoiceConfig;
}

const QUICK_SYMPTOM_PRESETS = [
  {
    icon: '🤢',
    label: 'Food Poisoning / Cramps',
    text: 'Severe stomach cramps, diarrhea, and nausea after eating dining hall food yesterday. Feeling weak and dehydrated.',
    fever: 100,
    days: 2,
    category: 'stomach',
  },
  {
    icon: '🦟',
    label: 'Suspected Dengue / Body Ache',
    text: 'Sudden high fever around 103°F with intense pain behind the eyes, severe joint and backache, loss of appetite.',
    fever: 103,
    days: 3,
    category: 'dengue',
  },
  {
    icon: '⚡',
    label: 'Migraine & Exam Stress',
    text: 'Throbbing headache on one side of my head, sensitivity to library lights, nausea, and feeling lightheaded from studying all night.',
    fever: 99,
    days: 1,
    category: 'headache',
  },
  {
    icon: '💔',
    label: 'Chest Tightness (Urgent)',
    text: 'Heavy tightness across the chest, difficulty breathing, dizziness, and cold sweats while resting in my dorm room.',
    fever: 98.6,
    days: 1,
    category: 'chest',
  },
];

const INITIAL_MESSAGES: MentalHealthMessage[] = [
  {
    id: 'm1',
    sender: 'assistant',
    text: `Hello there. I am **CampusCare MindCompanion** (মন-সাথী), your confidential university mental health counseling assistant.\n\nWhether you are dealing with intense exam anxiety, CGPA stress, loneliness in the dorms, or feeling completely burned out, I am here to listen without judgment.\n\nTake a slow breath. What is on your mind today?`,
    timestamp: 'Just now',
  },
];

export const WellbeingTab: React.FC<WellbeingTabProps> = ({
  language,
  onOpenSos,
  onOpenVoiceModal,
  voiceConfig,
}) => {
  const isBn = language === 'bn';

  // Sub-Navigation: Triage vs Mental Health Counselor
  const [activeSubTab, setActiveSubTab] = useState<'triage' | 'mental_health'>('triage');

  // --- Clinical Triage State ---
  const [symptomsInput, setSymptomsInput] = useState<string>(
    'Severe stomach cramps, nausea, and frequent vomiting after dinner at the hall canteen. Feeling exhausted and dizzy.'
  );
  const [feverScale, setFeverScale] = useState<number>(101);
  const [durationDays, setDurationDays] = useState<number>(2);
  const [isAnalyzingTriage, setIsAnalyzingTriage] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<HealthTriageResult | null>({
    tier: 'campus_medical',
    urgencyLevel: 'moderate',
    titleEn: 'Visit IIUC Kumira Campus Medical Center',
    titleBn: 'কুমিরা ক্যাম্পাস মেডিকেল সেন্টারে ডাক্তার দেখান',
    badgeEn: 'Tier 2: Campus Medical Center',
    badgeBn: 'টিয়ার ২: ক্যাম্পাস মেডিকেল সেন্টার',
    clinicalAssessment:
      'Symptoms indicate acute food-borne gastroenteritis with moderate dehydration risk. Bacterial contamination from canteen food is common.',
    recommendationEn:
      'Begin oral rehydration solution (ORS saline) immediately. Avoid canteen fried items. Visit the campus medical center for a formal evaluation by the duty doctor.',
    recommendationBn:
      'অবিলম্বে ওআরএস স্যালাইন খাওয়া শুরু করুন। ডাইনিং বা বাইরের তেলযুক্ত খাবার পরিহার করুন এবং কুমিরা ক্যাম্পাস মেডিকেলে কর্তব্যরত ডাক্তারের পরামর্শ নিন।',
    actionSteps: [
      'Drink 250ml of ORS saline after every vomiting or loose stool episode',
      'Take paracetamol 500mg if temperature exceeds 101°F (avoid NSAIDs like Ibuprofen if dengue is not ruled out)',
      'Rest in a cool, well-ventilated room with clean water nearby',
    ],
    campusFacility: 'IIUC Kumira Medical Center (Near Central Library)',
    campusFacilityHours: '08:30 AM - 04:30 PM (Emergency Room open till 09:00 PM)',
    questionsForDoctor: [
      'Is a stool test or CBC blood count test needed?',
      'Which oral antibiotic or anti-emetic is recommended?',
    ],
    redFlagWarning: 'If vomiting prevents you from keeping any water down for 6 hours, seek immediate emergency IV care.',
  });

  // --- Mental Health AI Chat State ---
  const [chatMessages, setChatMessages] = useState<MentalHealthMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAiReplying, setIsAiReplying] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSubTab === 'mental_health') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeSubTab]);

  // Handle Clinical Triage Form Submission
  const handleAnalyzeSymptoms = async () => {
    if (!symptomsInput.trim()) return;

    setIsAnalyzingTriage(true);
    try {
      const res = await fetch('/api/campus-care/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSymptomsText: symptomsInput,
          feverTemp: feverScale,
          durationDays,
          category: 'student_illness',
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setTriageResult(json.data);
      }
    } catch (err) {
      console.error('Triage error:', err);
    } finally {
      setIsAnalyzingTriage(false);
    }
  };

  // Handle Quick Preset Click
  const handleSelectPreset = (preset: typeof QUICK_SYMPTOM_PRESETS[0]) => {
    setSymptomsInput(preset.text);
    setFeverScale(preset.fever);
    setDurationDays(preset.days);
  };

  // Handle Mental Health Chat Message Send
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isAiReplying) return;

    const userMsg: MentalHealthMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsAiReplying(true);

    try {
      const res = await fetch('/api/campus-care/mental-health-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const json = await res.json();
      const replyText =
        json.reply ||
        'I hear you. Take a slow, grounding breath. You are doing the best you can in a challenging academic environment. Remember that your health and wellbeing come before any exam.';

      const aiMsg: MentalHealthMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: MentalHealthMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: 'I am here with you. Please take a gentle sip of water and unclench your shoulders. You do not have to carry everything all at once. What feels like the heaviest burden right now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiReplying(false);
    }
  };

  // Audio speech player using ElevenLabs with Web Speech fallback
  const handlePlayVoice = async (textToSpeak: string) => {
    if (isPlayingAudio) {
      stopVoiceAudio();
      setIsPlayingAudio(false);
      return;
    }

    const currentVoice = voiceConfig || getStoredVoiceConfig();
    setIsPlayingAudio(true);
    await playVoiceSpeech({
      text: textToSpeak,
      config: currentVoice,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeVoiceName = voiceConfig?.name.split(' ')[0] || 'Alice';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Upscale-Style Selector: Clinical Health Triage vs Mental Health AI Companion */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border border-slate-800 shadow-xl no-print">
        {/* Ambient glow orbs */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>CampusCare AI • Student Wellbeing Ecosystem</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Student Health Triage & Mental Health AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Type your physical symptoms for deterministic clinical triage, or talk with MindCompanion AI for empathetic mental health and exam stress support.
            </p>
          </div>

          {/* Sub-tab pills */}
          <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveSubTab('triage')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'triage'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Clinical Health Triage</span>
            </button>

            <button
              onClick={() => setActiveSubTab('mental_health')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'mental_health'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Mental Health AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: Clinical Symptom Text Input & 4-Tier Health Triage */}
      {/* ========================================================= */}
      {activeSubTab === 'triage' && (
        <div className="space-y-6">
          {/* Main Input Card */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-display flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-rose-600" />
                  <span>Tell Us How You Are Feeling (Patient Symptom Input)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Type your physical symptoms freely in your own words. Our clinical AI evaluates urgency and hospital requirements.
                </p>
              </div>

              <button
                onClick={onOpenSos}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Emergency SOS Hotline</span>
              </button>
            </div>

            {/* Quick Symptom Chips Presets */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Preset Scenarios (Tap to autofill):
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_SYMPTOM_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition cursor-pointer active:scale-95"
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Free-Text User Symptom Input Textarea */}
            <div>
              <label className="font-bold text-slate-800 text-xs sm:text-sm block mb-1.5">
                Describe Your Symptoms & Context in Detail:
              </label>
              <textarea
                rows={3}
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g. I have severe stomach cramps, vomiting since 3 AM after eating hall dining food. My body is weak and I have a fever."
                className="w-full p-3.5 border border-slate-300 rounded-2xl bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed transition"
              />
            </div>

            {/* Vitals Range Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <label className="font-bold text-slate-800 text-xs flex items-center justify-between mb-2">
                  <span>Body Temperature:</span>
                  <span className="text-rose-600 font-mono font-bold text-sm">{feverScale}°F</span>
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
                  <span>98°F (Normal)</span>
                  <span>101°F (Fever)</span>
                  <span>105°F (Critical)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <label className="font-bold text-slate-800 text-xs flex items-center justify-between mb-2">
                  <span>Duration of Symptoms:</span>
                  <span className="text-rose-600 font-mono font-bold text-sm">{durationDays} Day(s)</span>
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
                  <span>1 Day</span>
                  <span>3 Days</span>
                  <span>7+ Days</span>
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleAnalyzeSymptoms}
                disabled={isAnalyzingTriage || !symptomsInput.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingTriage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Clinical Symptoms...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    <span>Run Clinical Triage Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dynamic AI Triage Results Banner */}
          {triageResult && (
            <div
              className={`p-6 sm:p-7 rounded-3xl border transition-all shadow-sm space-y-5 ${
                triageResult.urgencyLevel === 'critical'
                  ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                  : triageResult.urgencyLevel === 'moderate'
                  ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                  : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-4">
                <div>
                  <span
                    className={`inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs mb-2 ${
                      triageResult.urgencyLevel === 'critical'
                        ? 'bg-rose-600 text-white'
                        : triageResult.urgencyLevel === 'moderate'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {triageResult.badgeEn}
                  </span>

                  <h3 className="text-lg sm:text-xl font-black font-display tracking-tight">
                    {triageResult.titleEn}
                  </h3>
                </div>

                {/* ElevenLabs Audio Playback Button */}
                <button
                  onClick={() =>
                    handlePlayVoice(
                      `Triage Advisory: ${triageResult.titleEn}. ${triageResult.recommendationEn}`
                    )
                  }
                  className="flex items-center gap-2 px-3.5 py-2 bg-white/80 hover:bg-white text-slate-800 rounded-xl text-xs font-bold border border-slate-300/80 shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-purple-600' : 'text-purple-700'}`} />
                  <span>{isPlayingAudio ? 'Speaking...' : `Listen (${activeVoiceName})`}</span>
                </button>
              </div>

              {/* Clinical Assessment */}
              {triageResult.clinicalAssessment && (
                <div className="p-4 bg-white/70 rounded-2xl border border-black/5 text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold block mb-1 text-slate-900">
                    Clinical Evaluation:
                  </span>
                  <span>{triageResult.clinicalAssessment}</span>
                </div>
              )}

              {/* Action Steps */}
              {triageResult.actionSteps && triageResult.actionSteps.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs sm:text-sm mb-2 text-slate-900">
                    Immediate Actionable Steps:
                  </h4>
                  <div className="space-y-1.5">
                    {triageResult.actionSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location & Red Flag Warning */}
              <div className="pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <strong>Recommended Facility:</strong> {triageResult.campusFacility} ({triageResult.campusFacilityHours})
                </div>

                {triageResult.redFlagWarning && (
                  <span className="text-rose-700 font-bold bg-rose-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{triageResult.redFlagWarning}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: Conversational Mental Healthcare AI (MindCompanion) */}
      {/* ========================================================= */}
      {activeSubTab === 'mental_health' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* Counselor Chat Header */}
          <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                  <Smile className="w-5 h-5 text-purple-100" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base font-display">
                    MindCompanion AI (মন-সাথী)
                  </h3>
                  <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-full font-semibold">
                    Confidential Support
                  </span>
                </div>
                <p className="text-[11px] text-purple-200 mt-0.5">
                  Trained in psychological first-aid & active listening for university students
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenVoiceModal && (
                <button
                  onClick={onOpenVoiceModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition cursor-pointer"
                  title="Configure Counselor Voice"
                >
                  <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                  <span className="hidden sm:inline">Voice:</span>
                  <span>{activeVoiceName}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Prompt Starters */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Quick Prompts:
            </span>
            {[
              "I'm terrified of failing my exam tomorrow.",
              "I feel so lonely in the hall and miss home.",
              "I can't sleep because of non-stop anxious thoughts.",
              "How can I stop comparing my CGPA with others?",
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                disabled={isAiReplying}
                className="px-2.5 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200 rounded-lg text-xs whitespace-nowrap transition cursor-pointer active:scale-95 shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Message Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-slate-800 text-white'
                        : 'bg-purple-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative shadow-xs ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Bottom metadata & Voice speaker trigger */}
                    <div
                      className={`flex items-center justify-between gap-3 mt-2.5 pt-2 border-t ${
                        isUser ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-400'
                      } text-[10px]`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePlayVoice(msg.text)}
                            className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold transition cursor-pointer"
                            title="Listen to this advice"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </button>

                          <button
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            className="hover:text-slate-700 transition cursor-pointer"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isAiReplying && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                  <span>MindCompanion is writing a thoughtful reply...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Talk about what you are feeling (e.g. anxiety, burnout, feeling down)..."
                disabled={isAiReplying}
                className="flex-1 px-4 py-3 bg-slate-100 focus:bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />

              <button
                type="submit"
                disabled={isAiReplying || !inputMessage.trim()}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition cursor-pointer disabled:opacity-40 shadow-xs active:scale-95"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Confidential & Private • Powered by Groq / Gemma Multilingual AI</span>
              <span>Crisis Hotline: Call 999 or Campus Ambulance</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
