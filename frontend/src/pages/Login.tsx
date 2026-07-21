import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Lock, Mail, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('demo@company.com');
  const [password, setPassword] = useState('Demo@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email.toLowerCase() === 'demo@company.com' && password === 'Demo@123') {
        onLoginSuccess(email);
      } else {
        setError('Invalid email or password. Please use the demo credentials.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-transparent">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-500/20 rounded-full blur-[150px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-fuchsia-400/10 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
        id="login-card-container"
      >
        <div className="bg-white p-8 md:p-10 rounded border border-slate-200 shadow-xl relative overflow-hidden">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded bg-blue-600 flex items-center justify-center mb-5 shadow-sm">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              NexHire
            </h2>
            <p className="text-blue-600 text-xs mt-1.5 tracking-widest uppercase font-bold font-mono">
              Internal Platform
            </p>
          </div>

          <div className="mb-8 text-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Welcome Back</h3>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              Please log in to manage your recruitment pipeline.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-600 tracking-wider uppercase" htmlFor="email-input">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded text-sm py-2 pl-11 pr-4 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-600 tracking-wider uppercase" htmlFor="password-input">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded text-sm py-2 pl-11 pr-11 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-slate-500 group-hover:text-slate-800 transition-colors select-none">
                  Remember this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          {/* Test Credentials Panel */}
          <div className="mt-8 pt-5 border-t border-slate-200 text-left">
            <h4 className="text-xs font-bold text-blue-600 flex items-center space-x-1.5 uppercase tracking-wider mb-2.5 font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Demo Access Credentials</span>
            </h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="text-slate-800 font-semibold select-all">demo@company.com</span>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="text-slate-800 font-semibold select-all">Demo@123</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white p-6 rounded border border-slate-200 text-center shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-850 font-display">Credential Reset</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              For security, this application uses fixed internal credentials. Please use the preloaded demo credentials:
            </p>
            <div className="my-4 p-3 bg-slate-50 rounded-xl text-left text-xs font-mono text-slate-500 space-y-1 border border-slate-200">
              <div>Email: <span className="text-blue-600 font-semibold">demo@company.com</span></div>
              <div>Password: <span className="text-blue-600 font-semibold">Demo@123</span></div>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors border border-slate-200 cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
