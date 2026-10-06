import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, RefreshCw } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [discountType, setDiscountType] = useState('percentage');

  const { addToast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      if (res.data && Array.isArray(res.data)) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.log('Error fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!code || !value) {
      addToast('Please enter both coupon code and value', 'error');
      return;
    }

    try {
      const res = await api.post('/coupons', {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(value),
        minOrderAmount: Number(minOrder) || 0,
      });

      setCoupons([res.data, ...coupons]);
      addToast(`Coupon '${code.toUpperCase()}' created and activated!`, 'success');
      setCode('');
      setValue('');
      setMinOrder('');
    } catch (err) {
      addToast('Failed to create coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((c) => (c._id || c.id) !== id));
      addToast('Coupon deleted', 'info');
    } catch (err) {
      addToast('Error deleting coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Coupon Management" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-brand-400" />
            Discount Coupons ({coupons.length})
          </h1>
          <p className="text-xs text-slate-400">Coupons created here will work live on the website cart & checkout.</p>
        </div>
        <button onClick={fetchCoupons} className="btn-secondary text-xs px-3 py-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Coupons</span>
        </button>
      </div>

      <form onSubmit={handleCreate} className="p-5 bg-dark-500 rounded-2xl border border-dark-400 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Coupon Code (e.g. VYRO20)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-dark-600 border border-dark-400 rounded-xl px-3 py-2.5 text-xs text-white uppercase flex-1 w-full"
        />
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          className="bg-dark-600 border border-dark-400 rounded-xl px-3 py-2.5 text-xs text-white"
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount (₹)</option>
        </select>
        <input
          type="number"
          placeholder="Discount Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-dark-600 border border-dark-400 rounded-xl px-3 py-2.5 text-xs text-white w-28"
        />
        <input
          type="number"
          placeholder="Min Order (₹)"
          value={minOrder}
          onChange={(e) => setMinOrder(e.target.value)}
          className="bg-dark-600 border border-dark-400 rounded-xl px-3 py-2.5 text-xs text-white w-28"
        />
        <button type="submit" className="btn-primary text-xs py-2.5 px-6 shrink-0 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </form>

      <div className="bg-dark-500 rounded-3xl border border-dark-400 overflow-hidden shadow-premium">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-dark-600 text-slate-400 font-semibold border-b border-dark-400 text-[10px] uppercase">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Discount Type</th>
              <th className="p-4">Discount Value</th>
              <th className="p-4">Min Order Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-400/60">
            {coupons.map((c) => {
              const cId = c._id || c.id;
              return (
                <tr key={cId}>
                  <td className="p-4 font-bold text-brand-400">{c.code}</td>
                  <td className="p-4 capitalize">{c.discountType}</td>
                  <td className="p-4 font-bold text-white">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                  </td>
                  <td className="p-4">₹{c.minOrderAmount || 0}</td>
                  <td className="p-4 text-emerald-400 font-semibold">Active</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(cId)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
