import { useState, useEffect } from 'react';

export interface Duty {
  id: string;
  teacher_id: string;
  teacher_name: string;
  activity: string;
  date: string;
  time: string;
  room: string;
  created_at: number;
}

let sharedDuties: Duty[] = [
  {
    id: 'd1',
    teacher_id: 't1',
    teacher_name: 'Sarah Jenkins',
    activity: 'Mid-Term Invigilation',
    date: 'Oct 15, 2025',
    time: '09:00 AM - 12:00 PM',
    room: 'Hall A',
    created_at: Date.now() - 100000,
  },
  {
    id: 'd2',
    teacher_id: 'demo-teacher',
    teacher_name: 'Demo Teacher',
    activity: 'Bus Duty',
    date: 'Oct 16, 2025',
    time: '03:00 PM - 04:00 PM',
    room: 'Main Gate',
    created_at: Date.now() - 50000,
  }
];

let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach(fn => fn());
}

export function useSharedDuties() {
  const [duties, setDuties] = useState<Duty[]>(sharedDuties);

  useEffect(() => {
    const fn = () => setDuties([...sharedDuties]);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(f => f !== fn);
    };
  }, []);

  const addDuty = (duty: Omit<Duty, 'id' | 'created_at'>) => {
    const newDuty: Duty = {
      ...duty,
      id: Math.random().toString(36).substring(2, 9),
      created_at: Date.now(),
    };
    sharedDuties = [newDuty, ...sharedDuties];
    notify();
    return newDuty;
  };

  const removeDuty = (id: string) => {
    sharedDuties = sharedDuties.filter(d => d.id !== id);
    notify();
  };

  return {
    duties,
    addDuty,
    removeDuty,
  };
}
