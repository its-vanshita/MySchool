import React from 'react';
import { UserCheck, AlertCircle } from 'lucide-react';

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="bg-white rounded-xl p-5 border-l-4 border-l-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md">
            +2% vs avg
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Class Attendance</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-800">92%</h3>
            <span className="text-[13px] font-medium text-slate-500">(Grade 10-A)</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border-l-4 border-l-emerald-500 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-md">
            Action Required
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Homeworks</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-800">14</h3>
            <span className="text-[13px] font-medium text-slate-500">from 2 Classes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
