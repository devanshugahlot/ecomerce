import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit3, Trash2, Check, X, Sparkles, Image as ImageIcon, Upload, Layers } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';
import { compressImage } from '../../utils/imageCompressor';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory, siteBanners, updateSiteBanners } = useProducts();
  const [activeTab, setActiveTab] = useState('products');
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

  const [bannersForm, setBannersForm] = useState({
    heroBanner: siteBanners?.heroBanner || '',
    heroBannerMobile: siteBanners?.heroBannerMobile || '',
    promoBanner1: siteBanners?.promoBanner1 || '',
  });

  useEffect(() => {
    if (siteBanners) {
      setBannersForm({
        heroBanner: siteBanners.heroBanner || '',
        heroBannerMobile: siteBanners.heroBannerMobile || '',
        promoBanner1: siteBanners.promoBanner1 || '',
      });
    }
  }, [siteBanners]);

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
    if (!file) return;
    try {
      addToast('Processing image...', 'info');
      const compressedBase64 = await compressImage(file, 1200, 1200, 0.75);
      const imgVal = compressedBase64 || '';
      if (field === 'product') {
        setForm((prev) => ({ ...prev, image: imgVal }));
      } else {
        setBannersForm((prev) => ({ ...prev, [field]: imgVal }));
      }
      addToast('Image uploaded successfully!', 'success');
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'product') {
          setForm((prev) => ({ ...prev, image: reader.result }));
        } else {
          setBannersForm((prev) => ({ ...prev, [field]: reader.result }));
        }
        addToast('Image uploaded from device!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingBanners, setIsSavingBanners] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        addToast('Product removed from catalog', 'info');
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      addToast('Product title and price are required', 'error');
      return;
    }

    setIsSavingProduct(true);
    try {
      const catName = (form.category || 'General').trim();

      if (catName && !categories.some((c) => (c.name || '').toLowerCase() === catName.toLowerCase())) {
        try {
          await addCategory({ name: catName, badge: 'NEW', image: form.image || '' });
        } catch (cErr) {
          console.warn('Auto-create category notice:', cErr.message);
        }
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
        await updateProduct(editingId, payload);
        addToast('Product saved successfully!', 'success');
      } else {
        await addProduct(payload);
        addToast('New product created & saved!', 'success');
      }
      setShowModal(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleSaveBanners = async (e) => {
    e.preventDefault();
    setIsSavingBanners(true);
    try {
      await updateSiteBanners(bannersForm);
      addToast('Website banner images saved & applied live!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save banners', 'error');
    } finally {
      setIsSavingBanners(false);
    }
  };

  return (
    <div className="space-y-6 bg-brand-greenDark min-h-screen p-2 sm:p-6 text-white">
      <SEO title="Admin — Products & Banner Images" />

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-green p-6 rounded-3xl border border-white/20 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-white" />
            Hypril Admin Catalog & Banners
          </h1>
          <p className="text-xs text-white/80 mt-1">
            Upload images directly from device and manage live listings & banners.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-brand-greenDark p-1.5 rounded-2xl border border-white/20 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
              activeTab === 'products' ? 'bg-white text-black shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
              activeTab === 'banners' ? 'bg-white text-black shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            Site Banners
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="max-w-md w-full relative">
              <Search className="w-4 h-4 text-white/75 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-brand-green border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/70 focus:outline-none focus:border-white min-h-[44px]"
              />
            </div>

            <button
              onClick={handleOpenAdd}
              className="bg-white hover:bg-neutral-200 text-black py-3 px-6 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md shrink-0 w-full sm:w-auto justify-center min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-brand-green rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs text-white/90 min-w-[600px]">
                <thead className="bg-brand-greenDark text-white font-extrabold border-b border-white/10 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.map((p) => {
                    const pId = p._id || p.id;
                    const pImg = (p.images && p.images[0]) || p.image || '';
                    return (
                      <tr key={pId} className="hover:bg-brand-greenDark/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {pImg ? (
                              <img
                                src={pImg}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover bg-brand-greenDark border border-white/20 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-brand-greenDark border border-white/20 flex items-center justify-center text-white/60 shrink-0">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <span className="font-extrabold text-white text-sm block leading-tight">{p.name}</span>
                              <span className="text-[10px] text-white/80 block line-clamp-1">{p.benefitSummary}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-brand-greenDark text-white border border-white/20 text-[11px] font-semibold">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-black text-white font-mono text-sm">{formatCurrency(p.price)}</td>
                        <td className="p-4 font-semibold text-white/80">{p.stock} units</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-2.5 rounded-xl bg-brand-greenDark hover:bg-brand-green text-white border border-white/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(pId)}
                              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                      <td colSpan="5" className="p-8 text-center text-white/80">
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
        <div className="bg-brand-green rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-white" />
              Upload Website Banner Images From Device
            </h2>
            <p className="text-xs text-white/80 mt-1">
              Select image file directly from your computer or phone device.
            </p>
          </div>

          <form onSubmit={handleSaveBanners} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Section Banner Image (Desktop) */}
              <div className="space-y-3 p-5 bg-brand-greenDark rounded-2xl border border-white/20 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-white">
                      1. Main Top Hero Banner (Desktop)
                    </label>
                    <p className="text-[11px] text-white/80 mt-0.5">
                      Main banner image displayed on desktop & tablet screens.
                    </p>
                  </div>

                  {bannersForm.heroBanner ? (
                    <div className="aspect-[100/36] bg-brand-greenDark rounded-xl overflow-hidden border border-white/20 relative">
                      <img src={bannersForm.heroBanner} alt="Hero Banner Preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-white/20 rounded-xl text-center text-white/80">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                      <p className="text-xs">No desktop image selected yet</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <label className="bg-white hover:bg-slate-200 text-black font-extrabold text-xs py-3 px-6 rounded-full cursor-pointer inline-flex items-center gap-2 shadow-md min-h-[44px]">
                    <Upload className="w-4 h-4" />
                    <span>Choose Hero Banner Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'heroBanner')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Hero Section Banner Image (Mobile - Optional) */}
              <div className="space-y-3 p-5 bg-brand-greenDark rounded-2xl border border-white/20 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-bold text-white">
                        2. Mobile Hero Banner (Optional)
                      </label>
                      <p className="text-[11px] text-white/80 mt-0.5">
                        ~3:4 ratio. If empty, falls back to the desktop image.
                      </p>
                    </div>
                    {bannersForm.heroBannerMobile && (
                      <button
                        type="button"
                        onClick={() => setBannersForm((prev) => ({ ...prev, heroBannerMobile: '' }))}
                        className="text-xs text-rose-300 hover:text-rose-200 font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {bannersForm.heroBannerMobile ? (
                    <div className="aspect-[3/4] max-h-[160px] mx-auto bg-brand-greenDark rounded-xl overflow-hidden border border-white/20 relative">
                      <img src={bannersForm.heroBannerMobile} alt="Mobile Banner Preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-white/20 rounded-xl text-center text-white/80">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                      <p className="text-xs">Optional: Falls back to desktop image</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <label className="bg-white hover:bg-slate-200 text-black font-extrabold text-xs py-3 px-6 rounded-full cursor-pointer inline-flex items-center gap-2 shadow-md min-h-[44px]">
                    <Upload className="w-4 h-4" />
                    <span>Choose Mobile Banner Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'heroBannerMobile')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Promo Section Banner Image */}
            <div className="space-y-3 p-5 bg-brand-greenDark rounded-2xl border border-white/20">
              <label className="block text-sm font-bold text-white">
                3. Promo Section Banner Image
              </label>

              {bannersForm.promoBanner1 ? (
                <div className="aspect-[21/9] bg-brand-greenDark rounded-xl overflow-hidden border border-white/20 relative">
                  <img src={bannersForm.promoBanner1} alt="Promo Banner Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-white/20 rounded-xl text-center text-white/80">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                  <p className="text-xs">No image selected from device yet</p>
                </div>
              )}

              <label className="bg-white hover:bg-slate-200 text-black font-extrabold text-xs py-3 px-6 rounded-full cursor-pointer inline-flex items-center gap-2 shadow-md min-h-[44px]">
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
              disabled={isSavingBanners}
              className="bg-white hover:bg-slate-200 text-black font-extrabold py-3.5 px-8 rounded-full text-xs shadow-md min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSavingBanners ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving Banner Images...</span>
                </>
              ) : (
                <span>Save Banner Images</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-brand-green border border-white/20 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-white font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hypril Extended Delay Gel (50ml)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-1">Category</label>
                  {categories && categories.length > 0 ? (
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-white min-h-[44px]"
                    >
                      {categories.map((c) => (
                        <option key={c.id || c.slug || c.name} value={c.name} className="bg-brand-greenDark text-white">
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
                      className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-3 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white min-h-[44px]"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="999"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    placeholder="1499"
                    value={form.comparePrice}
                    onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                    className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Upload Product Image From Device</label>
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-4 text-center bg-brand-greenDark/60 relative">
                  {form.image ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={form.image} alt="Product Preview" className="w-24 h-24 object-cover rounded-xl border border-white/20" />
                      <span className="text-[11px] text-white font-bold">Image selected! Click below to change file.</span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-white/80">
                      <ImageIcon className="w-8 h-8 text-white mx-auto" />
                      <p className="text-xs">No image selected from device</p>
                    </div>
                  )}

                  <label className="mt-3 bg-white hover:bg-slate-200 text-black font-extrabold text-xs py-2.5 px-5 rounded-full cursor-pointer inline-flex items-center gap-2 shadow-md min-h-[44px]">
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
                <label className="block text-white font-semibold mb-1">Short Benefit Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Non-transferable delay gel formula."
                  value={form.benefitSummary}
                  onChange={(e) => setForm({ ...form, benefitSummary: e.target.value })}
                  className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Full Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed product description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-brand-greenDark border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
                <button
                  type="button"
                  disabled={isSavingProduct}
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-full bg-brand-greenDark text-white/80 hover:text-white font-bold min-h-[44px] disabled:opacity-50 border border-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="bg-white text-black px-7 py-3 font-extrabold rounded-full hover:bg-slate-200 shadow-md min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSavingProduct ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <span>Save Product</span>
                  )}
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
