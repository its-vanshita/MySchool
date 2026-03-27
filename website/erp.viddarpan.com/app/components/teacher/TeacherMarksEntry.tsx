"use client";

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Search, 
  Save, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Send,
  History,
  GraduationCap
} from 'lucide-react';

interface StudentMark {
  rollNo: number;
  name: string;
  marks: number | string;
}

interface MarksWindow {
  id: string;
  class: string;
  exam: string;
  subject: string;
  openedAt: string; // ISO string
  status: 'Open' | 'Locked' | 'Pending Unlock';
}

export default function TeacherMarksEntry() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedExam, setSelectedExam] = useState('Unit Test 1');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  
  const [marks, setMarks] = useState<StudentMark[]>([
    { rollNo: 1, name: 'Aisha Patel', marks: '' },
    { rollNo: 2, name: 'Rahul Kumar', marks: '' },
    { rollNo: 3, name: 'Priya Sharma', marks: '' },
    { rollNo: 4, name: 'Kabir Singh', marks: '' },
    { rollNo: 5, name: 'Ananya Desai', marks: '' },
  ]);

  // Mock windows data
  const [windows, setWindows] = useState<MarksWindow[]>([
    { 
      id: 'W1', 
      class: '10-A', 
      exam: 'Unit Test 1', 
      subject: 'Mathematics', 
      openedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago (Still open)
      status: 'Open' 
    },
    { 
      id: 'W2', 
      class: '10-A', 
      exam: 'Mid Terms', 
      subject: 'Mathematics', 
      openedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago (Locked)
      status: 'Locked' 
    }
  ]);

  const [currentWindow, setCurrentWindow] = useState<MarksWindow | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const window = windows.find(w => 
      w.class === selectedClass && 
      w.exam === selectedExam && 
      w.subject === selectedSubject
    );
    setCurrentWindow(window || null);
  }, [selectedClass, selectedExam, selectedSubject, windows]);

  useEffect(() => {
    if (!currentWindow || currentWindow.status !== 'Open') {
      setTimeLeft('');
      return;
    }

    const timer = setInterval(() => {
      const openedAt = new Date(currentWindow.openedAt).getTime();
      const lockAt = openedAt + 24 * 60 * 60 * 1000;
      const now = Date.now();
      const diff = lockAt - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        // Auto-lock simulation
        setWindows(prev => prev.map(w => w.id === currentWindow.id ? { ...w, status: 'Locked' } : w));
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentWindow]);

  const handleMarkChange = (rollNo: number, value: string) => {
    if (currentWindow?.status !== 'Open') return;
    setMarks(prev => prev.map(s => s.rollNo === rollNo ? { ...s, marks: value } : s));
  };

  const adjustMark = (rollNo: number, amount: number) => {
    if (currentWindow?.status !== 'Open') return;
    setMarks(prev => prev.map(s => {
      if (s.rollNo === rollNo) {
        const currentVal = Number(s.marks) || 0;
        const newVal = Math.max(0, Math.min(100, currentVal + amount));
        return { ...s, marks: newVal };
      }
      return s;
    }));
  };

  const openWindow = () => {
    const newWindow: MarksWindow = {
      id: Math.random().toString(36).substr(2, 9),
      class: selectedClass,
      exam: selectedExam,
      subject: selectedSubject,
      openedAt: new Date().toISOString(),
      status: 'Open'
    };
    setWindows([...windows, newWindow]);
  };

  const requestUnlock = () => {
    if (!currentWindow) return;
    setWindows(prev => prev.map(w => w.id === currentWindow.id ? { ...w, status: 'Pending Unlock' } : w));
  };

  return (
    <div className="flex flex-col space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">
            Marks Entry & Grading
          </h1>
          <p className="text-sm text-slate-500 mt-1">Select a class and exam type to input student performance records.</p>
        </div>
        
        {/* Active Timer Pill */}
        {currentWindow?.status === 'Open' && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md">
             <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
             <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-700">Ends In:</span>
                <span className="text-sm font-mono font-bold text-amber-700">{timeLeft}</span>
             </div>
          </div>
        )}
      </div>

      {/* Lock Policy Warning */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3 text-sm">
         <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
         <div className="text-slate-600">
            <span className="font-semibold text-slate-700">Strict Lock Policy: </span> 
            Once you open an entry window, you have exactly <strong>24 hours</strong> to enter and save marks. After 24 hours, the portal will lock automatically. Any changes after the lock will require principal approval.
         </div>
      </div>

      {/* Toolbar / Selectors */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
           <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition-colors"
              >
                <option value="9-A">9-A</option>
                <option value="10-A">10-A</option>
                <option value="11-Sci">11-Sci</option>
              </select>
           </div>

           <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Exam Type</label>
              <select 
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition-colors"
              >
                <option value="Unit Test 1">Unit Test 1</option>
                <option value="Unit Test 2">Unit Test 2</option>
                <option value="Mid Terms">Mid Terms</option>
                <option value="Finals">Finals</option>
              </select>
           </div>

           <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition-colors"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
           </div>

           {!currentWindow && (
             <button 
               onClick={openWindow}
               className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
             >
               <Unlock className="w-4 h-4" /> Open 24h Portal
             </button>
           )}
        </div>
      </div>

      {/* Main Table / State Area */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
         {/* States */}
         {!currentWindow ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <PlusCircle className="w-10 h-10 text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700 mb-1">Start Entry Process</h3>
              <p className="max-w-xs text-sm text-slate-500">The portal is currently inactive for this subject. Click "Open 24h Portal" above to begin.</p>
           </div>
         ) : currentWindow.status === 'Locked' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                 <Lock className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">Window Locked</h3>
              <p className="max-w-md text-sm text-slate-500 mb-6">The 24-hour entry period has expired. No further changes can be made.</p>
              <button 
                onClick={requestUnlock}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4 text-slate-400" /> Request Admin Override
              </button>
           </div>
         ) : currentWindow.status === 'Pending Unlock' ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <History className="w-10 h-10 text-amber-500 mb-3" />
              <h3 className="text-base font-semibold text-slate-900 mb-1">Override Pending</h3>
              <p className="max-w-sm text-sm text-slate-500">Your unlock request is under review by the principal. You will be notified when access is restored.</p>
           </div>
         ) : (
           /* Active Data Table */
           <div className="flex flex-col h-full">
              <div className="px-5 py-3 border-b border-slate-200 bg-emerald-50/30 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Portal Open for {selectedClass} • {selectedExam}</span>
                 </div>
                 <span className="text-xs text-slate-500">Changes are auto-saved locally</span>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left bg-white">
                    <thead className="bg-slate-50 border-b border-slate-200">
                       <tr>
                          <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Roll No.</th>
                          <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                          <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-48">Marks (100)</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {marks.map((student) => (
                         <tr key={student.rollNo} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3.5 text-sm font-medium text-slate-500">
                              {student.rollNo.toString().padStart(2, '0')}
                            </td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">
                              {student.name}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                               <div className="inline-flex items-center px-2 py-1 bg-white border border-slate-300 rounded focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                  <input 
                                    type="number" 
                                    min="0"
                                    max="100"
                                    value={student.marks}
                                    onChange={(e) => handleMarkChange(student.rollNo, e.target.value)}
                                    className="w-14 text-sm font-semibold text-center bg-transparent border-none focus:outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none text-slate-900"
                                    placeholder="--"
                                  />
                                  <div className="flex flex-col border-l border-slate-200 pl-1.5 ml-1">
                                     <button 
                                       onClick={() => adjustMark(student.rollNo, 1)}
                                       className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                                     >
                                        <ChevronUp size={12} strokeWidth={3} />
                                     </button>
                                     <button 
                                       onClick={() => adjustMark(student.rollNo, -1)}
                                       className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                                     >
                                        <ChevronDown size={12} strokeWidth={3} />
                                     </button>
                                  </div>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end mt-auto">
                 <button className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Save Final Draft
                 </button>
              </div>
           </div>
         )}
      </div>

    </div>
  );
}
