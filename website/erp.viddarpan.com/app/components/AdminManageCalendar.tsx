"use client";

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Users, 
  Presentation, 
  BookOpen, 
  User, 
  Trash2, 
  X, 
  Filter,
  Check
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Holiday' | 'Exam' | 'Meeting' | 'Activity';
  audience: 'student' | 'teacher' | 'all';
  description?: string;
}

export default function AdminManageCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<'student' | 'teacher'>('student');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{date: string, events: CalendarEvent[]} | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Summer Break Starts', date: '2025-05-15', type: 'Holiday', audience: 'all' },
    { id: '2', title: 'Final Exams', date: '2025-05-20', type: 'Exam', audience: 'student' },
    { id: '3', title: 'Staff Meeting', date: '2025-05-22', type: 'Meeting', audience: 'teacher' },
    { id: '4', title: 'PTM (Parent Teacher Meeting)', date: '2025-05-25', type: 'Meeting', audience: 'all' },
    { id: '5', title: 'Science Fair', date: '2025-05-28', type: 'Activity', audience: 'student' },
  ]);

  const [filterType, setFilterType] = useState<string>('All');

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Check audience. If activeView is teacher, they also see 'all' and 'student' events as relevant things
      const matchesAudience = e.audience === 'all' || 
                              e.audience === activeView || 
                              (activeView === 'teacher' && e.audience === 'student');
      const matchesType = filterType === 'All' || e.type === filterType;
      return matchesAudience && matchesType;
    });
  }, [events, activeView, filterType]);

  const getEventsForDate = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.date === formattedDate);
  };

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'Holiday': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'Meeting': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Activity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const remainingCells = 42 - (firstDayOfMonth + daysInMonth); // 6 rows of 7 days

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      type: formData.get('type') as any,
      audience: formData.get('audience') as any,
      description: formData.get('description') as string,
    };
    setEvents([...events, newEvent]);
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    if (selectedDayEvents) {
      setSelectedDayEvents({
        ...selectedDayEvents,
        events: selectedDayEvents.events.filter(e => e.id !== id)
      });
    }
  };

  const openDayDetails = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = getEventsForDate(day);
    setSelectedDayEvents({ date: formattedDate, events: dayEvents });
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Manage Calendar</h2>
          <p className="text-[13px] text-slate-500">Organize holidays, exams, meetings & events for different groups</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-[#111d33] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-2 pt-2">
        <button
          onClick={() => setActiveView('student')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeView === 'student' 
              ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
          }`}
        >
          <Users className="w-4 h-4" />
          Student / Parent Calendar
        </button>
        <button
          onClick={() => setActiveView('teacher')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeView === 'teacher' 
              ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
          }`}
        >
          <Presentation className="w-4 h-4" />
          Teacher / Staff Calendar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            {monthNames[month]} {year}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={nextMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 border-b border-slate-200 text-[13px] font-medium">
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Holiday</span>
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div> Exam</span>
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Meeting</span>
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-400"></div> Activity</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 bg-slate-200 gap-[1px]">
          {dayNames.map(day => (
            <div key={day} className="bg-white p-3 text-center text-sm font-bold text-slate-600">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50/50 p-2 min-h-[120px] opacity-50"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayEvents = getEventsForDate(i + 1);
            const isToday = 
              currentDate.getMonth() === new Date().getMonth() && 
              currentDate.getFullYear() === new Date().getFullYear() &&
              (i + 1) === new Date().getDate();

            return (
              <div 
                key={`day-${i+1}`} 
                onClick={() => openDayDetails(i + 1)}
                className={`bg-white p-2 min-h-[120px] transition-colors hover:bg-blue-50/30 cursor-pointer relative group ${isToday ? 'ring-2 ring-inset ring-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700 group-hover:text-blue-600'}`}>
                    {i + 1}
                  </span>
                  <Plus className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1.5">
                  {dayEvents.slice(0, 3).map(event => (
                    <div 
                      key={event.id} 
                      className={`text-[11px] font-medium p-1.5 rounded border leading-tight truncate ${getEventTypeColor(event.type)}`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[11px] font-bold text-slate-500 text-center mt-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {Array.from({ length: remainingCells }).map((_, i) => (
            <div key={`empty-end-${i}`} className="bg-slate-50/50 p-2 min-h-[120px] opacity-50"></div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Add New Event</h3>
              <button type="button" onClick={() => setShowAddEvent(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddEvent}>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                  <input name="title" required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none" placeholder="e.g. Annual Sports Day" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input name="date" required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                    <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none">
                      <option value="Holiday">Holiday</option>
                      <option value="Exam">Exam</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Activity">Activity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                    <select name="audience" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none">
                      <option value="all">Everyone (All)</option>
                      <option value="student">Students & Parents</option>
                      <option value="teacher">Teachers & Staff</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                  <textarea name="description" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none" placeholder="Details about the event..." />
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddEvent(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {selectedDayEvents && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Events List</h3>
                <p className="text-sm text-slate-500 font-medium">{new Date(selectedDayEvents.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button onClick={() => setSelectedDayEvents(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-md shadow-sm border border-slate-200"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              {selectedDayEvents.events.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p>No events scheduled for this day.</p>
                </div>
              ) : (
                selectedDayEvents.events.map(event => (
                  <div key={event.id} className={`p-4 rounded-xl border relative group ${getEventTypeColor(event.type)}`}>
                    <div className="flex justify-between items-start pr-8">
                      <h4 className="font-bold text-sm mb-1">{event.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/50 backdrop-blur-sm border border-black/5">
                        {event.type}
                      </span>
                    </div>
                    {event.description && <p className="text-xs opacity-90 mt-1.5">{event.description}</p>}
                    
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-bold opacity-80">
                      {event.audience === 'all' && <><Users className="w-3.5 h-3.5" /> Everyone</>}
                      {event.audience === 'student' && <><BookOpen className="w-3.5 h-3.5" /> Students & Parents</>}
                      {event.audience === 'teacher' && <><Presentation className="w-3.5 h-3.5" /> Teachers Only</>}
                    </div>

                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="absolute top-4 right-4 p-1.5 text-red-600 bg-red-50 hover:bg-red-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 text-center">
               <button 
                onClick={() => {
                  setSelectedDayEvents(null);
                  setTimeout(() => setShowAddEvent(true), 50);
                }} 
                className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Event to this day
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Filter Events</h3>
              <button onClick={() => setShowFilter(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-5">
              <label className="block text-sm font-medium text-slate-700 mb-3">Event Type</label>
              <div className="space-y-2">
                {['All', 'Holiday', 'Exam', 'Meeting', 'Activity'].map(type => (
                  <button 
                    key={type}
                    onClick={() => { setFilterType(type); setShowFilter(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      filterType === type 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {type !== 'All' && (
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          type === 'Holiday' ? 'bg-emerald-400' :
                          type === 'Exam' ? 'bg-red-400' :
                          type === 'Meeting' ? 'bg-amber-400' :
                          'bg-purple-400'
                        }`}></div>
                      )}
                      {type} {type !== 'All' && 's'}
                    </span>
                    {filterType === type && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}