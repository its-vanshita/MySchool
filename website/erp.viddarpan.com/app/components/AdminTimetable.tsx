"use client";

import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, Clock, BookOpen, User, Edit2, Trash2, X } from 'lucide-react';

export default function AdminTimetable() {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedTeacher, setSelectedTeacher] = useState('Dr. Rajesh Bhardwaj');

  // Modal and Interactive States
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editSlot, setEditSlot] = useState<any>(null);
  const [deleteSlot, setDeleteSlot] = useState<any>(null);
  const [customSlots, setCustomSlots] = useState<Record<string, {subject?: string, teacher?: string, assignedClass?: string, isDeleted?: boolean}>>({});

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-Sci', '11-Com', '12-Sci', '12-Com'];
  const teachers = ['Dr. Rajesh Bhardwaj', 'Mrs. Priya Sharma', 'Mr. Amit Khan', 'Miss Sunita V.', 'Mr. Vivek Singh'];

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

  // Dummy timetable data generator
  const getSubjectForPeriod = (dayIndex: number, periodIndex: number) => {
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Comp. Sci', 'P.E.'];
    return subjects[(dayIndex + periodIndex) % subjects.length];
  };

  const getTeacherForPeriod = (dayIndex: number, periodIndex: number) => {
    return teachers[(dayIndex + Math.floor(periodIndex / 2)) % teachers.length];
  };

  const getClassForTeacher = (dayIndex: number, periodIndex: number) => {
    return classes[(dayIndex + periodIndex) % classes.length];
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Manage Timetable</h2>
          <p className="text-[13px] text-slate-500">Configure and monitor academic schedules for classes and staff</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Advanced Filter
          </button>
          <button 
            onClick={() => setShowAddPeriod(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-[#111d33] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('student')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'student' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Class / Student Timetable
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'teacher' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Teacher / Staff Timetable
        </button>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 mb-6">
        {/* Selectors */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === 'student' ? (
              <>
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Select Class:</span>
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none min-w-[150px]"
                >
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </>
            ) : (
              <>
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Select Teacher:</span>
                <select 
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none min-w-[200px]"
                >
                  {teachers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Academic Year 2024-25</span>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
            <thead>
              <tr>
                <th className="p-4 border border-slate-200 bg-slate-50 font-bold text-slate-700 text-center w-[120px]">
                  Time \ Day
                </th>
                {days.map(day => (
                  <th key={day} className="p-4 border border-slate-200 bg-slate-50 font-bold text-slate-700 text-center w-[150px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, pIdx) => (
                <tr key={period.id}>
                  {period.name === 'Break' ? (
                    <>
                      <td className="p-3 border border-slate-200 bg-slate-50 text-center align-middle relative h-[60px]">
                        <div className="text-[12px] font-bold text-slate-800">{period.time}</div>
                      </td>
                      <td colSpan={6} className="p-3 border border-slate-200 bg-slate-100/50 text-center text-slate-500 font-bold tracking-[0.2em] uppercase text-sm">
                        Recess / Lunch Break
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 border border-slate-200 bg-slate-50 text-center align-middle h-[100px]">
                        <div className="text-[14px] font-bold text-slate-800 mb-1">Period {period.id}</div>
                        <div className="text-[11px] font-medium text-slate-500">{period.time}</div>
                      </td>
                      {days.map((day, dIdx) => {
                        const slotKey = `${activeTab}-${day}-${period.id}`;
                        const custom = customSlots[slotKey] || {};
                        
                        if (custom.isDeleted) {
                          return (
                            <td key={slotKey} className="p-3 border border-slate-200 hover:bg-slate-50 transition-colors group relative cursor-pointer h-[100px] align-top bg-slate-50/30">
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 p-1 rounded shadow-sm">
                                <button onClick={() => setEditSlot({ slotKey, day, period, subject: '', assignedTeacher: '', assignedClass: '' })} className="p-1 text-slate-400 hover:text-blue-600 rounded">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="flex flex-col h-full justify-center items-center text-slate-300 text-sm italic font-medium">
                                Empty Slot
                              </div>
                            </td>
                          );
                        }

                        const subject = custom.subject || getSubjectForPeriod(dIdx, pIdx);
                        const assignedTeacher = custom.teacher || getTeacherForPeriod(dIdx, pIdx);
                        const assignedClass = custom.assignedClass || getClassForTeacher(dIdx, pIdx);

                        return (
                          <td key={slotKey} className="p-3 border border-slate-200 hover:bg-blue-50/50 transition-colors group relative cursor-pointer h-[100px] align-top">
                            {/* Action Buttons (Hover) */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 p-1 rounded shadow-sm">
                              <button 
                                onClick={() => setEditSlot({ slotKey, day, period, subject, assignedTeacher, assignedClass })}
                                className="p-1 text-slate-400 hover:text-blue-600 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => setDeleteSlot({ slotKey, day, period })}
                                className="p-1 text-slate-400 hover:text-red-600 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex flex-col h-full justify-center">
                              <span className="text-[13px] font-bold text-slate-800 mb-1 block">
                                {activeTab === 'student' ? subject : assignedClass}
                              </span>
                              <div className="flex items-center gap-1.5 text-slate-500 mt-auto">
                                <BookOpen className="w-3 h-3" />
                                <span className="text-[11px] truncate" title={activeTab === 'student' ? assignedTeacher : subject}>
                                  {activeTab === 'student' ? assignedTeacher : subject}
                                </span>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Period Modal */}
      {showAddPeriod && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-md w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Add New Period</h3>
              <button onClick={() => setShowAddPeriod(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Period Name/Number</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Period 8" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowAddPeriod(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
              <button onClick={() => setShowAddPeriod(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Period</button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-md w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Advanced Filters</h3>
              <button onClick={() => setShowFilter(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Day</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none">
                  <option>All Days</option>
                  {days.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Contains</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none" placeholder="e.g. Mathematics" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="empty-slots" className="rounded border-slate-300 text-blue-600" />
                <label htmlFor="empty-slots" className="text-sm text-slate-600">Show only empty slots</label>
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowFilter(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Clear Filters</button>
              <button onClick={() => setShowFilter(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {editSlot && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-md w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800">Edit Slot</h3>
                <p className="text-xs text-slate-500">{editSlot.day} • Period {editSlot.period.id}</p>
              </div>
              <button onClick={() => setEditSlot(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setCustomSlots(prev => ({
                ...prev,
                [editSlot.slotKey]: {
                  subject: formData.get('subject') as string,
                  teacher: formData.get('teacher') as string,
                  assignedClass: formData.get('assignedClass') as string,
                  isDeleted: false
                }
              }));
              setEditSlot(null);
            }}>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input name="subject" defaultValue={editSlot.subject} required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none" />
                </div>
                {activeTab === 'student' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign Teacher</label>
                    <select name="teacher" defaultValue={editSlot.assignedTeacher} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none">
                      {teachers.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign Class</label>
                    <select name="assignedClass" defaultValue={editSlot.assignedClass} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 outline-none">
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
                <button type="button" onClick={() => setEditSlot(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Slot Modal */}
      {deleteSlot && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-md w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Clear Slot?</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to clear the schedule for <b>{deleteSlot.day}</b> (Period {deleteSlot.period.id})? This period will become empty.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteSlot(null)} className="flex-1 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
              <button 
                onClick={() => {
                  setCustomSlots(prev => ({
                    ...prev,
                    [deleteSlot.slotKey]: { isDeleted: true }
                  }));
                  setDeleteSlot(null);
                }} 
                className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Clear Slot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}