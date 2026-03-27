"use client";

import React, { useState } from 'react';
import { BarChart3, Trophy, Medal, CalendarDays, TrendingUp, Users, Award, ArrowLeft, Loader2, PieChart } from 'lucide-react';

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

// --- Helper for Mocking Class Details ---
const generateClassDetails = (className: string, overallAttendance: number) => {
  return {
    totalStudents: 40,
    present: Math.round(40 * (overallAttendance / 100)),
    absent: Math.round(40 * ((100 - overallAttendance) / 100 * 0.7)),
    leave: Math.round(40 * ((100 - overallAttendance) / 100 * 0.3)),
    students: Array.from({ length: 8 }).map((_, i) => ({
      rollNo: i + 1,
      name: `Student ${i + 1}`,
      attendance: (overallAttendance + (Math.random() * 10 - 5)).toFixed(1)
    })).sort((a, b) => Number(b.attendance) - Number(a.attendance))
  };
};

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const currentOverview = attendanceOverview[timeRange];
  
  // Calculate average attendance for the selected time range
  const averageAttendance = (currentOverview.reduce((acc, curr) => acc + curr.percentage, 0) / currentOverview.length).toFixed(1);

  if (selectedClass) {
    const classDataInfo = currentOverview.find(c => c.class === selectedClass);
    const classDetails = generateClassDetails(selectedClass, classDataInfo?.percentage || 90);
    const presentPercent = Math.round((classDetails.present / classDetails.totalStudents) * 100);
    const absentPercent = Math.round((classDetails.absent / classDetails.totalStudents) * 100);
    const leavePercent = Math.round((classDetails.leave / classDetails.totalStudents) * 100);

    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setSelectedClass(null)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-600" />
              Class {selectedClass} Detailed Analytics
            </h2>
            <p className="text-sm text-slate-500 mt-1">Detailed attendance breakdown and student records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pie Chart Card */}
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-lg font-bold text-slate-800 self-start w-full mb-6 text-center">Attendance Distribution</h3>
            
            {/* CSS Conic Gradient Pie/Donut Chart */}
            <div 
              className="w-48 h-48 rounded-full mb-8 relative flex items-center justify-center shadow-inner"
              style={{
                background: `conic-gradient(
                  #10b981 0% ${presentPercent}%, 
                  #ef4444 ${presentPercent}% ${presentPercent + absentPercent}%, 
                  #f59e0b ${presentPercent + absentPercent}% 100%
                )`
              }}
            >
              {/* Inner circle to make it a donut */}
              <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-3xl font-bold text-slate-800">{presentPercent}%</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Present</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 w-full">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600 font-medium">Present ({classDetails.present})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600 font-medium">Absent ({classDetails.absent})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-slate-600 font-medium">Leave ({classDetails.leave})</span>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="md:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Student Roster ({classDetails.totalStudents})
              </h3>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Roll No.</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student Name</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Overall Attendance</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classDetails.students.map((student: any) => (
                    <tr key={student.rollNo} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 text-sm text-slate-500">#{student.rollNo}</td>
                      <td className="px-6 py-3 text-sm font-medium text-slate-900">{student.name}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${Number(student.attendance) >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-700">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${Number(student.attendance) >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {Number(student.attendance) >= 90 ? 'Good' : 'Needs Review'}
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

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Analytics & Attendance
          </h2>
          <p className="text-sm text-slate-500 mt-1">Deep dive into school attendance metrics and top performers</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm self-start">
          {(['daily', 'weekly', 'monthly', 'yearly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                timeRange === range 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overviews & Best Students */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
                <Trophy className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">School Top Performer</p>
                <div className="flex items-end gap-3 mt-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold text-xl shrink-0 shadow-sm">
                    {schoolTopPerformer.imageInitial}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold leading-none mb-1">{schoolTopPerformer.name}</h3>
                    <p className="flex items-center gap-2 text-blue-100 text-sm">
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">Class {schoolTopPerformer.class}</span>
                      <span>•</span>
                      <span className="font-semibold">{schoolTopPerformer.attendance}% Attendance</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md border border-slate-200 p-6 flex flex-col justify-center shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Average
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">{averageAttendance}%</h3>
                <p className="text-sm text-slate-500 mt-1">Average school attendance</p>
              </div>
            </div>
          </div>

          {/* Class Overview Progress Bars */}
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Class Attendance Overview
              </h3>
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
          </div>

        </div>

        {/* Right Column: Class Leaders */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" />
                Class Leaders
              </h3>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto">
              <p className="text-xs text-slate-500 mb-4 px-1">Top student by attendance in each class</p>
              <div className="space-y-1">
                {classPerformers.map((student, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                        ${idx === 0 
                          ? 'bg-amber-100 text-amber-700' 
                          : idx === 1 
                            ? 'bg-slate-200 text-slate-600' 
                            : idx === 2 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{student.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Class {student.class}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-sm">
                        {student.attendance}%
                      </span>
                    </div>
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