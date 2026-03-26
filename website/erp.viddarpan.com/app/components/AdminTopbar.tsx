import React from 'react';
import { Search, Bell, HelpCircle, LogOut } from 'lucide-react';

export default function AdminTopbar({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      <div className="relative w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search student records, staff, or reports..." 
          className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[13px] text-slate-700"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-slate-500">
          <button className="relative hover:text-slate-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-[13px] font-bold text-slate-800">Dr. Rajesh Kumar</p>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Principal Administrator</p>
          </div>
          <img 
            src="https://i.pravatar.cc/150?u=rajesh" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-slate-200"
          />
          <button onClick={onLogout} className="ml-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
