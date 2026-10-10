import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
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
    <header className="relative z-40 bg-white border-b border-slate-200/80 shadow-2xs font-sans">
      {/* 1. Continuous Running Ticker Announcement Bar */}
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

            {/* User Account / Lightning Icon */}
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

      {/* 3. Mobile Navigation Drawer Overlay */}
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
