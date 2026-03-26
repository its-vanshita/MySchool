import React from 'react';
import { AlertTriangle, Banknote } from 'lucide-react'; // Need to check if Banknotes exists, let's use Wallet or Coins or Banknote

export default function AdminAlerts() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Security Alert */}
      <div className="bg-[#fdf2f2] rounded-xl p-6 border-l-4 border-l-red-600 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Security Alert
          </h3>
          <p className="text-[14px] text-slate-700 leading-relaxed mb-6">
            Unidentified vehicle observed at Gate 4 for over 20 minutes. Campus security notified.
          </p>
        </div>
        <button className="w-full py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg text-[13px] font-semibold transition-colors">
          Dispatch Security Check
        </button>
      </div>

      {/* Financial Alert */}
      <div className="bg-[#fff7ed] rounded-xl p-6 border-l-4 border-l-orange-500 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
            Financial Alert
          </h3>
          <p className="text-[14px] text-slate-700 leading-relaxed mb-6">
            24 students have reached high-priority fee arrears status ({'>'}60 days). Notification pending.
          </p>
        </div>
        <button className="w-full py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-[13px] font-semibold transition-colors">
          Send Reminder SMS
        </button>
      </div>
    </div>
  );
}
