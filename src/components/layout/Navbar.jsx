import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  Zap,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { AnnouncementBar } from './AnnouncementBar';

// Category Circular Pills Data matching reference screenshot
const CATEGORY_PILLS = [
  {
    id: 'bestsellers',
    label: 'Best Sellers',
    image: '/images/cat_bestsellers.png',
    link: '/shop?filter=bestsellers'
  },
  {
    id: 'extend',
    label: 'Extend Range',
    image: '/images/cat_extend.png',
    link: '/shop?category=Delay%20Gels'
  },
  {
    id: 'supplements',
    label: 'Hypril Supplements',
    image: '/images/cat_supplements.png',
    link: '/shop?category=Stamina%20Boosters'
  },
  {
    id: 'condoms',
    label: 'Condoms & Lubes',
    image: '/images/cat_condoms.png',
    link: '/shop?category=Enlargement%20Oils'
  },
  {
    id: 'massagers',
    label: 'Massagers',
    image: '/images/cat_massagers.png',
    link: '/shop?category=Delay%20Gels'
  },
  {
    id: 'hygiene',
    label: 'Intimate Hygiene',
    image: '/images/cat_hygiene.png',
    link: '/shop?category=Stamina%20Boosters'
  },
  {
    id: 'shilajit',
    label: 'Shilajit',
    image: '/images/cat_shilajit.png',
    link: '/shop?category=Stamina%20Boosters'
  },
  {
    id: 'all',
    label: 'All Products',
    image: '/images/cat_all.png',
    link: '/shop'
  }
];

export const Navbar = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const { getItemCount, setIsCartOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdown(false);
  }, [location]);

  const itemCount = getItemCount();

  return (
    <header className="relative z-40 bg-white border-b border-slate-200/80 shadow-2xs font-sans">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Header Row (Desktop & Mobile) */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-3xs">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* MOBILE: Left Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 stroke-[2.2]" />}
          </button>

          {/* LOGO: Hypril */}
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-slate-900 group-hover:text-[#0D472E] transition-colors">
              Hypril
            </span>
          </Link>

          {/* DESKTOP CENTER NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-9 font-semibold text-sm text-slate-800">
            <Link
              to="/"
              className={`hover:text-[#0D472E] transition-colors py-1 ${
                location.pathname === '/' ? 'text-[#0D472E] font-bold border-b-2 border-[#0D472E]' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`hover:text-[#0D472E] transition-colors py-1 ${
                location.pathname === '/shop' ? 'text-[#0D472E] font-bold border-b-2 border-[#0D472E]' : ''
              }`}
            >
              Shop All
            </Link>
            <a href="#contact" className="hover:text-[#0D472E] transition-colors py-1">
              Contact
            </a>
            <a href="#faq" className="hover:text-[#0D472E] transition-colors py-1">
              FAQ
            </a>
            <Link to="/shop" className="hover:text-[#0D472E] transition-colors py-1">
              Blogs
            </Link>
          </nav>

          {/* RIGHT ACTION ICONS: Search, Account/Zap, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Search Trigger Icon */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-slate-800 hover:bg-slate-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
            </button>

            {/* User Account / Lightning Icon (Matching reference layout) */}
            {user ? (
              <div className="relative" onMouseLeave={() => setUserDropdown(false)}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0D472E] text-white font-bold text-xs flex items-center justify-center border border-emerald-700 shadow-xs focus:outline-none"
                  aria-label="User Menu"
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                    <Link to="/account" className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl">
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-xl">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={logout} className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="relative p-2.5 text-slate-800 hover:bg-slate-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center group"
                aria-label="Account Login"
              >
                <div className="relative">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500 absolute -top-1 -right-1 stroke-[1]" />
                </div>
              </Link>
            )}

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-slate-800 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Shopping Cart Drawer"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0D472E] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Category Circular Pills Row (Matching exact reference design) */}
      <div className="bg-white border-b border-slate-200/70 py-3 sm:py-4">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-4 sm:gap-7 overflow-x-auto no-scrollbar scroll-smooth justify-start lg:justify-center py-1">
            {CATEGORY_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => navigate(pill.link)}
                className="flex flex-col items-center group shrink-0 transition-transform active:scale-95 focus:outline-none"
              >
                {/* Avatar Circle Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-slate-200/90 shadow-2xs group-hover:border-[#0D472E] group-hover:shadow-md transition-all duration-200 bg-slate-50 p-0.5">
                  <img
                    src={pill.image}
                    alt={pill.label}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback image in case path fails
                      e.target.onerror = null;
                      e.target.src = '/images/cat_all.png';
                    }}
                  />
                </div>

                {/* Pill Label Text */}
                <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-[#0D472E] transition-colors mt-2 text-center whitespace-nowrap">
                  {pill.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Trust Strip Banner Below Category Pills (Matching reference screenshot 2) */}
      <div className="bg-[#F5F5F3] border-b border-slate-200/50 py-2 px-4 text-xs text-slate-700 font-semibold tracking-tight">
        <div className="max-w-[1536px] mx-auto flex items-center justify-center gap-6 sm:gap-12 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="inline-flex items-center gap-2 shrink-0">
            <PackageCheck className="w-4 h-4 text-[#0D472E]" />
            <span>100% Discreet Packaging & Fast Delivery</span>
          </span>
          <span className="inline-flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#0D472E]" />
            <span>India's No. 1 Men's Wellness Brand</span>
          </span>
        </div>
      </div>

      {/* 5. Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <Link
            to="/"
            className="flex items-center justify-between p-3 text-slate-800 font-bold hover:bg-slate-50 rounded-xl"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/shop"
            className="flex items-center justify-between p-3 text-slate-800 font-bold hover:bg-slate-50 rounded-xl"
          >
            <span>Shop All</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <a
            href="#contact"
            className="flex items-center justify-between p-3 text-slate-800 font-bold hover:bg-slate-50 rounded-xl"
          >
            <span>Contact</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
          <a
            href="#faq"
            className="flex items-center justify-between p-3 text-slate-800 font-bold hover:bg-slate-50 rounded-xl"
          >
            <span>FAQ</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
          <Link
            to="/shop"
            className="flex items-center justify-between p-3 text-slate-800 font-bold hover:bg-slate-50 rounded-xl"
          >
            <span>Blogs</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
