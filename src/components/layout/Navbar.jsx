import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME } from '../../utils/constants';
import { AnnouncementBar } from './AnnouncementBar';

export const Navbar = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const { getItemCount, setIsCartOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdown(false);
  }, [location]);

  const itemCount = getItemCount();

  return (
    <header className="relative z-40">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left: Mobile Menu Toggle + BOLD Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* BOLD Care Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-heading font-black text-2xl sm:text-3xl tracking-tighter text-[#0D472E] group-hover:opacity-90 transition-opacity">
                BOLD
              </span>
              <span className="hidden sm:inline-block bg-[#0D472E] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                CARE
              </span>
            </Link>
          </div>

          {/* Center Navigation Links: ONLY 4 LINKS (Home, Shop All, Contact, FAQ) */}
          <nav className="hidden lg:flex items-center gap-10 font-bold text-sm text-slate-800">
            <Link to="/" className={`hover:text-[#0D472E] transition-colors ${location.pathname === '/' ? 'text-[#0D472E] font-black' : ''}`}>
              Home
            </Link>
            <Link to="/shop" className={`hover:text-[#0D472E] transition-colors ${location.pathname === '/shop' ? 'text-[#0D472E] font-black' : ''}`}>
              Shop All
            </Link>
            <a href="#contact" className="hover:text-[#0D472E] transition-colors">
              Contact
            </a>
            <a href="#faq" className="hover:text-[#0D472E] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Icons: Search, User, Cart Drawer Trigger */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            </button>

            {/* Account / User Menu */}
            {user ? (
              <div className="relative" onMouseLeave={() => setUserDropdown(false)}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="w-9 h-9 rounded-full bg-[#0D472E] text-white font-bold text-xs flex items-center justify-center border border-white/20 shadow-xs"
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                    <Link to="/account" className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl">
                      My Account
                    </Link>
                    <button onClick={logout} className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 text-slate-800 hover:bg-slate-100 rounded-full transition-colors" aria-label="Account Login">
                <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </Link>
            )}

            {/* Cart Icon Drawer Trigger with count badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#0D472E] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3 animate-in slide-in-from-top duration-200">
          <Link to="/" className="flex items-center justify-between p-2 text-slate-800 font-bold hover:bg-slate-50 rounded-xl">
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link to="/shop" className="flex items-center justify-between p-2 text-slate-800 font-bold hover:bg-slate-50 rounded-xl">
            <span>Shop All</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <a href="#contact" className="flex items-center justify-between p-2 text-slate-800 font-bold hover:bg-slate-50 rounded-xl">
            <span>Contact</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
          <a href="#faq" className="flex items-center justify-between p-2 text-slate-800 font-bold hover:bg-slate-50 rounded-xl">
            <span>FAQ</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
