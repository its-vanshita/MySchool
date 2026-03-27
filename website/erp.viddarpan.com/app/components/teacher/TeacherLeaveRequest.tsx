"use client";

import React, { useState } from 'react';
import { 
  Send, 
  Calendar as CalendarIcon, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

export default function TeacherLeaveRequest() {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [pastRequests, setPastRequests] = useState<LeaveRequest[]>([
    { 
      id: '1', 
      type: 'Sick Leave', 
      startDate: '2026-03-10', 
      endDate: '2026-03-11', 
      days: 2, 
      reason: 'Suffering from viral fever. Doctor advised rest.', 
      status: 'Approved', 
      appliedOn: '2026-03-09' 
    },
    { 
      id: '2', 
      type: 'Casual Leave', 
      startDate: '2026-03-29', 
      endDate: '2026-03-29', 
      days: 1, 
      reason: 'Family event in hometown.', 
      status: 'Pending', 
      appliedOn: '2026-03-25' 
    }
  ]);

  const leaveBalances = [
    { type: 'Casual Leave', taken: 4, total: 12, color: 'blue' },
    { type: 'Sick Leave', taken: 2, total: 10, color: 'rose' },
    { type: 'Privilege Leave', taken: 0, total: 15, color: 'indigo' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: LeaveRequest = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: diffDays,
      reason: formData.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setPastRequests([newRequest, ...pastRequests]);
    setShowApplyForm(false);
    setFormData({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Leave Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">Apply for leaves and track your approval status</p>
        </div>
        <button 
          onClick={() => setShowApplyForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Request New Leave
        </button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaveBalances.map((item) => (
          <div key={item.type} className="bg-white p-5 rounded-md shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
               <span className="text-sm font-semibold text-slate-600">{item.type}</span>
               <span className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600`}>
                 {item.taken} used
               </span>
            </div>
            
            <div className="flex items-end gap-2 mb-3">
               <span className="text-3xl font-bold text-slate-900 leading-none">{item.total - item.taken}</span>
               <span className="text-sm font-medium text-slate-500 mb-0.5">days left</span>
            </div>
            
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-500 ${
                   item.color === 'blue' ? 'bg-blue-500' : item.color === 'rose' ? 'bg-rose-500' : 'bg-indigo-500'
                 }`}
                 style={{ width: `${(item.taken / item.total) * 100}%` }}
               ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Requests Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-800">Application History</h3>
             </div>
             
             {pastRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                   No leave requests found.
                </div>
             ) : (
                <div className="divide-y divide-slate-100">
                  {pastRequests.map((request) => (
                    <div key={request.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex gap-4 items-start">
                             <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-slate-700">{new Date(request.startDate).getDate()}</span>
                                <span className="text-[10px] font-semibold text-slate-500 uppercase">{new Date(request.startDate).toLocaleDateString('en-US', {month: 'short'})}</span>
                             </div>
                             
                             <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                   <h4 className="text-sm font-bold text-slate-900">{request.type}</h4>
                                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      request.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                                      request.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                                      'bg-amber-50 text-amber-700'
                                   }`}>
                                      {request.status}
                                   </span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-1 mb-2">{request.reason}</p>
                                
                                <div className="flex items-center gap-4">
                                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                      <CalendarIcon className="w-3.5 h-3.5" />
                                      {request.days} {request.days === 1 ? 'Day' : 'Days'}
                                   </div>
                                   <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                      <Clock className="w-3.5 h-3.5" />
                                      Applied on {new Date(request.appliedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                   </div>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-2 md:self-center self-end">
                             {request.status === 'Pending' && (
                               <button className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors" title="Withdraw Request">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                             )}
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {/* Guidelines Card */}
           <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                   <FileText className="w-4 h-4 text-blue-600" />
                   Leave Guidelines
                </h3>
              </div>
              <div className="p-5">
                 <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                       <p className="text-sm text-slate-600 leading-relaxed">Apply at least <span className="font-semibold text-slate-800">24 hours</span> in advance for casual leaves to allow for timetable adjustments.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                       <p className="text-sm text-slate-600 leading-relaxed">Attach a medical certificate for any sick leaves exceeding <span className="font-semibold text-slate-800">3 consecutive days</span>.</p>
                    </li>
                 </ul>
                 
                 <a href="#" className="mt-5 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    Read full policy handbook <ChevronRight className="w-4 h-4" />
                 </a>
              </div>
           </div>

           {/* Emergency Contact */}
           <div className="bg-slate-50 rounded-md p-5 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-amber-500" /> Need Urgent Leave?
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                 For emergencies, please directly contact the administrative office.
              </p>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                 <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?u=admin" alt="Admin" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-800">Mr. Harish Mehra</p>
                    <p className="text-xs text-slate-500">+91 98765-43210</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
               <div>
                 <h3 className="text-lg font-bold text-slate-800">Request Leave</h3>
                 <p className="text-sm text-slate-500">Fill out the details below to apply for leave.</p>
               </div>
               <button onClick={() => setShowApplyForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors">
                 <XCircle className="w-5 h-5"/>
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
               <div className="space-y-5">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Leave Category <span className="text-rose-500">*</span></label>
                     <select 
                       required
                       value={formData.type}
                       onChange={(e) => setFormData({...formData, type: e.target.value})}
                       className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
                     >
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Privilege Leave">Privilege Leave</option>
                     </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Start Date <span className="text-rose-500">*</span></label>
                        <input 
                          type="date" 
                          required
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" 
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">End Date <span className="text-rose-500">*</span></label>
                        <input 
                          type="date" 
                          required
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow" 
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Leave <span className="text-rose-500">*</span></label>
                     <textarea 
                       rows={4}
                       required
                       placeholder="Provide a brief explanation for your absence..."
                       value={formData.reason}
                       onChange={(e) => setFormData({...formData, reason: e.target.value})}
                       className="w-full p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow resize-none"
                     />
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 hidden sm:flex">
                     <Clock className="w-3.5 h-3.5" /> Approval takes up to 24 hours
                  </p>
                  <div className="flex gap-3 w-full sm:w-auto">
                     <button 
                       type="button" 
                       onClick={() => setShowApplyForm(false)}
                       className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex-1 sm:flex-none"
                     >
                        Cancel
                     </button>
                     <button 
                       type="submit"
                       className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-none"
                     >
                        Submit Request
                     </button>
                  </div>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
