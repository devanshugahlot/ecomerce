import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Edit2, Truck, CheckCircle, Package, RefreshCw } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.data && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.log('Error fetching orders from API');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const orderId = selectedOrder._id || selectedOrder.id;

    try {
      await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        trackingNumber: trackingNo,
      });

      setOrders(
        orders.map((o) =>
          (o._id || o.id) === orderId
            ? { ...o, status: newStatus || o.status, trackingNumber: trackingNo || o.trackingNumber }
            : o
        )
      );
      addToast(`Order ${selectedOrder.orderNumber || orderId} status updated to ${newStatus}!`, 'success');
      setSelectedOrder(null);
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const filtered = orders.filter(
    (o) =>
      (o.orderNumber || o._id || '').toLowerCase().includes(query.toLowerCase()) ||
      (o.shippingAddress?.fullName || o.customer || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEO title="Order Fulfillment Management" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-400" />
            Order Management ({orders.length})
          </h1>
          <p className="text-xs text-slate-400">Live order fulfillment connected to real customer checkouts.</p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary text-xs px-3 py-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Order ID or Customer Name..."
          className="w-full bg-dark-500 border border-dark-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="bg-dark-500 rounded-3xl border border-dark-400 overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-600 text-slate-400 font-semibold border-b border-dark-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4">Tracking No.</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-400/60">
              {filtered.map((ord) => {
                const ordId = ord._id || ord.id;
                const customerName = ord.shippingAddress?.fullName || ord.customer || 'Customer';
                const phone = ord.shippingAddress?.phone || ord.phone || '';
                return (
                  <tr key={ordId} className="hover:bg-dark-600/50">
                    <td className="p-4 font-bold text-white">{ord.orderNumber || ordId}</td>
                    <td className="p-4">
                      <span className="font-semibold text-white block">{customerName}</span>
                      <span className="text-[10px] text-slate-400">{phone}</span>
                    </td>
                    <td className="p-4 font-bold text-brand-400">{formatCurrency(ord.totalPrice || ord.total)}</td>
                    <td className="p-4">{ord.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        ord.status === 'Shipped'
                          ? 'bg-brand-500/20 text-brand-400'
                          : ord.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ord.status || 'Confirmed'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">{ord.trackingNumber || 'Pending'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setNewStatus(ord.status || 'Confirmed');
                          setTrackingNo(ord.trackingNumber || 'Pending');
                        }}
                        className="btn-secondary text-[11px] px-3 py-1.5"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
          <div className="bg-dark-500 border border-dark-400 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-lg text-white">Update Status: {selectedOrder.orderNumber || selectedOrder._id}</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-400 rounded-xl px-3 py-2 text-white"
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
                  className="w-full bg-dark-600 border border-dark-400 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-400">
                <button type="button" onClick={() => setSelectedOrder(null)} className="btn-secondary text-xs py-2 px-4">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-6">
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
