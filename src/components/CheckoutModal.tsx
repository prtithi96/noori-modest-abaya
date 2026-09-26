import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, CheckCircle2, ShieldCheck, MessageCircle, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createOrderApi } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const { user, token } = useAuth();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'wire'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrderDocket, setConfirmedOrderDocket] = useState<{
    orderId: string;
    trackingId: string;
    total: number;
    name: string;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 450;
  const finalTotal = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        orderType: 'retail' as const,
        totalAmount: finalTotal,
        paymentMethod,
        shippingAddress: {
          street: address,
          city,
          postalCode,
          country,
        },
        items: items.map((it) => ({
          productId: it.product.id,
          productName: it.product.name,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
          unitPrice: it.product.price,
        })),
      };

      const response = await createOrderApi(orderPayload, token);

      if (response && response.order) {
        setConfirmedOrderDocket({
          orderId: response.order.orderDocketNumber,
          trackingId: response.order.trackingNumber,
          total: response.order.totalAmount,
          name: response.order.customerName,
        });
        onOrderSuccess();
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Failed to submit order to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppConfirmationUrl = () => {
    if (!confirmedOrderDocket) return '#';
    let text = `Salam NOORI Atelier, I have placed Order #${confirmedOrderDocket.orderId}!\n\n`;
    text += `Customer: ${confirmedOrderDocket.name}\n`;
    text += `Phone: ${phone}\n`;
    text += `Destination: ${city}, ${country}\n`;
    text += `Payment Mode: ${paymentMethod.toUpperCase()}\n`;
    text += `Total: ₹${confirmedOrderDocket.total.toLocaleString('en-IN')}\n\n`;
    text += `Items Ordered:\n`;
    items.forEach((it, idx) => {
      text += `${idx + 1}. ${it.product.name} (Size: ${it.size}, Qty: ${it.quantity})\n`;
    });
    text += `\nPlease confirm shipment schedule with DHL tracking ${confirmedOrderDocket.trackingId}.`;
    return `https://wa.me/917203949101?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#ffffff] max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-[#c1c8c4]/40 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close checkout"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#ecefeb] text-[#181c1a] hover:bg-[#062920] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedOrderDocket ? (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#062920] text-[#ffe088] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs text-[#735c00] uppercase tracking-[0.2em] font-semibold block mb-1">
                Order Recorded in Cloud SQL · Atelier Dispatch
              </span>
              <h2 className="font-serif text-3xl text-[#00110c] font-normal">
                Alhamdulillah! Your Order is Placed
              </h2>
            </div>

            <div className="p-5 bg-[#f7faf6] border border-[#c1c8c4]/40 text-left space-y-3 max-w-lg mx-auto">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#414845]">Atelier Order Number:</span>
                <span className="font-mono font-semibold text-[#00110c]">
                  {confirmedOrderDocket.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#414845]">DHL Priority Air Reference:</span>
                <span className="font-mono font-semibold text-[#735c00]">
                  {confirmedOrderDocket.trackingId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#414845]">Payable Amount:</span>
                <span className="font-semibold text-[#00110c] text-sm tabular-nums">
                  ₹{confirmedOrderDocket.total.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#414845]">Estimated Doorstep Delivery:</span>
                <span className="font-medium text-[#062920]">4–6 Business Days</span>
              </div>
            </div>

            <p className="text-xs text-[#414845] max-w-md mx-auto leading-relaxed font-light">
              Your garments are now entering final inspection and tissue wrapping with complimentary Sheila scarves. A copy of this docket is recorded in your database order history.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={getWhatsAppConfirmationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#ffe088]" />
                <span>Confirm on WhatsApp (+91 7203949101)</span>
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-[#ecefeb] text-[#00110c] text-xs uppercase tracking-wider font-semibold hover:bg-[#e0e3df] transition-colors"
              >
                Return to Boutique
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-1">
                Express Haute Dispatch
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#00110c] font-normal">
                Complete Your Order
              </h2>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ayesha Al-Hashemi"
                    className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] focus:outline-none focus:bg-[#e6e9e5] border border-transparent focus:border-[#735c00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 7203949101 or +971"
                    className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] focus:outline-none focus:bg-[#e6e9e5] border border-transparent focus:border-[#735c00] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha@domain.com"
                  className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] focus:outline-none focus:bg-[#e6e9e5] border border-transparent focus:border-[#735c00] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                  Delivery Street Address &amp; Villa/Flat *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Villa / Flat number, Street, Landmark"
                  className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] focus:outline-none focus:bg-[#e6e9e5] border border-transparent focus:border-[#735c00] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Dubai / London / Mumbai"
                    className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] focus:outline-none focus:bg-[#e6e9e5] border border-transparent focus:border-[#735c00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                    Postal / Zip Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Zip / Postal"
                    className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] focus:outline-none focus:bg-[#e6e9e5] border border-transparent focus:border-[#735c00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                    Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#f1f4f0] px-3 py-2.5 text-xs text-[#181c1a] focus:outline-none focus:bg-[#e6e9e5] border border-transparent focus:border-[#735c00] transition-colors"
                  >
                    <option value="India">India</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Qatar / Kuwait / Oman">Qatar / Kuwait / Oman</option>
                    <option value="Canada / Australia">Canada / Australia</option>
                  </select>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <span className="block text-xs uppercase tracking-wider text-[#062920] font-semibold mb-2">
                  Select Payment Architecture
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label
                    className={`p-3 text-center cursor-pointer border transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#062920] bg-[#f1f4f0] font-semibold text-[#062920]'
                        : 'border-[#c1c8c4]/40 bg-white text-[#414845]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="hidden"
                    />
                    <span className="text-[11px] uppercase tracking-wider block">UPI / QR</span>
                  </label>

                  <label
                    className={`p-3 text-center cursor-pointer border transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#062920] bg-[#f1f4f0] font-semibold text-[#062920]'
                        : 'border-[#c1c8c4]/40 bg-white text-[#414845]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="hidden"
                    />
                    <span className="text-[11px] uppercase tracking-wider block">Cards / Net</span>
                  </label>

                  <label
                    className={`p-3 text-center cursor-pointer border transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#062920] bg-[#f1f4f0] font-semibold text-[#062920]'
                        : 'border-[#c1c8c4]/40 bg-white text-[#414845]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="hidden"
                    />
                    <span className="text-[11px] uppercase tracking-wider block">COD (India)</span>
                  </label>

                  <label
                    className={`p-3 text-center cursor-pointer border transition-all ${
                      paymentMethod === 'wire'
                        ? 'border-[#062920] bg-[#f1f4f0] font-semibold text-[#062920]'
                        : 'border-[#c1c8c4]/40 bg-white text-[#414845]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'wire'}
                      onChange={() => setPaymentMethod('wire')}
                      className="hidden"
                    />
                    <span className="text-[11px] uppercase tracking-wider block">Bank Wire</span>
                  </label>
                </div>
              </div>

              {/* Order Breakdown Box */}
              <div className="p-4 bg-[#f7faf6] border border-[#c1c8c4]/40 space-y-2 text-xs">
                <div className="flex justify-between text-[#414845]">
                  <span>Items Subtotal ({items.length} silhouettes):</span>
                  <span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#414845]">
                  <span>Insured Express Cargo:</span>
                  <span className="font-semibold text-[#735c00]">
                    {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#c1c8c4]/40 text-sm font-semibold text-[#00110c]">
                  <span>Total Payable:</span>
                  <span className="text-base text-[#062920] tabular-nums">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#414845]">
                <Truck className="w-4 h-4 text-[#735c00]" />
                <span>Orders are securely written to Cloud SQL database and verified instantly.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-75"
              >
                <ShieldCheck className="w-4 h-4 text-[#ffe088]" />
                <span>
                  {isSubmitting
                    ? 'Recording to Cloud SQL...'
                    : `Confirm & Authorize ₹${finalTotal.toLocaleString('en-IN')}`}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
