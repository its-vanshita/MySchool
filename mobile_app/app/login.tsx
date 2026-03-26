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
  Dimensions,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const BRAND_NAVY = '#153462';
const BRAND_NAVY_LIGHT = '#1E4886';
const BRAND_NAVY_DARK = '#0D2140';
const ACCENT_BLUE = '#60A5FA';
const PURE_WHITE = '#FFFFFF';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, changePassword, resetPassword } = useAuth();

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
        'A password reset link has been sent to the email associated with your account.',
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
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Mesh Gradient Background */}
      <LinearGradient
        colors={[BRAND_NAVY, BRAND_NAVY_DARK, BRAND_NAVY_LIGHT]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Decorative Orbs for Mesh Effect */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoIconWrap}>
                <Ionicons name="book-outline" size={48} color={PURE_WHITE} style={styles.bookIcon} />
                <View style={styles.waterReflection}>
                    <Ionicons name="water-outline" size={28} color={PURE_WHITE} style={{ opacity: 0.6 }} />
                </View>
            </View>
            <Text style={styles.brandTitle}>VidDarpan</Text>
            <Text style={styles.brandSubtitle}>School ERP System</Text>
          </View>

          {/* Glassmorphism Form Card */}
          <View style={styles.glassCard}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.instructionText}>Sign in to continue</Text>

            {/* Unique ID */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={PURE_WHITE} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Unique ID or Email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={uniqueId}
                onChangeText={setUniqueId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={PURE_WHITE} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={PURE_WHITE}
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, submitting && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color={BRAND_NAVY} />
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
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerText}>TRUSTED BY 300+ EDUCATIONAL INSTITUTIONS</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Change Password Modal ── */}
      <Modal visible={showChangePassword} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
            <View style={[styles.glassCard, styles.modalGlassCard]}>
                <View style={styles.modalIconContainer}>
                    <Ionicons name="key-outline" size={32} color={PURE_WHITE} />
                </View>
                <Text style={styles.modalTitle}>Create Password</Text>
                <Text style={styles.instructionText}>First login requires a new password.</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={PURE_WHITE} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeBtn}>
                        <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={PURE_WHITE} />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={PURE_WHITE} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="rgba(255,255,255,0.5)"
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
                    {changingPassword ? <ActivityIndicator color={BRAND_NAVY} /> : <Text style={styles.loginBtnText}>Set Password</Text>}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* ── Forgot Password Modal ── */}
      <Modal visible={showForgotPassword} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
             <View style={[styles.glassCard, styles.modalGlassCard]}>
                <View style={styles.modalIconContainer}>
                    <Ionicons name="help-circle-outline" size={32} color={PURE_WHITE} />
                </View>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <Text style={styles.instructionText}>Enter ID to receive a reset link.</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={PURE_WHITE} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Unique ID"
                        placeholderTextColor="rgba(255,255,255,0.5)"
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
                    {resettingPassword ? <ActivityIndicator color={BRAND_NAVY} /> : <Text style={styles.loginBtnText}>Send Link</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForgotPassword(false)}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_NAVY,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.4,
  },
  orb1: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: '#1E4886',
    top: -width * 0.3,
    left: -width * 0.3,
  },
  orb2: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#0D2140',
    bottom: -width * 0.2,
    right: -width * 0.2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },
  
  // ── Logo Section ──
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIconWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bookIcon: {
    marginBottom: -8,
    zIndex: 2,
  },
  waterReflection: {
    alignItems: 'center',
    transform: [{ scaleY: 0.6 }],
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: PURE_WHITE,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  // ── Glass Card ──
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: PURE_WHITE,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },

  // ── Inputs ──
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.9,
  },
  input: {
    flex: 1,
    color: PURE_WHITE,
    fontSize: 16,
    height: '100%',
  },
  eyeBtn: {
    padding: 8,
    opacity: 0.8,
  },

  // ── Buttons ──
  loginBtn: {
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: PURE_WHITE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: BRAND_NAVY,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotBtnText: {
    color: ACCENT_BLUE,
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  footerDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ── Modals ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 33, 64, 0.85)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalGlassCard: {
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: PURE_WHITE,
    textAlign: 'center',
    marginBottom: 8,
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  cancelBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '600',
  },
});
