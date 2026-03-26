import React from 'react';
import { CheckCircle2, XCircle, Hourglass, CalendarDays } from 'lucide-react';

export default function AdminRightSidebar() {
  return (
    <>
      {/* Staff Quick Look & Departmental Health */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-slate-800">Staff Quick Look</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TODAY</span>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-1.5 rounded-full text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[14px] text-slate-800 font-medium">On Duty</span>
            </div>
            <span className="font-bold text-slate-800">142</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-1.5 rounded-full text-red-600">
                <XCircle className="w-4 h-4" />
              </div>
              <span className="text-[14px] text-slate-800 font-medium">Absent</span>
            </div>
            <span className="font-bold text-slate-800">3</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-1.5 rounded-full text-orange-600">
                <Hourglass className="w-4 h-4" />
              </div>
              <span className="text-[14px] text-slate-800 font-medium">Late Arrival</span>
            </div>
            <span className="font-bold text-slate-800">8</span>
          </div>
        </div>

        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">DEPARTMENTAL HEALTH</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[12px] mb-1.5 font-medium">
              <span className="text-slate-700">Primary Section</span>
              <span className="text-slate-900">100%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-[12px] mb-1.5 font-medium">
              <span className="text-slate-700">Science Dept</span>
              <span className="text-slate-900">88%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Calendar */}
      <div className="bg-[#0f172a] rounded-xl p-6 text-white shadow-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold">Event Calendar</h3>
          <CalendarDays className="w-5 h-5 text-slate-300" />
        </div>

        <div className="space-y-6 flex-1">
          <div className="flex gap-4">
            <div className="bg-slate-800 rounded-lg p-2 text-center min-w-[50px] shrink-0">
              <div className="text-lg font-bold leading-none">28</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase mt-1">OCT</div>
            </div>
            <div>
              <h4 className="font-bold text-[14px] mb-0.5">Annual Sports Meet</h4>
              <p className="text-[12px] text-slate-400">Ground A • 09:00 AM</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-800 rounded-lg p-2 text-center min-w-[50px] shrink-0">
              <div className="text-lg font-bold leading-none">02</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase mt-1">NOV</div>
            </div>
            <div>
              <h4 className="font-bold text-[14px] mb-0.5">PTM - Middle Wing</h4>
              <p className="text-[12px] text-slate-400">Main Hall • 02:00 PM</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-800 rounded-lg p-2 text-center min-w-[50px] shrink-0">
              <div className="text-lg font-bold leading-none">05</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase mt-1">NOV</div>
            </div>
            <div>
              <h4 className="font-bold text-[14px] mb-0.5">Inter-School Debate</h4>
              <p className="text-[12px] text-slate-400">Auditorium • 10:30 AM</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-6 py-2.5 bg-white text-slate-900 rounded-lg text-[13px] font-bold hover:bg-slate-100 transition-colors">
          Manage All Events
        </button>
      </div>
    </>
  );
}
