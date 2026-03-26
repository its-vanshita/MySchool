import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useUser } from '../context/UserContext';
import type { ClassInfo } from '../types';

export function useClasses() {
  const { profile } = useUser();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      if (!profile?.school_id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('school_id', profile.school_id)
          .order('grade', { ascending: true })
          .order('section', { ascending: true });
        
        if (!error && data) {
          setClasses(data as ClassInfo[]);
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, [profile?.school_id]);

  return { classes, loading };
}
