import { useState, useEffect } from 'react';

export interface BaseUser {
  id: string;
  name: string;
  status: 'present' | 'absent';
  avatar: string;
}

export interface TeacherUser extends BaseUser {
  role: string;
}

export interface StudentUser extends BaseUser {
  class: string;
}

let sharedTeachers: TeacherUser[] = [
  { id: 't1', name: 'Sarah Jenkins', role: 'Mathematics', status: 'present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 't2', name: 'Aman Patel', role: 'Science', status: 'present', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
  { id: 't3', name: 'Rohit Sharma', role: 'English', status: 'absent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 't4', name: 'Nisha Gupta', role: 'Social Studies', status: 'present', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { id: 't5', name: 'David Smith', role: 'Physical Education', status: 'absent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { id: 't6', name: 'Priya Kumar', role: 'Computer Science', status: 'present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
];

let sharedStudents: StudentUser[] = [
  { id: 's1', name: 'Arjun Sharma', class: 'Class 10A', status: 'present', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 's2', name: 'Diya Kapoor', class: 'Class 10A', status: 'present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 's3', name: 'Rohan Mehta', class: 'Class 9C', status: 'absent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { id: 's4', name: 'Priya Singh', class: 'Class 10A', status: 'present', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id: 's5', name: 'Kavya Joshi', class: 'Class 9C', status: 'present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { id: 's6', name: 'Rahul Nair', class: 'Class 8B', status: 'absent', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
  { id: 's7', name: 'Aditya Patel', class: 'Class 12B', status: 'present', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
];

let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach(fn => fn());
}

export function useSharedUsers() {
  const [teachers, setTeachers] = useState<TeacherUser[]>(sharedTeachers);
  const [students, setStudents] = useState<StudentUser[]>(sharedStudents);

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

  const addTeacher = (teacher: Omit<TeacherUser, 'id' | 'status' | 'avatar'>) => {
    const newTeacher: TeacherUser = {
      ...teacher,
      id: `t-${Date.now()}`,
      status: 'present',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&q=80' // default abstract avatar
    };
    sharedTeachers = [newTeacher, ...sharedTeachers];
    notify();
  };

  const removeTeacher = (id: string) => {
    sharedTeachers = sharedTeachers.filter(t => t.id !== id);
    notify();
  };

  const addStudent = (student: Omit<StudentUser, 'id' | 'status' | 'avatar'>) => {
    const newStudent: StudentUser = {
      ...student,
      id: `s-${Date.now()}`,
      status: 'present',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80' // default abstract avatar
    };
    sharedStudents = [newStudent, ...sharedStudents];
    notify();
  };

  const removeStudent = (id: string) => {
    sharedStudents = sharedStudents.filter(s => s.id !== id);
    notify();
  };

  return {
    teachers,
    students,
    addTeacher,
    removeTeacher,
    addStudent,
    removeStudent,
  };
}
