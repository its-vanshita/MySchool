import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { uploadFile } from '../../src/services/supabaseService';
import { useSharedUploadedDatesheets } from '../../src/hooks/useSharedUploadedDatesheets';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';

export default function AdminDatesheetScreen() {
  const { datesheets, addDatesheet, removeDatesheet } = useSharedUploadedDatesheets();

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState<'teacher' | 'student' | 'both'>('both');
  const [fileUri, setFileUri] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileMimeType, setFileMimeType] = useState('');
  const [uploading, setUploading] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFileUri(result.assets[0].uri);
        setFileName(result.assets[0].name);
        setFileMimeType(result.assets[0].mimeType ?? 'application/octet-stream');
      }
    } catch {
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the datesheet.');
      return;
    }

    setUploading(true);
    let finalImageUrl = 'https://images.unsplash.com/photo-1596495578065-6ec0798ceb4d?w=800&q=80';

    try {
      if (fileUri) {
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const fileData = decode(base64);
        const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const path = `datesheets/${Date.now()}_${safeName}`;

        finalImageUrl = await uploadFile('myschool-files', path, fileData, fileMimeType);
      }

      addDatesheet({ title, target, imageUrl: finalImageUrl });
      Alert.alert('Success', `Datesheet published successfully for ${target === 'both' ? 'Teachers & Students' : target === 'teacher' ? 'Teachers only' : 'Students only'}!`);

      setTitle('');
      setFileUri('');
      setFileName('');
      setTarget('both');
    } catch (err) {
      Alert.alert('Error', 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
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

          <Text style={styles.label}>Datesheet Document</Text>
          <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={handlePickDocument}>
            <Text style={{ color: fileName ? colors.textPrimary : colors.textLight }}>
              {fileName ? fileName : 'Tap to select document (PDF/Image)'}
            </Text>
          </TouchableOpacity>

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

          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={18} color={colors.white} />
                <Text style={styles.uploadBtnText}>Upload Datesheet</Text>
              </>
            )}
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

