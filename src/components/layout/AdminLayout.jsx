import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Star,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME } from '../../utils/constants';

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark-700 flex items-center justify-center p-4">
        <div className="bg-dark-500 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Access Restricted</h2>
          <p className="text-xs text-slate-400">
            You must be logged in with administrator privileges to access this area.
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin/login')} className="btn-primary flex-1 text-xs">
              Admin Login
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary flex-1 text-xs">
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
    { name: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { name: 'Reviews Moderation', path: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-dark-700 text-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-dark-600 border-r border-dark-400 transition-all duration-300 flex flex-col z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header Logo */}
        <div className="p-5 border-b border-dark-400/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-dark-900 font-extrabold flex items-center justify-center shrink-0 text-xl font-serif">
              H
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white">HYPRIL ADMIN</span>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  Management Console
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-dark-500 hidden sm:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-glow-amber'
                    : 'text-slate-400 hover:text-white hover:bg-dark-500'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Info */}
        <div className="p-4 border-t border-dark-400/80 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-brand-400 hover:underline px-2 py-1 font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {!collapsed && <span>View Storefront</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-dark-600/80 backdrop-blur-md border-b border-dark-400 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="font-bold text-lg text-white">
              {navItems.find((n) => n.path === location.pathname)?.name || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-xs font-semibold text-white">{user.name}</span>
              <span className="block text-[10px] text-amber-400">Super Administrator</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500 text-dark-900 font-bold flex items-center justify-center text-xs">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <div className="p-6 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
