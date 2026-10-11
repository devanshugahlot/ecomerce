import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Truck,
  PackageCheck,
  Star,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Package,
  FolderTree,
  Image as ImageIcon
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { CategoryScroll } from '../components/common/CategoryScroll';
import { BRAND_NAME } from '../utils/constants';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../context/ProductContext';

export const Home = () => {
  const { products, categories, siteBanners, seedSampleData } = useProducts();
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedBestsellerCategory, setSelectedBestsellerCategory] = useState('All');
  const [bestsellerSliderIdx, setBestsellerSliderIdx] = useState(0);
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const categoriesList = ['All', ...categories.map(c => c.slug || c.name)];

  const displayedBestsellers = selectedBestsellerCategory === 'All'
    ? products
    : products.filter((p) => (p.category || '').toLowerCase() === selectedBestsellerCategory.toLowerCase());

  const handleNextBestseller = () => {
    setBestsellerSliderIdx((prev) => (prev + 1) % Math.max(1, displayedBestsellers.length - 3));
  };

  const handlePrevBestseller = () => {
    setBestsellerSliderIdx((prev) => (prev === 0 ? Math.max(0, displayedBestsellers.length - 4) : prev - 1));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('Subscribed! Check email for discount codes.', 'success');
    setEmail('');
  };

  const faqs = [
    {
      q: 'Is the outer packaging 100% discreet?',
      a: 'Yes! All orders arrive in plain, unbranded safety boxes with zero logos, brand names, or product descriptions on the exterior label. Your privacy is 100% guaranteed.'
    },
    {
      q: 'How fast will my order be delivered?',
      a: 'Orders are dispatched within 24 hours. Metro cities receive delivery in 24-48 hours; all other PIN codes across India receive delivery in 2-4 business days.'
    },
    {
      q: 'Are Cash on Delivery (COD) orders accepted?',
      a: 'Yes! Cash on Delivery is available across 19,000+ PIN codes in India with zero extra charge.'
    }
  ];

  return (
    <div className="bg-white min-h-screen py-2 sm:py-4 space-y-6 sm:space-y-10 text-[#0A0A0A]">
      <SEO
        title={`${BRAND_NAME} — Premium Men's Wellness`}
        description="Premium men's wellness formulations. 100% discreet packaging, Cash on Delivery available."
      />

      {/* 3. ROUND CATEGORY ICONS STRIP (REAL CATEGORIES) */}
      {categories && categories.length > 0 && (
        <section className="max-w-[1536px] mx-auto">
          <CategoryScroll
            activeCategory={selectedBestsellerCategory}
            onSelectCategory={(cat) => setSelectedBestsellerCategory(cat)}
          />
        </section>
      )}

      {/* 4. HERO BANNER: Tall on mobile (4:5 ratio) and wide on desktop */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-[#E5E5E5] bg-neutral-900 group">
          <div className="w-full aspect-[4/5] sm:aspect-[16/7] lg:aspect-[21/9] max-h-[580px] overflow-hidden relative">
            <img
              src={siteBanners?.heroBanner || '/images/hero_banner.png'}
              alt="Hypril Hero Banner"
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
            />
            {/* Overlay with Shop Now button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-10">
              <div className="space-y-3">
                <Link
                  to="/shop"
                  className="bg-black hover:bg-neutral-800 text-white font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2 text-xs sm:text-sm tracking-wide shadow-lg border border-white/20 min-h-[48px] transition-all active:scale-[0.98]"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BESTSELLERS: 2-column on mobile, 4 on desktop */}
      <section className="section-card-float">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="eyebrow-label text-[#6B6B6B]">BESTSELLERS</span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-black">
              Bestsellers
            </h2>
          </div>

          {categoriesList.length > 1 && (
            <div className="flex items-center gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedBestsellerCategory(cat);
                      setBestsellerSliderIdx(0);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap min-h-[36px] ${
                      selectedBestsellerCategory === cat
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-[#F5F5F5] text-neutral-800 hover:bg-[#E5E5E5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {displayedBestsellers.length > 4 && (
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handlePrevBestseller}
                    className="w-10 h-10 rounded-full border border-[#E5E5E5] text-black flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
                    aria-label="Previous bestsellers"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextBestseller}
                    className="w-10 h-10 rounded-full border border-black bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                    aria-label="Next bestsellers"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2-column grid on mobile, 4 on desktop */}
        {displayedBestsellers.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedBestsellers.slice(bestsellerSliderIdx, bestsellerSliderIdx + 4).map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F5F5F5] rounded-2xl border border-dashed border-[#E5E5E5] p-8 space-y-2">
            <Package className="w-10 h-10 text-neutral-400 mx-auto" />
            <h4 className="font-heading font-bold text-neutral-800 text-base">No products available</h4>
            <p className="text-xs text-neutral-500">Check back soon for new arrivals in our catalog.</p>
          </div>
        )}
      </section>

      {/* SECTION 3: YOUR NIGHT, YOUR RULES SUMMARY BAR */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-8">
        <div className="bg-black text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center space-y-2 border border-neutral-900 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">PREMIUM WELLNESS</span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black">Your Night, Your Rules.</h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto font-medium">
            100% Plain Box Discreet Packaging Across India
          </p>
        </div>
      </section>

      {/* SECTION 4: SHOP BY CATEGORY */}
      {categories && categories.length > 0 && (
        <section className="section-card-float">
          <div className="mb-6">
            <span className="eyebrow-label text-[#6B6B6B]">EXPLORE CATALOG</span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-black">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug || cat._id}
                to={`/shop?category=${cat.slug || cat.name}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-[#E5E5E5] bg-[#F5F5F5]"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center">
                    <FolderTree className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heading font-bold text-sm leading-tight text-white group-hover:text-neutral-200 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5: PROMO BANNER IMAGE */}
      {siteBanners?.promoBanner1 && (
        <section className="max-w-[1536px] mx-auto px-4 sm:px-8">
          <Link to="/shop" className="block relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-[#E5E5E5] group">
            <img
              src={siteBanners.promoBanner1}
              alt="Promo Banner"
              className="w-full h-auto max-h-[320px] object-cover rounded-2xl sm:rounded-3xl group-hover:scale-[1.01] transition-transform duration-500"
            />
          </Link>
        </section>
      )}

      {/* SECTION 6: FAQ ACCORDION SECTION */}
      <section id="faq" className="max-w-[1536px] mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="eyebrow-label text-[#6B6B6B]">GOT QUESTIONS?</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-black">
              Your Questions, Answered
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#E5E5E5] rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left font-heading font-bold text-black text-sm sm:text-base flex items-center justify-between bg-white hover:bg-[#F5F5F5] min-h-[48px]"
                  >
                    <span>{faq.q}</span>
                    <div className="w-7 h-7 rounded-full bg-[#F5F5F5] text-black flex items-center justify-center shrink-0 border border-[#E5E5E5]">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 bg-[#F5F5F5] text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-[#E5E5E5]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: WEEKLY NEWSLETTER */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-8">
        <div className="bg-[#F5F5F5] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-black">
            Stay in the loop with our weekly newsletter
          </h2>
          <p className="text-xs text-neutral-600 font-medium max-w-md mx-auto">
            Get exclusive wellness tips, product guides, and special discount codes delivered straight to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-[#E5E5E5] rounded-full px-5 py-3 text-xs font-medium focus:outline-none focus:border-black min-h-[48px]"
            />
            <button
              type="submit"
              className="btn-primary bg-black hover:bg-neutral-800 text-white text-xs font-bold py-3 px-8 rounded-full min-h-[48px] shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
