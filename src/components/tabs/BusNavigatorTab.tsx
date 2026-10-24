import React from 'react';
import {
  Bus,
  Clock,
  MapPin,
  Search,
  Navigation,
  ArrowRight,
} from 'lucide-react';
import { Language } from '../../types/campus';

interface BusNavigatorTabProps {
  language: Language;
}

export const BusNavigatorTab: React.FC<BusNavigatorTabProps> = ({ language }) => {
  const isBn = language === 'bn';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-amber-950/80 text-white p-5 sm:p-7 rounded-3xl border border-amber-600/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold mb-3">
            <Bus className="w-3.5 h-3.5 text-amber-400" />
            <span>{isBn ? 'IIUC কুমিরা পরিবহন সময়সূচী' : 'IIUC Kumira Bus Schedule'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isBn
              ? 'পরবর্তী বাস কখন ছাড়বে? কুমিরা ⇄ চট্টগ্রাম সিটি রুট নেভিগেটর'
              : 'Next Bus Departure & Kumira ⇄ Chittagong City Timetable'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {isBn
              ? 'চকবাজার, জিইসি, বহদ্দারহাট, আগ্রাবাদ ও মুরাদপুর রুটের প্রতিটি বাসের কাউন্টার, ছাড়ার সময় ও স্টপেজ।'
              : 'Live schedule and stops for all IIUC student buses between Kumira campus and Chittagong city counters.'}
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-center shrink-0">
          <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
            {isBn ? 'পরবর্তী সরাসরি বাস' : 'Next Direct Bus'}
          </div>
          <div className="text-2xl font-black text-white mt-0.5">০৮:০০ AM</div>
          <div className="text-[11px] text-amber-200/80 font-medium mt-0.5">
            চকবাজার ➔ কুমিরা ক্যাম্পাস
          </div>
        </div>
      </div>
    </div>
  );
};
