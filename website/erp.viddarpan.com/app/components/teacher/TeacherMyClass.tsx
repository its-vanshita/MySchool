"use client";

import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  GraduationCap, 
  ChevronRight, 
  Search,
  BookOpen,
  Award,
  Phone,
  Mail,
  ArrowLeft,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
  role: 'Class Teacher' | 'Subject Teacher';
  subject: string;
  totalStudents: number;
  room: string;
}

interface StudentData {
  id: string;
  rollNo: number;
  name: string;
  avatar: string;
  attendanceRate: number;
  overallGrade: string;
  parentName: string;
  phone: string;
  email: string;
  // Deep data
  subjectGrades: Record<string, number>;
  behaviors: string[];
}

const mockClasses: ClassData[] = [
  { id: '10-A', name: '10-A', role: 'Class Teacher', subject: 'Mathematics', totalStudents: 45, room: 'R-102' },
  { id: '10-B', name: '10-B', role: 'Subject Teacher', subject: 'Mathematics', totalStudents: 42, room: 'R-102' },
  { id: '11-Sci', name: '11-Sci', role: 'Subject Teacher', subject: 'Applied Math', totalStudents: 38, room: 'Lab-2' }
];

const mockStudents: Record<string, StudentData[]> = {
  '10-A': [
    { id: 'S1', rollNo: 1, name: 'Aisha Patel', avatar: 'AP', attendanceRate: 98, overallGrade: 'A+', parentName: 'Ravi Patel', phone: '+91 98765 43210', email: 'r.patel@example.com', subjectGrades: { 'Mathematics': 95, 'Physics': 92, 'Chemistry': 88, 'English': 91 }, behaviors: ['Excellent participation', 'Helps peers'] },
    { id: 'S2', rollNo: 2, name: 'Rahul Kumar', avatar: 'RK', attendanceRate: 85, overallGrade: 'B', parentName: 'Anita Kumar', phone: '+91 98765 43211', email: 'a.kumar@example.com', subjectGrades: { 'Mathematics': 78, 'Physics': 72, 'Chemistry': 81, 'English': 75 }, behaviors: ['Needs to focus more', 'Often late'] },
    { id: 'S3', rollNo: 3, name: 'Priya Sharma', avatar: 'PS', attendanceRate: 92, overallGrade: 'A', parentName: 'Vivek Sharma', phone: '+91 98765 43212', email: 'v.sharma@example.com', subjectGrades: { 'Mathematics': 88, 'Physics': 90, 'Chemistry': 95, 'English': 85 }, behaviors: ['Very dedicated'] },
  ],
  '10-B': [
    { id: 'S10', rollNo: 1, name: 'Kabir Singh', avatar: 'KS', attendanceRate: 90, overallGrade: 'B+', parentName: 'Sanjay Singh', phone: '+91 98765 43220', email: 's.singh@example.com', subjectGrades: { 'Mathematics': 85, 'Physics': 75, 'Chemistry': 80, 'English': 88 }, behaviors: ['Quiet in class'] },
    { id: 'S11', rollNo: 2, name: 'Ananya Desai', avatar: 'AD', attendanceRate: 95, overallGrade: 'A', parentName: 'Meera Desai', phone: '+91 98765 43221', email: 'm.desai@example.com', subjectGrades: { 'Mathematics': 92, 'Physics': 89, 'Chemistry': 91, 'English': 94 }, behaviors: ['Always submits homework on time'] }
  ]
};

export default function TeacherMyClass() {
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentStudents = selectedClass ? (mockStudents[selectedClass.id] || []) : [];
  
  const filteredStudents = currentStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNo.toString().includes(searchQuery)
  );

  const getSubjectColorOpacity = (grade: number) => {
    if (grade >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (grade >= 75) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (grade >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="flex flex-col space-y-6 max-w-[1200px]">
      
      {/* Header */}
      {!selectedClass ? (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Classes</h1>
            <p className="text-sm text-slate-500 mt-1">Select a class to view student rosters and performance data.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => { setSelectedClass(null); setSelectedStudent(null); setSearchQuery(''); }}
               className="p-2 bg-white border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 transition-colors"
             >
               <ArrowLeft className="w-4 h-4" />
             </button>
             <div>
               <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                 Class {selectedClass.name}
                 <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold ${selectedClass.role === 'Class Teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                   {selectedClass.role}
                 </span>
               </h1>
               <p className="text-sm text-slate-500 mt-1">{selectedClass.subject} • {selectedClass.totalStudents} Students</p>
             </div>
          </div>
          
          <div className="relative w-full md:w-64">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search student..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
             />
          </div>
        </div>
      )}

      {/* Main Content Areas */}
      {!selectedClass ? (
        /* Class Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {mockClasses.map((cls) => (
             <button 
               key={cls.id}
               onClick={() => setSelectedClass(cls)}
               className="bg-white border border-slate-200 rounded-lg p-5 text-left hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full"
             >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110" />
                
                <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                         <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-slate-800">{cls.name}</h3>
                         <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold ${cls.role === 'Class Teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                           {cls.role}
                         </span>
                      </div>
                   </div>
                   <div className="p-1.5 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                   </div>
                </div>

                <div className="mt-auto space-y-2">
                   <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{cls.subject}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{cls.room}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-slate-600">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span>{cls.totalStudents} Enrolled</span>
                   </div>
                </div>
             </button>
           ))}
        </div>
      ) : (
        /* Student List View */
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Roll</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Profile</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                   <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">
                         {student.rollNo.toString().padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">
                               {student.avatar}
                            </div>
                            <div>
                               <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-1">
                            <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-[100px]">
                               <div className={`h-1.5 rounded-full ${student.attendanceRate >= 90 ? 'bg-emerald-500' : student.attendanceRate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${student.attendanceRate}%` }}></div>
                            </div>
                            <span className="text-xs font-medium text-slate-500">{student.attendanceRate}% Present</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${getSubjectColorOpacity(selectedClass.role === 'Subject Teacher' ? student.subjectGrades[selectedClass.subject] : 100)}`}>
                            {selectedClass.role === 'Subject Teacher' 
                              ? `${student.subjectGrades[selectedClass.subject]}% (${selectedClass.subject})` 
                              : `Grade ${student.overallGrade} (Overall)`}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => setSelectedStudent(student)}
                           className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 py-1.5 px-3 rounded hover:bg-blue-100 transition-colors"
                         >
                            View Card
                         </button>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                        No students found matching your search.
                     </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && selectedClass && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/50">
               <h3 className="text-lg font-semibold text-slate-800">Student Report</h3>
               <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5"/>
               </button>
            </div>
            
            <div className="overflow-y-auto p-0 flex-1">
               {/* Profile Header */}
               <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 border-b border-slate-200">
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold border border-blue-200 shrink-0">
                     {selectedStudent.avatar}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                     <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                     <p className="text-sm text-slate-500 mt-1">Class {selectedClass.name} • Roll No. {selectedStudent.rollNo.toString().padStart(2, '0')}</p>
                     
                     <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                           <Phone className="w-3.5 h-3.5" /> Parent: {selectedStudent.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                           <Mail className="w-3.5 h-3.5" /> {selectedStudent.email}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 space-y-6">
                  {/* Privilege Warning if Subject Teacher */}
                  {selectedClass.role === 'Subject Teacher' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-700 flex items-center gap-2">
                       <AlertCircle className="w-4 h-4 shrink-0" />
                       As a Subject Teacher, you are viewing performance data restricted to <strong>{selectedClass.subject}</strong>.
                    </div>
                  )}

                  {/* Academic Performance */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-slate-500" /> Academic Performance
                    </h4>
                    
                    {selectedClass.role === 'Class Teacher' ? (
                      /* Full Report Card */
                      <div className="border border-slate-200 rounded-md overflow-hidden">
                         <table className="w-full text-sm text-left">
                           <thead className="bg-slate-50 border-b border-slate-200">
                             <tr>
                               <th className="px-4 py-2 font-semibold text-slate-600">Subject</th>
                               <th className="px-4 py-2 font-semibold text-slate-600 text-right">Score</th>
                               <th className="px-4 py-2 font-semibold text-slate-600 text-center">Status</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             {Object.entries(selectedStudent.subjectGrades).map(([sub, score]) => (
                               <tr key={sub}>
                                 <td className="px-4 py-2 text-slate-800 font-medium">{sub}</td>
                                 <td className="px-4 py-2 text-right font-bold text-slate-700">{score}%</td>
                                 <td className="px-4 py-2 text-center">
                                   <span className={`inline-block w-2 h-2 rounded-full ${score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                      </div>
                    ) : (
                      /* Subject Specific Info */
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
                            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">{selectedClass.subject} Score</p>
                            <p className={`text-2xl font-bold ${selectedStudent.subjectGrades[selectedClass.subject] >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {selectedStudent.subjectGrades[selectedClass.subject]}%
                            </p>
                         </div>
                         <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
                            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Class Rank</p>
                            <p className="text-2xl font-bold text-slate-700">#4</p>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Behavior & Notes */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" /> Behavioral Remarks
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                       <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                          {selectedStudent.behaviors.map((beh, idx) => (
                            <li key={idx}>{beh}</li>
                          ))}
                          {selectedClass.role === 'Subject Teacher' && selectedStudent.behaviors.length === 0 && (
                            <li className="text-slate-500 italic">No specific remarks for this subject.</li>
                          )}
                       </ul>
                    </div>
                  </div>

               </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
               <button 
                 onClick={() => setSelectedStudent(null)}
                 className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
               >
                  Close Profile
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
