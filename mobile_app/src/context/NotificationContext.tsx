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
    const seenNotices = new Set<string>();
    const seenAnns = new Set<string>();

    const unsubNotices = subscribeNotices((data: Notice[]) => {
      const myNotices = data.filter(n => 
        (n.target_audience === 'all' || 
         n.target_audience === 'teachers' || 
         (n.target_audience === 'specific_teachers' && n.target_teachers?.includes(profile.id))) 
        && n.created_by !== profile.id
      );

      if (initialLoad) {
        myNotices.slice(0, 5).reverse().forEach(n => {
          seenNotices.add(n.id);
          addNotification({
            title: `New Notice: ${n.title}`,
            message: n.message,
            type: 'notice'
          });
        });
        return;
      }
      
      myNotices.forEach(n => {
        if (!seenNotices.has(n.id)) {
          seenNotices.add(n.id);
          addNotification({
            title: `New Notice: ${n.title}`,
            message: n.message,
            type: 'notice'
          });
        }
      });
    });

    const unsubAnnouncements = subscribeAnnouncements((data: Announcement[]) => {
      const myAnns = data.filter(a => a.created_by !== profile.id);

      if (initialLoad) {
        myAnns.slice(0, 5).reverse().forEach(a => {
          seenAnns.add(a.id);
          addNotification({
            title: `New Announcement: ${a.title}`,
            message: a.message,
            type: 'announcement'
          });
        });
        return;
      }
      
      myAnns.forEach(a => {
        if (!seenAnns.has(a.id)) {
          seenAnns.add(a.id);
          addNotification({
            title: `New Announcement: ${a.title}`,
            message: a.message,
            type: 'announcement'
          });
        }
      });
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
