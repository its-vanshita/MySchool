"use client";

import React, { useState } from 'react';
import { Lock, Unlock, Search, Filter, ChevronDown, Edit, Save, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

// --- Mock Data ---
interface TeacherPortal {
  id: string;
  name: string;
  subject: string;
  class: string;
  exam: string;
  status: 'locked' | 'unlocked';
  lastUploaded: string;
}

const initialPortals: TeacherPortal[] = [
  { id: 'T001', name: 'Sarah Johnson', subject: 'Mathematics', class: '10-A', exam: 'Mid Terms', status: 'locked', lastUploaded: 'Oct 15, 10:30 AM' },
  { id: 'T002', name: 'Michael Chen', subject: 'Physics', class: '10-A', exam: 'Mid Terms', status: 'locked', lastUploaded: 'Oct 14, 02:15 PM' },
  { id: 'T003', name: 'Emily Davis', subject: 'English', class: '9-B', exam: 'Mid Terms', status: 'unlocked', lastUploaded: 'Pending' },
  { id: 'T004', name: 'Robert Wilson', subject: 'Chemistry', class: '11-Sci', exam: 'Mid Terms', status: 'locked', lastUploaded: 'Oct 15, 09:00 AM' }
];

const mockStudents = [
  { rollNo: 1, name: 'Aisha Patel', marks: 95 },
  { rollNo: 2, name: 'Rahul Kumar', marks: 88 },
  { rollNo: 3, name: 'Priya Sharma', marks: 92 },
  { rollNo: 4, name: 'Kabir Singh', marks: 78 },
  { rollNo: 5, name: 'Ananya Desai', marks: 85 },
];

export default function AdminUpdateMarks() {
  const [activeTab, setActiveTab] = useState<'portals' | 'update'>('portals');
  const [portals, setPortals] = useState<TeacherPortal[]>(initialPortals);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState(mockStudents);

  const handleUnlock = (id: string) => {
    setPortals(portals.map(p => p.id === id ? { ...p, status: 'unlocked' } : p));
  };

  const handleLock = (id: string) => {
    setPortals(portals.map(p => p.id === id ? { ...p, status: 'locked' } : p));
  };

  const handleMarkChange = (rollNo: number, newMarks: string) => {
    setStudents(students.map(s => s.rollNo === rollNo ? { ...s, marks: Number(newMarks) || 0 } : s));
  };

  const filteredPortals = portals.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Edit className="w-6 h-6 text-blue-600" />
          Update Marks & Portals
        </h2>
        <p className="text-sm text-slate-500 mt-1">Manage teacher upload windows and override student marks</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'portals' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
          onClick={() => setActiveTab('portals')}
        >
          Teacher Portals (Locks)
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'update' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
          onClick={() => setActiveTab('update')}
        >
          Update Student Marks (Admin Override)
        </button>
      </div>

      {/* Tab Content: Portals */}
      {activeTab === 'portals' && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-210px)] min-h-[500px]">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search teacher or subject..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Portals automatically lock 24h after opening</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Class & Subject</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Uploaded</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPortals.map((portal) => (
                  <tr key={portal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{portal.name}</div>
                      <div className="text-xs text-slate-500">ID: {portal.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">{portal.subject}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Class {portal.class} • {portal.exam}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {portal.lastUploaded}
                    </td>
                    <td className="px-6 py-4">
                      {portal.status === 'locked' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <Unlock className="w-3.5 h-3.5" /> Unlocked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {portal.status === 'locked' ? (
                        <button 
                          onClick={() => handleUnlock(portal.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-xs rounded-lg transition-colors border border-blue-200"
                        >
                          Unlock Portal
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleLock(portal.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium text-xs rounded-lg transition-colors border border-slate-200"
                        >
                          Lock Portal
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Update Marks */}
      {activeTab === 'update' && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-210px)] min-h-[500px]">
          <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center bg-slate-50">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-xs font-semibold text-slate-500 uppercase">Class</label>
              <select className="appearance-none pl-3 pr-8 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[120px]">
                <option>10-A</option>
                <option>10-B</option>
                <option>9-A</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-xs font-semibold text-slate-500 uppercase">Exam</label>
              <select className="appearance-none pl-3 pr-8 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[140px]">
                <option>Mid Terms</option>
                <option>Finals</option>
                <option>Unit Test 1</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-xs font-semibold text-slate-500 uppercase">Subject</label>
              <select className="appearance-none pl-3 pr-8 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[140px]">
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
              </select>
            </div>
            <div className="ml-auto mt-auto">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Search className="w-4 h-4" /> Load Students
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Class 10-A • Mathematics (Mid Terms)</h3>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-saves on update
                </span>
              </div>
              
              <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm">
                <table className="w-full text-left bg-white">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase w-24">Roll No.</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase w-48 text-right">Marks (Out of 100)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student) => (
                      <tr key={student.rollNo} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 text-sm font-medium text-slate-500">{student.rollNo}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-slate-900">{student.name}</td>
                        <td className="px-6 py-3 text-right">
                          <input 
                            type="number" 
                            min="0"
                            max="100"
                            value={student.marks}
                            onChange={(e) => handleMarkChange(student.rollNo, e.target.value)}
                            className="w-20 px-3 py-1.5 text-sm font-bold text-center border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 bg-slate-50"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                  <Save className="w-4 h-4" /> Save All Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}