'use client';

import React from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Security Alert',
    message: 'Unidentified vehicle observed at Gate 4 for over 20 minutes.',
    time: '2 mins ago',
    type: 'error',
  },
  {
    id: '2',
    title: 'New Notice Broadcasted',
    message: 'Annual Sports Meet schedule has been updated for all classes.',
    time: '45 mins ago',
    type: 'info',
  },
  {
    id: '3',
    title: 'Leave Request',
    message: 'Mrs. Sharma from Science Department has applied for medical leave.',
    time: '2 hours ago',
    type: 'warning',
  },
  {
    id: '4',
    title: 'System Update',
    message: 'Monthly attendance reports have been generated successfully.',
    time: '5 hours ago',
    type: 'success',
  },
];

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <Info className="w-4 h-4 text-orange-500" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-orange-50';
      case 'success': return 'bg-emerald-50';
      default: return 'bg-blue-50';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
            style={{ top: '100%' }}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Notifications
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px]">4 NEW</span>
              </h3>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              <div className="divide-y divide-slate-50">
                {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${getBg(notif.type)}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="text-[13px] font-bold text-slate-800">{notif.title}</h4>
                          <span className="text-[10px] font-medium text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-[12px] text-slate-600 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                View All Notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
