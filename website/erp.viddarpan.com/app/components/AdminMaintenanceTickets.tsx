"use client";

import React, { useState } from 'react';
import { PenTool, AlertCircle, CheckCircle2, Clock, Plus, Filter, Search, MessageSquare, User, MoreVertical } from 'lucide-react';

const TICKETS = [
  { id: "TKT-1021", title: "Projector Failure in Class 10th B", priority: "High", status: "Pending", department: "IT Support", requester: "Mr. Ramesh Kumar", date: "2026-03-27 10:15 AM", avatar: "RK" },
  { id: "TKT-1022", title: "Leakage in Senior Boys Washroom", priority: "Critical", status: "In Progress", department: "Estate Management", requester: "Mrs. Meena Shah", date: "2026-03-27 11:30 AM", avatar: "MS" },
  { id: "TKT-1023", title: "AC Maintenance - Library Room 1", priority: "Medium", status: "Resolved", department: "Maintenance", requester: "Dr. Ankit Gupta", date: "2026-03-26 09:00 AM", avatar: "AG" },
  { id: "TKT-1024", title: "Missing Desk in 8th Grade Section C", priority: "Low", status: "Pending", department: "Housekeeping", requester: "Ms. Sunita Rao", date: "2026-03-25 04:30 PM", avatar: "SR" },
];

export default function AdminMaintenanceTickets() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-50/50 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
              <PenTool className="w-5 h-5 text-blue-600" />
              Maintenance & IT Tickets
            </h2>
            <p className="text-[13px] text-slate-500 font-medium mt-1">Operational governance of school infrastructure and utility support</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input 
                type="text" 
                placeholder="Search ticket ID or requester..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none w-full lg:w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-[13px] hover:bg-emerald-800 transition-all shadow-md shadow-emerald-100 uppercase tracking-widest leading-none">
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-8 border-b border-slate-100 mb-6">
            <Tab label="All Tickets" active={activeTab === 'all'} onClick={() => setActiveTab('all')} count={45} />
            <Tab label="Critical Priority" active={activeTab === 'critical'} onClick={() => setActiveTab('critical')} count={3} />
            <Tab label="In Progress" active={activeTab === 'active'} onClick={() => setActiveTab('active')} count={12} />
            <Tab label="Resolved" active={activeTab === 'resolved'} onClick={() => setActiveTab('resolved')} count={30} />
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Ticket ID</th>
                  <th className="py-4 px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">Issue Description</th>
                  <th className="py-4 px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[140px]">Priority</th>
                  <th className="py-4 px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Status</th>
                  <th className="py-4 px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[180px]">Requester</th>
                  <th className="py-4 px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[50px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {TICKETS.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                    <td className="py-4 px-2">
                      <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm border border-blue-100">{ticket.id}</span>
                    </td>
                    <td className="py-4 px-2">
                    <div className="space-y-1">
                      <p className="text-[14px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">{ticket.title}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{ticket.department}</p>
                    </div>
                    </td>
                    <td className="py-4 px-2">
                    <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="py-4 px-2">
                    <StatusBadge status={ticket.status} />
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 border border-slate-200 shadow-sm">
                          {ticket.avatar}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[13px] font-bold text-slate-700 leading-none">{ticket.requester}</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight">{ticket.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick, count }: { label: string, active: boolean, onClick: () => void, count: number }) {
  return (
    <button onClick={onClick} className={`relative py-4 text-[13px] font-bold uppercase tracking-wide transition-all px-2 ${active ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700 hover:translate-y-[-1px]'}`}>
      {label}
      <span className="ml-2 text-[11px] font-black text-slate-400">{count}</span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full animate-in slide-in-from-left-4 duration-500" />}
    </button>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    'Critical': 'bg-red-100 text-red-700 border-red-200',
    'High': 'bg-orange-100 text-orange-700 border-orange-200',
    'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
    'Low': 'bg-slate-100 text-slate-700 border-slate-200'
  };
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${styles[priority]}`}>
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Pending': 'text-red-600',
    'In Progress': 'text-orange-600',
    'Resolved': 'text-emerald-700'
  };
  const Icons: Record<string, any> = {
    'Pending': AlertCircle,
    'In Progress': Clock,
    'Resolved': CheckCircle2
  };
  const Icon = Icons[status];
  return (
    <div className={`flex items-center gap-1.5 text-[12px] font-black uppercase tracking-tighter ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </div>
  );
}
