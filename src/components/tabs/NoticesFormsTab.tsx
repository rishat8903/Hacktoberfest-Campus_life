import React, { useState } from 'react';
import {
  FileText,
  Printer,
  FileCheck,
  Building2,
  Calendar,
  AlertCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Download,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { Language, CampusNotice, LeaveApplicationData } from '../../types/campus';

interface NoticesFormsTabProps {
  language: Language;
}

const SAMPLE_NOTICES: CampusNotice[] = [
  {
    id: 'notice-exam-reg',
    title: 'Semester Final Examination Registration & Admit Card Issuance',
    titleBn: 'সেমিস্টার ফাইনাল পরীক্ষার রেজিস্ট্রেশন ও প্রবেশপত্র (Admit Card) সংগ্রহ',
    category: 'exam',
    issuingOffice: 'Office of the Controller of Examinations',
    issuingOfficeBn: 'পরীক্ষা নিয়ন্ত্রক দপ্তর (Controller Office)',
    publishDate: '2026-10-20',
    deadlines: ['2026-10-28 (Without fine)', '2026-11-02 (With late fine ৳500)'],
    summaryBn: 'সকল অনুষদের শিক্ষার্থীদের অনলাইন পোর্টাল থেকে পরীক্ষার ফি পরিশোধ করে নির্ধারিত তারিখের মধ্যে স্ব-স্ব বিভাগীয় অফিস থেকে প্রবেশপত্র সংগ্রহ করতে হবে। কোনো বকেয়া থাকলে প্রবেশপত্র ইস্যু হবে না।',
    summaryEn: 'Students must clear outstanding semester fees online and collect official admit cards from department offices before the deadline.',
    destinationRoom: 'Administrative Building, Room 304',
    requiredDocuments: ['Bank Deposit Slip / bKash Transaction ID', 'Student ID Card'],
    isPinned: true,
  },
  {
    id: 'notice-waiver',
    title: 'Tuition Fee Waiver & Scholarship Application for Autumn 2026',
    titleBn: 'টিউশন ফি ওয়েভার ও মেধা বৃত্তি আবেদন বিজ্ঞপ্তি (শরৎ ২০২৬)',
    category: 'fees',
    issuingOffice: 'Student Welfare & Scholarship Division',
    issuingOfficeBn: 'ছাত্র কল্যাণ ও বৃত্তি শাখা',
    publishDate: '2026-10-18',
    deadlines: ['2026-10-31 (Strict deadline)'],
    summaryBn: 'ন্যূনতম জিপিএ ৩.৫০ প্রাপ্ত এবং আর্থিক অসচ্ছল শিক্ষার্থীরা নির্ধারিত ফরমে অভিভাবকের আয়ের সনদসহ আবেদনপত্র জমা দিতে পারবেন।',
    summaryEn: 'Eligible students with GPA 3.50+ and financial need can apply with verified guardian income certificate.',
    destinationRoom: 'Central Library Building, 2nd Floor (Room 210)',
    requiredDocuments: ['Semester Grade Sheets', 'Guardian Income Certificate', 'Application Form A'],
  },
  {
    id: 'notice-hall-rules',
    title: 'Dormitory Dining Schedule & Gate Timing Notice',
    titleBn: 'আবাসিক হল ডাইনিং মিল ও প্রধান ফটক বন্ধের সময়সূচী',
    category: 'general',
    issuingOffice: 'Hall Provost Council (Usman & Ali Halls)',
    issuingOfficeBn: 'হল প্রভোস্ট কাউন্সিল (উসমান ও আলী হল)',
    publishDate: '2026-10-15',
    deadlines: ['Daily Gate Closure: 09:30 PM (Strict)'],
    summaryBn: 'রাত ০৯:৩০ মিনিটের পর হলে প্রবেশের জন্য সহকারী প্রভোস্টের লিখিত অনুমতি প্রয়োজন হবে। ডাইনিং কুপন প্রতিদিন দুপুর ২টার পূর্বে নিশ্চিত করতে হবে।',
    summaryEn: 'Hall main gate closes at 09:30 PM. Night entry requires written assistant provost approval.',
    destinationRoom: 'Hall Provost Office, Ground Floor',
    requiredDocuments: ['Hall Resident Card'],
  },
];

export const NoticesFormsTab: React.FC<NoticesFormsTabProps> = ({ language }) => {
  const isBn = language === 'bn';

  // Academic Leave Letter Generator Form State
  const [formData, setFormData] = useState<LeaveApplicationData>({
    studentName: 'মো: তানভীর আহমেদ (Tanvir Ahmed)',
    studentId: 'C221045',
    department: 'Computer Science & Engineering (CSE)',
    batchAndSection: 'CSE 53rd Batch, Section B',
    semester: 'Autumn 2026 (5th Semester)',
    contactPhone: '01812-345678',
    reasonType: 'sick_leave',
    missedExamsOrClasses: 'CSE-3501 (DBMS Midterm) and CSE-3503 Lab',
    startDate: '2026-10-22',
    endDate: '2026-10-26',
    reasonDetails: 'তীব্র ডেঙ্গু জ্বর এবং প্লাটিলেট কমে যাওয়ার কারণে চিকিৎসকের পরামর্শে ৫ দিন পূর্ণ বিশ্রামে ছিলাম।',
    medicalSlipAttached: true,
    doctorOrClinicName: 'Dr. Rafiqul Islam, MBBS (Kumira Health Complex)',
  });

  const [activeSubView, setActiveSubView] = useState<'notices' | 'leave_generator'>('leave_generator');

  // Trigger print dialog for the generated letter
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Selector: Notice Board vs 1-Click Leave Application Generator */}
      <div className="bg-white/85 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="flex bg-slate-200/70 p-1 rounded-2xl w-full sm:w-auto border border-slate-300/50">
          <button
            onClick={() => setActiveSubView('leave_generator')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'leave_generator'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBn ? 'ছুটির দরখাস্ত জেনারেটর (A4 Print)' : 'Leave Application Generator'}</span>
          </button>

          <button
            onClick={() => setActiveSubView('notices')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'notices'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isBn ? 'ক্যাম্পাস নোটিশ বোর্ড' : 'Campus Notices Board'}</span>
          </button>
        </div>

        {activeSubView === 'leave_generator' && (
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>{isBn ? 'দরখাস্ত প্রিন্ট / PDF সংরক্ষণ' : 'Print Application (PDF)'}</span>
          </button>
        )}
      </div>

      {/* VIEW 1: Official Printable Leave Application Generator */}
      {activeSubView === 'leave_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Editor Column */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 no-print">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Edit3 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                {isBn ? 'শিক্ষার্থীর তথ্য ও ছুটির বিবরণ' : 'Application Parameters'}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isBn ? 'শিক্ষার্থীর পূর্ণ নাম' : 'Student Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isBn ? 'আইডি (Student ID)' : 'Student ID'}
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isBn ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isBn ? 'বিভাগ (Department)' : 'Department'}
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isBn ? 'অনুপস্থিত ক্লাস / পরীক্ষার কোড' : 'Missed Exam / Course Codes'}
                </label>
                <input
                  type="text"
                  value={formData.missedExamsOrClasses}
                  onChange={(e) => setFormData({ ...formData, missedExamsOrClasses: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. CSE-3501 DBMS Midterm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isBn ? 'শুরুর তারিখ' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isBn ? 'শেষের তারিখ' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isBn ? 'অসুস্থতা বা কারণের বিবরণ' : 'Medical Reason Details'}
                </label>
                <textarea
                  rows={3}
                  value={formData.reasonDetails}
                  onChange={(e) => setFormData({ ...formData, reasonDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {isBn ? 'চিকিৎসক বা ক্লিনিকের নাম' : 'Attending Doctor / Clinic'}
                </label>
                <input
                  type="text"
                  value={formData.doctorOrClinicName || ''}
                  onChange={(e) => setFormData({ ...formData, doctorOrClinicName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Kumira Medical Center"
                />
              </div>
            </div>
          </div>

          {/* Official A4 Application Preview (Print layout) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-md text-slate-900 page-break-avoid print:border-none print:shadow-none print:p-0">
            {/* Letter Header */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                International Islamic University Chittagong
              </h2>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Kumira, Sitakunda, Chittagong-4318, Bangladesh
              </p>
              <div className="inline-block mt-3 px-3 py-1 bg-slate-100 border border-slate-300 text-xs font-bold uppercase tracking-wider rounded-md">
                Application for Medical Leave / Exam Exemption
              </div>
            </div>

            {/* Formal Date & Addressee */}
            <div className="space-y-1 text-xs sm:text-sm text-slate-800 mb-6 leading-relaxed">
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</div>
              <div className="pt-2"><strong>To,</strong></div>
              <div>The Chairman / Head of the Department,</div>
              <div>Department of {formData.department},</div>
              <div>International Islamic University Chittagong (IIUC).</div>
            </div>

            {/* Subject */}
            <div className="text-xs sm:text-sm font-bold text-slate-950 mb-4 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
              Subject: Application for leave of absence / exam exemption on medical grounds.
            </div>

            {/* Letter Body */}
            <div className="text-xs sm:text-sm text-slate-800 space-y-3 leading-relaxed mb-8">
              <p>Respected Sir,</p>
              <p>
                With due respect and humble submission, I am <strong>{formData.studentName}</strong>, a regular student of the Department of {formData.department}, bearing Student ID: <strong>{formData.studentId}</strong>.
              </p>
              <p>
                I am writing to inform you that I have been unable to attend scheduled classes/examinations (including <strong>{formData.missedExamsOrClasses}</strong>) from <strong>{formData.startDate}</strong> to <strong>{formData.endDate}</strong> due to {formData.reasonDetails}.
              </p>
              <p>
                Under the advice of <strong>{formData.doctorOrClinicName || 'the registered physician'}</strong>, I was placed on mandatory rest. The official medical prescription and diagnostic test copies are attached herewith for your kind perusal.
              </p>
              <p>
                I, therefore, pray and hope that your honor would be kind enough to grant me medical leave for the aforementioned period and permit necessary makeup examinations as per university academic regulations.
              </p>
            </div>

            {/* Sign-off & Signatures Grid */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-center">
              <div>
                <div className="h-12 border-b border-dashed border-slate-400 mb-2"></div>
                <div className="font-bold text-slate-900">{formData.studentName}</div>
                <div className="text-slate-500 text-[11px]">Student ID: {formData.studentId}</div>
                <div className="text-slate-500 text-[11px]">{formData.contactPhone}</div>
              </div>

              <div>
                <div className="h-12 border-b border-dashed border-slate-400 mb-2"></div>
                <div className="font-bold text-slate-900">Chairman / Course Coordinator</div>
                <div className="text-slate-500 text-[11px]">Department of {formData.department}</div>
                <div className="text-slate-400 text-[10px]">Recommended / Approved</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Notice Board Feed & Deadlines */}
      {activeSubView === 'notices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-semibold">
            <span>{isBn ? 'ক্যাম্পাসের সাম্প্রতিক নোটিশসমূহ' : 'Recent Campus Circulars'}</span>
            <span>{SAMPLE_NOTICES.length} {isBn ? 'টি নোটিশ' : 'notices'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_NOTICES.map((notice) => (
              <div
                key={notice.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    {notice.category.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{notice.publishDate}</span>
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {isBn ? notice.titleBn : notice.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBn ? notice.summaryBn : notice.summaryEn}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span><strong>অফিস:</strong> {isBn ? notice.issuingOfficeBn : notice.issuingOffice}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>কক্ষ:</strong> {notice.destinationRoom}</span>
                  </div>

                  <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-[11px] font-semibold">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-rose-600" />
                    <span>শেষ সময়: {notice.deadlines.join(' | ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
