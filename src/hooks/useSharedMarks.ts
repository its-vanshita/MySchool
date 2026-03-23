import { useState, useEffect } from 'react';

export interface ExamOption {
  id: string;
  label: string;
}

export interface StudentMark {
  id: string;
  name: string;
  rollNumber: string;
  avatar: string;
  marks: string;
  maxMarks: number;
  status: 'entered' | 'pending';
}

export interface ClassMarksStore {
  classKey: string;
  examId: string;
  students: StudentMark[];
  submitted: boolean;
  uploadDeadline?: number | null;
}

// Configurable exams
export const DEMO_EXAMS: ExamOption[] = [
  { id: 'mid_term_2025', label: 'Mid-Term Examination 2025' },
  { id: 'final_2026', label: 'Final Examination 2026' },
];

let sharedStore: ClassMarksStore[] = [];
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach(fn => fn());
}

export function useSharedMarks() {
  const [store, setStore] = useState<ClassMarksStore[]>(sharedStore);

  useEffect(() => {
    const fn = () => setStore([...sharedStore]);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(f => f !== fn);
    };
  }, []);

  const getMarksForClassAndExam = (classKey: string, examId: string): ClassMarksStore => {
    let entry = sharedStore.find(s => s.classKey === classKey && s.examId === examId);
    if (!entry) {
      // Return empty list initially to avoid hardcoded data
      const newEntry: ClassMarksStore = {
        classKey,
        examId,
        students: [], // Empty student list until wired to API
        submitted: false,
      };
      sharedStore.push(newEntry);
      notify();
      return newEntry;
    }
    return entry;
  };

  const updateTeacherMarks = (classKey: string, examId: string, students: StudentMark[], isSubmit: boolean) => {
    const idx = sharedStore.findIndex(s => s.classKey === classKey && s.examId === examId);
    if (idx > -1) {
      if (sharedStore[idx].submitted) return;
      sharedStore[idx] = {
        ...sharedStore[idx],
        students,
        submitted: isSubmit,
      };
    } else {
      sharedStore.push({
        classKey,
        examId,
        students,
        submitted: isSubmit,
      });
    }
    notify();
  };

  const adminUpdateMarks = (classKey: string, examId: string, studentId: string, newMarks: string) => {
    const idx = sharedStore.findIndex(s => s.classKey === classKey && s.examId === examId);
    if (idx > -1) {
      const cleaned = newMarks.replace(/[^0-9]/g, '');
      const updatedStudents = sharedStore[idx].students.map((s): StudentMark => 
        s.id === studentId ? { ...s, marks: cleaned, status: cleaned.trim() ? 'entered' : 'pending' } : s
      );
      sharedStore[idx] = {
        ...sharedStore[idx],
        students: updatedStudents,
      };
      notify();
    }
  };

  const adminUnlockPortal = (classKey: string, examId: string, hours: number) => {
    const idx = sharedStore.findIndex(s => s.classKey === classKey && s.examId === examId);
    if (idx > -1) {
      sharedStore[idx] = {
        ...sharedStore[idx],
        submitted: false,
        uploadDeadline: Date.now() + hours * 60 * 60 * 1000,
      };
      notify();
    }
  };

  return {
    store,
    getMarksForClassAndExam,
    updateTeacherMarks,
    adminUpdateMarks,
    adminUnlockPortal,
  };
}
