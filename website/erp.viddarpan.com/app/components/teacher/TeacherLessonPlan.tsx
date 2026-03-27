"use client";

import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Upload, 
  Trash2, 
  MoreVertical,
  Download,
  AlertCircle,
  X,
  File as FileIcon
} from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  documents: { name: string; size: string; type: string }[];
}

interface LessonPlan {
  id: string;
  className: string;
  subject: string;
  unitName: string;
  topics: Topic[];
  progress: number;
}

const mockLessonPlans: LessonPlan[] = [
  {
    id: 'LP001',
    className: '10-A',
    subject: 'Mathematics',
    unitName: 'Quadratic Equations',
    progress: 60,
    topics: [
      {
        id: 'T1',
        name: 'Introduction to Quadratic Equations',
        description: 'Basic definition and standard form of quadratic equations.',
        status: 'Completed',
        documents: [{ name: 'Intro_Notes.pdf', size: '1.2 MB', type: 'pdf' }]
      },
      {
        id: 'T2',
        name: 'Solution by Factorisation',
        description: 'Methods of solving equations using prime factorisation.',
        status: 'In Progress',
        documents: []
      },
      {
        id: 'T3',
        name: 'Nature of Roots',
        description: 'Understanding the discriminant and types of roots.',
        status: 'Pending',
        documents: []
      }
    ]
  },
  {
    id: 'LP002',
    className: '9-B',
    subject: 'Science',
    unitName: 'Cell: The Unit of Life',
    progress: 100,
    topics: [
      {
        id: 'T4',
        name: 'Cell Theory',
        description: 'Discovery and core principles of cell theory.',
        status: 'Completed',
        documents: [{ name: 'Cell_Theory_Slides.pptx', size: '4.5 MB', type: 'pptx' }]
      }
    ]
  }
];

export default function TeacherLessonPlan() {
  const [plans, setPlans] = useState<LessonPlan[]>(mockLessonPlans);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    className: '10-A',
    subject: 'Mathematics',
    unitName: '',
    topicName: '',
    description: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTopic: Topic = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.topicName,
      description: formData.description,
      status: 'Pending',
      documents: uploadedFiles.map(f => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: f.name.split('.').pop() || 'file'
      }))
    };

    // Check if unit already exists
    const existingPlanIndex = plans.findIndex(p => 
      p.className === formData.className && 
      p.subject === formData.subject && 
      p.unitName === formData.unitName
    );

    if (existingPlanIndex !== -1) {
      const updatedPlans = [...plans];
      updatedPlans[existingPlanIndex].topics.push(newTopic);
      // Recalculate progress
      const totalTopics = updatedPlans[existingPlanIndex].topics.length;
      const completedTopics = updatedPlans[existingPlanIndex].topics.filter(t => t.status === 'Completed').length;
      updatedPlans[existingPlanIndex].progress = Math.round((completedTopics / totalTopics) * 100);
      setPlans(updatedPlans);
    } else {
      const newPlan: LessonPlan = {
        id: Math.random().toString(36).substr(2, 9),
        className: formData.className,
        subject: formData.subject,
        unitName: formData.unitName,
        progress: 0,
        topics: [newTopic]
      };
      setPlans([newPlan, ...plans]);
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      className: '10-A',
      subject: 'Mathematics',
      unitName: '',
      topicName: '',
      description: '',
    });
    setUploadedFiles([]);
  };

  const toggleTopicStatus = (planId: string, topicId: string) => {
    const updatedPlans = plans.map(p => {
      if (p.id === planId) {
        const updatedTopics = p.topics.map(t => {
          if (t.id === topicId) {
            const nextStatus = t.status === 'Completed' ? 'In Progress' : 
                             t.status === 'In Progress' ? 'Pending' : 'Completed';
            return { ...t, status: nextStatus as any };
          }
          return t;
        });
        const completedCount = updatedTopics.filter(t => t.status === 'Completed').length;
        return { 
          ...p, 
          topics: updatedTopics, 
          progress: Math.round((completedCount / updatedTopics.length) * 100) 
        };
      }
      return p;
    });
    setPlans(updatedPlans);
    if (selectedPlan?.id === planId) {
      setSelectedPlan(updatedPlans.find(p => p.id === planId) || null);
    }
  };

  const filteredPlans = plans.filter(p => 
    p.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Lesson Planning
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your syllabus, topics, and teaching materials</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Topic
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Planning List */}
        <div className="lg:col-span-12 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search units or subjects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 outline-none bg-white transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                 </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
               {filteredPlans.map((plan) => (
                 <div key={plan.id} className="p-0 overflow-hidden">
                    <div className="p-6 hover:bg-slate-50/30 transition-colors cursor-pointer" onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}>
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex gap-4">
                             <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                <BookOpen className="w-6 h-6" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <h3 className="text-base font-bold text-slate-900">{plan.unitName}</h3>
                                   <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-tight">{plan.className}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-2">{plan.subject}</p>
                                <div className="flex items-center gap-4">
                                   <div className="w-32 bg-slate-100 rounded-full h-1.5">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-500 ${plan.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${plan.progress}%` }}
                                      ></div>
                                   </div>
                                   <span className="text-[11px] font-bold text-slate-500">{plan.progress}% Complete</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-center">
                             <div className="text-right mr-4 hidden sm:block">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Topics</p>
                                <p className="text-sm font-bold text-slate-700">{plan.topics.filter(t => t.status === 'Completed').length} / {plan.topics.length}</p>
                             </div>
                             <button className={`p-2 rounded-lg transition-colors ${selectedPlan?.id === plan.id ? 'bg-slate-100 text-slate-900 rotate-180' : 'text-slate-400 hover:bg-slate-100'}`}>
                                <ChevronDown className="w-5 h-5 transition-transform" />
                             </button>
                          </div>
                       </div>
                    </div>

                    {/* Expanded Topics List */}
                    {selectedPlan?.id === plan.id && (
                      <div className="px-6 pb-6 pt-2 bg-slate-50/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                         {plan.topics.map((topic) => (
                           <div key={topic.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                 <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                       <button 
                                         onClick={() => toggleTopicStatus(plan.id, topic.id)}
                                         className={`shrink-0 transition-colors ${
                                           topic.status === 'Completed' ? 'text-emerald-500 hover:text-emerald-600' :
                                           topic.status === 'In Progress' ? 'text-blue-500 hover:text-blue-600' :
                                           'text-slate-300 hover:text-slate-400'
                                         }`}
                                       >
                                          {topic.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                       </button>
                                       <h4 className={`text-sm font-bold ${topic.status === 'Completed' ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>{topic.name}</h4>
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                          topic.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                          topic.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                                          'bg-slate-50 text-slate-600'
                                       }`}>
                                          {topic.status}
                                       </span>
                                    </div>
                                    <p className="text-sm text-slate-600 ml-8 mb-4">{topic.description}</p>
                                    
                                    {topic.documents.length > 0 && (
                                      <div className="ml-8 flex flex-wrap gap-2">
                                         {topic.documents.map((doc, idx) => (
                                           <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-600 hover:bg-white transition-colors cursor-pointer group">
                                              <FileIcon className="w-3.5 h-3.5 text-blue-500" />
                                              {doc.name}
                                              <span className="text-[9px] text-slate-400">({doc.size})</span>
                                              <Download className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                                           </div>
                                         ))}
                                      </div>
                                    )}
                                 </div>
                                 <div className="flex items-center gap-2 sm:self-start self-end ml-8 sm:ml-0">
                                    <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-md hover:text-slate-900 transition-colors">
                                       <MoreVertical className="w-4 h-4" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                         ))}
                         
                         <button 
                           onClick={() => {
                             setFormData({...formData, className: plan.className, subject: plan.subject, unitName: plan.unitName});
                             setShowAddModal(true);
                           }}
                           className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-sm font-medium flex items-center justify-center gap-2"
                         >
                            <Plus className="w-4 h-4" />
                            Add another topic to this unit
                         </button>
                      </div>
                    )}
                 </div>
               ))}

               {filteredPlans.length === 0 && (
                  <div className="p-12 text-center">
                     <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                     <h3 className="text-slate-900 font-bold mb-1">No plans found</h3>
                     <p className="text-sm text-slate-500">Try adjusting your search filters or add a new lesson plan.</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
               <div>
                  <h3 className="text-lg font-bold text-slate-800">Add Lesson Plan Topic</h3>
                  <p className="text-sm text-slate-500">Upload syllabus materials and track progress.</p>
               </div>
               <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors">
                  <X className="w-5 h-5"/>
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Class <span className="text-rose-500">*</span></label>
                     <select 
                       required
                       value={formData.className}
                       onChange={(e) => setFormData({...formData, className: e.target.value})}
                       className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-shadow outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                     >
                        <option value="9-A">9-A</option>
                        <option value="9-B">9-B</option>
                        <option value="10-A">10-A</option>
                        <option value="11-Sci">11-Sci</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Subject <span className="text-rose-500">*</span></label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Mathematics"
                       value={formData.subject}
                       onChange={(e) => setFormData({...formData, subject: e.target.value})}
                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm transition-shadow outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-2">Unit/Chapter Name <span className="text-rose-500">*</span></label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Unit 4: Quadratic Equations"
                       value={formData.unitName}
                       onChange={(e) => setFormData({...formData, unitName: e.target.value})}
                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm transition-shadow outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-2">Topic Name <span className="text-rose-500">*</span></label>
                     <input 
                       type="text" 
                       required
                       placeholder="e.g. Nature of Roots"
                       value={formData.topicName}
                       onChange={(e) => setFormData({...formData, topicName: e.target.value})}
                       className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm transition-shadow outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-2">Description / Instructions</label>
                     <textarea 
                       rows={3}
                       placeholder="Briefly describe what will be covered in this topic..."
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                       className="w-full p-4 border border-slate-200 rounded-lg text-sm transition-shadow outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                     />
                  </div>
                  
                  {/* Document Upload */}
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-3 text-slate-800">Syllabus Documents (PDF, DOCX, etc.)</label>
                     <div 
                       onClick={() => fileInputRef.current?.click()}
                       className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group"
                     >
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                           <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Click to upload or drag & drop</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX, PPTX up to 10MB each</p>
                        <input 
                           type="file" 
                           ref={fileInputRef}
                           onChange={handleFileUpload}
                           multiple
                           className="hidden" 
                           accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls"
                        />
                     </div>
                     
                     {/* File List */}
                     {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                           {uploadedFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                                 <div className="flex items-center gap-3">
                                    <FileIcon className="w-4 h-4 text-blue-500" />
                                    <div>
                                       <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</p>
                                       <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                 </div>
                                 <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 p-1">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                     Save Lesson Plan
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
