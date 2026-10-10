import React, { useState } from 'react';
import { Package, Plus, Search, Edit3, Trash2, Check, X, Sparkles, Image as ImageIcon, Upload, Layers } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';
import { compressImage } from '../../utils/imageCompressor';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory, siteBanners, updateSiteBanners } = useProducts();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'banners'
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

  const [bannersForm, setBannersForm] = useState({
    heroBanner: siteBanners?.heroBanner || '',
    promoBanner1: siteBanners?.promoBanner1 || '',
  });

  const [form, setForm] = useState({
    name: '',
    category: categories && categories.length > 0 ? categories[0].name : 'General',
    price: '',
    comparePrice: '',
    stock: 50,
    description: '',
    benefitSummary: '',
    image: '',
    isBestSeller: true,
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: categories && categories.length > 0 ? categories[0].name : 'General',
      price: '',
      comparePrice: '',
      stock: 50,
      description: '',
      benefitSummary: '',
      image: '',
      isBestSeller: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p._id || p.id);
    setForm({
      name: p.name,
      category: p.category || (categories && categories.length > 0 ? categories[0].name : 'General'),
      price: p.price,
      comparePrice: p.comparePrice || '',
      stock: p.stock || 50,
      description: p.description || '',
      benefitSummary: p.benefitSummary || '',
      image: (p.images && p.images[0]) || p.image || '',
      isBestSeller: p.isBestSeller ?? true,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      try {
        addToast('Optimizing image...', 'info');
        const compressedBase64 = await compressImage(file, 1200, 1200, 0.75);
        if (field === 'product') {
          setForm((prev) => ({ ...prev, image: compressedBase64 }));
        } else {
          setBannersForm((prev) => ({ ...prev, [field]: compressedBase64 }));
        }
        addToast('Image uploaded & optimized successfully!', 'success');
      } catch (err) {
        addToast('Failed to process image file', 'error');
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      addToast('Product removed from catalog', 'info');
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      addToast('Product title and price are required', 'error');
      return;
    }

    const catName = (form.category || 'General').trim();

    // Auto-create category if it does not exist yet in categories list
    if (catName && !categories.some((c) => (c.name || '').toLowerCase() === catName.toLowerCase())) {
      addCategory({ name: catName, badge: 'NEW', image: form.image || '' });
    }

    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: catName,
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
      addToast('Product saved successfully!', 'success');
    } else {
      addProduct(payload);
      addToast('New product created & saved!', 'success');
    }
    setShowModal(false);
  };

  const handleSaveBanners = (e) => {
    e.preventDefault();
    updateSiteBanners(bannersForm);
    addToast('Website banner images saved & applied live!', 'success');
  };

  return (
    <div className="space-y-6 bg-dark-900 min-h-screen p-2 sm:p-6 text-slate-100">
      <SEO title="Admin — Products & Banner Images" />

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-800 p-6 rounded-3xl border border-dark-600 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-amber-400" />
            Admin Catalog & Banners Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload images directly from device and manage live listings & banners.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-dark-700 p-1.5 rounded-2xl border border-dark-600">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products' ? 'bg-amber-500 text-dark-900 shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Products Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'banners' ? 'bg-amber-500 text-dark-900 shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Site Banners (Upload Images)
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="max-w-md w-full relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-dark-800 border border-dark-600 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleOpenAdd}
              className="bg-amber-500 hover:bg-amber-600 text-dark-900 py-3 px-6 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-dark-800 rounded-3xl border border-dark-600 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-dark-700 text-amber-400 font-extrabold border-b border-dark-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600/70">
                  {filtered.map((p) => {
                    const pId = p._id || p.id;
                    const pImg = (p.images && p.images[0]) || p.image || '';
                    return (
                      <tr key={pId} className="hover:bg-dark-700/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {pImg ? (
                              <img
                                src={pImg}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover bg-dark-700 border border-dark-600 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center text-slate-500 shrink-0">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
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
                        <td className="p-4 font-bold text-emerald-400">{p.stock} units</td>
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
                      <td colSpan="5" className="p-8 text-center text-slate-400">
                        No products added yet. Click "+ Add New Product" to create products.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SITE BANNERS MANAGEMENT */}
      {activeTab === 'banners' && (
        <div className="bg-dark-800 rounded-3xl p-6 sm:p-8 border border-dark-600 shadow-2xl space-y-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-amber-400" />
              Upload Website Banner Images From Device
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select image file directly from your computer or phone device.
            </p>
          </div>

          <form onSubmit={handleSaveBanners} className="space-y-6">
            {/* Hero Section Banner Image */}
            <div className="space-y-3 p-5 bg-dark-700/60 rounded-2xl border border-dark-600">
              <label className="block text-sm font-bold text-amber-400">
                1. Main Top Hero Banner Image (Ratio 100:27)
              </label>

              {bannersForm.heroBanner ? (
                <div className="aspect-[100/27] bg-dark-900 rounded-xl overflow-hidden border border-dark-600 relative">
                  <img src={bannersForm.heroBanner} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-dark-500 rounded-xl text-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-xs">No image selected from device yet</p>
                </div>
              )}

              <label className="bg-amber-500 hover:bg-amber-400 text-dark-900 font-extrabold text-xs py-3 px-6 rounded-xl cursor-pointer inline-flex items-center gap-2 shadow-md">
                <Upload className="w-4 h-4" />
                <span>Choose Hero Banner Image from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'heroBanner')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Promo Section Banner Image */}
            <div className="space-y-3 p-5 bg-dark-700/60 rounded-2xl border border-dark-600">
              <label className="block text-sm font-bold text-amber-400">
                2. Promo Section Banner Image
              </label>

              {bannersForm.promoBanner1 ? (
                <div className="aspect-[21/9] bg-dark-900 rounded-xl overflow-hidden border border-dark-600 relative">
                  <img src={bannersForm.promoBanner1} alt="Promo Banner Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-dark-500 rounded-xl text-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-xs">No image selected from device yet</p>
                </div>
              )}

              <label className="bg-amber-500 hover:bg-amber-400 text-dark-900 font-extrabold text-xs py-3 px-6 rounded-xl cursor-pointer inline-flex items-center gap-2 shadow-md">
                <Upload className="w-4 h-4" />
                <span>Choose Promo Banner Image from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'promoBanner1')}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-dark-900 font-extrabold py-3.5 px-8 rounded-2xl text-xs shadow-glow-amber"
            >
              Save Banner Images
            </button>
          </form>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
          <div className="bg-dark-800 border border-dark-600 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-600 pb-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extend — Delay Spray for Men (20ml)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  {categories && categories.length > 0 ? (
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id || c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Category name"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-amber-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Units</label>
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
                    placeholder="499"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-bold text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    placeholder="799"
                    value={form.comparePrice}
                    onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                    className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Product Image File Upload from Device ONLY */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Upload Product Image From Device</label>
                <div className="border-2 border-dashed border-dark-600 rounded-2xl p-4 text-center bg-dark-700/60 relative">
                  {form.image ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={form.image} alt="Product Preview" className="w-24 h-24 object-cover rounded-xl border border-dark-600" />
                      <span className="text-[11px] text-emerald-400 font-bold">Image selected! Click below to change file.</span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-slate-400">
                      <ImageIcon className="w-8 h-8 text-amber-400 mx-auto" />
                      <p className="text-xs">No image selected from device</p>
                    </div>
                  )}

                  <label className="mt-3 bg-amber-500 hover:bg-amber-400 text-dark-900 font-extrabold text-xs py-2.5 px-5 rounded-xl cursor-pointer inline-flex items-center gap-2 shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>Upload Product Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'product')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Benefit Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Non-transferable delay spray formula."
                  value={form.benefitSummary}
                  onChange={(e) => setForm({ ...form, benefitSummary: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed product description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl p-3 text-white placeholder-slate-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-600">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-full bg-dark-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 text-dark-900 px-7 py-3 font-extrabold rounded-full hover:bg-amber-400 shadow-glow-amber"
                >
                  Save Product
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
