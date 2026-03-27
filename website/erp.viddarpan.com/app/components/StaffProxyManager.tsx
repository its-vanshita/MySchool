"use client";

import React, { useState } from 'react';
import { Users, UserMinus, UserCheck, Calendar, Clock, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

const ABSENT_STAFF = [
  { id: 1, name: "Mrs. Anjali Sharma", subject: "Mathematics", grade: "10th B", period: "1st Period", reason: "Medical Leave" },
  { id: 2, name: "Mr. David Miller", subject: "English", grade: "8th C", period: "2nd Period", reason: "Family Emergency" },
  { id: 3, name: "Ms. Priyanka Chopra", subject: "Chemistry", grade: "12th A", period: "3rd Period", reason: "Official Duty" },
];

const AVAILABLE_PROXIES = [
  { id: 101, name: "Mr. Suresh Raina", freePeriods: ["1st", "4th", "6th"], specialized: "Mathematics" },
  { id: 102, name: "Ms. Neha Kakkar", freePeriods: ["2nd", "3rd", "5th"], specialized: "Music/Arts" },
  { id: 103, name: "Mr. Rohit Sharma", freePeriods: ["1st", "2nd", "3rd"], specialized: "Physical Education" },
];

export default function StaffProxyManager() {
  const [selectedAbsent, setSelectedAbsent] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<number, number>>({});

  const handleAssign = (absentId: number, proxyId: number) => {
    setAssignments({ ...assignments, [absentId]: proxyId });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Staff Proxy Management</h2>
            <p className="text-[13px] text-slate-500 font-medium mt-1">Efficiently manage substitution for absent staff members</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-[13px] font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Absent Staff List */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2 mb-2">
              <UserMinus className="w-4 h-4 text-red-500" />
              Absent Staff List Today
            </h3>
            <div className="space-y-3">
              {ABSENT_STAFF.map(staff => (
                <div 
                  key={staff.id}
                  onClick={() => setSelectedAbsent(staff.id)}
                  className={`p-4 border rounded-xl transition-all cursor-pointer relative group ${selectedAbsent === staff.id ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-800">{staff.name}</p>
                        <p className="text-[12px] text-slate-500 font-medium">{staff.subject} • {staff.grade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">{staff.period}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{staff.reason}</p>
                    </div>
                  </div>
                  
                  {assignments[staff.id] ? (
                    <div className="mt-3 flex items-center gap-2 py-1.5 px-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-emerald-700">
                        Proxy: {AVAILABLE_PROXIES.find(p => p.id === assignments[staff.id])?.name}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 py-1.5 px-3 bg-red-50 rounded-lg border border-red-100">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-[11px] font-bold text-red-700">Needs Proxy Assignment</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Proxy Assignment Panel */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Available Substitute Staff
            </h3>
            
            {!selectedAbsent ? (
              <div className="h-[300px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Users className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Select an absent staff member from the left to assign a proxy teacher</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-bold text-slate-500 uppercase">Proposals for {ABSENT_STAFF.find(a => a.id === selectedAbsent)?.name}</p>
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
                
                <div className="space-y-3">
                  {AVAILABLE_PROXIES.map(proxy => (
                    <div key={proxy.id} className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex justify-between items-center group">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                          {proxy.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-800">{proxy.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                              <Clock className="w-3 h-3" />
                              Free: {proxy.freePeriods.join(', ')}
                            </span>
                          </div>
                          {proxy.specialized === ABSENT_STAFF.find(a => a.id === selectedAbsent)?.subject && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded uppercase">Subject Specialist Match</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAssign(selectedAbsent, proxy.id)}
                        className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all shadow-sm ${assignments[selectedAbsent] === proxy.id ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
                      >
                        {assignments[selectedAbsent] === proxy.id ? 'Assigned' : 'Assign Proxy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
