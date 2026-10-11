import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-brand-greenDark flex items-center justify-center p-4">
      <SEO title="Hypril Admin Portal Login" />

      <div className="bg-brand-green border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white mx-auto flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Hypril™ Admin Portal</h1>
          <p className="text-xs text-white/80">Sign in with administrator credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/75 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-greenDark border border-white/20 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/70 focus:outline-none focus:border-white min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/75 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-greenDark border border-white/20 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/70 focus:outline-none focus:border-white min-h-[44px]"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white hover:bg-slate-200 text-black py-3.5 text-xs font-extrabold rounded-full shadow-md min-h-[48px] flex items-center justify-center gap-2">
            <span>Login as Administrator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
