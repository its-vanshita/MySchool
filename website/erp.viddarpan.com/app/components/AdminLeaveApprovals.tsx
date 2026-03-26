"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, CalendarDays, CheckCircle2, ChevronDown, Check, X } from 'lucide-react';

export default function AdminLeaveApprovals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('All');
  const [showLeaveTypeDropdown, setShowLeaveTypeDropdown] = useState(false);
  const [systemLogs, setSystemLogs] = useState([
    {
      id: 1,
      type: 'approved',
      title: 'Leave Approved',
      desc: "Principal approved Sunita V.'s request for Oct 10th.",
      time: '10 minutes ago'
    },
    {
      id: 2,
      type: 'new',
      title: 'New Request',
      desc: 'Dr. Rajesh Bhardwaj submitted a casual leave request.',
      time: '2 hours ago'
    }
  ]);

  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: 'Dr. Rajesh Bhardwaj',
      initials: 'RB',
      designation: 'Senior Lecturer',
      leaveType: 'Casual Leave',
      dateRange: 'Oct 12 - Oct 14',
      days: '3 Days',
      reason: 'Attending family wedding in hometown',
      status: 'Pending',
    },
    {
      id: 2,
      name: 'Mrs. Priya Sharma',
      initials: 'PS',
      designation: 'HOD Physics',
      leaveType: 'Sick Leave',
      dateRange: 'Oct 10 - Oct 11',
      days: '2 Days',
      reason: 'Severe viral fever and exhaustion',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'Mr. Amit Khan',
      initials: 'AK',
      designation: 'History Teacher',
      leaveType: 'Privilege Leave',
      dateRange: 'Oct 15 - Oct 20',
      days: '6 Days',
      reason: 'Annual personal religious pilgrimage',
      status: 'Pending',
    },
    {
      id: 4,
      name: 'Miss Sunita V.',
      initials: 'SV',
      designation: 'English Teacher',
      leaveType: 'Casual Leave',
      dateRange: 'Oct 05 - Oct 05',
      days: '1 Day',
      reason: 'Personal errands',
      status: 'Approved',
    },
    {
      id: 5,
      name: 'Mr. Vivek Singh',
      initials: 'VS',
      designation: 'Sports Coach',
      leaveType: 'Casual Leave',
      dateRange: 'Oct 18 - Oct 18',
      days: '1 Day',
      reason: 'Local tournament officiating',
      status: 'Rejected',
    }
  ]);

  const handleAction = (id: number, newStatus: 'Approved' | 'Rejected', name: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: newStatus } : l));
    
    // Add to system log
    const newLog = {
      id: Date.now(),
      type: newStatus.toLowerCase(),
      title: `Leave ${newStatus}`,
      desc: `You ${newStatus.toLowerCase()} ${name}'s leave request.`,
      time: 'Just now'
    };
    setSystemLogs([newLog, ...systemLogs].slice(0, 5)); // keep last 5
  };

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  const filteredLeaves = useMemo(() => {
    return leaves.filter(leave => {
      // 1. Filter by tab
      if (leave.status.toLowerCase() !== activeTab) return false;
      // 2. Filter by search query
      if (searchQuery && !leave.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // 3. Filter by leave type
      if (leaveTypeFilter !== 'All' && leave.leaveType !== leaveTypeFilter) return false;
      
      return true;
    });
  }, [leaves, activeTab, searchQuery, leaveTypeFilter]);

  const leaveTypes = ['All', 'Casual Leave', 'Sick Leave', 'Privilege Leave'];

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Leave Management</h2>
          <p className="text-[13px] text-slate-500">Monitoring academic staffing for <span className="font-semibold text-slate-700">2024-25 Session</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Cards / Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div 
          onClick={() => setActiveTab('pending')}
          className={`bg-white rounded-xl p-5 shadow-sm border-l-[4px] border-orange-500 flex justify-between items-center relative overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors ${activeTab === 'pending' ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}
        >
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pending</p>
            <div className="text-3xl font-bold text-slate-800 mb-1">{pendingCount < 10 ? `0${pendingCount}` : pendingCount}</div>
            <p className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Awaiting review
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('approved')}
          className={`bg-white rounded-xl p-5 shadow-sm border-l-[4px] border-emerald-500 flex justify-between items-center relative overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors ${activeTab === 'approved' ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
        >
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Approved</p>
            <div className="text-3xl font-bold text-slate-800 mb-1">{approvedCount < 10 ? `0${approvedCount}` : approvedCount}</div>
            <p className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> All clear
            </p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('rejected')}
          className={`bg-white rounded-xl p-5 shadow-sm border-l-[4px] border-red-500 flex justify-between items-center relative overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors ${activeTab === 'rejected' ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
        >
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rejected</p>
            <div className="text-3xl font-bold text-slate-800 mb-1">{rejectedCount < 10 ? `0${rejectedCount}` : rejectedCount}</div>
            <p className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
              <X className="w-3.5 h-3.5 text-red-500" /> Declined requests
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-xl text-red-600">
            <X className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by teacher name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative">
            <div 
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium flex items-center gap-2 cursor-pointer hover:bg-slate-50"
              onClick={() => setShowLeaveTypeDropdown(!showLeaveTypeDropdown)}
            >
              {leaveTypeFilter === 'All' ? 'Leave Type' : leaveTypeFilter} <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            
            {showLeaveTypeDropdown && (
              <div className="absolute top-12 left-0 w-48 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {leaveTypes.map(type => (
                  <div 
                    key={type} 
                    className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-slate-50 last:border-0 font-medium"
                    onClick={() => {
                      setLeaveTypeFilter(type);
                      setShowLeaveTypeDropdown(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
            
            <span className="text-[13px] text-slate-500 font-medium ml-2">Showing {filteredLeaves.length} {activeTab} requests</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-h-[150px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Teacher Name</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                {activeTab === 'pending' && <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">
                    No {activeTab} leaves found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave, idx) => (
                  <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                          idx % 3 === 0 ? 'bg-blue-100 text-blue-700' :
                          idx % 3 === 1 ? 'bg-purple-100 text-purple-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {leave.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{leave.name}</p>
                          <p className="text-[12px] text-slate-500">{leave.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="text-[13px] font-bold text-slate-800">{leave.dateRange}</p>
                      <p className="text-[12px] text-slate-500 font-medium">{leave.days}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="text-[13px] text-slate-600 max-w-[200px] truncate" title={leave.reason}>{leave.reason}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                        leave.status === 'Pending' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                        leave.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        'bg-red-50 border-red-100 text-red-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          leave.status === 'Pending' ? 'bg-orange-500' :
                          leave.status === 'Approved' ? 'bg-emerald-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-[12px] font-bold">{leave.status}</span>
                      </div>
                    </td>
                    {activeTab === 'pending' && (
                      <td className="px-5 py-4 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAction(leave.id, 'Approved', leave.name)}
                            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                            title="Approve Leave"
                          >
                            <Check className="w-4 h-4" strokeWidth={3} />
                          </button>
                          <button 
                            onClick={() => handleAction(leave.id, 'Rejected', leave.name)}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                            title="Reject Leave"
                          >
                            <X className="w-4 h-4" strokeWidth={3} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[13px] text-slate-500 font-medium">Showing {filteredLeaves.length > 0 ? 1 : 0} to {filteredLeaves.length} of {filteredLeaves.length} results</p>
          <div className="flex items-center gap-1">
            <button className="p-1 px-2 border border-slate-200 rounded text-slate-400 hover:bg-slate-50 transition-colors">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1a2b4c] text-white text-[13px] font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50 text-slate-600 text-[13px] font-medium transition-colors">2</button>
            <button className="p-1 px-2 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors">&gt;</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Log */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" /> System Log
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {systemLogs.map((log) => (
              <div key={log.id} className="relative flex items-start gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 outline outline-4 outline-white ${
                  log.type === 'approved' ? 'bg-emerald-500' :
                  log.type === 'rejected' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'approved' ? 'bg-emerald-100' :
                    log.type === 'rejected' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}></div>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-900 mb-0.5">{log.title}</p>
                  <p className="text-[13px] text-slate-500">{log.desc}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Reminder */}
        <div className="bg-[#0f172a] rounded-xl p-6 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              Policy Reminder
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Ensure all long-term privilege leaves (over 5 days) have a substitute teacher assigned before final approval.
            </p>
          </div>
          <button className="w-full lg:w-max px-5 py-2.5 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors z-10 text-center">
            Review Policy Handbook
          </button>
        </div>
      </div>
    </div>
  );
}