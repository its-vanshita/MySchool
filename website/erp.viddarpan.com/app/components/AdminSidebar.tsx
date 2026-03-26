"use client";

import React from 'react';
import { LayoutDashboard, Users, Bell, Settings, CalendarCheck, Megaphone, LogOut, Plus, ClipboardCheck, CalendarRange, BookOpenCheck, BarChart3, Edit, ClipboardList, UserPlus } from 'lucide-react';

interface AdminSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
}

export default function AdminSidebar({ activeTab = 'dashboard', onTabChange = () => {}, onLogout }: AdminSidebarProps) {
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
            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest leading-none">Institutional Admin</span>
          </div>
        </div>

        <nav className="px-3 mt-4 space-y-1">
          <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} />
          <NavItem icon={<Megaphone className="w-4 h-4" />} label="Notices" active={activeTab === 'notices'} onClick={() => onTabChange('notices')} />
          <NavItem icon={<ClipboardCheck className="w-4 h-4" />} label="Leave Approvals" active={activeTab === 'leave-approvals'} onClick={() => onTabChange('leave-approvals')} />
          <NavItem icon={<CalendarRange className="w-4 h-4" />} label="Manage Timetable" active={activeTab === 'manage-timetable'} onClick={() => onTabChange('manage-timetable')} />
          <NavItem icon={<CalendarCheck className="w-4 h-4" />} label="Manage Calendar" active={activeTab === 'manage-calendar'} onClick={() => onTabChange('manage-calendar')} />
          <NavItem icon={<BookOpenCheck className="w-4 h-4" />} label="Syllabus Tracking" active={activeTab === 'syllabus'} onClick={() => onTabChange('syllabus')} />
          <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Analytics Dashboard" active={activeTab === 'analytics'} onClick={() => onTabChange('analytics')} />
          <NavItem icon={<Edit className="w-4 h-4" />} label="Update Marks" active={activeTab === 'update-marks'} onClick={() => onTabChange('update-marks')} />
          <NavItem icon={<ClipboardList className="w-4 h-4" />} label="Assign Duties" active={activeTab === 'assign-duties'} onClick={() => onTabChange('assign-duties')} />
          <NavItem icon={<UserPlus className="w-4 h-4" />} label="Manage Records" active={activeTab === 'manage-records'} onClick={() => onTabChange('manage-records')} />
          <NavItem icon={<CalendarCheck className="w-4 h-4" />} label="Upload Datesheet" active={activeTab === 'upload-datesheet'} onClick={() => onTabChange('upload-datesheet')} />
          <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" active={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
        </nav>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {onLogout && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors pt-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }} className={`flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-colors relative ${active ? 'text-blue-700 bg-blue-50/50 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'}`}>
      {active && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-700 rounded-r-full" />}
      {icon}
      <span>{label}</span>
    </a>
  );
}
