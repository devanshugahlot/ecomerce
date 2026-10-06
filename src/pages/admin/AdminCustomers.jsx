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
            <Users className="w-6 h-6 text-brand-400" />
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-slate-400">View registered website users connected to the backend database.</p>
        </div>
        <button onClick={fetchCustomers} className="btn-secondary text-xs px-3 py-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      <div className="bg-dark-500 rounded-3xl border border-dark-400 overflow-hidden shadow-premium">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-dark-600 text-slate-400 font-semibold border-b border-dark-400 uppercase text-[10px]">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-400/60">
            {customers.map((c, i) => (
              <tr key={c._id || i}>
                <td className="p-4 font-bold text-white">{c.name}</td>
                <td className="p-4 text-slate-400">{c.email}</td>
                <td className="p-4 text-slate-400">{c.phone || '+91 9876543210'}</td>
                <td className="p-4 font-semibold text-brand-400">
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
