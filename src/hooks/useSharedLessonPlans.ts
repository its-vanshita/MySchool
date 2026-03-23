import { useState, useEffect } from 'react';

export interface TopicItem {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'not-started';
  completedDate?: string;
  nextDate?: string;
}

export interface UnitItem {
  id: string;
  number: number;
  name: string;
  topics: TopicItem[];
}

export interface SubjectClassUnits {
  teacherId: string;
  subject: string;
  className: string;
  units: UnitItem[];
}

// Global in-memory store
let sharedLessonPlans: SubjectClassUnits[] = [
  {
    teacherId: 'demo-teacher',
    subject: 'Mathematics',
    className: 'Class 10A',
    units: [
      {
        id: 'u1', number: 1, name: 'Algebra',
        topics: [
          { id: 't1', name: 'Introduction to Algebra', status: 'completed', completedDate: 'Sep 10, 2025' },
          { id: 't2', name: 'Linear Equations', status: 'completed', completedDate: 'Sep 18, 2025' },
          { id: 't3', name: 'Quadratic Equations', status: 'completed', completedDate: 'Sep 28, 2025' },
          { id: 't4', name: 'Polynomials', status: 'completed', completedDate: 'Oct 5, 2025' },
        ],
      },
      {
        id: 'u2', number: 2, name: 'Geometry',
        topics: [
          { id: 't5', name: 'Introduction to Geometry', status: 'completed', completedDate: 'Oct 12, 2025' },
          { id: 't6', name: 'Lines and Angles', status: 'completed', completedDate: 'Oct 15, 2025' },
          { id: 't7', name: 'Triangles & Congruence', status: 'in-progress', nextDate: 'Mar 20' },
          { id: 't8', name: 'Quadrilaterals', status: 'not-started' },
          { id: 't9', name: 'Circles', status: 'not-started' },
        ],
      },
    ],
  },
  {
    teacherId: 'demo-teacher',
    subject: 'Science',
    className: 'Class 9C',
    units: [
      {
        id: 'su1', number: 1, name: 'Matter in Our Surroundings',
        topics: [
          { id: 'st1', name: 'States of Matter', status: 'completed', completedDate: 'Sep 15, 2025' },
          { id: 'st2', name: 'Change of State', status: 'completed', completedDate: 'Sep 22, 2025' },
          { id: 'st3', name: 'Evaporation', status: 'completed', completedDate: 'Oct 1, 2025' },
        ],
      },
      {
        id: 'su2', number: 2, name: 'Is Matter Around Us Pure',
        topics: [
          { id: 'st4', name: 'Mixtures & Solutions', status: 'completed', completedDate: 'Oct 10, 2025' },
          { id: 'st5', name: 'Separation Techniques', status: 'in-progress', nextDate: 'Mar 18' },
          { id: 'st6', name: 'Physical & Chemical Changes', status: 'not-started' },
        ],
      },
    ],
  },
  {
    teacherId: 'demo-teacher',
    subject: 'English',
    className: 'Class 10A',
    units: [
      {
        id: 'eu1', number: 1, name: 'Prose',
        topics: [
          { id: 'et1', name: 'A Letter to God', status: 'completed', completedDate: 'Sep 8, 2025' },
          { id: 'et2', name: 'Nelson Mandela', status: 'completed', completedDate: 'Sep 20, 2025' },
          { id: 'et3', name: 'Two Stories about Flying', status: 'in-progress', nextDate: 'Mar 15' },
          { id: 'et4', name: 'From the Diary of Anne Frank', status: 'not-started' },
        ],
      },
    ],
  },
];

let listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function markTopicCompleted(teacherId: string, subject: string, className: string, unitId: string, topicId: string) {
  sharedLessonPlans = sharedLessonPlans.map(plan => {
    if (plan.teacherId === teacherId && plan.subject === subject && plan.className === className) {
      return {
        ...plan,
        units: plan.units.map(u => {
          if (u.id === unitId) {
            return {
              ...u,
              topics: u.topics.map(t => {
                if (t.id === topicId) {
                  return { ...t, status: 'completed', completedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
                }
                return t;
              })
            };
          }
          return u;
        })
      };
    }
    return plan;
  });
  notifyListeners();
}

export function useSharedLessonPlans() {
  const [plans, setPlans] = useState<SubjectClassUnits[]>(sharedLessonPlans);

  useEffect(() => {
    const update = () => setPlans([...sharedLessonPlans]);
    listeners.push(update);
    update();
    return () => {
      listeners = listeners.filter((fn) => fn !== update);
    };
  }, []);

  return {
    plans,
    markTopicCompleted,
  };
}
