export type ActiveTab = 'study' | 'bus' | 'notices' | 'wellbeing';

export type Language = 'bn' | 'en';

export type VoiceGender = 'female' | 'male';
export type SpeechLang = 'en' | 'bn';

export interface VoiceOption {
  id: string;
  name: string;
  gender: VoiceGender;
  style: string;
}

export interface VoiceConfig {
  voiceId: string;
  name: string;
  gender: VoiceGender;
  speechLang: SpeechLang;
  speed: number;
  customVoiceId?: string;
}

// --- Study Hub Types ---
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface StudyNoteResult {
  id: string;
  topicTitle: string;
  courseCode?: string;
  summaryBn: string;
  summaryEn: string;
  keyConcepts: string[];
  quiz: QuizQuestion[];
  imageUrl?: string;
  createdAt: string;
}

// --- Bus Navigator Types ---
export interface BusRoute {
  id: string;
  routeCode: string;
  routeName: string;
  routeNameBn: string;
  startingPoint: string;
  startingPointBn: string;
  destination: string;
  destinationBn: string;
  stops: string[];
  stopsBn: string[];
  departuresToKumira: string[];
  departuresFromKumira: string[];
  estimatedMinutes: number;
  busGate: string;
  busGateBn: string;
  isFridayRoute: boolean;
  importantNotesBn: string;
  importantNotesEn: string;
}

// --- Notice & Academic Paperwork Types ---
export interface CampusNotice {
  id: string;
  title: string;
  titleBn: string;
  category: 'exam' | 'fees' | 'holiday' | 'registration' | 'general';
  issuingOffice: string;
  issuingOfficeBn: string;
  publishDate: string;
  deadlines: string[];
  summaryBn: string;
  summaryEn: string;
  destinationRoom: string;
  requiredDocuments: string[];
  isPinned?: boolean;
}

export interface LeaveApplicationData {
  studentName: string;
  studentId: string;
  department: string;
  batchAndSection: string;
  semester: string;
  contactPhone: string;
  reasonType: 'sick_leave' | 'exam_exemption' | 'transport_disruption' | 'family_emergency';
  missedExamsOrClasses: string;
  startDate: string;
  endDate: string;
  reasonDetails: string;
  medicalSlipAttached: boolean;
  doctorOrClinicName?: string;
}

// --- Campus Health & Wellbeing Types ---
export type HealthTriageTier = 'hall_rest' | 'campus_medical' | 'city_hospital' | 'emergency';

export interface HealthTriageResult {
  tier: HealthTriageTier;
  titleBn: string;
  titleEn: string;
  badgeBn: string;
  badgeEn: string;
  urgencyLevel: 'low' | 'moderate' | 'high' | 'critical';
  recommendationBn: string;
  recommendationEn: string;
  campusFacility: string;
  campusFacilityHours: string;
  questionsForDoctor: string[];
  redFlagWarning?: string;
}
