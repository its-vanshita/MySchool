import React, { useState } from 'react';
import { BookOpen, Calendar, Paperclip, UploadCloud, Save, X, FileText } from 'lucide-react';

export default function TeacherHomework() {
  const [formData, setFormData] = useState({
    classId: '',
    subject: '',
    dueDate: '',
    title: '',
    description: '',
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Homework assigned successfully!');
      // Reset form
      setFormData({
        classId: '',
        subject: '',
        dueDate: '',
        title: '',
        description: '',
      });
      setAttachment(null);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-md shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Assign Homework</h1>
          <p className="text-sm text-slate-500 mt-1">Create and distribute assignments to your classes</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 flex-1 overflow-y-auto min-h-0">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col max-w-4xl mx-auto">
          <div className="space-y-6">
            
            {/* Row 1: Class, Subject, Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Class Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Select Class <span className="text-red-500">*</span></label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  required
                >
                  <option value="" disabled>Choose a class...</option>
                  <option value="X-A">Class X - Section A</option>
                  <option value="X-B">Class X - Section B</option>
                  <option value="XI-A">Class XI - Section A</option>
                  <option value="XII-C">Class XII - Section C</option>
                </select>
              </div>

              {/* Subject Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Subject <span className="text-red-500">*</span></label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                >
                  <option value="" disabled>Choose a subject...</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="english">English Literature</option>
                  <option value="computer_science">Computer Science</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Due Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="date"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Homework Title <span className="text-red-500">*</span></label>
              <input 
                type="text"
                placeholder="e.g., Chapter 4: Quadratic Equations - Practice Set"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            {/* Row 3: Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Description / Instructions</label>
              <textarea 
                placeholder="Provide detailed instructions for the students..."
                rows={5}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Row 4: Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Attachments (Optional)</label>
              
              {!attachment ? (
                <div className="mt-2 flex justify-center rounded-md border border-dashed border-slate-300 px-6 py-8 bg-slate-50 hover:bg-slate-100 transition-colors relative">
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">PDF, PNG, JPG, DOC up to 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{attachment.name}</p>
                      <p className="text-xs text-slate-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAttachment(null)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
            <button 
              type="button"
              className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors shadow-sm"
              onClick={() => {
                setFormData({ classId: '', subject: '', dueDate: '', title: '', description: '' });
                setAttachment(null);
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-bold transition-all shadow-sm ${
                isSubmitting 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:shadow-md'
              }`}
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Assign Homework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
