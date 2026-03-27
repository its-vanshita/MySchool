import React from 'react';
import { User, Bell, Palette, Globe, Shield, Save, Mail, Phone, MapPin } from 'lucide-react';

export default function TeacherSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Account & Preferences</h2>
        <p className="text-[13px] text-slate-500">Manage your profile, academic settings, and how you interact with the portal</p>
      </div>

      {/* Personal Profile */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">My Profile</h3>
            <p className="text-[12px] text-slate-500">Update your personal and professional information</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="relative group shrink-0">
              <img 
                src="https://i.pravatar.cc/150?u=sarah" 
                alt="Profile photo" 
                className="w-24 h-24 rounded-full border-2 border-slate-200"
              />
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-xs font-bold">
                Change Photo
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" defaultValue="Dr. Sarah Jenkins" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Department</label>
                <input type="text" defaultValue="Senior Faculty • English" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:bg-white focus:border-indigo-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="email" defaultValue="s.jenkins@viddarpan.edu.in" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" defaultValue="+91 98765 43210" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Interaction */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Alert Preferences</h3>
            <p className="text-[12px] text-slate-500">Manage how you receive updates and notifications</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-[13px] font-bold text-slate-800">Assignment Alerts</p>
                <p className="text-[11px] text-slate-500">Get notified when students submit homework</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <div>
                <p className="text-[13px] font-bold text-slate-800">Parent Communication</p>
                <p className="text-[11px] text-slate-500">Direct message notifications from parents</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-[13px] font-bold text-slate-800">Academic Updates</p>
                <p className="text-[11px] text-slate-500">Institutional and syllabus-wide changes</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
           <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-[13px] font-bold text-slate-800">Leave Approvals</p>
                <p className="text-[11px] text-slate-500">Status update on your leave requests</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button className="px-6 py-2.5 rounded-lg text-[14px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">
          Reset to Default
        </button>
        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-[14px] font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" />
          Update Account
        </button>
      </div>
    </div>
  );
}
