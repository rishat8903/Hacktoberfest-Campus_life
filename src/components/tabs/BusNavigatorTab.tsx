import React, { useState, useMemo, useEffect } from 'react';
import {
  Bus,
  Clock,
  MapPin,
  Search,
  Navigation,
  ArrowRight,
  Volume2,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { Language, BusRoute } from '../../types/campus';
import { IIUC_BUS_ROUTES } from '../../data/busSchedules';

interface BusNavigatorTabProps {
  language: Language;
}

export const BusNavigatorTab: React.FC<BusNavigatorTabProps> = ({ language }) => {
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [direction, setDirection] = useState<'to_kumira' | 'from_kumira'>('to_kumira');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(IIUC_BUS_ROUTES[0].id);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Keep live clock updated
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter routes based on search
  const filteredRoutes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return IIUC_BUS_ROUTES;
    return IIUC_BUS_ROUTES.filter((route) => {
      return (
        route.routeName.toLowerCase().includes(q) ||
        route.routeNameBn.includes(q) ||
        route.startingPoint.toLowerCase().includes(q) ||
        route.startingPointBn.includes(q) ||
        route.stops.some((s) => s.toLowerCase().includes(q)) ||
        route.stopsBn.some((s) => s.includes(q))
      );
    });
  }, [searchQuery]);

  const activeRoute = useMemo(() => {
    return (
      IIUC_BUS_ROUTES.find((r) => r.id === selectedRouteId) ||
      filteredRoutes[0] ||
      IIUC_BUS_ROUTES[0]
    );
  }, [selectedRouteId, filteredRoutes]);

  // Helper to parse time string like "08:15 AM" into Date today
  const parseTimeToDate = (timeStr: string): Date => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const d = new Date(currentTime);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  // Find next upcoming departure
  const departureList = direction === 'to_kumira'
    ? activeRoute.departuresToKumira
    : activeRoute.departuresFromKumira;

  const nextDepartureInfo = useMemo(() => {
    const now = currentTime.getTime();
    for (const dep of departureList) {
      const depDate = parseTimeToDate(dep);
      const diffMs = depDate.getTime() - now;
      if (diffMs > 0) {
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        return {
          timeStr: dep,
          diffMinutes,
          isImminent: diffMinutes <= 15,
        };
      }
    }
    // If all departures today passed:
    return {
      timeStr: departureList[0],
      diffMinutes: -1,
      isImminent: false,
    };
  }, [activeRoute, direction, currentTime, departureList]);

  // Voice announcement of the bus timetable via ElevenLabs with Web Speech fallback
  const handleAnnounceBus = async () => {
    const announcementText = isBn
      ? `মনোযোগ দিন। ${activeRoute.routeNameBn} রুটের পরবর্তী বাস ${nextDepartureInfo.timeStr}-এ ছেড়ে যাবে। সেন্ট্রাল টার্মিনাল কুমিরা পৌঁছাতে আনুমানিক সময় লাগবে ${activeRoute.estimatedMinutes} মিনিট।`
      : `Attention students. The next bus on ${activeRoute.routeName} departs at ${nextDepartureInfo.timeStr}. Estimated journey time is ${activeRoute.estimatedMinutes} minutes.`;

    setIsPlayingAudio(true);

    try {
      const res = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: announcementText }),
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => fallbackWebSpeech(announcementText);
        await audio.play();
        return;
      }
    } catch {
      // Fallback
    }

    fallbackWebSpeech(announcementText);
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Search & Filter Bar (Upscale Glassmorphic style) */}
      <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={
              isBn
                ? 'কাউন্টার বা স্টপ দিয়ে খুঁজুন (চকবাজার, জিইসি, আগ্রাবাদ, বহদ্দারহাট...)'
                : 'Search by counter, route or stop (e.g. Chawkbazar, GEC, Agrabad)...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Direction Toggle Pills */}
        <div className="flex bg-slate-200/70 p-1 rounded-2xl shrink-0 border border-slate-300/50">
          <button
            onClick={() => setDirection('to_kumira')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              direction === 'to_kumira'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span>{isBn ? 'সিটি ➔ কুমিরা ক্যাম্পাস' : 'City ➔ Kumira Campus'}</span>
          </button>

          <button
            onClick={() => setDirection('from_kumira')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              direction === 'from_kumira'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span>{isBn ? 'কুমিরা ক্যাম্পাস ➔ সিটি' : 'Kumira Campus ➔ City'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Route Selector Cards & Active Route Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
            <span>{isBn ? 'উপলব্ধ বাস রুটসমূহ' : 'Available Campus Routes'}</span>
            <span>{filteredRoutes.length} {isBn ? 'টি রুট' : 'routes'}</span>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredRoutes.map((route) => {
              const isSelected = route.id === activeRoute.id;

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {route.routeCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {isBn ? route.routeNameBn : route.routeName}
                      </h4>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-300'
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[180px]">
                        {isBn ? route.startingPointBn : route.startingPoint}
                      </span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{route.estimatedMinutes} {isBn ? 'মিনিট' : 'mins'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hero Details Card for Selected Route */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          {/* Header of Active Route */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <span>{activeRoute.routeCode}</span>
                <span>•</span>
                <span>{activeRoute.busGateBn}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {isBn ? activeRoute.routeNameBn : activeRoute.routeName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? activeRoute.startingPointBn : activeRoute.startingPoint} ➔{' '}
                {isBn ? activeRoute.destinationBn : activeRoute.destination}
              </p>
            </div>

            {/* Voice Announcement Button (ElevenLabs) */}
            <button
              onClick={handleAnnounceBus}
              disabled={isPlayingAudio}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
              title="Listen to departure audio with ElevenLabs Voice"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-emerald-600' : 'text-emerald-700'}`} />
              <span>{isPlayingAudio ? (isBn ? 'ঘোষণা চলছে...' : 'Speaking...') : (isBn ? 'অডিও ঘোষণা শুনুন' : 'Voice Alert')}</span>
            </button>
          </div>

          {/* Next Departure Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider block">
                  {isBn ? 'পরবর্তী নির্ধারিত বাস' : 'Next Scheduled Departure'}
                </span>
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                  {nextDepartureInfo.timeStr}
                </div>
                <div className="text-xs text-emerald-200/90 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>
                    {nextDepartureInfo.diffMinutes > 0
                      ? isBn
                        ? `আর মাত্র ${nextDepartureInfo.diffMinutes} মিনিট বাকি`
                        : `Departing in approx ${nextDepartureInfo.diffMinutes} mins`
                      : isBn
                      ? 'আজকের জন্য পরবর্তী শিডিউল'
                      : 'Next day schedule'}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 text-center sm:text-right shrink-0">
                <div className="text-[10px] text-slate-300 uppercase font-semibold">
                  {isBn ? 'কাউন্টার গেট' : 'Boarding Gate'}
                </div>
                <div className="text-base font-black text-amber-300">
                  {isBn ? activeRoute.busGateBn : activeRoute.busGate}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  {isBn ? `যাত্রা সময়: ~${activeRoute.estimatedMinutes} মিনিট` : `Est: ~${activeRoute.estimatedMinutes} min`}
                </div>
              </div>
            </div>
          </div>

          {/* All Shift Departure Times Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>
                {direction === 'to_kumira'
                  ? isBn
                    ? 'কুমিরা যাওয়ার সকল শিফটের সময়সূচী'
                    : 'All Shifts: City to Kumira Campus'
                  : isBn
                  ? 'কুমিরা থেকে সিটিতে ফেরার সময়সূচী'
                  : 'All Shifts: Kumira Campus to City'}
              </span>
            </h4>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {departureList.map((timeStr) => {
                const isNext = timeStr === nextDepartureInfo.timeStr;

                return (
                  <div
                    key={timeStr}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      isNext
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-800 font-semibold text-xs'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{timeStr}</div>
                    {isNext && (
                      <span className="text-[9px] bg-emerald-800 text-emerald-100 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider block mt-0.5">
                        {isBn ? 'পরবর্তী' : 'Next'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Route Stops Flow Timeline */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-3 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'বাসের রুট ও যাত্রাপথের স্টপেজসমূহ' : 'Route Stops & Boarding Points'}</span>
            </h4>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(isBn ? activeRoute.stopsBn : activeRoute.stops).map((stop, idx, arr) => (
                <React.Fragment key={stop}>
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium">
                    {stop}
                  </span>
                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Important Student Advisory */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isBn ? activeRoute.importantNotesBn : activeRoute.importantNotesEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
