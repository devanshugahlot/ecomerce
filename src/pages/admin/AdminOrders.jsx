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

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const orderId = selectedOrder._id || selectedOrder.id || selectedOrder.orderNumber;

    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus, trackingNo);
      addToast(`Order ${selectedOrder.orderNumber || orderId} status updated to '${newStatus}'!`, 'success');
      setSelectedOrder(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = orders.filter(
    (o) =>
      (o.orderNumber || o._id || '').toLowerCase().includes(query.toLowerCase()) ||
      (o.customer?.name || o.shippingAddress?.fullName || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-brand-green min-h-screen p-2 sm:p-6 text-white">
      <SEO title="Admin — Hypril Order Fulfillment" />

      <div className="bg-brand-green p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-white" />
            Customer Orders Management ({orders.length})
          </h1>
          <p className="text-xs text-white/80 mt-1">
            Real-time customer orders and express fulfillment status.
          </p>
        </div>
      </div>

      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-white/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Order ID or Customer Name..."
          className="w-full bg-brand-greenDark border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/50 focus:outline-none focus:border-white"
        />
      </div>

      <div className="bg-brand-green rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/90">
            <thead className="bg-brand-greenDark text-white font-extrabold border-b border-white/20 uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-white/10">
              {filtered.map((ord) => {
                const ordId = ord._id || ord.id;
                const customerName = ord.customer?.name || ord.shippingAddress?.fullName || 'Customer';
                const phone = ord.customer?.phone || ord.shippingAddress?.phone || '';
                const itemsCount = ord.orderItems ? ord.orderItems.length : 1;
                return (
                  <tr key={ordId} className="hover:bg-brand-greenDark/50 transition-colors">
                    <td className="p-4 font-black text-white">{ord.orderNumber || ordId}</td>
                    <td className="p-4">
                      <span className="font-extrabold text-white block">{customerName}</span>
                      <span className="text-[10px] text-white/80">{phone}</span>
                    </td>
                    <td className="p-4 text-white/90 font-medium">
                      {ord.orderItems && ord.orderItems[0] ? (
                        <span>{ord.orderItems[0].name} {itemsCount > 1 ? `(+${itemsCount - 1} more)` : ''}</span>
                      ) : (
                        <span>Hypril Package ({itemsCount})</span>
                      )}
                    </td>
                    <td className="p-4 font-black text-white font-mono text-sm">{formatCurrency(ord.totalPrice || ord.total || 799)}</td>
                    <td className="p-4 font-semibold text-white/90">{ord.paymentMethod || 'COD'}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full font-extrabold text-[10px] uppercase border bg-white/10 text-white border-white/20">
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
                        className="bg-white hover:bg-slate-200 text-black text-[11px] py-2 px-4 rounded-full font-bold transition-all min-h-[44px] inline-flex items-center justify-center shadow-md"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-white/80">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-brand-green border border-white/20 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/20 pb-3">
              <h3 className="font-extrabold text-base text-white">Update Status: {selectedOrder.orderNumber || selectedOrder._id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-white font-semibold mb-1">Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white font-bold min-h-[44px]"
                >
                  <option value="Confirmed" className="bg-brand-greenDark text-white">Confirmed</option>
                  <option value="Processing" className="bg-brand-greenDark text-white">Processing</option>
                  <option value="Shipped" className="bg-brand-greenDark text-white">Shipped</option>
                  <option value="Out for Delivery" className="bg-brand-greenDark text-white">Out for Delivery</option>
                  <option value="Delivered" className="bg-brand-greenDark text-white">Delivered</option>
                  <option value="Cancelled" className="bg-brand-greenDark text-white">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">Courier Tracking Number</label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="e.g. EXP-9041284IN"
                  className="w-full bg-brand-greenDark border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white min-h-[44px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/20">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 rounded-full bg-brand-greenDark hover:bg-brand-green text-white/80 hover:text-white font-bold min-h-[44px] border border-white/20">
                  Cancel
                </button>
                <button type="submit" className="bg-white hover:bg-slate-200 text-black py-2.5 px-6 rounded-full font-extrabold shadow-md min-h-[44px]">
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
