import React, { useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2 } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { CATEGORIES } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';

export const AdminCategories = () => {
  const [cats, setCats] = useState(CATEGORIES);
  const { addToast } = useToast();

  return (
    <div className="space-y-6">
      <SEO title="Categories Management" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-brand-400" />
            Categories ({cats.length})
          </h1>
          <p className="text-xs text-slate-400">Organize men's wellness catalog sections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cats.map((c) => (
          <div key={c.slug} className="p-5 rounded-2xl bg-dark-500 border border-dark-400 space-y-3">
            <img src={c.image} alt={c.name} className="w-full h-32 rounded-xl object-cover bg-dark-600" />
            <h3 className="font-bold text-base text-white">{c.name}</h3>
            <p className="text-xs text-slate-400">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
