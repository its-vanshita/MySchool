"use client";

import React, { useState } from 'react';
import { 
  Megaphone, 
  Send, 
  Users, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  Search,
  ChevronDown
} from 'lucide-react';

// Mock Data
const mockClasses = [
  { id: '10-A', name: '10-A (Mathematics)' },
  { id: '10-B', name: '10-B (Mathematics)' },
  { id: '11-Sci', name: '11-Sci (Applied Math)' }
];

const mockStudentsByClass: Record<string, { id: string, name: string, roll: number }[]> = {
  '10-A': [
    { id: 'S1', name: 'Aisha Patel', roll: 1 },
    { id: 'S2', name: 'Rahul Kumar', roll: 2 },
    { id: 'S3', name: 'Priya Sharma', roll: 3 },
  ],
  '10-B': [
    { id: 'S10', name: 'Kabir Singh', roll: 1 },
    { id: 'S11', name: 'Ananya Desai', roll: 2 },
  ],
  '11-Sci': [
    { id: 'S20', name: 'Rohan Mehra', roll: 1 },
  ]
};

const mockSentNotices = [
  {
    id: 1,
    title: 'Upcoming Math Assignment',
    message: 'Please complete chapters 4 and 5 by Friday. It carries 10 marks towards your internal assessment.',
    date: 'Today, 09:30 AM',
    recipients: ['10-A', '10-B'],
    type: 'Class'
  },
  {
    id: 2,
    title: 'Remedial Class Schedule',
    message: 'There will be a special remedial class for algebra this Saturday at 10 AM.',
    date: 'Yesterday, 14:15 PM',
    recipients: ['Rahul Kumar (10-A)', 'Kabir Singh (10-B)'],
    type: 'Individual'
  }
];

export default function TeacherNotices() {
  const [activeTab, setActiveTab] = useState<'Compose' | 'Sent'>('Compose');
  
  // Compose Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  
  // Selection State
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // UI State
  const [showStudentPicker, setShowStudentPicker] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleClassToggle = (classId: string) => {
    setSelectedClasses(prev => {
      const isSelected = prev.includes(classId);
      if (isSelected) {
        // Remove class and any students selected from this class
        const currentClassStudentIds = mockStudentsByClass[classId]?.map(s => s.id) || [];
        setSelectedStudents(currStudents => currStudents.filter(id => !currentClassStudentIds.includes(id)));
        return prev.filter(c => c !== classId);
      } else {
        return [...prev, classId];
      }
    });
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(s => s !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;
    if (selectedClasses.length === 0) return;

    // In a real app, API logic goes here.
    setShowSuccessModal(true);
    
    // Reset form after short delay
    setTimeout(() => {
      setShowSuccessModal(false);
      setNoticeTitle('');
      setNoticeMessage('');
      setSelectedClasses([]);
      setSelectedStudents([]);
      setActiveTab('Sent');
    }, 2000);
  };

  return (
    <div className="flex flex-col space-y-6 max-w-[1000px] pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notices & Communication</h1>
          <p className="text-sm text-slate-500 mt-1">Broadcast messages to your classes or reach out to specific students.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('Compose')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'Compose' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Compose Notice
           </button>
           <button 
             onClick={() => setActiveTab('Sent')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'Sent' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Sent History
           </button>
        </div>
      </div>

      {activeTab === 'Sent' && (
        <div className="space-y-4 animate-in fade-in duration-300">
           {mockSentNotices.map((notice) => (
             <div key={notice.id} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="text-lg font-semibold text-slate-800">{notice.title}</h3>
                   <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                      <Clock className="w-3.5 h-3.5" />
                      {notice.date}
                   </span>
                </div>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{notice.message}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                   <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sent To:</span>
                   <div className="flex flex-wrap gap-2">
                     {notice.recipients.map((rec, i) => (
                       <span key={i} className={`text-xs px-2 py-1 rounded-md font-medium border ${notice.type === 'Class' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>
                         {rec}
                       </span>
                     ))}
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'Compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-4">
             <div className="bg-white border border-slate-200 rounded-lg p-6">
                <form id="noticeForm" onSubmit={handleSendNotice} className="space-y-5">
                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notice Title The Subject</label>
                     <input 
                       type="text" 
                       required
                       value={noticeTitle}
                       onChange={e => setNoticeTitle(e.target.value)}
                       placeholder="e.g. Important Update regarding practical exams..." 
                       className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message Content</label>
                     <textarea 
                       required
                       value={noticeMessage}
                       onChange={e => setNoticeMessage(e.target.value)}
                       rows={6}
                       placeholder="Write your message here..." 
                       className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all resize-y"
                     />
                   </div>
                </form>
             </div>
          </div>

          {/* Recipient Targeting Sidebar */}
          <div className="space-y-4">
             <div className="bg-white border border-slate-200 rounded-lg flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-lg">
                   <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" /> Target Audience
                   </h3>
                   <p className="text-xs text-slate-500 mt-1">Select classes and optional specific students.</p>
                </div>
                
                <div className="p-2 space-y-1 overflow-y-auto max-h-[300px] flex-1">
                   {mockClasses.map(cls => (
                     <div key={cls.id} className="border border-transparent hover:border-slate-200 rounded-md transition-colors">
                        <div 
                          className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${selectedClasses.includes(cls.id) ? 'bg-blue-50 text-blue-800' : 'hover:bg-slate-50'}`}
                        >
                           <div className="flex items-center gap-3 w-full" onClick={() => handleClassToggle(cls.id)}>
                             <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selectedClasses.includes(cls.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                {selectedClasses.includes(cls.id) && <Check className="w-3 h-3 text-white" />}
                             </div>
                             <span className="text-sm font-semibold text-slate-700">{cls.name}</span>
                           </div>
                           
                           {/* Button to expand students ONLY if class is selected */}
                           {selectedClasses.includes(cls.id) && (
                             <button 
                               type="button"
                               onClick={(e) => { e.stopPropagation(); setShowStudentPicker(showStudentPicker === cls.id ? null : cls.id); }}
                               className="p-1 hover:bg-blue-100 rounded text-blue-600 ml-2"
                               title="Select specific students"
                             >
                                <ChevronDown className={`w-4 h-4 transition-transform ${showStudentPicker === cls.id ? 'rotate-180' : ''}`} />
                             </button>
                           )}
                        </div>

                        {/* Student Sub-picker */}
                        {showStudentPicker === cls.id && selectedClasses.includes(cls.id) && (
                           <div className="pl-11 pr-3 pb-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 mt-1 px-1">Specific Students (Optional)</p>
                              {mockStudentsByClass[cls.id].map(student => (
                                 <label key={student.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer group">
                                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${selectedStudents.includes(student.id) ? 'bg-purple-500 border-purple-500' : 'border-slate-300 bg-white group-hover:border-purple-400'}`}>
                                       {selectedStudents.includes(student.id) && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <span className="text-xs text-slate-600 font-medium group-hover:text-slate-900">{student.roll} - {student.name}</span>
                                 </label>
                              ))}
                              {selectedStudents.filter(id => mockStudentsByClass[cls.id].map(s=>s.id).includes(id)).length > 0 && (
                                <div className="mt-2 text-[10px] text-purple-600 font-medium px-1 bg-purple-50 py-1 rounded">
                                   * Notice will be restricted to selected students only for this class.
                                </div>
                              )}
                           </div>
                        )}
                     </div>
                   ))}
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto rounded-b-lg">
                   <button 
                     type="submit"
                     form="noticeForm"
                     disabled={selectedClasses.length === 0 || !noticeTitle.trim() || !noticeMessage.trim()}
                     className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
                   >
                     <Send className="w-4 h-4" /> Send Notice
                   </button>
                   {selectedClasses.length === 0 && (
                     <p className="text-xs text-amber-600 mt-2 text-center flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Select at least one class
                     </p>
                   )}
                </div>
             </div>
          </div>

        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/20 flex items-center justify-center z-[110] animate-in fade-in duration-200">
           <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center justify-center -mt-10 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                 <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Notice Sent Successfully!</h3>
              <p className="text-sm text-slate-500 mt-2">Your message has been broadcasted.</p>
           </div>
        </div>
      )}

    </div>
  );
}
