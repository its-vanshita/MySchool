"use client";

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ExternalLink, MessageSquare, Book, ShieldQuestion, LifeBuoy } from 'lucide-react';

export default function HelpDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`hover:text-slate-700 transition-colors p-1 rounded-full ${isOpen ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`}
        aria-label="Help and Support"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in duration-200">
          <div className="px-4 pb-2 border-b border-slate-100 mb-2">
            <h3 className="text-[14px] font-bold text-slate-800">Help & Support</h3>
            <p className="text-[11px] text-slate-500 font-medium">VidDarpan Institutional Support</p>
          </div>

          <div className="space-y-0.5 px-2">
            <HelpItem 
              icon={<Book className="w-4 h-4 text-blue-500" />} 
              label="Documentation" 
              description="User guides and tutorials" 
            />
            <HelpItem 
              icon={<MessageSquare className="w-4 h-4 text-emerald-500" />} 
              label="Live Support" 
              description="Chat with our technicians" 
            />
            <HelpItem 
              icon={<ShieldQuestion className="w-4 h-4 text-purple-500" />} 
              label="FAQs" 
              description="Common questions answered" 
            />
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 px-4">
            <button className="w-full flex items-center justify-between py-2 text-[12px] font-semibold text-blue-600 hover:text-blue-700">
              <span className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4" />
                Contact Administrator
              </span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HelpItem({ icon, label, description }: { icon: React.ReactNode, label: string, description: string }) {
  return (
    <button className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group">
      <div className="mt-0.5 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-[13px] font-semibold text-slate-700 leading-none">{label}</p>
        <p className="text-[11px] text-slate-500 mt-1">{description}</p>
      </div>
    </button>
  );
}
