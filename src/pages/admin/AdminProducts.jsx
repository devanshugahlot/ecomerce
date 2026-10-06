import React, { useState } from 'react';
import { Package, Plus, Search, Edit3, Trash2, Check, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    category: 'Enlargement Oils',
    price: '',
    comparePrice: '',
    stock: 50,
    description: '',
    benefitSummary: '',
    image: '/images/hypril_oil.jpg',
    isBestSeller: true,
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: 'Enlargement Oils',
      price: '',
      comparePrice: '',
      stock: 50,
      description: '',
      benefitSummary: '',
      image: '/images/hypril_oil.jpg',
      isBestSeller: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p._id || p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      comparePrice: p.comparePrice || '',
      stock: p.stock || 50,
      description: p.description || '',
      benefitSummary: p.benefitSummary || '',
      image: (p.images && p.images[0]) || p.image || '/images/hypril_oil.jpg',
      isBestSeller: p.isBestSeller ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      addToast('Product removed from Hypril catalog', 'info');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      addToast('Product name and price are required', 'error');
      return;
    }

    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: form.category,
      price: Number(form.price),
      comparePrice: Number(form.comparePrice) || Number(form.price * 1.4),
      stock: Number(form.stock),
      description: form.description || form.name,
      benefitSummary: form.benefitSummary || form.name,
      isBestSeller: form.isBestSeller,
      image: form.image,
      images: [form.image],
    };

    if (editingId) {
      updateProduct(editingId, payload);
      addToast('Product updated successfully!', 'success');
    } else {
      addProduct(payload);
      addToast('New Hypril product added to live storefront!', 'success');
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 bg-dark-900 min-h-screen p-2 sm:p-6 text-slate-100">
      <SEO title="Admin — Hypril Products Catalog" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-800 p-6 rounded-3xl border border-dark-600 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-amber-400" />
            Live Products Catalog ({products.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Hypril products in real-time. Any changes made here reflect instantly on the live website.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary bg-amber-500 hover:bg-amber-600 text-dark-900 py-3 px-6 text-xs font-extrabold shadow-glow-amber">
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog by product name or category..."
          className="w-full bg-dark-800 border border-dark-600 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Dark Products Table */}
      <div className="bg-dark-800 rounded-3xl border border-dark-600 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-700 text-amber-400 font-extrabold border-b border-dark-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Compare Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/70">
              {filtered.map((p) => {
                const pId = p._id || p.id;
                const pImg = (p.images && p.images[0]) || p.image || '/images/hypril_oil.jpg';
                return (
                  <tr key={pId} className="hover:bg-dark-700/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pImg}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-dark-700 border border-dark-600 shrink-0"
                        />
                        <div>
                          <span className="font-extrabold text-white text-sm block leading-tight">{p.name}</span>
                          <span className="text-[10px] text-slate-400 block line-clamp-1">{p.benefitSummary}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-dark-700 text-slate-300 border border-dark-600 text-[11px] font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-black text-amber-400 text-sm">{formatCurrency(p.price)}</td>
                    <td className="p-4 text-slate-400 line-through">{p.comparePrice ? formatCurrency(p.comparePrice) : '-'}</td>
                    <td className="p-4">
                      <span className={`font-bold ${p.stock > 10 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      {p.isBestSeller && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-extrabold border border-amber-500/30 uppercase">
                          Bestseller
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-amber-400 border border-dark-600 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pId)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No products found matching "{query}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Dark Modal Dialog for Add / Edit Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-800 border border-dark-600 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-600 pb-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {editingId ? 'Edit Product' : 'Add New Hypril™ Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hypril™ Enlargement Oil (100 ml)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Enlargement Oils">Enlargement Oils</option>
                    <option value="Delay Gels">Delay Gels</option>
                    <option value="Sexual Wellness">Sexual Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="799"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-bold text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    placeholder="1299"
                    value={form.comparePrice}
                    onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Image URL / Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/images/hypril_oil.jpg"
                    className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Benefit Summary</label>
                <input
                  type="text"
                  placeholder="Bigger size, stronger performance & improved blood flow."
                  value={form.benefitSummary}
                  onChange={(e) => setForm({ ...form, benefitSummary: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Description</label>
                <textarea
                  rows="3"
                  placeholder="Doctor formulated high-potency male enhancement oil..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl p-3 text-white placeholder-slate-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  checked={form.isBestSeller}
                  onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="isBestSeller" className="text-slate-300 font-semibold cursor-pointer">
                  Mark as #1 Bestseller Badge
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-600">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary bg-amber-500 hover:bg-amber-600 text-dark-900 px-7 py-3 font-extrabold shadow-glow-amber"
                >
                  {editingId ? 'Save Changes' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
