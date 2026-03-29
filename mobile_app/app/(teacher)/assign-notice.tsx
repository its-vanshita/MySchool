import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '../../src/context/UserContext';
import { useNotices } from '../../src/hooks/useNotices';
import { useNotificationBadge } from '../../src/context/NotificationContext';   
import { getClasses } from '../../src/services/supabaseService';
import { useSharedUsers } from '../../src/hooks/useSharedUsers';
import type { ClassInfo, NoticeType, TargetAudience } from '../../src/types';   

const BRAND_NAVY = '#153462';
const BRAND_NAVY_LIGHT = '#2563EB';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const { width } = Dimensions.get('window');

const NOTICE_TYPES: { value: NoticeType; label: string; color: string; icon: any }[] = [
  { value: 'general', label: 'General', color: '#0284C7', icon: 'information-circle' },
  { value: 'event', label: 'Event', color: '#16A34A', icon: 'calendar' },
  { value: 'urgent', label: 'Urgent', color: '#DC2626', icon: 'alert-circle' },
];

export default function AssignNoticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { profile } = useUser();
  const { addNotice } = useNotices();
  const { addNotification } = useNotificationBadge();
  const { teachers, students: allStudents } = useSharedUsers();

  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all');  

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);       
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);       

  const [type, setType] = useState<NoticeType>('general');
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.school_id) {
      getClasses(profile.school_id).then(setClasses);
    }
  }, [profile]);

  const toggleClass = (id: string) => setSelectedClasses(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleTeacher = (id: string) => setSelectedTeachers(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleStudent = (id: string) => setSelectedStudents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Missing Fields', 'Please enter both title and message.');    
      return;
    }
    if (targetAudience === 'specific_classes' && selectedClasses.length === 0) return Alert.alert('Selection Required', 'Please select at least one class.');
    if (targetAudience === 'specific_teachers' && selectedTeachers.length === 0) return Alert.alert('Selection Required', 'Please select at least one teacher.');
    if (targetAudience === 'specific_students' && selectedStudents.length === 0) return Alert.alert('Selection Required', 'Please select at least one student.');

    setSubmitting(true);
    try {
      await addNotice({
        title: title.trim(),
        message: message.trim(),
        type,
        class_id: targetAudience === 'specific_classes' ? selectedClasses[0] : '', // legacy compat
        class_name: targetAudience === 'specific_classes' ? 'Selected Classes' : (targetAudience === 'all' ? 'All' : targetAudience),
        attachment_url: '',
        created_by: profile?.id ?? '',
        creator_name: profile?.name ?? 'Admin',
        target_audience: targetAudience,
        target_classes: selectedClasses,
        target_teachers: selectedTeachers,
        target_students: selectedStudents,
      });

      if (targetAudience === 'all' || targetAudience === 'teachers' || targetAudience === 'specific_teachers') {
        addNotification({ title: `Notice: ${title.trim()}`, message: message.trim(), type: 'notice' });
      }

      Alert.alert('Success', 'Notice broadcasted successfully!', [{ text: 'Done', onPress: () => router.back() }]);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to assign notice.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG_LIGHT }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header Area */}
      <View style={[styles.headerArea, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={PURE_WHITE} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Create Notice</Text>
            <Text style={styles.headerSubtitle}>Broadcast updates & alerts</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Notice Type Area */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notice Type</Text>
          <View style={styles.typeRow}>
            {NOTICE_TYPES.map((t) => {
              const isActive = type === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  style={[
                    styles.typeChip, 
                    isActive && { backgroundColor: t.color + '15', borderColor: t.color, borderWidth: 1.5 }
                  ]}
                  onPress={() => setType(t.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={t.icon} size={18} color={isActive ? t.color : SLATE_GREY} />
                  <Text style={[styles.typeChipText, isActive && { color: t.color, fontWeight: '700' }]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Audience Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Target Audience</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRowContent} style={styles.scrollRow}>
            {[
              { id: 'all', label: 'Everybody' },
              { id: 'students', label: 'All Students' },
              { id: 'teachers', label: 'All Teachers' },
              { id: 'specific_classes', label: 'Specific Classes' },
              { id: 'specific_teachers', label: 'Specific Teachers' },
              { id: 'specific_students', label: 'Specific Students' }
            ].map(aud => {
              const isActive = targetAudience === aud.id;
              return (
                <TouchableOpacity
                  key={aud.id}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setTargetAudience(aud.id as TargetAudience)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{aud.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Conditional Target Selections */}
          {targetAudience === 'specific_classes' && (
            <View style={styles.subSelectionWrap}>
              <Text style={styles.subSelectionTitle}>Select Classes</Text>
              <View style={styles.wrapRow}>
                {classes.map((c) => {
                  const isActive = selectedClasses.includes(c.id);
                  return (
                    <TouchableOpacity key={c.id} style={[styles.subChip, isActive && styles.subChipActive]} onPress={() => toggleClass(c.id)}>      
                      <Text style={[styles.subChipText, isActive && styles.subChipTextActive]}>{c.name} {c.section || ''}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {targetAudience === 'specific_teachers' && (
            <View style={styles.subSelectionWrap}>
              <Text style={styles.subSelectionTitle}>Select Teachers</Text>
              <View style={styles.wrapRow}>
                {teachers.map((t) => {
                  const isActive = selectedTeachers.includes(t.id);
                  return (
                    <TouchableOpacity key={t.id} style={[styles.subChip, isActive && styles.subChipActive]} onPress={() => toggleTeacher(t.id)}>   
                      <Text style={[styles.subChipText, isActive && styles.subChipTextActive]}>{t.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {targetAudience === 'specific_students' && (
            <View style={styles.subSelectionWrap}>
              <Text style={styles.subSelectionTitle}>Select Students</Text>       
              <View style={styles.wrapRow}>
                {allStudents.slice(0, 50).map((s) => {
                  const isActive = selectedStudents.includes(s.id);
                  return (
                    <TouchableOpacity key={s.id} style={[styles.subChip, isActive && styles.subChipActive]} onPress={() => toggleStudent(s.id)}>   
                      <Text style={[styles.subChipText, isActive && styles.subChipTextActive]}>{s.name} ({s.class})</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Content Area */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notice Heading</Text>
          <View style={styles.inputWrap}>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Annual Sports Day 2026" 
              placeholderTextColor="#94A3B8"
              value={title} 
              onChangeText={setTitle} 
            />
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Notice Details</Text>
          <View style={[styles.inputWrap, styles.textAreaWrap]}>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Write the full broadcast message here..." 
              placeholderTextColor="#94A3B8"
              value={message} 
              onChangeText={setMessage} 
              multiline 
              numberOfLines={8} 
              textAlignVertical="top" 
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} 
          onPress={handleSubmit} 
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={PURE_WHITE} />
          ) : (
            <>
              <Ionicons name="paper-plane" size={20} color={PURE_WHITE} />
              <Text style={styles.submitBtnText}>Broadcast Notice</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BG_LIGHT,
  },
  headerArea: {
    backgroundColor: BRAND_NAVY,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  content: { 
    padding: 20, 
    paddingBottom: 100,
    paddingTop: 24,
  },
  card: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: DARK_TEXT, 
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  typeRow: { 
    flexDirection: 'row', 
    gap: 12, 
  }, 
  typeChip: { 
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 6,
  },        
  typeChipText: { 
    fontSize: 14, 
    color: SLATE_GREY,
    fontWeight: '600'
  },
  scrollRow: { 
    marginHorizontal: -20,
  },
  scrollRowContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: { 
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
  },
  chipActive: { 
    backgroundColor: BRAND_NAVY, 
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  chipText: { 
    fontSize: 14, 
    color: SLATE_GREY,
    fontWeight: '600',
  },
  chipTextActive: { 
    color: PURE_WHITE, 
    fontWeight: '700' 
  },
  subSelectionWrap: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  subSelectionTitle: {
    fontSize: 14,
    color: SLATE_GREY,
    fontWeight: '600',
    marginBottom: 12,
  },
  wrapRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
  },
  subChip: { 
    backgroundColor: PURE_WHITE, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12, 
  },
  subChipActive: { 
    backgroundColor: '#EFF6FF', 
    borderColor: '#3B82F6' 
  },
  subChipText: { 
    fontSize: 13, 
    color: SLATE_GREY,
    fontWeight: '500'
  },
  subChipTextActive: { 
    color: '#2563EB', 
    fontWeight: '600' 
  },
  inputWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textAreaWrap: {
    minHeight: 140,
  },
  input: { 
    padding: 16, 
    fontSize: 15, 
    color: DARK_TEXT,
    fontWeight: '500',
  },
  textArea: { 
    minHeight: 140, 
    paddingTop: 16, 
  },
  submitBtn: { 
    flexDirection: 'row', 
    backgroundColor: BRAND_NAVY, 
    height: 56,
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 8,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  submitBtnDisabled: { 
    opacity: 0.6,
    shadowOpacity: 0,
  },
  submitBtnText: { 
    color: PURE_WHITE, 
    fontSize: 16, 
    fontWeight: '700', 
  },
});
