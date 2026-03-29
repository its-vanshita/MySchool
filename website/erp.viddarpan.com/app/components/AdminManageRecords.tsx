"use client";

import React, { useState } from 'react';
import {
  Users, GraduationCap, Search, Trash2, Edit2, UserPlus,
  X, Eye, Phone, Briefcase, Hash, Heart, Home,
  CreditCard, Shield, Check, RotateCcw
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentRecord {
  id: string;
  // Personal
  name: string; dob: string; gender: string; bloodGroup: string;
  aadhaar: string; religion: string; caste: string; category: string;
  nationality: string; motherTongue: string;
  // Academic
  admNo: string; rollNo: string; class: string; section: string;
  dateOfAdmission: string; previousSchool: string;
  // Address
  address: string; city: string; state: string; pincode: string;
  // Father
  fatherName: string; fatherOccupation: string;
  fatherContact: string; fatherEmail: string; fatherIncome: string;
  // Mother
  motherName: string; motherOccupation: string;
  motherContact: string; motherEmail: string;
  // Guardian
  guardianName: string; guardianRelation: string; guardianContact: string;
}

interface TeacherRecord {
  id: string;
  // Personal
  name: string; dob: string; gender: string; bloodGroup: string;
  aadhaar: string; religion: string; caste: string; category: string;
  nationality: string;
  // Employment
  empId: string; designation: string; department: string;
  subject: string; dateOfJoining: string; employmentType: string;
  qualification: string; experience: string; salary: string;
  // Contact
  contact: string; email: string; altContact: string;
  // Address
  address: string; city: string; state: string; pincode: string;
  // Bank
  bankName: string; accountNo: string; ifsc: string; pan: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockStudents: StudentRecord[] = [
  {
    id: 'S001', name: 'Aisha Patel', dob: '2008-04-12', gender: 'Female',
    bloodGroup: 'B+', aadhaar: '1234 5678 9012', religion: 'Hindu',
    caste: 'Patel', category: 'General', nationality: 'Indian', motherTongue: 'Gujarati',
    admNo: 'VD-2024-001', rollNo: '01', class: '10', section: 'A',
    dateOfAdmission: '2018-04-01', previousSchool: 'City Primary School',
    address: '12, Sunshine Colony, Near Lal Bagh', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001',
    fatherName: 'Rajesh Patel', fatherOccupation: 'Businessman', fatherContact: '+91 9876543210',
    fatherEmail: 'rajesh.patel@email.com', fatherIncome: '₹ 12,00,000 p.a.',
    motherName: 'Sunita Patel', motherOccupation: 'Homemaker', motherContact: '+91 9876543211', motherEmail: '',
    guardianName: '', guardianRelation: '', guardianContact: '',
  },
  {
    id: 'S002', name: 'Rahul Kumar', dob: '2007-11-23', gender: 'Male',
    bloodGroup: 'O+', aadhaar: '2345 6789 0123', religion: 'Hindu',
    caste: 'Kumar', category: 'OBC', nationality: 'Indian', motherTongue: 'Hindi',
    admNo: 'VD-2024-002', rollNo: '02', class: '10', section: 'A',
    dateOfAdmission: '2019-06-01', previousSchool: 'Sunrise Academy',
    address: '45, Nehru Nagar, Block C', city: 'Delhi', state: 'Delhi', pincode: '110001',
    fatherName: 'Amit Kumar', fatherOccupation: 'Government Employee', fatherContact: '+91 9876543212',
    fatherEmail: 'amit.kumar@gov.in', fatherIncome: '₹ 7,50,000 p.a.',
    motherName: 'Prerna Kumar', motherOccupation: 'Teacher', motherContact: '+91 9876543213', motherEmail: 'prerna@school.in',
    guardianName: '', guardianRelation: '', guardianContact: '',
  },
  {
    id: 'S003', name: 'Priya Sharma', dob: '2008-07-05', gender: 'Female',
    bloodGroup: 'A+', aadhaar: '3456 7890 1234', religion: 'Hindu',
    caste: 'Brahmin', category: 'General', nationality: 'Indian', motherTongue: 'Hindi',
    admNo: 'VD-2023-018', rollNo: '15', class: '9', section: 'B',
    dateOfAdmission: '2019-04-01', previousSchool: 'Modern School',
    address: '78, Green Park Extension', city: 'New Delhi', state: 'Delhi', pincode: '110016',
    fatherName: 'Sanjay Sharma', fatherOccupation: 'Doctor (MBBS)', fatherContact: '+91 9876543214',
    fatherEmail: 'sanjay.doc@hospital.com', fatherIncome: '₹ 25,00,000 p.a.',
    motherName: 'Anjali Sharma', motherOccupation: 'Lecturer', motherContact: '+91 9876543215', motherEmail: 'anjali.sharma@du.in',
    guardianName: '', guardianRelation: '', guardianContact: '',
  },
  {
    id: 'S004', name: 'Kabir Singh', dob: '2006-02-18', gender: 'Male',
    bloodGroup: 'AB-', aadhaar: '4567 8901 2345', religion: 'Sikh',
    caste: 'Jat', category: 'General', nationality: 'Indian', motherTongue: 'Punjabi',
    admNo: 'VD-2022-008', rollNo: '08', class: '11', section: 'Sci',
    dateOfAdmission: '2017-04-01', previousSchool: 'DAV Public School',
    address: '23, Sector 7, Rohini', city: 'Delhi', state: 'Delhi', pincode: '110085',
    fatherName: 'Vikram Singh', fatherOccupation: 'Army Officer (Col.)', fatherContact: '+91 9876543216',
    fatherEmail: 'vikram.singh@army.in', fatherIncome: '₹ 18,00,000 p.a.',
    motherName: 'Harpreet Kaur', motherOccupation: 'Businesswoman', motherContact: '+91 9876543217', motherEmail: 'harpreet@business.com',
    guardianName: '', guardianRelation: '', guardianContact: '',
  },
];

const mockTeachers: TeacherRecord[] = [
  {
    id: 'T001', name: 'Sarah Johnson', dob: '1985-06-15', gender: 'Female',
    bloodGroup: 'O+', aadhaar: '5678 9012 3456', religion: 'Christian',
    caste: 'N/A', category: 'General', nationality: 'Indian',
    empId: 'EMP-101', designation: 'Senior Teacher', department: 'Mathematics',
    subject: 'Mathematics', dateOfJoining: '2012-07-01', employmentType: 'Permanent',
    qualification: 'M.Sc. Mathematics, B.Ed', experience: '14 Years',
    salary: '₹ 65,000 / month',
    contact: '+91 8876543210', email: 'sarah.j@viddarpan.edu.in', altContact: '+91 8776543210',
    address: '5, Teachers Colony, Lane 3', city: 'New Delhi', state: 'Delhi', pincode: '110002',
    bankName: 'State Bank of India', accountNo: '30912345678', ifsc: 'SBIN0001234', pan: 'ABCDE1234F',
  },
  {
    id: 'T002', name: 'Michael Chen', dob: '1988-03-22', gender: 'Male',
    bloodGroup: 'A+', aadhaar: '6789 0123 4567', religion: 'Buddhist',
    caste: 'N/A', category: 'General', nationality: 'Indian',
    empId: 'EMP-102', designation: 'TGT Science', department: 'Science',
    subject: 'Physics', dateOfJoining: '2015-07-01', employmentType: 'Permanent',
    qualification: 'M.Sc. Physics, B.Ed', experience: '9 Years',
    salary: '₹ 55,000 / month',
    contact: '+91 8876543211', email: 'michael.c@viddarpan.edu.in', altContact: '',
    address: '12-B, Mayur Vihar Phase 1', city: 'Delhi', state: 'Delhi', pincode: '110091',
    bankName: 'HDFC Bank', accountNo: '50100012345678', ifsc: 'HDFC0001234', pan: 'FGHIJ5678K',
  },
];

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || <span className="text-slate-300 italic">Not provided</span>}</p>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
        <span className="text-slate-400">{icon}</span>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, type = 'text', placeholder, span = 1 }: {
  label: string; type?: string; placeholder?: string; span?: 1 | 2;
}) {
  const baseClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 bg-white transition-colors";
  return (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <input type={type} placeholder={placeholder} className={baseClass} />
    </div>
  );
}

function FormSelect({ label, options, span = 1 }: {
  label: string; options: string[]; span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 bg-white">
        <option value="">Select…</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Student Detail Drawer ────────────────────────────────────────────────────

function StudentDetailDrawer({
  student, onClose, onSave
}: { student: StudentRecord; onClose: () => void; onSave: (updated: StudentRecord) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<StudentRecord>({ ...student });

  const handleSave = () => {
    onSave(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...student });
    setIsEditing(false);
  };

  // Reusable editable field
  const EField = ({ label, field, span = 1, type = 'text' }: {
    label: string; field: keyof StudentRecord; span?: 1 | 2; type?: string;
  }) => (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      {isEditing ? (
        <input
          type={type}
          value={draft[field] as string}
          onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
          className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
      ) : (
        <p className="text-sm font-medium text-slate-800">
          {(draft[field] as string) || <span className="text-slate-300 italic">Not provided</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div className="flex-1 bg-black/30" onClick={isEditing ? undefined : onClose} />
      <div className="w-[520px] bg-white shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {draft.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{draft.name}</p>
              <p className="text-xs text-slate-500">{draft.admNo} · Class {draft.class}-{draft.section}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                  <RotateCcw className="w-3 h-3" /> Discard
                </button>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
                  <Check className="w-3 h-3" /> Save Changes
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        {/* Mode indicator */}
        {isEditing && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 shrink-0">
            <p className="text-xs font-semibold text-blue-700">✏️ You are editing this record. Changes will be saved when you click "Save Changes".</p>
          </div>
        )}
        {/* Badges */}
        <div className="px-6 py-2 border-b border-slate-100 flex gap-2 flex-wrap shrink-0">
          {[draft.category, draft.bloodGroup, draft.religion, draft.gender].map(b => (
            <span key={b} className="px-2 py-0.5 text-[10px] font-semibold border border-slate-200 rounded text-slate-600 bg-slate-50">{b}</span>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Section title="Personal Information" icon={<Hash className="w-3.5 h-3.5" />}>
            <EField label="Date of Birth" field="dob" type="date" />
            <EField label="Gender" field="gender" />
            <EField label="Blood Group" field="bloodGroup" />
            <EField label="Nationality" field="nationality" />
            <EField label="Religion" field="religion" />
            <EField label="Caste / Community" field="caste" />
            <EField label="Category" field="category" />
            <EField label="Mother Tongue" field="motherTongue" />
            <EField label="Aadhaar No." field="aadhaar" />
          </Section>

          <Section title="Academic Information" icon={<GraduationCap className="w-3.5 h-3.5" />}>
            <EField label="Admission No." field="admNo" />
            <EField label="Roll No." field="rollNo" />
            <EField label="Class" field="class" />
            <EField label="Section" field="section" />
            <EField label="Date of Admission" field="dateOfAdmission" type="date" />
            <EField label="Previous School" field="previousSchool" span={2} />
          </Section>

          <Section title="Current Address" icon={<Home className="w-3.5 h-3.5" />}>
            <EField label="Street Address" field="address" span={2} />
            <EField label="City" field="city" />
            <EField label="State" field="state" />
            <EField label="Pincode" field="pincode" />
          </Section>

          <Section title="Father's Details" icon={<Briefcase className="w-3.5 h-3.5" />}>
            <EField label="Full Name" field="fatherName" />
            <EField label="Occupation" field="fatherOccupation" />
            <EField label="Mobile" field="fatherContact" />
            <EField label="Email" field="fatherEmail" />
            <EField label="Annual Income" field="fatherIncome" />
          </Section>

          <Section title="Mother's Details" icon={<Heart className="w-3.5 h-3.5" />}>
            <EField label="Full Name" field="motherName" />
            <EField label="Occupation" field="motherOccupation" />
            <EField label="Mobile" field="motherContact" />
            <EField label="Email" field="motherEmail" />
          </Section>

          <Section title="Guardian Details" icon={<Shield className="w-3.5 h-3.5" />}>
            <EField label="Name" field="guardianName" />
            <EField label="Relation" field="guardianRelation" />
            <EField label="Contact" field="guardianContact" />
          </Section>
        </div>
      </div>
    </div>
  );
}

// ─── Teacher Detail Drawer ────────────────────────────────────────────────────

function TeacherDetailDrawer({
  teacher, onClose, onSave
}: { teacher: TeacherRecord; onClose: () => void; onSave: (updated: TeacherRecord) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<TeacherRecord>({ ...teacher });

  const handleSave = () => {
    onSave(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...teacher });
    setIsEditing(false);
  };

  const EField = ({ label, field, span = 1, type = 'text' }: {
    label: string; field: keyof TeacherRecord; span?: 1 | 2; type?: string;
  }) => (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      {isEditing ? (
        <input
          type={type}
          value={draft[field] as string}
          onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
          className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
      ) : (
        <p className="text-sm font-medium text-slate-800">
          {(draft[field] as string) || <span className="text-slate-300 italic">Not provided</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div className="flex-1 bg-black/30" onClick={isEditing ? undefined : onClose} />
      <div className="w-[520px] bg-white shadow-2xl flex flex-col border-l border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
              {draft.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{draft.name}</p>
              <p className="text-xs text-slate-500">{draft.empId} · {draft.designation}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                  <RotateCcw className="w-3 h-3" /> Discard
                </button>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
                  <Check className="w-3 h-3" /> Save Changes
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 shrink-0">
            <p className="text-xs font-semibold text-blue-700">✏️ You are editing this record. Changes will be saved when you click "Save Changes".</p>
          </div>
        )}
        <div className="px-6 py-2 border-b border-slate-100 flex gap-2 flex-wrap shrink-0">
          {[draft.department, draft.employmentType, draft.category, draft.bloodGroup].map(b => (
            <span key={b} className="px-2 py-0.5 text-[10px] font-semibold border border-slate-200 rounded text-slate-600 bg-slate-50">{b}</span>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Section title="Personal Information" icon={<Hash className="w-3.5 h-3.5" />}>
            <EField label="Full Name" field="name" span={2} />
            <EField label="Date of Birth" field="dob" type="date" />
            <EField label="Gender" field="gender" />
            <EField label="Blood Group" field="bloodGroup" />
            <EField label="Nationality" field="nationality" />
            <EField label="Religion" field="religion" />
            <EField label="Caste" field="caste" />
            <EField label="Category" field="category" />
            <EField label="Aadhaar No." field="aadhaar" />
            <EField label="PAN" field="pan" />
          </Section>

          <Section title="Employment Details" icon={<Briefcase className="w-3.5 h-3.5" />}>
            <EField label="Employee ID" field="empId" />
            <EField label="Designation" field="designation" />
            <EField label="Department" field="department" />
            <EField label="Subject" field="subject" />
            <EField label="Date of Joining" field="dateOfJoining" type="date" />
            <EField label="Employment Type" field="employmentType" />
            <EField label="Qualification" field="qualification" span={2} />
            <EField label="Experience" field="experience" />
            <EField label="Monthly Salary" field="salary" />
          </Section>

          <Section title="Contact Information" icon={<Phone className="w-3.5 h-3.5" />}>
            <EField label="Primary Mobile" field="contact" />
            <EField label="Alternate Mobile" field="altContact" />
            <EField label="Email" field="email" span={2} />
          </Section>

          <Section title="Residential Address" icon={<Home className="w-3.5 h-3.5" />}>
            <EField label="Street Address" field="address" span={2} />
            <EField label="City" field="city" />
            <EField label="State" field="state" />
            <EField label="Pincode" field="pincode" />
          </Section>

          <Section title="Bank Details" icon={<CreditCard className="w-3.5 h-3.5" />}>
            <EField label="Bank Name" field="bankName" span={2} />
            <EField label="Account No." field="accountNo" span={2} />
            <EField label="IFSC Code" field="ifsc" />
          </Section>
        </div>
      </div>
    </div>
  );
}

// ─── Add Student Modal ───────────────────────────────────────────────────────

function AddStudentModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = ['Personal', 'Academic', 'Address', 'Parent / Guardian'];
  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-800">Add New Student</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Step tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white shrink-0">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                step === i ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField label="Full Name" placeholder="As per birth certificate" span={2} />
              <FormField label="Date of Birth" type="date" />
              <FormSelect label="Gender" options={['Male', 'Female', 'Other']} />
              <FormSelect label="Blood Group" options={['A+','A-','B+','B-','O+','O-','AB+','AB-']} />
              <FormSelect label="Religion" options={['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other']} />
              <FormField label="Caste / Community" placeholder="e.g. Brahmin, Rajput" />
              <FormSelect label="Category" options={['General','OBC','SC','ST','EWS']} />
              <FormField label="Nationality" placeholder="Indian" />
              <FormField label="Mother Tongue" placeholder="e.g. Hindi, Gujarati" />
              <FormField label="Aadhaar Number" placeholder="XXXX XXXX XXXX" />
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField label="Admission No." placeholder="VD-2024-XXX" />
              <FormField label="Roll Number" placeholder="01" />
              <FormSelect label="Class" options={['1','2','3','4','5','6','7','8','9','10','11','12']} />
              <FormSelect label="Section" options={['A','B','C','D','Sci','Com','Arts']} />
              <FormField label="Date of Admission" type="date" />
              <FormField label="Previous School" placeholder="School name" span={2} />
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField label="Street / Colony / House No." span={2} placeholder="Full address" />
              <FormField label="City" placeholder="City name" />
              <FormField label="State" placeholder="State" />
              <FormField label="Pincode" placeholder="110001" />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Father's Details</p>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  <FormField label="Father's Full Name" placeholder="Full name" />
                  <FormField label="Occupation" placeholder="e.g. Doctor, Engineer" />
                  <FormField label="Mobile No." type="tel" placeholder="+91 XXXXX XXXXX" />
                  <FormField label="Email" type="email" placeholder="email@domain.com" />
                  <FormField label="Annual Income" placeholder="₹ 0,00,000 p.a." />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Mother's Details</p>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  <FormField label="Mother's Full Name" placeholder="Full name" />
                  <FormField label="Occupation" placeholder="e.g. Homemaker, Teacher" />
                  <FormField label="Mobile No." type="tel" placeholder="+91 XXXXX XXXXX" />
                  <FormField label="Email" type="email" placeholder="email@domain.com" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Guardian Details (if different)</p>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  <FormField label="Guardian Name" placeholder="Full name" />
                  <FormField label="Relation to Student" placeholder="e.g. Uncle, Grandparent" />
                  <FormField label="Contact No." type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-30 transition-colors"
          >
            Back
          </button>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-slate-800' : 'bg-slate-200'}`} />
            ))}
          </div>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
              Next
            </button>
          ) : (
            <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
              Save Student
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Teacher Modal ───────────────────────────────────────────────────────

function AddTeacherModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = ['Personal', 'Employment', 'Contact & Address', 'Bank Details'];
  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-800">Add New Staff Member</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex border-b border-slate-200 px-6 bg-white shrink-0">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                step === i ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField label="Full Name" placeholder="As per ID proof" span={2} />
              <FormField label="Date of Birth" type="date" />
              <FormSelect label="Gender" options={['Male', 'Female', 'Other']} />
              <FormSelect label="Blood Group" options={['A+','A-','B+','B-','O+','O-','AB+','AB-']} />
              <FormSelect label="Religion" options={['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other']} />
              <FormField label="Caste" placeholder="e.g. General" />
              <FormSelect label="Category" options={['General','OBC','SC','ST','EWS']} />
              <FormField label="Aadhaar Number" placeholder="XXXX XXXX XXXX" />
              <FormField label="PAN Number" placeholder="ABCDE1234F" />
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField label="Employee ID" placeholder="EMP-XXX" />
              <FormSelect label="Designation" options={['PRT','TGT','PGT','HOD','Vice Principal','Principal']} />
              <FormSelect label="Department" options={['Mathematics','Science','English','Hindi','Social Science','Arts','Commerce','Physical Education']} />
              <FormField label="Subject Taught" placeholder="Main subject" />
              <FormField label="Date of Joining" type="date" />
              <FormSelect label="Employment Type" options={['Permanent','Contractual','Part-Time','Visiting']} />
              <FormField label="Qualification" placeholder="M.Sc., B.Ed." span={2} />
              <FormField label="Teaching Experience" placeholder="e.g. 5 Years" />
              <FormField label="Monthly Salary (₹)" placeholder="00,000" />
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField label="Primary Mobile" type="tel" placeholder="+91 XXXXX XXXXX" />
              <FormField label="Alternate Mobile" type="tel" placeholder="+91 XXXXX XXXXX" />
              <FormField label="Official Email" type="email" placeholder="name@viddarpan.edu.in" span={2} />
              <FormField label="Street / Colony / House No." placeholder="Full address" span={2} />
              <FormField label="City" placeholder="City name" />
              <FormField label="State" placeholder="State" />
              <FormField label="Pincode" placeholder="110001" />
            </div>
          )}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <FormField label="Bank Name" placeholder="e.g. State Bank of India" span={2} />
              <FormField label="Account Number" placeholder="XXXXXXXXXXX" span={2} />
              <FormField label="IFSC Code" placeholder="SBIN0001234" />
              <FormField label="Branch Name" placeholder="Branch city" />
            </div>
          )}
        </div>
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-30 transition-colors"
          >
            Back
          </button>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-slate-800' : 'bg-slate-200'}`} />
            ))}
          </div>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
              Next
            </button>
          ) : (
            <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
              Save Staff Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminManageRecords() {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [students, setStudents] = useState<StudentRecord[]>(mockStudents);
  const [teachers, setTeachers] = useState<TeacherRecord[]>(mockTeachers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.includes(searchQuery) ||
    s.admNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" /> Manage Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete institutional registry for students and staff
          </p>
        </div>
        {activeTab === 'students' ? (
          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Enrol Student
          </button>
        ) : (
          <button
            onClick={() => setIsTeacherModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Add Staff
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'students' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          onClick={() => { setActiveTab('students'); setSearchQuery(''); }}
        >
          <GraduationCap className="w-4 h-4" /> Students
          <span className="ml-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{students.length}</span>
        </button>
        <button
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'teachers' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          onClick={() => { setActiveTab('teachers'); setSearchQuery(''); }}
        >
          <Briefcase className="w-4 h-4" /> Staff & Teachers
          <span className="ml-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{teachers.length}</span>
        </button>
      </div>

      {/* Table container */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-230px)] min-h-[450px]">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-200 flex gap-3 items-center bg-white">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'students' ? 'Search by name, class, adm. no…' : 'Search by name, subject, ID…'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-300 bg-white"
            />
          </div>
          <span className="text-xs text-slate-400 ml-auto">
            {activeTab === 'students' ? filteredStudents.length : filteredTeachers.length} records
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'students' ? (
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Adm. No / Class</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category & Religion</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Father / Guardian</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors group cursor-pointer" onClick={() => setSelectedStudent(s)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                          <div className="text-xs text-slate-400">DOB: {s.dob}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-mono text-slate-600">{s.admNo}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Class {s.class}-{s.section} · Roll {s.rollNo}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold border border-slate-200 rounded text-slate-600 bg-white mr-1">{s.category}</span>
                      <span className="text-xs text-slate-500">{s.religion}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-slate-800">{s.fatherName}</div>
                      <div className="text-xs text-slate-400">{s.fatherOccupation}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{s.fatherContact}</td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedStudent(s)} className="p-1.5 text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-200 rounded-md transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-200 rounded-md transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setStudents(students.filter(x => x.id !== s.id))} className="p-1.5 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-200 rounded-md transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No students found matching your search.</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Emp. ID / Type</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dept. / Subject</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qualification</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors group cursor-pointer" onClick={() => setSelectedTeacher(t)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                          <div className="text-xs text-slate-400">{t.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-mono text-slate-600">{t.empId}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{t.employmentType}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-slate-800">{t.department}</div>
                      <div className="text-xs text-slate-400">{t.subject}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{t.qualification}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-slate-700">{t.contact}</div>
                      <div className="text-xs text-slate-400">{t.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedTeacher(t)} className="p-1.5 text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-200 rounded-md transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-200 rounded-md transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setTeachers(teachers.filter(x => x.id !== t.id))} className="p-1.5 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-200 rounded-md transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTeachers.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No staff members found matching your search.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals & Drawers */}
      {isStudentModalOpen && <AddStudentModal onClose={() => setIsStudentModalOpen(false)} />}
      {isTeacherModalOpen && <AddTeacherModal onClose={() => setIsTeacherModalOpen(false)} />}
      {selectedStudent && <StudentDetailDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onSave={(updated) => {
          setStudents(students.map(s => s.id === updated.id ? updated : s));
          setSelectedStudent(updated);
        }}
      />}
      {selectedTeacher && <TeacherDetailDrawer
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        onSave={(updated) => {
          setTeachers(teachers.map(t => t.id === updated.id ? updated : t));
          setSelectedTeacher(updated);
        }}
      />}
    </div>
  );
}