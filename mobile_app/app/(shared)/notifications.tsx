import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useNotificationBadge } from '../../src/context/NotificationContext';
import { useUser } from '../../src/context/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Premium Theme Variables
const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const SUCCESS_GREEN = '#10B981';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timeLabel: string; // 'today' | 'yesterday' | 'older'
  type: 'announcement' | 'attendance' | 'leave' | 'homework' | 'message' | 'notice' | 'urgent' | 'general';
  read: boolean;
}

const ICON_MAP: Record<Notification['type'], { name: keyof typeof Ionicons.glyphMap }> = {
  leave: { name: 'document-text-outline' },
  homework: { name: 'book-outline' },
  message: { name: 'chatbubble-outline' },
  notice: { name: 'megaphone-outline' },
  urgent: { name: 'alert-circle-outline' },
  announcement: { name: 'megaphone-outline' },
  attendance: { name: 'checkmark-circle-outline' },
  general: { name: 'notifications-outline' },
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

  // Clean title
  let cleanTitle = item.title;
  if (cleanTitle.startsWith('New Announcement: ')) {
    cleanTitle = cleanTitle.replace('New Announcement: ', '');
  } else if (cleanTitle.startsWith('New Announcement:')) {
    cleanTitle = cleanTitle.replace('New Announcement:', '');
  }

  const isLeaveApproved = cleanTitle.toLowerCase() === 'leave approved';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {isLeaveApproved && <View style={styles.cardAccentLine} />}
      <View style={styles.cardInner}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon.name} size={24} color={BRAND_NAVY} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {cleanTitle}
            </Text>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
          <Text style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
        {!item.read && (
          <View style={styles.unreadContainer}>
             <View style={styles.unreadDot} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

interface NotifSection {
  title: string;
  data: Notification[];
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      <Stack.Screen 
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: BRAND_NAVY },
          headerTintColor: PURE_WHITE,
          headerTitle: 'Notifications',
          headerTitleStyle: { 
             fontWeight: '700', 
             fontSize: 20, 
             fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          },
          headerLeft: () => (
             <TouchableOpacity style={{ marginLeft: 8, padding: 8 }} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={PURE_WHITE} />
             </TouchableOpacity>
          )
        }} 
      />

      {/* Top Utility Bar */}
      <View style={styles.topUtilityBar}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{unreadCount} NEW</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notification Feed */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={() => markAsRead(item.id)} />
        )}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  topUtilityBar: {
    backgroundColor: PURE_WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 10,
  },
  badgeContainer: {
    backgroundColor: BRAND_NAVY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: PURE_WHITE,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  markAllText: {
    color: BRAND_NAVY,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  feedContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: SLATE_GREY,
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  card: {
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  cardAccentLine: {
    width: 4,
    backgroundColor: SUCCESS_GREEN,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_TEXT,
    flex: 1,
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.2,
  },
  cardTime: {
    fontSize: 12,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  cardMessage: {
    fontSize: 14,
    color: SLATE_GREY,
    lineHeight: 20,
    fontWeight: '400',
  },
  unreadContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_NAVY,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});
