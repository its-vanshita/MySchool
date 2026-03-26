import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';

const { width } = Dimensions.get('window');

const SUBJECTS = [
  {
    id: '1',
    subject: 'Mathematics',
    score: 94,
    max: 100,
    classAvg: 76,
    trend: 'up',
    grade: 'A+',
    colors: ['#3B82F6', '#60A5FA'],
    bg: 'rgba(59, 130, 246, 0.1)'
  },
  {
    id: '2',
    subject: 'Science',
    score: 88,
    max: 100,
    classAvg: 72,
    trend: 'up',
    grade: 'A',
    colors: ['#10B981', '#34D399'],
    bg: 'rgba(16, 185, 129, 0.1)'
  },
  {
    id: '3',
    subject: 'English',
    score: 85,
    max: 100,
    classAvg: 74,
    trend: 'up',
    grade: 'A',
    colors: ['#F59E0B', '#FBBF24'],
    bg: 'rgba(245, 158, 11, 0.1)'
  },
  {
    id: '4',
    subject: 'Hindi',
    score: 78,
    max: 100,
    classAvg: 80,
    trend: 'down',
    grade: 'B+',
    colors: ['#8B5CF6', '#A78BFA'],
    bg: 'rgba(139, 92, 246, 0.1)'
  },
  {
    id: '5',
    subject: 'Social Studies',
    score: 92,
    max: 100,
    classAvg: 75,
    trend: 'up',
    grade: 'A+',
    colors: ['#EC4899', '#F472B6'],
    bg: 'rgba(236, 72, 153, 0.1)'
  }
];

export default function AcademicPerformanceScreen() {
  const overallPercent = 87;
  const radius = 54;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercent / 100) * circumference;

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Overall Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>OVERALL PERFORMANCE</Text>
          <View style={styles.heroSection}>
            <View style={styles.progressContainer}>
               {/* Soft Inner Glow Wrapper */}
               <View style={styles.glowShadow}>
                  <Svg width={140} height={140}>
                    <Defs>
                      <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#3B82F6" />
                        <Stop offset="100%" stopColor="#14B8A6" />
                      </SvgLinearGradient>
                    </Defs>
                    {/* Background Circle */}
                    <Circle
                      cx={70}
                      cy={70}
                      r={radius}
                      stroke="#F1F5F9"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <Circle
                      cx={70}
                      cy={70}
                      r={radius}
                      stroke="url(#grad)"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      rotation="-90"
                      origin="70, 70"
                    />
                  </Svg>
               </View>
               <View style={styles.centerTextWrap}>
                 <Text style={styles.centerPercent}>{overallPercent}%</Text>
                 <Text style={styles.centerLabel}>SCORE</Text>
               </View>
            </View>

            <View style={styles.dataPointsCol}>
               <View style={styles.dataBox}>
                  <Text style={styles.dataValue}>508<Text style={styles.dataMax}>/600</Text></Text>
                  <Text style={styles.dataLabel}>TOTAL MARKS</Text>
               </View>
               <View style={[styles.dataBox, { marginTop: 16 }]}>
                  <Text style={styles.dataValue}>Grade A</Text>
                  <Text style={styles.dataLabel}>CLASS RANK: 4TH</Text>
               </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Subject-wise Feed</Text>

        {/* Subject Cards */}
        {SUBJECTS.map((sub, index) => (
          <View key={index} style={styles.subjectCard}>
             <View style={styles.subHeader}>
                <Text style={styles.subjName}>{sub.subject}</Text>
                <View style={[styles.gradePill, { backgroundColor: sub.bg }]}>
                   <Text style={[styles.gradeText, { color: sub.colors[0] }]}>{sub.grade}</Text>
                </View>
             </View>

             <View style={styles.scoreRow}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                   <Text style={styles.scoreNumber}>{sub.score}</Text>
                   <Text style={styles.scoreMax}>/100</Text>
                </View>
                <View style={styles.richDetail}>
                   <Text style={styles.avgText}>(Class Avg: {sub.classAvg}%)</Text>
                   {sub.trend === 'up' ? (
                       <Ionicons name="arrow-up" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                   ) : (
                       <Ionicons name="arrow-down" size={14} color="#EF4444" style={{ marginLeft: 4 }} />
                   )}
                </View>
             </View>

             {/* Elegant Progress Bar */}
             <View style={styles.barTrack}>
                <LinearGradient
                   colors={sub.colors as any}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                   style={[styles.barFill, { width: `${(sub.score / sub.max) * 100}%` }]}
                />
             </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowShadow: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  centerTextWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPercent: {
    fontSize: 28,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  centerLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: -2,
  },
  dataPointsCol: {
    flex: 1,
    paddingLeft: 24,
  },
  dataBox: {
    justifyContent: 'center',
  },
  dataValue: {
    fontSize: 20,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  dataMax: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  dataLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND_NAVY,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  // Feed Cards
  subjectCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  gradePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  scoreMax: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 2,
  },
  richDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  avgText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
