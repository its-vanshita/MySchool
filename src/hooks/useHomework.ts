import { useState, useEffect } from 'react';
import {
  subscribeHomework,
  subscribeAllHomework,
  createHomework,
  deleteHomework,
} from '../services/supabaseService';
import type { Homework } from '../types';

/**
 * For teachers: pass teacherId to see their own homework.
 * For parents/all: pass no teacherId but set viewAll=true to see all homework.
 */
export function useHomework(teacherId?: string, viewAll?: boolean) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip Supabase calls in demo mode
    if (teacherId?.startsWith('demo-') || (!teacherId && !viewAll)) {
      setLoading(false);
      return;
    }
    if (viewAll) {
      const unsub = subscribeAllHomework((data) => {
        setHomework(data);
        setLoading(false);
      });
      return unsub;
    }
    if (!teacherId) {
      setLoading(false);
      return;
    }
    const unsub = subscribeHomework(teacherId, (data) => {
      setHomework(data);
      setLoading(false);
    });
    return unsub;
  }, [teacherId, viewAll]);

  const addHomework = async (hw: Omit<Homework, 'id' | 'created_at'>) => {
    return createHomework(hw);
  };

  const removeHomework = async (id: string) => {
    await deleteHomework(id);
  };

  return { homework, loading, addHomework, removeHomework };
}
