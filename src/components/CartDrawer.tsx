import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  onExploreCollection: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreCollection,
}) => {
  if (!isOpen) return null;

  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // WhatsApp order payload
  let whatsappCartText = 'Salam NOORI Atelier, I would like to place an order for my couture bag:\n\n';
  items.forEach((item, idx) => {
    whatsappCartText += `${idx + 1}. ${item.product.name} (Size: ${item.size}, Tone: ${item.color}, Qty: ${item.quantity}) - ₹${(
      item.product.price * item.quantity
    ).toLocaleString('en-IN')}\n`;
  });
  whatsappCartText += `\nEstimated Total: ₹${subtotal.toLocaleString('en-IN')}\nPlease confirm shipping address & payment docket.`;
  const whatsappUrl = `https://wa.me/917203949101?text=${encodeURIComponent(whatsappCartText)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <aside
        aria-label="Shopping Cart Drawer"
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-md bg-[#ffffff] shadow-2xl flex flex-col justify-between border-l border-[#c1c8c4]/40 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 bg-[#f1f4f0] flex items-center justify-between border-b border-[#c1c8c4]/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#735c00]" />
              <h2 className="text-sm font-semibold tracking-wider uppercase text-[#062920]">
                Your Atelier Bag ({totalCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="w-8 h-8 rounded-full bg-[#ecefeb] hover:bg-[#062920] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Milestone */}
          <div className="p-4 bg-[#f7faf6] border-b border-[#c1c8c4]/30">
            <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-1.5 font-medium">
              <span className="text-[#062920]">
                {subtotal >= freeShippingThreshold
                  ? 'Complimentary Express Air Cargo Unlocked'
                  : `Add ₹${(freeShippingThreshold - subtotal).toLocaleString('en-IN')} for Free Express Cargo`}
              </span>
              <span className="text-[#735c00] font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#ecefeb] overflow-hidden">
              <div
                className="h-full bg-[#735c00] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center text-[#414845]">
                <ShoppingBag className="w-12 h-12 text-[#c1c8c4] mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#00110c] mb-1">Your couture bag is empty</h3>
                <p className="text-xs text-[#717975] max-w-xs mx-auto mb-6">
                  Explore our handcrafted silhouettes tailored in pure Korean Nida and Japanese crepe.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreCollection();
                  }}
                  className="px-6 py-2.5 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-4 p-3 bg-[#f7faf6] border border-[#c1c8c4]/30 relative group"
                >
                  <div className="w-20 h-24 bg-[#ecefeb] shrink-0 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-semibold text-[#00110c] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-[#717975] hover:text-[#ba1a1a] transition-colors p-1"
                          title="Remove silhouette"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#414845] block mt-0.5">
                        Size: {item.size} · Tone: {item.color}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-white border border-[#c1c8c4]/60">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#062920] hover:bg-[#ecefeb]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#062920] hover:bg-[#ecefeb]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[#062920] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {items.length > 0 && (
            <div className="p-5 bg-[#f1f4f0] border-t border-[#c1c8c4]/40 space-y-3">
              <div className="flex justify-between items-center text-xs text-[#414845]">
                <span>Bag Subtotal</span>
                <span className="text-sm font-semibold text-[#00110c] tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#414845]">
                <span>Insured Global Freight</span>
                <span className="font-semibold text-[#735c00]">
                  {subtotal >= freeShippingThreshold ? 'COMPLIMENTARY' : '₹450'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#c1c8c4]/40 text-base font-semibold text-[#00110c]">
                <span>Total Amount</span>
                <span className="tabular-nums">
                  ₹{(subtotal >= freeShippingThreshold ? subtotal : subtotal + 450).toLocaleString(
                    'en-IN'
                  )}
                </span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-4 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Haute Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#ffe088]" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-white text-[#062920] border border-[#c1c8c4] text-xs uppercase tracking-wider font-semibold hover:bg-[#ecefeb] transition-colors flex items-center justify-center gap-1.5 text-center"
              >
                <MessageCircle className="w-4 h-4 text-[#735c00]" />
                <span>Order via WhatsApp (+91 7203949101)</span>
              </a>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
