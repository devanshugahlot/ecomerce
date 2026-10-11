import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in both email and password', 'error');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20 space-y-8 min-h-[70vh]">
      <SEO title="Sign In" description="Log into your Hypril account." />

      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-black mx-auto flex items-center justify-center font-bold shadow-2xs border border-neutral-200">
          <UserCheck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-heading font-black text-black">Welcome Back</h1>
        <p className="text-xs text-neutral-500 font-medium max-w-xs mx-auto leading-relaxed">
          Sign in to manage your orders, saved addresses, and wellness preferences.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-xs text-black font-medium placeholder-neutral-400 focus:outline-none focus:border-black transition-all min-h-[48px]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-neutral-700">Password</label>
              <button type="button" onClick={() => addToast('Reset link sent to registered email', 'info')} className="text-[11px] font-bold text-neutral-600 hover:text-black hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-xs text-black font-medium placeholder-neutral-400 focus:outline-none focus:border-black transition-all min-h-[48px]"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-xs font-bold mt-2 shadow-2xs min-h-[48px] rounded-full flex items-center justify-center gap-2">
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-neutral-100 text-center text-xs text-neutral-600 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-black font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
