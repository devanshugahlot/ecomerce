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
  const { products, categories, siteBanners } = useProducts();
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
    <div className="bg-[#F9F9F6] min-h-screen py-4 space-y-6 sm:space-y-8">
      <SEO
        title={`${BRAND_NAME} Care — Official Storefront`}
        description="Doctor-approved male performance formulations. 100% discreet packaging, COD available."
      />

      {/* TOP STORY CATEGORY BUBBLES (DYNAMICALLY RENDERED FROM ADMIN) */}
      {categories && categories.length > 0 && (
        <section className="max-w-[1536px] mx-auto px-2 sm:px-6">
          <CategoryScroll
            activeCategory={selectedBestsellerCategory}
            onSelectCategory={(cat) => setSelectedBestsellerCategory(cat)}
          />
        </section>
      )}

      {/* SECTION 1: HERO BANNER (100:27 Aspect Ratio - Dynamic from Admin) */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-8">
        {siteBanners?.heroBanner ? (
          <Link to="/shop" className="block relative rounded-[24px] overflow-hidden shadow-sm border border-[#E6D7C3] group">
            <div className="w-full aspect-[100/27] max-h-[324px] bg-slate-100 overflow-hidden">
              <img
                src={siteBanners.heroBanner}
                alt="Bold Care Hero Banner"
                className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </Link>
        ) : (
          <div className="bg-[#FAF4E8] rounded-[24px] p-8 sm:p-12 text-center border border-[#E6D7C3] space-y-3">
            <ImageIcon className="w-10 h-10 text-[#0D472E] mx-auto" />
            <h2 className="text-2xl font-heading font-black text-slate-900">Welcome to {BRAND_NAME} Storefront</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              No hero banner uploaded yet. Upload your custom hero banner image from Admin Panel.
            </p>
            <Link to="/admin" className="bg-[#0D472E] text-white text-xs font-black py-3 px-6 rounded-full inline-block">
              Go to Admin Panel
            </Link>
          </div>
        )}
      </section>

      {/* SECTION 2: BESTSELLERS CATALOG */}
      <section className="section-card-float">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="eyebrow-label text-[#0D472E]">POPULAR PICK</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900">
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
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      selectedBestsellerCategory === cat
                        ? 'bg-[#0D472E] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                    className="w-10 h-10 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextBestseller}
                    className="w-10 h-10 rounded-full border border-[#0D472E] bg-[#0D472E] text-white flex items-center justify-center hover:bg-[#08301E]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clean Product Cards Grid */}
        {displayedBestsellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedBestsellers.slice(bestsellerSliderIdx, bestsellerSliderIdx + 4).map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F9F9F6] rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-heading font-black text-slate-800 text-base">No products added yet</h4>
            <p className="text-xs text-slate-500">Create products from Admin Panel to display them live on the storefront.</p>
            <Link to="/admin/products" className="bg-[#0D472E] text-white text-xs font-black py-2.5 px-5 rounded-full inline-block">
              Add Products in Admin
            </Link>
          </div>
        )}
      </section>

      {/* SECTION 3: YOUR NIGHT, YOUR RULES SUMMARY BAR */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-8">
        <div className="bg-[#0D472E] text-white rounded-[24px] p-6 sm:p-8 text-center space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E5B869]">CLINICAL WELLNESS</span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black">Your Night, Your Rules.</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto font-medium">
            100% Plain Box Discreet Packaging Across India
          </p>
        </div>
      </section>

      {/* SECTION 4: SHOP BY CATEGORY (DYNAMICALLY RENDERED FROM ADMIN CATEGORIES) */}
      {categories && categories.length > 0 && (
        <section className="section-card-float">
          <div className="mb-6">
            <span className="eyebrow-label text-[#0D472E]">EXPLORE CATALOG</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900">
              Shop by category
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/shop?category=${cat.slug || cat.name}`}
                className="group relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <FolderTree className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heading font-black text-sm leading-tight group-hover:text-[#E5B869] transition-colors">
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
          <Link to="/shop" className="block relative rounded-[24px] overflow-hidden shadow-md border border-slate-200 group">
            <img
              src={siteBanners.promoBanner1}
              alt="Promo Banner"
              className="w-full h-auto max-h-[300px] object-cover rounded-[24px] group-hover:scale-[1.01] transition-transform duration-500"
            />
          </Link>
        </section>
      )}

      {/* SECTION 6: FAQ ACCORDION SECTION */}
      <section id="faq" className="max-w-[1536px] mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="eyebrow-label text-[#0D472E]">GOT QUESTIONS?</span>
            <h2 className="text-3xl font-heading font-black text-slate-900">
              Your questions, answered
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left font-heading font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between bg-[#F9F9F6] hover:bg-slate-100"
                  >
                    <span>{faq.q}</span>
                    <div className="w-7 h-7 rounded-full bg-white text-[#0D472E] flex items-center justify-center shrink-0 border border-slate-200">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
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
        <div className="bg-[#FAF4E8] rounded-[24px] p-6 sm:p-10 border border-[#E6D7C3] text-center space-y-4 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            Stay in the loop with our weekly newsletter
          </h2>
          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            Get exclusive wellness tips, doctor guides, and special discount codes delivered straight to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto gap-2 pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#0D472E]"
            />
            <button
              type="submit"
              className="bg-[#0D472E] hover:bg-[#08301E] text-white text-xs font-black py-3 px-6 rounded-full shadow-md"
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
