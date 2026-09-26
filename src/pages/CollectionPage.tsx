import React, { useState, useMemo } from 'react';
import { Product, PageId } from '../types';
import { Search, Heart, ShoppingBag, MessageCircle, Star, SlidersHorizontal } from 'lucide-react';

interface CollectionPageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigate: (page: PageId) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  searchQuery,
  setSearchQuery,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'ALL' | 'NEW' | 'BEST' | 'DAILY' | 'PARTY' | 'ROYAL'
  >('ALL');
  const [selectedFabric, setSelectedFabric] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>(
    'featured'
  );

  const categories: { id: 'ALL' | 'NEW' | 'BEST' | 'DAILY' | 'PARTY' | 'ROYAL'; label: string }[] =
    [
      { id: 'ALL', label: 'ALL SILHOUETTES' },
      { id: 'NEW', label: 'NEW ARRIVALS' },
      { id: 'BEST', label: 'BEST SELLERS' },
      { id: 'DAILY', label: 'EVERYDAY ESSENTIALS' },
      { id: 'PARTY', label: 'PARTY & FESTIVE' },
      { id: 'ROYAL', label: 'ROYAL COUTURE' },
    ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          activeCategory === 'ALL' || p.categories.includes(activeCategory);
        const matchesFabric = selectedFabric === 'ALL' || p.fabric === selectedFabric;
        const matchesSearch =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesFabric && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // featured default
      });
  }, [products, activeCategory, selectedFabric, searchQuery, sortBy]);

  return (
    <div className="w-full bg-[#f7faf6] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-1">
              Atelier Permanent &amp; Seasonal Archive
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#00110c] font-normal">
              Haute Abaya Collection
            </h1>
            <p className="text-xs sm:text-sm text-[#414845] font-light mt-1">
              Engineered with Korean Nida, Japanese satin crepe, and pure silk organza with full 120″ umbrella sweep.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#717975] uppercase tracking-wider">
              Showing: <strong className="text-[#062920]">{filteredProducts.length} Silhouettes</strong>
            </span>
          </div>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="bg-[#f1f4f0] p-4 border border-[#c1c8c4]/40 mb-10 space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#062920] text-white shadow-xs'
                      : 'bg-white text-[#414845] hover:bg-[#ecefeb]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sub-Filters: Fabric, Sort, and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#c1c8c4]/30">
            {/* Live Search */}
            <div className="flex items-center bg-white px-3 py-2 border border-[#c1c8c4]/50 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#717975] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles, fabrics, Zari..."
                className="bg-transparent text-xs text-[#181c1a] placeholder:text-[#717975] focus:outline-none w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#717975] hover:text-black ml-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white px-3 py-2 border border-[#c1c8c4]/50 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#735c00] mr-2 shrink-0" />
                <select
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="bg-transparent text-[#00110c] uppercase focus:outline-none cursor-pointer tracking-wider font-medium"
                >
                  <option value="ALL">All Fabrics</option>
                  <option value="Korean Nida">Korean Nida</option>
                  <option value="Japanese Crepe">Japanese Crepe</option>
                  <option value="Silk Organza">Silk Organza</option>
                  <option value="Royal Velvet">Royal Velvet</option>
                </select>
              </div>

              <div className="flex items-center bg-white px-3 py-2 border border-[#c1c8c4]/50 text-xs">
                <span className="text-[#735c00] mr-2 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-[#00110c] uppercase focus:outline-none cursor-pointer tracking-wider font-medium"
                >
                  <option value="featured">Featured Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Alphabetical A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#c1c8c4]/30 p-8">
            <h3 className="font-serif text-xl text-[#00110c] mb-2">No silhouettes matched your filter</h3>
            <p className="text-xs text-[#717975] mb-6">
              Try resetting your search query or selecting 'ALL SILHOUETTES'.
            </p>
            <button
              onClick={() => {
                setActiveCategory('ALL');
                setSelectedFabric('ALL');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => {
              const isWishlisted = wishlistIds.includes(prod.id);
              return (
                <article
                  key={prod.id}
                  className="bg-white border border-[#c1c8c4]/30 flex flex-col group hover:shadow-xl transition-all"
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#ecefeb]">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-1 bg-[#062920] text-white text-[10px] tracking-widest uppercase font-semibold">
                        {prod.fabric}
                      </span>
                      {prod.featured && (
                        <span className="px-2.5 py-1 bg-[#ffe088] text-[#00110c] text-[9px] tracking-wider uppercase font-semibold">
                          Bestseller
                        </span>
                      )}
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
                          B2B Tiered
                        </span>
                      </div>
                    </div>

                    <div>
                      {/* Swatches & Sizes */}
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
                          {prod.sizes.slice(0, 4).map((s, i) => (
                            <span key={s}>
                              {s}
                              {i < 3 ? '·' : ''}
                            </span>
                          ))}
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
        )}

        {/* Wholesale Notification Strip */}
        <div className="mt-16 p-8 bg-[#062920] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#ffe088]/20">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-[#ffe088] uppercase tracking-[0.2em] font-semibold block">
              Boutique Bulk Purchasing &amp; White-Labeling
            </span>
            <h4 className="font-serif text-2xl text-white font-normal">
              Running a Luxury Modest Boutique or Department Store?
            </h4>
            <p className="text-xs text-[#e6e9e5]/80 font-light max-w-xl">
              Access direct factory production pricing starting at 15 pieces per model with custom size-ratio packing and woven private labels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('wholesale')}
              className="px-6 py-3.5 bg-[#ffe088] text-[#00110c] text-xs uppercase tracking-widest font-semibold hover:bg-[#fed65b] transition-colors"
            >
              Open B2B Order Portal
            </button>
            <a
              href="https://wa.me/917203949101?text=Salam%20NOORI,%20please%20send%20the%20complete%20wholesale%20line-sheet."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/10 text-white border border-white/20 text-xs uppercase tracking-wider font-semibold hover:bg-white/20 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-[#ffe088]" />
              <span>WhatsApp B2B Line-Sheet</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
