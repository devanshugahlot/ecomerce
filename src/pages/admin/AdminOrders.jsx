import React, { useState } from 'react';
import { ShoppingBag, Search, Truck, CheckCircle, Package, X, Sparkles } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { useProducts } from '../../context/ProductContext';

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useProducts();
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const { addToast } = useToast();

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const orderId = selectedOrder._id || selectedOrder.id;

    updateOrderStatus(orderId, newStatus);
    addToast(`Order ${selectedOrder.orderNumber || orderId} status updated to '${newStatus}'!`, 'success');
    setSelectedOrder(null);
  };

  const filtered = orders.filter(
    (o) =>
      (o.orderNumber || o._id || '').toLowerCase().includes(query.toLowerCase()) ||
      (o.customer?.name || o.shippingAddress?.fullName || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-dark-900 min-h-screen p-2 sm:p-6 text-slate-100">
      <SEO title="Admin — Hypril Order Fulfillment" />

      <div className="bg-dark-800 p-6 rounded-3xl border border-dark-600 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            Customer Orders Management ({orders.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time customer orders and express fulfillment status.
          </p>
        </div>
      </div>

      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Order ID or Customer Name..."
          className="w-full bg-dark-800 border border-dark-600 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-dark-800 rounded-3xl border border-dark-600 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-700 text-amber-400 font-extrabold border-b border-dark-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/70">
              {filtered.map((ord) => {
                const ordId = ord._id || ord.id;
                const customerName = ord.customer?.name || ord.shippingAddress?.fullName || 'Customer';
                const phone = ord.customer?.phone || ord.shippingAddress?.phone || '';
                const itemsCount = ord.orderItems ? ord.orderItems.length : 1;
                return (
                  <tr key={ordId} className="hover:bg-dark-700/50 transition-colors">
                    <td className="p-4 font-black text-white">{ord.orderNumber || ordId}</td>
                    <td className="p-4">
                      <span className="font-extrabold text-white block">{customerName}</span>
                      <span className="text-[10px] text-slate-400">{phone}</span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      {ord.orderItems && ord.orderItems[0] ? (
                        <span>{ord.orderItems[0].name} {itemsCount > 1 ? `(+${itemsCount - 1} more)` : ''}</span>
                      ) : (
                        <span>Hypril™ Package ({itemsCount})</span>
                      )}
                    </td>
                    <td className="p-4 font-black text-amber-400 text-sm">{formatCurrency(ord.totalPrice || ord.total || 799)}</td>
                    <td className="p-4 font-semibold text-slate-300">{ord.paymentMethod || 'COD'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase border ${
                        ord.status === 'Shipped'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : ord.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {ord.status || 'Confirmed'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setNewStatus(ord.status || 'Confirmed');
                          setTrackingNo(ord.trackingNumber || 'EXP-904128IN');
                        }}
                        className="btn-primary bg-amber-500 hover:bg-amber-600 text-dark-900 text-[11px] py-1.5 px-3.5 font-extrabold shadow-glow-amber"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No orders found matching "{query}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-dark-800 border border-dark-600 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-dark-600 pb-3">
              <h3 className="font-extrabold text-base text-white">Update Status: {selectedOrder.orderNumber || selectedOrder._id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Courier Tracking Number</label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="e.g. EXP-9041284IN"
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-dark-600">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="btn-primary bg-amber-500 hover:bg-amber-600 text-dark-900 py-2.5 px-6 font-extrabold shadow-glow-amber">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
