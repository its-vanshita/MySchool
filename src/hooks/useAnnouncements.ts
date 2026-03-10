import { useState, useEffect } from 'react';
import {
  subscribeAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../services/supabaseService';
import type { Announcement } from '../types';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAnnouncements((data) => {
      setAnnouncements(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const addAnnouncement = async (item: Omit<Announcement, 'id' | 'created_at'>) => {
    return createAnnouncement(item);
  };

  const removeAnnouncement = async (id: string) => {
    await deleteAnnouncement(id);
  };

  return { announcements, loading, addAnnouncement, removeAnnouncement };
}
