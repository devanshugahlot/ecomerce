import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Plus,
  Minus,
  Star,
  Zap,
  PackageCheck,
  Stethoscope,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Lock,
  Play
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { RatingStars } from '../components/common/RatingStars';
import { Badge } from '../components/common/Badge';
import { ProductCard } from '../components/common/ProductCard';
import { MOCK_PRODUCTS } from '../utils/mockProducts';
import { formatCurrency, calculateDiscount } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const product = MOCK_PRODUCTS.find(
    (p) => p.slug === slug || p._id === slug || p.id === slug
  ) || MOCK_PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('science');
  const [pinCode, setPinCode] = useState('');
  const [deliveryChecked, setDeliveryChecked] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      name: "Rohan S.",
      rating: 5,
      date: "Verified Buyer • 3 days ago",
      text: "Superb formula quality. Delivered in a plain brown box without any product name on the shipping label. Highly recommend!",
      verified: true
    },
    {
      name: "Vikram R.",
      rating: 5,
      date: "Verified Buyer • 1 week ago",
      text: "Authentic Shilajit resin. Noticeable energy boost in daily gym sessions and bedroom stamina within 7 days.",
      verified: true
    }
  ]);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const id = product._id || product.id;
  const isSaved = isInWishlist(id);

  const packs = product.packs && product.packs.length > 0 ? product.packs : null;
  const currentPrice = packs ? packs[selectedPackIndex].price : product.price;
  const currentCompare = packs ? packs[selectedPackIndex].comparePrice : product.comparePrice;
  const discount = calculateDiscount(currentPrice, currentCompare);

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'];

  const handleAddToCart = () => {
    const variant = packs ? { name: packs[selectedPackIndex].name } : null;
    addToCart({ ...product, price: currentPrice }, quantity, variant);
  };

  const handleBuyNow = () => {
    const variant = packs ? { name: packs[selectedPackIndex].name } : null;
    addToCart({ ...product, price: currentPrice }, quantity, variant);
    navigate('/checkout');
  };

  const handleCheckDelivery = (e) => {
    e.preventDefault();
    if (pinCode.length === 6 && /^\d+$/.test(pinCode)) {
      setDeliveryChecked(true);
      addToast('Express delivery available for PIN ' + pinCode, 'success');
    } else {
      addToast('Please enter a valid 6-digit Indian PIN code', 'error');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewText) {
      addToast('Please provide your name and review text', 'error');
      return;
    }
    const newRev = {
      name: reviewName,
      rating: reviewRating,
      date: "Verified Buyer • Just now",
      text: reviewText,
      verified: true
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewText('');
    setReviewName('');
    addToast('Thank you! Your review has been published.', 'success');
  };

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && (p._id || p.id) !== id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 bg-[#FAF7F2] text-[#1B1F1D]">
      <SEO
        title={`${product.name} — Bold Care Official Store`}
        description={`Buy ${product.name} online in India. ${product.benefitSummary || product.description} Free express shipping & 100% plain box discreet packaging.`}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-[#5B655F]">
        <Link to="/" className="hover:text-[#0F3D2B]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-[#0F3D2B]">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0F3D2B] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Rx Prescription Warning Notice (If Applicable) */}
      {product.isRx && (
        <div className="bg-[#FAF4E8] border border-[#B8924A]/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#1B1F1D] shadow-sm">
          <AlertCircle className="w-5 h-5 text-[#B8924A] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-[#0F3D2B]">Clinical Formulation Notice:</h4>
            <p className="text-[#5B655F] font-medium leading-relaxed">
              {product.rxNotice || 'This is a potent clinical formulation. Always consult a certified medical practitioner before starting dosage.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Product Purchase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Gallery & Images (4:5 Ratio) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden border border-[#E4E0D8] shadow-premium">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.isBestSeller && (
                <span className="bg-[#B8924A] text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Bestseller
                </span>
              )}
              {discount > 0 && (
                <span className="bg-[#B5472F] text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Discreet Delivery Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#E4E0D8] text-xs text-[#0F3D2B] font-extrabold flex items-center justify-center gap-2 shadow-sm">
              <PackageCheck className="w-4 h-4 text-[#B8924A]" />
              <span>100% Plain Unmarked Outer Box Guaranteed</span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 transition-all ${
                    selectedImage === idx ? 'border-[#0F3D2B] scale-95 shadow-md' : 'border-[#E4E0D8] opacity-70'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buy Box & Options */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#0F3D2B] font-extrabold uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-[#B8924A] font-extrabold">
                <Star className="w-4 h-4 fill-[#B8924A]" />
                <span className="text-sm">{product.rating || 4.9}</span>
                <span className="text-[#5B655F] text-xs font-normal">({product.reviewCount || 342} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#1B1F1D] leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#5B655F] leading-relaxed font-medium pt-1">
              {product.benefitSummary || product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E0D8] shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#0F3D2B]">
                  {formatCurrency(currentPrice)}
                </span>
                {currentCompare > currentPrice && (
                  <span className="text-sm text-[#5B655F] line-through">
                    {formatCurrency(currentCompare)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-emerald-800 font-bold">Inclusive of all taxes & plain box delivery</span>
            </div>

            <span className="text-xs font-extrabold text-[#0F3D2B] bg-[#EEF3EE] px-3.5 py-1.5 rounded-full border border-[#0F3D2B]/20">
              In Stock
            </span>
          </div>

          {/* Pack Options Selector Pills */}
          {packs && (
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold text-[#1B1F1D] uppercase tracking-wider block">
                Select Supply Pack:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packs.map((pack, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPackIndex(idx)}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition-all relative ${
                      selectedPackIndex === idx
                        ? 'bg-[#EEF3EE] border-[#0F3D2B] text-[#0F3D2B] shadow-sm'
                        : 'bg-white border-[#E4E0D8] text-[#1B1F1D] hover:border-[#0F3D2B]'
                    }`}
                  >
                    <span className="block font-extrabold text-sm text-[#1B1F1D]">{pack.name}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-black text-[#0F3D2B]">₹{pack.price}</span>
                      <span className="text-[10px] font-extrabold bg-[#B5472F] text-white px-2 py-0.5 rounded-full uppercase">
                        {pack.savings}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#E4E0D8] rounded-full bg-white px-2 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#5B655F] hover:text-[#1B1F1D]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-black text-[#1B1F1D]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#5B655F] hover:text-[#1B1F1D]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button onClick={handleAddToCart} className="btn-primary flex-1 py-4 text-xs sm:text-sm font-extrabold shadow-glow-forest">
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-full border transition-all ${
                  isSaved
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white border-[#E4E0D8] text-[#5B655F] hover:text-[#1B1F1D]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now */}
            <button
              onClick={handleBuyNow}
              className="btn-gold w-full py-4 text-xs sm:text-sm font-extrabold shadow-glow-gold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now — Instant Checkout</span>
            </button>
          </div>

          {/* PIN Code Delivery Estimator */}
          <div className="p-4 rounded-2xl bg-white border border-[#E4E0D8] space-y-3 shadow-sm">
            <h4 className="text-xs font-extrabold text-[#1B1F1D] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0F3D2B]" />
              Check Estimated Delivery:
            </h4>
            <form onSubmit={handleCheckDelivery} className="flex gap-2">
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Enter 6-digit PIN code"
                maxLength={6}
                className="flex-1 bg-[#FAF7F2] border border-[#E4E0D8] rounded-xl px-3 py-2 text-xs text-[#1B1F1D] font-bold focus:outline-none focus:border-[#0F3D2B]"
              />
              <button type="submit" className="btn-secondary py-2 px-4 text-xs font-bold shrink-0">
                Check
              </button>
            </form>
            {deliveryChecked && (
              <p className="text-[11px] text-[#0F3D2B] font-extrabold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B8924A]" />
                Guaranteed 2-Day Express Delivery to PIN {pinCode}.
              </p>
            )}
          </div>

          {/* Trust Pillars */}
          <div className="grid grid-cols-2 gap-3 text-[11px] font-extrabold text-[#0F3D2B] pt-2 border-t border-[#E4E0D8]">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#B8924A]" />
              <span>100% Plain Box Outer Label</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#B8924A]" />
              <span>Doctor-Reviewed Dosages</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCIENCE, USAGE, WHO IT IS FOR TABS */}
      <div className="space-y-6 pt-6 border-t border-[#E4E0D8]">
        <div className="flex border-b border-[#E4E0D8] overflow-x-auto gap-6 text-sm font-bold">
          {[
            { id: 'science', label: 'Clinical Science' },
            { id: 'ingredients', label: 'Active Ingredients' },
            { id: 'usage', label: 'How To Use' },
            { id: 'who', label: 'Who It Is For' },
            { id: 'reviews', label: `Verified Reviews (${reviewsList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#0F3D2B] text-[#0F3D2B] font-extrabold'
                  : 'border-transparent text-[#5B655F] hover:text-[#1B1F1D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E0D8] text-xs sm:text-sm text-[#1B1F1D] leading-relaxed shadow-premium font-medium">
          {activeTab === 'science' && (
            <div className="space-y-4">
              <h3 className="font-serif font-extrabold text-lg text-[#0F3D2B]">Formula Overview & Science</h3>
              <p>{product.description}</p>
              {product.benefits && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-extrabold text-[#1B1F1D]">Key Clinical Benefits:</h4>
                  <ul className="space-y-1.5 list-disc pl-5 text-[#5B655F]">
                    {product.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h3 className="font-serif font-extrabold text-lg text-[#0F3D2B]">100% Transparent Active Ingredients</h3>
              <p className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E4E0D8] font-mono text-xs text-[#0F3D2B] font-bold">
                {product.ingredients || 'Standardized active extracts: L-Arginine, Gokshura (500mg), Safed Musli, Zinc Monomethionine.'}
              </p>
              <p className="text-[#5B655F] text-xs">
                Zero artificial colors, steroids, or unlisted compounds. Certified under FSSAI and ISO guidelines.
              </p>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4">
              <h3 className="font-serif font-extrabold text-lg text-[#0F3D2B]">Recommended Dosage & Application</h3>
              <p>{product.usage || 'Consume 2 gummies/capsules daily with water or milk after meals. For optimal stamina, use consistently for 60 to 90 days.'}</p>
            </div>
          )}

          {activeTab === 'who' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#EEF3EE] border border-[#0F3D2B]/20 space-y-2">
                <h4 className="font-extrabold text-sm text-[#0F3D2B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F3D2B]" /> Who It Is For
                </h4>
                <p className="text-xs text-[#1B1F1D] leading-relaxed">
                  {product.whoFor || "Men seeking natural daily stamina, improved blood flow, and sexual energy."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF4E8] border border-[#B8924A]/30 space-y-2">
                <h4 className="font-extrabold text-sm text-[#B8924A] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#B8924A]" /> Who It Is NOT For
                </h4>
                <p className="text-xs text-[#1B1F1D] leading-relaxed">
                  {product.whoNotFor || "Not intended for minors under 18 or individuals undergoing acute cardiovascular treatment."}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E4E0D8] space-y-4">
                <h4 className="font-extrabold text-[#1B1F1D] text-base">Write a Verified Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5B655F] mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Rohan S."
                      className="w-full bg-white border border-[#E4E0D8] rounded-xl px-3 py-2 text-xs text-[#1B1F1D] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5B655F] mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full bg-white border border-[#E4E0D8] rounded-xl px-3 py-2 text-xs text-[#1B1F1D] font-bold"
                    >
                      <option value={5}>5 Stars — Excellent</option>
                      <option value={4}>4 Stars — Very Good</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5B655F] mb-1">Your Feedback</label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this formula..."
                    className="w-full bg-white border border-[#E4E0D8] rounded-xl p-3 text-xs text-[#1B1F1D] font-medium"
                  />
                </div>
                <button type="submit" className="btn-primary text-xs py-2.5 px-6 font-extrabold">
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E4E0D8] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#1B1F1D] text-xs">{rev.name}</span>
                      <span className="text-[10px] text-[#5B655F]">{rev.date}</span>
                    </div>
                    <div className="flex text-[#B8924A]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#B8924A]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#5B655F] font-medium">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FREQUENTLY BOUGHT TOGETHER */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#E4E0D8]">
          <h2 className="text-2xl font-serif font-extrabold text-[#1B1F1D]">
            Frequently Bought Together
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp._id || rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

      {/* MOBILE STICKY PURCHASE BAR */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E4E0D8] p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="block text-[10px] text-[#5B655F] font-bold uppercase">Price</span>
          <span className="text-lg font-black text-[#0F3D2B]">{formatCurrency(currentPrice)}</span>
        </div>
        <button onClick={handleAddToCart} className="btn-primary flex-1 py-3 text-xs font-bold shadow-glow-forest">
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
