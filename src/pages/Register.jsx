import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    const res = await register(name, email, phone, password);
    setLoading(false);

    if (res.success) {
      navigate('/account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20 space-y-8">
      <SEO title="Create Account" description="Register a free Hypril account." />

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-heading font-extrabold text-slate-900">Create Account</h1>
        <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
          Join Hypril for fast express checkout, live order tracking, and customized wellness recommendations.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vikram Rao"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#0D472E] focus:ring-2 focus:ring-[#0D472E]/20 transition-all min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vikram@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#0D472E] focus:ring-2 focus:ring-[#0D472E]/20 transition-all min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number (India)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#0D472E] focus:ring-2 focus:ring-[#0D472E]/20 transition-all min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#0D472E] focus:ring-2 focus:ring-[#0D472E]/20 transition-all min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-[#0D472E] focus:ring-2 focus:ring-[#0D472E]/20 transition-all min-h-[44px]"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary bg-[#0D472E] text-white w-full py-3.5 text-xs font-bold mt-2 shadow-md min-h-[44px] flex items-center justify-center gap-2">
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slate-600 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-[#0D472E] font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
