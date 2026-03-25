import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useUser } from './UserContext';
import { subscribeNotices, subscribeAnnouncements } from '../services/supabaseService';
import type { Notice, Announcement } from '../types';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'leave' | 'announcement' | 'attendance' | 'homework' | 'message' | 'notice' | 'urgent' | 'general';
  read: boolean;
  time: string;
  timeLabel: 'today' | 'yesterday' | 'older';
}

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'read' | 'time' | 'timeLabel'>) => void;
}

const NotificationContext = createContext<NotificationState | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0); 
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { profile } = useUser();

  const addNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'read' | 'time' | 'timeLabel'>) => {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const timeStr = `${h}:${mins.toString().padStart(2, '0')} ${ampm}`;

    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random()}`,
      read: false,
      time: timeStr,
      timeLabel: 'today',
    };
    
    // Prevent duplicate entries
    setNotifications((prev) => {
      const isDuplicate = prev.some(p => p.title === newNotif.title && p.message === newNotif.message);
      if (isDuplicate) return prev;
      setUnreadCount((count) => count + 1);
      return [newNotif, ...prev];
    });
  }, []);

  // Listen to remote notices and announcements
  useEffect(() => {
    if (!profile) return;

    let initialLoad = true;

    const unsubNotices = subscribeNotices((data: Notice[]) => {
      if (initialLoad) return; // Skip initial bulk load to avoid spamming notifications
      
      const newNotice = data[0]; // Assuming ordered by created_at desc
      if (!newNotice) return;
      
      // Check if it's relevant
      const isForMe = 
        newNotice.target_audience === 'all' || 
        newNotice.target_audience === 'teachers' || 
        (newNotice.target_audience === 'specific_teachers' && newNotice.target_teachers?.includes(profile.id));

      if (isForMe && newNotice.created_by !== profile.id) {
        addNotification({
          title: `New Notice: ${newNotice.title}`,
          message: newNotice.message,
          type: 'notice'
        });
      }
    });

    const unsubAnnouncements = subscribeAnnouncements((data: Announcement[]) => {
      if (initialLoad) return;
      
      const newAnn = data[0];
      if (!newAnn) return;

      if (newAnn.created_by !== profile.id) {
        addNotification({
          title: `New Announcement: ${newAnn.title}`,
          message: newAnn.message,
          type: 'announcement'
        });
      }
    });

    // Mark end of initial load after a short delay
    setTimeout(() => { initialLoad = false; }, 2000);

    return () => {
      unsubNotices();
      unsubAnnouncements();
    };
  }, [profile, addNotification]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationBadge(): NotificationState {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationBadge must be used within NotificationProvider');
  return ctx;
}
