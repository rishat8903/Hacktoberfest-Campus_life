import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Phone,
  MessageSquare,
  Send,
  Building,
  AlertTriangle,
  User,
  HeartHandshake,
} from 'lucide-react';
import { Language } from '../types/campus';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isBn = language === 'bn';

  const [studentName, setStudentName] = useState('');
  const [hallAndRoom, setHallAndRoom] = useState('');
  const [conditionNote, setConditionNote] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  if (!isOpen) return null;

  const defaultCondition = conditionNote.trim() || (isBn ? 'হঠাৎ তীব্র অসুস্থতা বোধ করছি' : 'Experiencing sudden severe sickness');
  const hallInfo = hallAndRoom.trim() || (isBn ? 'IIUC আবাসিক হল' : 'IIUC Student Hall');

  const sosMessage = isBn
    ? `[জরুরি সাহায্য/SOS] আমি ${studentName || 'একজন শিক্ষার্থী'}, ${hallInfo}-এ আছি। ${defaultCondition}। অনুগ্রহ করে দ্রুত আমার কক্ষে আসুন অথবা হলের দায়িত্বরত সহকারী প্রোভোস্টকে অবহিত করুন। ফোন: ${contactNumber || 'জরুরি'}`
    : `[EMERGENCY SOS] I am ${studentName || 'a student'}, located at ${hallInfo}. I am having: ${defaultCondition}. Please reach my room urgently or alert the Hall Provost. Phone: ${contactNumber || 'Urgent'}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(sosMessage)}`;
  const smsUrl = `sms:?body=${encodeURIComponent(sosMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 no-print animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-rose-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-950/60 rounded-xl border border-rose-500/50">
              <ShieldAlert className="w-6 h-6 text-rose-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {isBn ? 'ক্যাম্পাস জরুরি এসওএস ও হেল্পলাইন' : 'Campus Emergency SOS & Hotlines'}
              </h3>
              <p className="text-xs text-rose-200">
                {isBn ? 'IIUC কুমিরা ক্যাম্পাস ও হল ইমার্জেন্সি' : 'IIUC Kumira Campus & Hall Emergency'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white p-1 rounded-lg transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick Direct Calls */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:999"
              className="p-3 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-2xl flex items-center gap-2.5 transition active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="font-black text-rose-950 text-sm">৯৯৯ (999)</div>
                <div className="text-[10px] text-rose-800 font-semibold">
                  {isBn ? 'জাতীয় জরুরি সেবা' : 'National Emergency'}
                </div>
              </div>
            </a>

            <a
              href="tel:01844430300"
              className="p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl flex items-center gap-2.5 transition active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="font-black text-emerald-950 text-xs sm:text-sm">IIUC Medical</div>
                <div className="text-[10px] text-emerald-800 font-semibold">
                  {isBn ? 'কুমিরা ক্যাম্পাস সিক বে' : 'Kumira Sick Bay'}
                </div>
              </div>
            </a>
          </div>

          {/* Rapid Roommate / Provost SOS Alert */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'রুমমেট ও প্রভোস্টকে তাৎক্ষণিক বার্তা পাঠান' : 'Instant Hall SOS to Roommates'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {isBn ? 'আপনার নাম' : 'Your Name'}
                </label>
                <input
                  type="text"
                  placeholder={isBn ? 'উদা: মো: সাজিদ' : 'e.g. Sajid'}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {isBn ? 'হল ও রুম নং' : 'Hall & Room No'}
                </label>
                <input
                  type="text"
                  placeholder={isBn ? 'উদা: উসমান হল, রুম ৪০৩' : 'Usman Hall, Room 403'}
                  value={hallAndRoom}
                  onChange={(e) => setHallAndRoom(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {isBn ? 'অসুস্থতা বা লক্ষণ (সংক্ষেপে)' : 'Condition / Distress (Short)'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'উদা: তীব্র পেটব্যথা ও বমি / শ্বাসকষ্ট' : 'Severe abdominal pain / Asthma'}
                value={conditionNote}
                onChange={(e) => setConditionNote(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Generated message preview */}
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-700 italic">
              "{sosMessage}"
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp SOS</span>
              </a>

              <a
                href={smsUrl}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Direct SMS SOS</span>
              </a>
            </div>
          </div>

          {/* Mental Health Crisis Helpline */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-purple-950">
                  {isBn ? 'কান পেতে রই (মানসিক স্বাস্থ্য হেল্পলাইন)' : 'Kaan Pete Roi (Mental Health)'}
                </div>
                <div className="text-[10px] text-purple-800">
                  {isBn ? 'পরীক্ষার তীব্র চাপ বা বিষণ্নতায় বিনামূল্যে সহায়তা' : 'Confidential emotional support'}
                </div>
              </div>
            </div>

            <a
              href="tel:01779554391"
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shrink-0 transition"
            >
              {isBn ? 'কল করুন' : 'Call'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
