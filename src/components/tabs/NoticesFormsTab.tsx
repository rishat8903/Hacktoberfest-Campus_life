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
    title: 'Tuition Fee Waiver & Merit Scholarship Applications for Autumn 2026',
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
    title: 'Dormitory Dining Schedule & Main Gate Timing Notice',
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
    studentName: 'Tanvir Ahmed',
    studentId: 'C221045',
    department: 'Computer Science & Engineering (CSE)',
    batchAndSection: 'CSE 53rd Batch, Section B',
    semester: 'Autumn 2026 (5th Semester)',
    contactPhone: '01812-345678',
    reasonType: 'sick_leave',
    missedExamsOrClasses: 'CSE-3501 (DBMS Midterm Exam) & CSE-3503 Database Lab',
    startDate: '2026-10-22',
    endDate: '2026-10-26',
    reasonDetails: 'Diagnosed with severe viral fever and advised by the attending physician to observe 5 days complete bed rest.',
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
      <div className="bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
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
            <span>Leave Application Generator (A4 Print)</span>
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
            <span>Campus Notice Decoder</span>
          </button>
        </div>

        {activeSubView === 'leave_generator' && (
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print Official Letter (PDF)</span>
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
              <h3 className="font-bold text-slate-900 text-sm font-display">
                Student & Leave Details
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Department & Faculty
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Batch & Section
                  </label>
                  <input
                    type="text"
                    value={formData.batchAndSection}
                    onChange={(e) => setFormData({ ...formData, batchAndSection: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Academic Semester
                  </label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Type of Application
                </label>
                <select
                  value={formData.reasonType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reasonType: e.target.value as LeaveApplicationData['reasonType'],
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="sick_leave">Medical Sick Leave (Dormitory/Hospital)</option>
                  <option value="exam_exemption">Missed Examination Exemption & Re-test</option>
                  <option value="transport_disruption">Kumira Highway Bus / Transit Disruption</option>
                  <option value="family_emergency">Urgent Family Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Leave From Date
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
                    Leave To Date
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
                  Missed Classes, Labs or Exam Codes
                </label>
                <input
                  type="text"
                  value={formData.missedExamsOrClasses}
                  onChange={(e) =>
                    setFormData({ ...formData, missedExamsOrClasses: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Medical Diagnosis & Reason Details
                </label>
                <textarea
                  rows={3}
                  value={formData.reasonDetails}
                  onChange={(e) => setFormData({ ...formData, reasonDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="medSlip"
                  checked={formData.medicalSlipAttached}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalSlipAttached: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="medSlip" className="font-semibold text-slate-800 cursor-pointer">
                  Attaching Registered Physician Prescription / Hospital Slip
                </label>
              </div>

              {formData.medicalSlipAttached && (
                <div>
                  <input
                    type="text"
                    placeholder="Doctor Name & Medical Center"
                    value={formData.doctorOrClinicName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, doctorOrClinicName: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 text-xs"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Printable Official A4 Document */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-300 shadow-md printable-page text-slate-900 font-serif leading-relaxed text-sm">
              {/* IIUC Official Header */}
              <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-wide uppercase font-display text-slate-900">
                  International Islamic University Chittagong
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Kumira, Sitakunda, Chattogram-4318, Bangladesh
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Department of {formData.department || 'Computer Science & Engineering'}
                </p>
                <div className="inline-block mt-3 px-3 py-1 bg-slate-100 border border-slate-400 text-xs font-bold tracking-widest uppercase">
                  Official Academic Application
                </div>
              </div>

              {/* Letter Meta */}
              <div className="flex justify-between items-center text-xs text-slate-600 mb-6">
                <div>
                  <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
                </div>
                <div>
                  <strong>Student ID:</strong> {formData.studentId}
                </div>
              </div>

              {/* Letter Recipient */}
              <div className="text-xs text-slate-800 mb-5 leading-relaxed font-sans">
                <p className="font-bold">To,</p>
                <p className="font-bold">The Chairman / Head of the Department,</p>
                <p>Department of {formData.department},</p>
                <p>International Islamic University Chittagong (IIUC),</p>
                <p>Kumira, Chattogram.</p>
              </div>

              {/* Subject */}
              <div className="mb-5 text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Subject:{' '}
                {formData.reasonType === 'sick_leave'
                  ? 'Application for Grant of Medical Sick Leave & Attendance Waiver'
                  : formData.reasonType === 'exam_exemption'
                  ? 'Application for Exemption & Special Examination Arrangement'
                  : formData.reasonType === 'transport_disruption'
                  ? 'Application Regarding Attendance Disruption Due to Kumira Transit Halt'
                  : 'Application for Urgent Academic Leave of Absence'}
              </div>

              {/* Body */}
              <div className="space-y-3 text-xs leading-relaxed text-slate-800 font-sans">
                <p>Respected Sir,</p>
                <p>
                  Most respectfully, I beg to state that I am an enrolled student of the{' '}
                  <strong>{formData.batchAndSection}</strong>, currently studying in the{' '}
                  <strong>{formData.semester}</strong>, bearing Student ID{' '}
                  <strong>{formData.studentId}</strong>.
                </p>

                <p>
                  I am writing to formally request leave of absence from{' '}
                  <strong>{formData.startDate}</strong> to <strong>{formData.endDate}</strong> due to the
                  following circumstance:
                </p>

                <blockquote className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-600 text-xs italic text-slate-700 my-2">
                  "{formData.reasonDetails}"
                </blockquote>

                <p>
                  Due to this unforeseen condition, I was regrettably unable to attend the scheduled
                  classes/examinations for: <strong>{formData.missedExamsOrClasses}</strong>.
                </p>

                {formData.medicalSlipAttached && (
                  <p className="text-[11px] text-slate-600">
                    * Attached herewith is the verified medical certificate and prescription issued by{' '}
                    <strong>{formData.doctorOrClinicName || 'attending registered physician'}</strong>.
                  </p>
                )}

                <p>
                  I therefore earnestly pray and hope that you will be kind enough to grant my leave of
                  absence for the aforementioned dates and kindly direct the respected course instructors to
                  allow attendance exemption and makeup assessments.
                </p>
              </div>

              {/* Signatures Row */}
              <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-600 font-sans">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center font-cursive text-slate-900 text-xs">
                    {formData.studentName}
                  </div>
                  <div className="font-bold text-slate-900">{formData.studentName}</div>
                  <div>Applicant Student</div>
                  <div>Ph: {formData.contactPhone}</div>
                </div>

                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
                  <div className="font-bold text-slate-800">Batch Advisor</div>
                  <div>Signature & Date</div>
                </div>

                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
                  <div className="font-bold text-slate-800">Chairman / Head of Dept</div>
                  <div>Official Seal & Approval</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Decoded Campus Notices Board */}
      {activeSubView === 'notices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-display">
              Official University Notice Circulars
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Verified by IIUC Campus Communications
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_NOTICES.map((notice) => (
              <div
                key={notice.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{notice.publishDate}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug font-display">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {notice.issuingOffice}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mt-3 leading-relaxed">
                    {notice.summaryEn}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Deadlines: {notice.deadlines.join(' | ')}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{notice.destinationRoom}</span>
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
