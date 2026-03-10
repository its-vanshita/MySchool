import { useState, useEffect, useMemo } from 'react';
import { getExams, createExam } from '../services/supabaseService';
import type { ExamEntry, ExamDuty, ExamGroup, ExamType } from '../types';

const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  'half-yearly': 'Half Yearly Examination',
  'annual': 'Annual Examination',
  'unit-test': 'Unit Test',
  'pre-board': 'Pre-Board Examination',
  'practical': 'Practical Examination',
  'other': 'Examination',
};

// ── Demo datesheet ──
const DEMO_EXAMS: ExamEntry[] = [
  // Half Yearly — Class 10-A
  { id: 'e1', class_name: 'Class 10-A', subject: 'Mathematics', exam_date: '2026-03-16', start_time: '09:00', end_time: '12:00', room: 'Room 302', school_id: 'demo-school', exam_type: 'half-yearly' },
  { id: 'e2', class_name: 'Class 10-A', subject: 'Science', exam_date: '2026-03-18', start_time: '09:00', end_time: '12:00', room: 'Science Lab 1', school_id: 'demo-school', exam_type: 'half-yearly' },
  { id: 'e3', class_name: 'Class 10-A', subject: 'English', exam_date: '2026-03-20', start_time: '09:00', end_time: '12:00', room: 'Room 302', school_id: 'demo-school', exam_type: 'half-yearly' },
  { id: 'e4', class_name: 'Class 10-A', subject: 'Hindi', exam_date: '2026-03-23', start_time: '09:00', end_time: '11:00', room: 'Room 302', school_id: 'demo-school', exam_type: 'half-yearly' },
  { id: 'e5', class_name: 'Class 10-A', subject: 'Social Studies', exam_date: '2026-03-25', start_time: '09:00', end_time: '12:00', room: 'Room 204', school_id: 'demo-school', exam_type: 'half-yearly' },
  // Half Yearly — Class 9-C
  { id: 'e6', class_name: 'Class 9-C', subject: 'Mathematics', exam_date: '2026-03-16', start_time: '09:00', end_time: '12:00', room: 'Room 108', school_id: 'demo-school', exam_type: 'half-yearly' },
  { id: 'e7', class_name: 'Class 9-C', subject: 'Science', exam_date: '2026-03-18', start_time: '09:00', end_time: '12:00', room: 'Science Lab 2', school_id: 'demo-school', exam_type: 'half-yearly' },
  { id: 'e8', class_name: 'Class 9-C', subject: 'English', exam_date: '2026-03-20', start_time: '09:00', end_time: '12:00', room: 'Room 108', school_id: 'demo-school', exam_type: 'half-yearly' },
  // Unit Test — Class 10-A
  { id: 'e9', class_name: 'Class 10-A', subject: 'Mathematics', exam_date: '2026-04-06', start_time: '10:00', end_time: '11:00', room: 'Room 302', school_id: 'demo-school', exam_type: 'unit-test' },
  { id: 'e10', class_name: 'Class 10-A', subject: 'Science', exam_date: '2026-04-07', start_time: '10:00', end_time: '11:00', room: 'Room 302', school_id: 'demo-school', exam_type: 'unit-test' },
  { id: 'e11', class_name: 'Class 10-A', subject: 'English', exam_date: '2026-04-08', start_time: '10:00', end_time: '11:00', room: 'Room 302', school_id: 'demo-school', exam_type: 'unit-test' },
];

const DEMO_DUTIES: ExamDuty[] = [
  { id: 'd1', teacher_id: 'demo-teacher', exam_date: '2026-03-16', room: 'Room 108', start_time: '09:00', end_time: '12:00', class_name: 'Class 9-C', exam_type: 'half-yearly', school_id: 'demo-school' },
  { id: 'd2', teacher_id: 'demo-teacher', exam_date: '2026-03-20', room: 'Room 204', start_time: '09:00', end_time: '12:00', class_name: 'Class 12-B', exam_type: 'half-yearly', school_id: 'demo-school' },
  { id: 'd3', teacher_id: 'demo-teacher', exam_date: '2026-03-25', room: 'Room 302', start_time: '09:00', end_time: '12:00', class_name: 'Class 10-A', exam_type: 'half-yearly', school_id: 'demo-school' },
  { id: 'd4', teacher_id: 'demo-teacher', exam_date: '2026-04-06', room: 'Room 302', start_time: '10:00', end_time: '11:00', class_name: 'Class 10-A', exam_type: 'unit-test', school_id: 'demo-school' },
];

export function useDatesheet(schoolId: string | undefined, isDemo?: boolean) {
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [duties, setDuties] = useState<ExamDuty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    if (isDemo) {
      setExams(DEMO_EXAMS);
      setDuties(DEMO_DUTIES);
    } else {
      const data = await getExams(schoolId ?? '');
      setExams(data);
      setDuties([]); // Real duties would come from supabase
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [schoolId, isDemo]);

  /** Group exams by exam_type */
  const examGroups: ExamGroup[] = useMemo(() => {
    const groups: Record<string, { entries: ExamEntry[]; duties: ExamDuty[] }> = {};

    exams.forEach((exam) => {
      const key = exam.exam_type ?? 'other';
      if (!groups[key]) groups[key] = { entries: [], duties: [] };
      groups[key].entries.push(exam);
    });

    duties.forEach((duty) => {
      const key = duty.exam_type ?? 'other';
      if (!groups[key]) groups[key] = { entries: [], duties: [] };
      groups[key].duties.push(duty);
    });

    return Object.entries(groups).map(([type, { entries, duties: d }]) => {
      const allDates = entries.map((e) => e.exam_date).sort();
      const classes = [...new Set(entries.map((e) => e.class_name))];
      return {
        exam_type: type as ExamType,
        label: EXAM_TYPE_LABELS[type as ExamType] ?? 'Examination',
        classes,
        startDate: allDates[0] ?? '',
        endDate: allDates[allDates.length - 1] ?? '',
        totalSubjects: new Set(entries.map((e) => e.subject)).size,
        entries,
        duties: d,
      };
    });
  }, [exams, duties]);

  const addExam = async (exam: Omit<ExamEntry, 'id'>) => {
    const result = await createExam(exam);
    await fetchData();
    return result;
  };

  return { exams, duties, examGroups, loading, addExam, refresh: fetchData };
}
