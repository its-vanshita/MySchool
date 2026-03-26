import React from 'react';
import { UserCheck, IdCard, Wallet, Megaphone } from 'lucide-react';

export default function AdminStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Student Attendance */}
      <div className="bg-white rounded-xl p-5 border-l-4 border-l-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md">
            +2.4% vs last week
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Student Attendance</p>
          <h3 className="text-3xl font-black text-slate-800 mb-3">94.2%</h3>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-800 rounded-full" style={{ width: '94.2%' }}></div>
          </div>
        </div>
      </div>

      {/* Staff Attendance */}
      <div className="bg-white rounded-xl p-5 border-l-4 border-l-emerald-600 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
            <IdCard className="w-5 h-5" />
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md">
            Stable
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Staff Attendance</p>
          <h3 className="text-3xl font-black text-slate-800 mb-3">98.0%</h3>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '98%' }}></div>
          </div>
        </div>
      </div>

      {/* Monthly Fee Collection */}
      <div className="bg-white rounded-xl p-5 border-l-4 border-l-orange-500 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md">
            Target: 85%
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Fee Collection</p>
          <h3 className="text-3xl font-black text-slate-800 mb-3">72.5%</h3>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '72.5%' }}></div>
          </div>
        </div>
      </div>

      {/* Active Notices */}
      <div className="bg-white rounded-xl p-5 border-l-4 border-l-slate-400 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
            <Megaphone className="w-5 h-5" />
          </div>
          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
            3 expiring today
          </span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Notices</p>
          <h3 className="text-3xl font-black text-slate-800 mb-3">12</h3>
          <div className="flex gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold">P</span>
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] font-bold">S</span>
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-bold">A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
