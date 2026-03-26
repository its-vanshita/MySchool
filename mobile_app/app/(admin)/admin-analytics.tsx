import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Dimensions,
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
const TREND_UP = '#10B981';
const TREND_FLAT = '#F59E0B';
const TREND_DOWN = '#EF4444';

const { width } = Dimensions.get('window');

type PeriodType = 'Today' | 'Week' | 'Month';

export default function AdminAnalytics() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState<PeriodType>('Today');

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" backgroundColor="transparent" translucent />
      
      {/* ── Midnight Navy Header Area ── */}
      <View style={[styles.headerArea, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTitleRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color={PURE_WHITE} />
            </TouchableOpacity>
            <View style={styles.headerIconBox}>
               <Ionicons name="analytics" size={24} color={PURE_WHITE} />
            </View>
            <View style={styles.headerTextWrap}>
                <Text style={styles.headerTitle}>School Performance</Text>
                <Text style={styles.headerSubTitle}>Real-time Intelligence</Text>
            </View>
        </View>

        {/* Floating Period Selector */}
        <View style={styles.periodSelectorWrap}>
           {(['Today', 'Week', 'Month'] as PeriodType[]).map((period) => (
             <TouchableOpacity 
                key={period} 
                style={[styles.periodBtn, activePeriod === period && styles.periodBtnActive]}
                onPress={() => setActivePeriod(period)}
                activeOpacity={0.8}
             >
                <Text style={[styles.periodBtnText, activePeriod === period && styles.periodBtnTextActive]}>
                   {period}
                </Text>
             </TouchableOpacity>
           ))}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Performance Cards (Horizontal Scroll) ── */}
        <ScrollView 
           horizontal 
           showsHorizontalScrollIndicator={false} 
           contentContainerStyle={styles.horizontalScrollPad}
        >
            {/* Attendance Card */}
            <View style={styles.perfCard}>
               <View style={styles.perfTopRow}>
                   <View style={styles.perfIconWrap}>
                       <Ionicons name="people-outline" size={20} color={BRAND_NAVY} />
                   </View>
                   <View style={styles.trendWrap}>
                       <Ionicons name="arrow-up" size={12} color={TREND_UP} />
                       <Text style={[styles.trendText, { color: TREND_UP }]}>0.8%</Text>
                   </View>
               </View>
               <Text style={styles.perfValue}>94.2%</Text>
               <Text style={styles.perfLabel}>Total Attendance</Text>
               
               {/* Decorative Sparkline (CSS simulation) */}
               <View style={styles.sparkLineWrap}>
                   <View style={styles.sparkBaseBar}>
                       <View style={[styles.sparkFill, { width: '85%', backgroundColor: '#3B82F6' }]} />
                   </View>
               </View>
            </View>

            {/* Academic Card */}
            <View style={styles.perfCard}>
               <View style={styles.perfTopRow}>
                   <View style={styles.perfIconWrap}>
                       <Ionicons name="school-outline" size={20} color={BRAND_NAVY} />
                   </View>
                   <View style={[styles.trendWrap, { backgroundColor: '#FEF3C7' }]}>
                       <Text style={[styles.trendText, { color: TREND_FLAT, marginLeft: 0 }]}>— Flat</Text>
                   </View>
               </View>
               <Text style={styles.perfValue}>78<Text style={styles.perfValueSuffix}>/100</Text></Text>
               <Text style={styles.perfLabel}>Average Marks</Text>
               
               <View style={styles.sparkLineWrap}>
                   <View style={styles.sparkBaseBar}>
                       <View style={[styles.sparkFill, { width: '78%', backgroundColor: TREND_FLAT }]} />
                   </View>
               </View>
            </View>

            {/* Engagement Card */}
            <View style={styles.perfCard}>
               <View style={styles.perfTopRow}>
                   <View style={styles.perfIconWrap}>
                       <Ionicons name="chatbubbles-outline" size={20} color={BRAND_NAVY} />
                   </View>
                   <View style={[styles.trendWrap, { backgroundColor: '#DCFCE7' }]}>
                       <Ionicons name="arrow-up" size={12} color="#16A34A" />
                       <Text style={[styles.trendText, { color: "#16A34A" }]}>3.2%</Text>
                   </View>
               </View>
               <Text style={styles.perfValue}>85%</Text>
               <Text style={styles.perfLabel}>Teacher Activity</Text>
               
               <View style={styles.sparkLineWrap}>
                   <View style={styles.sparkBaseBar}>
                       <View style={[styles.sparkFill, { width: '85%', backgroundColor: '#16A34A' }]} />
                   </View>
               </View>
            </View>
        </ScrollView>

        {/* ── Visual Analytics Section ── */}
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Visual Analytics</Text>
               <TouchableOpacity>
                   <Ionicons name="ellipsis-horizontal" size={20} color={SLATE_GREY} />
               </TouchableOpacity>
            </View>

            {/* Attendance Heatmap */}
            <View style={styles.analyticsCard}>
               <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderTitle}>Wing Attendance Heatmap</Text>
                  <Ionicons name="grid-outline" size={18} color={BRAND_NAVY} />
               </View>
               <View style={styles.heatmapGrid}>
                   {['Primary', 'Secondary', 'Higher'].map((wing, i) => (
                       <View key={wing} style={styles.heatmapRow}>
                           <Text style={styles.heatmapLabel}>{wing}</Text>
                           <View style={styles.heatmapBlocksWrap}>
                               {[85, 92, 98, 95, 88].map((val, idx) => (
                                   <View 
                                     key={idx} 
                                     style={[
                                         styles.heatmapBlock, 
                                         { backgroundColor: val > 94 ? '#10B981' : val > 89 ? '#34D399' : '#6EE7B7' }
                                     ]} 
                                   />
                               ))}
                           </View>
                       </View>
                   ))}
               </View>
            </View>

            {/* Performance Bar Chart (Class 1-12) */}
            <View style={styles.analyticsCard}>
               <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderTitle}>Avg. Scores by Class Level</Text>
                  <Ionicons name="bar-chart-outline" size={18} color={BRAND_NAVY} />
               </View>
               
               <View style={styles.chartContainer}>
                  {[
                      { lbl: 'Class 10', val: 88, w: '88%' },
                      { lbl: 'Class 12', val: 84, w: '84%' },
                      { lbl: 'Class 8',  val: 76, w: '76%' },
                      { lbl: 'Class 5',  val: 72, w: '72%' },
                      { lbl: 'Class 2',  val: 81, w: '81%' },
                  ].map((item, idx) => (
                      <View key={item.lbl} style={styles.barChartRow}>
                          <Text style={styles.barChartLabel}>{item.lbl}</Text>
                          <View style={styles.barChartBarWrap}>
                              <View style={[styles.barChartFill, { width: item.w as any, backgroundColor: idx % 2 === 0 ? BRAND_NAVY : '#60A5FA' }]} />
                          </View>
                          <Text style={styles.barChartValue}>{item.val}</Text>
                      </View>
                  ))}
               </View>
            </View>

        </View>

        {/* ── Command Center: Key Alerts ── */}
        <View style={styles.sectionContainerBottom}>
            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Key Alerts</Text>
               <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>LIVE</Text></View>
            </View>

            <View style={[styles.alertCard, styles.alertRed]}>
                <View style={[styles.alertIconPill, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="warning-outline" size={20} color={TREND_DOWN} />
                </View>
                <View style={styles.alertTextWrap}>
                    <Text style={styles.alertTitle}>Low Attendance Alert</Text>
                    <Text style={styles.alertDesc}>Class 9-B is currently operating at 74% attendance.</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
            </View>

            <View style={[styles.alertCard, styles.alertGreen]}>
                <View style={[styles.alertIconPill, { backgroundColor: '#D1FAE5' }]}>
                    <Ionicons name="trophy-outline" size={20} color={TREND_UP} />
                </View>
                <View style={styles.alertTextWrap}>
                    <Text style={styles.alertTitle}>Academic Milestone</Text>
                    <Text style={styles.alertDesc}>100% Syllabus Completion verified in Grade 12.</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#6EE7B7" />
            </View>

        </View>

      </ScrollView>
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
  backButton: {
    marginRight: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerIconBox: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  headerTextWrap: {
      flex: 1,
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: 0.5,
  },
  headerSubTitle: {
      color: '#94A3B8',
      fontSize: 13,
      fontWeight: '500',
      marginTop: 2,
  },
  periodSelectorWrap: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginHorizontal: 20,
      padding: 4,
      borderRadius: 12,
  },
  periodBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 10,
  },
  periodBtnActive: {
      backgroundColor: PURE_WHITE,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
  periodBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#CBD5E1',
  },
  periodBtnTextActive: {
      color: BRAND_NAVY,
      fontWeight: '700',
  },
  scrollContent: {
      paddingBottom: 40,
  },
  horizontalScrollPad: {
      paddingHorizontal: 12,
      paddingTop: 24,
      paddingBottom: 16,
  },
  perfCard: {
      width: width * 0.44,
      backgroundColor: PURE_WHITE,
      borderRadius: 20,
      padding: 16,
      marginHorizontal: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 4,
  },
  perfTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
  },
  perfIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
  },
  trendWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
  },
  trendText: {
      fontSize: 11,
      fontWeight: '700',
      marginLeft: 4,
  },
  perfValue: {
      fontSize: 26,
      fontWeight: '800',
      color: DARK_TEXT,
      marginBottom: 4,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  perfValueSuffix: {
      fontSize: 14,
      color: SLATE_GREY,
      fontWeight: '600',
  },
  perfLabel: {
      fontSize: 13,
      color: SLATE_GREY,
      fontWeight: '600',
      marginBottom: 16,
  },
  sparkLineWrap: {
      height: 4,
      justifyContent: 'center',
  },
  sparkBaseBar: {
      height: 4,
      backgroundColor: '#F1F5F9',
      borderRadius: 2,
      overflow: 'hidden',
  },
  sparkFill: {
      height: '100%',
      borderRadius: 2,
  },
  sectionContainer: {
      paddingHorizontal: 20,
      marginTop: 8,
  },
  sectionContainerBottom: {
      paddingHorizontal: 20,
      marginTop: 24,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: BRAND_NAVY,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  liveBadge: {
      backgroundColor: '#FEE2E2',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
  },
  liveBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      color: TREND_DOWN,
      letterSpacing: 1,
  },
  analyticsCard: {
      backgroundColor: PURE_WHITE,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 3,
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
  },
  cardHeaderTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: DARK_TEXT,
      letterSpacing: 0.2,
  },
  heatmapGrid: {
      gap: 12,
  },
  heatmapRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  heatmapLabel: {
      width: 70,
      fontSize: 12,
      color: SLATE_GREY,
      fontWeight: '600',
  },
  heatmapBlocksWrap: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  heatmapBlock: {
      width: 32,
      height: 32,
      borderRadius: 8,
  },
  chartContainer: {
      gap: 14,
  },
  barChartRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  barChartLabel: {
      width: 60,
      fontSize: 12,
      fontWeight: '600',
      color: SLATE_GREY,
  },
  barChartBarWrap: {
      flex: 1,
      height: 8,
      backgroundColor: '#F1F5F9',
      borderRadius: 4,
      marginHorizontal: 12,
      overflow: 'hidden',
  },
  barChartFill: {
      height: '100%',
      borderRadius: 4,
  },
  barChartValue: {
      width: 25,
      fontSize: 12,
      fontWeight: '700',
      color: DARK_TEXT,
      textAlign: 'right',
  },
  alertCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 1,
  },
  alertRed: {
      backgroundColor: '#FEF2F2',
      borderColor: '#FEE2E2',
  },
  alertGreen: {
      backgroundColor: '#F0FDF4',
      borderColor: '#D1FAE5',
  },
  alertIconPill: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
  },
  alertTextWrap: {
      flex: 1,
      paddingRight: 12,
  },
  alertTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: BRAND_NAVY,
      marginBottom: 4,
  },
  alertDesc: {
      fontSize: 13,
      color: SLATE_GREY,
      lineHeight: 18,
  }
});
