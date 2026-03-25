import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';

export default function ParentSettingsScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password reset email will be sent to your registered email address.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send', onPress: () => Alert.alert('Sent', 'Check your email for the reset link.') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Preferences */}
      <Text style={styles.sectionHeader}>Preferences</Text>
      <View style={styles.section}>
        <View style={styles.settingsRow}>
          <View style={styles.settingsLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.infoLight }]}>
              <Ionicons name="notifications" size={18} color={colors.info} />
            </View>
            <Text style={styles.settingsLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={notifications ? colors.primary : colors.textLight}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingsRow}>
          <View style={styles.settingsLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.purpleLight }]}>
              <Ionicons name="moon" size={18} color={colors.purple} />
            </View>
            <Text style={styles.settingsLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={darkMode ? colors.primary : colors.textLight}
          />
        </View>
      </View>

      {/* Security */}
      <Text style={styles.sectionHeader}>Security</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.settingsRow} onPress={handleChangePassword}>
          <View style={styles.settingsLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="lock-closed" size={18} color={colors.warning} />
            </View>
            <Text style={styles.settingsLabel}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Support */}
      <Text style={styles.sectionHeader}>Support</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => Linking.openURL('mailto:support@myschool.app')}
        >
          <View style={styles.settingsLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.successLight }]}>
              <Ionicons name="help-circle" size={18} color={colors.success} />
            </View>
            <Text style={styles.settingsLabel}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingsRow}>
          <View style={styles.settingsLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="document-text" size={18} color={colors.primary} />
            </View>
            <Text style={styles.settingsLabel}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <Text style={styles.sectionHeader}>About</Text>
      <View style={styles.section}>
        <View style={styles.settingsRow}>
          <View style={styles.settingsLeft}>
            <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
              <Ionicons name="information-circle" size={18} color={colors.textSecondary} />
            </View>
            <Text style={styles.settingsLabel}>Version</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 100 },
  sectionHeader: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    marginLeft: spacing.sm,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsLabel: { fontSize: fontSize.md, fontWeight: '500', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 68 },
  versionText: { fontSize: fontSize.md, color: colors.textLight },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.dangerLight,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.danger,
  },
});

