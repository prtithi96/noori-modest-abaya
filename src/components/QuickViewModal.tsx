import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, MessageCircle, Star, ShieldCheck } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onOpenSizeGuide: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  const whatsappMessage = encodeURIComponent(
    `Salam NOORI Atelier, I would like to inquire about ordering:\n` +
      `Product: ${product.name}\n` +
      `Price: ₹${product.price.toLocaleString('en-IN')}\n` +
      `Size: ${selectedSize}\n` +
      `Color: ${selectedColor}\n` +
      `Quantity: ${quantity}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#ffffff] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#c1c8c4]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#ecefeb] text-[#181c1a] hover:bg-[#062920] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image preview */}
          <div className="relative bg-[#ecefeb] aspect-[3/4] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="px-2.5 py-1 bg-[#062920] text-[#f7faf6] text-[10px] tracking-widest uppercase font-semibold">
                {product.fabric}
              </span>
              <span className="px-2.5 py-1 bg-[#ffe088] text-[#00110c] text-[10px] tracking-wider uppercase font-semibold">
                Hem: {product.flareHem}
              </span>
            </div>
          </div>

          {/* Details & Purchase Configuration */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#735c00] mb-2 font-medium">
                <span>{product.fabric} Atelier Series</span>
                <div className="flex items-center gap-1 text-[#735c00]">
                  <Star className="w-3.5 h-3.5 fill-[#735c00]" />
                  <span>{product.rating.toFixed(1)} ({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#00110c] font-normal mb-3">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-semibold text-[#00110c] tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-[#717975] line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#735c00] font-medium tracking-wide">
                  Wholesale MOQ: {product.wholesaleMoq} Pcs
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Swatches */}
              <div className="mb-5">
                <span className="text-xs uppercase tracking-wider text-[#181c1a] font-medium block mb-2">
                  Select Tone: <span className="font-semibold text-[#735c00]">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 border text-xs tracking-wider uppercase transition-all ${
                        selectedColor === c.name
                          ? 'border-[#062920] bg-[#f1f4f0] font-semibold text-[#062920]'
                          : 'border-[#c1c8c4] text-[#414845] hover:border-[#062920]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-wider text-[#181c1a] font-medium">
                    Select Length (Inches)
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSizeGuide();
                    }}
                    className="text-xs text-[#735c00] hover:underline uppercase tracking-wider font-semibold"
                  >
                    View Sizing Guide →
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                        selectedSize === sz
                          ? 'bg-[#062920] text-white'
                          : 'bg-[#f1f4f0] text-[#181c1a] hover:bg-[#e0e3df]'
                      }`}
                    >
                      Size {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-[#181c1a] font-medium">
                  Quantity:
                </span>
                <div className="flex items-center bg-[#ecefeb] border border-[#c1c8c4]/40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-semibold hover:bg-[#e0e3df] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-semibold tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-semibold hover:bg-[#e0e3df] transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#414845]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#062920]" />
                  <span>Includes Matching 2.2m Sheila Scarf</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-[#ecefeb]">
              <button
                onClick={handleAdd}
                className="w-full py-3.5 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#ffe088]" />
                <span>{addedNotice ? 'Added to Bag!' : 'Add to Couture Bag'}</span>
              </button>

              <a
                href={`https://wa.me/917203949101?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#f1f4f0] text-[#062920] text-xs uppercase tracking-wider font-semibold hover:bg-[#e0e3df] transition-colors flex items-center justify-center gap-2 border border-[#c1c8c4]/50"
              >
                <MessageCircle className="w-4 h-4 text-[#735c00]" />
                <span>Instant WhatsApp Order (+91 7203949101)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
