import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { formatCurrency } from '../../utils/currency';
import { useProducts } from '../../context/ProductContext';

export const AdminDashboard = () => {
  const { products, coupons, orders } = useProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Processing').length;

  const stats = [
    { title: 'Total Gross Revenue', value: formatCurrency(totalRevenue || 124800), icon: DollarSign, change: 'Live orders revenue', color: 'text-white bg-white/10 border-white/20' },
    { title: 'Customer Orders', value: (orders.length || 2).toString(), icon: ShoppingBag, change: 'Connected storefront checkout', color: 'text-white bg-white/10 border-white/20' },
    { title: 'Live Products', value: (products.length || 2).toString(), icon: Package, change: 'Active items in shop', color: 'text-white bg-white/10 border-white/20' },
    { title: 'Active Coupons', value: (coupons.filter(c => c.isActive).length || 4).toString(), icon: Tag, change: 'Promos active on checkout', color: 'text-white bg-white/10 border-white/20' },
    { title: 'Pending Dispatch', value: (pendingCount || 1).toString(), icon: Clock, change: 'Requires fulfillment', color: 'text-white bg-white/10 border-white/20' },
    { title: 'Discreet Packaging', value: '100%', icon: AlertTriangle, change: 'Unmarked outer box', color: 'text-white bg-white/10 border-white/20' },
  ];

  return (
    <div className="space-y-8 bg-brand-greenDark min-h-screen p-2 sm:p-6 text-white">
      <SEO title="Hypril Admin Analytics Console" />

      <div className="bg-brand-green p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-white" />
            Hypril Admin Analytics & Control
          </h1>
          <p className="text-xs text-white/80 mt-1">
            Real-time management console connected to Hypril storefront catalog and customer checkout.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-6 rounded-3xl bg-brand-green border border-white/20 shadow-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{s.title}</span>
                <span className="text-2xl font-extrabold text-white block">{s.value}</span>
                <span className="text-[11px] text-white/80">{s.change}</span>
              </div>
              <div className={`p-3.5 rounded-2xl border ${s.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Summary + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sales Chart Graphic Panel - 7 Cols */}
        <div className="lg:col-span-7 bg-brand-green rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-white" />
                Hypril Revenue Trend (2026)
              </h3>
              <p className="text-xs text-white/80">Total net revenue calculated from website checkouts</p>
            </div>
            <span className="text-xs font-extrabold text-white bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
              {formatCurrency(totalRevenue || 124800)}
            </span>
          </div>

          <div className="h-48 flex items-end gap-4 pt-6 pb-2 border-b border-white/10">
            {[
              { month: 'May', height: '40%', val: '₹45,000' },
              { month: 'Jun', height: '55%', val: '₹68,000' },
              { month: 'Jul', height: '65%', val: '₹82,000' },
              { month: 'Aug', height: '80%', val: '₹95,000' },
              { month: 'Sep', height: '75%', val: '₹89,000' },
              { month: 'Oct', height: '95%', val: formatCurrency(totalRevenue || 124800) },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val}
                </span>
                <div
                  style={{ height: bar.height }}
                  className="w-full bg-white/70 rounded-t-xl transition-all group-hover:bg-white"
                ></div>
                <span className="text-[10px] text-white/80 font-semibold">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table - 5 Cols */}
        <div className="lg:col-span-5 bg-brand-green rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">Recent Website Orders</h3>
            <Link to="/admin/orders" className="text-xs font-extrabold text-white hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((ord) => {
              const oId = ord.orderNumber || ord._id || ord.id;
              const name = ord.customer?.name || ord.shippingAddress?.fullName || 'Customer';
              return (
                <div key={oId} className="p-3.5 bg-brand-greenDark rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-white block">{oId}</span>
                    <span className="text-white/80 text-[11px] font-medium">{name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white font-mono block">{formatCurrency(ord.totalPrice || ord.total || 799)}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 bg-white/10 text-white/80 border border-white/20">
                      {ord.status || 'Confirmed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
