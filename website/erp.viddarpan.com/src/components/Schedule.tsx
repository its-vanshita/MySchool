import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Schedule() {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-slate-800">Today's Schedule</h3>
        <button className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
          Full Calendar <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        
        {/* Item 1 */}
        <div className="relative flex items-start gap-6">
          <div className="w-16 text-right shrink-0 pt-1">
            <span className="text-sm font-bold text-slate-400">08:30</span>
          </div>
          <div className="absolute left-[4.5rem] w-px h-full bg-slate-200 top-3"></div>
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-1.5">
              <h4 className="font-bold text-slate-800 text-base">Staff Morning Assembly</h4>
              <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">Conference Hall</span>
            </div>
            <p className="text-slate-500 text-[13px]">Briefing on upcoming mid-term examinations.</p>
          </div>
        </div>

        {/* Item 2 - Active */}
        <div className="relative flex items-start gap-6">
          <div className="w-16 text-right shrink-0 pt-1">
            <span className="text-sm font-bold text-slate-800">10:15</span>
          </div>
          <div className="absolute left-[4.5rem] w-px h-full bg-slate-200 top-3"></div>
          <div className="absolute left-[4.5rem] w-3 h-3 bg-slate-800 rounded-full -translate-x-[5px] top-2 ring-4 ring-white"></div>
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-slate-800">
            <div className="flex justify-between items-start mb-1.5">
              <h4 className="font-bold text-slate-800 text-base">English (Poetry)</h4>
              <span className="bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">Up Next</span>
            </div>
            <p className="text-slate-500 text-[13px] mb-3">Grade 10-A • Analyzing 'The Road Not Taken'</p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="" />
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="" />
                <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-600">+28</div>
              </div>
              <span className="text-xs font-medium text-slate-400 italic">Attendance not yet marked</span>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="relative flex items-start gap-6">
          <div className="w-16 text-right shrink-0 pt-1">
            <span className="text-sm font-bold text-slate-400">12:30</span>
          </div>
          <div className="absolute left-[4.5rem] w-px h-full bg-slate-200 top-3"></div>
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-1.5">
              <h4 className="font-bold text-slate-800 text-base">Creative Writing Workshop</h4>
              <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">Room 204</span>
            </div>
            <p className="text-slate-500 text-[13px]">Grade 9-C • Flash fiction techniques.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
