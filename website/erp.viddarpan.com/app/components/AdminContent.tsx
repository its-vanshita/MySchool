import React from 'react';
import AdminStatCards from './AdminStatCards';
import PendingApprovals from './PendingApprovals';
import AdminAlerts from './AdminAlerts';
import AdminRightSidebar from './AdminRightSidebar';

export default function AdminContent() {
  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Institutional Overview</h2>
        <p className="text-[13px] text-slate-500">Real-time governance dashboard for Vidya Darpan International School</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col min-w-0 gap-6">
          <AdminStatCards />
          <PendingApprovals />
          <AdminAlerts />
        </div>

        <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
          <AdminRightSidebar />
        </div>
      </div>
    </div>
  );
}
