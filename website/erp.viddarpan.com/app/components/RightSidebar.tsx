import React from 'react';
import { Clock, MapPin, MessageSquare, CheckCircle2, AlertCircle, UserCheck, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export default function RightSidebar() {
  return (
    <>
      {/* Next Lesson Card */}
      <div className="bg-slate-800 rounded-xl p-5 text-white relative overflow-hidden shadow-sm">
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-700 rounded-full translate-x-1/3 translate-y-1/3 opacity-50"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Next Lesson</p>
          <h3 className="text-xl font-bold mb-2">English Literature</h3>
          <div className="flex items-center gap-2 text-slate-300 text-[13px] mb-5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Room 402 • 10-A</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-slate-700/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[13px] font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Starts in 15 mins</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-5">Recent Activity</h3>
        <div className="space-y-5">
          <div className="flex gap-3">
            <div className="bg-slate-100 p-1.5 rounded-full h-fit text-slate-600">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-800">New comment on Homework #14</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Rahul Sharma (10-A) • 12m ago</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-emerald-50 p-1.5 rounded-full h-fit text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-800">Exam results published</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Unit Test II (English) • 1h ago</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-amber-50 p-1.5 rounded-full h-fit text-amber-600">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-800">Fee Arrears Notification</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Accounts Department • 3h ago</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-50 p-1.5 rounded-full h-fit text-blue-600">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-800">New student admitted</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Priya Singh • Grade 9-C • 5h ago</p>
            </div>
          </div>
        </div>
        <button className="w-full mt-5 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          View All Activity
        </button>
      </div>

      {/* Academic Insights */}
      <div className="bg-slate-900 rounded-xl p-5 text-white shadow-sm">
        <h3 className="text-base font-bold mb-1">Academic Insights</h3>
        <p className="text-[11px] text-slate-400 mb-5">Class 10-A Performance</p>
        
        <div className="space-y-4 mb-5">
          <div>
            <div className="flex justify-between text-[13px] mb-1.5">
              <span className="text-slate-300">Average Grade</span>
              <span className="font-bold">A- (84%)</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-[13px] mb-1.5">
              <span className="text-slate-300">Assignment Completion</span>
              <button className="text-slate-400 hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex gap-1 h-1.5">
              <div className="flex-1 bg-emerald-400 rounded-full"></div>
              <div className="flex-1 bg-emerald-400 rounded-full"></div>
              <div className="flex-1 bg-emerald-400 rounded-full"></div>
              <div className="flex-1 bg-emerald-400 rounded-full"></div>
              <div className="flex-1 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex gap-2.5 items-start">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-slate-300 leading-relaxed">
            Critical thinking scores increased by 12% following the Poetry Workshop.
          </p>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-800">Leave Requests</h3>
          <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">2 NEW</span>
        </div>
        
        <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-600">
              MK
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">Manav Kohli</p>
              <p className="text-[11px] text-slate-500">Medical • 2 Days</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </>
  );
}
