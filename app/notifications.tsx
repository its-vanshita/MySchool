import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../src/theme/spacing';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'announcement' | 'attendance' | 'leave' | 'notice' | 'general';
  read: boolean;
}

const ICON_MAP: Record<Notification['type'], { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  announcement: { name: 'megaphone', color: colors.info, bg: colors.infoLight },
  attendance: { name: 'checkmark-circle', color: colors.success, bg: colors.successLight },
  leave: { name: 'airplane', color: colors.purple, bg: colors.purpleLight },
  notice: { name: 'document-text', color: colors.warning, bg: colors.warningLight },
  general: { name: 'notifications', color: colors.primary, bg: colors.primaryLight },
};

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Staff Meeting Tomorrow',
    message: 'All teachers are requested to attend the staff meeting at 10:00 AM in the conference hall.',
    time: '10 min ago',
    type: 'announcement',
    read: false,
  },
  {
    id: '2',
    title: 'Attendance Reminder',
    message: 'You have not marked attendance for Class 10A today. Please mark it before 11:00 AM.',
    time: '30 min ago',
    type: 'attendance',
    read: false,
  },
  {
    id: '3',
    title: 'Leave Approved',
    message: 'Your leave request for Mar 15 - Mar 16 has been approved by the Principal.',
    time: '2 hours ago',
    type: 'leave',
    read: true,
  },
  {
    id: '4',
    title: 'New Notice Published',
    message: 'A new notice regarding annual sports day has been published for Class 9C and Class 10A.',
    time: '3 hours ago',
    type: 'notice',
    read: true,
  },
  {
    id: '5',
    title: 'Timetable Updated',
    message: 'Your timetable for next week has been updated. Please check the schedule section.',
    time: 'Yesterday',
    type: 'general',
    read: true,
  },
  {
    id: '6',
    title: 'Parent-Teacher Meeting',
    message: 'PTM scheduled for March 20. Please prepare progress reports for your classes.',
    time: 'Yesterday',
    type: 'announcement',
    read: true,
  },
  {
    id: '7',
    title: 'Lesson Plan Due',
    message: 'Reminder: Please upload your lesson plan for Science - Class 9C by end of this week.',
    time: '2 days ago',
    type: 'general',
    read: true,
  },
];

function NotificationItem({ item }: { item: Notification }) {
  const icon = ICON_MAP[item.type];

  return (
    <TouchableOpacity style={[styles.card, !item.read && styles.cardUnread]}>
      <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const unreadCount = DUMMY_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={DUMMY_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  markAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardUnread: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary + '30',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  cardTitleUnread: {
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  cardMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 6,
  },
  cardTime: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
});
