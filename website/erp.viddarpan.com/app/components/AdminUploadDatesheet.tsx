"use client";

import React, { useState } from 'react';
import { CalendarClock, UploadCloud, FileText, Eye, Trash2, Users, GraduationCap, X, FileDown, Search, Filter, Edit2 } from 'lucide-react';

interface Datesheet {
  id: string;
  title: string;
  examType: string;
  classes: string;
  visibility: 'teachers' | 'students' | 'both';
  uploadDate: string;
  status: 'Published' | 'Draft';
  fileSize: string;
  fileUrl?: string; // Add mock file URL prop to simulate an openable pdf
}

const mockDatesheets: Datesheet[] = [
  {
    id: '1',
    title: 'Final Examination 2023-24',
    examType: 'Final Exam',
    classes: '9th to 12th',
    visibility: 'both',
    uploadDate: 'Mar 10, 2024',
    status: 'Published',
    fileSize: '2.4 MB'
  },
  {
    id: '2',
    title: 'Unit Test 1 (Pre-board review)',
    examType: 'Unit Test',
    classes: '10th, 12th',
    visibility: 'teachers',
    uploadDate: 'Mar 22, 2024',
    status: 'Draft',
    fileSize: '845 KB'
  },
  {
    id: '3',
    title: 'Primary Section Half Yearly',
    examType: 'Half Yearly',
    classes: '1st to 5th',
    visibility: 'students',
    uploadDate: 'Feb 28, 2024',
    status: 'Published',
    fileSize: '1.2 MB'
  }
];

export default function AdminUploadDatesheet() {
  const [datesheets, setDatesheets] = useState<Datesheet[]>(mockDatesheets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingFile, setViewingFile] = useState<Datesheet | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newExamType, setNewExamType] = useState('Final Exam');
  const [newClasses, setNewClasses] = useState('');
  const [newVisibility, setNewVisibility] = useState<'teachers' | 'students' | 'both'>('both');
  const [newStatus, setNewStatus] = useState<'Published' | 'Draft'>('Published');

  const handleDelete = (id: string) => {
    setDatesheets(datesheets.filter(d => d.id !== id));
  };

  const handleEdit = (doc: Datesheet) => {
    setEditingId(doc.id);
    setNewTitle(doc.title);
    setNewExamType(doc.examType);
    setNewClasses(doc.classes);
    setNewVisibility(doc.visibility);
    setNewStatus(doc.status);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setNewTitle('');
    setNewExamType('Final Exam');
    setNewClasses('');
    setNewVisibility('both');
    setNewStatus('Published');
    setIsModalOpen(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setDatesheets(datesheets.map(d => 
        d.id === editingId ? {
          ...d,
          title: newTitle || 'Untitled Datesheet',
          examType: newExamType,
          classes: newClasses || 'All Classes',
          visibility: newVisibility,
          status: newStatus
        } : d
      ));
      
      // Update viewing file if it's currently open
      if (viewingFile && viewingFile.id === editingId) {
        setViewingFile({
          ...viewingFile,
          title: newTitle || 'Untitled Datesheet',
          examType: newExamType,
          classes: newClasses || 'All Classes',
          visibility: newVisibility,
          status: newStatus
        });
      }
    } else {
      const newDatesheet: Datesheet = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTitle || 'Untitled Datesheet',
        examType: newExamType,
        classes: newClasses || 'All Classes',
        visibility: newVisibility,
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: newStatus,
        fileSize: '1.5 MB'
      };
      setDatesheets([newDatesheet, ...datesheets]);
    }
    setIsModalOpen(false);
    setEditingId(null); // Reset
  };

  const filteredDatesheets = datesheets.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.classes.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.examType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getVisibilityBadge = (visibility: string) => {
    switch(visibility) {
      case 'both':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"><Users className="w-3.5 h-3.5" /> Everyone</span>;
      case 'teachers':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><Eye className="w-3.5 h-3.5" /> Teachers Only</span>;
      case 'students':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><GraduationCap className="w-3.5 h-3.5" /> Students & Parents</span>;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-blue-600" />
            Datesheets Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">Upload and manage examination datesheets with visibility controls</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Datesheet
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-170px)] min-h-[500px]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search via title, class or exam type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filter Status
          </button>
        </div>

        {/* Datesheets List */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatesheets.map((doc) => (
              <div key={doc.id} onClick={() => setViewingFile(doc)} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all group relative flex flex-col cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    doc.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight line-clamp-2" title={doc.title}>
                  {doc.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">{doc.examType}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>Classes: {doc.classes}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    {getVisibilityBadge(doc.visibility)}
                    <span className="text-[11px] text-slate-400">Uploaded {doc.uploadDate} • {doc.fileSize}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={(e) => e.stopPropagation()} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Download">
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(doc); }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDatesheets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No datesheets found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">Try adjusting your filters or search query, or upload a new datesheet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                {editingId ? 'Edit Datesheet' : 'Upload New Datesheet'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="flex flex-col h-full max-h-[80vh]">
              <div className="p-6 space-y-5 overflow-y-auto">
                {/* File Dropzone */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer bg-slate-50/50">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-blue-600 mb-3 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG or CSV (max. 10MB)</p>
                  <button type="button" className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm">
                    Select File
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Document Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Final Examination 2024" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Exam Type</label>
                    <select 
                      value={newExamType}
                      onChange={(e) => setNewExamType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option>Final Exam</option>
                      <option>Mid Term</option>
                      <option>Half Yearly</option>
                      <option>Unit Test</option>
                      <option>Pre-Board</option>
                      <option>Practical Exam</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Target Classes</label>
                    <input 
                      type="text" 
                      value={newClasses}
                      onChange={(e) => setNewClasses(e.target.value)}
                      placeholder="e.g. 10th, 12th" 
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-sm font-semibold text-slate-700">Status</label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as 'Published' | 'Draft')}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="Published">Published (Visible)</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Visibility Controls */}
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-slate-700">Who can see this Datesheet?</label>
                  <div className="grid gap-3">
                    <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${newVisibility === 'both' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="visibility" 
                        value="both" 
                        checked={newVisibility === 'both'}
                        onChange={(e) => setNewVisibility('both')}
                        className="mt-1 flex-shrink-0" 
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">Everyone <Users className="w-3.5 h-3.5 text-blue-600"/></div>
                        <div className="text-xs text-slate-500 mt-0.5">Visible to all Teachers, Students, and Parents.</div>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${newVisibility === 'students' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="visibility" 
                        value="students" 
                        checked={newVisibility === 'students'}
                        onChange={(e) => setNewVisibility('students')}
                        className="mt-1 flex-shrink-0" 
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">Students & Parents <GraduationCap className="w-3.5 h-3.5 text-emerald-600"/></div>
                        <div className="text-xs text-slate-500 mt-0.5">Published directly to student/parent portals.</div>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${newVisibility === 'teachers' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="visibility" 
                        value="teachers" 
                        checked={newVisibility === 'teachers'}
                        onChange={(e) => setNewVisibility('teachers')}
                        className="mt-1 flex-shrink-0" 
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">Teachers Only <Eye className="w-3.5 h-3.5 text-amber-600"/></div>
                        <div className="text-xs text-slate-500 mt-0.5">Kept hidden from students. Only staff can view this.</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 mt-auto">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-xl transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Upload & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View & Edit Overlay Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-8">
          <div className="bg-white rounded-2xl shadow-xl w-full h-full max-w-5xl overflow-hidden flex flex-col xl:flex-row relative">
            {/* Close Overlay Button */}
            <button 
              onClick={() => setViewingFile(null)} 
              className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors xl:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left side: Simulated PDF viewer */}
            <div className="flex-1 bg-slate-100 border-r border-slate-200 flex flex-col min-h-[300px] xl:order-first">
              <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                <span className="text-sm font-medium truncate">{viewingFile.title}.pdf</span>
                <span className="text-xs text-slate-400 hidden sm:inline-block">1 of 1</span>
              </div>
              <div className="flex-1 overflow-auto flex items-start justify-center p-4 lg:p-8">
                {/* Mock PDF Document Rendering */}
                <div className="bg-white shadow-xl shadow-slate-300 w-full max-w-[800px] aspect-[1/1.414] rounded-sm flex flex-col relative border border-slate-200">
                  <div className="p-8 lg:p-12 border-b-2 border-double border-blue-900 mx-8 mt-8 pb-4">
                    <h1 className="text-2xl lg:text-3xl font-serif text-center font-bold text-slate-900 uppercase">VidDarpan Academy</h1>
                  </div>
                  <h2 className="text-center font-bold text-lg mt-6">{viewingFile.examType} Datesheet</h2>
                  <p className="text-center text-sm font-semibold text-slate-600 mt-2">Classes: {viewingFile.classes}</p>
                  
                  <div className="px-8 lg:px-12 mt-8">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-y border-slate-300">
                          <th className="py-3 px-4 font-bold border-r border-slate-300">Date/Day</th>
                          <th className="py-3 px-4 font-bold">Subject</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="py-3 px-4 border-r border-slate-300">12th Sept (Mon)</td>
                          <td className="py-3 px-4">Mathematics</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="py-3 px-4 border-r border-slate-300">14th Sept (Wed)</td>
                          <td className="py-3 px-4">Science / Physics</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="py-3 px-4 border-r border-slate-300">18th Sept (Mon)</td>
                          <td className="py-3 px-4">English Language</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-r border-slate-300">22nd Sept (Fri)</td>
                          <td className="py-3 px-4">Social Studies</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="absolute font-serif bottom-12 right-12 text-right">
                    <div className="border-b border-slate-400 w-24 mb-1"></div>
                    <p className="text-xs font-bold">Principal Signature</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Details & Edit Controls */}
            <div className="w-full xl:w-96 bg-white flex flex-col shrink-0">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 relative">
                <h3 className="text-lg font-bold text-slate-900">Record Info</h3>
                <button 
                  onClick={() => setViewingFile(null)} 
                  className="text-slate-400 hover:text-slate-900 transition-colors hidden xl:block"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</h4>
                  <p className="text-base font-semibold text-slate-900">{viewingFile.title}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</h4>
                    <span className={`inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                      viewingFile.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {viewingFile.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Upload Date</h4>
                    <p className="text-sm font-medium text-slate-700">{viewingFile.uploadDate}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metadata</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-sm text-slate-500">Exam Type</span>
                      <span className="text-sm font-bold text-slate-800">{viewingFile.examType}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-sm text-slate-500">Target Classes</span>
                      <span className="text-sm font-bold text-slate-800">{viewingFile.classes}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-sm text-slate-500">Visibility</span>
                      {getVisibilityBadge(viewingFile.visibility)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-3 mt-auto">
                <button 
                   onClick={() => { 
                    handleEdit(viewingFile); 
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Settings
                </button>
                <button 
                  onClick={() => {
                    handleDelete(viewingFile.id);
                    setViewingFile(null);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}