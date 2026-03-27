"use client";

import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, MapPin, Clock, ChevronRight,
  Bell, AlertTriangle, ArrowUpRight, CheckCircle
} from 'lucide-react';

export default function DashboardContent({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const nav = (tab: string) => { if (setActiveTab) setActiveTab(tab); };

  const metrics = [
    { label: 'Classes Today',    value: '6',   detail: '2 remaining',         color: 'text-blue-600',   tab: 'Timetable'  },
    { label: 'Total Students',   value: '142',  detail: 'Across 3 classes',    color: 'text-slate-700',  tab: 'My Class'   },
    { label: 'Avg. Attendance',  value: '94%',  detail: 'This month',          color: 'text-emerald-600',tab: 'Attendance' },
    { label: 'Marks Pending',    value: '2',    detail: 'Assignments due',     color: 'text-amber-600',  tab: 'Add Marks'  },
  ];

  const todaySchedule = [
    { time: '08:00 – 08:45', subject: 'Mathematics',   cls: '10-A', room: 'R-102', done: true },
    { time: '09:00 – 09:45', subject: 'Mathematics',   cls: '10-B', room: 'R-102', done: true },
    { time: '10:00 – 10:45', subject: 'Applied Math',  cls: '11-Sci', room: 'Lab-2', done: false, now: true },
    { time: '11:00 – 11:45', subject: 'Mathematics',   cls: '10-A', room: 'R-102', done: false },
  ];

  const actionItems = [
    { text: 'Submit Unit Test 1 marks for Class 10-A', urgency: 'high', tab: 'Add Marks',    deadline: 'Tomorrow' },
    { text: 'Update Week-5 lesson plan for Applied Math', urgency: 'med', tab: 'Lesson Plan', deadline: 'In 2 days' },
  ];

  const notices = [
    { from: 'Principal Office', title: 'Staff Meeting at 4 PM Today', time: '1 hr ago', tag: 'Admin' },
    { from: 'You',              title: 'Reminder: Assignment Due (10-A)', time: 'Yesterday', tag: 'Sent' },
  ];

  return (
    <div className="max-w-[1200px] pb-10 space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">{currentDate}</p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Good morning, Mr. Sharma</h1>
            <p className="text-sm text-slate-500 mt-0.5">You have <span className="font-semibold text-slate-700">6 classes</span> and <span className="font-semibold text-slate-700">1 invigilation duty</span> today.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => nav('Attendance')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors shadow-sm">
              Take Attendance
            </button>
            <button onClick={() => nav('Notices')} className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-md transition-colors">
              Send Notice
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <button key={i} onClick={() => nav(m.tab)} className="bg-white border border-slate-200 rounded-md p-4 text-left hover:border-slate-300 hover:shadow-sm transition-all group">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs font-semibold text-slate-700 mt-1">{m.label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{m.detail}</p>
            <div className="flex items-center gap-1 mt-3 text-[11px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              View <ArrowUpRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {/* Main 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Today's Schedule — 3 cols */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-slate-400" /> Today's Schedule
            </h2>
            <button onClick={() => nav('Timetable')} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Full View <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            {todaySchedule.map((slot, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-3.5 border-b border-slate-50 last:border-b-0 transition-colors ${slot.now ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'}`}>
                {/* Status indicator */}
                <div className="shrink-0 flex flex-col items-center w-3">
                  {slot.done
                    ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    : slot.now
                      ? <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse shadow-sm shadow-blue-300"></span>
                      : <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-300"></span>
                  }
                </div>
                {/* Time */}
                <p className={`text-xs font-mono font-bold w-28 shrink-0 ${slot.done ? 'text-slate-300' : slot.now ? 'text-blue-700' : 'text-slate-600'}`}>
                  {slot.time}
                </p>
                {/* Subject */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${slot.done ? 'text-slate-400' : 'text-slate-800'}`}>{slot.subject}</p>
                  <p className={`text-xs mt-0.5 ${slot.done ? 'text-slate-300' : 'text-slate-400'}`}>Class {slot.cls}</p>
                </div>
                {/* Room */}
                <p className={`text-xs font-medium shrink-0 flex items-center gap-1 ${slot.done ? 'text-slate-300' : 'text-slate-500'}`}>
                  <MapPin className="w-3 h-3" /> {slot.room}
                </p>
                {/* Now badge */}
                {slot.now && (
                  <span className="shrink-0 text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white px-1.5 py-0.5 rounded">Now</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Action Items */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Pending Actions
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {actionItems.map((item, i) => (
                <button key={i} onClick={() => nav(item.tab)} className="w-full text-left px-5 py-3.5 hover:bg-amber-50/50 transition-colors flex items-start justify-between gap-3 group">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-amber-900">{item.text}</p>
                    <p className={`text-[11px] mt-1 font-medium ${item.urgency === 'high' ? 'text-red-500' : 'text-amber-600'}`}>
                      Due: {item.deadline}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 shrink-0 mt-0.5 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Duty */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Next Invigilation Duty
              </h2>
            </div>
            <div className="px-5 py-4 flex gap-4 items-center">
              <div className="shrink-0 text-center w-12 border border-slate-200 rounded-md py-1 px-1 bg-slate-50">
                <p className="text-[9px] font-black text-slate-400 uppercase">Oct</p>
                <p className="text-xl font-bold text-slate-800 leading-none mt-0.5">15</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Mid-Term Examinations</p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3"/> Hall B</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] bg-purple-100 text-purple-700 font-black uppercase tracking-wider px-1.5 py-0.5 rounded">Primary Invigilator</span>
                </div>
              </div>
              <button onClick={() => nav('Datesheet')} className="ml-auto shrink-0 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notices */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" /> Notice Board
              </h2>
              <button onClick={() => nav('Notices')} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {notices.map((n, i) => (
                <button key={i} onClick={() => nav('Notices')} className="w-full text-left px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${n.tag === 'Admin' ? 'text-blue-600' : 'text-emerald-600'}`}>{n.tag}</span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{n.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">— {n.from}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
