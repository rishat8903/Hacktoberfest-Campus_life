import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Camera,
  Upload,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileQuestion,
  RefreshCw,
  ZoomIn,
  GraduationCap,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { Language, StudyNoteResult } from '../../types/campus';
import { SAMPLE_CSE_STUDY_NOTE, getSampleLectureNoteSvg } from '../../data/sampleStudyNotes';

interface StudyHubTabProps {
  language: Language;
}

export const StudyHubTab: React.FC<StudyHubTabProps> = ({ language }) => {
  const isBn = language === 'bn';

  const [currentPhoto, setCurrentPhoto] = useState<string | null>(getSampleLectureNoteSvg());
  const [analysisResult, setAnalysisResult] = useState<StudyNoteResult | null>(SAMPLE_CSE_STUDY_NOTE);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedQuiz, setRevealedQuiz] = useState<Record<string, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load sample note
  const handleLoadSample = () => {
    setCurrentPhoto(getSampleLectureNoteSvg());
    setAnalysisResult(SAMPLE_CSE_STUDY_NOTE);
    setSelectedAnswers({});
    setRevealedQuiz({});
    setErrorMessage(null);
  };

  // Upload or camera photo handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setCurrentPhoto(dataUrl);
      await sendPhotoToGemma(dataUrl, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // API call to Gemma 4 multimodal analysis
  const sendPhotoToGemma = async (base64Image: string, mimeType: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/gemma/analyze-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType,
          mode: 'study_notes',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Failed to analyze note with Gemma.');
      }

      const note: StudyNoteResult = {
        id: `note-${Date.now()}`,
        topicTitle: json.data.topicTitle || 'Extracted Study Notes',
        courseCode: json.data.courseCode || undefined,
        summaryBn: json.data.summaryBn || 'নোটের ব্যাখ্যা প্রস্তুত করা হয়েছে।',
        summaryEn: json.data.summaryEn || 'Summary generated from notes.',
        keyConcepts: Array.isArray(json.data.keyConcepts) ? json.data.keyConcepts : [],
        quiz: Array.isArray(json.data.quiz) ? json.data.quiz : [],
        createdAt: new Date().toISOString(),
      };

      setAnalysisResult(note);
      setSelectedAnswers({});
      setRevealedQuiz({});
    } catch (err: unknown) {
      console.warn('Gemma note extraction error:', err);
      setErrorMessage(
        isBn
          ? 'এআই মডেল দিয়ে নোটটি বিশ্লেষণ করা যায়নি। এপিআই কি চেক করুন অথবা নমুনা নোটটি দেখুন।'
          : 'Could not analyze note with Gemma API. Please check your API key or use the verified sample note.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Voice player using ElevenLabs with Web Speech fallback
  const handlePlayVoice = async () => {
    if (!analysisResult) return;

    const speechText = isBn ? analysisResult.summaryBn : analysisResult.summaryEn;
    setIsPlayingAudio(true);

    try {
      const res = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechText }),
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => fallbackWebSpeech(speechText);
        await audio.play();
        return;
      }
    } catch {
      // Fallback
    }

    fallbackWebSpeech(speechText);
  };

  const fallbackWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isBn ? 'bn-BD' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  // Quiz choice handler
  const handleSelectQuizOption = (qId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
    setRevealedQuiz((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Upload & Action Card (Upscale Glassmorphic style) */}
      <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'ধাপ ১: নোট বা স্লাইডের ছবি দিন' : 'Step 1: Upload or Snap Note'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {isBn
                ? 'হাতের লেখার খাতা বা স্লাইড আপলোড করুন'
                : 'Upload or Capture Lecture Slides & Notebook Pages'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {isBn
                ? 'জেম্মা ৪ মাল্টিমোডাল মডেল হাতের লেখা পড়ে সহজ বাংলায় ব্যাখ্যা ও পরীক্ষার উপযোগী কুইজ তৈরি করবে।'
                : 'Gemma 4 Multimodal vision parses handwritten text, figures and equations to create summaries & self-tests.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>{isBn ? 'ক্যামেরা' : 'Camera'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold border border-slate-300/80 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'গ্যালারি' : 'Upload'}</span>
            </button>

            <button
              onClick={handleLoadSample}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="Load realistic CSE Database lecture note sample"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isBn ? 'নমুনা সিএসই নোট দেখুন' : 'Try CSE Sample Note'}</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-pulse">
            <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-emerald-950 block">
                {isBn ? 'জেম্মা ৪ হাতের লেখা নোট বিশ্লেষণ করছে...' : 'Gemma 4 is reading the handwritten note...'}
              </span>
              <span className="text-emerald-700 text-xs">
                {isBn ? 'বাংলায় ব্যাখ্যা এবং ৩টি প্র্যাকটিস কুইজ তৈরি হচ্ছে।' : 'Generating concept summary and practice questions.'}
              </span>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <span className="font-bold block">{errorMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column Workspace: Original Notebook on Left, AI Analysis & Quiz on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Notebook Preview */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                {isBn ? 'খাতার পাতার ছবি (Original Note)' : 'Original Notebook Photo'}
              </h3>
            </div>

            {currentPhoto && (
              <button
                onClick={() => setIsPhotoZoomed(!isPhotoZoomed)}
                className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-200 transition cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isPhotoZoomed ? (isBn ? 'ছোট করুন' : 'Reset') : (isBn ? 'জুম' : 'Zoom')}</span>
              </button>
            )}
          </div>

          <div
            className={`rounded-2xl overflow-hidden border border-slate-200 bg-amber-50/20 flex items-center justify-center transition-all ${
              isPhotoZoomed ? 'max-h-[750px]' : 'max-h-[500px]'
            }`}
          >
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt="Lecture Notes"
                className="w-full h-auto object-contain max-h-[600px] hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Camera className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">কোনো ছবি নেই (Upload above)</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis, Bilingual Summaries & Practice Quiz */}
        <div className="lg:col-span-7 space-y-5">
          {analysisResult ? (
            <>
              {/* Concept Title & ElevenLabs Audio Player */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    {analysisResult.courseCode && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        {analysisResult.courseCode}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {analysisResult.topicTitle}
                    </h3>
                  </div>

                  {/* ElevenLabs Audio Player */}
                  <button
                    onClick={handlePlayVoice}
                    disabled={isPlayingAudio}
                    className="flex items-center gap-2 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                    title="Listen to natural voice summary powered by ElevenLabs"
                  >
                    <Volume2
                      className={`w-4 h-4 ${
                        isPlayingAudio ? 'animate-bounce text-purple-600' : 'text-purple-700'
                      }`}
                    />
                    <span>
                      {isPlayingAudio
                        ? isBn
                          ? 'অডিও পড়ছে...'
                          : 'Speaking...'
                        : isBn
                        ? 'ইলেভেনল্যাবস অডিও শুনুন'
                        : 'ElevenLabs Voice'}
                    </span>
                  </button>
                </div>

                {/* Bangla Explanation Card */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    <span>সহজ বাংলায় মূল বিষয়বস্তু (Bangla Explanation)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    {analysisResult.summaryBn}
                  </p>
                </div>

                {/* English Academic Summary Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-600" />
                    <span>Academic Summary (English)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {analysisResult.summaryEn}
                  </p>
                </div>

                {/* Key Concepts Bullets */}
                {analysisResult.keyConcepts.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">
                      {isBn ? 'পরীক্ষার জন্য গুরুত্বপূর্ণ পয়েন্টসমূহ' : 'Key Concepts for Exam'}
                    </h4>
                    <ul className="space-y-1.5">
                      {analysisResult.keyConcepts.map((concept, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Practice Mock Quiz (Interactive self-test) */}
              {analysisResult.quiz.length > 0 && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <FileQuestion className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {isBn ? 'পরীক্ষার প্রস্তুতি কুইজ (Self-Test Quiz)' : 'Practice Exam Quiz'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {isBn ? 'সঠিক অপশন সিলেক্ট করে নিজের প্রস্তুতি যাচাই করুন' : 'Select an option to test your understanding'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.quiz.map((q, qIndex) => {
                      const selectedIdx = selectedAnswers[q.id];
                      const isRevealed = revealedQuiz[q.id];

                      return (
                        <div
                          key={q.id}
                          className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs space-y-2.5"
                        >
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {qIndex + 1}. {q.question}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedIdx === optIdx;
                              const isCorrect = optIdx === q.correctAnswerIndex;

                              let btnClasses = 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200';
                              if (isRevealed) {
                                if (isCorrect) {
                                  btnClasses = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                                } else if (isSelected) {
                                  btnClasses = 'bg-rose-600 text-white border-rose-700 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs ${btnClasses}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {isRevealed && (
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                              <span className="font-bold text-emerald-800 block mb-0.5">
                                {selectedIdx === q.correctAnswerIndex ? '✓ চমৎকার! সঠিক উত্তর' : 'ব্যাখ্যা (Explanation):'}
                              </span>
                              <span>{q.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">উপরে নোটের ছবি দিন অথবা নমুনা নোট বাটনে চাপুন</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
