/* ═══════════════════════════════════════════════════════════════
   MySchool — Supabase Service Layer
   All database interactions, storage, and realtime subscriptions.
   ═══════════════════════════════════════════════════════════════ */

import { supabase } from '../config/supabase';
import type {
  AppUser,
  TimetableEntry,
  AttendanceRecord,
  AttendanceStatus,
  Notice,
  Announcement,
  LeaveRequest,
  LessonPlan,
  Homework,
  ExamEntry,
  CalendarEvent,
  ClassInfo,
  StudentInfo,
  FeeStructure,
  FeePayment,
  StudentMark,
  StudentDocument,
} from '../types';

// ═══════════════════════════════════════════════════════════════
// USER / PROFILE
// ═══════════════════════════════════════════════════════════════

export async function getProfile(userId: string): Promise<AppUser | null> {
  const { data } = await supabase.from('users').select('*').eq('id', userId).single();
  return data as AppUser | null;
}

export async function getProfileByUniqueId(uniqueId: string): Promise<AppUser | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('unique_id', uniqueId.toUpperCase().trim())
    .single();
  return data as AppUser | null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<AppUser>
): Promise<AppUser | null> {
  const { data } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return data as AppUser | null;
}

// ═══════════════════════════════════════════════════════════════
// TIMETABLE
// ═══════════════════════════════════════════════════════════════

export async function getTimetableForTeacher(teacherId: string): Promise<TimetableEntry[]> {
  const { data } = await supabase
    .from('timetable')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('start_time', { ascending: true });
  return (data ?? []) as TimetableEntry[];
}

export async function getTimetableForDay(
  teacherId: string,
  day: string
): Promise<TimetableEntry[]> {
  const { data } = await supabase
    .from('timetable')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('day', day.toLowerCase())
    .order('start_time', { ascending: true });
  return (data ?? []) as TimetableEntry[];
}

export function subscribeTimetable(
  teacherId: string,
  callback: (entries: TimetableEntry[]) => void
) {
  // Initial fetch
  getTimetableForTeacher(teacherId).then(callback);

  // Realtime
  const channel = supabase
    .channel(`timetable-${teacherId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'timetable', filter: `teacher_id=eq.${teacherId}` },
      () => {
        getTimetableForTeacher(teacherId).then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// CLASSES & STUDENTS
// ═══════════════════════════════════════════════════════════════

export async function getClasses(schoolId: string): Promise<ClassInfo[]> {
  const { data } = await supabase
    .from('classes')
    .select('*')
    .eq('school_id', schoolId)
    .order('name');
  return (data ?? []) as ClassInfo[];
}

export async function getStudentsByClass(classId: string): Promise<StudentInfo[]> {
  const { data } = await supabase
    .from('class_students')
    .select('*')
    .eq('class_id', classId)
    .order('roll_number');
  return (data ?? []) as StudentInfo[];
}

// ═══════════════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════════════

export async function getAttendanceForDate(
  classId: string,
  date: string
): Promise<AttendanceRecord[]> {
  const { data } = await supabase
    .from('ms_attendance')
    .select('*')
    .eq('class_id', classId)
    .eq('date', date);
  return (data ?? []) as AttendanceRecord[];
}

export async function markAttendance(
  records: { class_id: string; student_id: string; date: string; status: AttendanceStatus; marked_by: string }[]
): Promise<void> {
  const { error } = await supabase.from('ms_attendance').upsert(records, {
    onConflict: 'student_id,date',
  });
  if (error) throw error;
}

export function subscribeAttendance(classId: string, callback: () => void) {
  const channel = supabase
    .channel(`attendance-${classId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ms_attendance', filter: `class_id=eq.${classId}` },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// NOTICES (to students)
// ═══════════════════════════════════════════════════════════════

export async function getNotices(schoolId: string): Promise<Notice[]> {
  const { data } = await supabase
    .from('ms_notices')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as Notice[];
}

export async function getNoticesByCreator(userId: string): Promise<Notice[]> {
  const { data } = await supabase
    .from('ms_notices')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });
  return (data ?? []) as Notice[];
}

export async function createNotice(
  notice: Omit<Notice, 'id' | 'created_at'>
): Promise<Notice | null> {
  const { data } = await supabase.from('ms_notices').insert(notice).select().single();
  return data as Notice | null;
}

export async function deleteNotice(id: string): Promise<void> {
  await supabase.from('ms_notices').delete().eq('id', id);
}

export function subscribeNotices(callback: (notices: Notice[]) => void) {
  getNotices('').then(callback);
  const channel = supabase
    .channel('notices-all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ms_notices' }, () => {
      getNotices('').then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// ANNOUNCEMENTS (staff-wide)
// ═══════════════════════════════════════════════════════════════

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await supabase
    .from('ms_announcements')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as Announcement[];
}

export async function createAnnouncement(
  announcement: Omit<Announcement, 'id' | 'created_at'>
): Promise<Announcement | null> {
  const { data } = await supabase.from('ms_announcements').insert(announcement).select().single();
  return data as Announcement | null;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await supabase.from('ms_announcements').delete().eq('id', id);
}

export function subscribeAnnouncements(callback: (items: Announcement[]) => void) {
  getAnnouncements().then(callback);
  const channel = supabase
    .channel('announcements-all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ms_announcements' }, () => {
      getAnnouncements().then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// LEAVE REQUESTS
// ═══════════════════════════════════════════════════════════════

export async function getLeaveRequests(teacherId: string): Promise<LeaveRequest[]> {
  const { data, error } = await supabase
    .from('ms_leave_requests')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });
  if (error) console.warn('getLeaveRequests error:', error.message);
  return (data ?? []) as LeaveRequest[];
}

export async function getAllLeaveRequests(): Promise<LeaveRequest[]> {
  const { data, error } = await supabase
    .from('ms_leave_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) console.warn('getAllLeaveRequests error:', error.message);
  return (data ?? []) as LeaveRequest[];
}

export async function createLeaveRequest(
  request: Omit<LeaveRequest, 'id' | 'created_at' | 'approved_by' | 'status'>
): Promise<LeaveRequest | null> {
  const { data, error } = await supabase
    .from('ms_leave_requests')
    .insert({ ...request, status: 'pending', approved_by: null })
    .select()
    .single();
  if (error) throw error;
  return data as LeaveRequest | null;
}

export async function updateLeaveStatus(
  id: string,
  status: 'approved' | 'rejected',
  approvedBy: string
): Promise<void> {
  await supabase
    .from('ms_leave_requests')
    .update({ status, approved_by: approvedBy })
    .eq('id', id);
}

export function subscribeLeaveRequests(
  teacherId: string | null,
  callback: (items: LeaveRequest[]) => void
) {
  const fetch = teacherId ? () => getLeaveRequests(teacherId) : getAllLeaveRequests;
  fetch().then(callback);

  const filter = teacherId ? `teacher_id=eq.${teacherId}` : undefined;
  const channel = supabase
    .channel(`leave-${teacherId ?? 'all'}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ms_leave_requests', ...(filter ? { filter } : {}) },
      () => fetch().then(callback)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// LESSON PLANS
// ═══════════════════════════════════════════════════════════════

export async function getLessonPlans(teacherId: string): Promise<LessonPlan[]> {
  const { data } = await supabase
    .from('ms_lesson_plans')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('uploaded_at', { ascending: false });
  return (data ?? []) as LessonPlan[];
}

export async function createLessonPlan(
  plan: Omit<LessonPlan, 'id' | 'uploaded_at'>
): Promise<LessonPlan | null> {
  const { data } = await supabase.from('ms_lesson_plans').insert(plan).select().single();
  return data as LessonPlan | null;
}

export async function deleteLessonPlan(id: string): Promise<void> {
  await supabase.from('ms_lesson_plans').delete().eq('id', id);
}

export async function uploadFile(bucket: string, path: string, file: Blob): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ═══════════════════════════════════════════════════════════════
// HOMEWORK
// ═══════════════════════════════════════════════════════════════

export async function getHomework(teacherId: string): Promise<Homework[]> {
  const { data } = await supabase
    .from('ms_homework')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });
  return (data ?? []) as Homework[];
}

export async function createHomework(
  homework: Omit<Homework, 'id' | 'created_at'>
): Promise<Homework | null> {
  const { data } = await supabase.from('ms_homework').insert(homework).select().single();
  return data as Homework | null;
}

export async function deleteHomework(id: string): Promise<void> {
  await supabase.from('ms_homework').delete().eq('id', id);
}

export function subscribeHomework(
  teacherId: string,
  callback: (items: Homework[]) => void
) {
  getHomework(teacherId).then(callback);

  const channel = supabase
    .channel(`homework-${teacherId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ms_homework', filter: `teacher_id=eq.${teacherId}` },
      () => {
        getHomework(teacherId).then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function getHomeworkByClass(classId: string): Promise<Homework[]> {
  const { data } = await supabase
    .from('ms_homework')
    .select('*')
    .eq('class_id', classId)
    .order('created_at', { ascending: false });
  return (data ?? []) as Homework[];
}

export async function getAllHomework(): Promise<Homework[]> {
  const { data } = await supabase
    .from('ms_homework')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as Homework[];
}

export function subscribeAllHomework(callback: (items: Homework[]) => void) {
  getAllHomework().then(callback);

  const channel = supabase
    .channel('homework-all')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ms_homework' },
      () => {
        getAllHomework().then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// DATESHEET / EXAMS
// ═══════════════════════════════════════════════════════════════

export async function getExams(schoolId: string): Promise<ExamEntry[]> {
  const { data } = await supabase
    .from('ms_exams')
    .select('*')
    .order('exam_date', { ascending: true });
  return (data ?? []) as ExamEntry[];
}

export async function createExam(exam: Omit<ExamEntry, 'id'>): Promise<ExamEntry | null> {
  const { data } = await supabase.from('ms_exams').insert(exam).select().single();
  return data as ExamEntry | null;
}

// ═══════════════════════════════════════════════════════════════
// CALENDAR EVENTS
// ═══════════════════════════════════════════════════════════════

export async function getCalendarEvents(schoolId: string): Promise<CalendarEvent[]> {
  const { data } = await supabase
    .from('ms_calendar_events')
    .select('*')
    .order('date', { ascending: true });
  return (data ?? []) as CalendarEvent[];
}

export async function createCalendarEvent(
  event: Omit<CalendarEvent, 'id' | 'created_at'>
): Promise<CalendarEvent | null> {
  const { data } = await supabase.from('ms_calendar_events').insert(event).select().single();
  return data as CalendarEvent | null;
}

export function subscribeCalendarEvents(callback: (events: CalendarEvent[]) => void) {
  getCalendarEvents('').then(callback);
  const channel = supabase
    .channel('calendar-all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ms_calendar_events' }, () => {
      getCalendarEvents('').then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// FEE STRUCTURE
// ═══════════════════════════════════════════════════════════════

export async function getFeeStructures(classId?: string): Promise<FeeStructure[]> {
  let query = supabase.from('ms_fee_structure').select('*').order('fee_type');
  if (classId) query = query.eq('class_id', classId);
  const { data } = await query;
  return (data ?? []) as FeeStructure[];
}

export async function createFeeStructure(
  fee: Omit<FeeStructure, 'id' | 'created_at'>
): Promise<FeeStructure | null> {
  const { data } = await supabase.from('ms_fee_structure').insert(fee).select().single();
  return data as FeeStructure | null;
}

export async function updateFeeStructure(
  id: string,
  updates: Partial<FeeStructure>
): Promise<FeeStructure | null> {
  const { data } = await supabase
    .from('ms_fee_structure')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data as FeeStructure | null;
}

export async function deleteFeeStructure(id: string): Promise<void> {
  await supabase.from('ms_fee_structure').delete().eq('id', id);
}

// ═══════════════════════════════════════════════════════════════
// FEE PAYMENTS
// ═══════════════════════════════════════════════════════════════

export async function getFeePayments(studentId?: string): Promise<FeePayment[]> {
  let query = supabase.from('ms_fee_payments').select('*').order('payment_date', { ascending: false });
  if (studentId) query = query.eq('student_id', studentId);
  const { data } = await query;
  return (data ?? []) as FeePayment[];
}

export async function createFeePayment(
  payment: Omit<FeePayment, 'id' | 'created_at'>
): Promise<FeePayment | null> {
  const { data } = await supabase.from('ms_fee_payments').insert(payment).select().single();
  return data as FeePayment | null;
}

export async function updateFeePayment(
  id: string,
  updates: Partial<FeePayment>
): Promise<FeePayment | null> {
  const { data } = await supabase
    .from('ms_fee_payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data as FeePayment | null;
}

export function subscribeFeePayments(
  studentId: string | null,
  callback: (items: FeePayment[]) => void
) {
  const fetch = studentId ? () => getFeePayments(studentId) : () => getFeePayments();
  fetch().then(callback);

  const filter = studentId ? `student_id=eq.${studentId}` : undefined;
  const channel = supabase
    .channel(`fees-${studentId ?? 'all'}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ms_fee_payments', ...(filter ? { filter } : {}) },
      () => fetch().then(callback)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// STUDENT MARKS / RESULTS
// ═══════════════════════════════════════════════════════════════

export async function getMarksByStudent(studentId: string): Promise<StudentMark[]> {
  const { data } = await supabase
    .from('ms_marks')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  return (data ?? []) as StudentMark[];
}

export async function getMarksByExam(examId: string): Promise<StudentMark[]> {
  const { data } = await supabase
    .from('ms_marks')
    .select('*')
    .eq('exam_id', examId)
    .order('subject');
  return (data ?? []) as StudentMark[];
}

export async function upsertMarks(
  marks: Omit<StudentMark, 'id' | 'created_at'>[]
): Promise<void> {
  const { error } = await supabase.from('ms_marks').upsert(marks, {
    onConflict: 'student_id,exam_id,subject',
  });
  if (error) throw error;
}

export async function deleteMarks(id: string): Promise<void> {
  await supabase.from('ms_marks').delete().eq('id', id);
}

export function subscribeMarks(
  studentId: string,
  callback: (items: StudentMark[]) => void
) {
  getMarksByStudent(studentId).then(callback);

  const channel = supabase
    .channel(`marks-${studentId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ms_marks', filter: `student_id=eq.${studentId}` },
      () => getMarksByStudent(studentId).then(callback)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ═══════════════════════════════════════════════════════════════
// STUDENT DOCUMENTS
// ═══════════════════════════════════════════════════════════════

export async function getStudentDocuments(studentId: string): Promise<StudentDocument[]> {
  const { data } = await supabase
    .from('ms_student_documents')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  return (data ?? []) as StudentDocument[];
}

export async function createStudentDocument(
  doc: Omit<StudentDocument, 'id' | 'created_at'>
): Promise<StudentDocument | null> {
  const { data } = await supabase.from('ms_student_documents').insert(doc).select().single();
  return data as StudentDocument | null;
}

export async function deleteStudentDocument(id: string): Promise<void> {
  await supabase.from('ms_student_documents').delete().eq('id', id);
}

export async function uploadStudentDocument(
  studentId: string,
  fileName: string,
  file: Blob
): Promise<string> {
  const path = `students/${studentId}/${Date.now()}_${fileName}`;
  const { error } = await supabase.storage.from('student-documents').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('student-documents').getPublicUrl(path);
  return data.publicUrl;
}

// ═══════════════════════════════════════════════════════════════
// SHARED USERS (For Admin/Parent/Staff Directories)
// ═══════════════════════════════════════════════════════════════

export async function getAllTeachers(schoolId: string = ''): Promise<AppUser[]> {
  let query = supabase.from('users').select('*').eq('role', 'teacher').order('name');
  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }
  const { data } = await query;
  return (data ?? []) as AppUser[];
}

export async function getAllStudents(schoolId: string = ''): Promise<any[]> {
  // Fetch all students with their class info
  let query = supabase
    .from('class_students')
    .select('*, classes!inner(name, grade, section, school_id)')
    .order('name');
    
  if (schoolId) {
    query = query.eq('classes.school_id', schoolId);
  }
  
  const { data } = await query;
  return (data ?? []) as any[];
}
