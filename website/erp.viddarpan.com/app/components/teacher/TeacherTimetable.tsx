"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Printer,
  Download,
  AlertTriangle,
  Users,
  X,
  FileText,
  ExternalLink,
  BookOpen,
  Layout
} from 'lucide-react';

interface TimetableSlot {
  day: string;
  period: number;
  time: string;
  subject: string;
  className: string;
  room: string;
}

const mockSchedule: TimetableSlot[] = [
  // Monday
  { day: 'Monday', period: 1, time: '08:00 - 08:45', subject: 'Mathematics', className: '10-A', room: 'R-102' },
  { day: 'Monday', period: 2, time: '08:45 - 09:30', subject: 'Mathematics', className: '10-B', room: 'R-102' },
  { day: 'Monday', period: 4, time: '10:45 - 11:30', subject: 'Applied Math', className: '11-Sci', room: 'Lab-2' },
  { day: 'Monday', period: 6, time: '12:15 - 13:00', subject: 'Mathematics', className: '9-A', room: 'R-201' },
  
  // Tuesday
  { day: 'Tuesday', period: 1, time: '08:00 - 08:45', subject: 'Mathematics', className: '10-A', room: 'R-102' },
  { day: 'Tuesday', period: 3, time: '09:30 - 10:15', subject: 'Applied Math', className: '11-Com', room: 'R-305' },
  { day: 'Tuesday', period: 5, time: '11:30 - 12:15', subject: 'Mathematics', className: '12-Sci', room: 'Lab-1' },
  
  // Wednesday
  { day: 'Wednesday', period: 2, time: '08:45 - 09:30', subject: 'Mathematics', className: '9-B', room: 'R-202' },
  { day: 'Wednesday', period: 4, time: '10:45 - 11:30', subject: 'Mathematics', className: '10-A', room: 'R-102' },
  { day: 'Wednesday', period: 7, time: '13:00 - 13:45', subject: 'Mathematics', className: '11-Sci', room: 'Lab-2' },

  // Thursday
  { day: 'Thursday', period: 1, time: '08:00 - 08:45', subject: 'Mathematics', className: '10-B', room: 'R-102' },
  { day: 'Thursday', period: 3, time: '09:30 - 10:15', subject: 'Mathematics', className: '9-A', room: 'R-201' },
  { day: 'Thursday', period: 6, time: '12:15 - 13:00', subject: 'Mathematics', className: '12-Sci', room: 'Lab-1' },

  // Friday
  { day: 'Friday', period: 2, time: '08:45 - 09:30', subject: 'Applied Math', className: '11-Sci', room: 'Lab-2' },
  { day: 'Friday', period: 5, time: '11:30 - 12:15', subject: 'Mathematics', className: '10-A', room: 'R-102' },
  { day: 'Friday', period: 7, time: '13:00 - 13:45', subject: 'Mathematics', className: '10-B', room: 'R-102' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [
  { id: 1, time: '08:00 - 08:45' },
  { id: 2, time: '08:45 - 09:30' },
  { id: 3, time: '09:30 - 10:15' },
  { id: 'break', time: '10:15 - 10:45', name: 'Break' },
  { id: 4, time: '10:45 - 11:30' },
  { id: 5, time: '11:30 - 12:15' },
  { id: 6, time: '12:15 - 13:00' },
  { id: 7, time: '13:00 - 13:45' },
];

export default function TeacherTimetable({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [viewType, setViewType] = useState<'Weekly' | 'Daily'>('Weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

  const getSlot = (day: string, periodId: number | string) => {
    return mockSchedule.find(s => s.day === day && s.period === periodId);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            My Timetable
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view your weekly teaching schedule.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
              <Printer className="w-4 h-4" />
              Print
           </button>
           <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Export PDF
           </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
           <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Total Classes (Week)</p>
              <p className="text-xl font-bold text-slate-900">24 Sessions</p>
           </div>
           <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center">
             <Calendar className="w-5 h-5 text-slate-600" />
           </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
           <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Today's Remaining</p>
              <p className="text-xl font-bold text-slate-900">3 Sessions</p>
           </div>
           <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center">
             <Clock className="w-5 h-5 text-slate-600" />
           </div>
        </div>
      </div>

      {/* Substitution Alert (Standard Notification) */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
         <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
               <h4 className="text-sm font-bold text-amber-800">Substitution Assignment</h4>
               <p className="text-sm text-amber-700 mt-1">Class 9-B • Period 7 today. (In place of Mrs. Verma).</p>
            </div>
         </div>
         <button 
           onClick={() => setShowSubModal(true)}
           className="px-4 py-2 bg-white border border-amber-200 text-amber-700 text-sm font-medium rounded-md hover:bg-amber-50 transition-colors shrink-0"
         >
            View Details
         </button>
      </div>

      {/* Timetable Panel */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5">
              <button 
                onClick={() => setViewType('Weekly')}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${viewType === 'Weekly' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Weekly Grid
              </button>
              <button 
                onClick={() => setViewType('Daily')}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${viewType === 'Daily' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Daily List
              </button>
           </div>
           
           {viewType === 'Daily' && (
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const idx = days.indexOf(currentDay);
                    if (idx > 0) setCurrentDay(days[idx-1]);
                  }}
                  disabled={days.indexOf(currentDay) === 0}
                  className="p-1 px-2 border border-slate-200 bg-white rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                   <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold text-slate-700 w-24 text-center">{currentDay}</span>
                <button 
                  onClick={() => {
                    const idx = days.indexOf(currentDay);
                    if (idx < days.length - 1) setCurrentDay(days[idx+1]);
                  }}
                  disabled={days.indexOf(currentDay) === days.length - 1}
                  className="p-1 px-2 border border-slate-200 bg-white rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                   <ChevronRight size={16} />
                </button>
             </div>
           )}
        </div>

        {/* Weekly Grid Content */}
        {viewType === 'Weekly' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
               <thead>
                  <tr>
                     <th className="p-3 border-r border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 w-28 text-center uppercase tracking-wider">
                        Time
                     </th>
                     {days.map(day => (
                       <th key={day} className="p-3 border-r border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 text-center uppercase tracking-wider">
                          {day}
                       </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                  {periods.map((period) => (
                    <tr key={period.id}>
                       <td className="p-3 border-r border-slate-200 bg-slate-50 text-center align-middle">
                          {period.name === 'Break' ? (
                            <span className="text-xs font-medium text-slate-500 block">10:15 - 10:45</span>
                          ) : (
                            <div>
                               <p className="text-xs font-bold text-slate-700 block mb-0.5">Period {period.id}</p>
                               <p className="text-[11px] text-slate-500">{period.time}</p>
                            </div>
                          )}
                       </td>
                       
                       {period.name === 'Break' ? (
                         <td colSpan={6} className="bg-slate-100 border-r border-slate-200 text-center py-4 relative">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recess Break</span>
                         </td>
                       ) : (
                         days.map(day => {
                            const slot = getSlot(day, period.id as number);
                            return (
                              <td key={`${day}-${period.id}`} className={`p-0 border-r border-slate-200 h-24 align-top w-[14%]`}>
                                 {slot ? (
                                   <button 
                                     onClick={() => setSelectedSlot(slot)}
                                     className="p-3 h-full w-full bg-white hover:bg-blue-50/50 transition-all border-l-2 border-transparent hover:border-blue-500 text-left flex flex-col justify-between"
                                   >
                                      <div>
                                         <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{slot.subject}</p>
                                         <p className="text-xs text-slate-600 mt-1 font-medium">{slot.className}</p>
                                      </div>
                                      <div className="flex justify-between items-end mt-2">
                                         <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <MapPin size={10} /> {slot.room}
                                         </span>
                                      </div>
                                   </button>
                                 ) : (
                                   <div className="p-3 h-full w-full flex items-center justify-center bg-slate-50/30">
                                      <span className="text-slate-300 text-xs">—</span>
                                   </div>
                                 )}
                              </td>
                            );
                         })
                       )}
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        ) : (
          /* Daily View Content */
          <div className="p-6">
             <div className="max-w-3xl mx-auto border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left bg-white">
                   <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                         <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32 border-r border-slate-200">Time</th>
                         <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Session Details</th>
                         <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {periods.map((period) => {
                         if (period.name === 'Break') {
                           return (
                             <tr key="break" className="bg-slate-50/80">
                                <td className="px-6 py-4 border-r border-slate-200 align-top">
                                   <div className="text-xs font-medium text-slate-500">10:15 - 10:45</div>
                                </td>
                                <td colSpan={2} className="px-6 py-4 align-middle">
                                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recess Break</span>
                                </td>
                             </tr>
                           );
                         }
                         
                         const slot = getSlot(currentDay, period.id as number);
                         
                         return (
                           <tr key={period.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 border-r border-slate-200 align-top">
                                 <p className="text-sm font-semibold text-slate-700 mb-0.5">Period {period.id}</p>
                                 <p className="text-xs text-slate-500">{period.time}</p>
                              </td>
                              <td className="px-6 py-4 align-middle">
                                 {slot ? (
                                   <div className="flex flex-col gap-1">
                                      <span className="text-sm font-bold text-slate-900">{slot.subject}</span>
                                      <div className="flex items-center gap-4 text-xs text-slate-600">
                                         <span className="flex items-center gap-1.5"><Users size={14} className="text-slate-400" /> Class {slot.className}</span>
                                         <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {slot.room}</span>
                                      </div>
                                   </div>
                                 ) : (
                                   <span className="text-sm text-slate-400 italic">No class scheduled</span>
                                 )}
                              </td>
                              <td className="px-6 py-4 align-middle text-right">
                                 {slot && (
                                   <button 
                                     onClick={() => setActiveTab('Attendance')}
                                     className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
                                   >
                                      Mark Attendance
                                   </button>
                                 )}
                              </td>
                           </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
      {/* MODALS */}

      {/* Substitution Modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
               <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                 Substitution Details
               </h3>
               <button onClick={() => setShowSubModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5"/>
               </button>
            </div>
            <div className="p-0 overflow-y-auto max-h-[70vh]">
               {/* Quick Info Grid */}
               <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50">
                  <div className="p-4">
                     <p className="text-xs text-slate-500 mb-1 font-medium">Class</p>
                     <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                       <Users size={16} className="text-slate-400" /> 9-B
                     </p>
                  </div>
                  <div className="p-4">
                     <p className="text-xs text-slate-500 mb-1 font-medium">Schedule</p>
                     <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                       <Clock size={16} className="text-slate-400" /> 13:00 - 13:45 
                     </p>
                  </div>
               </div>
                
               <div className="p-5">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-slate-500" /> Handover Notes
                  </h4>
                  <div className="pl-6 border-l-2 border-slate-200 ml-1 space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      "Please continue with the Grammar practice on Chapter 4. Students need to complete the exercise on 'Conjunctions' in their practice books."
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      "Note: Group C students may need extra help with the definitions. I have shared the reference PDF below."
                    </p>
                  </div>
               </div>

               <div className="px-5 pb-5">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Linked Resources</h4>
                  <div className="border border-slate-200 rounded-md p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Conjunctions_Lesson_Guide.pdf</p>
                        <p className="text-xs text-slate-500">1.2 MB</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
               <button 
                 onClick={() => setShowSubModal(false)}
                 className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
               >
                 Close
               </button>
               <button 
                 onClick={() => {
                   setShowSubModal(false);
                   setActiveTab('Attendance');
                 }}
                 className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
               >
                 Mark Attendance
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Slot Detailed Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
               <div>
                  <h3 className="text-lg font-semibold text-slate-800">{selectedSlot.subject}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{selectedSlot.day} • {selectedSlot.time}</p>
               </div>
               <button onClick={() => setSelectedSlot(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5"/>
               </button>
            </div>
            
            <div className="p-0">
               <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50">
                  <div className="p-4">
                     <p className="text-xs text-slate-500 mb-1 font-medium">Class</p>
                     <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                       <Users size={16} className="text-slate-400" /> {selectedSlot.className}
                     </p>
                  </div>
                  <div className="p-4">
                     <p className="text-xs text-slate-500 mb-1 font-medium">Room</p>
                     <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                       <MapPin size={16} className="text-slate-400" /> {selectedSlot.room}
                     </p>
                  </div>
               </div>

               <div className="p-5">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={() => {
                         setSelectedSlot(null);
                         setActiveTab('Attendance');
                       }}
                       className="flex items-center gap-2 p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                     >
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Attendance</span>
                     </button>
                     <button 
                       onClick={() => {
                         setSelectedSlot(null);
                         setActiveTab('Lesson Plan');
                       }}
                       className="flex items-center gap-2 p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                     >
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Curriculum</span>
                     </button>
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
               <button 
                 onClick={() => setSelectedSlot(null)}
                 className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
               >
                  Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
