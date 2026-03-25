import React, { useState } from 'react';
import { X, Building2, User, Lock, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'teacher' | 'admin') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'admin@viddarpan.com' && password === 'password') {
      onLogin('admin');
    } else if (username === 'teacher@viddarpan.com' && password === 'password') {
      onLogin('teacher');
    } else {
      setError('Invalid credentials. Try admin@viddarpan.com or teacher@viddarpan.com with password "password".');
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-800">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0f172a] overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 h-full w-full">
          <h1 className="text-[32px] font-bold text-white mb-3">The Digital Registrar</h1>
          <p className="text-[15px] text-slate-300 mb-10 max-w-sm leading-relaxed">
            Empowering modern educational institutions with institutional authority and digital efficiency.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-emerald-400"></div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Portal V2.4</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[55%] flex flex-col relative">
        {/* Close Button */}
        <div className="absolute top-6 right-6">
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <X className="w-3.5 h-3.5" />
            Close
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 w-full max-w-[440px] mx-auto">
          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-[#0f172a] mb-1.5">VidDarpan</h2>
            <p className="text-[15px] text-slate-500">Sign in to your institutional dashboard</p>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Admin: <strong>admin@viddarpan.com</strong> / password</li>
                <li>Teacher: <strong>teacher@viddarpan.com</strong> / password</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* School ID */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold text-[#0f172a] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                School ID
              </label>
              <input 
                type="text" 
                placeholder="e.g. DPS-DEL-001" 
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white text-sm placeholder:text-slate-400"
              />
            </div>

            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold text-[#0f172a] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                Username / Email
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@viddarpan.com" 
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white text-sm placeholder:text-slate-400"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#0f172a] uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  Password
                </label>
                <a href="#" className="text-[11px] font-bold text-[#0f172a] hover:text-blue-600 transition-colors">
                  Forgot Password?
                </a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white text-sm placeholder:text-slate-400"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs font-medium mt-2">
                {error}
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center gap-2.5 pt-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-slate-300 text-[#0f172a] focus:ring-[#0f172a]"
              />
              <label htmlFor="remember" className="text-[13px] text-slate-600">
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg font-medium text-[15px] transition-colors mt-2"
            >
              Login
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-slate-50 rounded-lg p-3.5 flex items-start gap-3 border border-slate-100">
            <div className="bg-orange-500 rounded-full p-0.5 mt-0.5 shrink-0">
              <Info className="w-3 h-3 text-white" />
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Don't have an account? <span className="font-semibold text-[#0f172a]">Contact your School Administrator</span> to receive your login credentials.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em]">
              ERP.VIDDARPAN.COM
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 right-6 hidden md:block">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            © 2024 VIDDARPAN. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
}
