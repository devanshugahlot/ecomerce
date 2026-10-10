import React, { useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';

export const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        addToast('Image size must be less than 8MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
        addToast('Category image uploaded from device!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      addToast('Category removed from website', 'info');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name) {
      addToast('Category name is required', 'error');
      return;
    }

    if (editingId) {
      updateCategory(editingId, form);
      addToast('Category saved successfully!', 'success');
    } else {
      addCategory(form);
      addToast('Category created & saved! It will show on the website.', 'success');
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 bg-dark-900 min-h-screen p-2 sm:p-6 text-slate-100">
      <SEO title="Admin — Categories Management" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark-800 p-6 rounded-3xl border border-dark-600 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <FolderTree className="w-7 h-7 text-amber-400" />
            Website Categories ({categories.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Categories start empty. Any category created here will automatically display on the website!
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-dark-900 font-extrabold text-xs py-3 px-6 rounded-2xl flex items-center gap-2 shadow-glow-amber shrink-0"
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
            <div key={cId} className="p-5 rounded-3xl bg-dark-800 border border-dark-600 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-dark-700 border border-dark-600 relative">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  {c.badge && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-dark-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      {c.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-white">{c.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Slug: {c.slug || c.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-dark-600">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-amber-400 border border-dark-600"
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
          <div className="col-span-full text-center py-12 bg-dark-800 rounded-3xl border border-dark-600 p-8 space-y-2">
            <FolderTree className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="font-bold text-white text-base">No Categories Created Yet</h4>
            <p className="text-xs text-slate-400">Click "+ Add New Category" above to create categories from your device.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
          <div className="bg-dark-800 border border-dark-600 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-600 pb-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sexual Wellness"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Badge Tag (e.g. HOT, NEW, POPULAR)</label>
                <input
                  type="text"
                  placeholder="POPULAR"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Upload Category Image from Device */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Upload Category Image From Device</label>
                <div className="border-2 border-dashed border-dark-600 rounded-2xl p-4 text-center bg-dark-700/60 relative">
                  {form.image ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={form.image} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-dark-600" />
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
                  Save Category
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
