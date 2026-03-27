import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Switch,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSharedMarks, DEMO_EXAMS } from '../../../src/hooks/useSharedMarks';
import { useClasses } from '../../../src/hooks/useClasses';
import { useClassSubjects } from '../../../src/hooks/useClassSubjects';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const AMBER_GLOW = '#F59E0B';

export default function AdminUpdateMarksTab() {
  const { store, adminUpdateMarks, adminUnlockPortal } = useSharedMarks();
  const { classes, loading: classesLoading } = useClasses();

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState(DEMO_EXAMS[0].id);
  const [isPortalUnlocked, setIsPortalUnlocked] = useState(false);

  React.useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].name);
    }
  }, [classes, selectedClass]);

  const { subjects } = useClassSubjects(selectedClass);

  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingMark, setEditingMark] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState<{classKey: string, studentId: string, mark: string} | null>(null);

  const handleAdminMarkSave = () => {
    if (!unsavedChanges) return;
    adminUpdateMarks(unsavedChanges.classKey, selectedExam, unsavedChanges.studentId, unsavedChanges.mark);
    Alert.alert('Changes Saved', 'Student marks have been successfully updated.');
    setEditingStudentId(null);
    setUnsavedChanges(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Tabs.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: BRAND_NAVY, elevation: 0, shadowOpacity: 0 },
          headerTintColor: PURE_WHITE,
          headerTitle: 'Update Marks',
          headerTitleStyle: {
             fontWeight: '700',
             fontSize: 20,
             fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Portal Control Hero */}
        <View style={[styles.heroCard, isPortalUnlocked && styles.heroCardActive]}>
           <View style={styles.heroRow}>
              <View style={styles.heroTextWrap}>
                 <Text style={styles.heroTitle}>Teacher Portal Access</Text>
                 <Text style={styles.heroSubTitle}>
                    {isPortalUnlocked ? 'Modification mode is LIVE' : 'Portal locked for modifications'}
                 </Text>
              </View>
              <Switch
                 value={isPortalUnlocked}
                 onValueChange={(val) => {
                    setIsPortalUnlocked(val);
                    if (val && subjects.length > 0) {
                      const classKey = `${subjects[0]}|${selectedClass}`;
                      adminUnlockPortal(classKey, selectedExam, 24);
                    }
                 }}
                 trackColor={{ false: '#E2E8F0', true: '#FDE68A' }}
                 thumbColor={isPortalUnlocked ? AMBER_GLOW : '#94A3B8'}
                 ios_backgroundColor="#E2E8F0"
              />
           </View>
        </View>

        {/* Selection Layer */}
        <View style={styles.selectionLayer}>
           {/* Exams Row */}
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {DEMO_EXAMS.map(e => (
                 <TouchableOpacity
                   key={e.id}
                   style={[styles.examChip, selectedExam === e.id && styles.examChipSelected]}
                   onPress={() => setSelectedExam(e.id)}
                   activeOpacity={0.8}
                 >
                   <Text style={[styles.examChipText, selectedExam === e.id && styles.examChipTextSelected]}>{e.label}</Text>
                 </TouchableOpacity>
              ))}
           </ScrollView>

           {/* Classes Row */}
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {classes.map(c => (
                 <TouchableOpacity
                   key={c.id}
                   style={[styles.classChip, selectedClass === c.name && styles.classChipSelected]}
                   onPress={() => setSelectedClass(c.name)}
                   activeOpacity={0.8}
                 >
                   <Text style={[styles.classChipText, selectedClass === c.name && styles.classChipTextSelected]}>{c.name}</Text>
                 </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        {/* Data Records */}
        <Text style={styles.sectionTitle}>Student Records</Text>
        <View style={styles.listContainer}>
          {subjects.map(subj => {
            const classKey = `${subj}|${selectedClass}`;
            const group = store.find(s => s.classKey === classKey && s.examId === selectedExam);
            
            if (group && group.students.length > 0) {
               return group.students.map(st => {
                 const isEditing = editingStudentId === `${classKey}|${st.id}`;
                 
                 return (
                   <View key={`${subj}-${st.id}`} style={styles.recordCard}>
                     <View style={styles.recordInfo}>
                        <Text style={styles.recordName}>{st.name}</Text>
                        <Text style={styles.recordSubject}>{subj}</Text>
                     </View>

                     <View style={styles.recordAction}>
                        {isEditing ? (
                           <View style={styles.editWrap}>
                              <TextInput 
                                style={styles.scoreInput}
                                value={editingMark}
                                onChangeText={(text) => {
                                   setEditingMark(text);
                                   setUnsavedChanges({classKey, studentId: st.id, mark: text});
                                }}
                                keyboardType="numeric"
                                maxLength={3}
                                autoFocus
                              />
                              <Text style={styles.maxMarkText}>/ 100</Text>
                           </View>
                        ) : (
                           <Text style={styles.scoreText}>{st.marks ? `${st.marks}/100` : '—/100'}</Text>
                        )}
                        <TouchableOpacity 
                           style={styles.editBtn} 
                           onPress={() => {
                              if (isEditing) {
                                 setEditingStudentId(null);
                                 setUnsavedChanges(null);
                              } else {
                                 setEditingStudentId(`${classKey}|${st.id}`);
                                 setEditingMark(st.marks || '');
                              }
                           }}
                        >
                           <Ionicons name={isEditing ? "close-outline" : "pencil-outline"} size={20} color={BRAND_NAVY} />
                        </TouchableOpacity>
                     </View>
                   </View>
                 );
               });
            }
            return null;
          })}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* The Elite Footer */}
      {unsavedChanges && (
         <View style={styles.footerWrap}>
            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleAdminMarkSave}>
               <Text style={styles.saveBtnText}>Save All Changes</Text>
               <Ionicons name="checkmark" size={20} color={PURE_WHITE} />
            </TouchableOpacity>
         </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  content: {
    padding: 20,
    paddingTop: 16,
  },
  
  // Hero
  heroCard: {
     backgroundColor: PURE_WHITE,
     borderRadius: 24,
     padding: 24,
     marginBottom: 24,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.05,
     shadowRadius: 20,
     elevation: 4,
     borderWidth: 2,
     borderColor: 'transparent',
  },
  heroCardActive: {
     borderColor: AMBER_GLOW,
     shadowColor: AMBER_GLOW,
     shadowOpacity: 0.15,
  },
  heroRow: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
  },
  heroTextWrap: {
     flex: 1,
     paddingRight: 16,
  },
  heroTitle: {
     fontSize: 18,
     fontWeight: '800',
     color: BRAND_NAVY,
     marginBottom: 4,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  heroSubTitle: {
     fontSize: 13,
     color: SLATE_GREY,
     fontWeight: '500',
  },

  // Selection Layer
  selectionLayer: {
     marginBottom: 24,
  },
  chipRow: {
     flexDirection: 'row',
     marginBottom: 16,
  },
  examChip: {
     backgroundColor: PURE_WHITE,
     paddingHorizontal: 20,
     paddingVertical: 10,
     borderRadius: 20,
     marginRight: 10,
     borderWidth: 1,
     borderColor: '#E2E8F0',
  },
  examChipSelected: {
     backgroundColor: BRAND_NAVY,
     borderColor: BRAND_NAVY,
  },
  examChipText: {
     fontSize: 14,
     fontWeight: '700',
     color: SLATE_GREY,
  },
  examChipTextSelected: {
     color: PURE_WHITE,
  },
  
  classChip: {
     backgroundColor: 'transparent',
     paddingHorizontal: 16,
     paddingVertical: 8,
     borderRadius: 16,
     marginRight: 8,
     borderWidth: 1,
     borderColor: '#CBD5E1', // soft-grey outline
  },
  classChipSelected: {
     borderColor: BRAND_NAVY,
     backgroundColor: '#F1F5F9',
  },
  classChipText: {
     fontSize: 13,
     fontWeight: '600',
     color: '#64748B',
  },
  classChipTextSelected: {
     color: BRAND_NAVY,
  },

  // Data Records
  sectionTitle: {
     fontSize: 16,
     fontWeight: '800',
     color: BRAND_NAVY,
     marginBottom: 16,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  listContainer: {
     gap: 12,
  },
  recordCard: {
     flexDirection: 'row',
     backgroundColor: PURE_WHITE,
     borderRadius: 16,
     paddingVertical: 16,
     paddingHorizontal: 20,
     alignItems: 'center',
     justifyContent: 'space-between',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.03,
     shadowRadius: 10,
     elevation: 2,
  },
  recordInfo: {
     flex: 1,
  },
  recordName: {
     fontSize: 16,
     fontWeight: '800',
     color: BRAND_NAVY,
     marginBottom: 4,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  recordSubject: {
     fontSize: 13,
     color: SLATE_GREY,
     fontWeight: '500',
  },
  recordAction: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 16,
  },
  scoreText: {
     fontSize: 18,
     fontWeight: '800',
     color: '#0F172A',
  },
  editWrap: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#F1F5F9',
     borderRadius: 8,
     paddingHorizontal: 8,
     paddingVertical: 4,
  },
  scoreInput: {
     fontSize: 18,
     fontWeight: '800',
     color: BRAND_NAVY,
     padding: 0,
     textAlign: 'right',
     minWidth: 32,
  },
  maxMarkText: {
     fontSize: 14,
     fontWeight: '700',
     color: SLATE_GREY,
     marginLeft: 2,
  },
  editBtn: {
     padding: 4,
     borderWidth: 1,
     borderColor: '#E2E8F0',
     borderRadius: 8,
  },

  // Footer
  footerWrap: {
     position: 'absolute',
     bottom: 30,
     left: 20,
     right: 20,
  },
  saveBtn: {
     flexDirection: 'row',
     backgroundColor: BRAND_NAVY,
     borderRadius: 16,
     paddingVertical: 18,
     alignItems: 'center',
     justifyContent: 'center',
     shadowColor: BRAND_NAVY,
     shadowOffset: { width: 0, height: 8 },
     shadowOpacity: 0.3,
     shadowRadius: 16,
     elevation: 8,
     gap: 8,
  },
  saveBtnText: {
     fontSize: 16,
     fontWeight: '700',
     color: PURE_WHITE,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  }
});
