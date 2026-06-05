import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(email, password);
    } catch (err) {
      // Errors are toasted inside AuthContext
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-950 px-4 py-12 relative">
      <div className="absolute top-[25%] left-[-10%] w-[35%] h-[35%] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md glass-card p-8 md:p-10 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to manage your job listings or applications</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full bg-slate-950/80 border text-sm text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-500/50 focus:ring-rose-500/20'
                    : 'border-slate-800/80 focus:border-primary-500/55 focus:ring-primary-500/20'
                }`}
              />
            </div>
            {errors.email && <p className="text-rose-400 text-xs mt-1.5">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-950/80 border text-sm text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-rose-500/50 focus:ring-rose-500/20'
                    : 'border-slate-800/80 focus:border-primary-500/55 focus:ring-primary-500/20'
                }`}
              />
            </div>
            {errors.password && <p className="text-rose-400 text-xs mt-1.5">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/35 hover:shadow-primary-500/40 mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8 border-t border-slate-800/60 pt-6">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 font-semibold inline-flex items-center gap-0.5 transition-colors"
            >
              <span>Create account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
