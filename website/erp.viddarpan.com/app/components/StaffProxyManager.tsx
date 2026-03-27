import React, { useState } from 'react';
import { Users, ChevronDown, Check } from 'lucide-react';

export default function StaffProxyManager() {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const absentStaff = [
    { id: '1', name: 'Saritha Madhavan', role: 'Primary Teacher', classes: '3 Classes today' },
    { id: '2', name: 'Rahul Verma', role: 'Mathematics PGT', classes: '4 Classes today' },
  ];

  const availableProxies = ['Priya Sharma', 'Amit Kumar', 'Neha Gupta', 'Vikram Singh'];

  const handleAssign = (staffId: string, proxy: string) => {
    setAssignments(prev => {
      const newAssignments = { ...prev };
      if (!proxy) {
        delete newAssignments[staffId];
      } else {
        newAssignments[staffId] = proxy;
      }
      return newAssignments;
    });
  };

  const unassignedCount = absentStaff.filter(s => !assignments[s.id]).length;

  return (
    <div className="bg-white rounded-md p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Staff Proxy Management
          </h3>
          <p className="text-[13px] text-slate-500 mt-1">Assign substitutes for staff on leave today.</p>
        </div>
        
        {unassignedCount > 0 ? (
          <div className="bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-md text-[12px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {unassignedCount} Unassigned
          </div>
        ) : (
          <div className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-md text-[12px] flex items-center gap-2">
            <Check className="w-4 h-4" />
            All Covered
          </div>
        )}
      </div>

      <div className="space-y-4">
        {absentStaff.map(staff => (
          <div key={staff.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[13px] font-bold text-red-600 shrink-0 border border-red-100">
                {staff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-[14px] text-slate-800">
                  <span className="font-bold">{staff.name}</span> <span className="text-slate-400 font-medium">(Absent)</span>
                </p>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  {staff.role} • <span className="text-slate-700 font-semibold">{staff.classes}</span>
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {assignments[staff.id] ? (
                <div className="flex items-center justify-between min-w-[200px] px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-md">
                  <span className="text-[13px] font-semibold text-emerald-700">Covered by {assignments[staff.id]}</span>
                  <button 
                    onClick={() => handleAssign(staff.id, '')}
                    className="text-emerald-600 hover:text-emerald-800 focus:outline-none ml-3"
                    title="Remove assignment"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative group/dropdown">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-[13px] font-semibold text-slate-700 focus:ring-2 focus:ring-blue-200 outline-none w-full sm:w-[200px] justify-between z-0">
                    Assign Proxy <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {/* Dropdown Menu (hover based for simplicity in widget) */}
                  <div className="absolute right-0 top-full mt-1 w-full sm:w-48 bg-white border border-slate-200 shadow-xl rounded-md opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 py-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Available Staff
                    </div>
                    {availableProxies.map(proxy => (
                      <button 
                        key={proxy}
                        onClick={() => handleAssign(staff.id, proxy)}
                        className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {proxy}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
