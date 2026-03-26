import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useUser } from '../context/UserContext';

export function useClassSubjects(className: string) {
  const { profile } = useUser();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      if (!profile?.school_id || !className) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Find all subjects taught in timetable for this class
        const { data, error } = await supabase
          .from('timetable')
          .select('subject')
          .eq('school_id', profile.school_id)
          .eq('class_name', className);
        
        if (!error && data) {
          const uniqueSubjects = Array.from(new Set(data.map(d => d.subject)));
          // Fallbacks for demo if empty
          if (uniqueSubjects.length === 0) {
            setSubjects(['Mathematics', 'English', 'Science']);
          } else {
             setSubjects(uniqueSubjects);
          }
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, [profile?.school_id, className]);

  return { subjects, loading };
}
