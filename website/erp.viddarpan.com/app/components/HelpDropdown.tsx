"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageCircle, PhoneCall, ExternalLink, X } from 'lucide-react';

interface HelpDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const resources = [
  {
    icon: <BookOpen className="w-4 h-4 text-blue-600" />,
    title: 'User Guide & Documentation',
    desc: 'Detailed guides on how to use the ERP system.',
    bg: 'bg-blue-50'
  },
  {
    icon: <MessageCircle className="w-4 h-4 text-emerald-600" />,
    title: 'Chat with IT Support',
    desc: 'Available 9:00 AM to 5:00 PM EST.',
    bg: 'bg-emerald-50'
  },
  {
    icon: <PhoneCall className="w-4 h-4 text-purple-600" />,
    title: 'Emergency Helpline',
    desc: '+91 1800-456-7890 (Toll Free)',
    bg: 'bg-purple-50'
  }
];

export default function HelpDropdown({ isOpen, onClose }: HelpDropdownProps) {
  // Close when pressing Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-12 -right-2 md:right-0 w-[340px] bg-white rounded-xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden z-50 origin-top-right"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-[14px] font-bold text-slate-800">Help & Support</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">How can we help you today?</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded transition-colors hidden md:block">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Resources List */}
            <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
              <div className="p-2 space-y-1">
                {resources.map((item, idx) => (
                  <button 
                    key={idx} 
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors group flex items-start gap-4"
                  >
                    <div className={`shrink-0 w-8 h-8 ${item.bg} rounded-full flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-[13px] font-bold text-slate-800 flex items-center justify-between group-hover:text-blue-600 transition-colors">
                        {item.title}
                        <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <p className="text-[11px] text-slate-500">
                You are currently on <span className="font-bold text-slate-700">v0.1.0-beta</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
