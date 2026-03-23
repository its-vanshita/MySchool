import { useState, useEffect } from 'react';

export interface UploadedDatesheet {
  id: string;
  title: string;
  target: 'teacher' | 'student' | 'both';
  imageUrl: string;
  datePosted: number;
}

let sharedUploadedDatesheets: UploadedDatesheet[] = [
  {
    id: 'ud1',
    title: 'Final Examination Datesheet (Class 10)',
    target: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6ec0798ceb4d?w=800&q=80',
    datePosted: Date.now() - 86400000,
  },
  {
    id: 'ud2',
    title: 'Invigilation Guidelines & Duty Roster',
    target: 'teacher',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-dd24c3a647d6?w=800&q=80',
    datePosted: Date.now() - 172800000,
  }
];

let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach(fn => fn());
}

export function useSharedUploadedDatesheets() {
  const [datesheets, setDatesheets] = useState<UploadedDatesheet[]>(sharedUploadedDatesheets);

  useEffect(() => {
    const fn = () => setDatesheets([...sharedUploadedDatesheets]);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(f => f !== fn);
    };
  }, []);

  const addDatesheet = (entry: Omit<UploadedDatesheet, 'id' | 'datePosted'>) => {
    const newEntry: UploadedDatesheet = {
      ...entry,
      id: `ds-${Date.now()}`,
      datePosted: Date.now(),
    };
    sharedUploadedDatesheets = [newEntry, ...sharedUploadedDatesheets];
    notify();
  };

  const removeDatesheet = (id: string) => {
    sharedUploadedDatesheets = sharedUploadedDatesheets.filter(d => d.id !== id);
    notify();
  };

  return { datesheets, addDatesheet, removeDatesheet };
}
