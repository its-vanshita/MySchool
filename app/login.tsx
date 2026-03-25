import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../src/theme/spacing';
import type { UserRole } from '../src/types';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { signIn, changePassword, resetPassword, enterDemoMode, error, loading } = useAuth();

  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // First-time password change modal
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Forgot password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUniqueId, setForgotUniqueId] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  const [pendingRole, setPendingRole] = useState<string | undefined>(undefined);

  const routeForRole = (r?: string) => {
    if (r === 'admin' || r === 'super_admin' || r === 'principal') {
      router.replace('/(admin-drawer)/(tabs)');
    } else if (r === 'parent' || r === 'student') {
      router.replace('/(parent-drawer)/(tabs)');
    } else {
      router.replace('/(drawer)/(tabs)');
    }
  };

  const handleLogin = async () => {
    if (!uniqueId.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both Email/Unique ID and password.');
      return;
    }

    setSubmitting(true);
    try {
      // Auto-detect if user entered an email
      const isEmailLogin = uniqueId.includes('@');

      const { isFirstLogin, role } = await signIn(uniqueId, password, isEmailLogin);

      if (isFirstLogin) {
        setPendingRole(role);
        setShowChangePassword(true);
      } else {
        routeForRole(role);
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing Fields', 'Please enter and confirm your new password.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(newPassword);
      setShowChangePassword(false);
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password updated successfully!');
      routeForRole(pendingRole);
    } catch {
      Alert.alert('Error', 'Failed to update password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotUniqueId.trim()) {
      Alert.alert('Missing Field', 'Please enter your Unique ID.');
      return;
    }
    setResettingPassword(true);
    try {
      await resetPassword(forgotUniqueId.trim());
      Alert.alert(
        'Password Reset',
        'A password reset link has been sent to the email associated with your account. Please contact your administrator if you need help.',
        [{ text: 'OK', onPress: () => setShowForgotPassword(false) }]
      );
      setForgotUniqueId('');
    } catch {
      Alert.alert('Error', 'Could not reset password. Please contact your administrator.');
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Brand Section */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={36} color={colors.primary} />
          </View>
          <Text style={styles.appName}>VidDarpan</Text>
        </View>

        {/* School Image Banner */}
        <View style={styles.imageBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' }}
            style={styles.schoolImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please sign in to access your dashboard</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Unique ID Input */}
          <Text style={styles.inputLabel}>Unique ID</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. MS-2024-001 or Email"
              placeholderTextColor={colors.textLight}
              value={uniqueId}
              onChangeText={setUniqueId}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, submitting && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginBtnText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => setShowForgotPassword(true)}
          >
            <Text style={styles.forgotBtnText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Demo Credentials removed for production */}

          {/* Footer */}
          <Text style={styles.trustedText}>TRUSTED BY 300+ SCHOOLS</Text>
          <Text style={styles.footerText}>
            By logging in, you agree to our{' '}
            <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>

      {/* ── Change Password Modal (First Login) ── */}
      <Modal visible={showChangePassword} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="key-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Create Your Password</Text>
            <Text style={styles.modalSubtitle}>
              This is your first login. Please create a new password for your account.
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor={colors.textLight}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textLight}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, changingPassword && styles.loginBtnDisabled]}
              onPress={handleChangePassword}
              disabled={changingPassword}
            >
              {changingPassword ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.loginBtnText}>Set Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Forgot Password Modal ── */}
      <Modal visible={showForgotPassword} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="help-circle-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Forgot Password</Text>
            <Text style={styles.modalSubtitle}>
              Enter your Unique ID and we'll send a password reset link to your registered email.
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. MS-2024-001"
                placeholderTextColor={colors.textLight}
                value={forgotUniqueId}
                onChangeText={setForgotUniqueId}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, resettingPassword && styles.loginBtnDisabled]}
              onPress={handleForgotPassword}
              disabled={resettingPassword}
            >
              {resettingPassword ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.loginBtnText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setShowForgotPassword(false);
                setForgotUniqueId('');
              }}
            >
              <Text style={styles.cancelBtnText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // ── Top Brand ──
  topSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // ── School Image Banner ──
  imageBanner: {
    height: 180,
    marginHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
  },
  schoolImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 101, 192, 0.08)',
  },
  // ── Form ──
  formSection: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  welcomeText: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
    flex: 1,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: spacing.xs,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  forgotBtnText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  // ── Demo Credentials ──
  demoBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  demoTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  demoRoleText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: spacing.sm,
    width: 60,
  },
  demoCred: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  trustedText: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  footerText: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    paddingBottom: spacing.xxl + 25,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});

