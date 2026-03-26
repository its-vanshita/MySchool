import React from 'react';
import { LayoutDashboard, CalendarCheck, Megaphone, Users, Settings, GraduationCap, BookOpen } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }: { activeTab?: string, setActiveTab?: (tab: string) => void }) {
  const handleNavClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    if (setActiveTab) {
      setActiveTab(label);
    }
  };

  return (
    <aside className="hidden md:flex w-60 bg-white border-r border-slate-200 flex-col justify-between h-full shrink-0">
      <div>
        <div className="p-5 flex items-center gap-3">
          <img 
            src="/logo.svg" 
            alt="VidDarpan Logo" 
            className="h-8 object-contain" 
          />
          <div className="flex flex-col">
            <span className="font-bold text-base text-[#1a2b4c] leading-tight tracking-tight">VidDarpan</span>
            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest leading-none">Academic ERP</span>
          </div>
        </div>
        
        <nav className="mt-6 flex flex-col gap-1 px-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={(e) => handleNavClick(e, 'Dashboard')} />
          <NavItem icon={<CalendarCheck size={20} />} label="Attendance" active={activeTab === 'Attendance'} onClick={(e) => handleNavClick(e, 'Attendance')} />
          <NavItem icon={<BookOpen size={20} />} label="Homework" active={activeTab === 'Homework'} onClick={(e) => handleNavClick(e, 'Homework')} />
          <NavItem icon={<Megaphone size={20} />} label="Notices" active={activeTab === 'Notices'} onClick={(e) => handleNavClick(e, 'Notices')} />
          <NavItem icon={<Users size={20} />} label="Staff Management" active={activeTab === 'Staff Management'} onClick={(e) => handleNavClick(e, 'Staff Management')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={(e) => handleNavClick(e, 'Settings')} />
        </nav>
      </div>

      <div className="p-4">
        <div className="bg-slate-900 rounded-xl p-5 text-white">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Support</p>
          <p className="text-sm font-medium mb-4">Need help with Grade 10-A reports?</p>
          <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg text-sm font-medium">
            Contact IT
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <a href="#" onClick={onClick} className={`flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-colors relative ${active ? 'text-blue-700 bg-blue-50/50 font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
      {active && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-700 rounded-r-full" />}
      {icon}
      <span>{label}</span>
    </a>
  );
}
