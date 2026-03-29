"use client";

import React, { useState } from 'react';
import { BarChart3, Trophy, Medal, TrendingUp, Users, ArrowLeft, PieChart as PieChartIcon } from 'lucide-react';
import { Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

// --- Mock Data ---
const schoolTopPerformer = {
  name: "Aisha Patel",
  class: "10-A",
  attendance: 99.8,
  imageInitial: "A"
};

const classPerformers = [
  { class: "9-A", name: "Rahul Kumar", attendance: 98.5 },
  { class: "9-B", name: "Priya Sharma", attendance: 97.2 },
  { class: "10-A", name: "Aisha Patel", attendance: 99.8 },
  { class: "10-B", name: "Kabir Singh", attendance: 98.1 },
  { class: "11-Sci", name: "Sneha Gupta", attendance: 96.5 },
  { class: "11-Com", name: "Rohan Verma", attendance: 97.8 },
  { class: "12-Sci", name: "Ananya Desai", attendance: 95.9 },
  { class: "12-Com", name: "Vikram Malhotra", attendance: 98.0 }
];

const attendanceOverview = {
  daily: [
    { class: "9-A", percentage: 92 }, { class: "9-B", percentage: 88 },
    { class: "10-A", percentage: 95 }, { class: "10-B", percentage: 91 },
    { class: "11-Sci", percentage: 89 }, { class: "11-Com", percentage: 93 },
    { class: "12-Sci", percentage: 85 }, { class: "12-Com", percentage: 90 }
  ],
  weekly: [
    { class: "9-A", percentage: 93 }, { class: "9-B", percentage: 90 },
    { class: "10-A", percentage: 96 }, { class: "10-B", percentage: 92 },
    { class: "11-Sci", percentage: 91 }, { class: "11-Com", percentage: 94 },
    { class: "12-Sci", percentage: 87 }, { class: "12-Com", percentage: 91 }
  ],
  monthly: [
    { class: "9-A", percentage: 94 }, { class: "9-B", percentage: 91 },
    { class: "10-A", percentage: 97 }, { class: "10-B", percentage: 93 },
    { class: "11-Sci", percentage: 90 }, { class: "11-Com", percentage: 95 },
    { class: "12-Sci", percentage: 88 }, { class: "12-Com", percentage: 92 }
  ],
  yearly: [
    { class: "9-A", percentage: 95 }, { class: "9-B", percentage: 92 },
    { class: "10-A", percentage: 98 }, { class: "10-B", percentage: 94 },
    { class: "11-Sci", percentage: 92 }, { class: "11-Com", percentage: 96 },
    { class: "12-Sci", percentage: 89 }, { class: "12-Com", percentage: 93 }
  ]
};

const studentNames = [
  "Arjun Mehta", "Divya Nair", "Sahil Choudhary", "Pooja Iyer",
  "Rajan Sood", "Mansi Verma", "Deepak Joshi", "Ritika Bose",
  "Karan Sharma", "Anjali Pillai", "Nikhil Rao", "Shreya Gupta"
];

// --- Seeded random to keep data stable across renders ---
const seededRand = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const generateClassDetails = (className: string, overallAttendance: number) => {
  const total = 40;
  const present = Math.round(total * (overallAttendance / 100));
  const absLeave = total - present;
  const absent = Math.round(absLeave * 0.7);
  const leave = absLeave - absent;
  const students = Array.from({ length: 12 }).map((_, i) => {
    const offset = seededRand(i + className.charCodeAt(0)) * 12 - 6;
    const att = Math.min(100, Math.max(60, overallAttendance + offset));
    return {
      rollNo: i + 1,
      name: studentNames[i] || `Student ${i + 1}`,
      attendance: att.toFixed(1),
    };
  }).sort((a, b) => Number(b.attendance) - Number(a.attendance));
  return { totalStudents: total, present, absent, leave, students };
};

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const currentOverview = attendanceOverview[timeRange];
  const averageAttendance = (currentOverview.reduce((acc, curr) => acc + curr.percentage, 0) / currentOverview.length).toFixed(1);

  // ── CLASS DETAIL VIEW ──────────────────────────────────────────────────────
  if (selectedClass) {
    const classDataInfo = currentOverview.find(c => c.class === selectedClass);
    const classDetails = generateClassDetails(selectedClass, classDataInfo?.percentage ?? 90);
    const donutData = [
      { name: 'Present', value: classDetails.present, fill: '#10b981' },
      { name: 'Absent',  value: classDetails.absent,  fill: '#ef4444' },
      { name: 'On Leave', value: classDetails.leave,  fill: '#f59e0b' },
    ];
    const presentPct = Math.round((classDetails.present / classDetails.totalStudents) * 100);

    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Back header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedClass(null)}
            className="p-2 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Class {selectedClass} — Detailed Analytics</h2>
            <p className="text-sm text-slate-500 mt-0.5">Attendance breakdown and student roster</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Donut chart */}
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">Attendance Split</h3>

            <div className="flex-1 w-full" style={{ minHeight: 220 }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="45%"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: '#475569', fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Summary pills */}
            <div className="mt-4 space-y-2">
              {donutData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.fill }} />
                    <span className="text-slate-600 font-medium">{d.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{d.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                <span className="text-slate-500">Present Rate</span>
                <span className={`font-extrabold ${presentPct >= 90 ? 'text-emerald-600' : presentPct >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                  {presentPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Student table */}
          <div className="md:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-md">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                Student Roster — {classDetails.totalStudents} students
              </h3>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sorted by attendance</span>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classDetails.students.map((student: any) => (
                    <tr key={student.rollNo} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-sm text-slate-400 font-medium">#{student.rollNo}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-slate-800">{student.name}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${Number(student.attendance) >= 90 ? 'bg-emerald-500' : Number(student.attendance) >= 80 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          Number(student.attendance) >= 90
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : Number(student.attendance) >= 80
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {Number(student.attendance) >= 90 ? 'Good' : Number(student.attendance) >= 80 ? 'At Risk' : 'Critical'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN OVERVIEW ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header & time filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Analytics & Attendance
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">School-wide attendance metrics and class leaders</p>
        </div>

        <div className="flex bg-white rounded-md p-1 border border-slate-200 shadow-sm self-start gap-0.5">
          {(['daily', 'weekly', 'monthly', 'yearly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-[13px] font-semibold rounded-md capitalize transition-colors ${
                timeRange === range
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Stats + Bar Chart ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Top performer card */}
            <div className="bg-[#1a2b4c] rounded-md p-5 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-4 top-4 opacity-10">
                <Trophy className="w-20 h-20" />
              </div>
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-3">School Top Performer</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/15 border border-white/20 rounded-full flex items-center justify-center text-white font-extrabold text-lg shrink-0">
                  {schoolTopPerformer.imageInitial}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold leading-tight">{schoolTopPerformer.name}</h3>
                  <p className="text-sm text-blue-200 mt-0.5">
                    Class {schoolTopPerformer.class}
                    <span className="ml-2 text-emerald-300 font-bold">{schoolTopPerformer.attendance}% attendance</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Avg attendance card */}
            <div className="bg-white rounded-md border border-slate-200 p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                  {timeRange}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Avg. School Attendance</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{averageAttendance}</span>
                  <span className="text-xl font-bold text-slate-400">%</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Across all {currentOverview.length} classes</p>
              </div>
            </div>
          </div>

          {/* Class Overview Progress Bars */}
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Class Attendance Overview
              </h3>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded cursor-default">
                Click a class to drill down →
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {currentOverview.map((item, idx) => (
                <div
                  key={idx}
                  className="space-y-2 cursor-pointer group"
                  onClick={() => setSelectedClass(item.class)}
                  title={`Click to view Class ${item.class} details`}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Class {item.class}</span>
                    <span className={`font-bold ${item.percentage >= 95 ? 'text-emerald-600' : item.percentage >= 90 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden group-hover:bg-slate-200 transition-colors">
                    <div
                      className={`h-full rounded-full transition-all group-hover:brightness-110 ${item.percentage >= 95 ? 'bg-emerald-500' : item.percentage >= 90 ? 'bg-blue-500' : 'bg-amber-500'}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-5 mt-8 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                <span className="text-xs text-slate-500 font-medium">≥ 95% Excellent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shrink-0" />
                <span className="text-xs text-slate-500 font-medium">≥ 90% Good</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shrink-0" />
                <span className="text-xs text-slate-500 font-medium">&lt; 90% Needs Attention</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Class Leaders ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Class Leaders</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-[11px] font-bold text-slate-400 mb-3 px-1 uppercase tracking-wider">Top student per class · by attendance</p>
              <div className="space-y-1">
                {classPerformers.map((student, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedClass(student.class)}
                    title={`View Class ${student.class}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        idx === 0 ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : idx === 1 ? 'bg-slate-200 text-slate-700 border border-slate-300'
                        : idx === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{student.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Class {student.class}</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-600">{student.attendance}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}