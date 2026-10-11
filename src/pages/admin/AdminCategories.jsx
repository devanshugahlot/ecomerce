import React, { useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';
import { compressImage } from '../../utils/imageCompressor';

export const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    badge: 'NEW',
    image: ''
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      badge: 'NEW',
      image: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.id || c._id || c.slug);
    setForm({
      name: c.name,
      badge: c.badge || 'POPULAR',
      image: c.image || ''
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      addToast('Processing category image...', 'info');
      const compressedBase64 = await compressImage(file, 800, 800, 0.75);
      setForm((prev) => ({ ...prev, image: compressedBase64 || '' }));
      addToast('Category image uploaded!', 'success');
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
        addToast('Category image uploaded from device!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        addToast('Category removed from website', 'info');
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete category', 'error');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) {
      addToast('Category name is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        addToast('Category saved successfully!', 'success');
      } else {
        await addCategory(form);
        addToast('Category created & saved! It will show on the website.', 'success');
      }
      setShowModal(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save category', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 bg-brand-green min-h-screen p-2 sm:p-6 text-white">
      <SEO title="Admin — Categories Management" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-green p-6 rounded-3xl border border-white/20 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <FolderTree className="w-7 h-7 text-white" />
            Website Categories ({categories.length})
          </h1>
          <p className="text-xs text-white/80 mt-1">
            Categories start empty. Any category created here will automatically display on the website!
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-white hover:bg-slate-200 text-black font-extrabold text-xs py-3 px-6 rounded-full flex items-center gap-2 shadow-md shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((c) => {
          const cId = c.id || c._id || c.slug;
          return (
            <div key={cId} className="p-5 rounded-3xl bg-brand-green border border-white/20 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-brand-greenDark border border-white/20 relative">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/80">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  {c.badge && ['NEW', 'POPULAR', 'BEST SELLER'].includes(c.badge.trim().toUpperCase()) && (
                    <span className="absolute top-2 left-2 bg-brand-green text-white border border-white/20 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      {c.badge.trim().toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-white">{c.name}</h3>
                  <p className="text-[11px] text-white/80 font-mono">Slug: {c.slug || c.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/20">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 rounded-xl bg-brand-greenDark hover:bg-brand-green text-white border border-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cId)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 bg-brand-green rounded-3xl border border-white/20 p-8 space-y-2">
            <FolderTree className="w-10 h-10 text-white/80 mx-auto" />
            <h4 className="font-bold text-white text-base">No Categories Created Yet</h4>
            <p className="text-xs text-white/80">Click "+ Add New Category" above to create categories from your device.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-brand-green border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-white font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sexual Wellness"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Badge Tag</label>
                <select
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white min-h-[44px]"
                >
                  <option value="" className="bg-brand-greenDark text-white">None (No badge)</option>
                  <option value="NEW" className="bg-brand-greenDark text-white">NEW</option>
                  <option value="POPULAR" className="bg-brand-greenDark text-white">POPULAR</option>
                  <option value="BEST SELLER" className="bg-brand-greenDark text-white">BEST SELLER</option>
                </select>
              </div>

              {/* Upload Category Image from Device */}
              <div>
                <label className="block text-white font-semibold mb-1">Upload Category Image From Device</label>
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-4 text-center bg-brand-greenDark/60 relative">
                  {form.image ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={form.image} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-white/20" />
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
                    <span>Upload Category Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-full bg-brand-greenDark text-white/80 hover:text-white font-bold disabled:opacity-50 min-h-[44px] border border-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-white text-black px-7 py-3 font-extrabold rounded-full hover:bg-slate-200 shadow-md disabled:opacity-50 min-h-[48px] flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Category</span>
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

export default AdminCategories;
