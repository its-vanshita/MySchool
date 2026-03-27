import React from 'react';
import { Plus, Megaphone, Building2, Calendar, FileText, Wallet, AlertCircle, Clock } from 'lucide-react';

const categoryConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  academic: { label: 'Academic', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
  event: { label: 'Event', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  holiday: { label: 'Holiday', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  fee: { label: 'Fee', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
  alert: { label: 'Alert', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function AdminNoticesList({ notices = [], onCreateNew }: { notices?: any[], onCreateNew: () => void }) {
  return (
    <div className="h-full relative flex-1 flex flex-col pt-2 md:pt-4 max-w-[1000px]">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Notices</h2>
          <p className="text-[14px] text-slate-500 font-medium">View and manage all institutional notices</p>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-white/50 border-2 border-slate-200 border-dashed rounded-lg min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-[16px] font-bold text-slate-700 mb-1">No notices found</h3>
            <p className="text-[13px] text-slate-500 max-w-[250px] mx-auto mb-6">You haven't posted any notices yet. Click the plus button to create your first notice.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-24 space-y-4">
          {notices.map((notice, index) => {
            const conf = categoryConfig[notice.category] || categoryConfig.academic;
            const Icon = conf.icon;
            
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${conf.bg}`}>
                  <Icon className={`w-6 h-6 ${conf.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <h3 className="text-[16px] font-bold text-slate-900 truncate">{notice.title}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(notice.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  
                  <p className="text-[14px] text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {notice.description}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${conf.bg} ${conf.color}`}>
                      {conf.label}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5">
                      To: {notice.audiences.map((a: string) => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button 
        onClick={onCreateNew}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#0f172a] hover:bg-slate-800 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-50 group"
      >
        <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
      </button>
    </div>
  );
}