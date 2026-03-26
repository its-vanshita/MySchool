import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Users, UserCheck, UserX, Save, Calendar } from 'lucide-react';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  status: 'present' | 'absent' | 'none';
  avatar?: string;
}

const INITIAL_STUDENTS: Student[] = [
  { id: '1', rollNo: '101', name: 'Aarav Sharma', status: 'none', avatar: 'AS' },
  { id: '2', rollNo: '102', name: 'Diya Patel', status: 'none', avatar: 'DP' },
  { id: '3', rollNo: '103', name: 'Ishaan Singh', status: 'none', avatar: 'IS' },
  { id: '4', rollNo: '104', name: 'Kavya Gupta', status: 'none', avatar: 'KG' },
  { id: '5', rollNo: '105', name: 'Rohan Kumar', status: 'none', avatar: 'RK' },
  { id: '6', rollNo: '106', name: 'Ananya Verma', status: 'none', avatar: 'AV' },
  { id: '7', rollNo: '107', name: 'Vivaan Reddy', status: 'none', avatar: 'VR' },
  { id: '8', rollNo: '108', name: 'Neha Singh', status: 'none', avatar: 'NS' },
];

export default function TeacherAttendance() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('X-A');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (id: string, newStatus: Student['status']) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    ));
  };

  const markAll = (status: Student['status']) => {
    setStudents(students.map(student => ({ ...student, status })));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Attendance submitted successfully!');
    }, 1000);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNo.includes(searchQuery)
  );

  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const unmarkedCount = totalStudents - presentCount - absentCount;
  const progressPercentage = totalStudents === 0 ? 0 : Math.round(((presentCount + absentCount) / totalStudents) * 100);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Daily Attendance</h1>
          <div className="flex items-center gap-2 mt-1.5 text-slate-500 text-sm font-medium">
            <Calendar className="w-4 h-4 text-blue-500" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            className="flex-1 sm:w-40 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="X-A">Class X - Section A</option>
            <option value="X-B">Class X - Section B</option>
            <option value="XI-A">Class XI - Section A</option>
          </select>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || unmarkedCount > 0}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
              isSubmitting || unmarkedCount > 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:shadow-md'
            }`}
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
            <p className="text-2xl font-bold text-slate-800 leading-none mt-1">{totalStudents}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present</p>
            <p className="text-2xl font-bold text-slate-800 leading-none mt-1">{presentCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absent</p>
            <p className="text-2xl font-bold text-slate-800 leading-none mt-1">{absentCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion</p>
            <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {unmarkedCount > 0 && (
            <p className="text-[10px] font-medium text-amber-500 mt-2 text-right">{unmarkedCount} remaining</p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by roll number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:font-normal"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => markAll('none')}
              className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap"
            >
              Reset
            </button>
            <button 
              onClick={() => markAll('present')}
              className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap"
            >
              Mark All Present
            </button>
            <button 
              onClick={() => markAll('absent')}
              className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-semibold transition-all shadow-sm whitespace-nowrap"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">Roll No</div>
          <div className="col-span-5">Student Info</div>
          <div className="col-span-5 text-right pr-2">Attendance Status</div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1.5 pb-4">
            {filteredStudents.map(student => (
              <div 
                key={student.id} 
                className={`group grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl transition-all ${
                  student.status === 'present' ? 'bg-green-50/30' :
                  student.status === 'absent' ? 'bg-red-50/30' :
                  'bg-white hover:bg-slate-50'
                } border ${
                  student.status === 'present' ? 'border-green-100' :
                  student.status === 'absent' ? 'border-red-100' :
                  'border-transparent hover:border-slate-200'
                }`}
              >
                {/* Roll No */}
                <div className="col-span-2">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                    {student.rollNo}
                  </span>
                </div>

                {/* Info */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border
                    ${student.status === 'present' ? 'bg-green-100 text-green-700 border-green-200' : 
                      student.status === 'absent' ? 'bg-red-100 text-red-700 border-red-200' : 
                      'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {student.avatar || student.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{student.name}</h3>
                    <p className="text-xs font-medium text-slate-500 line-clamp-1">Class {selectedClass}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-5 flex justify-end gap-2 relative">
                  {student.status !== 'none' && (
                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => handleStatusChange(student.id, 'none')}
                         className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-full shadow-sm border border-slate-200"
                         title="Clear selection"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinelinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => handleStatusChange(student.id, 'present')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      student.status === 'present' 
                        ? 'bg-green-500 text-white shadow-md shadow-green-200 ring-2 ring-green-200 ring-offset-1' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-green-300 hover:text-green-600 shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${student.status === 'present' ? 'text-white' : 'text-slate-400'}`} />
                    Present
                  </button>
                  <button 
                    onClick={() => handleStatusChange(student.id, 'absent')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      student.status === 'absent' 
                        ? 'bg-red-500 text-white shadow-md shadow-red-200 ring-2 ring-red-200 ring-offset-1' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-red-300 hover:text-red-600 shadow-sm'
                    }`}
                  >
                    <XCircle className={`w-4 h-4 ${student.status === 'absent' ? 'text-white' : 'text-slate-400'}`} />
                    Absent
                  </button>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-base font-bold text-slate-700 mb-1">No students found</h3>
                <p className="text-sm text-slate-500">We couldn't find any students matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
