import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="relative hidden md:block w-[360px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search student records, notices, or files..." 
          className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[13px] text-slate-700"
        />
      </div>

      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-end">
        <button className="text-slate-400 hover:text-slate-600 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="text-slate-400 hover:text-slate-600">
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-bold text-slate-800">Dr. Sarah Jenkins</p>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Senior Faculty • English</p>
          </div>
          <img 
            src="https://i.pravatar.cc/150?u=sarah" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-slate-200"
          />
        </div>
      </div>
    </header>
  );
}
