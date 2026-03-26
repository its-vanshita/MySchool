import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardContent from './DashboardContent';

export default function TeacherDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex h-screen bg-[#f4f7f9] font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}