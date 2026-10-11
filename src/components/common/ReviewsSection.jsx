import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquarePlus, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { compressImage } from '../../utils/imageCompressor';

export const ReviewsSection = ({ productId }) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { getProductReviews, addReview } = useProducts();

  const reviews = getProductReviews(productId || 'bold_extend_spray');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ title: '', comment: '', rating: 5, image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 800, 800, 0.75);
        setNewReview((prev) => ({ ...prev, image: compressedBase64 }));
        setImagePreview(compressedBase64);
      } catch (err) {
        addToast('Failed to process image file', 'error');
      }
    }
  };

  const handleOpenReviewModal = () => {
    if (!user) {
      addToast('Please sign in to write a verified review', 'error');
      return;
    }
    setShowModal(true);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please sign in to submit a review', 'error');
      return;
    }
    if (!newReview.comment.trim()) {
      addToast('Please enter your review experience', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await addReview(productId || 'bold_extend_spray', {
        title: newReview.title,
        comment: newReview.comment,
        rating: Number(newReview.rating || 5),
        image: newReview.image,
      });
      setShowModal(false);
      setNewReview({ title: '', comment: '', rating: 5, image: null });
      setImagePreview(null);
      addToast('Thank you! Your verified review has been posted.', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit review';
      addToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '4.9';

  return (
    <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-neutral-200 shadow-2xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-100 pb-8">
        
        {/* Rating Breakdown Header */}
        <div className="flex items-center gap-6">
          <div className="text-center p-4 bg-neutral-50 rounded-2xl border border-neutral-200 shrink-0">
            <span className="text-4xl font-heading font-black text-black block">{avgRating}</span>
            <div className="flex items-center justify-center text-amber-500 gap-0.5 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
              Based on {reviews.length} Verified Reviews
            </span>
          </div>

          {/* Breakdown Bars */}
          <div className="space-y-1.5 w-48 sm:w-64 text-xs font-semibold text-neutral-600">
            {[
              { stars: '5 Star', pct: '88%' },
              { stars: '4 Star', pct: '9%' },
              { stars: '3 Star', pct: '2%' },
              { stars: '2 Star', pct: '1%' },
              { stars: '1 Star', pct: '0%' },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-2">
                <span className="w-10 text-[11px] font-bold text-neutral-500">{bar.stars}</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-green rounded-full" style={{ width: bar.pct }}></div>
                </div>
                <span className="w-8 text-right text-[11px] text-neutral-400">{bar.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenReviewModal}
            className="btn-primary text-white text-xs font-bold py-3.5 px-6 rounded-full flex items-center gap-2 shadow-2xs transition-all min-h-[48px]"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div key={rev._id || rev.id} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-neutral-400 font-medium">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                </span>
              </div>

              {rev.title && <h4 className="font-heading font-black text-black text-sm leading-snug">{rev.title}</h4>}
              <p className="text-xs text-neutral-600 font-medium leading-relaxed">{rev.comment}</p>

              {rev.image && (
                <div className="pt-2">
                  <img
                    src={rev.image}
                    alt="Customer uploaded review proof"
                    onClick={() => setPreviewModalImg(rev.image)}
                    className="w-20 h-20 object-cover rounded-xl border border-neutral-300 shadow-2xs cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
              <div>
                <span className="font-bold text-black block">{rev.name}</span>
                {rev.verified !== false && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-black bg-neutral-200 px-2 py-0.5 rounded-full border border-neutral-300">
                    <CheckCircle2 className="w-3 h-3 text-black" /> Verified Buyer
                  </span>
                )}
              </div>
              <button
                onClick={() => addToast('Thank you for voting!', 'success')}
                className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-black font-semibold transition-colors min-h-[32px]"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>({rev.helpful || 1})</span>
              </button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="col-span-3 text-center py-8 text-xs text-neutral-500">
            No customer reviews yet. Be the first verified customer to write a review!
          </div>
        )}
      </div>

      {/* Image Full Screen Preview Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 bg-brand-greenDark/80 text-white rounded-full p-2 hover:bg-brand-greenDark"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewModalImg} alt="Customer review photo" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-heading font-black text-xl text-black">Write a Verified Review</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Your Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-black font-bold focus:outline-none focus:border-black min-h-[44px]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Below Average)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Noticeable results within 10 days"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-black font-medium focus:outline-none focus:border-black min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Your Detailed Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about experience, quality, or packaging..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-black font-medium focus:outline-none focus:border-black"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Upload Product Photo (Optional)</label>
                <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-4 text-center bg-neutral-50 hover:bg-neutral-100 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-neutral-300" />
                      <span className="text-[11px] text-black font-bold">Photo selected! Click to change.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-neutral-500">
                      <ImageIcon className="w-6 h-6 text-black" />
                      <span className="text-xs font-bold text-neutral-800">Click or drag photo here</span>
                      <span className="text-[10px]">JPG, PNG up to 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 text-white text-xs font-bold py-3.5 px-6 rounded-full shadow-2xs transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>Submit Verified Review</span>
                  )}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary px-5 py-3.5 rounded-full text-xs font-bold min-h-[48px]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
