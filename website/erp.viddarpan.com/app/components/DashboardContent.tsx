import React from 'react';
import { Plus } from 'lucide-react';
import StatCards from './StatCards';
import Schedule from './Schedule';
import Toolkit from './Toolkit';
import RightSidebar from './RightSidebar';

export default function DashboardContent() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Good morning, Sarah.</h2>
          <p className="text-[13px] text-slate-500">Monday, Oct 23rd • You have 4 classes scheduled today.</p>
        </div>
        <button className="flex items-center gap-1.5 bg-emerald-200 text-emerald-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-300 transition-colors">
          <Plus className="w-4 h-4" />
          Create Notice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <StatCards />
          <Schedule />
          <Toolkit />
        </div>
        <div className="space-y-8">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
