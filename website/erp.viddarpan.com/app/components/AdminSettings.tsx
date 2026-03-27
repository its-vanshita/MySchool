import React from 'react';
import { User, Shield, Bell, Database, Globe, Building, Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Institutional Settings</h2>
        <p className="text-[13px] text-slate-500">Manage school-wide configurations and administrative preferences</p>
      </div>

      {/* Institutional Profile */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">School Profile</h3>
            <p className="text-[12px] text-slate-500">Institutional identities and brand assets</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">School Name</label>
            <input type="text" defaultValue="Vidya Darpan International School" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Registration ID</label>
            <input type="text" defaultValue="INST-2024-VDKS-88" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Principal Name</label>
            <input type="text" defaultValue="Dr. Rajesh Kumar" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700">Email Address</label>
            <input type="email" defaultValue="admin@viddarpan.edu.in" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* Security & Access */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Security & Permissions</h3>
            <p className="text-[12px] text-slate-500">Manage access control and authentication protocols</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Two-Factor Authentication</p>
              <p className="text-[12px] text-slate-500">Require OTP for all administrative logins</p>
            </div>
            <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Automatic Backup</p>
              <p className="text-[12px] text-slate-500">Enable cloud backups every 24 hours</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Notifications */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">System Notifications</h3>
            <p className="text-[12px] text-slate-500">Configure institutional alert mechanisms</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-blue-100 bg-blue-50/50 rounded-lg group hover:border-blue-300 transition-all">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-[13px] font-bold text-slate-700">SMS Alerts</span>
            </button>
            <button className="flex items-center gap-3 p-4 border border-slate-200 bg-white rounded-lg group hover:border-blue-300 transition-all">
              <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-600"></div>
              <span className="text-[13px] font-bold text-slate-700">Email Alerts</span>
            </button>
            <button className="flex items-center gap-3 p-4 border border-blue-100 bg-blue-50/50 rounded-lg group hover:border-blue-300 transition-all">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-[13px] font-bold text-slate-700">App Push</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg text-[14px] font-bold hover:bg-slate-300 transition-colors">
          Discard Changes
        </button>
        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-[14px] font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Configurations
        </button>
      </div>
    </div>
  );
}
