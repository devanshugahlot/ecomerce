import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Award,
  ChevronDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Truck,
  PackageCheck,
  Star,
  Mail,
  Heart,
  Flame,
  Check,
  RotateCcw,
  UserCheck,
  X
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { MOCK_PRODUCTS } from '../utils/mockProducts';
import { CATEGORIES } from '../utils/constants';
import { useToast } from '../context/ToastContext';

export const Home = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const categoryTabs = ['All', 'Sexual Wellness', 'Daily Performance', 'Grooming & Beard', 'Intimate Care'];

  const displayedProducts = selectedCategoryTab === 'All'
    ? MOCK_PRODUCTS.slice(0, 8)
    : MOCK_PRODUCTS.filter((p) => p.category === selectedCategoryTab);

  // Circular Story Categories matching Bold Care top row
  const circleCategories = [
    { name: 'Best Sellers', icon: '🔥', link: '/shop?bestseller=true', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200' },
    { name: 'Extend Range', icon: '⚡', link: '/shop?category=Sexual%20Wellness', img: 'https://images.unsplash.com/photo-1550572017-edf706daf040?auto=format&fit=crop&q=80&w=200' },
    { name: 'VYRO Gummies', icon: '🍬', link: '/shop?category=Sexual%20Wellness', img: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=200' },
    { name: 'Intimate Care', icon: '🧼', link: '/shop?category=Intimate%20Care', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200' },
    { name: 'Hair & Beard', icon: '💈', link: '/shop?category=Grooming%20%26%20Beard', img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=200' },
    { name: 'Shilajit Gold', icon: '✨', link: '/products/pure-himalayan-shilajit-gold-resin', img: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=200' },
    { name: 'All Products', icon: '🛍️', link: '/shop', img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=200' },
  ];

  const faqs = [
    {
      q: "Is the packaging 100% confidential and discreet?",
      a: "Yes, guaranteed. All orders are delivered in a completely unmarked, neutral brown outer box with zero product names or brand logos printed on the exterior label. Total privacy assured."
    },
    {
      q: "Are VYRO products doctor-formulated and lab certified?",
      a: "All VYRO formulations are developed alongside clinical pharmacologists and medical specialists. Every batch undergoes third-party lab testing (ICP-MS) for heavy metal safety, purity, and active compound potency in FSSAI-approved, GMP-certified facilities."
    },
    {
      q: "How fast will my order arrive?",
      a: "We ship orders within 24 hours of placement. Metro cities receive 48-hour Express Delivery, while all other Indian locations receive delivery within 2 to 4 business days."
    },
    {
      q: "What payment methods do you accept?",
      a: "We support all major Indian payment channels: UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and Cash on Delivery (COD) across India."
    }
  ];

  const doctorPillars = [
    {
      title: "Clinical Extraction",
      desc: "High-concentration standardized botanical extracts at effective doses.",
      icon: Stethoscope
    },
    {
      title: "100% Discreet Parcel",
      desc: "Unmarked plain outer packaging. Zero sensitive product names on exterior.",
      icon: PackageCheck
    },
    {
      title: "Zero Hidden Fillers",
      desc: "Clean formulations with zero artificial colorants, steroids, or proprietary fluff.",
      icon: ShieldCheck
    },
    {
      title: "Express 2-Day Shipping",
      desc: "Dispatched from regional hubs for rapid delivery across 19,000+ Indian PIN codes.",
      icon: Truck
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('Welcome! Check your inbox for your 15% discount code.', 'success');
    setEmail('');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 bg-[#FAF9F6] text-slate-900">
      <SEO
        title="VYRO — Science-Backed Men's Wellness & Vitality"
        description="Premium men's wellness solutions for stamina, daily vitality, hair growth, and intimate hygiene. Doctor-formulated with 100% discreet packaging."
      />

      {/* TOP CIRCULAR CATEGORIES NAV BAR (EXACT MATCH FOR BOLD CARE STORY ICONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 overflow-x-auto pb-4 no-scrollbar">
          {circleCategories.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border-2 border-white">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-center max-w-[80px] leading-tight">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* HERO SECTION BANNER — WARM CREAM CARD MATCHING BOLD CARE HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#FEF8EC] border border-amber-200/80 p-6 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>India's Premium Men's Health & Stamina Brand</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                India's No. 1 <br />
                <span className="text-emerald-700 underline decoration-amber-400 decoration-4 underline-offset-8">
                  Sexual Health & Wellness Brand
                </span>
              </h1>

              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-amber-200 shadow-sm text-xs sm:text-sm font-extrabold text-slate-800">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Trusted by 50 Lakh+ Indian Men</span>
              </div>

              <p className="text-slate-700 text-xs sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Stamina gummies, Himalayan Shilajit gold resin, and hair regrowth serums. Clinically validated formulas, 100% transparent ingredients, delivered in confidential plain brown boxes.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/shop" className="btn-primary w-full sm:w-auto text-xs sm:text-sm py-3.5 px-8 font-extrabold shadow-glow">
                  <span>Shop Bestsellers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/shop?category=Sexual%20Wellness" className="btn-secondary w-full sm:w-auto text-xs sm:text-sm py-3.5 px-8 font-bold border-slate-300">
                  <span>Explore Stamina Solutions</span>
                </Link>
              </div>
            </div>

            {/* Right Hero Product Card Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-sm w-full bg-white rounded-3xl p-5 border border-slate-200 shadow-xl">
                <div className="absolute -top-3 right-4 bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" /> #1 Best Seller
                </div>
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
                  alt="VYRO Hero Product"
                  className="w-full aspect-[4/3] object-cover rounded-2xl bg-slate-50 mb-4"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-700">Sexual Wellness</span>
                    <span className="text-amber-600 font-extrabold">4.9 ★ (342 Reviews)</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    VYRO Surge — Endurance & Stamina Gummies
                  </h3>
                  <p className="text-xs text-slate-600">
                    L-Arginine, Gokshura & Safed Musli for nitric oxide elevation and lasting vigor.
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900">₹699</span>
                      <span className="text-xs text-slate-400 line-through ml-2">₹999</span>
                    </div>
                    <Link to="/products/vyro-surge-endurance-stamina-gummies" className="btn-primary text-xs py-2 px-4 font-bold">
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BESTSELLERS SECTION (MATCHING BOLD CARE "BOLDEST PICKS" SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest block mb-1">
              BOLDEST PICKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">
              Bestsellers
            </h2>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategoryTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategoryTab === tab
                    ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>

      {/* HIGH IMPACT PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#FEF8EC] border border-amber-300/80 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider">
                Special Formulation Release
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900 leading-tight">
                Pure Himalayan <br />
                <span className="text-emerald-700">Shilajit Gold Soft Resin (75% Fulvic Acid)</span>
              </h2>
              <p className="text-slate-700 text-xs sm:text-sm max-w-xl font-medium">
                Harvested from 18,000 ft peaks, purified via traditional Shodhana & enriched with 24K edible Gold Bhasma. Get 15% OFF this week using coupon <strong className="text-amber-800 font-mono bg-amber-200 px-2 py-0.5 rounded">VYRO10</strong>.
              </p>
              <div className="pt-2">
                <Link to="/products/pure-himalayan-shilajit-gold-resin" className="btn-primary text-xs py-3.5 px-7 font-bold inline-flex">
                  <span>Claim 15% Discount</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=600"
                alt="Shilajit Gold Resin Promo"
                className="w-48 sm:w-64 rounded-2xl shadow-md border border-amber-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FREE DOCTOR CONSULTATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Certified Medical Board
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900">
                Unsure about dosage or customized hair care?
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Talk to our senior specialists in a 100% free, confidential 1-on-1 consultation. Zero judgment, total privacy.
              </p>
            </div>
          </div>
          <button
            onClick={() => addToast('Doctor Consultation slot booked! Our medical team will reach out on WhatsApp.', 'success')}
            className="btn-primary text-xs py-3.5 px-6 font-bold shrink-0 shadow-sm"
          >
            <span>Book Free Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* WHY CHOOSE VYRO - BRAND COMPARISON GRID */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Clinical Quality Standard
            </span>
            <h2 className="text-3xl font-serif font-extrabold text-slate-900">
              Why Standard Supplements Fail
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              We replace underdosed generic powders with high-concentration standardized extracts and total clinical transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Generic Brands */}
            <div className="p-6 rounded-2xl bg-white border border-red-200 space-y-4 shadow-sm">
              <h3 className="font-bold text-base text-red-600 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" /> Standard Generic Brands
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">❌ Hidden proprietary blends with undisclosed dosages</li>
                <li className="flex items-center gap-2">❌ Unlabeled outer packaging revealing sensitive products</li>
                <li className="flex items-center gap-2">❌ Low-potency raw herbal powders with zero active extraction</li>
                <li className="flex items-center gap-2">❌ Heavy metal contamination and zero lab test reports</li>
              </ul>
            </div>

            {/* VYRO Clinical Formulations */}
            <div className="p-6 rounded-2xl bg-white border border-emerald-300 space-y-4 shadow-md">
              <h3 className="font-bold text-base text-emerald-700 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" /> The VYRO Standard
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-800 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Transparent clinical dosages on every label</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Confidential plain outer box packaging</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Standardized botanical extracts (e.g. 75% Fulvic Acid, KSM-66)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Third-party ICP-MS heavy metal lab validated</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-3xl font-serif font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-5 text-sm font-extrabold text-slate-900 flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
              Join The VYRO Wellness Circle
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Subscribe to receive doctor-written health guides, new formula drops, and 15% OFF your first order.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
            />
            <button type="submit" className="btn-primary text-xs py-3 px-6 shrink-0 font-bold">
              Get 15% Off
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
