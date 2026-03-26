'use client';

import React, { useState } from 'react';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [userRole, setUserRole] = useState<'teacher' | 'admin' | null>(null);

  if (!userRole) {
    return <Login onLogin={(role) => setUserRole(role)} />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard onLogout={() => setUserRole(null)} />;
  }

  return <TeacherDashboard onLogout={() => setUserRole(null)} />;
}
