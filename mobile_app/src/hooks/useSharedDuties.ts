import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { Alert } from 'react-native';

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

export function useSharedDuties(teacherId?: string) {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDuties = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ms_exam_duties')
        .select(`
          id,
          teacher_id,
          exam_date,
          start_time,
          end_time,
          room,
          created_at,
          users ( name ),
          ms_exams ( subject, class_name )
        `)
        .order('exam_date', { ascending: true });

      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('DB Error:', error);
        return;
      }

      const mapped: Duty[] = (data || []).map((d: any) => {
        const teacherName = d.users?.name || 'Unknown Staff';
        const examSubject = d.ms_exams?.subject || 'Duty';
        const examClass = d.ms_exams?.class_name || '';
        const act = `${examSubject} ${examClass}`.trim();

        return {
          id: d.id,
          teacher_id: d.teacher_id,
          teacher_name: teacherName,
          activity: act || 'Invigilation',
          date: new Date(d.exam_date).toLocaleDateString(),
          time: `${d.start_time} - ${d.end_time}`,
          room: d.room || 'TBD',
          created_at: new Date(d.created_at).getTime(),
        };
      });
      
      setDuties(mapped);
    } catch (err) {
      console.error('Fetch duties error:', err);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchDuties();
  }, [fetchDuties]);

  const addDuty = async (duty: any) => {
    Alert.alert('Action Required', 'Adding duties requires Admin Dashboard access.');
    return null;
  };

  const removeDuty = async (id: string) => {
    Alert.alert('Action Required', 'Deleting duties requires Admin Dashboard access.');
  };

  return {
    duties,
    addDuty,
    removeDuty,
    loading,
    refresh: fetchDuties
  };
}
