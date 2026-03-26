"use client";

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminContent from './AdminContent';
import AssignNotice from './AssignNotice';
import AdminNoticesList from './AdminNoticesList';
import AdminLeaveApprovals from './AdminLeaveApprovals';
import AdminTimetable from './AdminTimetable';
import AdminManageCalendar from './AdminManageCalendar';
import AdminSyllabusTracking from './AdminSyllabusTracking';
import AdminAnalytics from './AdminAnalytics';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notices, setNotices] = useState<any[]>([]);

  const handleNoticeBroadcasted = (newNotice: any) => {
    setNotices([newNotice, ...notices]);
    setActiveTab('notices');
  };

  return (
    <div className="flex h-screen bg-[#f4f7f9] font-sans text-slate-800 overflow-hidden">
      <AdminSidebar activeTab={activeTab === 'assign-notice' ? 'notices' : activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <AdminTopbar onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <AdminContent />}
          {activeTab === 'notices' && <AdminNoticesList notices={notices} onCreateNew={() => setActiveTab('assign-notice')} />}
          {activeTab === 'leave-approvals' && <AdminLeaveApprovals />}
          {activeTab === 'manage-timetable' && <AdminTimetable />}
          {activeTab === 'manage-calendar' && <AdminManageCalendar />}
          {activeTab === 'syllabus' && <AdminSyllabusTracking />}
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'assign-notice' && (
            <AssignNotice 
              onBroadcastSuccess={handleNoticeBroadcasted} 
              onCancel={() => setActiveTab('notices')} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
