import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  allProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onExploreCollection: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  allProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  onExploreCollection,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <aside
        aria-label="Wishlist Drawer"
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-md bg-[#ffffff] shadow-2xl flex flex-col justify-between border-l border-[#c1c8c4]/40 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 bg-[#f1f4f0] flex items-center justify-between border-b border-[#c1c8c4]/40">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#735c00] fill-[#735c00]" />
              <h2 className="text-sm font-semibold tracking-wider uppercase text-[#062920]">
                Saved Silhouettes ({wishlistedProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close wishlist"
              className="w-8 h-8 rounded-full bg-[#ecefeb] hover:bg-[#062920] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="py-16 text-center text-[#414845]">
                <Heart className="w-12 h-12 text-[#c1c8c4] mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#00110c] mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-[#717975] max-w-xs mx-auto mb-6">
                  Save your favored modest couture silhouettes to review and order at your leisure.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreCollection();
                  }}
                  className="px-6 py-2.5 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors"
                >
                  Discover Collection
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-[#f7faf6] border border-[#c1c8c4]/30 relative"
                >
                  <div className="w-20 h-24 bg-[#ecefeb] shrink-0 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-[#00110c] truncate">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="text-[#717975] hover:text-[#ba1a1a] transition-colors p-1"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#735c00] block mt-0.5">
                        {product.fabric} · Flare {product.flareHem}
                      </span>
                      <span className="text-xs font-semibold text-[#062920] block mt-1 tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onMoveToCart(product);
                      }}
                      className="w-full mt-2 py-2 bg-[#062920] text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#ffe088]" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistedProducts.length > 0 && (
            <div className="p-5 bg-[#f1f4f0] border-t border-[#c1c8c4]/40">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => onMoveToCart(p));
                }}
                className="w-full py-3.5 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#ffe088]" />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
