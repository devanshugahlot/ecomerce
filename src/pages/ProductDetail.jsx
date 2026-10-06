import React, { useState, useEffect } from 'react';
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
  Package,
  Stethoscope,
  ChevronRight
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

  // Find product by slug or id
  const product = MOCK_PRODUCTS.find(
    (p) => p.slug === slug || p._id === slug || p.id === slug
  ) || MOCK_PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [pinCode, setPinCode] = useState('');
  const [deliveryChecked, setDeliveryChecked] = useState(false);

  // Review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      name: "Ankit M.",
      rating: 5,
      date: "2 days ago",
      text: "Extremely effective. Delivered within 48 hours in a plain brown box without any label identifying the contents.",
      verified: true
    },
    {
      name: "Siddharth K.",
      rating: 5,
      date: "1 week ago",
      text: "Superb formula quality. Noticed improved daily energy and workouts. Will definitely reorder the 3-month supply.",
      verified: true
    }
  ]);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const id = product._id || product.id;
  const isSaved = isInWishlist(id);
  const discount = calculateDiscount(product.price, product.comparePrice);

  const variants = [
    { id: '1-pack', name: '1 Month Supply (Standard)', price: product.price },
    { id: '3-pack', name: '3 Month Supply (Save 20%)', price: Math.round(product.price * 2.4) },
  ];

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || variants[0]);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant || variants[0]);
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
      addToast('Please provide your name and review comment', 'error');
      return;
    }
    const newRev = {
      name: reviewName,
      rating: reviewRating,
      date: "Just now",
      text: reviewText,
      verified: true
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewText('');
    setReviewName('');
    addToast('Thank you! Your verified review has been published.', 'success');
  };

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && (p._id || p.id) !== id
  ).slice(0, 4);

  const productUrl = `https://vyro.men/products/${product.slug || id}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": product.name,
        "image": images,
        "description": product.description || product.benefitSummary,
        "sku": `VYRO-${id}`,
        "brand": {
          "@type": "Brand",
          "name": "VYRO"
        },
        "offers": {
          "@type": "Offer",
          "url": productUrl,
          "priceCurrency": "INR",
          "price": currentPrice,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "VYRO Wellness"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating || 4.9,
          "reviewCount": product.reviewCount || 342
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vyro.men/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Shop",
            "item": "https://vyro.men/shop"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.name,
            "item": productUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 bg-[#FAF9F6] text-slate-900">
      <SEO
        title={`${product.name} — Buy Online in India`}
        description={`Buy ${product.name} online. ${product.benefitSummary || product.description} Free express shipping & 100% discreet packaging.`}
        canonicalUrl={productUrl}
        jsonLd={productJsonLd}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-emerald-700">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-700 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery - Left 6 Columns */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isBestSeller && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="amber">Bestseller</Badge>
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="emerald">{discount}% OFF</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border-2 transition-all ${
                    selectedImage === idx ? 'border-emerald-600 scale-95' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Options - Right 6 Columns */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-emerald-700 font-extrabold uppercase tracking-widest">
                {product.category}
              </span>
              <RatingStars rating={product.rating || 4.9} reviewCount={product.reviewCount || 300} />
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
              {product.benefitSummary || product.description}
            </p>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-[#FEF8EC] border border-amber-200 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatCurrency(currentPrice)}
              </span>
              {product.comparePrice > currentPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                In Stock • Express Shipping
              </span>
            </div>
          </div>

          {/* Variant Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Select Supply Pack
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    (selectedVariant?.id || variants[0].id) === v.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-extrabold text-slate-900">{v.name}</span>
                  <span className="block text-slate-500 mt-1 font-semibold">{formatCurrency(v.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector + Add to Cart + Wishlist */}
          <div className="space-y-4 pt-2">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-white px-2 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-slate-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-extrabold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-500 hover:text-slate-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button onClick={handleAddToCart} className="btn-primary flex-1 text-xs sm:text-sm py-3.5 font-bold">
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSaved
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now — Instant Checkout</span>
            </button>
          </div>

          {/* PIN Code Delivery Checker */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              Check Estimated Delivery
            </h4>
            <form onSubmit={handleCheckDelivery} className="flex gap-2">
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Enter 6-digit Indian PIN Code"
                maxLength={6}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button type="submit" className="btn-secondary text-xs px-4 py-2 font-bold">
                Check
              </button>
            </form>
            {deliveryChecked && (
              <p className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Guaranteed 2-Day Express Delivery to PIN {pinCode}.
              </p>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-700 font-bold pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Discreet Plain Box</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-amber-600" />
              <span>Doctor Formulated Extract</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED TABS SECTION */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        {/* Navigation Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-6 text-sm font-bold">
          {[
            { id: 'description', label: 'Formula Science' },
            { id: 'ingredients', label: 'Active Ingredients' },
            { id: 'usage', label: 'How To Use' },
            { id: 'reviews', label: `Reviews (${reviewsList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm font-medium">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h3 className="font-serif font-extrabold text-lg text-slate-900">Full Clinical Product Description</h3>
              <p>{product.description}</p>
              {product.benefits && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-extrabold text-slate-900">Key Formula Benefits:</h4>
                  <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
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
              <h3 className="font-serif font-extrabold text-lg text-slate-900">100% Transparent Active Ingredients</h3>
              <p className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-emerald-800 font-mono text-xs font-semibold">
                {product.ingredients || 'Standardized active extracts: L-Arginine, Gokshura (500mg), Safed Musli, Zinc Monomethionine.'}
              </p>
              <p className="text-slate-500 text-xs">
                Zero artificial colors, heavy metals, or undisclosed synthetic compounds. Every batch is certified under FSSAI and GMP guidelines.
              </p>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4">
              <h3 className="font-serif font-extrabold text-lg text-slate-900">Recommended Dosage & Instructions</h3>
              <p>{product.usage || 'Take 2 gummies/capsules daily with water or milk after meals. For optimal results, use consistently for 60 to 90 days.'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-base">Write a Verified Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Vikram R."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    >
                      <option value={5}>5 Stars — Excellent</option>
                      <option value={4}>4 Stars — Very Good</option>
                      <option value={3}>3 Stars — Average</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Your Feedback</label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this formula..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium"
                  />
                </div>
                <button type="submit" className="btn-primary text-xs py-2.5 px-6 font-bold">
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs">{rev.name}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-serif font-extrabold text-slate-900">
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="block text-[10px] text-slate-500 font-bold uppercase">Total Price</span>
          <span className="text-lg font-black text-slate-900">{formatCurrency(currentPrice)}</span>
        </div>
        <button onClick={handleAddToCart} className="btn-primary flex-1 py-2.5 text-xs font-bold">
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
