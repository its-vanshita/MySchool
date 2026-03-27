"use client";

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, MapPin, Clock, Tag, ExternalLink } from 'lucide-react';

const EVENTS = [
  { id: 1, title: "Annual Sports Day", date: "2026-03-25", time: "09:00 AM", location: "School Playground", type: "Main", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: 2, title: "Half-Yearly Exams", date: "2026-03-27", time: "08:30 AM", location: "Senior Wing", type: "Academic", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: 3, title: "Teachers-Parent Meet", date: "2026-03-29", time: "10:00 AM", location: "Auditorium", type: "Institutional", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: 4, title: "Science Fair 2026", date: "2026-03-31", time: "11:00 AM", location: "Exhibition Hall", type: "Co-curricular", color: "bg-orange-100 text-orange-700 border-orange-200" },
];

export default function AdminEventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              Institutional Events Calendar
            </h2>
            <p className="text-[13px] text-slate-500 font-medium mt-1">Institutional schedule, holidays and key event tracking</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 border border-slate-200 rounded-xl shadow-sm self-stretch md:self-auto">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-bold text-slate-800 px-4 min-w-[140px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-[13px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 self-stretch md:self-auto uppercase tracking-wide">
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Mock Calendar View */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
              ))}
              
              {/* Simple Mock Month Grid (March 2026 starts on Sunday) */}
              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `2026-03-${dayNum.toString().padStart(2, '0')}`;
                const hasEvent = EVENTS.some(e => e.date === dateStr);
                const event = EVENTS.find(e => e.date === dateStr);
                
                return (
                  <div key={i} className={`min-h-[100px] p-2 border border-slate-100 rounded-xl relative group transition-all ${hasEvent ? 'bg-blue-50/20 border-blue-100' : 'bg-white hover:bg-slate-50'}`}>
                    <span className={`text-[13px] font-bold ${hasEvent ? 'text-blue-700' : 'text-slate-500'}`}>{dayNum}</span>
                    {hasEvent && (
                      <div className={`mt-2 p-1.5 rounded-lg border text-[10px] font-bold leading-tight ${event?.color} animate-in fade-in zoom-in duration-300`}>
                        {event?.title}
                      </div>
                    )}
                    {dayNum === 27 && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Event Details list */}
          <div className="space-y-6">
            <h3 className="text-[14px] font-bold text-slate-700 border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center justify-between">
              Upcoming Events
              <span className="bg-red-100 text-red-700 text-[10px] py-1 px-2.5 rounded-full font-black">4 Active</span>
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {EVENTS.map(event => (
                <div key={event.id} className="p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${event.color}`}>{event.type}</span>
                      <h4 className="text-[15px] font-bold text-slate-800 mt-2 leading-tight group-hover:text-blue-700 transition-colors">{event.title}</h4>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors cursor-pointer" />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium pt-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      {event.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-xl shadow-blue-100 relative overflow-hidden group border border-blue-400/20">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
              <h4 className="text-[14px] font-bold mb-1 relative z-10">Export Calendar</h4>
              <p className="text-[11px] text-blue-100 font-medium mb-4 relative z-10">Sync with G-Suite or Outlook for institutional compliance</p>
              <button className="bg-white text-blue-700 px-6 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-blue-50 transition-colors relative z-10 shadow-sm shadow-blue-800/10">
                Download ICS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
