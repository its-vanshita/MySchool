import { useState, useEffect, useCallback } from 'react';
import { getAllTeachers, getAllStudents, createStudent, deleteStudent, deleteUser } from '../services/supabaseService';
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

      setTeachers(tData.map((u) => ({
        id: u.id,
        name: u.name,
        role: u.subjects?.[0] || u.role,
        status: 'present', // TODO: Integrate with staff attendance if available
        avatar: u.avatar_url || 'https://via.placeholder.com/150'
      })));

      setStudents(sData.map((s) => ({
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
    Alert.alert('Action Required', 'To add a teacher, please invite them via the Supabase Dashboard. Adding users directly requires Authentication setup.');
  };

  const removeTeacher = async (id: string) => {
    try {
      await deleteUser(id);
      refresh();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to remove teacher record. They may still exist in Auth.');
    }
  };

  const addStudent = async (data: { name: string; class: string }) => {
    try {
      const normalize = (s: string) => s.replace(/[\s-]/g, '').toLowerCase();
      const normalizedInput = normalize(data.class);
      
      const foundClass = classes.find(c => {
        const fullName = `${c.name}${c.section || ''}`;
        return normalize(fullName) === normalizedInput;
      });

      if (!foundClass) {
        Alert.alert('Error', `Class "${data.class}" not found. Please ensure exact name matches (e.g. "Class 10 A").`);
        return;
      }

      await createStudent({ name: data.name, class_id: foundClass.id });
      refresh();
      Alert.alert('Success', `Student ${data.name} added to ${foundClass.name} ${foundClass.section || ''}`);
      
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add student.');
    }
  };

  const removeStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      refresh();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to remove student.');
    }
  };

  return { teachers, students, loading, refresh, addTeacher, removeTeacher, addStudent, removeStudent };
}
