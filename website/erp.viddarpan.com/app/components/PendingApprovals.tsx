import React, { useState } from 'react';
import { CheckCircle2, CalendarOff, Box, MapPin, Wrench, X, Check } from 'lucide-react';

export default function PendingApprovals() {
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      type: 'leave',
      name: 'Saritha Madhavan',
      role: 'Primary Teacher',
      request: 'Requested Medical Leave',
      detail: '3 Days (Oct 24 - Oct 26)',
    },
    {
      id: 3,
      type: 'event',
      name: 'Priya Sharma',
      role: 'Cultural Head',
      request: 'Diwali Fest Event Permission',
      detail: 'Main Auditorium • 500 Attendees',
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const handleAction = (id: number) => {
    setApprovals(prev => prev.filter(app => app.id !== id));
  };

  const filteredApprovals = activeFilter === 'all' 
    ? approvals 
    : approvals.filter(a => a.type === activeFilter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave': return <CalendarOff className="w-5 h-5 text-violet-600" />;
      case 'supply': return <Box className="w-5 h-5 text-emerald-600" />;
      case 'event': return <MapPin className="w-5 h-5 text-blue-600" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-orange-600" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'leave': return 'bg-violet-100 border-violet-200';
      case 'supply': return 'bg-emerald-100 border-emerald-200';
      case 'event': return 'bg-blue-100 border-blue-200';
      case 'maintenance': return 'bg-orange-100 border-orange-200';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-md p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center mb-6 gap-4 xl:gap-0">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-slate-600" />
            Consolidated Action Center
          </h3>
          <p className="text-[13px] text-slate-500 mt-1">Review and approve requests from across the institution.</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar shrink-0">
          {['all', 'leave', 'event'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {filter} {filter === 'all' && `(${approvals.length})`}
            </button>
          ))}
        </div>
      </div>

      {filteredApprovals.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-lg">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">All caught up!</p>
          <p className="text-xs text-slate-500 mt-1">No pending actions requiring your attention right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApprovals.map(approval => (
            <div key={approval.id} className="flex flex-col sm:flex-row justify-between p-4 border border-slate-100 shadow-sm rounded-lg hover:border-slate-300 hover:shadow-md transition-all gap-4 sm:gap-0 group">
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 border ${getTypeColor(approval.type)} relative`}>
                  {getTypeIcon(approval.type)}
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="text-[14px] font-bold text-slate-800 leading-tight">
                      {approval.request}
                    </p>
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      {approval.type}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 mb-1.5">
                    Requested by <span className="font-semibold text-slate-700">{approval.name}</span> ({approval.role})
                  </p>
                  <p className="text-[11px] font-medium text-slate-600 bg-slate-50 inline-block px-2 py-1 rounded border border-slate-200">
                    {approval.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-2 sm:mt-0">
                <button 
                  onClick={() => handleAction(approval.id)}
                  className="p-2 border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all font-semibold flex items-center justify-center gap-1.5 text-[12px] min-w-[36px]"
                  title="Decline"
                >
                  <X className="w-4 h-4" /> <span className="sm:hidden block">Decline</span>
                </button>
                <button 
                  onClick={() => handleAction(approval.id)}
                  className="px-4 py-2 rounded-md text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow focus:ring-2 focus:ring-blue-200 outline-none transition-all flex items-center justify-center gap-2 sm:w-auto w-full"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
