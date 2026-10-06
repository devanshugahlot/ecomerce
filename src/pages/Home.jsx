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
  Flame,
  Check,
  Lock,
  Timer,
  Play,
  UserCheck,
  X
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { MOCK_PRODUCTS } from '../utils/mockProducts';
import { CONCERNS, BRAND_NAME } from '../utils/constants';
import { useToast } from '../context/ToastContext';

export const Home = ({ onOpenQuiz }) => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedTab, setSelectedTab] = useState('All');
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const filterTabs = ['All', 'Enlargement Oils', 'Delay Gels'];

  const displayedProducts = selectedTab === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.category === selectedTab);

  const brandPillars = [
    {
      title: "Clinical Active Extracts",
      desc: "Formulated alongside specialists using standardized herbal oils & botanical extracts for max efficacy.",
      icon: Stethoscope
    },
    {
      title: "Purity & Quality Batch Certified",
      desc: "Every batch is lab-tested for heavy metal safety, skin safety, and active compound potency.",
      icon: ShieldCheck
    },
    {
      title: "100% Discreet Packaging",
      desc: "Delivered in plain, unmarked brown outer boxes with zero product names or brand logos on the exterior label.",
      icon: PackageCheck
    },
    {
      title: "Confidential Support & Advice",
      desc: "Free 1-on-1 consultations with specialists to guide your intimate wellness routine safely.",
      icon: UserCheck
    }
  ];

  const bundles = [
    {
      id: "bundle-hypril-duo",
      title: "Hypril™ Ultimate Intimate Stack",
      includes: "Hypril™ Enlargement Oil (100ml) + Hypril™ Extended Delay Gel (50ml)",
      price: 2299,
      comparePrice: 3498,
      savings: "Save ₹1,199",
      img: "/images/hypril_oil.jpg"
    }
  ];

  const verifiedReviews = [
    {
      name: "Rohan S.",
      location: "Bengaluru, KA",
      product: "Hypril™ Enlargement Oil (100ml)",
      rating: 5,
      date: "Verified Buyer • 3 days ago",
      comment: "Super impressed with the discreet delivery! Unmarked box outside. The oil absorbs fast, non-greasy, and noticeable boost in stamina and confidence."
    },
    {
      name: "Vikram R.",
      location: "Mumbai, MH",
      product: "Hypril™ Extended Delay Gel (50ml)",
      rating: 5,
      date: "Verified Buyer • 1 week ago",
      comment: "Works exactly as advertised. Cooling sensation and gives complete control without losing sensitivity. Highly recommended!"
    },
    {
      name: "Anish M.",
      location: "Delhi NCR",
      product: "Hypril™ Enlargement Oil (100ml)",
      rating: 5,
      date: "Verified Buyer • 2 weeks ago",
      comment: "Been using it consistently for 3 weeks. Premium quality packaging and genuine botanical formulation. 10/10."
    }
  ];

  const faqs = [
    {
      q: "Is the outer delivery box 100% discreet?",
      a: "Yes, 100% guaranteed. All Hypril orders ship in a plain, unmarked brown box or tamper-proof courier bag. There are ZERO product names, logos, or sensitive descriptions printed on the exterior shipping label."
    },
    {
      q: "What name will appear on my bank or credit card statement?",
      a: "Your bank or credit card statement will display a neutral billing descriptor ('Hypril Merchant' or 'Razorpay Merchant') with zero mention of intimate products."
    },
    {
      q: "Are Hypril products clinically tested and safe?",
      a: "Yes. All Hypril formulations are manufactured in FSSAI & GMP certified facilities. Every batch undergoes third-party lab testing for skin safety, purity, and active botanical concentration."
    },
    {
      q: "How fast is delivery across India?",
      a: "Orders are dispatched within 24 hours. Metro cities receive 24-48 hour Express Delivery, while all other Indian PIN codes receive delivery within 2 to 4 business days."
    },
    {
      q: "Is Cash on Delivery (COD) available?",
      a: "Yes, Cash on Delivery (COD) is available across 19,000+ PIN codes in India with free discreet packaging."
    },
    {
      q: "How do I consult a Hypril medical specialist privately?",
      a: "You can click on 'Talk to Wellness Advisor' or book a free 1-on-1 confidential consultation with our team. All consultations are 100% private."
    }
  ];

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Welcome to the Hypril Circle! Check your email for discount code HYPRIL10.', 'success');
    setEmail('');
  };

  const heroProduct = MOCK_PRODUCTS[0]; // Hypril Oil

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#FAF7F2] text-[#1B1F1D]">
      <SEO
        title="Hypril™ — Confident. Clinical. Discreet. Men's Intimate Wellness"
        description="Doctor-backed Hypril Enlargement Oil & Extended Delay Gel. 100% plain box discreet delivery, cash on delivery & clinical grade herbal formula."
      />

      {/* HERO SECTION — ELEGANT D2C PRESENTATION */}
      <section className="relative pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F3D2B] via-[#0B3022] to-[#072117] text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-[#0F3D2B]/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B8924A]" />
                <span>Clinical Stamina & Vitality Essentials</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15]">
                Intimate Wellness, handled with <br />
                <span className="text-[#B8924A] italic underline decoration-[#B8924A]/40 decoration-2 underline-offset-8">
                  absolute confidence.
                </span>
              </h1>

              <p className="text-emerald-100/90 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Hypril™ Enlargement Oil & Extended Delay Gel. Engineered for stronger performance, increased blood flow, and extended control. Delivered in 100% plain, unmarked packaging.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/shop" className="btn-gold w-full sm:w-auto text-xs sm:text-sm py-4 px-8 font-extrabold shadow-glow-gold">
                  <span>Shop Hypril Range</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={onOpenQuiz}
                  className="btn-secondary w-full sm:w-auto text-xs sm:text-sm py-4 px-8 font-bold border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  <Sparkles className="w-4 h-4 text-[#B8924A]" />
                  <span>Take 1-Min Needs Quiz</span>
                </button>
              </div>

              {/* Doctor Trust Line */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-emerald-200/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-[#B8924A]" /> Certified Pharmacologist Formulas
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B8924A]" /> FSSAI & ISO Certified
                </span>
              </div>
            </div>

            {/* Right Column Product Showcase Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-sm w-full bg-white text-[#1B1F1D] rounded-3xl p-5 border border-[#E4E0D8] shadow-2xl space-y-4">
                <div className="absolute -top-3 right-4 bg-[#B8924A] text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" /> #1 Best Seller
                </div>

                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] relative">
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#0F3D2B]/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                    <PackageCheck className="w-3 h-3 text-[#B8924A]" /> Plain Box Shipping
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#0F3D2B]">{heroProduct.category}</span>
                    <span className="font-extrabold text-[#B8924A]">★ {heroProduct.rating} ({heroProduct.numReviews} Reviews)</span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#1B1F1D]">
                    {heroProduct.name}
                  </h3>
                  <p className="text-xs text-[#5B655F] line-clamp-2">
                    {heroProduct.shortDescription}
                  </p>
                  <div className="pt-3 border-t border-[#E4E0D8] flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-[#0F3D2B]">₹{heroProduct.price}</span>
                      <span className="text-xs text-[#5B655F] line-through ml-2">₹{heroProduct.originalPrice}</span>
                    </div>
                    <Link to={`/products/${heroProduct.slug}`} className="btn-primary text-xs py-2 px-4 font-bold">
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Under-Hero Trust Strip (4 Pillars) */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-emerald-100">
            <div className="flex items-center justify-center lg:justify-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
              <PackageCheck className="w-5 h-5 text-[#B8924A] shrink-0" />
              <span>100% Discreet Packaging</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
              <Truck className="w-5 h-5 text-[#B8924A] shrink-0" />
              <span>Free Delivery Over ₹999</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
              <ShieldCheck className="w-5 h-5 text-[#B8924A] shrink-0" />
              <span>COD Available India-wide</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
              <Lock className="w-5 h-5 text-[#B8924A] shrink-0" />
              <span>Private Bank Statement</span>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CONCERN SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#B8924A] uppercase tracking-widest block">
            TARGETED HEALTH SOLUTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1B1F1D]">
            Shop By Concern
          </h2>
          <p className="text-xs sm:text-sm text-[#5B655F]">
            Select your specific goal for tailored Hypril™ performance products.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {CONCERNS.map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group bg-white rounded-2xl p-6 border border-[#E4E0D8] hover:border-[#0F3D2B] transition-all duration-300 shadow-premium hover:shadow-2xl flex items-center space-x-4"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E4E0D8] group-hover:scale-105 transition-transform duration-300 shrink-0">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-[#1B1F1D] group-hover:text-[#0F3D2B] transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-[#5B655F] line-clamp-2">{c.desc}</p>
                <span className="text-xs font-extrabold text-[#B8924A] group-hover:underline flex items-center gap-1 pt-1">
                  Explore Products <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CURATED BESTSELLERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#B8924A] uppercase tracking-widest block mb-1">
              HYPRIL CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1B1F1D]">
              Hypril™ Range
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                  selectedTab === tab
                    ? 'bg-[#0F3D2B] text-white shadow-glow-forest'
                    : 'bg-white text-[#1B1F1D] border border-[#E4E0D8] hover:border-[#0F3D2B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {displayedProducts.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </section>

      {/* WHY HYPRIL — BRAND PILLARS */}
      <section className="bg-[#EEF3EE]/80 border-y border-[#E4E0D8] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-[#0F3D2B] uppercase tracking-widest">
              THE HYPRIL STANDARD
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1B1F1D]">
              Why Men Choose Hypril™
            </h2>
            <p className="text-xs sm:text-sm text-[#5B655F]">
              We offer targeted formulas made with pure botanical extracts and 100% privacy assurance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandPillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E4E0D8] space-y-3 shadow-premium">
                  <div className="w-12 h-12 rounded-xl bg-[#0F3D2B]/10 text-[#0F3D2B] flex items-center justify-center">
                    <IconComp className="w-6 h-6 text-[#0F3D2B]" />
                  </div>
                  <h3 className="font-extrabold text-base text-[#1B1F1D]">{pillar.title}</h3>
                  <p className="text-xs text-[#5B655F] leading-relaxed font-medium">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED SPOTLIGHT SECTION — HYPRIL DELAY GEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E4E0D8] p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3 py-1 rounded-full bg-[#FAF4E8] text-[#B8924A] text-xs font-extrabold uppercase tracking-wider border border-[#B8924A]/20">
                Hypril™ Extended Delay Gel
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1B1F1D] leading-tight">
                Extended Duration. Total Control. <br />
                <span className="text-[#0F3D2B]">Cooling Sensation & Skin Safe.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#5B655F] leading-relaxed font-medium">
                Engineered for maximum stamina and endurance during intimate moments. Fast-acting formula with pleasant cooling effect.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link to="/products/hypril-extended-delay-gel-50ml" className="btn-gold py-3.5 px-7 text-xs font-extrabold">
                  <span>Claim Gel Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs font-bold text-[#0F3D2B] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#B8924A]" /> Dermatologically Tested
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <img
                src="/images/hypril_delay_gel.jpg"
                alt="Hypril Extended Delay Gel"
                className="rounded-2xl border border-[#E4E0D8] shadow-xl max-w-md w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BUNDLES & ROUTINES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#B8924A] uppercase tracking-widest block">
            COMPLETE CARE KITS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1B1F1D]">
            Build Your Routine & Save
          </h2>
          <p className="text-xs sm:text-sm text-[#5B655F]">
            Curated 2-product stack engineered for synergistic performance and maximum value.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {bundles.map((bundle) => (
            <div key={bundle.id} className="bg-white rounded-2xl p-6 border border-[#E4E0D8] shadow-premium flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#FAF7F2]">
                  <img src={bundle.img} alt={bundle.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-[#B5472F] text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    {bundle.savings}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-[#1B1F1D]">{bundle.title}</h3>
                <p className="text-xs text-[#5B655F] font-medium">{bundle.includes}</p>
              </div>

              <div className="pt-3 border-t border-[#E4E0D8] flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-[#0F3D2B]">₹{bundle.price}</span>
                  <span className="text-xs text-[#5B655F] line-through ml-2">₹{bundle.comparePrice}</span>
                </div>
                <Link to="/shop" className="btn-primary py-2 px-4 text-xs font-bold">
                  View Kit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-STEP HOW IT WORKS */}
      <section className="bg-white border-y border-[#E4E0D8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-[#0F3D2B] uppercase tracking-widest">
              SIMPLE & ANXIETY-FREE
            </span>
            <h2 className="text-3xl font-serif font-extrabold text-[#1B1F1D]">How Hypril™ Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="space-y-3 p-6 rounded-2xl bg-[#FAF7F2] border border-[#E4E0D8]">
              <div className="w-12 h-12 rounded-full bg-[#0F3D2B] text-white font-serif font-bold text-lg mx-auto flex items-center justify-center">
                1
              </div>
              <h3 className="font-extrabold text-base text-[#1B1F1D]">Select Your Hypril Formula</h3>
              <p className="text-xs text-[#5B655F]">Choose between Hypril™ Enlargement Oil or Hypril™ Extended Delay Gel.</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#FAF7F2] border border-[#E4E0D8]">
              <div className="w-12 h-12 rounded-full bg-[#0F3D2B] text-white font-serif font-bold text-lg mx-auto flex items-center justify-center">
                2
              </div>
              <h3 className="font-extrabold text-base text-[#1B1F1D]">100% Plain Box Packing</h3>
              <p className="text-xs text-[#5B655F]">We pack in unmarked brown boxes with zero product names printed outside.</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#FAF7F2] border border-[#E4E0D8]">
              <div className="w-12 h-12 rounded-full bg-[#0F3D2B] text-white font-serif font-bold text-lg mx-auto flex items-center justify-center">
                3
              </div>
              <h3 className="font-extrabold text-base text-[#1B1F1D]">Delivered in 2-5 Days</h3>
              <p className="text-xs text-[#5B655F]">Fast express delivery across 19,000+ PIN codes with COD available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED REVIEWS & STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-extrabold text-[#B8924A] uppercase tracking-widest block">
            VERIFIED CUSTOMER FEEDBACK
          </span>
          <h2 className="text-3xl font-serif font-extrabold text-[#1B1F1D]">Real Results. Zero Stigma.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {verifiedReviews.map((rev, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E4E0D8] space-y-4 shadow-premium">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F3D2B] text-white font-bold text-sm flex items-center justify-center">
                    {rev.name[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#1B1F1D]">{rev.name}</h4>
                    <p className="text-[10px] text-[#5B655F]">{rev.location}</p>
                  </div>
                </div>
                <span className="text-xs text-[#B8924A] font-bold">★ 5.0</span>
              </div>
              <p className="text-xs text-[#5B655F] leading-relaxed italic">"{rev.comment}"</p>
              <div className="pt-3 border-t border-[#E4E0D8] flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#0F3D2B]">{rev.product}</span>
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#B8924A]" /> {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-[#0F3D2B] uppercase tracking-widest block">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-serif font-extrabold text-[#1B1F1D]">Privacy & Ordering FAQ</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-[#E4E0D8] overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-5 text-sm font-extrabold text-[#1B1F1D] flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#0F3D2B] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#5B655F] leading-relaxed border-t border-[#E4E0D8] pt-3 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0F3D2B] text-white p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white mx-auto flex items-center justify-center">
            <Mail className="w-6 h-6 text-[#B8924A]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
              Join The Hypril™ Circle
            </h2>
            <p className="text-xs text-emerald-100/80 max-w-md mx-auto font-medium">
              Receive private wellness tips, special offers, and 10% OFF your first order.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-xs text-white placeholder-emerald-200/60 focus:outline-none focus:border-[#B8924A]"
            />
            <button type="submit" className="btn-gold text-xs py-3 px-6 shrink-0 font-extrabold shadow-sm">
              Get 10% Off
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
