import React, { useState, useEffect } from 'react';
import {
  Volume2,
  X,
  Sparkles,
  Check,
  Play,
  Square,
  Key,
  Languages,
  User,
  Sliders,
  Radio,
} from 'lucide-react';
import { VoiceConfig, VoiceOption, Language } from '../types/campus';
import {
  CURATED_VOICES,
  getStoredVoiceConfig,
  saveVoiceConfig,
  getStoredElevenApiKey,
  saveStoredElevenApiKey,
  playVoiceSpeech,
  stopVoiceAudio,
} from '../utils/audioService';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfigChange?: (config: VoiceConfig) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onConfigChange,
}) => {
  const isBn = language === 'bn';

  const [config, setConfig] = useState<VoiceConfig>(getStoredVoiceConfig());
  const [apiKey, setApiKey] = useState<string>(getStoredElevenApiKey());
  const [isTesting, setIsTesting] = useState(false);
  const [serverHasKey, setServerHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if backend has ELEVENLABS_API_KEY in .env
    fetch('/api/elevenlabs/voices')
      .then((res) => res.json())
      .then((data) => {
        setServerHasKey(Boolean(data.hasKey));
      })
      .catch(() => setServerHasKey(false));
  }, []);

  if (!isOpen) return null;

  const handleSelectVoice = (v: VoiceOption) => {
    const updated: VoiceConfig = {
      ...config,
      voiceId: v.id,
      name: v.name,
      gender: v.gender,
    };
    setConfig(updated);
    saveVoiceConfig(updated);
    onConfigChange?.(updated);
  };

  const handleLanguageChange = (speechLang: 'en' | 'bn') => {
    const updated: VoiceConfig = {
      ...config,
      speechLang,
    };
    setConfig(updated);
    saveVoiceConfig(updated);
    onConfigChange?.(updated);
  };

  const handleSpeedChange = (speed: number) => {
    const updated: VoiceConfig = {
      ...config,
      speed,
    };
    setConfig(updated);
    saveVoiceConfig(updated);
    onConfigChange?.(updated);
  };

  const handleSaveKey = (val: string) => {
    setApiKey(val);
    saveStoredElevenApiKey(val);
  };

  const handleTestVoice = async () => {
    if (isTesting) {
      stopVoiceAudio();
      setIsTesting(false);
      return;
    }

    const testText =
      config.speechLang === 'bn'
        ? `হ্যালো শিক্ষার্থী বন্ধুরা, আইআইইউসি ক্যাম্পাস সাথীতে আপনাকে স্বাগতম। আপনি এখন ${config.name} এর কণ্ঠে শুনছেন।`
        : `Hello students, welcome to IIUC CampusMate. You are listening to the crystal clear voice of ${config.name}.`;

    setIsTesting(true);
    await playVoiceSpeech({
      text: testText,
      config,
      onStart: () => setIsTesting(true),
      onEnd: () => setIsTesting(false),
      onError: () => setIsTesting(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Volume2 className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {isBn ? 'ভয়েস ও অডিও ন্যারেশন সেটিংস' : 'Voice Narration & Audio Studio'}
              </h3>
              <p className="text-xs text-purple-200">
                {isBn
                  ? 'প্রাকৃতিক মানবিক কণ্ঠে নোট ও বাসের ঘোষণা শুনুন'
                  : 'Natural Speech Narration for Lecture Notes, Bus Alerts & Counseling'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopVoiceAudio();
              setIsTesting(false);
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-white/20 transition cursor-pointer text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Status Indicator */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    serverHasKey || apiKey ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    serverHasKey || apiKey ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span className="font-bold text-slate-800 text-xs">
                {serverHasKey || apiKey
                  ? 'ElevenLabs Multilingual V2 Active'
                  : 'Browser Natural Speech Mode (API Key optional)'}
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              29 Languages
            </span>
          </div>

          {/* Speech Language Switcher (English vs Bangla) */}
          <div>
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
              <Languages className="w-3.5 h-3.5 text-purple-600" />
              <span>Voice Speech Language</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  config.speechLang === 'en'
                    ? 'bg-purple-50/80 border-purple-500 text-purple-950 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">English (US/UK)</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Academic lecture summaries
                  </div>
                </div>
                {config.speechLang === 'en' && <Check className="w-4 h-4 text-purple-600" />}
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange('bn')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  config.speechLang === 'bn'
                    ? 'bg-purple-50/80 border-purple-500 text-purple-950 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">Bengali (বাংলা)</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    সহজ ভাষায় বাংলায় অডিও
                  </div>
                </div>
                {config.speechLang === 'bn' && <Check className="w-4 h-4 text-purple-600" />}
              </button>
            </div>
          </div>

          {/* Voice Personas (Male vs Female) */}
          <div>
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>Choose Speaker Persona (Female / Male)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CURATED_VOICES.map((v) => {
                const isSelected = config.voiceId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectVoice(v)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-purple-50/90 border-purple-600 text-purple-950 font-bold shadow-xs ring-1 ring-purple-500/30'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs sm:text-sm">{v.name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          v.gender === 'female'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {v.gender === 'female' ? 'Female' : 'Male'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal leading-snug">
                      {v.style}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Voice ID (Optional for custom cloned voice) */}
          <div>
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span>Custom Voice ID (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 21m00Tcm4TlvDq8ikWAM or cloned voice ID"
              value={config.customVoiceId || ''}
              onChange={(e) => {
                const updated = { ...config, customVoiceId: e.target.value };
                setConfig(updated);
                saveVoiceConfig(updated);
                onConfigChange?.(updated);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
          </div>

          {/* Speed Selector */}
          <div>
            <label className="font-bold text-slate-800 text-xs flex items-center justify-between mb-1.5">
              <span>Speech Speed Rate</span>
              <span className="text-purple-700 font-mono font-bold">{config.speed}x</span>
            </label>
            <div className="flex items-center gap-2">
              {[0.85, 1.0, 1.15, 1.25].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSpeedChange(s)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    config.speed === s
                      ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* ElevenLabs API Key Override (Saved locally) */}
          <div className="pt-2 border-t border-slate-200">
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-1.5">
              <Key className="w-3.5 h-3.5 text-purple-600" />
              <span>ElevenLabs API Key (Optional Client Override)</span>
            </label>
            <input
              type="password"
              placeholder={serverHasKey ? 'Configured in backend .env' : 'Paste xi-api-key here'}
              value={apiKey}
              onChange={(e) => handleSaveKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {serverHasKey
                ? 'Your server already has ELEVENLABS_API_KEY configured in .env.'
                : 'Get a free key from elevenlabs.io. Free tier provides 10,000 credits/month.'}
            </p>
          </div>
        </div>

        {/* Footer with Test Button and Done */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestVoice}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              isTesting
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
            }`}
          >
            {isTesting ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Audio Test</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Test Voice Sample</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              stopVoiceAudio();
              setIsTesting(false);
              onClose();
            }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
