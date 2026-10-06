import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Home as HomeIcon,
  Grid,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME, CATEGORIES, CONCERNS } from '../../utils/constants';

export const Navbar = ({ onOpenSearch, onOpenQuiz }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { getItemCount, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdown(false);
    setUserDropdown(false);
  }, [location]);

  const itemCount = getItemCount();

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E4E0D8] py-3 shadow-premium'
            : 'bg-[#FAF7F2] border-b border-[#E4E0D8]/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Mobile Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#1B1F1D] hover:bg-[#EEF3EE]"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo: Deep Forest Green Hypril Branding */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#0F3D2B] text-white flex items-center justify-center font-serif font-black text-xl shadow-glow-forest group-hover:scale-105 transition-transform">
                H
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#0F3D2B]">
                  {BRAND_NAME}
                </span>
                <span className="text-[9px] font-extrabold text-[#B8924A] uppercase tracking-widest leading-none">
                  CLINICAL WELLNESS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-bold text-[#1B1F1D]">
              <Link
                to="/"
                className={`transition-colors hover:text-[#0F3D2B] ${
                  location.pathname === '/' ? 'text-[#0F3D2B] font-extrabold' : ''
                }`}
              >
                Home
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" onMouseLeave={() => setCategoryDropdown(false)}>
                <button
                  onMouseEnter={() => setCategoryDropdown(true)}
                  onClick={() => setCategoryDropdown(!categoryDropdown)}
                  className="flex items-center gap-1 text-[#1B1F1D] hover:text-[#0F3D2B] transition-colors py-2"
                >
                  <span>Shop Categories</span>
                  <ChevronDown className="w-4 h-4 text-[#5B655F]" />
                </button>

                {categoryDropdown && (
                  <div className="absolute top-full left-0 w-72 bg-white border border-[#E4E0D8] rounded-2xl shadow-2xl p-3 space-y-1 z-50 animate-fadeIn">
                    <div className="px-3 py-1 text-[10px] font-extrabold text-[#B8924A] uppercase tracking-widest border-b border-[#E4E0D8] pb-2 mb-1">
                      Shop by Concern
                    </div>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="block px-3 py-2.5 rounded-xl text-xs font-bold text-[#1B1F1D] hover:text-[#0F3D2B] hover:bg-[#EEF3EE] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/shop"
                className={`transition-colors hover:text-[#0F3D2B] ${
                  location.pathname === '/shop' ? 'text-[#0F3D2B] font-extrabold' : ''
                }`}
              >
                Shop All
              </Link>

              <Link
                to="/shop?bestseller=true"
                className="text-[#1B1F1D] hover:text-[#0F3D2B] transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#B8924A] animate-pulse"></span>
                <span>Bestsellers</span>
              </Link>

              {/* Needs Quiz Trigger Button */}
              <button
                onClick={onOpenQuiz}
                className="inline-flex items-center gap-1.5 text-xs bg-[#EEF3EE] hover:bg-[#0F3D2B] text-[#0F3D2B] hover:text-white px-3 py-1.5 rounded-full border border-[#0F3D2B]/20 font-extrabold transition-all duration-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8924A]" />
                <span>1-Min Needs Quiz</span>
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-[#B8924A] hover:text-[#947234] font-bold flex items-center gap-1 bg-[#FAF4E8] px-3 py-1 rounded-lg border border-[#B8924A]/30 text-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Search Trigger */}
              <button
                onClick={onOpenSearch}
                className="p-2.5 rounded-full text-[#1B1F1D] hover:bg-[#EEF3EE] transition-colors"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5 text-[#1B1F1D]" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full text-[#1B1F1D] hover:bg-[#EEF3EE] transition-colors"
                aria-label="Cart Drawer"
              >
                <ShoppingBag className="w-5 h-5 text-[#0F3D2B]" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0F3D2B] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account Menu */}
              <div className="relative">
                {user ? (
                  <div className="relative" onMouseLeave={() => setUserDropdown(false)}>
                    <button
                      onClick={() => setUserDropdown(!userDropdown)}
                      className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-[#E4E0D8] hover:border-[#0F3D2B] transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#0F3D2B] text-white font-bold text-xs flex items-center justify-center">
                        {(user?.name && user.name[0]) ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <span className="hidden sm:inline text-xs font-bold text-[#1B1F1D] max-w-[80px] truncate">
                        {user?.name ? user.name.split(' ')[0] : 'User'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#5B655F]" />
                    </button>

                    {userDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E4E0D8] rounded-2xl shadow-2xl p-2 space-y-1 z-50">
                        <div className="px-3 py-2 border-b border-[#E4E0D8]">
                          <p className="text-xs font-bold text-[#1B1F1D] truncate">{user?.name || 'User'}</p>
                          <p className="text-[10px] text-[#5B655F] truncate">{user?.email || ''}</p>
                        </div>

                        <Link
                          to="/account"
                          className="block px-3 py-2 rounded-xl text-xs font-semibold text-[#1B1F1D] hover:bg-[#EEF3EE]"
                        >
                          Orders & Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-3 py-2 rounded-xl text-xs font-bold text-[#B8924A] hover:bg-[#FAF4E8]"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="btn-primary py-2 px-4 text-xs font-bold shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-[#E4E0D8] space-y-4 pb-4 animate-fadeIn bg-[#FAF7F2]">
              <Link
                to="/"
                className="block text-base font-extrabold text-[#1B1F1D]"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block text-base font-extrabold text-[#1B1F1D]"
              >
                Shop All Products
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuiz();
                }}
                className="w-full btn-gold py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Take 1-Min Personalized Quiz</span>
              </button>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-extrabold text-[#B8924A] uppercase tracking-wider">
                  Shop By Category
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="p-3 rounded-xl bg-white border border-[#E4E0D8] text-xs font-bold text-[#1B1F1D]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E4E0D8] py-2 px-6 flex items-center justify-between shadow-2xl">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-[#0F3D2B]' : 'text-[#5B655F]'}`}>
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        
        <Link to="/shop" className={`flex flex-col items-center gap-1 ${location.pathname === '/shop' ? 'text-[#0F3D2B]' : 'text-[#5B655F]'}`}>
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Shop</span>
        </Link>

        <button onClick={onOpenQuiz} className="flex flex-col items-center gap-1 text-[#B8924A]">
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Needs Quiz</span>
        </button>

        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-[#0F3D2B] relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#0F3D2B] text-white text-[9px] font-black flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};
