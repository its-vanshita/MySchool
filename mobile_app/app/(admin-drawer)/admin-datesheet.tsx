import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert, 
  ActivityIndicator,
  Platform,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useSharedUploadedDatesheets } from '../../src/hooks/useSharedUploadedDatesheets';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const STATUS_RED = '#DC2626';

export default function AdminDatesheetScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { datesheets, addDatesheet, removeDatesheet } = useSharedUploadedDatesheets();   

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState<'teacher' | 'student' | 'both'>('both');
  const [fileUri, setFileUri] = useState('');
  const [fileName, setFileName] = useState('');
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
      // Logic for actually uploading the file would go here
      // const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      // const path = `datesheets/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      // const publicUrl = await uploadFile('school-documents', path, decode(base64), fileMimeType);
      
      // Simulate network request
      await new Promise(res => setTimeout(res, 1000));
      
      addDatesheet({
        title,
        
        imageUrl: finalImageUrl,
        target: target,
      });

      Alert.alert('Success', 'Datesheet uploaded successfully!');
      setTitle('');
      setFileUri('');
      setFileName('');
      setTarget('both');
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message || 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const confirmRemove = (id: string) => {
    Alert.alert('Delete Datesheet', 'Are you sure you want to remove this datesheet?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeDatesheet(id) }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={[styles.mainHeaderArea, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
        <View style={styles.mainHeaderTop}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Ionicons name="menu" size={28} color={PURE_WHITE} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Upload Datesheet</Text>
            <Text style={styles.headerSubtitle}>Share exam schedules</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Upload Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Ionicons name="cloud-upload" size={24} color={BRAND_NAVY} />
              <Text style={styles.formTitle}>New Datesheet</Text>
            </View>

            <Text style={styles.label}>Title</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Mid-Term Exams Class 10"
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <Text style={styles.label}>Visible To</Text>
            <View style={styles.targetSelectRow}>
              {(['both', 'student', 'teacher'] as const).map(tg => (
                <TouchableOpacity
                  key={tg}
                  style={[styles.targetSelectBtn, target === tg && styles.targetSelectBtnActive]}
                  onPress={() => setTarget(tg)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={tg === 'both' ? 'business' : tg === 'student' ? 'people' : 'school'} 
                    size={16} 
                    color={target === tg ? PURE_WHITE : SLATE_GREY} 
                  />
                  <Text style={[styles.targetSelectText, target === tg && styles.targetSelectTextActive]}>
                    {tg === 'both' ? 'All' : tg === 'student' ? 'Students' : 'Teachers'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Select Document or Image</Text>
            <TouchableOpacity 
              style={[styles.filePickerBtn, fileUri ? styles.filePickerBtnSuccess : null]} 
              onPress={handlePickDocument}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={fileUri ? "document-text" : "document-attach-outline"} 
                size={28} 
                color={fileUri ? "#10B981" : BRAND_NAVY} 
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.filePickerText}>
                {fileName ? fileName : 'Tap to browse files'}
              </Text>
              {!fileUri && (
                <Text style={styles.filePickerSubtext}>Supports PDF, JPG, PNG</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.submitFormBtn, (!title || !fileUri) && styles.submitFormBtnDisabled]} 
              onPress={handleUpload} 
              activeOpacity={0.8}
              disabled={!title || !fileUri || uploading}
            >
              {uploading ? (
                <ActivityIndicator color={PURE_WHITE} />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={18} color={PURE_WHITE} />
                  <Text style={styles.submitFormBtnText}>Upload & Publish</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* List of uploaded datesheets */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Uploads</Text>
            <View style={styles.badgeWrap}>
              <Text style={styles.sectionCount}>{datesheets.length}</Text>
            </View>
          </View>

          {datesheets.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="document-outline" size={40} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Datesheets</Text>
              <Text style={styles.emptySubtext}>
                Uploaded datesheets will appear here.
              </Text>
            </View>
          ) : (
            datesheets.map(ds => {
              const dateObj = new Date(ds.datePosted);
              const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : 'Just now';
              
              const isPdf = ds.imageUrl.toLowerCase().endsWith('.pdf');
              
              return (
                <View key={ds.id} style={styles.documentCard}>
                  {isPdf ? (
                    <View style={styles.pdfThumb}>
                      <Ionicons name="document-text" size={32} color="#EF4444" />
                      <Text style={styles.pdfThumbText}>PDF</Text>
                    </View>
                  ) : (
                    <Image source={{ uri: ds.imageUrl }} style={styles.docImageThumb} />
                  )}
                  
                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle} numberOfLines={1}>{ds.title}</Text>
                    <View style={styles.docMetaRow}>
                      <View style={styles.docTargetChip}>
                        <Text style={styles.docTargetText}>
                          {ds.target === 'both' ? 'All' : ds.target === 'student' ? 'Students' : 'Teachers'}
                        </Text>
                      </View>
                      <Text style={styles.docDate}>{dateStr}</Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => confirmRemove(ds.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color={STATUS_RED} />
                  </TouchableOpacity>
                </View>
              );
            })
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  mainHeaderArea: {
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
  mainHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 4,
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
  },
  // Form Card
  formCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  input: {
    padding: 16,
    fontSize: 15,
    color: DARK_TEXT,
    fontWeight: '500',
  },
  targetSelectRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
  },
  targetSelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  targetSelectBtnActive: {
    backgroundColor: BRAND_NAVY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  targetSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: SLATE_GREY,
  },
  targetSelectTextActive: {
    color: PURE_WHITE,
    fontWeight: '700',
  },
  // File Picker
  filePickerBtn: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  filePickerBtnSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    borderStyle: 'solid',
  },
  filePickerText: {
    fontSize: 15,
    fontWeight: '600',
    color: BRAND_NAVY,
    textAlign: 'center',
    marginBottom: 4,
  },
  filePickerSubtext: {
    fontSize: 12,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  // Submit Button
  submitFormBtn: {
    flexDirection: 'row',
    backgroundColor: BRAND_NAVY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitFormBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitFormBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: PURE_WHITE,
  },
  // Document List Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeWrap: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: SLATE_GREY,
  },
  emptyCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    alignItems: 'center',
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: SLATE_GREY,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Document Card
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  docImageThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 16,
  },
  pdfThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  pdfThumbText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    marginTop: 2,
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 6,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  docTargetChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  docTargetText: {
    fontSize: 11,
    fontWeight: '700',
    color: BRAND_NAVY,
  },
  docDate: {
    fontSize: 12,
    fontWeight: '600',
    color: SLATE_GREY,
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
