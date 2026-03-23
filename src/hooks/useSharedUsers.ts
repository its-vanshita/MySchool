import { useState, useEffect } from 'react';

export interface UserItem {
  id: string;
  name: string;
  roleOrClass: string;
  status: 'present' | 'absent';
  avatar: string;
}

let sharedTeachers: UserItem[] = [
  { id: 't1', name: 'Sarah Jenkins', roleOrClass: 'Mathematics', status: 'present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 't2', name: 'Aman Patel', roleOrClass: 'Science', status: 'present', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
  { id: 't3', name: 'Rohit Sharma', roleOrClass: 'English', status: 'absent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 't4', name: 'Nisha Gupta', roleOrClass: 'Social Studies', status: 'present', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { id: 't5', name: 'David Smith', roleOrClass: 'Physical Education', status: 'absent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { id: 't6', name: 'Priya Kumar', roleOrClass: 'Computer Science', status: 'present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
];

let sharedStudents: UserItem[] = [
  { id: 's1', name: 'Arjun Sharma', roleOrClass: 'Class 10A', status: 'present', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 's2', name: 'Diya Kapoor', roleOrClass: 'Class 10A', status: 'present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 's3', name: 'Rohan Mehta', roleOrClass: 'Class 9C', status: 'absent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { id: 's4', name: 'Priya Singh', roleOrClass: 'Class 10A', status: 'present', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id: 's5', name: 'Kavya Joshi', roleOrClass: 'Class 9C', status: 'present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { id: 's6', name: 'Rahul Nair', roleOrClass: 'Class 8B', status: 'absent', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
  { id: 's7', name: 'Aditya Patel', roleOrClass: 'Class 12B', status: 'present', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
];

let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach(fn => fn());
}

export function useSharedUsers() {
  const [teachers, setTeachers] = useState<UserItem[]>(sharedTeachers);
  const [students, setStudents] = useState<UserItem[]>(sharedStudents);

  useEffect(() => {
    const fn = () => {
      setTeachers([...sharedTeachers]);
      setStudents([...sharedStudents]);
    };
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(f => f !== fn);
    };
  }, []);

  const addUser = (type: 'student' | 'teacher', name: string, roleOrClass: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newUser: UserItem = {
      id,
      name,
      roleOrClass,
      status: 'present',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', // default fallback avatar
    };

    if (type === 'teacher') {
      sharedTeachers = [newUser, ...sharedTeachers];
    } else {
      sharedStudents = [newUser, ...sharedStudents];
    }
    notify();
  };

  const removeUser = (type: 'student' | 'teacher', id: string) => {
    if (type === 'teacher') {
      sharedTeachers = sharedTeachers.filter(t => t.id !== id);
    } else {
      sharedStudents = sharedStudents.filter(s => s.id !== id);
    }
    notify();
  };

  return {
    teachers,
    students,
    addUser,
    removeUser,
  };
}
