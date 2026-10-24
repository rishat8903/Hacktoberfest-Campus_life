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
  BookOpen,
  GraduationCap,
  Layers,
  Award,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  Language,
  CampusNotice,
  LeaveApplicationData,
  CoverPageData,
  CoverPageType,
} from '../../types/campus';

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
    summaryBn:
      'সকল অনুষদের শিক্ষার্থীদের অনলাইন পোর্টাল থেকে পরীক্ষার ফি পরিশোধ করে নির্ধারিত তারিখের মধ্যে স্ব-স্ব বিভাগীয় অফিস থেকে প্রবেশপত্র সংগ্রহ করতে হবে। কোনো বকেয়া থাকলে প্রবেশপত্র ইস্যু হবে না।',
    summaryEn:
      'Students must clear outstanding semester fees online and collect official admit cards from department offices before the deadline.',
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
    summaryBn:
      'ন্যূনতম জিপিএ ৩.৫০ প্রাপ্ত এবং আর্থিক অসচ্ছল শিক্ষার্থীরা নির্ধারিত ফরমে অভিভাবকের আয়ের সনদসহ আবেদনপত্র জমা দিতে পারবেন।',
    summaryEn:
      'Eligible students with GPA 3.50+ and financial need can apply with verified guardian income certificate.',
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
    summaryBn:
      'রাত ০৯:৩০ মিনিটের পর হলে প্রবেশের জন্য সহকারী প্রভোস্টের লিখিত অনুমতি প্রয়োজন হবে। ডাইনিং কুপন প্রতিদিন দুপুর ২টার পূর্বে নিশ্চিত করতে হবে।',
    summaryEn:
      'Hall main gate closes at 09:30 PM. Night entry requires written assistant provost approval.',
    destinationRoom: 'Hall Provost Office, Ground Floor',
    requiredDocuments: ['Hall Resident Card'],
  },
];

const PRESET_COVERS: { label: string; data: Partial<CoverPageData> }[] = [
  {
    label: '🧪 DBMS Lab Report (CSE-3502)',
    data: {
      coverType: 'lab_report',
      courseCode: 'CSE-3502',
      courseTitle: 'Database Management Systems Lab',
      itemNumber: 'Experiment No: 03',
      titleOrTopic: 'Implementation of 3NF Normalization & Complex SQL Queries in PostgreSQL',
      experimentDate: '2026-10-20',
      groupOrPartner: 'Group 04 (Tanvir & Farhan)',
      teacherName: 'Dr. Mohammed Shamsul Arefin',
      teacherDesignation: 'Professor & Course Instructor',
      teacherDepartment: 'Department of Computer Science & Engineering',
    },
  },
  {
    label: '📝 Algorithms Assignment (CSE-2401)',
    data: {
      coverType: 'assignment',
      courseCode: 'CSE-2401',
      courseTitle: 'Design & Analysis of Algorithms',
      itemNumber: 'Assignment No: 02',
      titleOrTopic: 'Comparative Time Complexity Analysis of Dijkstra vs Bellman-Ford Shortest Paths',
      groupOrPartner: '',
      teacherName: 'Engr. Kazi Tanvir Huda',
      teacherDesignation: 'Assistant Professor',
      teacherDepartment: 'Department of Computer Science & Engineering',
    },
  },
  {
    label: '📑 Software Engg Project Report (CSE-4701)',
    data: {
      coverType: 'project_report',
      courseCode: 'CSE-4701',
      courseTitle: 'Software Engineering & System Architecture',
      itemNumber: 'Term Project Report',
      titleOrTopic: 'IIUC CampusMate: Unified Microservices Platform for University Students',
      groupOrPartner: 'Team ByteCrafters (ID: C221045, C221046)',
      teacherName: 'Prof. Dr. Md. Rezaul Karim',
      teacherDesignation: 'Chairman & Professor',
      teacherDepartment: 'Department of Computer Science & Engineering',
    },
  },
];

export const NoticesFormsTab: React.FC<NoticesFormsTabProps> = ({ language }) => {
  const isBn = language === 'bn';

  // Active Sub-view: Cover Generator vs Leave Letter vs Notices Board
  const [activeSubView, setActiveSubView] = useState<'cover_generator' | 'leave_generator' | 'notices'>(
    'cover_generator'
  );

  // --- Assignment / Lab Report Cover Page State ---
  const [coverData, setCoverData] = useState<CoverPageData>({
    coverType: 'lab_report',
    universityName: 'International Islamic University Chittagong',
    campusName: 'Kumira, Sitakunda, Chattogram-4318, Bangladesh',
    department: 'Computer Science & Engineering (CSE)',
    courseCode: 'CSE-3502',
    courseTitle: 'Database Management Systems Lab',
    itemNumber: 'Experiment No: 03',
    titleOrTopic: 'Implementation of 3NF Normalization & Complex SQL Queries in PostgreSQL',
    studentName: 'Tanvir Ahmed',
    studentId: 'C221045',
    batchAndSection: 'CSE 53rd Batch, Section B',
    semester: 'Autumn 2026 (5th Semester)',
    groupOrPartner: 'Group 04 (Tanvir & Farhan)',
    teacherName: 'Dr. Mohammed Shamsul Arefin',
    teacherDesignation: 'Professor & Course Instructor',
    teacherDepartment: 'Department of Computer Science & Engineering',
    submissionDate: new Date().toISOString().split('T')[0],
    experimentDate: '2026-10-20',
    borderStyle: 'formal_double',
    includeGradingBox: true,
  });

  // --- Academic Leave Letter Generator Form State ---
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
    reasonDetails:
      'Diagnosed with severe viral fever and advised by the attending physician to observe 5 days complete bed rest.',
    medicalSlipAttached: true,
    doctorOrClinicName: 'Dr. Rafiqul Islam, MBBS (Kumira Health Complex)',
  });

  // Trigger print dialog for the generated letter / cover
  const handlePrint = () => {
    window.print();
  };

  const handleApplyPreset = (preset: typeof PRESET_COVERS[0]) => {
    setCoverData((prev) => ({
      ...prev,
      ...preset.data,
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Upscale-Style Selector: Cover Generator vs Leave Application vs Notice Decoder */}
      <div className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto border border-slate-200/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubView('cover_generator')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubView === 'cover_generator'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Assignment & Lab Cover (A4 Print)</span>
          </button>

          <button
            onClick={() => setActiveSubView('leave_generator')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubView === 'leave_generator'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Leave Application (A4 Print)</span>
          </button>

          <button
            onClick={() => setActiveSubView('notices')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubView === 'notices'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Campus Notice Decoder</span>
          </button>
        </div>

        {activeSubView !== 'notices' && (
          <button
            onClick={handlePrint}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer shrink-0 ${
              activeSubView === 'cover_generator'
                ? 'bg-slate-900 hover:bg-slate-800'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>
              {activeSubView === 'cover_generator' ? 'Print Cover Page (A4 PDF)' : 'Print Official Letter (PDF)'}
            </span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: Assignment & Lab Report Cover Generator (NEW!) */}
      {/* ========================================================= */}
      {activeSubView === 'cover_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Form Column */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 no-print">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-display">
                  Cover Page Configuration
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                IIUC Standard
              </span>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Load Course Preset:
              </label>
              <div className="flex flex-col gap-1.5">
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-left px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold rounded-xl border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Type Selector */}
            <div>
              <label className="font-bold text-slate-700 text-xs block mb-1">Document Cover Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'lab_report', label: 'Lab Report' },
                  { id: 'assignment', label: 'Assignment' },
                  { id: 'project_report', label: 'Project' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCoverData({ ...coverData, coverType: t.id as CoverPageType })}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition border cursor-pointer ${
                      coverData.coverType === t.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Information */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 text-xs block mb-1">Course Code</label>
                  <input
                    type="text"
                    value={coverData.courseCode}
                    onChange={(e) => setCoverData({ ...coverData, courseCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 text-xs block mb-1">Course Title</label>
                  <input
                    type="text"
                    value={coverData.courseTitle}
                    onChange={(e) => setCoverData({ ...coverData, courseTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-xs block mb-1">
                  {coverData.coverType === 'lab_report' ? 'Experiment Number' : 'Assignment / Report Number'}
                </label>
                <input
                  type="text"
                  value={coverData.itemNumber}
                  onChange={(e) => setCoverData({ ...coverData, itemNumber: e.target.value })}
                  placeholder="e.g. Experiment No: 03 or Assignment No: 01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-xs block mb-1">
                  {coverData.coverType === 'lab_report' ? 'Experiment Name / Title' : 'Assignment / Topic Title'}
                </label>
                <textarea
                  rows={2}
                  value={coverData.titleOrTopic}
                  onChange={(e) => setCoverData({ ...coverData, titleOrTopic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium leading-relaxed"
                />
              </div>
            </div>

            {/* Student Details */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Submitted By (Student Info)</span>
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Student Name</label>
                  <input
                    type="text"
                    value={coverData.studentName}
                    onChange={(e) => setCoverData({ ...coverData, studentName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Student Matric / ID</label>
                  <input
                    type="text"
                    value={coverData.studentId}
                    onChange={(e) => setCoverData({ ...coverData, studentId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Batch & Section</label>
                  <input
                    type="text"
                    value={coverData.batchAndSection}
                    onChange={(e) => setCoverData({ ...coverData, batchAndSection: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Semester</label>
                  <input
                    type="text"
                    value={coverData.semester}
                    onChange={(e) => setCoverData({ ...coverData, semester: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  Group / Lab Partner(s) (Optional)
                </label>
                <input
                  type="text"
                  value={coverData.groupOrPartner || ''}
                  onChange={(e) => setCoverData({ ...coverData, groupOrPartner: e.target.value })}
                  placeholder="e.g. Group 04 / Partner: Farhan (C221046)"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Faculty Details */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Submitted To (Faculty Details)</span>
              </h4>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Instructor Name</label>
                <input
                  type="text"
                  value={coverData.teacherName}
                  onChange={(e) => setCoverData({ ...coverData, teacherName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Designation</label>
                  <input
                    type="text"
                    value={coverData.teacherDesignation}
                    onChange={(e) => setCoverData({ ...coverData, teacherDesignation: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Department</label>
                  <input
                    type="text"
                    value={coverData.teacherDepartment}
                    onChange={(e) => setCoverData({ ...coverData, teacherDepartment: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Dates & Styling */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                {coverData.coverType === 'lab_report' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Date of Experiment
                    </label>
                    <input
                      type="date"
                      value={coverData.experimentDate || ''}
                      onChange={(e) => setCoverData({ ...coverData, experimentDate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono"
                    />
                  </div>
                )}
                <div className={coverData.coverType === 'lab_report' ? '' : 'col-span-2'}>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Date of Submission</label>
                  <input
                    type="date"
                    value={coverData.submissionDate}
                    onChange={(e) => setCoverData({ ...coverData, submissionDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={coverData.includeGradingBox}
                    onChange={(e) => setCoverData({ ...coverData, includeGradingBox: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Include Teacher Grading & Evaluation Rubric</span>
                </label>

                <select
                  value={coverData.borderStyle}
                  onChange={(e) =>
                    setCoverData({
                      ...coverData,
                      borderStyle: e.target.value as CoverPageData['borderStyle'],
                    })
                  }
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="formal_double">Formal Double Border</option>
                  <option value="academic_box">Academic Framed Box</option>
                  <option value="minimal_modern">Clean Minimal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Live Printable Official A4 Document */}
          <div className="lg:col-span-7">
            <div
              className={`bg-white shadow-xl printable-page text-slate-900 leading-normal transition-all ${
                coverData.borderStyle === 'formal_double'
                  ? 'border-8 border-double border-slate-900 p-8 sm:p-12'
                  : coverData.borderStyle === 'academic_box'
                  ? 'border-2 border-slate-900 p-8 sm:p-12'
                  : 'border border-slate-300 p-8 sm:p-12'
              }`}
              style={{ minHeight: '850px' }}
            >
              {/* IIUC Monogram Emblem / University Crest */}
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-slate-900 p-1 mb-1 shadow-xs">
                  <div className="w-full h-full rounded-full border border-slate-800 flex items-center justify-center bg-slate-50">
                    <GraduationCap className="w-8 h-8 text-slate-900" />
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase font-serif text-slate-900">
                  International Islamic University Chittagong
                </h1>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                  Kumira, Sitakunda, Chattogram-4318, Bangladesh
                </p>
                <p className="text-xs font-bold text-slate-800 font-serif pt-0.5">
                  Faculty of Science & Engineering
                </p>
                <p className="text-xs font-medium text-slate-700">
                  {coverData.teacherDepartment || 'Department of Computer Science & Engineering'}
                </p>
              </div>

              {/* Document Type Badge */}
              <div className="my-6 text-center">
                <div className="inline-block px-6 py-2 bg-slate-900 text-white font-bold text-sm tracking-widest uppercase rounded-sm shadow-xs">
                  {coverData.coverType === 'lab_report'
                    ? 'LABORATORY REPORT'
                    : coverData.coverType === 'assignment'
                    ? 'ASSIGNMENT SUBMISSION'
                    : 'TERM PROJECT REPORT'}
                </div>
              </div>

              {/* Course Block */}
              <div className="border-t-2 border-b-2 border-slate-800 py-4 my-6 text-center space-y-1 bg-slate-50/60">
                <div className="text-xs font-bold text-slate-600 tracking-wider uppercase font-sans">
                  Course Title & Code
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 font-serif">
                  {coverData.courseTitle || 'Database Management Systems Lab'}
                </div>
                <div className="text-xs font-mono font-bold text-slate-800 bg-white inline-block px-3 py-0.5 border border-slate-300 rounded">
                  Course Code: {coverData.courseCode || 'CSE-3502'}
                </div>
              </div>

              {/* Item No & Topic Title */}
              <div className="text-center my-6 space-y-2 px-4">
                <div className="text-xs font-bold tracking-widest uppercase text-slate-700">
                  {coverData.itemNumber || 'Experiment No: 01'}
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-serif leading-snug underline underline-offset-4 decoration-slate-400">
                  {coverData.titleOrTopic || 'Implementation of Database Schema and Queries'}
                </h2>
              </div>

              {/* Two Boxes: SUBMITTED BY vs SUBMITTED TO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-8 font-sans text-xs">
                {/* Submitted By Box */}
                <div className="border border-slate-800 p-4 bg-white rounded-xs">
                  <div className="font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-300 mb-2.5 flex items-center gap-1.5">
                    <span>Submitted By:</span>
                  </div>
                  <div className="space-y-1.5 text-slate-800">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                        {coverData.studentName}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Student ID: </span>
                      <span className="font-mono font-bold text-slate-900">{coverData.studentId}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Batch & Sec: </span>
                      <span>{coverData.batchAndSection}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Semester: </span>
                      <span>{coverData.semester}</span>
                    </div>
                    {coverData.groupOrPartner && (
                      <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-100">
                        <span className="font-semibold">Team/Partner: </span>
                        <span>{coverData.groupOrPartner}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submitted To Box */}
                <div className="border border-slate-800 p-4 bg-white rounded-xs">
                  <div className="font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-300 mb-2.5 flex items-center gap-1.5">
                    <span>Submitted To:</span>
                  </div>
                  <div className="space-y-1.5 text-slate-800">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                        {coverData.teacherName}
                      </span>
                    </div>
                    <div className="text-slate-700 font-medium">{coverData.teacherDesignation}</div>
                    <div className="text-slate-600 text-[11px]">{coverData.teacherDepartment}</div>
                    <div className="text-slate-500 text-[10px] pt-1 border-t border-slate-100">
                      International Islamic University Chittagong (IIUC)
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Bar */}
              <div className="flex flex-wrap items-center justify-between text-xs font-sans text-slate-800 border-t border-b border-slate-300 py-2.5 px-3 bg-slate-50 my-6">
                {coverData.coverType === 'lab_report' && coverData.experimentDate && (
                  <div>
                    <strong>Date of Performance:</strong> {coverData.experimentDate}
                  </div>
                )}
                <div>
                  <strong>Date of Submission:</strong> {coverData.submissionDate}
                </div>
              </div>

              {/* Optional Teacher Evaluation Rubric */}
              {coverData.includeGradingBox && (
                <div className="mt-8 pt-4 font-sans text-[11px]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 text-center">
                    Official Faculty Assessment & Grading
                  </div>
                  <table className="w-full border-collapse border border-slate-400 text-center">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold">
                        <th className="border border-slate-400 p-1.5 text-left pl-3">Evaluation Criteria</th>
                        <th className="border border-slate-400 p-1.5 w-20">Max Marks</th>
                        <th className="border border-slate-400 p-1.5 w-24">Marks Obtained</th>
                        <th className="border border-slate-400 p-1.5 w-32">Remarks / Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-400 p-1.5 text-left pl-3">
                          {coverData.coverType === 'lab_report' ? 'Lab Performance & Execution' : 'Originality & Depth'}
                        </td>
                        <td className="border border-slate-400 p-1.5 font-mono">10</td>
                        <td className="border border-slate-400 p-1.5"></td>
                        <td className="border border-slate-400 p-1.5" rowSpan={4}></td>
                      </tr>
                      <tr>
                        <td className="border border-slate-400 p-1.5 text-left pl-3">
                          Report Presentation & Analysis
                        </td>
                        <td className="border border-slate-400 p-1.5 font-mono">10</td>
                        <td className="border border-slate-400 p-1.5"></td>
                      </tr>
                      <tr>
                        <td className="border border-slate-400 p-1.5 text-left pl-3">Viva / Defense & Q&A</td>
                        <td className="border border-slate-400 p-1.5 font-mono">10</td>
                        <td className="border border-slate-400 p-1.5"></td>
                      </tr>
                      <tr className="font-bold bg-slate-50">
                        <td className="border border-slate-400 p-1.5 text-left pl-3">Total Marks</td>
                        <td className="border border-slate-400 p-1.5 font-mono">30</td>
                        <td className="border border-slate-400 p-1.5"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: Official Printable Leave Application Generator */}
      {/* ========================================================= */}
      {activeSubView === 'leave_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Editor Column */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 no-print">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Edit3 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm font-display">Student & Leave Details</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student ID</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department & Faculty</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batch & Section</label>
                  <input
                    type="text"
                    value={formData.batchAndSection}
                    onChange={(e) => setFormData({ ...formData, batchAndSection: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Academic Semester</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Type of Application</label>
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
                  <label className="font-semibold text-slate-700 block mb-1">Leave From Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Leave Till Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Missed Classes / Exams (Codes & Names)
                </label>
                <input
                  type="text"
                  value={formData.missedExamsOrClasses}
                  onChange={(e) => setFormData({ ...formData, missedExamsOrClasses: e.target.value })}
                  placeholder="e.g. CSE-3501 (DBMS Midterm Exam)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason Description</label>
                <textarea
                  rows={3}
                  value={formData.reasonDetails}
                  onChange={(e) => setFormData({ ...formData, reasonDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalSlipAttached}
                    onChange={(e) => setFormData({ ...formData, medicalSlipAttached: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-slate-700 text-xs">
                    Attach Registered Doctor Medical Certificate / Hospital Slip
                  </span>
                </label>
              </div>

              {formData.medicalSlipAttached && (
                <div className="pt-1">
                  <label className="font-semibold text-slate-600 block mb-1 text-[11px]">
                    Doctor / Clinic Name
                  </label>
                  <input
                    type="text"
                    value={formData.doctorOrClinicName || ''}
                    onChange={(e) => setFormData({ ...formData, doctorOrClinicName: e.target.value })}
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
                  <strong>{formData.semester}</strong>, bearing Student ID <strong>{formData.studentId}</strong>.
                </p>

                <p>
                  I am writing to formally request leave of absence from <strong>{formData.startDate}</strong> to{' '}
                  <strong>{formData.endDate}</strong> due to the following circumstance:
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
                  I therefore earnestly pray and hope that you will be kind enough to grant my leave of absence
                  for the aforementioned dates and kindly direct the respected course instructors to allow
                  attendance exemption and makeup assessments.
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

      {/* ========================================================= */}
      {/* VIEW 3: Decoded Campus Notices Board */}
      {/* ========================================================= */}
      {activeSubView === 'notices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-display">
              {isBn ? 'সাম্প্রতিক ক্যাম্পাস নোটিশ ও ডেডলাইন' : 'Active Campus Notices & Deadlines'}
            </h3>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-semibold border border-slate-200">
              {SAMPLE_NOTICES.length} Active Circulars
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_NOTICES.map((notice) => (
              <div
                key={notice.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{notice.publishDate}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {isBn ? notice.titleBn : notice.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {isBn ? notice.summaryBn : notice.summaryEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{isBn ? notice.issuingOfficeBn : notice.issuingOffice}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{notice.destinationRoom}</span>
                  </div>

                  {notice.deadlines && notice.deadlines.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200/60 p-2 rounded-xl text-[11px] text-amber-900 font-semibold flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span>Deadline: </span>
                        <span>{notice.deadlines[0]}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
