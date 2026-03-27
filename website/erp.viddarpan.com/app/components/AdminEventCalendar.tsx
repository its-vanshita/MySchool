import React from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightSmall } from 'lucide-react';

export default function AdminEventCalendar() {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Mock calendar array for March 2026 (starts on Sunday, 31 days)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Visual dots directly matching the provided UI
  const dots: Record<number, 'red' | 'green' | 'blue'> = {
    9: 'red',
    10: 'red',
    13: 'green',
    14: 'green',
    16: 'blue',
    17: 'blue',
    18: 'blue',
    19: 'blue',
    20: 'blue',
    21: 'blue'
  };

  const upcomingEvents = [
    {
      id: 1,
      month: 'MAR',
      day: '10',
      title: 'Holi Holiday',
      desc: 'Festival Holiday - School Closed',
      color: 'text-red-500'
    },
    {
      id: 2,
      month: 'MAR',
      day: '14',
      title: 'Science Exhibition',
      desc: '09:00 AM - 01:00 PM • School Auditorium',
      color: 'text-emerald-500'
    },
    {
      id: 3,
      month: 'MAR',
      day: '16',
      title: 'Pre-Board Exams Begin',
      desc: '10:00 AM - 01:00 PM • Examination Hall',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Calendar Grid Card */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-800 text-[15px]">March 2026</span>
          <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors">
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
          {days.map(day => {
            const isToday = day === 27;
            const dotColor = dots[day];

            return (
              <div key={day} className="flex flex-col items-center justify-start h-10 relative cursor-pointer group">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-semibold transition-colors ${
                  isToday 
                    ? 'bg-[#1565D8] text-white shadow-md' 
                    : 'text-slate-800 hover:bg-slate-50'
                }`}>
                  {day}
                </div>
                {dotColor && !isToday && (
                  <div className={`w-1 h-1 rounded-full absolute bottom-1 ${
                    dotColor === 'red' ? 'bg-red-500' : 
                    dotColor === 'green' ? 'bg-emerald-500' : 
                    'bg-[#1565D8]'
                  }`}></div>
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
        <h3 className="text-[18px] font-bold text-slate-800 mb-4 px-1">Upcoming Events</h3>
        <div className="space-y-3">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-white rounded-[16px] p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all cursor-pointer">
              <div className="flex flex-col items-center justify-center w-12 shrink-0">
                <span className={`text-[10px] font-bold tracking-wider uppercase mb-0.5 ${event.color}`}>{event.month}</span>
                <span className="text-[22px] font-bold text-slate-800 leading-none">{event.day}</span>
              </div>
              <div className="h-8 w-px bg-slate-200 shrink-0"></div>
              <div className="flex-1 min-w-0 pl-1">
                <h4 className="font-bold text-[14px] text-slate-800 truncate mb-0.5">{event.title}</h4>
                <p className="text-[12px] text-slate-500 truncate">{event.desc}</p>
              </div>
              <ChevronRightSmall className="w-5 h-5 text-slate-300 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
