import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardContent from './DashboardContent';
import TeacherAttendance from './teacher/TeacherAttendance';
import TeacherTimetable from './teacher/TeacherTimetable';
import TeacherHomework from './teacher/TeacherHomework';
import TeacherAcademicCalendar from './teacher/TeacherAcademicCalendar';
import TeacherLeaveRequest from './teacher/TeacherLeaveRequest';
import TeacherLessonPlan from './teacher/TeacherLessonPlan';
import TeacherMarksEntry from './teacher/TeacherMarksEntry';
import TeacherMyClass from './teacher/TeacherMyClass';
import TeacherNotices from './teacher/TeacherNotices';

export default function TeacherDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Attendance':
        return <TeacherAttendance />;
      case 'Timetable':
        return <TeacherTimetable setActiveTab={setActiveTab} />;
      case 'Homework':
        return <TeacherHomework />;
      case 'Academic Calendar':
        return <TeacherAcademicCalendar />;
      case 'Request Leave':
        return <TeacherLeaveRequest />;
      case 'Lesson Plan':
        return <TeacherLessonPlan />;
      case 'Add Marks':
        return <TeacherMarksEntry />;
      case 'My Class':
        return <TeacherMyClass />;
      case 'Notices':
        return <TeacherNotices />;
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