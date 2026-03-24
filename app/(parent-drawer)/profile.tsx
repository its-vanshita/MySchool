import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useUser } from '../../src/context/UserContext';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';

export default function ParentProfileScreen() {
  const { profile } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const joiningDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.headerSection}>
        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarImage, { backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={54} color={colors.primary} />
              </View>
            )}
          </View>
        </View>
        <Text style={styles.profileName}>{profile?.name || 'Parent'}</Text>
        <Text style={styles.profileRole}>PARENT</Text>
        <Text style={styles.profileId}>ID: {profile?.unique_id || '—'}</Text>
      </View>

      {/* Personal Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>PERSONAL DETAILS</Text>
        <DetailField label="Full Name" value={profile?.name || '—'} />
        <DetailField label="Email Address" value={profile?.email || '—'} />
        <DetailField label="Phone Number" value={profile?.phone || '—'} />
        <DetailField label="Registered Since" value={joiningDate} isLast />
      </View>

      {/* Child Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>CHILD DETAILS</Text>
        <DetailField label="Child Name" value="Arjun Sharma" />
        <DetailField label="Class" value="Class 10-A" />
        <DetailField label="Roll Number" value="12" />
        <DetailField label="Attendance" value="92%" isLast />
      </View>

      {/* Password & Security */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>PASSWORD & SECURITY</Text>
        <NavRow
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => Alert.alert('Change Password', 'Password change coming soon.')}
          isLast
        />
      </View>

      {/* Notifications */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>NOTIFICATIONS</Text>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <View style={[styles.toggleIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="notifications-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.toggleLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#E5E7EB', true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
          <View style={styles.toggleLeft}>
            <View style={[styles.toggleIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.toggleLabel}>Email Alerts</Text>
          </View>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: '#E5E7EB', true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ABOUT</Text>
        <NavRow
          icon="information-circle-outline"
          label="Version Information"
          rightText="v1.0.0"
          onPress={() => {}}
        />
        <NavRow
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => Alert.alert('Help', 'Support coming soon.')}
          isLast
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <View style={styles.logoutIconWrap}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </View>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DetailField({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[styles.detailField, !isLast && styles.detailFieldBorder]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function NavRow({
  icon,
  label,
  rightText,
  onPress,
  isLast,
}: {
  icon: string;
  label: string;
  rightText?: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.navRow, !isLast && styles.navRowBorder]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.navRowLeft}>
        <Ionicons name={icon as any} size={20} color={colors.textSecondary} />
        <Text style={styles.navRowLabel}>{label}</Text>
      </View>
      <View style={styles.navRowRight}>
        {rightText ? <Text style={styles.navRightText}>{rightText}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },

  headerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    overflow: 'hidden',
    backgroundColor: colors.primaryLight,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  profileRole: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
    letterSpacing: 1,
  },
  profileId: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 4,
  },

  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },

  detailField: {
    paddingVertical: spacing.md,
  },
  detailFieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  navRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  navRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  navRowLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  navRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  navRightText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  toggleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.dangerLight,
  },
  logoutIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.danger,
  },
});

