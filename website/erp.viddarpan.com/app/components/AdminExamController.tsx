"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  MapPin, 
  FileText, 
  Printer, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Download,
  MoreVertical,
  X,
  ArrowLeft,
  Upload,
  Trash2,
  Plus,
  CalendarDays
} from 'lucide-react';

// --- Types ---
type SubTab = 'roster' | 'admit-cards' | 'seating' | 'datesheet';

interface TeacherDuty {
  id: string;
  teacherName: string;
  subject: string;
  room: string;
  date: string;
  shift: 'Morning' | 'Evening';
  status: 'Confirmed' | 'Pending';
}

interface StudentAdmitCard {
  rollNo: string;
  name: string;
  class: string;
  stream?: string;
  status: 'Generated' | 'Not Generated';
}

// --- Mock Data ---
const mockDuties: TeacherDuty[] = [
  { id: '1', teacherName: 'Mr. Arvind Khanna', subject: 'Mathematics', room: 'Lab 204', date: '2024-03-12', shift: 'Morning', status: 'Confirmed' },
  { id: '2', teacherName: 'Ms. Sunita Rao', subject: 'Physics', room: 'Room 102', date: '2024-03-12', shift: 'Morning', status: 'Confirmed' },
  { id: '3', teacherName: 'Dr. Vivek Sharma', subject: 'Chemistry', room: 'Hall A', date: '2024-03-14', shift: 'Evening', status: 'Pending' },
  { id: '4', teacherName: 'Ms. Priya Singh', subject: 'English', room: 'Room 305', date: '2024-03-14', shift: 'Morning', status: 'Confirmed' },
  { id: '5', teacherName: 'Mr. Rajesh Kumar', subject: 'Computer Sci', room: 'IT Lab', date: '2024-03-15', shift: 'Morning', status: 'Pending' }
];

const mockStudents: StudentAdmitCard[] = [
  { rollNo: '101', name: 'Arjun Mehta', class: '12', stream: 'Science', status: 'Generated' },
  { rollNo: '102', name: 'Divya Nair', class: '12', stream: 'Science', status: 'Generated' },
  { rollNo: '103', name: 'Sahil Choudhary', class: '12', stream: 'Science', status: 'Not Generated' },
  { rollNo: '104', name: 'Pooja Iyer', class: '12', stream: 'Commerce', status: 'Generated' },
  { rollNo: '105', name: 'Rajan Sood', class: '12', stream: 'Humanities', status: 'Generated' }
];

export default function AdminExamController() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Confirmed' | 'Pending' | 'Generated' | 'Not Generated'>('All');
  const [isSeatingModalOpen, setIsSeatingModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [isAdmitCardModalOpen, setIsAdmitCardModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentAdmitCard | null>(null);

  // Filter Logic
  const filteredDuties = mockDuties.filter(duty => {
    const matchesSearch = 
      duty.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      duty.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      duty.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || duty.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery);
    
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Examination Controller
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage exam invigilation duties, admit cards, and seating plans — for general school duties see <span className="font-semibold text-slate-700">Assign Duties</span></p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button 
            onClick={() => {
              if (activeSubTab === 'seating') setIsSeatingModalOpen(true);
              if (activeSubTab === 'roster') setIsRosterModalOpen(true);
              if (activeSubTab === 'admit-cards') setIsAdmitCardModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusIcon />
            {activeSubTab === 'roster' ? 'Assign Duty' : activeSubTab === 'admit-cards' ? 'Bulk Generate' : activeSubTab === 'datesheet' ? 'Add Entry' : 'New Seating Plan'}
          </button>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
          <TabButton 
            active={activeSubTab === 'roster'} 
            onClick={() => { setActiveSubTab('roster'); setFilterStatus('All'); setSearchQuery(''); }}
            icon={<Users className="w-4 h-4" />}
            label="Invigilation Roster"
          />
          <TabButton 
            active={activeSubTab === 'admit-cards'} 
            onClick={() => { setActiveSubTab('admit-cards'); setFilterStatus('All'); setSearchQuery(''); }}
            icon={<FileText className="w-4 h-4" />}
            label="Admit Cards"
          />
          <TabButton 
            active={activeSubTab === 'seating'} 
            onClick={() => { setActiveSubTab('seating'); setFilterStatus('All'); setSearchQuery(''); }}
            icon={<MapPin className="w-4 h-4" />}
            label="Seating Plan"
          />
          <TabButton 
            active={activeSubTab === 'datesheet'} 
            onClick={() => { setActiveSubTab('datesheet'); setFilterStatus('All'); setSearchQuery(''); }}
            icon={<CalendarDays className="w-4 h-4" />}
            label="Datesheet"
          />
        </div>

        {activeSubTab !== 'seating' && (
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px] font-bold uppercase tracking-wider">
            <button 
              onClick={() => setFilterStatus('All')}
              className={`px-3 py-1 rounded-md transition-all ${filterStatus === 'All' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus(activeSubTab === 'roster' ? 'Confirmed' : 'Generated')}
              className={`px-3 py-1 rounded-md transition-all ${filterStatus === (activeSubTab === 'roster' ? 'Confirmed' : 'Generated') ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              {activeSubTab === 'roster' ? 'Confirmed' : 'Generated'}
            </button>
            <button 
              onClick={() => setFilterStatus(activeSubTab === 'roster' ? 'Pending' : 'Not Generated')}
              className={`px-3 py-1 rounded-md transition-all ${filterStatus === (activeSubTab === 'roster' ? 'Pending' : 'Not Generated') ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}
            >
              {activeSubTab === 'roster' ? 'Pending' : 'Pending'}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden min-h-[550px] flex flex-col">
        {activeSubTab !== 'seating' && (
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder={`Search ${activeSubTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => {
                  const statuses = activeSubTab === 'roster' ? ['All', 'Confirmed', 'Pending'] : ['All', 'Generated', 'Not Generated'];
                  const currentIndex = statuses.indexOf(filterStatus);
                  const nextIndex = (currentIndex + 1) % statuses.length;
                  setFilterStatus(statuses[nextIndex] as any);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {filterStatus === 'All' ? 'Filter' : filterStatus}
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {activeSubTab === 'roster' && <InvigilationRoster data={filteredDuties} />}
          {activeSubTab === 'admit-cards' && <AdmitCards data={filteredStudents} onPreview={setSelectedStudent} />}
          {activeSubTab === 'seating' && <SeatingPlan onOpenCreate={() => setIsSeatingModalOpen(true)} />}
          {activeSubTab === 'datesheet' && <DatesheetTab />}
        </div>
      </div>

      {/* Roster Modal */}
      {isRosterModalOpen && (
        <RosterModal onClose={() => setIsRosterModalOpen(false)} />
      )}

      {/* Seating Plan Modal */}
      {isSeatingModalOpen && (
        <SeatingModal onClose={() => setIsSeatingModalOpen(false)} />
      )}

      {/* Admit Card Modal */}
      {isAdmitCardModalOpen && (
        <AdmitCardModal onClose={() => setIsAdmitCardModalOpen(false)} />
      )}

      {/* Admit Card Preview Modal */}
      {selectedStudent && (
        <AdmitCardPreview student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}

// --- List Components ---

function RosterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Assign Invigilation Duty</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="p-6 space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Select Teacher</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
              <option>Mr. Arvind Khanna</option>
              <option>Ms. Sunita Rao</option>
              <option>Dr. Vivek Sharma</option>
              <option>Ms. Priya Singh</option>
              <option>Mr. Rajesh Kumar</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Exam Room</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                <option>Hall A</option>
                <option>Hall B</option>
                <option>Science Lab</option>
                <option>Room 304</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Shift</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                <option>Morning (9 AM - 12 PM)</option>
                <option>Evening (2 PM - 5 PM)</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Exam Date</label>
            <input type="date" defaultValue="2024-03-20" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-3">
            <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>Check Availability:</strong> The system verifies teacher schedules to prevent double-booking with their regular classes or other exam duties.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md rounded-lg transition-colors">
              Assign & Notify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdmitCardModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Bulk Generate Admit Cards</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="p-6 space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Select Class</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
              <option>Class 12 (All Streams)</option>
              <option>Class 11 (All Streams)</option>
              <option>Class 10</option>
              <option>Class 9</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Exam Session</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
              <option>Annual Examination 2024</option>
              <option>Half-Yearly 2023-24</option>
              <option>Pre-Board Examination</option>
            </select>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-3">
            <AlertCircleIcon className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>Wait Time:</strong> Generating cards for an entire class may take 20-30 seconds. You will receive a ZIP file containing all PDFs.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md rounded-lg transition-colors">
              Process & Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvigilationRoster({ data }: { data: TeacherDuty[] }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
        <tr>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Shift</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((duty) => (
          <tr key={duty.id} className="hover:bg-slate-50/80 transition-colors group">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                  {duty.teacherName.charAt(duty.teacherName.startsWith('Mr.') || duty.teacherName.startsWith('Ms.') ? 4 : 0)}
                </div>
                <span className="text-sm font-semibold text-slate-800">{duty.teacherName}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">{duty.subject}</span>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {duty.room}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">{new Date(duty.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {duty.shift}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                duty.status === 'Confirmed' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {duty.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AdmitCards({ data, onPreview }: { data: StudentAdmitCard[], onPreview: (student: StudentAdmitCard) => void }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
        <tr>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll No</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class & Stream</th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Operations</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((student) => (
          <tr key={student.rollNo} className="hover:bg-slate-50/80 transition-colors">
            <td className="px-6 py-4 text-sm font-bold text-slate-500">#{student.rollNo}</td>
            <td className="px-6 py-4 text-sm font-semibold text-slate-800">{student.name}</td>
            <td className="px-6 py-4 text-sm font-medium text-slate-600">
              Class {student.class} {student.stream && <span className="text-slate-400 ml-1">({student.stream})</span>}
            </td>
            <td className="px-6 py-4 text-right">
              {student.status === 'Generated' ? (
                <div className="flex items-center justify-end gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors">
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                  <button 
                    onClick={() => onPreview(student)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <EyeIcon />
                  </button>
                </div>
              ) : (
                <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  Generate Admit Card
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AdmitCardPreview({ student, onClose }: { student: StudentAdmitCard, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-2">
            <EyeIcon />
            <h2 className="text-lg font-bold text-slate-900">Hall Ticket Preview</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 sm:p-10 bg-slate-50 flex-1 overflow-y-auto flex justify-center">
          {/* Admit Card Visual Mock */}
          <div className="w-full max-w-[450px] bg-white border-2 border-slate-300 rounded-sm shadow-sm overflow-hidden text-slate-900 h-fit">
            <div className="p-6 border-b-2 border-slate-300 text-center space-y-1">
              <h3 className="text-lg font-black uppercase tracking-tight">VidDarpan Global School</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Annual Examination Session 2023-24</p>
              <div className="inline-block mt-3 px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-sm italic">
                Admit Card / Hall Ticket
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-y-6">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Candidate Name</p>
                <p className="text-sm font-black uppercase tracking-tight">{student.name}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Roll Number</p>
                <p className="text-sm font-black uppercase tracking-tight font-mono">{student.rollNo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Class / Stream</p>
                <p className="text-sm font-black uppercase tracking-tight">{student.class}th / {student.stream || 'N/A'}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">School Code</p>
                <p className="text-sm font-black uppercase tracking-tight font-mono">VDGS-9921</p>
              </div>

              <div className="col-span-2 pt-4 border-t border-slate-100">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 font-black uppercase tracking-widest text-slate-400">Subject</th>
                      <th className="text-right py-2 font-black uppercase tracking-widest text-slate-400">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    <tr><td className="py-2">Mathematics</td><td className="text-right py-2">March 12, 2024</td></tr>
                    <tr><td className="py-2">English Core</td><td className="text-right py-2">March 15, 2024</td></tr>
                    <tr><td className="py-2">Physics</td><td className="text-right py-2">March 18, 2024</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t-2 border-slate-300 flex justify-between items-end">
              <div className="w-24 h-24 border border-slate-200 bg-white flex items-center justify-center p-2">
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] items-center italic text-slate-300 border border-dashed border-slate-200">
                  Student Photo
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-1 bg-slate-300 mb-2 mx-auto" />
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Principal's Signature</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors rounded-lg"
          >
            Close Preview
          </button>
          <button className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md rounded-lg flex items-center gap-2 transition-colors">
            <Printer className="w-4 h-4" />
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Seating Plan Logic ---

function SeatingPlan({ onOpenCreate }: { onOpenCreate: () => void }) {
  const [activePlan, setActivePlan] = useState<any>(null);

  const mockPlans = [
    { id: 'S1', room: 'Exam Hall A', capacity: 40, taken: 38, rows: 5, cols: 8, subject: 'Mathematics' },
    { id: 'S2', room: 'Room 204', capacity: 20, taken: 15, rows: 4, cols: 5, subject: 'Physics' }
  ];

  if (activePlan) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button onClick={() => setActivePlan(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Room List
          </button>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md hover:bg-indigo-100 transition-colors">
              <Printer className="w-3.5 h-3.5" />
              Print Seat Labels
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download Door List
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 border border-slate-200 rounded-lg p-5 bg-white space-y-4 shadow-sm h-fit">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan Summary</h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <div className="flex items-center gap-2 text-slate-800">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span className="font-bold">{activePlan.room}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subject</p>
                <div className="flex items-center gap-2 text-slate-800">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="font-bold">{activePlan.subject}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-xl font-black text-slate-900 font-mono">{activePlan.capacity}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Allocated</p>
                  <p className="text-xl font-black text-emerald-600 font-mono">{activePlan.taken}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 border border-slate-200 rounded-lg p-8 bg-slate-50 relative min-h-[400px]">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-10 py-2 border-b-4 border-slate-300 border-x border-t rounded shadow-sm text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
              BLACKBOARD / SCREEN
            </div>
            
            <div 
              className="grid gap-3 mt-16 mx-auto" 
              style={{ 
                gridTemplateColumns: `repeat(${activePlan.cols}, minmax(0, 1fr))`,
                maxWidth: activePlan.cols * 60
              }}
            >
              {Array.from({ length: activePlan.rows * activePlan.cols }).map((_, i) => {
                const isOccupied = i < activePlan.taken;
                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-md border flex flex-col items-center justify-center transition-all ${
                      isOccupied 
                        ? 'bg-white border-slate-200 shadow-sm' 
                        : 'bg-slate-100/50 border-dashed border-slate-200'
                    }`}
                  >
                    <span className="text-[9px] font-black text-slate-300 mb-0.5">{i + 1}</span>
                    {isOccupied && <Users className="w-3.5 h-3.5 text-indigo-500/60" />}
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-center gap-10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white border border-slate-200" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Occupied Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-100 border border-dashed border-slate-200" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Available Seat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50/30 h-full overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlans.map(plan => (
          <div 
            key={plan.id} 
            onClick={() => setActivePlan(plan)}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                <MapPin className="w-5 h-5" />
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{plan.room}</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">{plan.subject} Examination</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-50 mt-auto">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Room Capacity</span>
                <span>{plan.capacity}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(plan.taken / plan.capacity) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">{plan.taken} Occupied</span>
                <span className="text-indigo-600">{plan.capacity - plan.taken} Seats Free</span>
              </div>
            </div>
          </div>
        ))}

        {/* New Plan Trigger Card */}
        <div 
          onClick={onOpenCreate}
          className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all group min-h-[220px]"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm border border-slate-100 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all">
            <PlusIcon />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Create Seating Plan</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-[160px]">Generate student distribution for a new exam hall</p>
        </div>
      </div>
    </div>
  );
}

function SeatingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">New Seating Plan</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="p-6 space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Exam Hall / Room</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
              <option>Hall A (Main)</option>
              <option>Hall B (Wing C)</option>
              <option>Science Lab 102</option>
              <option>Room 304</option>
              <option>Library Annex</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Rows</label>
              <input type="number" defaultValue={5} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Columns</label>
              <input type="number" defaultValue={6} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Select Class / Subject</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
              <option>Class 12 - Mathematics</option>
              <option>Class 10 - English</option>
              <option>Class 12 - Physics</option>
              <option>Mixed (Multiple Classes)</option>
            </select>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>Smart Allocation:</strong> The system will automatically shuffle students to ensure neighboring students belong to different classes or seat sequences.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md rounded-lg transition-colors">
              Generate Seating Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Datesheet Tab ---

interface DatesheetEntry {
  id: string;
  subject: string;
  class: string;
  date: string;
  day: string;
  shift: 'Morning' | 'Afternoon';
  time: string;
  venue: string;
}

function DatesheetTab() {
  const [entries, setEntries] = useState<DatesheetEntry[]>([
    { id: 'E1', subject: 'Mathematics',     class: '10',   date: '2024-03-12', day: 'Tuesday',   shift: 'Morning',   time: '09:00 – 12:00', venue: 'Exam Hall A' },
    { id: 'E2', subject: 'English Core',    class: '10',   date: '2024-03-15', day: 'Friday',    shift: 'Morning',   time: '09:00 – 12:00', venue: 'Exam Hall A' },
    { id: 'E3', subject: 'Physics',         class: '12',   date: '2024-03-12', day: 'Tuesday',   shift: 'Afternoon', time: '14:00 – 17:00', venue: 'Exam Hall B' },
    { id: 'E4', subject: 'Chemistry',       class: '12',   date: '2024-03-14', day: 'Thursday',  shift: 'Afternoon', time: '14:00 – 17:00', venue: 'Lab 104' },
    { id: 'E5', subject: 'History',         class: '9',    date: '2024-03-18', day: 'Monday',    shift: 'Morning',   time: '09:00 – 12:00', venue: 'Room 302' },
    { id: 'E6', subject: 'Computer Sci.',   class: '11',   date: '2024-03-20', day: 'Wednesday', shift: 'Morning',   time: '09:00 – 12:00', venue: 'IT Lab' },
  ]);
  const [filterClass, setFilterClass] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const classes = ['All', '9', '10', '11', '12'];
  const filtered = filterClass === 'All' ? entries : entries.filter(e => e.class === filterClass);

  const handleDelete = (id: string) => setEntries(entries.filter(e => e.id !== id));

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {classes.map(c => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterClass === c ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {c === 'All' ? 'All Classes' : `Class ${c}`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload PDF Datesheet
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
            <tr>
              <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
              <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Day</th>
              <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Shift & Time</th>
              <th className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Venue</th>
              <th className="px-5 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(entry => (
              <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-3.5">
                  {editingId === entry.id ? (
                    <input
                      defaultValue={entry.subject}
                      onBlur={(e) => setEntries(entries.map(en => en.id === entry.id ? { ...en, subject: e.target.value } : en))}
                      className="w-full px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-800">{entry.subject}</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                    Class {entry.class}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{entry.day}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold uppercase tracking-wide ${entry.shift === 'Morning' ? 'text-amber-600' : 'text-blue-600'}`}>{entry.shift}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{entry.time}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-slate-600">{entry.venue}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(editingId === entry.id ? null : entry.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors text-xs font-bold"
                    >
                      {editingId === entry.id ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No exam entries for the selected class.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PDF Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Upload Datesheet PDF</h2>
              </div>
              <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer bg-slate-50">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">Drop PDF file here or <span className="text-indigo-600">browse</span></p>
                <p className="text-xs text-slate-400 mt-1">Supported: PDF, DOC, DOCX · Max size: 10 MB</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exam Session</label>
                <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                  <option>Annual Examination 2024</option>
                  <option>Half-Yearly 2023-24</option>
                  <option>Pre-Board Examination</option>
                  <option>Unit Test – Q4</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={() => setShowUpload(false)} className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Upload & Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Icons / Helpers ---

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${
        active 
          ? 'bg-slate-900 text-white shadow-md' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PlusIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>; }
function EyeIcon() { return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>; }
function AlertCircleIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
