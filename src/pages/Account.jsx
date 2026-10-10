import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Plus,
  Trash2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';

import api from '../services/api';

export const Account = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');

  // Live order timeline data
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOrders(res.data);
      } else {
        // Fallback to initial order
        setOrders([
          {
            orderNumber: "VYRO-892410",
            date: "Oct 2, 2026",
            status: "Shipped",
            totalPrice: 1299,
            paymentMethod: "Razorpay (Paid)",
            trackingNumber: "EXP-9041284IN",
            items: [
              { name: "VYRO Surge Stamina Gummies", quantity: 1, price: 699 },
              { name: "KSM-66 Ashwagandha 600mg", quantity: 1, price: 600 }
            ],
            address: "B-402, Green Palm Heights, HSR Layout, Bengaluru, KA 560102"
          }
        ]);
      }
    } catch (err) {
      console.log('Error fetching user orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Address book state
  const [addresses, setAddresses] = useState([
    {
      id: "addr_1",
      fullName: user?.name || "Vikram Rao",
      phone: "+91 9876543210",
      line1: "B-402, Green Palm Heights",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560102",
      isDefault: true
    }
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    postalCode: ''
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Please sign in to view your account</h2>
        <Link to="/login" className="btn-primary text-xs py-3 px-6 inline-flex font-bold">
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.line1 || !newAddr.postalCode) {
      addToast('Please fill in all address fields', 'error');
      return;
    }
    if (newAddr.postalCode.length !== 6 || !/^\d+$/.test(newAddr.postalCode)) {
      addToast('PIN code must be a valid 6-digit number', 'error');
      return;
    }

    const created = {
      id: Date.now().toString(),
      ...newAddr,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, created]);
    setShowAddAddress(false);
    setNewAddr({ fullName: '', phone: '', line1: '', city: '', state: '', postalCode: '' });
    addToast('Address added to your address book', 'success');
  };

  const statusSteps = ["Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      <SEO title="My Account Dashboard" description="Manage orders and profile." noIndex={true} />

      {/* Header Profile Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white font-heading font-black text-2xl flex items-center justify-center shadow-md">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email} • {user.phone || '+91 User'}</p>
          </div>
        </div>

        <button onClick={logout} className="btn-secondary text-xs px-5 py-2.5 text-rose-600 hover:bg-rose-50 border-rose-200 font-bold flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Grid: Tabs + Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl p-3 border border-slate-200/80 space-y-1 shadow-sm">
          {[
            { id: 'orders', label: 'My Orders', icon: ShoppingBag },
            { id: 'addresses', label: 'Address Book', icon: MapPin },
            { id: 'profile', label: 'Account Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20 font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-xl text-slate-900 pb-3 border-b border-slate-100">
                Order History & Live Tracking
              </h2>

              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 font-medium">You have no previous orders.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord, orderIdx) => {
                    const orderId = ord.orderNumber || ord._id || `ORD-${orderIdx}`;
                    const itemsList = ord.orderItems || ord.items || [];
                    const orderDate = ord.date || (ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN') : 'Recent');
                    const orderStatus = ord.status || 'Confirmed';
                    const formattedAddress = typeof ord.address === 'string'
                      ? ord.address
                      : ord.shippingAddress
                      ? `${ord.shippingAddress.line1 || ''}, ${ord.shippingAddress.city || ''} ${ord.shippingAddress.postalCode || ''}`
                      : 'Standard Shipping';

                    return (
                      <div key={orderId} className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                          <div>
                            <span className="font-heading font-bold text-sm text-slate-900">{orderId}</span>
                            <span className="text-xs text-slate-500 font-medium block sm:inline sm:ml-3">Placed on {orderDate}</span>
                          </div>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 self-start sm:self-auto">
                            {orderStatus}
                          </span>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          {itemsList.map((it, i) => (
                            <div key={i} className="flex justify-between text-xs text-slate-700 font-medium">
                              <span>{it.quantity}x {it.name}</span>
                              <span className="font-bold text-slate-900">{formatCurrency((it.price || 0) * (it.quantity || 1))}</span>
                            </div>
                          ))}
                        </div>

                        {/* Timeline Graphic */}
                        <div className="pt-4 border-t border-slate-200/80 space-y-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order Progress</span>
                          <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                            {statusSteps.map((step, idx) => {
                              const currentIdx = statusSteps.indexOf(orderStatus);
                              const isPassed = idx <= currentIdx;
                              return (
                                <div key={step} className="space-y-1">
                                  <div className={`h-1.5 rounded-full ${isPassed ? 'bg-primary' : 'bg-slate-200'}`}></div>
                                  <span className={isPassed ? 'text-primary font-bold' : 'text-slate-400'}>{step}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 font-medium flex flex-col sm:flex-row justify-between gap-2 pt-2 border-t border-slate-200/80">
                          <span>Shipping to: <strong className="text-slate-900">{formattedAddress}</strong></span>
                          <span>Tracking: <strong className="text-primary font-bold">{ord.trackingNumber || 'Pending'}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-heading font-bold text-xl text-slate-900">Saved Address Book</h2>
                <button onClick={() => setShowAddAddress(!showAddAddress)} className="btn-primary text-xs py-2.5 px-4 font-bold">
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form Modal/Inline */}
              {showAddAddress && (
                <form onSubmit={handleAddAddressSubmit} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
                  <h3 className="font-heading font-bold text-slate-900 text-sm">Add Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                      className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (+91)"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={newAddr.line1}
                      onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                      className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code (6 digits)"
                      value={newAddr.postalCode}
                      onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                      className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary text-xs py-2.5 px-5 font-bold">Save Address</button>
                    <button type="button" onClick={() => setShowAddAddress(false)} className="btn-secondary text-xs py-2.5 px-5 font-bold">Cancel</button>
                  </div>
                </form>
              )}

              {/* Address Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2 relative">
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                        Default Shipping Address
                      </span>
                    )}
                    <h4 className="font-heading font-bold text-sm text-slate-900">{addr.fullName}</h4>
                    <p className="text-xs text-slate-700 font-medium">{addr.line1}, {addr.city} {addr.postalCode}</p>
                    <p className="text-xs text-slate-500 font-medium">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-xl text-slate-900 pb-3 border-b border-slate-100">
                Personal Information
              </h2>
              <div className="space-y-4 max-w-md text-xs text-slate-700 font-medium">
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <span className="text-sm font-heading font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <span className="text-sm font-heading font-bold text-slate-900">{user.email}</span>
                </div>
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                  <span className="text-sm font-heading font-bold text-slate-900">{user.phone || '+91 9876543210'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
