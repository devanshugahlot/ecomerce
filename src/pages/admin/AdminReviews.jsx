import React from 'react';
import { Star, Trash2, CheckCircle2, MessageSquare, ImageIcon } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';

export const AdminReviews = () => {
  const { getAllReviewsFlat, deleteReview } = useProducts();
  const { addToast } = useToast();

  const reviews = getAllReviewsFlat();

  const handleDelete = async (productId, reviewId) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      await deleteReview(productId, reviewId);
      addToast('Review deleted permanently', 'info');
    }
  };

  return (
    <div className="space-y-6 bg-brand-green min-h-screen p-2 sm:p-6 text-white">
      <SEO title="Admin — Customer Review Moderation" />

      <div className="flex justify-between items-center bg-brand-green p-6 rounded-3xl border border-white/20 shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Star className="w-7 h-7 text-white fill-white" />
            Customer Reviews Moderation ({reviews.length})
          </h1>
          <p className="text-xs text-white/80 mt-1">
            View all customer-submitted ratings & photo reviews. Click delete to remove any inappropriate review.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r._id || r.id}
            className="p-5 rounded-3xl bg-brand-green border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-extrabold text-white text-sm">{r.name}</span>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(Number(r.rating) || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] bg-brand-greenDark text-white/90 px-2 py-0.5 rounded-full border border-white/20 font-mono">
                  Product ID: {r.productIdStr || r.productId}
                </span>
                <span className="text-[11px] text-white/80">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                </span>
              </div>

              {r.title && <h4 className="font-bold text-white text-xs">{r.title}</h4>}
              <p className="text-xs text-white/90 italic font-medium">"{r.comment}"</p>

              {r.image && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[10px] text-white font-bold flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" /> Photo Attached:
                  </span>
                  <img src={r.image} alt="Uploaded review photo" className="w-14 h-14 object-cover rounded-xl border border-white/20" />
                </div>
              )}
            </div>

            <button
              onClick={() => handleDelete(r.productIdStr || r.productId, r._id || r.id)}
              className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Review</span>
            </button>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 bg-brand-green rounded-3xl border border-white/20 p-8 space-y-2">
            <MessageSquare className="w-8 h-8 text-white/80 mx-auto" />
            <h4 className="font-bold text-white text-sm">No Customer Reviews Submitted Yet</h4>
            <p className="text-xs text-white/80">Reviews submitted by customers on product pages will appear here for moderation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
