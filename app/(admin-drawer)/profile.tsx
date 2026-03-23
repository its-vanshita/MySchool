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

export default function AdminProfileScreen() {
  const { profile, role } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const designation = profile?.designation || 'System Admin';
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Admin';
  const roleLabel = `${designation.toUpperCase()} / ${displayRole.toUpperCase()}`;

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
      {/* ── Profile Header ── */}
      <View style={styles.headerSection}>
        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' }}
                style={styles.avatarImage}
              />
            )}
          </View>
        </View>
        <Text style={styles.profileName}>{profile?.name || 'Administrator'}</Text>
        <Text style={styles.profileRole}>{roleLabel}</Text>
        <Text style={styles.profileId}>ID: {profile?.unique_id || '—'}</Text>
      </View>

      {/* ── Personal Details ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ADMINISTRATOR DETAILS</Text>

        <DetailField label="Full Name" value={profile?.name || 'Admin User'} />
        <DetailField label="Email Address" value={profile?.email || 'admin@school.com'} />
        <DetailField label="Designation" value={designation} />
        <DetailField label="System Access" value={'Global Dashboard Access'} isLast />
      </View>

      {/* ── Password & Security ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>SECURITY PROTOCOLS</Text>
        <NavRow
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => Alert.alert('Change Password', 'Password change coming soon.')}
        />
        <NavRow
          icon="shield-checkmark-outline"
          label="Two-Factor Authentication"
          onPress={() => Alert.alert('2FA', 'Two-factor authentication coming soon.')}
          isLast
        />
      </View>

      {/* ── Notifications ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ALERTS & NOTIFICATIONS</Text>
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
            <Text style={styles.toggleLabel}>System Email Alerts</Text>
          </View>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: '#E5E7EB', true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* ── Logout ── */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <View style={styles.logoutIconWrap}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </View>
        <Text style={styles.logoutText}>Secure Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Sub-components ──────────────────────────────────────────

function DetailField({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
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
      <View style={styles.navLeft}>
        <View style={[styles.toggleIcon, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name={icon as any} size={18} color={colors.primary} />
        </View>
        <Text style={styles.navLabel}>{label}</Text>
      </View>
      {rightText ? (
        <Text style={styles.navRightText}>{rightText}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 20 },

  // Header
  headerSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    backgroundColor: colors.primaryLight,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  profileId: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  cardTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },

  // Detail fields
  detailField: {
    paddingVertical: spacing.md,
  },
  detailFieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Nav rows
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
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  navLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  navRightText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  // Toggle rows
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: 40,
    paddingVertical: spacing.lg,
    backgroundColor: '#FEE2E2',
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  logoutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#EF4444',
  },
});
