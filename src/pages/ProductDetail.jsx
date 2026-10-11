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
  ArrowRight
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { ReviewsSection } from '../components/common/ReviewsSection';
import { MOCK_PRODUCTS } from '../utils/mockProducts';
import { formatCurrency, calculateDiscount } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../context/ProductContext';
import { BRAND_NAME } from '../utils/constants';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const product = products.find(
    (p) => p.slug === slug || p._id === slug || p.id === slug
  );

  if (loading && !product) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-neutral-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-heading font-black text-black">Product Not Found</h2>
        <p className="text-xs text-neutral-500">This product is not available in the catalog yet.</p>
        <Link to="/shop" className="btn-primary inline-flex items-center justify-center text-xs py-3.5 px-6 rounded-full min-h-[48px]">
          Browse Storefront
        </Link>
      </div>
    );
  }

  const id = product._id || product.id;
  const isSaved = isInWishlist(id);

  const packs = product.packs && product.packs.length > 0 ? product.packs : [
    { name: 'Pack of 1', price: product.price, comparePrice: product.comparePrice, savings: '37% OFF' },
    { name: 'Pack of 2', price: Math.round(product.price * 1.8), comparePrice: (product.comparePrice || product.price * 1.3) * 2, savings: '44% OFF' },
  ];
  
  const currentPrice = packs ? packs[selectedPackIndex].price : product.price;
  const currentCompare = packs ? packs[selectedPackIndex].comparePrice : product.comparePrice;
  const discount = calculateDiscount(currentPrice, currentCompare);

  const images = product.images && product.images.length > 0
    ? product.images
    : [
        product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      ];

  const handleAddToCart = () => {
    const variant = packs ? { name: packs[selectedPackIndex].name } : null;
    addToCart({ ...product, price: currentPrice }, quantity, variant);
  };

  const handleCheckDelivery = (e) => {
    e.preventDefault();
    if (pinCode.length === 6 && /^\d+$/.test(pinCode)) {
      setDeliveryChecked(true);
      addToast('Express delivery available for PIN ' + pinCode, 'success');
    } else {
      addToast('Please enter a valid 6-digit PIN code', 'error');
    }
  };

  const relatedProducts = (products || []).filter(
    (p) => (p._id || p.id) !== id
  ).slice(0, 4);

  const productFaqs = product.faqs || [
    { question: 'Is the product safe to use?', answer: 'Yes, 100% dermatologically tested and AYUSH certified formula with zero harmful additives.' },
    { question: 'How long until I notice results?', answer: 'Noticeable stamina & duration improvement within 10-14 days of consistent daily application.' },
    { question: 'Is delivery packaging discreet?', answer: 'Yes! Delivered in plain, unmarked safety boxes with zero logos or product text on the exterior.' }
  ];

  return (
    <div className="bg-white min-h-screen py-6">
      <SEO
        title={`${product.name} — ${BRAND_NAME} Care`}
        description={product.benefitSummary || product.description}
      />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 font-medium overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-black font-bold truncate">{product.name}</span>
        </nav>

        {/* SECTION 1: PRODUCT TOP BUYING SECTION */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Product Images */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200 p-4 shadow-2xs">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover object-center rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800';
                }}
              />
              
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                <span className="bg-brand-green text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  BEST SELLER
                </span>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Save to Wishlist"
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all z-10 ${
                  isSaved
                    ? 'bg-brand-green text-white shadow-md'
                    : 'bg-white/90 text-neutral-800 hover:text-black border border-neutral-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
                      selectedImage === idx
                        ? 'border-black shadow-xs scale-105'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Buying Options */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-black leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                {product.benefitSummary || product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 text-neutral-900 font-bold text-xs px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating || 4.9}</span>
                </div>
                <span className="text-xs font-semibold text-neutral-600">
                  ({(product.reviewCount || 1420).toLocaleString()} Reviews)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-heading font-black text-black">
                  {formatCurrency(currentPrice)}
                </span>
                {currentCompare > currentPrice && (
                  <span className="text-lg text-neutral-400 line-through font-medium">
                    {formatCurrency(currentCompare)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-neutral-200 text-black font-bold text-xs px-2.5 py-1 rounded-full border border-neutral-300">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">
                Inclusive of all taxes • <strong>Free Shipping</strong> on orders over ₹499 & COD Available
              </p>
            </div>

            {/* Pack Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-neutral-800 tracking-wider">
                Select Pack:
              </label>

              <div className="grid grid-cols-2 gap-3">
                {packs.map((pack, idx) => {
                  const isSelected = selectedPackIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative min-h-[48px] ${
                        isSelected
                          ? 'border-black bg-neutral-100 shadow-2xs ring-1 ring-black'
                          : 'border-neutral-200 bg-white hover:border-black'
                      }`}
                    >
                      <div className="font-heading font-bold text-xs text-black">{pack.name}</div>
                      <div className="text-sm font-black text-black mt-0.5">{formatCurrency(pack.price)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to Cart Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 bg-white rounded-xl h-[48px] min-h-[48px] px-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-neutral-600 hover:text-black min-w-[32px] flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-sm text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 text-neutral-600 hover:text-black min-w-[32px] flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 h-[48px] min-h-[48px] rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>

            {/* Clinical Stat Rings */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-4 border-black text-black font-heading font-black text-sm flex items-center justify-center shrink-0">
                  85%
                </div>
                <div className="text-xs font-bold text-neutral-800 leading-snug">
                  85% reported longer lasting stamina & duration
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-4 border-black text-black font-heading font-black text-sm flex items-center justify-center shrink-0">
                  90%
                </div>
                <div className="text-xs font-bold text-neutral-800 leading-snug">
                  90% confirmed high satisfaction & smooth absorption
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION 2: CUSTOMER REVIEWS */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto pt-4">
            <h2 className="text-3xl font-heading font-black text-black">
              Customer Reviews
            </h2>
          </div>

          <ReviewsSection productId={id} />
        </div>

        {/* SECTION 3: RECOMMENDED BUNDLE */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-2">
            <span className="eyebrow-label text-neutral-500">RECOMMENDED BUNDLE</span>
            <h2 className="text-3xl font-heading font-black text-black">
              Better Together
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Combine climax control sprays with daily Shilajit stamina capsules for peak internal & external performance.
            </p>
          </div>

          <div className="lg:col-span-7 bg-neutral-50 p-6 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-white bg-brand-green px-2.5 py-0.5 rounded-full">
                BEST VALUE BUNDLE
              </span>
              <h4 className="font-heading font-black text-lg text-black">Longer & Stronger Regimen Kit</h4>
              <div className="text-sm font-black text-black">₹999 <span className="text-xs text-neutral-400 line-through font-medium">₹1,698</span></div>
            </div>
            <button
              onClick={() => {
                addToCart({ _id: 'bold_ultimate_combo_kit', name: 'Longer & Stronger Ultimate Combo Kit', price: 999 }, 1);
              }}
              className="btn-primary text-white font-bold text-xs py-3.5 px-7 rounded-full shadow-xs min-h-[48px]"
            >
              ADD BUNDLE TO CART
            </button>
          </div>
        </div>

        {/* SECTION 4: YOU MAY ALSO LIKE */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-black">
              You may also like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>

        {/* SECTION 5: FREQUENTLY ASKED QUESTIONS */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-heading font-black text-black">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {productFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-neutral-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 text-left font-heading font-bold text-black text-sm flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 min-h-[48px]"
                  >
                    <span>{faq.question}</span>
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 border border-neutral-200">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-neutral-600 leading-relaxed border-t border-neutral-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM CART BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 p-3 sm:hidden shadow-lg flex items-center justify-between pb-safe">
        <div>
          <div className="text-xs font-bold text-neutral-500">{packs[selectedPackIndex].name}</div>
          <div className="text-lg font-heading font-black text-black leading-none">{formatCurrency(currentPrice)}</div>
        </div>

        <button
          onClick={handleAddToCart}
          className="btn-primary text-white font-heading font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1.5 shadow-xs min-h-[48px]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ADD TO CART</span>
        </button>
      </div>

    </div>
  );
};

export default ProductDetail;
