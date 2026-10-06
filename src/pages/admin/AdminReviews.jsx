import React, { useState } from 'react';
import { Star, Check, Trash2 } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Vikram R.', product: 'VYRO Surge Stamina Gummies', rating: 5, comment: 'Extremely effective gummies!', status: 'Approved' },
    { id: 2, name: 'Rohan S.', product: 'Minoxidil Beard Serum', rating: 5, comment: 'Great non-greasy texture, seeing new hair patches.', status: 'Approved' },
  ]);
  const { addToast } = useToast();

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
    addToast('Review deleted', 'info');
  };

  return (
    <div className="space-y-6">
      <SEO title="Reviews Moderation" />
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400" />
          Review Moderation ({reviews.length})
        </h1>
        <p className="text-xs text-slate-400">Approve or delete verified customer product reviews.</p>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 rounded-2xl bg-dark-500 border border-dark-400 flex items-center justify-between">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{r.name}</span>
                <span className="text-amber-400 font-bold">{r.rating} ★</span>
                <span className="text-[10px] text-slate-400">on {r.product}</span>
              </div>
              <p className="text-slate-300 italic">"{r.comment}"</p>
            </div>
            <button onClick={() => handleDelete(r.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
