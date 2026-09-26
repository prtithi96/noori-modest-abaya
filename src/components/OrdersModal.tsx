import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrdersApi, trackOrderApi } from '../services/api';
import { X, Package, Search, Truck, Clock, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchDocket, setSearchDocket] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      getUserOrdersApi(token)
        .then((data) => setOrders(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, token]);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDocket.trim()) return;
    setTrackError(null);
    setTrackedOrder(null);
    try {
      const order = await trackOrderApi(searchDocket.trim());
      setTrackedOrder(order);
    } catch (err: any) {
      setTrackError(err.message || 'Docket not found');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#ffffff] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#c1c8c4]/40 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#ecefeb] text-[#181c1a] hover:bg-[#062920] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-1">
            Atelier Dispatch &amp; Logistics
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#00110c] font-normal">
            Orders &amp; Shipment Tracking
          </h2>
        </div>

        {/* Live Tracking Search Bar */}
        <form onSubmit={handleTrackSubmit} className="mb-8 p-4 bg-[#f1f4f0] border border-[#c1c8c4]/40">
          <span className="block text-xs uppercase tracking-wider text-[#062920] font-semibold mb-2">
            Track Any Order Docket
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchDocket}
              onChange={(e) => setSearchDocket(e.target.value)}
              placeholder="e.g. NOORI-123456"
              className="flex-1 bg-white px-3.5 py-2 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#062920] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#ffe088]" />
              <span>Track</span>
            </button>
          </div>
          {trackError && <p className="text-xs text-red-600 mt-2">{trackError}</p>}
        </form>

        {/* Display Tracked Order Result */}
        {trackedOrder && (
          <div className="mb-8 p-5 bg-[#f7faf6] border border-[#ffe088]/60 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-[#c1c8c4]/40 pb-3">
              <div>
                <span className="text-[10px] text-[#735c00] uppercase tracking-wider font-semibold block">
                  Search Result
                </span>
                <span className="font-mono text-base font-semibold text-[#00110c]">
                  Docket #{trackedOrder.orderDocketNumber}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-[#062920] text-[#ffe088] text-[10px] font-semibold uppercase tracking-wider">
                {trackedOrder.shippingStatus.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#717975] block">Customer:</span>
                <span className="font-semibold text-[#00110c]">{trackedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-[#717975] block">DHL Air Reference:</span>
                <span className="font-mono text-[#735c00] font-semibold">
                  {trackedOrder.trackingNumber}
                </span>
              </div>
              <div>
                <span className="text-[#717975] block">Order Type:</span>
                <span className="capitalize text-[#00110c] font-semibold">
                  {trackedOrder.orderType}
                </span>
              </div>
              <div>
                <span className="text-[#717975] block">Total Amount:</span>
                <span className="text-[#062920] font-semibold tabular-nums">
                  ₹{trackedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {trackedOrder.items && trackedOrder.items.length > 0 && (
              <div className="pt-2 border-t border-[#c1c8c4]/30">
                <span className="text-[11px] text-[#414845] font-semibold block mb-2">
                  Itemized Manifest:
                </span>
                <div className="space-y-1.5 text-xs text-[#181c1a]">
                  {trackedOrder.items.map((it: any) => (
                    <div
                      key={it.id}
                      className="flex justify-between p-2 bg-white border border-[#c1c8c4]/30"
                    >
                      <span>
                        {it.productName} (Size {it.size} · {it.color}) × {it.quantity}
                      </span>
                      <span className="font-semibold tabular-nums">
                        ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User's Own Database Orders */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#062920] mb-4">
            Your Order History {user ? `(${orders.length})` : ''}
          </h3>

          {!user ? (
            <div className="p-8 text-center bg-[#f7faf6] border border-[#c1c8c4]/30">
              <Package className="w-10 h-10 text-[#c1c8c4] mx-auto mb-2" />
              <p className="text-xs text-[#414845] font-light mb-3">
                Sign in with your Google account to automatically link and view all your past retail orders and boutique wholesale batches.
              </p>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-xs text-[#717975]">
              Loading orders from database...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center bg-[#f7faf6] border border-[#c1c8c4]/30">
              <Package className="w-10 h-10 text-[#c1c8c4] mx-auto mb-2" />
              <p className="text-xs text-[#414845] font-light">
                You have not placed any orders under {user.email} yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-[#f7faf6] border border-[#c1c8c4]/40 hover:border-[#062920] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c1c8c4]/30 pb-3 mb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-[#00110c] block">
                        Docket #{order.orderDocketNumber}
                      </span>
                      <span className="text-[11px] text-[#717975]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#062920] text-[#ffe088] text-[10px] font-semibold uppercase tracking-wider">
                        {order.shippingStatus}
                      </span>
                      <span className="text-xs font-semibold text-[#062920] tabular-nums">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#414845] mb-3">
                    {order.items?.map((it: any) => (
                      <div key={it.id} className="flex justify-between">
                        <span>
                          {it.productName} (Size {it.size} · {it.color}) × {it.quantity}
                        </span>
                        <span className="font-medium text-[#181c1a] tabular-nums">
                          ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] pt-3 border-t border-[#c1c8c4]/30 gap-2">
                    <span className="text-[#735c00]">
                      DHL Tracking: <strong>{order.trackingNumber}</strong>
                    </span>
                    <a
                      href={`https://wa.me/917203949101?text=${encodeURIComponent(
                        `Salam NOORI Atelier, I am inquiring about Order #${order.orderDocketNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#062920] font-semibold hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#735c00]" />
                      <span>WhatsApp Concierge Status</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
