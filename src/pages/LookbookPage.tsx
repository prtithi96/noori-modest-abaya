import React from 'react';
import { Product, PageId } from '../types';
import { ArrowRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';

interface LookbookPageProps {
  products: Product[];
  onNavigate: (page: PageId) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const LookbookPage: React.FC<LookbookPageProps> = ({
  products,
  onNavigate,
  onQuickView,
  onAddToCart,
}) => {
  const editorialSpreads = [
    {
      title: 'The Sovereign Midnight',
      subtitle: 'Ceremonial Royal Bisht Collection',
      season: 'Winter Couture 2025',
      image: '/src/assets/images/product_bisht_ceremonial_1790415849593.jpg',
      quote:
        '“Modesty rendered monumental. Pure obsidian drapery trimmed with heavy vintage gold bullion cord, commanding palace corridors and royal wedding halls.”',
      occasion: 'Grand Soirées, Bridal Receptions & Royal Diplomatic Functions',
      fabric: 'Grade-A Korean Nida with Gold Bullion Cording',
      productId: 'prod-7',
    },
    {
      title: 'Al-Malikah Emerald',
      subtitle: 'Imperial Court Heritage Edit',
      season: 'Autumn / Winter 2025',
      image: '/src/assets/images/hero_abaya_couture_1790415743634.jpg',
      quote:
        '“Inspired by the royal courtyards of Granada and Old Dubai. The deep emerald hue absorbs midday sun and illuminates under evening candlelight.”',
      occasion: 'Eid Celebrations, VIP Dinners & Cultural Banquets',
      fabric: 'Double-Weave Korean Nida with Metallic Zari',
      productId: 'prod-1',
    },
    {
      title: 'Gossamer Lumina',
      subtitle: 'Tiered Italian Silk Organza',
      season: 'Spring / Summer Runway',
      image: '/src/assets/images/abaya_lumina_organza_1790415782541.jpg',
      quote:
        '“Like morning light breaking across desert dunes. Sheer bell sleeves that drift weightlessly over tailored silk slips with mother-of-pearl closures.”',
      occasion: 'Daytime Garden Galas, Luxury Brunches & Summer Soirées',
      fabric: 'Pure Italian Silk Organza & Satin Slip',
      productId: 'prod-3',
    },
    {
      title: 'The Ottoman Sultana',
      subtitle: 'Architectural Geometric Lapels',
      season: 'Permanent Haute Series',
      image: '/src/assets/images/abaya_sultana_gold_1790415767650.jpg',
      quote:
        '“A masterclass in geometric equilibrium. Japanese crepe that falls in heavy, wrinkle-free lines accented by ancient arabesque gold-work.”',
      occasion: 'Everyday Luxury, Gallery Openings & High-Profile Conclaves',
      fabric: 'Japanese Satin Crepe & Gold Wire Embroidery',
      productId: 'prod-2',
    },
  ];

  return (
    <div className="w-full bg-[#f7faf6] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Vogue Arabia Inspired Visual Archive</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#00110c] font-normal">
            Atelier Lookbook 2025
          </h1>
          <div className="w-16 h-0.5 bg-[#735c00] mx-auto mt-4 mb-4" />
          <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed">
            An immersive visual chronicle of architectural modest couture. Shot on location in historic Moorish courtyards and contemporary travertine salons.
          </p>
        </div>

        {/* Editorial Spreads */}
        <div className="space-y-20 lg:space-y-32">
          {editorialSpreads.map((spread, idx) => {
            const product = products.find((p) => p.id === spread.productId);
            const isEven = idx % 2 === 0;

            return (
              <div
                key={spread.title}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                {/* Visual Column */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="relative aspect-[4/5] bg-[#ecefeb] shadow-2xl overflow-hidden group border border-[#c1c8c4]/40">
                    <img
                      src={spread.image}
                      alt={spread.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                      <div>
                        <span className="text-[10px] text-[#ffe088] uppercase tracking-[0.2em] font-semibold">
                          {spread.season}
                        </span>
                        <span className="font-serif text-2xl md:text-3xl block">
                          {spread.title}
                        </span>
                      </div>
                      <span className="text-xs text-[#ffe088] uppercase tracking-wider font-medium">
                        Plate {idx + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Narrative Column */}
                <div
                  className={`lg:col-span-5 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  } flex flex-col justify-center`}
                >
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-6 h-px bg-[#735c00]" />
                    <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold">
                      {spread.subtitle}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl text-[#00110c] font-normal mb-4">
                    {spread.title}
                  </h2>

                  <blockquote className="font-serif italic text-base sm:text-lg text-[#414845] leading-relaxed mb-6 border-l-2 border-[#735c00] pl-4">
                    {spread.quote}
                  </blockquote>

                  <div className="space-y-3 p-4 bg-white border border-[#c1c8c4]/40 text-xs mb-8">
                    <div>
                      <span className="text-[#717975] uppercase tracking-wider block font-medium">
                        Recommended Occasion:
                      </span>
                      <span className="text-[#00110c] font-semibold">{spread.occasion}</span>
                    </div>
                    <div>
                      <span className="text-[#717975] uppercase tracking-wider block font-medium">
                        Textile Architecture:
                      </span>
                      <span className="text-[#735c00] font-semibold">{spread.fabric}</span>
                    </div>
                  </div>

                  {product && (
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => onQuickView(product)}
                        className="px-6 py-3.5 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <Eye className="w-4 h-4 text-[#ffe088]" />
                        <span>Inspect Silhouette</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="px-6 py-3.5 bg-white text-[#062920] border border-[#c1c8c4] text-xs uppercase tracking-wider font-semibold hover:bg-[#ecefeb] transition-colors flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#735c00]" />
                        <span>Add to Bag (₹{product.price.toLocaleString('en-IN')})</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to collection */}
        <div className="mt-24 text-center py-16 bg-[#f1f4f0] border border-[#c1c8c4]/40">
          <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-2">
            The Complete Atelier Line
          </span>
          <h3 className="font-serif text-3xl text-[#00110c] font-normal mb-6">
            Explore All 8 Haute Silhouettes
          </h3>
          <button
            onClick={() => onNavigate('collection')}
            className="px-8 py-4 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors inline-flex items-center gap-2 shadow-md"
          >
            <span>Open Collection Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#ffe088]" />
          </button>
        </div>
      </div>
    </div>
  );
};
