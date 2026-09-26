import React from 'react';
import { Product, PageId } from '../types';
import {
  ArrowRight,
  MessageCircle,
  Download,
  Star,
  CheckCircle,
  Truck,
  Layers,
  Sparkles,
  Shield,
  Heart,
  ShoppingBag,
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
  onNavigate: (page: PageId) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onNavigate,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="w-full font-sans text-[#181c1a] antialiased">
      {/* ================= HERO SECTION (EDITORIAL SPLIT / VOGUE ARABIA STYLE) ================= */}
      <section className="relative w-full bg-[#062920] text-[#f7faf6] overflow-hidden pt-8 pb-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-12 gap-8 lg:gap-12 items-center min-h-[640px]">
          {/* Left Column (7 cols) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md w-max mb-5 border border-[#ffe088]/20">
              <Sparkles className="w-4 h-4 text-[#ffe088]" />
              <span className="text-[11px] tracking-[0.22em] text-[#ffe088] uppercase font-semibold">
                Couture Heritage · Wholesale &amp; Retail Exclusive
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08] tracking-tight mb-5">
              Elegance in <br />
              <span className="italic font-light text-[#ffe088]">Every Layer.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#e6e9e5]/90 max-w-xl mb-8 font-light leading-relaxed">
              Discover handcrafted artisanal abayas engineered for royal everyday grace, grand soirees, and global boutique distribution. Masterfully tailored in Korean Nida, Japanese textured crepe, and whisper-soft Dubai silk.
            </p>

            {/* CTA Cluster */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => onNavigate('collection')}
                className="px-8 py-4 bg-[#ffe088] text-[#00110c] text-xs tracking-[0.16em] uppercase font-semibold hover:bg-[#fed65b] transition-all shadow-md flex items-center gap-2"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/917203949101?text=Salam%20NOORI%20Atelier,%20I%20would%20like%20to%20place%20an%20exclusive%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-transparent text-white border border-[#ffe088]/50 text-xs tracking-[0.16em] uppercase font-medium hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#ffe088]" />
                <span>Order on WhatsApp</span>
              </a>

              <button
                onClick={() => onNavigate('wholesale')}
                className="px-6 py-4 bg-white/10 text-[#ffe088] hover:text-white text-xs tracking-wider uppercase transition-all flex items-center gap-2 border border-white/15"
              >
                <Download className="w-4 h-4" />
                <span>B2B Lookbook</span>
              </button>
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15 max-w-lg">
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-[#ffe088] font-normal block tabular-nums">
                  15 Pcs
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#e6e9e5]/70">
                  Flexible Wholesale MOQ
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-[#ffe088] font-normal block tabular-nums">
                  7-10 Days
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#e6e9e5]/70">
                  Global Express Air
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-[#ffe088] font-normal block tabular-nums">
                  100% Pure
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#e6e9e5]/70">
                  Authentic Nida Silk
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (5 cols - Editorial Composition) */}
          <div className="col-span-12 lg:col-span-5 relative flex items-center justify-center">
            {/* Floating Editorial Label */}
            <div className="absolute -top-4 -left-6 z-20 hidden md:block bg-white text-[#00110c] p-4 shadow-xl border border-[#ffe088]/40 max-w-[210px]">
              <span className="text-[9px] text-[#735c00] uppercase tracking-[0.2em] block mb-0.5 font-semibold">
                Vogue Arabia Edition
              </span>
              <span className="font-serif text-base text-[#00110c] block leading-tight font-medium">
                Royal Zari Silhouette
              </span>
              <span className="text-[11px] text-[#717975] block mt-1">2025 Atelier Archive</span>
            </div>

            {/* Main Masterpiece Frame */}
            <div className="relative w-full aspect-[3/4] max-w-[460px] overflow-hidden shadow-2xl group border border-[#ffe088]/30">
              <img
                src="/src/assets/images/hero_abaya_couture_1790415743634.jpg"
                alt="Haute couture emerald and gold modest abaya in Moorish courtyard"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062920]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#ffe088] block font-semibold">
                    Couture Archival Edit
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-white font-normal">
                    Al-Malikah Emerald
                  </span>
                </div>
                <span className="text-base font-semibold text-[#ffe088] tabular-nums">
                  ₹4,850
                </span>
              </div>
            </div>

            {/* Floating Secondary Accent Frame */}
            <div className="absolute -bottom-6 -right-4 w-40 h-52 hidden xl:block shadow-2xl overflow-hidden group border border-[#ffe088]/40">
              <img
                src="/src/assets/images/artisan_embroidery_craft_1790415798725.jpg"
                alt="Artisan hand-stitching metallic zari gold thread"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-2 left-2 bg-[#062920]/90 px-2 py-1">
                <span className="text-[9px] text-[#ffe088] uppercase tracking-wider font-semibold">
                  Hand-Zari Detail
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ATELIER PILLARS ================= */}
      <section className="w-full bg-[#f7faf6] py-16 lg:py-24 border-b border-[#c1c8c4]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] block mb-2 font-semibold">
              The Philosophy of Modest Haute Couture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00110c] tracking-tight font-normal">
              Welcome to NOORI Atelier
            </h2>
            <div className="w-16 h-0.5 bg-[#735c00] mx-auto mt-4 mb-5" />
            <p className="text-sm text-[#414845] font-light leading-relaxed">
              Rooted in historic Islamic aesthetic proportions and refined through modern haute couture ateliers in Mumbai and Dubai. Every seam is cut to preserve modesty with majestic drapery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#f1f4f0] p-8 flex flex-col justify-between hover:bg-[#ecefeb] transition-all border border-[#c1c8c4]/30 group">
              <div>
                <div className="w-12 h-12 bg-[#062920] text-[#ffe088] flex items-center justify-center mb-6 group-hover:bg-[#0B3B2F] transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-[#735c00] uppercase tracking-[0.2em] block mb-1 font-semibold">
                  Pillar I · Textile Superiority
                </span>
                <h3 className="font-serif text-xl text-[#00110c] font-normal mb-3">
                  Authentic Opacity &amp; Drape
                </h3>
                <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed mb-6">
                  Only authenticated grade-A Korean Nida, Japanese textured crepe, and heavy crushed velvet. Never transparent, resilient to pilling, and naturally anti-static.
                </p>
              </div>
              <button
                onClick={() => onNavigate('about')}
                className="flex items-center gap-2 text-[#735c00] text-xs uppercase tracking-widest font-semibold hover:text-[#062920] transition-colors"
              >
                <span>Discover Textile Standards</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-[#f1f4f0] p-8 flex flex-col justify-between hover:bg-[#ecefeb] transition-all border border-[#c1c8c4]/30 group">
              <div>
                <div className="w-12 h-12 bg-[#062920] text-[#ffe088] flex items-center justify-center mb-6 group-hover:bg-[#0B3B2F] transition-colors">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-[#735c00] uppercase tracking-[0.2em] block mb-1 font-semibold">
                  Pillar II · Artisanal Anatomy
                </span>
                <h3 className="font-serif text-xl text-[#00110c] font-normal mb-3">
                  Architectural Modest Cuts
                </h3>
                <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed mb-6">
                  Engineered with expansive 120-inch umbrella flares, raglan drops, and reinforced necklines that drape flawlessly over any underdress without clinging.
                </p>
              </div>
              <button
                onClick={() => onNavigate('size-guide')}
                className="flex items-center gap-2 text-[#735c00] text-xs uppercase tracking-widest font-semibold hover:text-[#062920] transition-colors"
              >
                <span>Explore Sizing Anatomy</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-[#f1f4f0] p-8 flex flex-col justify-between hover:bg-[#ecefeb] transition-all border border-[#c1c8c4]/30 group">
              <div>
                <div className="w-12 h-12 bg-[#062920] text-[#ffe088] flex items-center justify-center mb-6 group-hover:bg-[#0B3B2F] transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-[#735c00] uppercase tracking-[0.2em] block mb-1 font-semibold">
                  Pillar III · Global B2B Reach
                </span>
                <h3 className="font-serif text-xl text-[#00110c] font-normal mb-3">
                  Direct Factory Wholesale
                </h3>
                <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed mb-6">
                  Low threshold entry of 15 pieces per model with custom size-ratio packing, woven private labels, and rapid priority air dispatch to GCC, Europe, and Pan-India.
                </p>
              </div>
              <button
                onClick={() => onNavigate('wholesale')}
                className="flex items-center gap-2 text-[#735c00] text-xs uppercase tracking-widest font-semibold hover:text-[#062920] transition-colors"
              >
                <span>Inquire Wholesale Accounts</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CURATED COLLECTION SPOTLIGHT ================= */}
      <section className="w-full bg-[#f7faf6] py-16 lg:py-24 border-b border-[#c1c8c4]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] block mb-1 font-semibold">
                The Atelier Showcase
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00110c] font-normal">
                Curated Haute Silhouettes
              </h2>
              <p className="text-xs sm:text-sm text-[#414845] font-light mt-1">
                Available for immediate retail delivery or volume boutique custom batch runs.
              </p>
            </div>
            <button
              onClick={() => onNavigate('collection')}
              className="text-xs uppercase tracking-widest font-semibold text-[#062920] hover:text-[#735c00] transition-colors flex items-center gap-1.5"
            >
              <span>View Full Line ({products.length} Designs)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => {
              const isWishlisted = wishlistIds.includes(prod.id);
              return (
                <article
                  key={prod.id}
                  className="bg-white border border-[#c1c8c4]/30 flex flex-col group hover:shadow-lg transition-all"
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#ecefeb]">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Tag */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-1 bg-[#062920] text-white text-[10px] tracking-widest uppercase font-semibold">
                        {prod.fabric}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onToggleWishlist(prod.id)}
                      aria-label="Wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-[#181c1a] hover:text-[#ba1a1a] flex items-center justify-center transition-colors shadow-xs"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? 'text-[#ba1a1a] fill-[#ba1a1a]' : ''
                        }`}
                      />
                    </button>

                    {/* Hover Quick Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#062920]/80 via-[#062920]/40 to-transparent flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onQuickView(prod)}
                        className="flex-1 py-2 bg-white text-[#062920] text-xs uppercase tracking-wider font-semibold hover:bg-[#ffe088] transition-colors"
                      >
                        Quick View
                      </button>
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="px-3 py-2 bg-[#ffe088] text-[#00110c] hover:bg-[#fed65b] transition-colors"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[#735c00] text-[11px] uppercase tracking-wider mb-1 font-medium">
                        <span>Flare {prod.flareHem}</span>
                        <span>MOQ: {prod.wholesaleMoq} Pcs</span>
                      </div>

                      <h3 className="font-serif text-lg text-[#00110c] font-normal group-hover:text-[#735c00] transition-colors mb-2 line-clamp-1">
                        {prod.name}
                      </h3>

                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-base font-semibold text-[#00110c] tabular-nums">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#717975] line-through tabular-nums">
                          ₹{prod.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-[#735c00] font-medium ml-auto">
                          -32% Atelier
                        </span>
                      </div>
                    </div>

                    <div>
                      {/* Color swatches & sizes */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#c1c8c4]/30">
                        <div className="flex items-center gap-1.5">
                          {prod.colors.map((c) => (
                            <span
                              key={c.name}
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#414845]">
                          <span>52</span>·<span>54</span>·<span>56</span>·<span>58</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <a
                          href={`https://wa.me/917203949101?text=Salam%20NOORI,%20I%20am%20interested%20in%20ordering%20the%20${encodeURIComponent(
                            prod.name
                          )}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-[#f1f4f0] text-[#062920] hover:bg-[#062920] hover:text-white text-[11px] uppercase tracking-wider font-semibold transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#735c00]" />
                          <span>Order on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= EDITORIAL MAGAZINE SPREAD: THE SOVEREIGN COLLECTION ================= */}
      <section className="w-full bg-[#f1f4f0] py-16 lg:py-24 border-b border-[#c1c8c4]/30 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Frame */}
            <div className="col-span-12 lg:col-span-6 relative">
              <div className="relative w-full aspect-[4/5] bg-[#ecefeb] shadow-2xl overflow-hidden group border border-[#c1c8c4]/50">
                <img
                  src="/src/assets/images/product_bisht_ceremonial_1790415849593.jpg"
                  alt="Sovereign Collection Editorial"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none text-white">
                  <span className="font-serif text-3xl md:text-4xl tracking-tight uppercase font-medium opacity-90">
                    VOGUE
                  </span>
                  <span className="font-serif text-lg text-[#ffe088] uppercase tracking-wider">
                    MODEST LUXURY
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none text-white">
                  <div>
                    <span className="font-serif text-2xl md:text-3xl uppercase tracking-wider block">
                      ROYAL BLACK
                    </span>
                    <span className="text-[10px] text-[#ffe088] uppercase tracking-[0.25em]">
                      ATELIER 2025 EDITION
                    </span>
                  </div>
                  <span className="font-serif text-base text-[#ffe088] uppercase tracking-wider text-right">
                    THE GRACE OF<br />ARCHITECTURAL SILK
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Copy */}
            <div className="col-span-12 lg:col-span-6 pl-0 lg:pl-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-px bg-[#735c00]" />
                <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold">
                  Editorial Feature · Autumn / Winter 2025
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#00110c] font-normal leading-tight mb-5">
                The Sovereign <br />
                <span className="italic text-[#735c00] font-light">Collection 2025</span>
              </h2>

              <p className="text-sm sm:text-base text-[#414845] font-light leading-relaxed mb-6">
                Conceived for the modern connoisseur whose modesty is her crowning grandeur. Our artisans spend up to 48 hand-stitching hours on each Sultana lapel, weaving genuine bullion thread onto heavy double-twisted Japanese silk crepe.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#735c00] leading-none mt-1">01</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#00110c]">
                      Bespoke Weight &amp; Anti-Static Finish
                    </h4>
                    <p className="text-xs text-[#414845] font-light mt-0.5">
                      Custom mill-treated yarns eliminate electrical charge, preventing static adhesion to under-silks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#735c00] leading-none mt-1">02</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#00110c]">
                      Hand-Twisted Metallic Cording
                    </h4>
                    <p className="text-xs text-[#414845] font-light mt-0.5">
                      Zari metallic fibers sourced directly from vintage bullion suppliers in Surat and Old Dubai.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-serif text-2xl text-[#735c00] leading-none mt-1">03</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#00110c]">
                      Full Umbrella Volume (120+ Inch Hem)
                    </h4>
                    <p className="text-xs text-[#414845] font-light mt-0.5">
                      Generous sweep allows fluid stride coverage without ankle exposure or pulling.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('collection')}
                  className="px-8 py-4 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-all shadow-md"
                >
                  Shop Runway Silhouettes
                </button>
                <button
                  onClick={() => onNavigate('lookbook')}
                  className="px-6 py-4 bg-white text-[#062920] border border-[#c1c8c4] text-xs uppercase tracking-wider font-semibold hover:bg-[#ecefeb] transition-colors"
                >
                  View Lookbook Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE NOORI ================= */}
      <section className="w-full bg-[#f7faf6] py-16 lg:py-24 border-b border-[#c1c8c4]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold">
              Uncompromising Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00110c] font-normal mt-1">
              Why Discerning Clients Choose NOORI
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-[#c1c8c4]/30 shadow-xs">
              <span className="font-serif text-4xl text-[#062920] font-light block mb-2">120″</span>
              <h3 className="text-sm font-semibold text-[#00110c] mb-1">Architectural Flare</h3>
              <p className="text-xs text-[#414845] font-light leading-relaxed">
                Custom 120-inch base hem flare provides regal, billowing stride without bunching or clumping.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#c1c8c4]/30 shadow-xs">
              <span className="font-serif text-4xl text-[#062920] font-light block mb-2">100%</span>
              <h3 className="text-sm font-semibold text-[#00110c] mb-1">Zero-Pilling Double Weave</h3>
              <p className="text-xs text-[#414845] font-light leading-relaxed">
                High-twist fibers rigorously wash-tested for over 200 cycles without texture degradation.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#c1c8c4]/30 shadow-xs">
              <span className="font-serif text-4xl text-[#735c00] font-light block mb-2">-45%</span>
              <h3 className="text-sm font-semibold text-[#00110c] mb-1">Direct Factory Wholesale</h3>
              <p className="text-xs text-[#414845] font-light leading-relaxed">
                Cut out intermediaries with factory-direct pricing for boutiques, department stores, and online stores.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#c1c8c4]/30 shadow-xs">
              <span className="font-serif text-4xl text-[#062920] font-light block mb-2">7 Days</span>
              <h3 className="text-sm font-semibold text-[#00110c] mb-1">Global Express Air Cargo</h3>
              <p className="text-xs text-[#414845] font-light leading-relaxed">
                Fast-track insured courier delivery to UAE, Saudi Arabia, Qatar, UK, USA, Canada, and Pan-India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PATRON TESTIMONIALS ================= */}
      <section className="w-full bg-[#f1f4f0] py-16 lg:py-24 border-b border-[#c1c8c4]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] block mb-1 font-semibold">
                Real Voices
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00110c] font-normal">
                Patron Testimonials
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[#735c00]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#735c00]" />
              ))}
              <span className="text-xs font-semibold text-[#00110c] ml-2">
                5.0 / 5.0 Rating (280+ Verified Orders)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#c1c8c4]/30 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#735c00] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#735c00]" />
                  ))}
                </div>
                <h4 className="font-serif text-lg text-[#00110c] mb-2 font-normal">
                  “The drape is pure poetry.”
                </h4>
                <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed mb-6">
                  I ordered the Royal Emerald Zari Abaya for an Eid gala in Dubai. The weight of the Korean Nida is exquisite—opaque, non-clinging, and the gold embroidery glistens without looking gaudy. Arrived in 4 days.
                </p>
              </div>
              <div className="pt-4 border-t border-[#ecefeb] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#00110c] block">
                    Fatima Al-Hashemi
                  </span>
                  <span className="text-[10px] text-[#717975] uppercase tracking-wider">
                    Downtown Dubai, UAE
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#f1f4f0] text-[10px] text-[#735c00] font-semibold uppercase">
                  Verified Client
                </span>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#c1c8c4]/30 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#735c00] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#735c00]" />
                  ))}
                </div>
                <h4 className="font-serif text-lg text-[#00110c] mb-2 font-normal">
                  “Wholesale partner of 2 seasons.”
                </h4>
                <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed mb-6">
                  We stock NOORI in our Knightsbridge boutique. The consistency across 60-piece orders is remarkable—precise seam tolerances, flawless hem lengths, and high client sell-through within two weeks of arrival.
                </p>
              </div>
              <div className="pt-4 border-t border-[#ecefeb] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#00110c] block">
                    Maryam Q.
                  </span>
                  <span className="text-[10px] text-[#717975] uppercase tracking-wider">
                    Kensington, London UK
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#ffe088] text-[#00110c] text-[10px] font-semibold uppercase">
                  Boutique Owner
                </span>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#c1c8c4]/30 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#735c00] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#735c00]" />
                  ))}
                </div>
                <h4 className="font-serif text-lg text-[#00110c] mb-2 font-normal">
                  “The WhatsApp concierge is unmatched.”
                </h4>
                <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed mb-6">
                  I had urgent length adjustment requests for my wedding reception. The concierge desk coordinated with their master pattern maker immediately. Both the Bisht and matching Sheila fit like high fashion couture.
                </p>
              </div>
              <div className="pt-4 border-t border-[#ecefeb] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#00110c] block">
                    Zainab Khan
                  </span>
                  <span className="text-[10px] text-[#717975] uppercase tracking-wider">
                    South Mumbai, India
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#f1f4f0] text-[10px] text-[#735c00] font-semibold uppercase">
                  Verified Client
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ATELIER CONCIERGE BANNER ================= */}
      <section className="w-full bg-[#062920] text-white py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-[#ffe088] uppercase tracking-[0.2em] font-semibold block">
              Private Concierge &amp; Bespoke Alterations
            </span>
            <h3 className="font-serif text-2xl text-white font-normal">
              Need Personal Length Alterations or Wholesale Guidance?
            </h3>
            <p className="text-xs sm:text-sm text-[#e6e9e5]/80 font-light">
              Speak directly with our atelier stylists and head pattern master.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/917203949101?text=Salam%20NOORI,%20I%20would%20like%20to%20consult%20with%20your%20atelier%20stylist."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#ffe088] text-[#00110c] text-xs uppercase tracking-widest font-semibold hover:bg-[#fed65b] transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Stylist (+91 7203949101)</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 bg-white/10 text-white text-xs uppercase tracking-wider font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              Contact Atelier
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
