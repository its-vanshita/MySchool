import React from 'react';
import { LayoutDashboard, Users, Bell, Settings, CalendarCheck, GraduationCap } from 'lucide-react';

export default function AdminSidebar() {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between h-full shrink-0">
      <div>
        <div className="p-5 flex items-center gap-3">
          <div className="bg-slate-800 p-1.5 rounded-lg">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-tight">VidDarpan</h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Academic ERP</p>
          </div>
        </div>

        <nav className="px-3 mt-4 space-y-1">
          <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active />
          <NavItem icon={<CalendarCheck className="w-4 h-4" />} label="Attendance" />
          <NavItem icon={<Bell className="w-4 h-4" />} label="Notices" />
          <NavItem icon={<Users className="w-4 h-4" />} label="Staff Management" />
          <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>
      </div>

      <div className="p-4">
        <div className="bg-[#1e293b] rounded-lg p-4 text-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">School Status</p>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium">Live Monitoring</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-colors relative ${active ? 'text-blue-700 bg-blue-50/50 font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
      {active && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-700 rounded-r-full" />}
      {icon}
      <span>{label}</span>
    </a>
  );
}
