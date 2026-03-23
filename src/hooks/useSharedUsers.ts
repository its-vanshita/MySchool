import { useState, useEffect, useCallback } from 'react';
import { getAllTeachers, getAllStudents } from '../services/supabaseService';
import { Alert } from 'react-native';
import { supabase } from '../config/supabase';

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

export function useSharedUsers() {
  const [teachers, setTeachers] = useState<TeacherUser[]>([]);
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [tData, sData] = await Promise.all([
        getAllTeachers(),
        getAllStudents()
      ]);

      setTeachers(tData.map(u => ({
        id: u.id,
        name: u.name,
        role: u.subjects?.[0] || u.role,
        status: 'present', // TODO: Integrate with staff attendance if available
        avatar: u.avatar_url || 'https://via.placeholder.com/150'
      })));

      setStudents(sData.map(s => ({
        id: s.id,
        name: s.name,
        class: s.classes ? `${s.classes.name} ${s.classes.section || ''}`.trim() : 'Unassigned',
        status: 'present', // TODO: Integrate with student attendance
        avatar: s.photo_url || 'https://via.placeholder.com/150'
      })));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTeacher = async (data: { name: string; role: string }) => {
    Alert.alert('Action Required', 'To add a teacher, please invite them via the Supabase Dashboard or Admin Console. Direct creation is disabled in this version.');
  };

  const removeTeacher = async (id: string) => {
    Alert.alert('Action Required', 'To remove a teacher, please delete their account via the Supabase Dashboard.');
  };

  const addStudent = async (data: { name: string; class: string }) => {
    // Basic implementation: Find class by name, then insert
    try {
      const className = data.class.trim();
      // Try to split logic if needed, but for now exact match on name might contain section?
      // Assuming 'class' input is just class name like "10A".
      // We need to parse it.
      
      Alert.alert('Info', 'Please use the Class Management screen to add students to ensure correct class assignment.');
    } catch (err) {
      console.error(err);
    }
  };

  const removeStudent = async (id: string) => {
    try {
      const { error } = await supabase.from('class_students').delete().eq('id', id);
      if (error) throw error;
      refresh();
    } catch (err) {
      Alert.alert('Error', 'Failed to remove student.');
    }
  };

  return { teachers, students, loading, refresh, addTeacher, removeTeacher, addStudent, removeStudent };
}
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
