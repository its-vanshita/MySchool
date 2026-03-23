import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../src/theme/spacing';
import { useNotificationBadge } from '../src/context/NotificationContext';
import { useUser } from '../src/context/UserContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timeLabel: string; // 'today' | 'yesterday' | 'older'
  type: 'announcement' | 'attendance' | 'leave' | 'homework' | 'message' | 'notice' | 'urgent' | 'general';
  read: boolean;
}

const ICON_MAP: Record<Notification['type'], { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  leave: { name: 'checkmark-circle', color: '#10B981', bg: '#D1FAE5' },
  homework: { name: 'document-text', color: '#3B82F6', bg: '#DBEAFE' },
  message: { name: 'chatbubble-ellipses', color: '#3B82F6', bg: '#DBEAFE' },
  notice: { name: 'megaphone', color: '#7C3AED', bg: '#EDE9FE' },
  urgent: { name: 'alert-circle', color: '#EF4444', bg: '#FEE2E2' },
  announcement: { name: 'megaphone', color: '#3B82F6', bg: '#DBEAFE' },
  attendance: { name: 'checkmark-circle', color: '#10B981', bg: '#D1FAE5' },
  general: { name: 'notifications', color: '#6B7280', bg: '#F3F4F6' },
};

const ADMIN_NOTIFICATIONS: Notification[] = [
  {
    id: 'a1',
    title: 'Pending Leave Approvals',
    message: 'You have 3 new leave requests from teaching staff awaiting your approval.',
    time: '09:00 AM',
    timeLabel: 'today',
    type: 'leave',
    read: false,
  },
  {
    id: 'a2',
    title: 'Marks Upload Locked',
    message: 'Class 10A Science marks portal has automatically locked. 2 teacher overrides requested.',
    time: '08:15 AM',
    timeLabel: 'today',
    type: 'notice',
    read: false,
  },
  {
    id: 'a3',
    title: 'System DB Backup',
    message: 'Weekly database backup successfully completed at 02:00 AM.',
    time: '11:00 PM',
    timeLabel: 'yesterday',
    type: 'general',
    read: true,
  },
  {
    id: 'a4',
    title: 'New Teacher Onboarded',
    message: 'Aman Patel has been successfully added to the school staff directory.',
    time: '10:30 AM',
    timeLabel: 'yesterday',
    type: 'announcement',
    read: true,
  }
];

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Leave Approved',
    message: 'Your casual leave request for Oct 24th has been approved by the Principal.',
    time: '10:00 AM',
    timeLabel: 'today',
    type: 'leave',
    read: false,
  },
  {
    id: '2',
    title: 'Homework Submitted',
    message: '15 students from Class 10-B have submitted the Physics assignment "Electromagnetism".',
    time: '09:15 AM',
    timeLabel: 'today',
    type: 'homework',
    read: false,
  },
  {
    id: '3',
    title: 'New Message',
    message: 'Mr. Roberts (HOD) sent you a message regarding the upcoming science fair.',
    time: '08:00 AM',
    timeLabel: 'today',
    type: 'message',
    read: false,
  },
  {
    id: '4',
    title: 'School Notice',
    message: 'Staff meeting scheduled for tomorrow at 3:00 PM in the auditorium regarding annual day.',
    time: '4:00 PM',
    timeLabel: 'yesterday',
    type: 'notice',
    read: true,
  },
  {
    id: '5',
    title: 'Urgent: Grade Entry',
    message: 'Final deadline for entering Mid-Term grades is tomorrow, 5:00 PM. Please ensure all entries...',
    time: '11:12 AM',
    timeLabel: 'yesterday',
    type: 'urgent',
    read: true,
  },
  {
    id: '6',
    title: 'Attendance Reminder',
    message: 'You have not marked attendance for Class 10-A. Please mark it before end of day.',
    time: '9:30 AM',
    timeLabel: 'yesterday',
    type: 'attendance',
    read: true,
  },
  {
    id: '7',
    title: 'Parent-Teacher Meeting',
    message: 'PTM scheduled for March 20. Please prepare progress reports for your classes.',
    time: '3:00 PM',
    timeLabel: 'older',
    type: 'announcement',
    read: true,
  },
];

function NotificationItem({ item, onPress }: { item: Notification; onPress: () => void }) {
  const icon = ICON_MAP[item.type] ?? ICON_MAP.general;

  return (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.cardUnread]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

interface NotifSection {
  title: string;
  data: Notification[];
}

export default function NotificationsScreen() {
  const { role } = useUser();
  const { notifications: ctxNotifications, setUnreadCount } = useNotificationBadge();
  const baseDummies = role === 'admin' ? ADMIN_NOTIFICATIONS : DUMMY_NOTIFICATIONS;

  // Merge context notifications (real-time from leave status changes etc.) with dummy data
  const mergedBase: Notification[] = useMemo(() => {
    const real: Notification[] = ctxNotifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time: n.time,
      timeLabel: n.timeLabel,
      type: n.type as Notification['type'],
      read: n.read,
    }));
    return [...real, ...baseDummies];
  }, [ctxNotifications, baseDummies]);

  const [notifications, setNotifications] = useState<Notification[]>(baseDummies);

  // Keep local state in sync whenever context adds new notifications
  useEffect(() => {
    setNotifications(mergedBase);
  }, [mergedBase]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setUnreadCount(unreadCount);
  }, [unreadCount, setUnreadCount]);

  const sections: NotifSection[] = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    const order = ['today', 'yesterday', 'older'];

    notifications.forEach((n) => {
      const key = n.timeLabel;
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });

    const labelMap: Record<string, string> = {
      today: 'TODAY',
      yesterday: 'YESTERDAY',
      older: 'EARLIER',
    };

    return order
      .filter((k) => groups[k]?.length)
      .map((k) => ({ title: labelMap[k], data: groups[k] }));
  }, [notifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          {unreadCount > 0 && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>{unreadCount} NEW</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={() => markAsRead(item.id)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  markAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },

  /* List */
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },

  /* Section header */
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    paddingLeft: 2,
  },

  /* Card */
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  cardUnread: {
    backgroundColor: '#EBF2FF',
    borderColor: '#BDD4F7',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitleUnread: {
    fontWeight: '800',
    color: '#1E293B',
  },
  cardTime: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },
  cardMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    marginTop: 6,
  },
});
