import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@hypril.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <SEO title="Hypril Admin Portal Login" />

      <div className="bg-dark-800 border border-dark-600 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Hypril™ Admin Portal</h1>
          <p className="text-xs text-slate-400">Sign in with administrator credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary bg-amber-500 hover:bg-amber-600 text-dark-900 w-full py-3.5 text-xs font-extrabold shadow-glow-amber min-h-[44px] flex items-center justify-center gap-2">
            <span>Login as Administrator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3.5 rounded-xl bg-dark-700/80 border border-dark-600 text-[11px] text-slate-300 space-y-1">
          <p className="font-semibold text-amber-400">Demo Admin Credentials:</p>
          <p>Email: <strong className="text-white">admin@hypril.com</strong></p>
          <p>Password: <strong className="text-white">Admin@123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
