import { useState, useEffect } from 'react';
import { subscribeNotices, createNotice, deleteNotice } from '../services/supabaseService';
import type { Notice } from '../types';

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeNotices((data) => {
      setNotices(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const addNotice = async (notice: Omit<Notice, 'id' | 'created_at'>) => {
    return createNotice(notice);
  };

  const removeNotice = async (id: string) => {
    await deleteNotice(id);
  };

  return { notices, loading, addNotice, removeNotice };
}
