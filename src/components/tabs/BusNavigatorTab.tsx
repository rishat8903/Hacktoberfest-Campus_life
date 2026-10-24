import React, { useState, useMemo, useEffect } from 'react';
import {
  Bus,
  Clock,
  MapPin,
  Search,
  Filter,
  Navigation,
  ArrowRight,
  Volume2,
  Calendar,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Square,
  Sliders,
} from 'lucide-react';
import { Language, BusRoute, VoiceConfig } from '../../types/campus';
import { IIUC_BUS_ROUTES } from '../../data/busSchedules';
import { playVoiceSpeech, stopVoiceAudio, getStoredVoiceConfig } from '../../utils/audioService';

interface BusNavigatorTabProps {
  language: Language;
  onOpenVoiceModal?: () => void;
  voiceConfig?: VoiceConfig;
}

export const BusNavigatorTab: React.FC<BusNavigatorTabProps> = ({
  language,
  onOpenVoiceModal,
  voiceConfig,
}) => {
  const isBn = language === 'bn';

  const [selectedRouteId, setSelectedRouteId] = useState<string>(IIUC_BUS_ROUTES[0].id);
  const [direction, setDirection] = useState<'to_kumira' | 'from_kumira'>('to_kumira');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Real-time ticking clock for exact bus departure matching
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const activeRoute = useMemo(() => {
    return (
      IIUC_BUS_ROUTES.find((r) => r.id === selectedRouteId) || IIUC_BUS_ROUTES[0]
    );
  }, [selectedRouteId]);

  // Filter routes by search query (counter, stops, or route name)
  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return IIUC_BUS_ROUTES;
    const q = searchQuery.toLowerCase();
    return IIUC_BUS_ROUTES.filter(
      (r) =>
        r.routeName.toLowerCase().includes(q) ||
        r.routeNameBn.includes(q) ||
        r.startingPoint.toLowerCase().includes(q) ||
        r.startingPointBn.includes(q) ||
        r.stops.some((s) => s.toLowerCase().includes(q)) ||
        r.stopsBn.some((s) => s.includes(q))
    );
  }, [searchQuery]);

  const departureList = useMemo(() => {
    return direction === 'to_kumira'
      ? activeRoute.departuresToKumira
      : activeRoute.departuresFromKumira;
  }, [activeRoute, direction]);

  // Compute the next upcoming bus departure from now
  const nextDepartureInfo = useMemo(() => {
    const nowHours = currentTime.getHours();
    const nowMinutes = currentTime.getMinutes();
    const currentTotalMin = nowHours * 60 + nowMinutes;

    for (const timeStr of departureList) {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) continue;

      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();

      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;

      const departureTotalMin = h * 60 + m;
      const diff = departureTotalMin - currentTotalMin;

      if (diff > 0) {
        return {
          timeStr,
          diffMinutes: diff,
          isImminent: diff <= 20,
        };
      }
    }
    // If all departures today passed:
    return {
      timeStr: departureList[0],
      diffMinutes: -1,
      isImminent: false,
    };
  }, [currentTime, departureList]);

  // Voice announcement of the bus timetable via ElevenLabs with Web Speech fallback
  const handleAnnounceBus = async () => {
    if (isPlayingAudio) {
      stopVoiceAudio();
      setIsPlayingAudio(false);
      return;
    }

    const currentVoice = voiceConfig || getStoredVoiceConfig();
    const announcementText =
      currentVoice.speechLang === 'bn'
        ? `মনোযোগ দিন শিক্ষার্থী বন্ধুরা। ${activeRoute.routeNameBn} রুটের পরবর্তী বাস ${nextDepartureInfo.timeStr}-এ ছেড়ে যাবে। কুমিরা ক্যাম্পাস পৌঁছাতে আনুমানিক সময় লাগবে ${activeRoute.estimatedMinutes} মিনিট। বোর্ডিং গেট: ${activeRoute.busGateBn}।`
        : `Attention students. The next university bus on ${activeRoute.routeName} departs at ${nextDepartureInfo.timeStr}. Estimated journey time to Kumira Central Terminal is ${activeRoute.estimatedMinutes} minutes. Boarding gate: ${activeRoute.busGate}.`;

    setIsPlayingAudio(true);
    await playVoiceSpeech({
      text: announcementText,
      config: currentVoice,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const activeVoiceName = voiceConfig?.name.split(' ')[0] || 'Rachel';
  const activeVoiceLang = voiceConfig?.speechLang.toUpperCase() || 'EN';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Search & Filter Bar (Upscale Glassmorphic style) */}
      <div className="bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder={
              isBn
                ? 'কাউন্টার বা স্টপ দিয়ে খুঁজুন (চকবাজার, জিইসি, আগ্রাবাদ, বহদ্দারহাট...)'
                : 'Search counter, stops or area (e.g. Chawkbazar, GEC, Agrabad, Bahaddarhat)...'
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
            <span>City ➔ Kumira Campus</span>
          </button>

          <button
            onClick={() => setDirection('from_kumira')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              direction === 'from_kumira'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span>Kumira Campus ➔ City</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Route Selector Cards & Active Route Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
            <span>Available University Routes</span>
            <span>{filteredRoutes.length} routes found</span>
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
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-display">
                        {route.routeName}
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
                        {route.startingPoint}
                      </span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{route.estimatedMinutes} mins</span>
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
                <span>{activeRoute.busGate}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                {activeRoute.routeName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeRoute.startingPoint} ➔ {activeRoute.destination}
              </p>
            </div>

            {/* Voice Announcement Button (ElevenLabs) */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={handleAnnounceBus}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs ${
                  isPlayingAudio
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
                title="Listen to departure audio with ElevenLabs Voice"
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-4 h-4 fill-current text-white" />
                    <span>Stop Alert</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <span>Announce ({activeVoiceName} • {activeVoiceLang})</span>
                  </>
                )}
              </button>

              {onOpenVoiceModal && (
                <button
                  onClick={onOpenVoiceModal}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition cursor-pointer"
                  title="Configure Speaker Voice"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Next Departure Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-5 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider block">
                  Next Scheduled Bus Departure
                </span>
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1 font-display">
                  {nextDepartureInfo.timeStr}
                </div>
                <div className="text-xs text-emerald-200/90 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>
                    {nextDepartureInfo.diffMinutes > 0
                      ? `Departing in approximately ${nextDepartureInfo.diffMinutes} minutes`
                      : 'Scheduled for tomorrow morning shift'}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 text-center sm:text-right shrink-0">
                <div className="text-[10px] text-slate-300 uppercase font-semibold">
                  Boarding Gate
                </div>
                <div className="text-base font-black text-amber-300 font-display">
                  {activeRoute.busGate}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Transit Duration: ~{activeRoute.estimatedMinutes} mins
                </div>
              </div>
            </div>
          </div>

          {/* All Shift Departure Times Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2.5 flex items-center gap-1.5 font-display">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>
                {direction === 'to_kumira'
                  ? 'All Scheduled Departures: City to Kumira Campus'
                  : 'All Scheduled Departures: Kumira Campus to City'}
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
                        Next Bus
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Route Stops Flow Timeline */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-3 flex items-center gap-1.5 font-display">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Route Stops & Boarding Counters</span>
            </h4>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {activeRoute.stops.map((stop, idx, arr) => (
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
              {activeRoute.importantNotesEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
