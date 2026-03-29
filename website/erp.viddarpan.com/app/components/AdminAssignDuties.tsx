"use client";

import React, { useState } from 'react';
import { ClipboardList, Plus, Search, Calendar, Clock, MapPin, Trash2, Edit2, Users, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface Duty {
  id: string;
  type: string;
  teachers: string[];
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const mockTeachers = [
  'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'Robert Wilson', 'Aisha Patel', 'Vikram Malhotra', 'Sneha Gupta'
];

const mockDuties: Duty[] = [
  {
    id: 'D001',
    type: 'Assembly Duty',
    teachers: ['Emily Davis', 'Sneha Gupta'],
    date: '2023-10-25',
    startTime: '07:45 AM',
    endTime: '08:15 AM',
    location: 'Main Courtyard',
    notes: 'Morning assembly coordination and discipline',
    status: 'upcoming'
  },
  {
    id: 'D002',
    type: 'Bus Duty',
    teachers: ['Robert Wilson'],
    date: '2023-10-20',
    startTime: '02:30 PM',
    endTime: '03:15 PM',
    location: 'School Gate 1',
    notes: 'Ensure safe boarding for buses 1–5',
    status: 'completed'
  },
  {
    id: 'D003',
    type: 'Playground Supervision',
    teachers: ['Vikram Malhotra', 'Sneha Gupta'],
    date: '2023-10-24',
    startTime: '10:15 AM',
    endTime: '10:45 AM',
    location: 'Sports Ground',
    notes: 'Recess supervision — monitor class 6 to 10',
    status: 'upcoming'
  },
  {
    id: 'D004',
    type: 'Gate Duty',
    teachers: ['Aisha Patel'],
    date: '2023-10-22',
    startTime: '07:30 AM',
    endTime: '08:00 AM',
    location: 'Main Entrance Gate',
    notes: 'Student arrival monitoring & uniform check',
    status: 'completed'
  },
  {
    id: 'D005',
    type: 'Library Duty',
    teachers: ['Sarah Johnson'],
    date: '2023-10-26',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    location: 'School Library',
    notes: 'Supervise free reading period',
    status: 'upcoming'
  },
  {
    id: 'D006',
    type: 'Cafeteria Monitor',
    teachers: ['Michael Chen'],
    date: '2023-10-27',
    startTime: '12:30 PM',
    endTime: '01:15 PM',
    location: 'School Cafeteria',
    notes: 'Lunch break discipline and hygiene supervision',
    status: 'upcoming'
  },
];

export default function AdminAssignDuties() {
  const [duties, setDuties] = useState<Duty[]>(mockDuties);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [dutyType, setDutyType] = useState('Assembly Duty');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const toggleTeacher = (teacher: string) => {
    if (selectedTeachers.includes(teacher)) {
      setSelectedTeachers(selectedTeachers.filter(t => t !== teacher));
    } else {
      setSelectedTeachers([...selectedTeachers, teacher]);
    }
  };

  const handleCreateDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeachers.length === 0) return; // Basic validation

    const newDuty: Duty = {
      id: `D00${duties.length + 1}`,
      type: dutyType,
      teachers: selectedTeachers,
      date,
      startTime,
      endTime,
      location,
      notes,
      status: 'upcoming'
    };

    setDuties([newDuty, ...duties]);
    
    // Reset and close
    setDutyType('Assembly Duty');
    setSelectedTeachers([]);
    setDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setNotes('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDuties(duties.filter(d => d.id !== id));
  };

  const filteredDuties = duties.filter(d => 
    d.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.teachers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Assign Duties
          </h2>
          <p className="text-sm text-slate-500 mt-1">Assign and manage daily, weekly, and special school duties for teaching staff</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Duty
        </button>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by duty type, teacher, or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDuties.map(duty => (
              <div key={duty.id} className="bg-white border border-slate-200 rounded-md p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(duty.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4 pr-12">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  duty.type === 'Assembly Duty'    ? 'bg-amber-100 text-amber-600' :
                    duty.type === 'Bus Duty'          ? 'bg-emerald-100 text-emerald-600' :
                    duty.type === 'Playground Supervision' ? 'bg-blue-100 text-blue-600' :
                    duty.type === 'Gate Duty'         ? 'bg-rose-100 text-rose-600' :
                    duty.type === 'Library Duty'      ? 'bg-violet-100 text-violet-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{duty.type}</h3>
                    <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      duty.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {duty.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {duty.teachers.map((t, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium border border-blue-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{duty.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{duty.startTime} - {duty.endTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{duty.location}</span>
                  </div>
                  
                  {duty.notes && (
                    <div className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                      <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs italic leading-relaxed">{duty.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredDuties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <ClipboardList className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-700">No duties found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Create New Duty Assignment</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
            
            <form onSubmit={handleCreateDuty} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Duty Type <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={dutyType}
                    onChange={(e) => setDutyType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Assembly Duty">Assembly Duty</option>
                    <option value="Bus Duty">Bus Duty</option>
                    <option value="Gate Duty">Gate Duty</option>
                    <option value="Playground Supervision">Playground Supervision</option>
                    <option value="Library Duty">Library Duty</option>
                    <option value="Lab Supervision">Lab Supervision</option>
                    <option value="Cafeteria Monitor">Cafeteria Monitor</option>
                    <option value="Event Coordination">Event Coordination</option>
                    <option value="Sports Meet Duty">Sports Meet Duty</option>
                    <option value="Parent-Teacher Meeting">Parent-Teacher Meeting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Assign Teachers ({selectedTeachers.length}) <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2 p-3 border border-slate-300 rounded-lg max-h-40 overflow-y-auto bg-slate-50">
                    {mockTeachers.map(teacher => (
                      <button
                        type="button"
                        key={teacher}
                        onClick={() => toggleTeacher(teacher)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-1.5 transition-all
                          ${selectedTeachers.includes(teacher) 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                      >
                        {selectedTeachers.includes(teacher) && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {teacher}
                      </button>
                    ))}
                  </div>
                  {selectedTeachers.length === 0 && <p className="text-xs text-amber-600">Please select at least one teacher.</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Location / Room <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Exam Hall B, Main Gate"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Start Time <span className="text-red-500">*</span></label>
                  <input 
                    type="time" 
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">End Time <span className="text-red-500">*</span></label>
                  <input 
                    type="time" 
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Additional Notes</label>
                  <textarea 
                    rows={2}
                    placeholder="Provide any specific instructions or requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={selectedTeachers.length === 0}
                  className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}