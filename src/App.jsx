import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts & Modals
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './components/layout/AdminLayout';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { NeedsQuizModal } from './components/common/NeedsQuizModal';
import { AgeGateModal } from './components/common/AgeGateModal';
import { WhatsAppFloat } from './components/common/WhatsAppFloat';
import { MOCK_PRODUCTS } from './utils/mockProducts';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Account } from './pages/Account';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminCustomers } from './pages/admin/AdminCustomers';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#1B1F1D] flex items-center justify-center p-6 text-center">
          <div className="bg-white border border-[#E4E0D8] rounded-3xl p-8 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-xl font-serif font-extrabold text-[#0F3D2B]">Something went wrong</h2>
            <p className="text-xs text-[#5B655F] font-medium">
              An unexpected display issue occurred. Click below to return to the storefront.
            </p>
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-left">
                <p className="text-[11px] font-mono text-red-700 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="btn-primary text-xs py-3 px-6 w-full font-bold"
            >
              Return to Bold Care Storefront
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const StorefrontLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#1B1F1D] font-sans">
      <AnnouncementBar />
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenQuiz={() => setIsQuizOpen(true)} />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <AgeGateModal />
      <NeedsQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={MOCK_PRODUCTS}
      />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <Routes>
                  {/* Admin Auth Route */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Control Panel Nested Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="customers" element={<AdminCustomers />} />
                  </Route>

                  {/* Main Storefront Routes */}
                  <Route path="/*" element={<StorefrontLayout />} />
                </Routes>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
