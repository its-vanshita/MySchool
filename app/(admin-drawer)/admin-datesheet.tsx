import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSharedUploadedDatesheets } from '../../src/hooks/useSharedUploadedDatesheets';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';

export default function AdminDatesheetScreen() {
  const { datesheets, addDatesheet, removeDatesheet } = useSharedUploadedDatesheets();
  
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState<'teacher' | 'student' | 'both'>('both');
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the datesheet.');
      return;
    }
    
    // Fallback image if not provided
    const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1596495578065-6ec0798ceb4d?w=800&q=80';

    addDatesheet({ title, target, imageUrl: finalImage });
    Alert.alert('Success', `Datesheet published successfully for ${target === 'both' ? 'Teachers & Students' : target === 'teacher' ? 'Teachers only' : 'Students only'}!`);
    
    setTitle('');
    setImageUrl('');
    setTarget('both');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Manage Datesheets</Text>
        <Text style={styles.subTitle}>Upload and distribute official exam datesheets.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Datesheet Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Term 1 Final Datesheet"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Image URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste image URL here"
            value={imageUrl}
            onChangeText={setImageUrl}
          />

          <Text style={styles.label}>Show Datesheet To:</Text>
          <View style={styles.radioGroup}>
            {[
              { id: 'both', label: 'Everyone (Students & Teachers)' },
              { id: 'student', label: 'Students Only' },
              { id: 'teacher', label: 'Teachers Only' }
            ].map((opt) => (
              <TouchableOpacity key={opt.id} style={styles.radioBtn} onPress={() => setTarget(opt.id as any)}>
                <Ionicons name={target === opt.id ? "radio-button-on" : "radio-button-off"} size={22} color={target === opt.id ? colors.primary : colors.textLight} />
                <Text style={styles.radioLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
            <Ionicons name="cloud-upload" size={18} color={colors.white} />
            <Text style={styles.uploadBtnText}>Upload Datesheet</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Uploaded Datesheets</Text>
        {datesheets.map((d) => (
          <View key={d.id} style={styles.datesheetCard}>
            <Image source={{ uri: d.imageUrl }} style={styles.datesheetImage} />
            <View style={styles.datesheetInfo}>
              <Text style={styles.datesheetTitle}>{d.title}</Text>
              <View style={[styles.targetBadge, d.target === 'both' ? styles.targetBoth : d.target === 'student' ? styles.targetStudent : styles.targetTeacher]}>
                <Text style={styles.targetBadgeText}>For: {d.target.toUpperCase()}</Text>
              </View>
              <Text style={styles.datePosted}>Posted: {new Date(d.datePosted).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity onPress={() => removeDatesheet(d.id)} style={styles.trashBtn}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
        {datesheets.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textLight }}>No datesheets uploaded yet.</Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 100 },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  subTitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },

  card: {
    backgroundColor: colors.white, padding: spacing.lg, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
  },
  label: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 8, marginTop: spacing.md },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: 14,
    color: colors.textPrimary, backgroundColor: colors.background,
  },

  radioGroup: { marginTop: 4, gap: 12 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },

  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, paddingVertical: 14, borderRadius: borderRadius.md, marginTop: spacing.xl
  },
  uploadBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },

  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  
  datesheetCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md,
    borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md
  },
  datesheetImage: { width: 60, height: 60, borderRadius: 8, marginRight: spacing.md, backgroundColor: '#E5E7EB' },
  datesheetInfo: { flex: 1 },
  datesheetTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  targetBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  targetBoth: { backgroundColor: colors.primaryLight },
  targetStudent: { backgroundColor: '#E8F5E9' },
  targetTeacher: { backgroundColor: '#FFF3E0' },
  targetBadgeText: { fontSize: 9, fontWeight: '800', color: colors.textPrimary },
  datePosted: { fontSize: 11, color: colors.textLight },
  trashBtn: { padding: 8 }
});

