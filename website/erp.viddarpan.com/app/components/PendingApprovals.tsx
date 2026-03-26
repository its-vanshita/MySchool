import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PendingApprovals() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-slate-600" />
          Pending Approvals
        </h3>
        <button className="text-[13px] font-semibold text-slate-600 hover:text-slate-900">
          View All Queue
        </button>
      </div>

      <div className="space-y-4">
        {/* Approval 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-600 shrink-0">
              SM
            </div>
            <div>
              <p className="text-[14px] text-slate-800">
                <span className="font-bold">Saritha Madhavan</span> <span className="text-slate-500">Requested Medical Leave</span>
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Primary Teacher • 3 Days (Oct 24 - Oct 26)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
              Decline
            </button>
            <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors">
              Approve
            </button>
          </div>
        </div>

        {/* Approval 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-600 shrink-0">
              AK
            </div>
            <div>
              <p className="text-[14px] text-slate-800">
                <span className="font-bold">Anil Kapoor</span> <span className="text-slate-500">Supply Request: Chemistry Lab</span>
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Lab In-charge • Ref: REQ-9902 • ₹12,400
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
              Decline
            </button>
            <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
