import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSharedUsers } from '../../../src/hooks/useSharedUsers';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

export default function AdminManageUsersTab() {
  const { teachers, students, addUser, removeUser } = useSharedUsers();
  
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newRole.trim()) {
      Alert.alert('Error', 'Please fill in both Name and Class/Role.');
      return;
    }
    addUser(activeTab, newName.trim(), newRole.trim());
    Alert.alert('Success', `${newName} has been added to the school's data!`);
    setNewName('');
    setNewRole('');
  };

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      'Remove User',
      `Are you sure you want to completely remove ${name} from the school records?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeUser(activeTab, id) }
      ]
    );
  };

  const currentList = activeTab === 'students' ? students : teachers;

  return (
    <View style={styles.container}>
      {/* Top Toggle */}
      <View style={styles.segmentControl}>
        <TouchableOpacity 
          style={[styles.segmentBtn, activeTab === 'students' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('students')}
        >
          <Text style={[styles.segmentText, activeTab === 'students' && styles.segmentTextActive]}>Manage Students</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.segmentBtn, activeTab === 'teachers' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('teachers')}
        >
          <Text style={[styles.segmentText, activeTab === 'teachers' && styles.segmentTextActive]}>Manage Teachers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* ADD USER CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Add New {activeTab === 'students' ? 'Student' : 'Teacher'}
          </Text>
          
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Doe"
            placeholderTextColor={colors.textLight}
            value={newName}
            onChangeText={setNewName}
          />

          <Text style={styles.label}>
            {activeTab === 'students' ? 'Assigned Class' : 'Subject / Role'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={activeTab === 'students' ? "e.g. Class 10A" : "e.g. Science Dept"}
            placeholderTextColor={colors.textLight}
            value={newRole}
            onChangeText={setNewRole}
          />

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Ionicons name="person-add" size={18} color={colors.white} />
            <Text style={styles.addBtnText}>Enlist to Directory</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          Active {activeTab === 'students' ? 'Students' : 'Teachers'} Directory
        </Text>

        {/* LIST USERS CARD */}
        {currentList.map((usr) => (
          <View key={usr.id} style={styles.userRow}>
             <Image source={{ uri: usr.avatar }} style={styles.avatar} />
             <View style={styles.userInfo}>
               <Text style={styles.userName}>{usr.name}</Text>
               <Text style={styles.userRole}>{usr.roleOrClass}</Text>
             </View>
             <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(usr.id, usr.name)}>
               <Ionicons name="person-remove" size={20} color={colors.danger} />
             </TouchableOpacity>
          </View>
        ))}

        {currentList.length === 0 && (
          <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xl }}>
            No records found.
          </Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  segmentBtn: {
    flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: borderRadius.md,
  },
  segmentBtnActive: { backgroundColor: colors.primaryLight },
  segmentText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  segmentTextActive: { color: colors.primary, fontWeight: '700' },

  content: { padding: spacing.xl },
  card: {
    backgroundColor: colors.white, padding: spacing.xl, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xxl,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }
  },
  cardTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: spacing.md },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 14,
    color: colors.textPrimary, backgroundColor: colors.background,
  },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, paddingVertical: 14, borderRadius: borderRadius.md,
    marginTop: spacing.xl,
  },
  addBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },

  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  
  userRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md,
    borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, marginBottom: 8,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: spacing.md, backgroundColor: '#E5E7EB' },
  userInfo: { flex: 1 },
  userName: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  userRole: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  
  removeBtn: { padding: 10, backgroundColor: colors.dangerLight, borderRadius: 8 },
});
