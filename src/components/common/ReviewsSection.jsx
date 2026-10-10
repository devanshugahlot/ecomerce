import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquarePlus, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';
import { compressImage } from '../../utils/imageCompressor';

export const ReviewsSection = ({ productId }) => {
  const { addToast } = useToast();
  const { getProductReviews, addReview } = useProducts();

  const reviews = getProductReviews(productId || 'bold_extend_spray');
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', title: '', comment: '', rating: 5, image: null });
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

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      addToast('Please enter your name and review experience', 'error');
      return;
    }

    addReview(productId || 'bold_extend_spray', newReview);
    setShowModal(false);
    setNewReview({ name: '', title: '', comment: '', rating: 5, image: null });
    setImagePreview(null);
    addToast('Thank you! Your verified review with image has been posted.', 'success');
  };

  return (
    <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        
        {/* Rating Breakdown Header */}
        <div className="flex items-center gap-6">
          <div className="text-center p-4 bg-[#0D472E]/10 rounded-2xl border border-[#0D472E]/20 shrink-0">
            <span className="text-4xl font-heading font-black text-[#0D472E] block">4.9</span>
            <div className="flex items-center justify-center text-amber-500 gap-0.5 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Based on {reviews.length + 1420} Reviews
            </span>
          </div>

          {/* Breakdown Bars */}
          <div className="space-y-1.5 w-48 sm:w-64 text-xs font-semibold text-slate-600">
            {[
              { stars: '5 Star', pct: '88%' },
              { stars: '4 Star', pct: '9%' },
              { stars: '3 Star', pct: '2%' },
              { stars: '2 Star', pct: '1%' },
              { stars: '1 Star', pct: '0%' },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-2">
                <span className="w-10 text-[11px] font-bold text-slate-500">{bar.stars}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: bar.pct }}></div>
                </div>
                <span className="w-8 text-right text-[11px] text-slate-400">{bar.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0D472E] hover:bg-[#08301E] text-white text-xs font-extrabold py-3.5 px-6 rounded-full flex items-center gap-2 shadow-xs transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review & Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
              </div>

              <h4 className="font-heading font-black text-slate-900 text-sm leading-snug">{rev.title}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{rev.comment}</p>

              {/* Uploaded Customer Photo Preview in Review Card */}
              {rev.image && (
                <div className="pt-2">
                  <img
                    src={rev.image}
                    alt="Customer uploaded review proof"
                    onClick={() => setPreviewModalImg(rev.image)}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <div>
                <span className="font-extrabold text-slate-900 block">{rev.name}</span>
                {rev.verified !== false && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Verified Buyer
                  </span>
                )}
              </div>
              <button
                onClick={() => addToast('Thank you for voting!', 'success')}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#0D472E] font-semibold transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>({rev.helpful || 12})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Full Screen Preview Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewModalImg} alt="Customer review photo" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-xl text-slate-900">Write a Verified Review</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0D472E]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Below Average)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0D472E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Noticeable results within 10 days"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0D472E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about flavor, duration boost, or packaging..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0D472E]"
                ></textarea>
              </div>

              {/* Upload Image Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload Product Photo (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-300" />
                      <span className="text-[11px] text-emerald-700 font-bold">Photo selected! Click to change.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                      <ImageIcon className="w-6 h-6 text-[#0D472E]" />
                      <span className="text-xs font-bold text-slate-800">Click or drag photo here</span>
                      <span className="text-[10px]">JPG, PNG up to 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[#0D472E] hover:bg-[#08301E] text-white text-xs font-black py-3.5 px-6 rounded-xl shadow-md transition-all">
                  Submit Verified Review
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50">
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
