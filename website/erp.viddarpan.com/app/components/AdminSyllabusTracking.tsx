"use client";

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, CheckCircle2, Circle, AlertCircle, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';

interface Topic {
  title: string;
  completed: boolean;
  dateCompleted?: string;
}

interface Chapter {
  title: string;
  expectedDate: string;
  completed: boolean;
  topics: Topic[];
}

interface TeacherSyllabus {
  id: string;
  name: string;
  subject: string;
  class: string;
  totalChapters: number;
  completedChapters: number;
  progress: number;
  status: 'on-track' | 'behind' | 'ahead';
  lastUpdated: string;
  chapters: Chapter[];
}

const mockData: TeacherSyllabus[] = [
  {
    id: 'T001',
    name: 'Sarah Johnson',
    subject: 'Mathematics',
    class: '10-A',
    totalChapters: 15,
    completedChapters: 8,
    progress: 53,
    status: 'on-track',
    lastUpdated: '2 days ago',
    chapters: [
      {
        title: "Real Numbers", expectedDate: "April 15", completed: true,
        topics: [
          { title: "Euclid's Division Lemma", completed: true, dateCompleted: "April 5" },
          { title: "The Fundamental Theorem of Arithmetic", completed: true, dateCompleted: "April 10" },
          { title: "Irrational Numbers", completed: true, dateCompleted: "April 14" }
        ]
      },
      {
        title: "Polynomials", expectedDate: "May 10", completed: true,
        topics: [
          { title: "Geometrical Meaning of Zeros", completed: true, dateCompleted: "April 25" },
          { title: "Relationship between Zeros and Coefficients", completed: true, dateCompleted: "May 2" }
        ]
      },
      {
        title: "Quadratic Equations", expectedDate: "August 20", completed: false,
        topics: [
          { title: "Introduction to Quadratic Equations", completed: true, dateCompleted: "August 5" },
          { title: "Solution by Factorisation", completed: false },
          { title: "Nature of Roots", completed: false }
        ]
      }
    ]
  },
  {
    id: 'T002',
    name: 'Michael Chen',
    subject: 'Physics',
    class: '10-A',
    totalChapters: 12,
    completedChapters: 5,
    progress: 41,
    status: 'behind',
    lastUpdated: '5 days ago',
    chapters: [
      {
        title: "Light - Reflection and Refraction", expectedDate: "May 15", completed: true,
        topics: [
          { title: "Spherical Mirrors", completed: true, dateCompleted: "April 20" },
          { title: "Refraction of Light", completed: true, dateCompleted: "May 10" }
        ]
      },
      {
        title: "Human Eye and Colourful World", expectedDate: "July 20", completed: false,
        topics: [
          { title: "Human Eye Structure", completed: true, dateCompleted: "July 10" },
          { title: "Defects of Vision", completed: false },
          { title: "Dispersion of White Light", completed: false }
        ]
      }
    ]
  },
  {
    id: 'T003',
    name: 'Emily Davis',
    subject: 'English',
    class: '9-B',
    totalChapters: 20,
    completedChapters: 12,
    progress: 60,
    status: 'ahead',
    lastUpdated: '1 day ago',
    chapters: [
      {
        title: "The Fun They Had", expectedDate: "April 20", completed: true,
        topics: [
          { title: "Reading and Comprehension", completed: true, dateCompleted: "April 10" },
          { title: "Vocabulary Building", completed: true, dateCompleted: "April 15" }
        ]
      },
      {
        title: "The Sound of Music", expectedDate: "May 25", completed: true,
        topics: [
          { title: "Part I - Evelyn Glennie", completed: true, dateCompleted: "May 10" },
          { title: "Part II - Bismillah Khan", completed: true, dateCompleted: "May 20" }
        ]
      }
    ]
  },
  {
    id: 'T004',
    name: 'Robert Wilson',
    subject: 'Chemistry',
    class: '11-Sci',
    totalChapters: 14,
    completedChapters: 7,
    progress: 50,
    status: 'on-track',
    lastUpdated: '3 days ago',
    chapters: [
      {
        title: "Some Basic Concepts of Chemistry", expectedDate: "June 10", completed: true,
        topics: [
          { title: "Matter and its nature", completed: true, dateCompleted: "May 15" },
          { title: "Atomic and molecular masses", completed: true, dateCompleted: "May 28" }
        ]
      },
      {
        title: "Structure of Atom", expectedDate: "July 30", completed: false,
        topics: [
          { title: "Discovery of Electron, Proton", completed: true, dateCompleted: "July 5" },
          { title: "Bohr's model", completed: true, dateCompleted: "July 18" },
          { title: "Quantum mechanical model", completed: false }
        ]
      }
    ]
  }
];

export default function AdminSyllabusTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All Classes');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherSyllabus | null>(null);

  const filteredTeachers = mockData.filter(t => 
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterClass === 'All Classes' || t.class === filterClass)
  );

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'on-track': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'behind': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'ahead': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default: return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'on-track': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><StatusIcon status={status} /> On Track</span>;
      case 'behind': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"><StatusIcon status={status} /> Behind</span>;
      case 'ahead': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"><StatusIcon status={status} /> Ahead</span>;
      default: 
        return null;
    }
  };

  if (selectedTeacher) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedTeacher(null)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                {selectedTeacher.name}'s Syllabus Plan
                <StatusBadge status={selectedTeacher.status} />
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {selectedTeacher.subject} • Class {selectedTeacher.class} • {selectedTeacher.completedChapters} of {selectedTeacher.totalChapters} Chapters Completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6">
            <div className="space-y-6">
              {selectedTeacher.chapters.map((chapter, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className={`p-4 flex items-center justify-between ${chapter.completed ? 'bg-slate-50' : 'bg-white'}`}>
                    <div className="flex items-center gap-3">
                      {chapter.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                      <div>
                        <h4 className="font-semibold text-slate-900">Chapter {idx + 1}: {chapter.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Expected: {chapter.expectedDate}</p>
                      </div>
                    </div>
                    {chapter.completed ? (
                      <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Completed</span>
                    ) : (
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">In Progress</span>
                    )}
                  </div>
                  <div className="border-t border-slate-100 p-4 bg-white">
                    <ul className="space-y-3">
                      {chapter.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3 pl-8">
                            {topic.completed ? (
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            )}
                            <span className={topic.completed ? "text-slate-800" : "text-slate-500"}>{topic.title}</span>
                          </div>
                          {topic.completed && topic.dateCompleted && (
                            <span className="text-xs text-slate-400">Completed on {topic.dateCompleted}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Syllabus Tracking
          </h2>
          <p className="text-sm text-slate-500 mt-1">Monitor syllabus completion progress across all teachers and classes</p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search teacher or subject..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <select 
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[140px] cursor-pointer"
              >
                <option value="All Classes">All Classes</option>
                <option value="9-A">9-A</option>
                <option value="9-B">9-B</option>
                <option value="10-A">10-A</option>
                <option value="11-Sci">11-Sci</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Class & Subject</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((teacher) => (
                <tr 
                  key={`${teacher.id}-${teacher.class}`} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{teacher.name}</div>
                        <div className="text-xs text-slate-500">ID: {teacher.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{teacher.subject}</div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      Class {teacher.class}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-700">{teacher.progress}%</span>
                        <span className="text-slate-500">{teacher.completedChapters} of {teacher.totalChapters} Ch.</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${teacher.status === 'behind' ? 'bg-red-500' : teacher.status === 'ahead' ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${teacher.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={teacher.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center justify-between">
                      {teacher.lastUpdated}
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="text-sm font-medium text-slate-600">No teachers found matching your criteria</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setFilterClass('All Classes'); }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}