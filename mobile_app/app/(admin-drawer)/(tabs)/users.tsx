import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSharedUsers } from '../../../src/hooks/useSharedUsers';
import { useTheme } from '../../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

export default function AdminManageUsersTab() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { teachers, students, addTeacher, removeTeacher, addStudent, removeStudent } = useSharedUsers();
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubRole, setNewSubRole] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newSubRole.trim()) {
      Alert.alert('Error', 'Please enter a name and a role/class.');
      return;
    }

    if (activeTab === 'teachers') {
      addTeacher({ name: newName, role: newSubRole });
      Alert.alert('Success', `Added teacher ${newName}.`);
    } else {
      addStudent({ name: newName, class: newSubRole });
      Alert.alert('Success', `Added student ${newName}.`);
    }

    setNewName('');
    setNewSubRole('');
    setShowAddForm(false);
  };

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      'Remove Data',
      `Are you sure you want to permanently remove ${name} from the school's records?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            if (activeTab === 'teachers') removeTeacher(id);
            else removeStudent(id);
          }
        },
      ]
    );
  };

  const displayedList = activeTab === 'teachers' ? teachers : students;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Manage Records</Text>
        <Text style={styles.subTitle}>Add or remove staff and students from the school's data.</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'students' && styles.tabActive]}
            onPress={() => { setActiveTab('students'); setShowAddForm(false); }}
          >
            <Text style={[styles.tabText, activeTab === 'students' && styles.tabTextActive]}>Students ({students.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'teachers' && styles.tabActive]}
            onPress={() => { setActiveTab('teachers'); setShowAddForm(false); }}
          >
            <Text style={[styles.tabText, activeTab === 'teachers' && styles.tabTextActive]}>Teachers ({teachers.length})</Text>
          </TouchableOpacity>
        </View>

        {showAddForm ? (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Add New {activeTab === 'teachers' ? 'Teacher' : 'Student'}</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.label}>{activeTab === 'teachers' ? 'Department / Role' : 'Class & Section'}</Text>
            <TextInput
              style={styles.input}
              placeholder={activeTab === 'teachers' ? 'e.g. Mathematics' : 'e.g. Class 10A'}
              value={newSubRole}
              onChangeText={setNewSubRole}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
              <Ionicons name="person-add" size={18} color={colors.white} />
              <Text style={styles.submitBtnText}>Save Record</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addTriggerBtn} onPress={() => setShowAddForm(true)}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.addTriggerText}>Enroll New {activeTab === 'teachers' ? 'Teacher' : 'Student'}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.listSection}>
          <Text style={styles.listHeader}>{activeTab === 'teachers' ? 'Active Faculty' : 'Enrolled Students'}</Text>
          {displayedList.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{activeTab === 'teachers' ? (item as any).role : (item as any).class}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeBtn}
                onPress={() => handleRemove(item.id, item.name)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          {displayedList.length === 0 && (
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textLight }}>No records found.</Text>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 100 },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  subTitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },

  tabContainer: {
    flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: borderRadius.md, padding: 4, marginBottom: spacing.lg
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: borderRadius.md - 2 },
  tabActive: { backgroundColor: colors.white, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '700' },

  addTriggerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primaryLight, padding: spacing.md, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed', marginBottom: spacing.xl
  },
  addTriggerText: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },

  formCard: {
    backgroundColor: colors.white, padding: spacing.lg, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  formTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: spacing.sm },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: 14,
    color: colors.textPrimary, backgroundColor: colors.background,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, paddingVertical: 12, borderRadius: borderRadius.md, marginTop: spacing.xl
  },
  submitBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },

  listSection: {},
  listHeader: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.sm },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB', marginRight: spacing.md },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  itemSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  removeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFEBEE',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: borderRadius.full
  },
  removeBtnText: { fontSize: 11, fontWeight: '700', color: colors.danger }
});

