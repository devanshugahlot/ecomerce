import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';

export const AdminCoupons = () => {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon } = useProducts();
  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const { addToast } = useToast();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!code || !value) {
      addToast('Please enter both coupon code and value', 'error');
      return;
    }

    await addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(value),
      minOrderAmount: Number(minOrder) || 0,
    });

    addToast(`Coupon '${code.toUpperCase()}' created & activated!`, 'success');
    setCode('');
    setValue('');
    setMinOrder('');
  };

  const handleDelete = async (id) => {
    await deleteCoupon(id);
    addToast('Coupon deleted', 'info');
  };

  const handleToggle = async (id) => {
    await toggleCouponStatus(id);
    addToast('Coupon status updated', 'info');
  };

  return (
    <div className="space-y-6 bg-dark-900 min-h-screen p-2 sm:p-6 text-slate-100">
      <SEO title="Admin — Hypril Coupon Management" />

      <div className="bg-dark-800 p-6 rounded-3xl border border-dark-600 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-amber-400" />
            Discount Coupons & Promos ({coupons.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Coupons created here work live instantly on the Hypril cart drawer and checkout page.
          </p>
        </div>
      </div>

      {/* Create Coupon Form */}
      <form onSubmit={handleCreate} className="p-6 bg-dark-800 rounded-3xl border border-dark-600 shadow-xl flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="Coupon Code (e.g. HYPRIL10)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-2xl px-4 py-3 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500 flex-1 w-full min-h-[44px]"
        />
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 min-h-[44px] w-full sm:w-auto"
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount (₹)</option>
        </select>
        <input
          type="number"
          placeholder="Discount Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-full sm:w-32 font-bold text-amber-400 min-h-[44px]"
        />
        <input
          type="number"
          placeholder="Min Order (₹)"
          value={minOrder}
          onChange={(e) => setMinOrder(e.target.value)}
          className="bg-dark-700 border border-dark-600 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-full sm:w-32 min-h-[44px]"
        />
        <button type="submit" className="btn-primary bg-amber-500 hover:bg-amber-600 text-dark-900 py-3 px-6 text-xs font-extrabold shadow-glow-amber shrink-0 w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </form>

      {/* Coupons List Table */}
      <div className="bg-dark-800 rounded-3xl border border-dark-600 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
            <thead className="bg-dark-700 text-amber-400 font-extrabold border-b border-dark-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Discount Type</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min Order Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/70">
              {coupons.map((c) => {
                const cId = c._id || c.id;
                return (
                  <tr key={cId} className="hover:bg-dark-700/50 transition-colors">
                    <td className="p-4 font-black text-white text-sm tracking-wider">{c.code}</td>
                    <td className="p-4 capitalize">{c.discountType}</td>
                    <td className="p-4 font-black text-amber-400 text-sm">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </td>
                    <td className="p-4">₹{c.minOrderAmount || 0}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggle(cId)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold border transition-all min-h-[36px] ${
                          c.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {c.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(cId)}
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                        title="Delete Coupon"
                      >
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
    </div>
  );
};

export default AdminCoupons;
