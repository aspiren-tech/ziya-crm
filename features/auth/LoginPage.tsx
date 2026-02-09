import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Github, Chrome, Linkedin, Globe, LayoutDashboard, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/shared/ui/Button';

const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative flex items-center ${className}`}>
    <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path
        d="M20,45 L35,15 L50,45 M25,35 L45,35 M60,15 L60,45 M55,15 L65,15"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="45" r="5" fill="#06b6d4" />
      <circle cx="65" cy="15" r="5" fill="#a855f7" />
    </svg>
    <div className="ml-2 flex flex-col leading-none">
      <span className="text-xl font-light text-slate-400">ziya</span>
      <span className="text-3xl font-black text-slate-800 tracking-tighter">CRM</span>
      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">Biz Automations</span>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading: isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Keep location for 'from'

  const from = location.state?.from?.pathname || '/'; // Keep 'from'

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Left side - Dynamic Branding Sidebar */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-slate-900 relative overflow-hidden group">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#06b6d41a,transparent_40%),radial-gradient(circle_at_70%_60%,#a855f71a,transparent_40%)]" />
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

        {/* Abstract Mesh Overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-4 group/logo cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover/logo:scale-110 transition-transform duration-500 rotate-3 group-hover/logo:rotate-0">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tighter">ZIYA <span className="text-cyan-400">CRM</span></span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">Intelligence First</span>
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              New Version 4.0 Live
            </div>
            <h1 className="text-6xl font-black text-white leading-[1.05] tracking-tight mb-8">
              Automate your <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Business</span> Journey.
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              The next-generation CRM with built-in AI for modern sales teams and automation enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
              <p className="text-2xl font-black text-white mb-1">99%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fast Setup</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
              <p className="text-2xl font-black text-white mb-1">24/7</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Support</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
              <p className="text-2xl font-black text-white mb-1">50k+</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Automations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        {/* Subtle grid pattern for light mode */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#a855f7 1.5px, transparent 1.5px), linear-gradient(90deg, #a855f7 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

        <div className="w-full max-w-lg relative z-10 animate-slideUp">
          <div className="mb-12 flex flex-col items-center lg:items-start">
            <Logo className="mb-8" />
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h2>
            <p className="text-slate-500 font-semibold">Enter your credentials to manage your workflow.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <p className="text-sm font-bold text-rose-600 leading-tight">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-500/20 focus:ring-4 focus:ring-purple-500/5 rounded-2xl font-semibold text-slate-800 transition-all outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2 px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-purple-500/20 focus:ring-4 focus:ring-purple-500/5 rounded-2xl font-semibold text-slate-800 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-purple-600 focus:ring-purple-500/20 transition-all" />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Keep me logged in</span>
              </label>
              <a href="#" className="text-sm font-black text-purple-600 hover:text-purple-700 tracking-tight underline-offset-4 hover:underline transition-all">Forgot password?</a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-purple-500/25 active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center px-1"><div className="w-full border-t-2 border-slate-100"></div></div>
              <span className="relative bg-white px-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Enterprise Login</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center h-14 bg-white border-2 border-slate-100 hover:border-purple-500/30 hover:bg-slate-50 rounded-2xl transition-all group active:scale-[0.98]">
                <Chrome className="w-6 h-6 mr-3 text-slate-600 group-hover:text-purple-600 transition-colors" />
                <span className="font-black text-slate-700 text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center h-14 bg-white border-2 border-slate-100 hover:border-purple-500/30 hover:bg-slate-50 rounded-2xl transition-all group active:scale-[0.98]">
                <Linkedin className="w-6 h-6 mr-3 text-slate-600 group-hover:text-purple-600 transition-colors" />
                <span className="font-black text-slate-700 text-sm">LinkedIn</span>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 w-full text-center">
          <p className="text-xs font-bold text-slate-400">&copy; 2025 ZIYA CRM INC. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
