import React, { useState, useEffect } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import api from '../../services/api';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      if (res.data && Array.isArray(res.data)) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.log('Error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Customer Directory" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-white" />
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-white/80">View registered website users connected to the backend database.</p>
        </div>
        <button onClick={fetchCustomers} className="bg-white hover:bg-slate-200 text-black font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 min-h-[44px] shadow-md">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      <div className="bg-brand-green rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs text-white/90">
          <thead className="bg-brand-greenDark text-white font-semibold border-b border-white/20 uppercase text-[10px]">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {customers.map((c, i) => (
              <tr key={c._id || i}>
                <td className="p-4 font-bold text-white">{c.name}</td>
                <td className="p-4 text-white/80">{c.email}</td>
                <td className="p-4 text-white/80">{c.phone || '+91 9876543210'}</td>
                <td className="p-4 font-semibold text-white/90 font-mono">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
