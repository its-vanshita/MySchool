"use client";

import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

const mockDatesheets = [
  {
    examName: 'Mid-Term Examinations 2026',
    classes: ['10-A', '10-B', '11-Sci', '11-Com'],
    schedule: [
      { date: 'Oct 15, 2026', time: '09:00 AM - 12:00 PM', subject: 'Mathematics' },
      { date: 'Oct 17, 2026', time: '09:00 AM - 12:00 PM', subject: 'Physics / Accounts' },
      { date: 'Oct 19, 2026', time: '09:00 AM - 12:00 PM', subject: 'English' },
      { date: 'Oct 21, 2026', time: '09:00 AM - 12:00 PM', subject: 'Chemistry / Business Studies' },
    ]
  },
  {
    examName: 'Unit Test 2 (Grade 9)',
    classes: ['9-A', '9-B'],
    schedule: [
      { date: 'Nov 05, 2026', time: '08:30 AM - 10:00 AM', subject: 'Science' },
      { date: 'Nov 06, 2026', time: '08:30 AM - 10:00 AM', subject: 'Social Studies' },
      { date: 'Nov 07, 2026', time: '08:30 AM - 10:00 AM', subject: 'Hindi' },
    ]
  }
];

const mockDuties = [
  {
    id: 1,
    examName: 'Mid-Term Examinations 2026',
    date: 'Oct 15, 2026',
    time: '08:30 AM - 12:30 PM', // Includes reporting time
    room: 'Hall B',
    assignedClass: 'Mixed (10-A, 11-Sci)',
    role: 'Primary Invigilator',
    coInvigilator: 'Mr. R. Sharma',
    status: 'Upcoming'
  },
  {
    id: 2,
    examName: 'Mid-Term Examinations 2026',
    date: 'Oct 19, 2026',
    time: '08:30 AM - 12:30 PM',
    room: 'Room 204',
    assignedClass: '11-Com',
    role: 'Reliever',
    coInvigilator: 'Mrs. K. Gupta (Primary)',
    status: 'Upcoming'
  },
  {
    id: 3,
    examName: 'Unit Test 1 (Grade 10)',
    date: 'Aug 10, 2026',
    time: '08:30 AM - 10:00 AM',
    room: 'Room 102',
    assignedClass: '10-A',
    role: 'Primary Invigilator',
    coInvigilator: 'None',
    status: 'Completed'
  }
];

export default function TeacherDatesheet() {
  const [activeTab, setActiveTab] = useState<'Duties' | 'Datesheets'>('Duties');
  const [selectedExam, setSelectedExam] = useState(mockDatesheets[0]);

  return (
    <div className="flex flex-col space-y-6 max-w-[1200px] mb-10">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Examination & Duties</h1>
          <p className="text-sm text-slate-500 mt-1">View school exam datesheets and your assigned invigilation duties.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('Duties')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'Duties' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <Users className="w-4 h-4" /> My Duties
           </button>
           <button 
             onClick={() => setActiveTab('Datesheets')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'Datesheets' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <FileSpreadsheet className="w-4 h-4" /> Master Datesheets
           </button>
        </div>
      </div>

      {/* Duties View */}
      {activeTab === 'Duties' && (
        <div className="space-y-6 animate-in fade-in duration-300">
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                 <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Upcoming Duties</p>
                 <p className="text-3xl font-bold text-blue-900">2</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
                 <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Completed (This Term)</p>
                 <p className="text-3xl font-bold text-emerald-900">1</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-5">
                 <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Total Hours</p>
                 <p className="text-3xl font-bold text-amber-900">9.5 <span className="text-sm font-medium text-amber-700">hrs</span></p>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
             <div className="p-5 border-b border-slate-200 bg-slate-50">
               <h3 className="text-sm font-bold text-slate-800">Assigned Invigilation Schedule</h3>
             </div>
             <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam Name</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location & Class</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role Details</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {mockDuties.map(duty => (
                     <tr key={duty.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-800 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-slate-400" /> {duty.date}</p>
                           <p className="text-xs text-slate-500 mt-1 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {duty.time}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-medium text-slate-900">{duty.examName}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {duty.room}</p>
                           <p className="text-xs text-slate-500 mt-1">Class: {duty.assignedClass}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className={`text-xs font-bold px-2 py-1 inline-flex rounded ${duty.role === 'Primary Invigilator' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>{duty.role}</p>
                           <p className="text-[11px] text-slate-500 mt-1">Co: {duty.coInvigilator}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                           {duty.status === 'Upcoming' ? (
                             <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                               <AlertCircle className="w-3 h-3" /> Upcoming
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                               <CheckCircle2 className="w-3 h-3" /> Completed
                             </span>
                           )}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}

      {/* Datesheets View */}
      {activeTab === 'Datesheets' && (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
           
           {/* Sidebar Exam Menu */}
           <div className="w-full lg:w-72 shrink-0 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Published Schedules</h3>
              {mockDatesheets.map((ds, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedExam(ds)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${selectedExam.examName === ds.examName ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                >
                   <p className={`text-sm font-bold ${selectedExam.examName === ds.examName ? 'text-blue-900' : 'text-slate-800'}`}>{ds.examName}</p>
                   <div className="flex flex-wrap gap-1 mt-2">
                     {ds.classes.map(c => (
                       <span key={c} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                         {c}
                       </span>
                     ))}
                   </div>
                </button>
              ))}
           </div>

           {/* Main Schedule View */}
           <div className="flex-1">
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden h-full">
                 <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                   <div>
                     <h2 className="text-lg font-bold text-slate-800">{selectedExam.examName}</h2>
                     <p className="text-sm text-slate-500">Applicable for: {selectedExam.classes.join(', ')}</p>
                   </div>
                   <button className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded transition-colors hidden sm:block">
                      Download PDF
                   </button>
                 </div>
                 
                 <div className="p-0">
                   <table className="w-full text-left">
                      <thead className="bg-white border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">Time</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {selectedExam.schedule.map((entry, idx) => (
                           <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                 <p className="text-sm font-bold text-slate-800">{entry.date}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" />{entry.time}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-sm font-semibold text-blue-800 bg-blue-50 inline-flex px-3 py-1 rounded-md border border-blue-100">{entry.subject}</p>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                 </div>
                 <div className="p-4 border-t border-slate-100 bg-amber-50/50">
                    <p className="text-xs text-amber-700 font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Please note: Students must report 30 minutes prior to exam commencement time.
                    </p>
                 </div>
              </div>
           </div>

        </div>
      )}

    </div>
  );
}
