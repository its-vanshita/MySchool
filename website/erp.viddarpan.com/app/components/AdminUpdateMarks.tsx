"use client";

import React, { useState } from 'react';
import { Lock, Unlock, Search, Filter, ChevronDown, Edit, Save, CheckCircle2, AlertCircle, Clock, GraduationCap, History as HistoryIcon, Send, X, FileText, Download, Printer, Award, BarChart2, Users } from 'lucide-react';

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
  { id: 'T004', name: 'Robert Wilson', subject: 'Chemistry', class: '11-Sci', exam: 'Mid Terms', status: 'unlocked', lastUploaded: 'Oct 15, 09:00 AM' }
];

// Added status for requests
type ExtendedStatus = 'locked' | 'unlocked' | 'pending_unlock';
interface ExtendedTeacherPortal extends Omit<TeacherPortal, 'status'> {
  status: ExtendedStatus;
}

const initialPortalsExtended: ExtendedTeacherPortal[] = [
  { id: 'T001', name: 'Sarah Johnson', subject: 'Mathematics', class: '10-A', exam: 'Mid Terms', status: 'locked', lastUploaded: 'Oct 15, 10:30 AM' },
  { id: 'T002', name: 'Michael Chen', subject: 'Physics', class: '10-A', exam: 'Mid Terms', status: 'locked', lastUploaded: 'Oct 14, 02:15 PM' },
  { id: 'T003', name: 'Emily Davis', subject: 'English', class: '9-B', exam: 'Mid Terms', status: 'pending_unlock', lastUploaded: 'Oct 15, 03:00 PM' },
  { id: 'T004', name: 'Robert Wilson', subject: 'Chemistry', class: '11-Sci', exam: 'Mid Terms', status: 'unlocked', lastUploaded: 'Oct 15, 09:00 AM' }
];

const mockStudents = [
  { rollNo: 1, name: 'Aisha Patel',   marks: 95, grade: 'A+', status: 'Pass', maths: 95, science: 91, english: 97, social: 93, hindi: 98 },
  { rollNo: 2, name: 'Rahul Kumar',   marks: 88, grade: 'A',  status: 'Pass', maths: 88, science: 84, english: 91, social: 88, hindi: 90 },
  { rollNo: 3, name: 'Priya Sharma',  marks: 92, grade: 'A+', status: 'Pass', maths: 90, science: 94, english: 93, social: 91, hindi: 92 },
  { rollNo: 4, name: 'Kabir Singh',   marks: 78, grade: 'B+', status: 'Pass', maths: 72, science: 80, english: 79, social: 77, hindi: 82 },
  { rollNo: 5, name: 'Ananya Desai',  marks: 85, grade: 'A',  status: 'Pass', maths: 83, science: 87, english: 86, social: 82, hindi: 87 },
];

export default function AdminUpdateMarks() {
  const [activeTab, setActiveTab] = useState<'portals' | 'publish'>('portals');
  const [portals, setPortals] = useState<ExtendedTeacherPortal[]>(initialPortalsExtended);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState<any>(null);

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
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            Result & Report Cards
          </h2>
          <p className="text-sm font-medium text-slate-500">Security & control center for marks submission windows</p>
        </div>
        <div className="flex bg-amber-50 border border-amber-100 p-3 rounded-lg gap-3 max-w-sm">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-[11px] font-bold text-amber-700 leading-tight">
            SYSTEM POLICY: Teacher windows automatically expire after 24h. Any "Pending Unlock" request must be manually reviewed.
          </p>
        </div>
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
            activeTab === 'publish' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
          onClick={() => setActiveTab('publish')}
        >
          Report Cards & Publishing
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      ) : portal.status === 'pending_unlock' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider animate-pulse">
                          <HistoryIcon className="w-3.5 h-3.5" /> Pending Unlock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                          <Unlock className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {portal.status === 'locked' ? (
                        <button 
                          onClick={() => handleUnlock(portal.id)}
                          className="inline-flex items-center px-4 py-1.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-lg transition-colors border border-indigo-200 shadow-sm"
                        >
                          Restore Access
                        </button>
                      ) : portal.status === 'pending_unlock' ? (
                        <button 
                          onClick={() => handleUnlock(portal.id)}
                          className="inline-flex items-center px-4 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs rounded-lg transition-colors shadow-md transform hover:scale-105"
                        >
                          Approve Unlock
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleLock(portal.id)}
                          className="inline-flex items-center px-4 py-1.5 bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-lg transition-colors border border-rose-200 shadow-sm"
                        >
                          Manual Lock
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
      {/* Tab Content: Report Cards & Publishing */}
      {activeTab === 'publish' && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-210px)] min-h-[500px]">
          {/* Toolbar */}
          <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap gap-3 items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option>10-A</option>
                  <option>10-B</option>
                  <option>9-A</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Examination</label>
                <select className="text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400">
                  <option>Mid-Term Examination 2024</option>
                  <option>Unit Test I</option>
                  <option>Final Examination 2024</option>
                </select>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> All 5 subjects submitted
              </div>
              <button
                onClick={() => setIsPublishing(true)}
                disabled={isPublishing}
                className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                {isPublishing ? 'Publishing...' : 'Publish Results'}
              </button>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50/60">
            <div className="px-6 py-3 flex items-center gap-3">
              <BarChart2 className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Class Average</p>
                <p className="text-base font-bold text-slate-800">87.6 / 100</p>
              </div>
            </div>
            <div className="px-6 py-3 flex items-center gap-3">
              <Users className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Pass / Total</p>
                <p className="text-base font-bold text-slate-800">5 / 5 students</p>
              </div>
            </div>
            <div className="px-6 py-3 flex items-center gap-3">
              <Award className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Top Rank</p>
                <p className="text-base font-bold text-slate-800">Aisha Patel — 95%</p>
              </div>
            </div>
          </div>

          {/* Student result list */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">#</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aggregate</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, i) => (
                  <tr key={student.rollNo} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Roll No. {student.rollNo.toString().padStart(2, '0')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-slate-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-slate-700" style={{ width: `${student.marks}%` }} />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{student.marks}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold border rounded text-slate-700 border-slate-300 bg-white">{student.grade}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setShowReportPreview(student)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md bg-white hover:border-slate-400 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> Preview
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-200 rounded-md transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Card Preview Modal */}
      {showReportPreview && (
        <ReportCardPreview 
          student={showReportPreview} 
          onClose={() => setShowReportPreview(null)} 
        />
      )}
    </div>
  );
}

function ReportCardPreview({ student, onClose }: { student: any, onClose: () => void }) {
  const subjects = [
    { name: 'Mathematics',    code: 'MAT', mm: 100, marks: student.maths,   grade: student.maths  >= 90 ? 'A+' : student.maths  >= 75 ? 'A' : 'B+' },
    { name: 'Science',        code: 'SCI', mm: 100, marks: student.science, grade: student.science >= 90 ? 'A+' : student.science >= 75 ? 'A' : 'B+' },
    { name: 'English Core',   code: 'ENG', mm: 100, marks: student.english, grade: student.english >= 90 ? 'A+' : student.english >= 75 ? 'A' : 'B+' },
    { name: 'Social Science', code: 'SST', mm: 100, marks: student.social,  grade: student.social  >= 90 ? 'A+' : student.social  >= 75 ? 'A' : 'B+' },
    { name: 'Hindi',          code: 'HIN', mm: 100, marks: student.hindi,   grade: student.hindi   >= 90 ? 'A+' : student.hindi   >= 75 ? 'A' : 'B+' },
  ];
  const totalMax = subjects.reduce((a, s) => a + s.mm, 0);
  const totalObt = subjects.reduce((a, s) => a + s.marks, 0);
  const pct = ((totalObt / totalMax) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[95vh] overflow-hidden border border-slate-200">

        {/* Modal chrome */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Report Card — {student.name}</span>
            <span className="text-xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">DRAFT</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 border border-slate-800 rounded-md hover:bg-slate-700 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
            <button onClick={onClose} className="ml-1 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-8">
          <div className="bg-white w-full max-w-2xl mx-auto shadow-sm border border-slate-200">

            {/* Letterhead */}
            <div className="border-b-4 border-double border-slate-800 px-10 pt-8 pb-5 text-center">
              <p className="text-[9px] font-bold tracking-[0.4em] text-slate-400 uppercase mb-1">Affiliated to CBSE, New Delhi · School Code: VD-2024</p>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">VidDarpan Global School</h1>
              <p className="text-xs text-slate-500 mt-0.5">123 Knowledge Park, Sector 14, New Delhi — 110001</p>
              <div className="mt-3 inline-block bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.35em] px-4 py-1">
                Progressive Report Card · Academic Year 2023–24
              </div>
            </div>

            {/* Student info grid */}
            <div className="px-10 py-5 grid grid-cols-2 gap-x-8 gap-y-2.5 border-b border-slate-200">
              {[
                ['Student Name', student.name],
                ['Roll Number',  student.rollNo.toString().padStart(3, '0')],
                ['Class / Section', '10-A'],
                ['Admission No.', 'VD-2024-0' + student.rollNo],
                ['Examination', 'Mid-Term Examination 2024'],
                ['Academic Session', '2023 – 2024'],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-2 text-xs">
                  <span className="text-slate-400 w-32 shrink-0">{label}</span>
                  <span className="font-semibold text-slate-900 border-b border-dotted border-slate-300 flex-1 pb-0.5">{val}</span>
                </div>
              ))}
            </div>

            {/* Marks table */}
            <div className="px-10 py-6">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Subject-wise Performance</p>
              <table className="w-full text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="border border-slate-200 px-3 py-2 text-left font-semibold">Subject</th>
                    <th className="border border-slate-200 px-3 py-2 text-left font-semibold">Code</th>
                    <th className="border border-slate-200 px-3 py-2 text-center font-semibold">Max. Marks</th>
                    <th className="border border-slate-200 px-3 py-2 text-center font-semibold">Marks Obtained</th>
                    <th className="border border-slate-200 px-3 py-2 text-center font-semibold">Grade</th>
                    <th className="border border-slate-200 px-3 py-2 text-left font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub) => (
                    <tr key={sub.code}>
                      <td className="border border-slate-200 px-3 py-2 font-medium text-slate-800">{sub.name}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-500">{sub.code}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center">{sub.mm}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-800">{sub.marks}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center font-bold">{sub.grade}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-400 italic">
                        {sub.marks >= 90 ? 'Excellent' : sub.marks >= 75 ? 'Good' : 'Satisfactory'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="border border-slate-300 px-3 py-2" colSpan={2}>Grand Total</td>
                    <td className="border border-slate-300 px-3 py-2 text-center">{totalMax}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-bold text-slate-900">{totalObt}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-bold">{student.grade}</td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-500">{pct}% — {student.status}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Grade legend */}
            <div className="px-10 pb-5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Grading Scale</p>
              <div className="flex gap-0 border border-slate-200 text-[9px] text-slate-500 divide-x divide-slate-200 w-fit">
                {[['A+','91–100'],['A','75–90'],['B+','61–74'],['B','46–60'],['C','33–45'],['D','<33']].map(([g, r]) => (
                  <div key={g} className="px-3 py-1.5 text-center">
                    <div className="font-bold text-slate-700">{g}</div>
                    <div>{r}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher remarks */}
            <div className="px-10 pb-6">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Class Teacher's Remarks</p>
              <div className="border border-slate-200 rounded p-3 min-h-[48px] text-xs text-slate-400 italic bg-slate-50">
                Consistent performance throughout the term. Keep up the good work.
              </div>
            </div>

            {/* Signatures */}
            <div className="px-10 pb-10 border-t border-slate-200 pt-6 grid grid-cols-3 gap-6 text-center">
              {['Class Teacher', 'Examination In-charge', 'Principal'].map((role) => (
                <div key={role}>
                  <div className="h-8" />
                  <div className="border-t border-slate-400" />
                  <p className="text-[9px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">{role}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}