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
  const { products } = useProducts();

  const productList = products && products.length > 0 ? products : MOCK_PRODUCTS;

  const product = productList.find(
    (p) => p.slug === slug || p._id === slug || p.id === slug
  ) || productList[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

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

  const relatedProducts = productList.filter(
    (p) => (p._id || p.id) !== id
  ).slice(0, 4);

  const productFaqs = product.faqs || [
    { question: 'Is the product safe to use?', answer: 'Yes, 100% dermatologically tested and AYUSH certified formula with zero harmful additives.' },
    { question: 'How long until I notice results?', answer: 'Noticeable stamina & duration improvement within 10-14 days of consistent daily application.' },
    { question: 'Is delivery packaging discreet?', answer: 'Yes! Delivered in plain, unmarked safety boxes with zero logos or product text on the exterior.' }
  ];

  return (
    <div className="bg-[#F9F9F6] min-h-screen py-6">
      <SEO
        title={`${product.name} — ${BRAND_NAME} Care`}
        description={product.benefitSummary || product.description}
      />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-[#0D472E]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#0D472E]">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate">{product.name}</span>
        </nav>

        {/* SECTION 1: PRODUCT TOP BUYING SECTION (Screenshot 1 Match) */}
        <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Product Images */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200 p-4 shadow-2xs">
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
                <span className="bg-[#0D472E] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  BEST SELLER
                </span>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Save to Wishlist"
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all z-10 ${
                  isSaved
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white/90 text-slate-700 hover:text-rose-600 border border-slate-200'
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
                        ? 'border-[#0D472E] shadow-sm scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {product.benefitSummary || product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating || 4.9}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  ({(product.reviewCount || 1420).toLocaleString()} Reviews)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#F9F9F6] border border-slate-200/80 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-heading font-black text-slate-900">
                  {formatCurrency(currentPrice)}
                </span>
                {currentCompare > currentPrice && (
                  <span className="text-lg text-slate-400 line-through font-medium">
                    {formatCurrency(currentCompare)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-2.5 py-1 rounded-full border border-emerald-200">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Inclusive of all taxes • <strong>FREE Shipping</strong> on orders over ₹499 & COD Available
              </p>
            </div>

            {/* Pack Selector */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-800 tracking-wider">
                Select Pack:
              </label>

              <div className="grid grid-cols-2 gap-3">
                {packs.map((pack, idx) => {
                  const isSelected = selectedPackIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#0D472E] bg-[#0D472E]/5 shadow-xs ring-2 ring-[#0D472E]/20'
                          : 'border-slate-200 bg-white hover:border-[#0D472E]'
                      }`}
                    >
                      <div className="font-heading font-extrabold text-xs text-slate-900">{pack.name}</div>
                      <div className="text-sm font-black text-[#0D472E] mt-0.5">{formatCurrency(pack.price)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to Cart Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 bg-white rounded-xl h-[52px] px-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 text-slate-600 hover:text-black"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 text-slate-600 hover:text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-[52px] rounded-xl bg-[#0D472E] hover:bg-[#08301E] text-white font-heading font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>

            {/* Circular Clinical Stat Rings (Screenshot 1 Match) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="p-4 rounded-2xl bg-[#F9F9F6] border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-4 border-[#0D472E] text-[#0D472E] font-heading font-black text-sm flex items-center justify-center shrink-0">
                  85%
                </div>
                <div className="text-xs font-bold text-slate-800 leading-snug">
                  85% reported longer lasting stamina & duration
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9F9F6] border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-4 border-[#0D472E] text-[#0D472E] font-heading font-black text-sm flex items-center justify-center shrink-0">
                  90%
                </div>
                <div className="text-xs font-bold text-slate-800 leading-snug">
                  90% confirmed zero numbness or side effects
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION 2: FOR THE MODERN MEN - CUSTOMER REVIEWS WITH IMAGE UPLOADS (Screenshot 1 Match) */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto pt-4">
            <h2 className="text-3xl font-heading font-black text-slate-900">
              For The Modern Men
            </h2>
          </div>

          <ReviewsSection productId={id} />
        </div>

        {/* SECTION 3: BETTER TOGETHER COMBO BOX (Screenshot 1 Match) */}
        <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-2">
            <span className="eyebrow-label text-[#0D472E]">RECOMMENDED BUNDLE</span>
            <h2 className="text-3xl font-heading font-black text-slate-900">
              Better Together
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Combine climax control sprays with daily Shilajit stamina capsules for peak internal & external performance.
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#F9F9F6] p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-[#0D472E] bg-emerald-100 px-2 py-0.5 rounded-full">
                BEST VALUE BUNDLE
              </span>
              <h4 className="font-heading font-black text-lg text-slate-900">Longer & Stronger Regimen Kit</h4>
              <div className="text-sm font-black text-[#0D472E]">₹999 <span className="text-xs text-slate-400 line-through font-medium">₹1,698</span></div>
            </div>
            <button
              onClick={() => {
                addToCart({ _id: 'bold_ultimate_combo_kit', name: 'Longer & Stronger Ultimate Combo Kit', price: 999 }, 1);
              }}
              className="bg-[#0D472E] text-white font-black text-xs py-3.5 px-7 rounded-full shadow-md hover:bg-[#08301E]"
            >
              ADD BUNDLE TO CART
            </button>
          </div>
        </div>

        {/* SECTION 4: YOU MAY ALSO LIKE (Screenshot 1 Match) */}
        <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              You may also like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>

        {/* SECTION 5: FREQUENTLY ASKED QUESTIONS (Screenshot 1 Match) */}
        <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-heading font-black text-slate-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {productFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 text-left font-heading font-bold text-slate-900 text-sm flex items-center justify-between bg-[#F9F9F6] hover:bg-slate-100"
                  >
                    <span>{faq.question}</span>
                    <div className="w-6 h-6 rounded-full bg-white text-[#0D472E] flex items-center justify-center shrink-0 border border-slate-200">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-200">
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
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3 sm:hidden shadow-2xl flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-500">{packs[selectedPackIndex].name}</div>
          <div className="text-lg font-heading font-black text-slate-900 leading-none">{formatCurrency(currentPrice)}</div>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-[#0D472E] text-white font-heading font-black text-xs py-3 px-6 rounded-xl flex items-center gap-1.5 shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ADD TO CART</span>
        </button>
      </div>

    </div>
  );
};

export default ProductDetail;
