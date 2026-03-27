import React from 'react';
import { Wrench, AlertTriangle, Hammer } from 'lucide-react';

export default function AdminMaintenanceTickets() {
  const tickets = [
    {
      id: 1,
      room: 'Room 102',
      issue: 'Projector not connecting',
      priority: 'high',
      status: 'pending',
    },
    {
      id: 2,
      room: 'Main Hall',
      issue: 'AC unit dripping water',
      priority: 'med',
      status: 'in-progress',
    },
    {
      id: 3,
      room: 'Staff Room A',
      issue: 'Flickering tubelight',
      priority: 'low',
      status: 'pending',
    }
  ];

  return (
    <div className="bg-white rounded-md p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-orange-600" />
          IT & Facilities
        </h3>
        <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          3 Open
        </span>
      </div>

      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="flex gap-3 p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors shadow-sm">
            <div className={`p-2 rounded-lg shrink-0 h-min ${
              ticket.priority === 'high' ? 'bg-red-50 text-red-600' :
              ticket.priority === 'med' ? 'bg-amber-50 text-amber-600' :
              'bg-blue-50 text-blue-600'
            }`}>
              {ticket.priority === 'high' ? <AlertTriangle className="w-4 h-4" /> : <Hammer className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-[13px] text-slate-800 truncate pr-2">{ticket.room}</p>
                {ticket.status === 'in-progress' ? (
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded whitespace-nowrap uppercase tracking-wider">Fixing</span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap uppercase tracking-wider">Queued</span>
                )}
              </div>
              <p className="text-[12px] text-slate-500 line-clamp-1 font-medium">{ticket.issue}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-5 py-2 text-[12px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors flex justify-center items-center gap-1">
        Manage All Tickets &rarr;
      </button>
    </div>
  );
}
