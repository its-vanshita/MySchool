import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminContent from './AdminContent';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex h-screen bg-[#f4f7f9] font-sans text-slate-800 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-8">
          <AdminContent />
        </main>
      </div>
    </div>
  );
}
