import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

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
  const [unreadCount, setUnreadCount] = useState(3); // default matches demo data
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'read' | 'time' | 'timeLabel'>) => {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const timeStr = `${h}:${mins.toString().padStart(2, '0')} ${ampm}`;

    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      time: timeStr,
      timeLabel: 'today',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

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
