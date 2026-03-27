import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardContent from './DashboardContent';
import TeacherAttendance from './teacher/TeacherAttendance';
import TeacherHomework from './teacher/TeacherHomework';
import TeacherAcademicCalendar from './teacher/TeacherAcademicCalendar';

export default function TeacherDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Attendance':
        return <TeacherAttendance />;
      case 'Homework':
        return <TeacherHomework />;
      case 'Academic Calendar':
        return <TeacherAcademicCalendar />;
      case 'Dashboard':
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7f9] font-sans text-slate-800 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}