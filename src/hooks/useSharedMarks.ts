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
  classKey: string; // e.g. "Mathematics|Class 10A"
  examId: string;
  students: StudentMark[];
  submitted: boolean; // Once true, teacher can no longer edit
  uploadDeadline?: number | null; // Timestamp (ms) when the portal locks automatically
}

export const DEMO_EXAMS: ExamOption[] = [
  { id: 'e1', label: 'Mid-Term Examination 2025' },
  { id: 'e2', label: 'Unit Test 3 - 2025' },
  { id: 'e3', label: 'Pre-Board Examination 2026' },
  { id: 'e4', label: 'Final Examination 2026' },
];

const INIT_STUDENTS: Record<string, StudentMark[]> = {
  'Mathematics|Class 10A': [
    { id: 's1', name: 'Arjun Sharma', rollNumber: '20230101', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', marks: '85', maxMarks: 100, status: 'entered' },
    { id: 's2', name: 'Diya Kapoor', rollNumber: '20230102', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', marks: '92', maxMarks: 100, status: 'entered' },
    { id: 's3', name: 'Rohan Mehta', rollNumber: '20230103', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's4', name: 'Priya Singh', rollNumber: '20230104', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's5', name: 'Aditya Patel', rollNumber: '20230105', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
  ],
  'Science|Class 9C': [
    { id: 's6', name: 'Kavya Joshi', rollNumber: '20230201', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', marks: '78', maxMarks: 100, status: 'entered' },
    { id: 's7', name: 'Rahul Nair', rollNumber: '20230202', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's8', name: 'Ananya Gupta', rollNumber: '20230203', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
  ],
  'English|Class 10A': [
    { id: 's9', name: 'Arjun Sharma', rollNumber: '20230101', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's10', name: 'Diya Kapoor', rollNumber: '20230102', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
    { id: 's11', name: 'Rohan Mehta', rollNumber: '20230103', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', marks: '', maxMarks: 100, status: 'pending' },
  ],
};

let sharedStore: ClassMarksStore[] = [];

// Initialize first exam with dummy data
// Pretend the deadline is currently active (e.g. 24 hours from now) for most cases
Object.keys(INIT_STUDENTS).forEach(key => {
  const isDemoSubmitted = key === 'Mathematics|Class 10A';
  sharedStore.push({
    classKey: key,
    examId: DEMO_EXAMS[0].id,
    students: JSON.parse(JSON.stringify(INIT_STUDENTS[key])),
    submitted: isDemoSubmitted,
    uploadDeadline: Date.now() + 24 * 60 * 60 * 1000, 
  });
});

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
      const baseStudents = INIT_STUDENTS[classKey] 
        ? JSON.parse(JSON.stringify(INIT_STUDENTS[classKey])).map((s: any) => ({ ...s, marks: '', status: 'pending' }))
        : [];
      const newEntry: ClassMarksStore = {
        classKey,
        examId,
        students: baseStudents,
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
      // Don't modify if already submitted (unless you're an admin calling adminUpdateMarks)
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
