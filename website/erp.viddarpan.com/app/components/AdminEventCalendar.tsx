"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightSmall } from 'lucide-react';

export default function AdminEventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 27)); // March 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 2, 27));

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const formatKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const ALL_EVENTS: Record<string, { id: number, title: string; desc: string; type: 'red' | 'green' | 'blue'; dateObj: Date }[]> = {
    '2026-03-09': [{ id: 101, title: 'Staff Meeting', desc: 'Monthly Review', type: 'red', dateObj: new Date(2026, 2, 9) }],
    '2026-03-10': [{ id: 1, title: 'Holi Holiday', desc: 'Festival Holiday - School Closed', type: 'red', dateObj: new Date(2026, 2, 10) }],
    '2026-03-13': [{ id: 102, title: 'Cultural Fest Prep', desc: 'Auditorium Booking', type: 'green', dateObj: new Date(2026, 2, 13) }],
    '2026-03-14': [{ id: 2, title: 'Science Exhibition', desc: '09:00 AM - 01:00 PM • School Auditorium', type: 'green', dateObj: new Date(2026, 2, 14) }],
    '2026-03-16': [{ id: 3, title: 'Pre-Board Exams Begin', desc: '10:00 AM - 01:00 PM • Examination Hall', type: 'blue', dateObj: new Date(2026, 2, 16) }],
    '2026-03-17': [{ id: 103, title: 'Math Exam', desc: '10:00 AM - 01:00 PM', type: 'blue', dateObj: new Date(2026, 2, 17) }],
    '2026-03-18': [{ id: 104, title: 'Physics Exam', desc: '10:00 AM - 01:00 PM', type: 'blue', dateObj: new Date(2026, 2, 18) }],
    '2026-03-19': [{ id: 105, title: 'Chemistry Exam', desc: '10:00 AM - 01:00 PM', type: 'blue', dateObj: new Date(2026, 2, 19) }],
    '2026-03-20': [{ id: 106, title: 'Biology Exam', desc: '10:00 AM - 01:00 PM', type: 'blue', dateObj: new Date(2026, 2, 20) }],
    '2026-03-21': [{ id: 107, title: 'Computer Science Exam', desc: '10:00 AM - 01:00 PM', type: 'blue', dateObj: new Date(2026, 2, 21) }],
    '2026-03-27': [{ id: 108, title: 'Board Meetings', desc: '11:00 AM - 01:00 PM • Conference Room', type: 'green', dateObj: new Date(2026, 2, 27) }],
    '2026-04-15': [{ id: 109, title: 'Easter Holiday', desc: 'School Closed', type: 'red', dateObj: new Date(2026, 3, 15) }]
  };

  const selectedKey = selectedDate ? formatKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : null;
  const eventsForSelectedDate = selectedKey ? ALL_EVENTS[selectedKey] || [] : [];
  
  // Create a flattened list of all events, sorted by date for the default view
  const allUpcomingEvents = Object.values(ALL_EVENTS)
    .flat()
    .filter(event => event.dateObj >= new Date(2026, 2, 26)) // Filter upcoming from a mock "today"
    .slice(0, 4);

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getColorClass = (type: 'red' | 'green' | 'blue') => {
    if (type === 'red') return 'text-red-500';
    if (type === 'green') return 'text-emerald-500';
    return 'text-blue-600';
  };

  const getBgColorClass = (type: 'red' | 'green' | 'blue') => {
    if (type === 'red') return 'bg-red-500';
    if (type === 'green') return 'bg-emerald-500';
    return 'bg-[#1565D8]';
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Calendar Grid Card */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrevMonth} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-800 text-[15px]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={handleNextMonth} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-3">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-slate-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="flex flex-col items-center justify-start h-10 relative"></div>
          ))}
          {days.map(day => {
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() && selectedDate?.getFullYear() === currentDate.getFullYear();
            const dayKey = formatKey(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = ALL_EVENTS[dayKey];
            const hasEvents = dayEvents && dayEvents.length > 0;
            const primaryEvent = hasEvents ? dayEvents[0] : null;

            return (
              <div key={`day-${day}`} onClick={() => handleDateClick(day)} className="flex flex-col items-center justify-start h-10 relative cursor-pointer group">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-semibold transition-colors ${
                  isSelected 
                    ? 'bg-[#1565D8] text-white shadow-md' 
                    : isToday 
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}>
                  {day}
                </div>
                {primaryEvent && !isSelected && (
                  <div className={`w-1 h-1 rounded-full absolute bottom-1 ${getBgColorClass(primaryEvent.type)}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Card */}
      <div className="bg-white rounded-xl py-4 px-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 tracking-widest mb-3 block uppercase">Legend</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-semibold text-[12px] text-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1565D8]"></div> Exams
          </div>
          <div className="flex items-center gap-2 font-semibold text-[12px] text-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Holidays
          </div>
          <div className="flex items-center gap-2 font-semibold text-[12px] text-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Events
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[18px] font-bold text-slate-800">
            {selectedDate ? `Events for ${monthNames[selectedDate.getMonth()].substr(0, 3)} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}` : 'Upcoming Events'}
          </h3>
          {selectedDate && <button onClick={() => setSelectedDate(null)} className="text-[12px] font-bold text-blue-600 hover:text-blue-700">View All</button>}
        </div>
        
        <div className="space-y-3">
          {selectedDate ? (
            eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map((event) => (
                <div key={event.id} className="bg-white rounded-[16px] p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-12 shrink-0">
                    <span className={`text-[10px] font-bold tracking-wider uppercase mb-0.5 ${getColorClass(event.type)}`}>
                      {monthNames[selectedDate.getMonth()].substr(0, 3).toUpperCase()}
                    </span>
                    <span className="text-[22px] font-bold text-slate-800 leading-none">{selectedDate.getDate()}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 shrink-0"></div>
                  <div className="flex-1 min-w-0 pl-1">
                    <h4 className="font-bold text-[14px] text-slate-800 truncate mb-0.5">{event.title}</h4>
                    <p className="text-[12px] text-slate-500 truncate">{event.desc}</p>
                  </div>
                  <ChevronRightSmall className="w-5 h-5 text-slate-300 shrink-0" />
                </div>
              ))
            ) : (
              <div className="bg-white rounded-[16px] p-8 text-center shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center">
                <span className="text-slate-400 font-medium text-[13px]">No events scheduled for this date.</span>
              </div>
            )
          ) : (
            allUpcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-[16px] p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all cursor-pointer">
                <div className="flex flex-col items-center justify-center w-12 shrink-0">
                  <span className={`text-[10px] font-bold tracking-wider uppercase mb-0.5 ${getColorClass(event.type)}`}>
                    {monthNames[event.dateObj.getMonth()].substr(0, 3).toUpperCase()}
                  </span>
                  <span className="text-[22px] font-bold text-slate-800 leading-none">{event.dateObj.getDate()}</span>
                </div>
                <div className="h-8 w-px bg-slate-200 shrink-0"></div>
                <div className="flex-1 min-w-0 pl-1">
                  <h4 className="font-bold text-[14px] text-slate-800 truncate mb-0.5">{event.title}</h4>
                  <p className="text-[12px] text-slate-500 truncate">{event.desc}</p>
                </div>
                <ChevronRightSmall className="w-5 h-5 text-slate-300 shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
