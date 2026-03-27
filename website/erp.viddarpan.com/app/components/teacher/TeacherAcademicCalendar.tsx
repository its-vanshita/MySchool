"use client";

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Users, 
  Presentation, 
  BookOpen, 
  X, 
  Filter,
  Check,
  Video,
  Clock,
  Pin
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Holiday' | 'Exam' | 'Meeting' | 'Activity' | 'Personal';
  audience: 'student' | 'teacher' | 'all';
  description?: string;
  time?: string;
  location?: string;
}

export default function TeacherAcademicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<{date: string, events: CalendarEvent[]} | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [showFilter, setShowFilter] = useState(false);

  // Mock events for the teacher
  const [events] = useState<CalendarEvent[]>([
    { id: '1', title: 'Graduation Day Planning', date: '2026-03-28', type: 'Meeting', audience: 'teacher', time: '10:00 AM', location: 'Conference Hall' },
    { id: '2', title: 'Holi Break', date: '2026-03-29', type: 'Holiday', audience: 'all' },
    { id: '3', title: 'Staff Briefing', date: '2026-03-31', type: 'Meeting', audience: 'teacher', time: '08:30 AM', location: 'Staff Room' },
    { id: '4', title: 'Parent-Teacher Meet (X-A)', date: '2026-04-05', type: 'Meeting', audience: 'all', time: '09:00 AM - 01:00 PM', location: 'Classroom X-A' },
    { id: '5', title: 'Unit Test I Starts', date: '2026-04-10', type: 'Exam', audience: 'all' },
    { id: '6', title: 'Curriculum Workshop', date: '2026-04-12', type: 'Activity', audience: 'teacher', time: '02:00 PM', location: 'Virtual' },
    { id: '7', title: 'Easter Sunday', date: '2026-04-05', type: 'Holiday', audience: 'all' },
  ]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesType = filterType === 'All' || e.type === filterType;
      // Teachers see everything relevant to them (teacher + all)
      const matchesAudience = e.audience === 'teacher' || e.audience === 'all';
      return matchesType && matchesAudience;
    });
  }, [events, filterType]);

  const getEventsForDate = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.date === formattedDate);
  };

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'Holiday': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500';
      case 'Exam': return 'bg-rose-50 text-rose-700 border-rose-100 ring-rose-500';
      case 'Meeting': return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500';
      case 'Activity': return 'bg-indigo-50 text-indigo-700 border-indigo-100 ring-indigo-500';
      default: return 'bg-slate-50 text-slate-700 border-slate-100 ring-slate-500';
    }
  };

  const getDotColor = (type: string) => {
    switch(type) {
      case 'Holiday': return 'bg-emerald-500';
      case 'Exam': return 'bg-rose-500';
      case 'Meeting': return 'bg-blue-500';
      case 'Activity': return 'bg-indigo-500';
      default: return 'bg-slate-400';
    }
  };

  const remainingCells = 42 - (firstDayOfMonth + daysInMonth);

  const openDayDetails = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length > 0) {
      setSelectedDayEvents({ date: formattedDate, events: dayEvents });
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-blue-600" />
            Academic Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">View school events, staff meetings, and holidays</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            <Filter className="w-4 h-4" />
            {filterType === 'All' ? 'Filter Events' : filterType}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Calendar View */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm active:scale-90">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())} 
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors shadow-sm active:scale-95 mx-1"
              >
                Today
              </button>
              <button onClick={nextMonth} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm active:scale-90">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 bg-slate-100/50 gap-px flex-1">
            {dayNames.map(day => (
              <div key={day} className="bg-white py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
            
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50/20 md:p-2 min-h-[80px] md:min-h-[110px]"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = 
                currentDate.getMonth() === new Date().getMonth() && 
                currentDate.getFullYear() === new Date().getFullYear() &&
                day === new Date().getDate();

              return (
                <div 
                  key={`day-${day}`} 
                  onClick={() => openDayDetails(day)}
                  className={`bg-white p-1.5 md:p-2 min-h-[80px] md:min-h-[110px] transition-all hover:bg-blue-50/40 cursor-pointer relative group ${
                    isToday ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 md:mb-2">
                    <span className={`text-xs md:text-sm font-bold w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-colors ${
                      isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 group-hover:text-blue-600'
                    }`}>
                      {day}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 md:space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div 
                        key={event.id} 
                        className={`hidden md:block text-[10px] font-bold p-1 rounded leading-tight border transition-transform hover:scale-[1.02] ${getEventTypeColor(event.type)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {/* Tiny dots for mobile view or many events */}
                    <div className="md:hidden flex gap-1 mt-1">
                      {dayEvents.map(e => (
                        <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${getDotColor(e.type)}`} />
                      ))}
                    </div>
                    {dayEvents.length > 2 && (
                      <div className="hidden md:block text-[9px] font-extrabold text-slate-400 pl-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {Array.from({ length: remainingCells }).map((_, i) => (
              <div key={`empty-end-${i}`} className="bg-slate-50/20 md:p-2 min-h-[80px] md:min-h-[110px]"></div>
            ))}
          </div>
        </div>

        {/* Upcoming events Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Legend Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
             <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Event Types</h4>
             <div className="grid grid-cols-2 gap-3">
               <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Holidays
               </span>
               <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Exams
               </span>
               <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Meetings
               </span>
               <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                 <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Activities
               </span>
             </div>
          </div>

          {/* Upcoming Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
             <div className="p-5 border-b border-slate-50 flex items-center justify-between">
               <h4 className="text-sm font-bold text-slate-800">Upcoming for Teachers</h4>
               <span className="text-[10px] font-extrabold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">next 7 days</span>
             </div>
             <div className="p-4 space-y-4">
                {filteredEvents.filter(e => {
                  const eventDate = new Date(e.date);
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const diff = (eventDate.getTime() - today.getTime()) / (1000*60*60*24);
                  return diff >= 0 && diff <= 10;
                }).sort((a,b) => a.date.localeCompare(b.date)).map(event => (
                  <div key={event.id} className="group cursor-pointer hover:bg-slate-50 p-3 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-colors ${
                        event.type === 'Holiday' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        event.type === 'Exam' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                        event.type === 'Meeting' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        'bg-indigo-50 border-indigo-100 text-indigo-600'
                      }`}>
                         <span className="text-[11px] font-extrabold leading-none">{new Date(event.date).getDate()}</span>
                         <span className="text-[9px] font-bold uppercase">{new Date(event.date).toLocaleDateString('en-US', {month: 'short'})}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-slate-800 truncate">{event.title}</h5>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {event.time || 'All Day'}
                           </span>
                           {event.location && (
                             <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 truncate">
                               <Pin className="w-3 h-3 text-red-400" /> {event.location}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-slate-100 mx-auto mb-3" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No upcoming events</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Filter Events</h3>
              <button onClick={() => setShowFilter(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {['All', 'Holiday', 'Exam', 'Meeting', 'Activity'].map(type => (
                  <button 
                    key={type}
                    onClick={() => { setFilterType(type); setShowFilter(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all font-bold text-sm ${
                      filterType === type 
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-lg shadow-blue-100' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {type !== 'All' && (
                        <div className={`w-3 h-3 rounded-full ${getDotColor(type)}`}></div>
                      )}
                      {type === 'All' ? 'All Activities' : type + 's'}
                    </span>
                    {filterType === type && <Check className="w-5 h-5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {selectedDayEvents && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-5 duration-300">
            <div className="relative h-40 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-end">
               <button onClick={() => setSelectedDayEvents(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white backdrop-blur-md"><X className="w-5 h-5"/></button>
               <h3 className="text-white text-3xl font-black">{new Date(selectedDayEvents.date).getDate()}</h3>
               <p className="text-white/80 font-bold uppercase tracking-[0.2em] text-xs">{new Date(selectedDayEvents.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto space-y-4">
              {selectedDayEvents.events.map(event => (
                <div key={event.id} className={`p-6 rounded-3xl border-2 transition-all hover:bg-white bg-white/50 ${
                   event.type === 'Holiday' ? 'border-emerald-100 hover:border-emerald-300 shadow-md shadow-emerald-50' :
                   event.type === 'Exam' ? 'border-rose-100 hover:border-rose-300 shadow-md shadow-rose-50' :
                   event.type === 'Meeting' ? 'border-blue-100 hover:border-blue-300 shadow-md shadow-blue-50' :
                   'border-indigo-100 hover:border-indigo-300 shadow-md shadow-indigo-50'
                }`}>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h4 className="font-black text-slate-800 text-lg leading-tight">{event.title}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 ${
                       event.type === 'Holiday' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                       event.type === 'Exam' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                       event.type === 'Meeting' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                       'bg-indigo-50 border-indigo-100 text-indigo-600'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                           <Clock className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">Time</p>
                           <p className="text-xs font-bold text-slate-700">{event.time || 'Full Day'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                           <Pin className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">Location</p>
                           <p className="text-xs font-bold text-slate-700">{event.location || 'At School'}</p>
                        </div>
                     </div>
                  </div>

                  {event.description && (
                    <div className="mt-4 pt-4 border-t border-slate-50">
                       <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter mb-1">Details</p>
                       <p className="text-xs text-slate-600 font-medium leading-relaxed">{event.description}</p>
                    </div>
                  )}

                  <div className="mt-5 flex items-center gap-2">
                     {event.type === 'Meeting' && (
                        <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                           <Video className="w-3.5 h-3.5" /> Join Meeting
                        </button>
                     )}
                     <button className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                        Sync to Calendar
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
