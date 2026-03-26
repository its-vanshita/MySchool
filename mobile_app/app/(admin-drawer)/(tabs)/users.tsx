import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Image,
  Modal,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const { width, height } = Dimensions.get('window');

type RoleType = 'Staff' | 'Students';
type TabType = 'Personal' | 'Academic' | 'Attendance' | 'Documents';

const MOCK_USERS = {
    Students: [
        { id: 1, name: 'Aarav Sharma', section: 'Section A', avatar: 'https://i.pravatar.cc/150?img=11', status: 'Active' },
        { id: 2, name: 'Priya Patel', section: 'Section A', avatar: 'https://i.pravatar.cc/150?img=12', status: 'Active' },
        { id: 3, name: 'Rahul Singh', section: 'Section B', avatar: 'https://i.pravatar.cc/150?img=13', status: 'Active' },
        { id: 4, name: 'Sneha Gupta', section: 'Section B', avatar: 'https://i.pravatar.cc/150?img=14', status: 'Active' },
    ],
    Staff: [
        { id: 101, name: 'Dr. Anita Verma', section: 'Mathematics', avatar: 'https://i.pravatar.cc/150?img=21', status: 'Active' },
        { id: 102, name: 'Mr. Rajesh Kumar', section: 'Physics', avatar: 'https://i.pravatar.cc/150?img=22', status: 'Active' },
    ]
};

export default function ManageRecordsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<RoleType>('Students');
  const [activeClass, setActiveClass] = useState('Class 10');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<TabType>('Personal');

  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const renderMonthCalendar = () => {
    return (
      <View style={styles.calendarWrap}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
             <Text key={i} style={styles.calHeader}>{d}</Text>
          ))}
          {Array.from({length: 30}).map((_, i) => {
             const isAbsent = i === 4 || i === 12 || i === 22;
             return (
               <View key={i} style={styles.calDayWrap}>
                  <Text style={styles.calDayText}>{i + 1}</Text>
                  <View style={[styles.calDot, { backgroundColor: isAbsent ? '#EF4444' : '#10B981' }]} />
               </View>
             )
          })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      <StatusBar style="light" backgroundColor="transparent" translucent />
      
      {/* ── Midnight Navy Header Area ── */}
      <View style={[styles.headerArea, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
            <View style={styles.backButton} />
            <Text style={styles.headerTitle}>Manage Records</Text>
            <View style={{ width: 40 }} />
        </View>

        {/* Role Toggle */}
        <View style={styles.roleToggleWrap}>
           {(['Students', 'Staff'] as RoleType[]).map((role) => (
             <TouchableOpacity 
                key={role} 
                style={[styles.roleBtn, activeRole === role && styles.roleBtnActive]}
                onPress={() => setActiveRole(role)}
             >
                <Text style={[styles.roleBtnText, activeRole === role && styles.roleBtnTextActive]}>
                   {role}
                </Text>
             </TouchableOpacity>
           ))}
        </View>
      </View>

      {/* ── Class Filter Chip Bar ── */}
      {activeRole === 'Students' && (
          <View>
              <ScrollView 
                 horizontal 
                 showsHorizontalScrollIndicator={false}
                 contentContainerStyle={styles.chipBarScroll}
              >
                  {classes.map(cls => (
                      <TouchableOpacity 
                         key={cls}
                         style={[styles.chip, activeClass === cls && styles.chipActive]}
                         onPress={() => setActiveClass(cls)}
                      >
                         <Text style={[styles.chipText, activeClass === cls && styles.chipTextActive]}>
                             {cls}
                         </Text>
                      </TouchableOpacity>
                  ))}
              </ScrollView>
          </View>
      )}

      {/* ── User List ── */}
      <ScrollView contentContainerStyle={styles.listContent}>
         {activeRole === 'Students' ? (
             <>
                 <Text style={styles.sectionHeader}>SECTION A</Text>
                 {MOCK_USERS.Students.filter(s => s.section === 'Section A').map(user => (
                     <TouchableOpacity 
                         key={user.id} 
                         style={styles.userCard}
                         activeOpacity={0.7}
                         onPress={() => setSelectedUser(user)}
                     >
                         <Image source={{ uri: user.avatar }} style={styles.avatar} />
                         <View style={styles.userInfo}>
                             <Text style={styles.userName}>{user.name}</Text>
                             <Text style={styles.userSub}>{user.section}</Text>
                         </View>
                         <TouchableOpacity style={styles.menuHit}>
                             <Ionicons name="ellipsis-vertical" size={20} color={SLATE_GREY} />
                         </TouchableOpacity>
                     </TouchableOpacity>
                 ))}
                 
                 <Text style={[styles.sectionHeader, { marginTop: 12 }]}>SECTION B</Text>
                 {MOCK_USERS.Students.filter(s => s.section === 'Section B').map(user => (
                     <TouchableOpacity 
                         key={user.id} 
                         style={styles.userCard}
                         activeOpacity={0.7}
                         onPress={() => setSelectedUser(user)}
                     >
                         <Image source={{ uri: user.avatar }} style={styles.avatar} />
                         <View style={styles.userInfo}>
                             <Text style={styles.userName}>{user.name}</Text>
                             <Text style={styles.userSub}>{user.section}</Text>
                         </View>
                         <TouchableOpacity style={styles.menuHit}>
                             <Ionicons name="ellipsis-vertical" size={20} color={SLATE_GREY} />
                         </TouchableOpacity>
                     </TouchableOpacity>
                 ))}
             </>
         ) : (
             <>
                 <Text style={styles.sectionHeader}>FACULTY</Text>
                 {MOCK_USERS.Staff.map(user => (
                     <TouchableOpacity 
                         key={user.id} 
                         style={styles.userCard}
                         activeOpacity={0.7}
                         onPress={() => setSelectedUser(user)}
                     >
                         <Image source={{ uri: user.avatar }} style={styles.avatar} />
                         <View style={styles.userInfo}>
                             <Text style={styles.userName}>{user.name}</Text>
                             <Text style={styles.userSub}>{user.section}</Text>
                         </View>
                         <TouchableOpacity style={styles.menuHit}>
                             <Ionicons name="ellipsis-vertical" size={20} color={SLATE_GREY} />
                         </TouchableOpacity>
                     </TouchableOpacity>
                 ))}
             </>
         )}
      </ScrollView>

      {/* ── Profile Drill-Down Modal ── */}
      <Modal visible={!!selectedUser} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedUser(null)}>
          <View style={styles.modalContainer}>
              <View style={[styles.modalHeader, { paddingTop: Platform.OS === 'ios' ? 10 : 20 }]}>
                  <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.modalCloseHit}>
                      <Ionicons name="chevron-down" size={28} color={BRAND_NAVY} />
                  </TouchableOpacity>
                  <Text style={styles.modalHeaderText}>Profile Overview</Text>
                  <View style={{ width: 40 }} />
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                  {/* Profile Hero */}
                  <View style={styles.profileHero}>
                      <Image source={{ uri: selectedUser?.avatar }} style={styles.profileAvatar} />
                      <Text style={styles.profileName}>{selectedUser?.name}</Text>
                      <View style={styles.statusBadge}>
                          <View style={styles.statusDot} />
                          <Text style={styles.statusText}>{selectedUser?.status}</Text>
                      </View>
                  </View>

                  {/* Tab Navigation */}
                  <View style={styles.tabNavRow}>
                      {(['Personal', 'Academic', 'Attendance', 'Documents'] as TabType[]).map((tab) => (
                          <TouchableOpacity 
                              key={tab}
                              style={[styles.tabBtn, activeProfileTab === tab && styles.tabBtnActive]}
                              onPress={() => setActiveProfileTab(tab)}
                          >
                              <Text style={[styles.tabText, activeProfileTab === tab && styles.tabTextActive]}>{tab}</Text>
                          </TouchableOpacity>
                      ))}
                  </View>

                  <View style={styles.tabContent}>
                      {activeProfileTab === 'Personal' && (
                          <View style={styles.detailCard}>
                              <View style={styles.infoRow}>
                                  <Text style={styles.infoLabel}>ID NUMBER</Text>
                                  <Text style={styles.infoVal}>VID-8842</Text>
                              </View>
                              <View style={styles.divider} />
                              <View style={styles.infoRow}>
                                  <Text style={styles.infoLabel}>LOCATION</Text>
                                  <Text style={styles.infoVal}>New Delhi, India</Text>
                              </View>
                              <View style={styles.divider} />
                              <View style={styles.infoRow}>
                                  <Text style={styles.infoLabel}>CONTACT</Text>
                                  <Text style={styles.infoVal}>+91 98765 43210</Text>
                              </View>
                          </View>
                      )}

                      {activeProfileTab === 'Attendance' && (
                          <View style={styles.detailCard}>
                              <Text style={styles.cardSectionTitle}>March 2026</Text>
                              {renderMonthCalendar()}
                          </View>
                      )}

                      {activeProfileTab === 'Documents' && (
                          <View style={styles.detailCard}>
                              {['Birth_Certificate.pdf', 'Transfer_Letter.pdf', 'Medical_Record.pdf'].map((doc, idx) => (
                                  <View key={idx}>
                                      <View style={styles.docRow}>
                                          <View style={styles.docIconBox}>
                                              <Ionicons name="document-text-outline" size={20} color={BRAND_NAVY} />
                                          </View>
                                          <Text style={styles.docName}>{doc}</Text>
                                          <View style={styles.docActions}>
                                              <TouchableOpacity style={styles.docHit}><Ionicons name="eye-outline" size={20} color={SLATE_GREY} /></TouchableOpacity>
                                              <TouchableOpacity style={styles.docHit}><Ionicons name="download-outline" size={20} color={BRAND_NAVY} /></TouchableOpacity>
                                          </View>
                                      </View>
                                      {idx < 2 && <View style={styles.divider} />}
                                  </View>
                              ))}
                          </View>
                      )}
                      
                      {activeProfileTab === 'Academic' && (
                          <View style={styles.detailCard}>
                              <View style={styles.infoRow}>
                                  <Text style={styles.infoLabel}>CURRENT GRADE</Text>
                                  <Text style={styles.infoVal}>Class 10 - {selectedUser?.section}</Text>
                              </View>
                              <View style={styles.divider} />
                              <View style={styles.infoRow}>
                                  <Text style={styles.infoLabel}>GPA</Text>
                                  <Text style={styles.infoVal}>3.8 / 4.0</Text>
                              </View>
                          </View>
                      )}
                  </View>
              </ScrollView>
          </View>
      </Modal>

    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  roleToggleWrap: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginHorizontal: 20,
      marginTop: 12,
      padding: 4,
      borderRadius: 12,
  },
  roleBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 10,
  },
  roleBtnActive: {
      backgroundColor: PURE_WHITE,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
  roleBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#CBD5E1',
  },
  roleBtnTextActive: {
      color: BRAND_NAVY,
      fontWeight: '700',
  },
  chipBarScroll: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 8,
  },
  chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: PURE_WHITE,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
  chipActive: {
      backgroundColor: BRAND_NAVY,
      borderColor: BRAND_NAVY,
  },
  chipText: {
      fontSize: 13,
      fontWeight: '600',
      color: SLATE_GREY,
  },
  chipTextActive: {
      color: PURE_WHITE,
  },
  listContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 40,
  },
  sectionHeader: {
      fontSize: 11,
      fontWeight: '800',
      color: '#94A3B8',
      letterSpacing: 1.2,
      marginBottom: 12,
      marginTop: 8,
  },
  userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: PURE_WHITE,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
  },
  avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 16,
  },
  userInfo: {
      flex: 1,
  },
  userName: {
      fontSize: 16,
      fontWeight: '700',
      color: BRAND_NAVY,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
      marginBottom: 4,
  },
  userSub: {
      fontSize: 13,
      color: SLATE_GREY,
  },
  menuHit: {
      padding: 8,
  },
  modalContainer: {
      flex: 1,
      backgroundColor: BG_LIGHT,
  },
  modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: BG_LIGHT,
  },
  modalCloseHit: {
      padding: 8,
  },
  modalHeaderText: {
      fontSize: 16,
      fontWeight: '700',
      color: BRAND_NAVY,
  },
  modalScroll: {
      paddingBottom: 40,
  },
  profileHero: {
      alignItems: 'center',
      paddingVertical: 32,
  },
  profileAvatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
      borderWidth: 3,
      borderColor: PURE_WHITE,
  },
  profileName: {
      fontSize: 24,
      fontWeight: '800',
      color: BRAND_NAVY,
      marginBottom: 12,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
  },
  statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#10B981',
      marginRight: 6,
  },
  statusText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#059669',
  },
  tabNavRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
      marginHorizontal: 20,
  },
  tabBtn: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginRight: 8,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
  },
  tabBtnActive: {
      borderBottomColor: BRAND_NAVY,
  },
  tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: SLATE_GREY,
  },
  tabTextActive: {
      color: BRAND_NAVY,
      fontWeight: '800',
  },
  tabContent: {
      paddingHorizontal: 24,
      paddingTop: 24,
  },
  detailCard: {
      backgroundColor: PURE_WHITE,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 2,
  },
  cardSectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: BRAND_NAVY,
      marginBottom: 16,
  },
  infoRow: {
      paddingVertical: 6,
  },
  infoLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: '#94A3B8',
      letterSpacing: 1.2,
      marginBottom: 4,
  },
  infoVal: {
      fontSize: 15,
      fontWeight: '600',
      color: DARK_TEXT,
  },
  divider: {
      height: 1,
      backgroundColor: '#F1F5F9',
      marginVertical: 12,
  },
  docRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  docIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: '#F1F5F9',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
  },
  docName: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: DARK_TEXT,
  },
  docActions: {
      flexDirection: 'row',
  },
  docHit: {
      padding: 8,
      marginLeft: 8,
  },
  calendarWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  calHeader: {
      width: '14.28%',
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '700',
      color: SLATE_GREY,
      marginBottom: 12,
  },
  calDayWrap: {
      width: '14.28%',
      alignItems: 'center',
      marginBottom: 16,
  },
  calDayText: {
      fontSize: 13,
      color: DARK_TEXT,
      fontWeight: '500',
      marginBottom: 4,
  },
  calDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
  }
});
