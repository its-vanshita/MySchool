/* ═══════════════════════════════════════════════════════════════
   MySchool — TypeScript type definitions
   Aligned with the TRD PostgreSQL schema
   ═══════════════════════════════════════════════════════════════ */

// ────────── Roles ──────────
export type UserRole = 'teacher' | 'admin' | 'principal' | 'parent' | 'super_admin';

// ────────── User / Staff ──────────
export interface AppUser {
  id: string;
  unique_id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  subjects: string[];
  designation?: string;
  avatar_url: string;
  school_id: string;
  is_first_login: boolean;
  created_at: string;
}

// ────────── School ──────────
export interface School {
  id: string;
  name: string;
  address: string;
  logo_url: string;
  created_at: string;
}

// ────────── Timetable ──────────
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface TimetableEntry {
  id: string;
  teacher_id: string;
  subject: string;
  class_name: string;
  room: string;
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  day: DayOfWeek;
  school_id: string;
}

export type ScheduleStatus = 'upcoming' | 'ongoing' | 'completed';

export interface ScheduleItem extends TimetableEntry {
  status: ScheduleStatus;
}

// ────────── Attendance ──────────
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  class_id: string;
  student_id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  marked_by: string;
  created_at: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  section: string;
  school_id: string;
}

export interface StudentInfo {
  id: string;
  name: string;
  roll_number: string;
  class_id: string;
  parent_email: string;
  dob?: string;           // YYYY-MM-DD
  section?: string;
  photo_url?: string;
  parent_id?: string;     // FK to parent user
}

// ────────── Notices (Students) ──────────
export type NoticeType = 'general' | 'urgent' | 'event' | 'holiday' | 'exam';

export type TargetAudience = 'all' | 'students' | 'teachers' | 'specific_classes' | 'specific_teachers' | 'specific_students';

export interface Notice {
  id: string;
  title: string;
  message: string;
  class_id?: string;       // Legacy / for simple single-class
  class_name?: string;     // Legacy
  attachment_url?: string;
  type: NoticeType;
  created_by: string;
  creator_name?: string;
  created_at: string;
  
  // New Targeting Fields
  target_audience?: TargetAudience;
  target_classes?: string[];
  target_teachers?: string[];
  target_students?: string[];
}

// ────────── Announcements (Teachers/Staff) ──────────
export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Announcement {
  id: string;
  message: string;
  title: string;
  priority: AnnouncementPriority;
  created_by: string;
  creator_name?: string;
  created_at: string;
  school_id: string;
}

// ────────── Leave Requests ──────────
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  teacher_id: string;
  teacher_name?: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: LeaveStatus;
  approved_by: string | null;
  approver_name?: string;
  created_at: string;
}

// ────────── Homework ──────────
export type HomeworkSubject = 'Mathematics' | 'Science' | 'English' | 'Hindi' | 'Social Studies' | 'Computer Science' | 'Other';

export interface Homework {
  id: string;
  teacher_id: string;
  class_id: string;
  class_name: string;
  subject: string;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
}

// ────────── Lesson Plans ──────────
export interface LessonPlan {
  id: string;
  teacher_id: string;
  subject: string;
  topic: string;
  description: string;
  file_url: string;
  class_name: string;
  uploaded_at: string;
}

// ────────── Datesheet / Exams ──────────
export type ExamType = 'half-yearly' | 'annual' | 'unit-test' | 'pre-board' | 'practical' | 'other';

export interface ExamEntry {
  id: string;
  class_name: string;
  subject: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room: string;
  school_id: string;
  exam_type?: ExamType;
}

/** Teacher's invigilation/duty assignment for an exam day */
export interface ExamDuty {
  id: string;
  teacher_id: string;
  exam_date: string;
  room: string;
  start_time: string;
  end_time: string;
  class_name: string;
  exam_type?: ExamType;
  school_id: string;
}

/** Grouping for datesheet listing */
export interface ExamGroup {
  exam_type: ExamType;
  label: string;
  classes: string[];
  startDate: string;
  endDate: string;
  totalSubjects: number;
  entries: ExamEntry[];
  duties: ExamDuty[];
}

// ────────── Calendar Events ──────────
export type CalendarEventType = 'holiday' | 'event' | 'exam' | 'meeting';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string;
  end_date: string;
  description: string;
  school_id: string;
  created_at: string;
}

// ────────── Fee Management ──────────
export type FeeType = 'tuition' | 'transport' | 'library' | 'lab' | 'exam' | 'sports' | 'other';
export type FeeFrequency = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly' | 'one_time';
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'online';
export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';

export interface FeeStructure {
  id: string;
  class_id: string;
  class_name: string;
  fee_type: FeeType;
  amount: number;
  frequency: FeeFrequency;
  academic_year: string;
  school_id: string;
  created_at: string;
}

export interface FeePayment {
  id: string;
  student_id: string;
  fee_structure_id: string;
  amount_paid: number;
  payment_date: string;
  payment_method: PaymentMethod;
  receipt_number: string;
  status: PaymentStatus;
  remarks: string;
  collected_by: string;
  school_id: string;
  created_at: string;
}

// ────────── Student Marks / Results ──────────
export interface StudentMark {
  id: string;
  student_id: string;
  exam_id: string;
  subject: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  remarks: string;
  entered_by: string;
  school_id: string;
  created_at: string;
}

// ────────── Student Documents ──────────
export type DocumentType = 'birth_certificate' | 'transfer_certificate' | 'marksheet' | 'aadhaar' | 'photo' | 'medical' | 'other';

export interface StudentDocument {
  id: string;
  student_id: string;
  doc_type: DocumentType;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  school_id: string;
  created_at: string;
}

// ────────── Dashboard Helpers ──────────
export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  todayAttendancePercent: number;
  pendingLeaves: number;
  unreadAnnouncements: number;
}

// ────────── Role Permission Map ──────────
export interface RolePermissions {
  canViewSchedule: boolean;
  canMarkAttendance: boolean;
  canUploadLessonPlan: boolean;
  canPublishNotice: boolean;
  canPublishAnnouncement: boolean;
  canAssignHomework: boolean;
  canRequestLeave: boolean;
  canApproveLeave: boolean;
  canManageData: boolean;
  canViewReports: boolean;
  canManageFees: boolean;
  canViewFees: boolean;
  canEnterMarks: boolean;
  canViewMarks: boolean;
  canManageDocuments: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  teacher: {
    canViewSchedule: true,
    canMarkAttendance: true,
    canUploadLessonPlan: true,
    canPublishNotice: true,
    canPublishAnnouncement: false,
    canAssignHomework: true,
    canRequestLeave: true,
    canApproveLeave: false,
    canManageData: false,
    canViewReports: false,
    canManageFees: false,
    canViewFees: false,
    canEnterMarks: true,
    canViewMarks: true,
    canManageDocuments: false,
  },
  admin: {
    canViewSchedule: true,
    canMarkAttendance: true,
    canUploadLessonPlan: true,
    canPublishNotice: true,
    canPublishAnnouncement: true,
    canAssignHomework: true,
    canRequestLeave: true,
    canApproveLeave: true,
    canManageData: true,
    canViewReports: true,
    canManageFees: true,
    canViewFees: true,
    canEnterMarks: true,
    canViewMarks: true,
    canManageDocuments: true,
  },
  principal: {
    canViewSchedule: true,
    canMarkAttendance: true,
    canUploadLessonPlan: true,
    canPublishNotice: true,
    canPublishAnnouncement: true,
    canAssignHomework: true,
    canRequestLeave: false,
    canApproveLeave: true,
    canManageData: true,
    canViewReports: true,
    canManageFees: true,
    canViewFees: true,
    canEnterMarks: true,
    canViewMarks: true,
    canManageDocuments: true,
  },
  parent: {
    canViewSchedule: true,
    canMarkAttendance: false,
    canUploadLessonPlan: false,
    canPublishNotice: false,
    canPublishAnnouncement: false,
    canAssignHomework: false,
    canRequestLeave: true,
    canApproveLeave: false,
    canManageData: false,
    canViewReports: true,
    canManageFees: false,
    canViewFees: true,
    canEnterMarks: false,
    canViewMarks: true,
    canManageDocuments: false,
  },
  super_admin: {
    canViewSchedule: true,
    canMarkAttendance: true,
    canUploadLessonPlan: true,
    canPublishNotice: true,
    canPublishAnnouncement: true,
    canAssignHomework: true,
    canRequestLeave: true,
    canApproveLeave: true,
    canManageData: true,
    canViewReports: true,
    canManageFees: true,
    canViewFees: true,
    canEnterMarks: true,
    canViewMarks: true,
    canManageDocuments: true,
  },
};
