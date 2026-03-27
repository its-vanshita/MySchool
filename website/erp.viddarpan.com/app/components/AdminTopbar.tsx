import React, { useState } from 'react';
import { Search, Bell, HelpCircle, LogOut } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import HelpDropdown from './HelpDropdown';

export default function AdminTopbar({ onLogout }: { onLogout: () => void }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 w-full relative z-[100]">
      <div className="relative hidden md:block w-full max-w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search student records, staff, or reports..." 
          className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[13px] text-slate-700"
        />
      </div>

      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-end">
        <div className="flex items-center gap-4 text-slate-500">
          <div className="relative z-[110]">
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsHelpOpen(false); }}
              className="relative hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <NotificationDropdown 
              isOpen={isNotifOpen} 
              onClose={() => setIsNotifOpen(false)} 
            />
          </div>
          <div className="relative z-[110]">
            <button 
              onClick={() => { setIsHelpOpen(!isHelpOpen); setIsNotifOpen(false); }}
              className="hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <HelpDropdown 
              isOpen={isHelpOpen} 
              onClose={() => setIsHelpOpen(false)} 
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-bold text-slate-800">Dr. Rajesh Kumar</p>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Principal Administrator</p>
          </div>
          <img 
            src="https://i.pravatar.cc/150?u=rajesh" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-slate-200"
          />
          <button onClick={onLogout} className="ml-2 text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
