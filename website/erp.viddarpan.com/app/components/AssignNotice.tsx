"use client";

import React, { useState, useRef } from 'react';
import { 
  Building2, Calendar, FileText, Wallet, AlertCircle, 
  CheckCircle2, Bold, Italic, List, Link as LinkIcon, 
  UploadCloud, Info, Send, ArrowLeft
} from 'lucide-react';

export default function AssignNotice({ onBroadcastSuccess, onCancel }: { onBroadcastSuccess?: (notice: any) => void, onCancel?: () => void }) {
  const [activeCategory, setActiveCategory] = useState('academic');
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(['students']);
  const [selectAll, setSelectAll] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = description;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);
    
    let newText = '';
    let newCursorPos = 0;

    if (prefix === '[') {
      newText = before + prefix + (selected || 'link text') + '](' + suffix + ')' + after;
      newCursorPos = start + prefix.length + (selected || 'link text').length + 2 + suffix.length + 1;
    } else {
      newText = before + prefix + selected + suffix + after;
      newCursorPos = start + prefix.length + selected.length + suffix.length;
    }
    
    setDescription(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        if (selected.length === 0 && prefix !== '[') {
          textareaRef.current.setSelectionRange(start + prefix.length, start + prefix.length);
        } else {
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }
    }, 0);
  };

  const categories = [
    { id: 'academic', label: 'Academic', icon: Building2 },
    { id: 'event', label: 'Event', icon: Calendar },
    { id: 'holiday', label: 'Holiday', icon: FileText },
    { id: 'fee', label: 'Fee', icon: Wallet },
    { id: 'alert', label: 'Alert', icon: AlertCircle, color: 'text-red-500' },
  ];

  const toggleAudience = (aud: string) => {
    if (selectedAudiences.includes(aud)) {
      setSelectedAudiences(selectedAudiences.filter(a => a !== aud));
      setSelectAll(false);
    } else {
      const newSelections = [...selectedAudiences, aud];
      setSelectedAudiences(newSelections);
      if (newSelections.length === 3) setSelectAll(true);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAudiences([]);
      setSelectAll(false);
    } else {
      setSelectedAudiences(['students', 'teachers', 'parents']);
      setSelectAll(true);
    }
  };

  const handleBroadcast = () => {
    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and description before broadcasting.");
      return;
    }
    if (selectedAudiences.length === 0) {
      alert("Please select at least one target audience.");
      return;
    }

    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setIsSuccess(true);
      
      const newNotice = {
        id: Date.now().toString(),
        title,
        description,
        category: activeCategory,
        audiences: selectedAudiences,
        date: new Date().toISOString()
      };

      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setDescription('');
        setShowPreview(false);
        if (onBroadcastSuccess) {
          onBroadcastSuccess(newNotice);
        }
      }, 2500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center max-w-[800px]">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Notice Broadcasted!</h2>
        <p className="text-slate-500 max-w-[300px] mb-8">Your notice has been successfully sent to {selectedAudiences.length} audience group(s).</p>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="max-w-[800px] pb-10">
        <div className="mb-6">
          <button 
            onClick={() => setShowPreview(false)} 
            className="flex items-center gap-2 text-[14px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Editor
          </button>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          <div className="mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                {categories.find(c => c.id === activeCategory)?.label || 'Notice'}
              </span>
              <span className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 whitespace-pre-wrap break-words">{title || 'Untitled Notice'}</h1>
            <p className="text-sm text-slate-500 flex gap-2">
              <span className="font-medium text-slate-700">To:</span> 
              {selectedAudiences.length > 0 ? selectedAudiences.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ') : 'No audience selected'}
            </p>
          </div>
          
          <div className="mt-4 whitespace-pre-wrap text-slate-700 leading-relaxed text-[15px]">
            {description ? description : <span className="italic text-slate-400">No description provided...</span>}
          </div>
        </div>

        <div className="flex justify-end pt-6 mt-6 gap-4">
          <button 
            onClick={() => setShowPreview(false)}
            className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[14px] font-bold transition-colors"
          >
            Edit further
          </button>
          <button 
            onClick={handleBroadcast}
            disabled={isBroadcasting}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#172554] hover:bg-slate-900 text-white rounded-md text-[14px] font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isBroadcasting ? 'Broadcasting...' : 'Broadcast Notice'}
            {!isBroadcasting && <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] pb-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Assign New Notice</h2>
          <p className="text-[14px] text-slate-500 font-medium">Draft and broadcast important updates to your institution.</p>
        </div>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-[14px] font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Title and Category Row */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-slate-800 mb-1">Notice Title</h3>
            <p className="text-[12px] text-slate-500 mb-3">Give your notice a clear, concise headline.</p>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Meet 2024 Sch..." 
              className="w-full px-4 py-3.5 bg-slate-100 border-none rounded-md focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-slate-700 font-medium placeholder:font-normal placeholder:opacity-60"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-slate-800 mb-1">Category</h3>
            <p className="text-[12px] text-slate-500 mb-3">Categorize the notice for better filtering and importance.</p>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center justify-center py-3 rounded-md flex-1 border-2 transition-all ${
                    activeCategory === cat.id 
                      ? 'border-slate-800 bg-white shadow-sm' 
                      : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <cat.icon className={`w-5 h-5 mb-1.5 ${activeCategory === cat.id ? 'text-slate-900' : 'text-slate-500'} ${cat.color || ''}`} />
                  <span className={`text-[11px] font-bold ${activeCategory === cat.id ? 'text-slate-900' : 'text-slate-600'} ${cat.color || ''}`}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-slate-50 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[14px] font-bold text-slate-800 mb-1">Target Audience</h3>
              <p className="text-[12px] text-slate-500">Who should receive this notification?</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-slate-600">Select All</span>
              <button 
                onClick={handleSelectAll}
                className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${selectAll ? 'bg-blue-300' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${selectAll ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            {[
              { id: 'students', label: 'Students' },
              { id: 'teachers', label: 'Teachers' },
              { id: 'parents', label: 'Parents' }
            ].map(aud => {
              const isSelected = selectedAudiences.includes(aud.id);
              return (
                <button
                  key={aud.id}
                  onClick={() => toggleAudience(aud.id)}
                  className={`flex items-center justify-center gap-2 w-32 py-2.5 rounded-md font-bold text-[13px] transition-all border ${
                    isSelected 
                      ? 'bg-[#d1fae5] border-[#a7f3d0] text-emerald-700' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={3} />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                  )}
                  {aud.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notice Description */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-[14px] font-bold text-slate-800">Notice Description</h3>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors" title="Bold (Ctrl+B)"><Bold className="w-4 h-4" /></button>
              <button type="button" onClick={() => insertFormatting('*', '*')} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors" title="Italic (Ctrl+I)"><Italic className="w-4 h-4" /></button>
              <button type="button" onClick={() => insertFormatting('- ', '')} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors" title="List"><List className="w-4 h-4" /></button>
              <button type="button" onClick={() => insertFormatting('[', 'url')} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type the detailed content of the notice here..."
            className="w-full h-56 px-5 py-4 bg-white border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-[14px] text-slate-700 resize-none font-sans"
          ></textarea>
        </div>

        {/* Attachments */}
        <div>
          <h3 className="text-[14px] font-bold text-slate-800 mb-3">Attachments</h3>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-[#0f172a] rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-[15px] font-bold text-slate-800 mb-1">Upload relevant documents</h4>
            <p className="text-[12px] text-slate-500">Drag and drop PDFs, JPGs, or PNGs here. Maximum file size per attachment: 10MB.</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-6 gap-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Info className="w-4 h-4" />
            <span className="text-[12px] font-semibold">Draft autosaved at 10:45 AM</span>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setShowPreview(true)}
              className="flex-1 sm:flex-none px-8 py-3.5 bg-[#6feeb7] hover:bg-[#5ae6a8] text-[#0f172a] rounded-md text-[14px] font-bold transition-colors"
            >
              Preview
            </button>
            <button 
              onClick={handleBroadcast}
              disabled={isBroadcasting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-[#172554] hover:bg-slate-900 text-white rounded-md text-[14px] font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isBroadcasting ? 'Broadcasting...' : 'Broadcast Notice'}
              {!isBroadcasting && <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}