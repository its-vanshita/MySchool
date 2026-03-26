'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  PlayCircle,
  TrendingUp,
  Wallet,
  UserCheck,
  FileCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Smartphone,
  Key,
  Users,
  Menu,
  X,
  Building2,
  User,
  Lock,
  Info
} from 'lucide-react';

// --- Components ---

const Logo = () => (
  <a href="#" className="flex items-center gap-2">
    <img 
      src="/logo.svg" 
      alt="VidDarpan Logo" 
      className="h-10 md:h-12 object-contain" 
    />
    <div className="flex flex-col">
      <span className="font-bold text-xl md:text-2xl text-[#1a2b4c] leading-none tracking-tight">VidDarpan</span>
      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Academic ERP</span>
    </div>
  </a>
);

const Navbar = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between py-4 px-6 md:px-12 lg:px-24 bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Logo />
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-[#1a2b4c]" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="#features" className="hover:text-[#1a2b4c] transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-[#1a2b4c] transition-colors">How it Works</a>
        <a href="#platforms" className="hover:text-[#1a2b4c] transition-colors">Platforms</a>
        <a href="#contact" className="hover:text-[#1a2b4c] transition-colors">Contact</a>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <button onClick={onLoginClick} className="text-sm font-medium text-gray-600 hover:text-[#1a2b4c] transition-colors">Portal Login</button>
        <a href="#contact" className="bg-[#1a2b4c] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#111d33] transition-colors">
          Get Started
        </a>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden w-full flex flex-col gap-4 pt-6 pb-4 border-t border-gray-100 mt-4 animate-in slide-in-from-top-4">
          <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium px-2 hover:text-[#1a2b4c]">Features</a>
          <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium px-2 hover:text-[#1a2b4c]">How it Works</a>
          <a href="#platforms" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium px-2 hover:text-[#1a2b4c]">Platforms</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium px-2 hover:text-[#1a2b4c]">Contact</a>
          <div className="h-px bg-gray-100 my-2"></div>
          <button onClick={() => { setIsOpen(false); onLoginClick(); }} className="text-left text-gray-600 font-medium px-2 hover:text-[#1a2b4c]">Portal Login</button>
          <a href="#contact" onClick={() => setIsOpen(false)} className="bg-[#1a2b4c] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#111d33] transition-colors w-full mt-2 text-center">
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section className="bg-[#f8fafc] pt-16 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2b4c] leading-tight mb-6">
          One App. Complete Control. Infinite Possibilities.
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          VidDarpan is the ultimate School ERP bridging the gap between administration, classrooms, and homes. With powerful web dashboards for staff and a unified mobile app for everyone, connect securely using a Unique ID.
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <button className="bg-[#1a2b4c] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#111d33] transition-colors">
            Book a Demo
          </button>
          <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-[#1a2b4c] transition-colors px-4 py-3">
            <PlayCircle size={20} />
            Watch How it Works
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                className="w-10 h-10 rounded-full border-2 border-white"
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt="User avatar"
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">Trusted by 200+ Institutions across India</span>
        </div>
      </div>
      <div className="relative">
        <div className="bg-emerald-800 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3"
            alt="Dashboard Preview"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>
        {/* Floating Badge */}
        <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3 md:gap-4 border border-gray-100">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wider">Efficiency Boost</p>
            <p className="text-lg md:text-xl font-bold text-[#1a2b4c]">40% Faster</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      icon: <Key size={24} />,
      title: "Secure Unique ID Access",
      description: "One platform, personalized experiences. Every admin, teacher, and parent gets a Unique ID for secure, role-based access."
    },
    {
      icon: <Smartphone size={24} />,
      title: "Web & Mobile Platforms",
      description: "Tailored access for every role. Admins and teachers get powerful web dashboards, while parents, teachers, and admins stay connected via our native mobile app."
    },
    {
      icon: <Wallet size={24} />,
      title: "Comprehensive ERP",
      description: "From automated fee collection and smart attendance to complex exam grading, handle all operations in one place."
    },
    {
      icon: <Users size={24} />,
      title: "Unified Communication",
      description: "Bridge the communication gap. Send instant updates, circulars, and notifications directly to parents' smartphones."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-[#f8fafc] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b4c] mb-4">Everything Your School Needs</h2>
          <p className="text-gray-600 text-lg">A powerful, all-in-one ecosystem designed to simplify administration and enhance connectivity.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center text-[#1a2b4c] mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1a2b4c] mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 px-6 md:px-12 lg:px-24 bg-white border-t border-gray-100 scroll-mt-20">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b4c] mb-4">How VidDarpan Works</h2>
        <p className="text-gray-600 text-lg">A seamless onboarding experience for your entire institution.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-12 relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-10"></div>
        
        <div className="text-center relative">
          <div className="w-24 h-24 mx-auto bg-[#1a2b4c] text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-[0_0_0_8px_white]">1</div>
          <h3 className="text-xl font-bold text-[#1a2b4c] mb-3">School Registration</h3>
          <p className="text-gray-600">The institution signs up and configures their digital campus on our secure cloud platform.</p>
        </div>
        <div className="text-center relative">
          <div className="w-24 h-24 mx-auto bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-[0_0_0_8px_white]">2</div>
          <h3 className="text-xl font-bold text-[#1a2b4c] mb-3">Unique IDs Generated</h3>
          <p className="text-gray-600">VidDarpan automatically generates secure, role-based Unique IDs for every admin, teacher, and parent.</p>
        </div>
        <div className="text-center relative">
          <div className="w-24 h-24 mx-auto bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-[0_0_0_8px_white]">3</div>
          <h3 className="text-xl font-bold text-[#1a2b4c] mb-3">Everyone Connects</h3>
          <p className="text-gray-600">Users download the app or visit the website, log in with their ID, and access their personalized dashboard.</p>
        </div>
      </div>
    </div>
  </section>
);

const RoleSection = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'principals', label: 'For Principals' },
    { id: 'teachers', label: 'For Teachers' },
    { id: 'parents', label: 'For Parents' }
  ];

  const content = {
    principals: {
      tag: "WEB & MOBILE ADMIN PORTAL",
      title: "Institutional Oversight, Simplified.",
      desc: "Access your Web Dashboard or Mobile App with your Admin ID. Get a bird's eye view of the entire campus ecosystem, monitor financial health, and track academic trends anywhere.",
      bullets: ["Real-time Revenue Analytics", "Staff Performance Monitoring", "Compliance & Documentation Vault"]
    },
    teachers: {
      tag: "WEB & MOBILE TEACHER HUB",
      title: "Focus on Teaching, Not Paperwork.",
      desc: "Use the Web Dashboard for heavy lifting or the Mobile App on the go. Your Teacher ID unlocks tools that automate grading, attendance, and lesson planning.",
      bullets: ["Automated Grading System", "Digital Lesson Planner", "Direct Parent Communication"]
    },
    parents: {
      tag: "EXCLUSIVE MOBILE APP",
      title: "Stay Connected to Your Child's Journey.",
      desc: "Using their secure Parent ID on our dedicated Mobile App, parents get real-time access to their child's academic progress, attendance records, and school announcements.",
      bullets: ["Instant Attendance Alerts", "Digital Report Cards", "Secure Fee Payments"]
    }
  };

  const activeContent = content[activeTab as keyof typeof content];

  return (
    <section id="platforms" className="py-24 px-6 md:px-12 lg:px-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-16 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="bg-gray-100 p-1 rounded-full inline-flex whitespace-nowrap min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1a2b4c] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1a2b4c]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="bg-[#113a47] rounded-3xl p-8 shadow-2xl order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
              alt="Dashboard"
              className="rounded-xl shadow-lg w-full object-cover opacity-90"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">{activeContent.tag}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2b4c] mb-6 leading-tight">
              {activeContent.title}
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {activeContent.desc}
            </p>
            <ul className="space-y-4">
              {activeContent.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section id="contact" className="py-24 px-6 md:px-12 lg:px-24 bg-white scroll-mt-20">
    <div className="max-w-5xl mx-auto bg-[#1a2b4c] rounded-3xl p-12 md:p-16 text-center shadow-2xl">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
        Ready to transform your administration?
      </h2>
      <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
        Join the elite schools in India running on VidDarpan's intelligent ecosystem. No upfront costs, no hidden fees.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="bg-white text-[#1a2b4c] px-8 py-3.5 rounded-lg font-bold hover:bg-gray-50 transition-colors">
          Start Free Trial
        </button>
        <button className="bg-transparent border border-blue-400 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-blue-900/30 transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#1a2b4c] text-white pt-20 pb-10 px-6 md:px-12 lg:px-24">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center mb-6">
            <img 
              src="/logo-white.svg" 
              alt="VidDarpan Logo" 
              className="h-10 object-contain" 
            />
            <div className="ml-3">
              <span className="font-bold text-xl text-white tracking-tight">VidDarpan</span>
              <p className="text-[9px] text-blue-300 font-bold uppercase tracking-[0.2em] leading-none">Academic ERP</p>
            </div>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed mb-6 pr-4 lg:pr-12">
            The digital ledger for modern institutions, bringing authority and efficiency to academic management across the nation.
          </p>
          <div className="flex gap-4">
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Modules</h4>
          <ul className="space-y-4 text-sm text-blue-200">
            <li><a href="#" className="hover:text-white transition-colors">Admissions & CRM</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Fee Management</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Academics & Exams</a></li>
            <li><a href="#" className="hover:text-white transition-colors">HR & Payroll</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Transport & Library</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Stakeholders</h4>
          <ul className="space-y-4 text-sm text-blue-200">
            <li><a href="#" className="hover:text-white transition-colors">School Admins</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Teachers & Staff</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Parents</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Students</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Resources</h4>
          <ul className="space-y-4 text-sm text-blue-200">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
            <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Contact</h4>
          <ul className="space-y-4 text-sm text-blue-200">
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-1 flex-shrink-0" />
              <span>support@viddarpan.com</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-1 flex-shrink-0" />
              <span>+91 1800-VID-DARPAN</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-1 flex-shrink-0" />
              <span>Gurugram, HR - 122018</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-blue-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300">
        <p>© 2024 VidDarpan. The Digital Registrar for Modern Institutions.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-white transition-colors">COMPLIANCE & SECURITY</a>
        </div>
      </div>
    </div>
  </footer>
);

const LoginPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white animate-in fade-in duration-300 overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a2b4c] transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-100"
      >
        <X size={16} /> Close
      </button>

      {/* Left Side - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#111d33] flex-col justify-end p-8 lg:p-16 text-white h-full">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" 
            alt="Office" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#111d33]/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">The Digital Registrar</h2>
          <p className="text-blue-200 text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
            Empowering modern educational institutions with institutional authority and digital efficiency.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-8 h-1 bg-emerald-400"></div>
            <span className="tracking-[0.2em] text-xs font-semibold text-gray-300">PORTAL V2.4</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center p-6 md:p-8 lg:p-12 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1a2b4c] mb-2">VidDarpan</h2>
          <p className="text-gray-500 mb-6 text-base">Sign in to your institutional dashboard</p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                <Building2 size={14} /> School ID
              </label>
              <input 
                type="text" 
                placeholder="e.g. DPS-DEL-001" 
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#1a2b4c] focus:bg-white focus:ring-2 focus:ring-[#1a2b4c]/20 rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                <User size={14} /> Username / Email
              </label>
              <input 
                type="text" 
                placeholder="admin@school.edu" 
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#1a2b4c] focus:bg-white focus:ring-2 focus:ring-[#1a2b4c]/20 rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <Lock size={14} /> Password
                </label>
                <a href="#" className="text-xs font-bold text-[#1a2b4c] hover:underline">Forgot Password?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#1a2b4c] focus:bg-white focus:ring-2 focus:ring-[#1a2b4c]/20 rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#1a2b4c] focus:ring-[#1a2b4c]" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember this device</label>
            </div>

            <button className="w-full bg-[#0f1f3d] text-white font-medium py-3 rounded-xl hover:bg-[#1a2b4c] transition-colors mt-2 shadow-lg shadow-[#0f1f3d]/20">
              Login
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex gap-3 items-start bg-blue-50/50 p-3.5 rounded-xl">
              <div className="text-orange-500 mt-0.5 shrink-0">
                <Info size={18} className="fill-orange-500 text-white" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Don't have an account? <span className="font-semibold text-gray-900">Contact your School Administrator</span> to receive your login credentials.
              </p>
            </div>
          </div>

          <div className="mt-8 text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase text-center md:text-left">
            ERP.VIDDARPAN.COM
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 text-[10px] font-bold tracking-wider text-gray-300 uppercase hidden md:block">
        © 2024 VIDDARPAN. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
};

export default function App() {
  const [activeRoleTab, setActiveRoleTab] = useState('principals');
  const [currentRoute, setCurrentRoute] = useState<'home' | 'login'>('home');

  if (currentRoute === 'login') {
    return <LoginPage onBack={() => setCurrentRoute('home')} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar onLoginClick={() => setCurrentRoute('login')} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <RoleSection activeTab={activeRoleTab} setActiveTab={setActiveRoleTab} />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
