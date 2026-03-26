import React from 'react';
import { UserCheck, FileText, MessageSquare, AlertTriangle } from 'lucide-react';

export default function Toolkit() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
      
      <div className="relative z-10 mb-5 max-w-md">
        <h3 className="text-lg font-bold text-slate-800 mb-1.5">Teacher's Quick Toolkit</h3>
        <p className="text-slate-500 text-[13px]">Streamline your daily administrative tasks with one-click actions optimized for your schedule.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        <button className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left border border-slate-100">
          <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-md shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-[13px]">Mark Attendance</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Class 10-A • Pending</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left border border-slate-100">
          <div className="bg-blue-100 text-blue-600 p-2.5 rounded-md shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-[13px]">Assign Homework</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Class 9-C • New</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left border border-slate-100">
          <div className="bg-amber-100 text-amber-700 p-2.5 rounded-md shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-[13px]">Message Parents</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Grade 10-A Cluster</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left border border-slate-100">
          <div className="bg-red-100 text-red-600 p-2.5 rounded-md shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-[13px]">Discipline Report</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Rapid Submission</p>
          </div>
        </button>
      </div>
    </div>
  );
}
