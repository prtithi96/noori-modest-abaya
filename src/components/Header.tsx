import React, { useState } from 'react';
import { PageId } from '../types';
import { ShoppingBag, Heart, Search, Menu, X, MessageCircle, User as UserIcon, LogOut, Package, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  openWishlist: () => void;
  openOrders: () => void;
  openSupabaseModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  cartCount,
  wishlistCount,
  openCart,
  openWishlist,
  openOrders,
  openSupabaseModal,
  searchQuery,
  setSearchQuery,
}) => {
  const { user, dbUser, signInWithGoogle, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'collection', label: 'COLLECTION' },
    { id: 'wholesale', label: 'WHOLESALE' },
    { id: 'size-guide', label: 'SIZE GUIDE' },
    { id: 'lookbook', label: 'LOOKBOOK' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage !== 'collection') {
      setCurrentPage('collection');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#f7faf6]/95 backdrop-blur-md border-b border-[#c1c8c4]/30 transition-all">
      {/* Top Ticker / B2B Alert */}
      <div className="w-full bg-[#062920] text-[#f7faf6] py-2 px-4 sm:px-8 border-b border-[#ffe088]/20">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] sm:text-[12px] tracking-[0.16em] uppercase">
          <div className="flex items-center gap-2 text-[#ffe088]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffe088] animate-pulse"></span>
            <span className="font-medium">ATELIER EDITION · GLOBAL WHOLESALE &amp; BESPOKE COUTURE</span>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-[#e6e9e5]/90">
            <span>Express Freight: GCC, UK, USA &amp; Pan-India</span>
            <span className="text-[#ffe088]/70">·</span>
            <span>Wholesale MOQ: 15 Pcs</span>
            <span className="text-[#ffe088]/70">·</span>
            <a
              href="https://wa.me/917203949101?text=Salam%20NOORI%20Atelier,%20I%20would%20like%20to%20connect%20with%20your%20B2B%20concierge."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffe088] hover:underline font-semibold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> B2B Concierge: +91 7203949101
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex flex-col text-left group focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl text-[#00110c] tracking-widest font-normal uppercase leading-none">
              NOORI
            </span>
          </div>
          <span className="text-[9px] text-[#735c00] uppercase tracking-[0.26em] mt-1 font-semibold">
            Modest Abaya · Couture
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-[12px] font-medium tracking-[0.14em] uppercase text-[#414845]">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#00110c] font-semibold'
                    : 'hover:text-[#00110c]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#735c00]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-[#ecefeb] px-3 py-1.5 border-b border-[#c1c8c4] focus-within:border-[#735c00] transition-colors"
          >
            <Search className="w-4 h-4 text-[#414845] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search silhouettes..."
              className="bg-transparent text-[13px] text-[#181c1a] placeholder:text-[#717975] focus:outline-none w-28 lg:w-40"
            />
          </form>

          {/* Supabase Connection Shortcut */}
          <button
            onClick={openSupabaseModal}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#062920] font-semibold uppercase tracking-wider hover:text-[#735c00] transition-colors"
            title="Configure Supabase Database"
          >
            <Database className="w-4 h-4 text-[#735c00]" />
            <span>Supabase</span>
          </button>

          {/* Orders Tracking Shortcut */}
          <button
            onClick={openOrders}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#062920] font-semibold uppercase tracking-wider hover:text-[#735c00] transition-colors"
          >
            <Package className="w-4 h-4 text-[#735c00]" />
            <span>Orders</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={openWishlist}
            aria-label="Wishlist"
            className="relative p-2 text-[#181c1a] hover:text-[#735c00] transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#735c00] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={openCart}
            aria-label="Shopping Cart"
            className="relative p-2 text-[#181c1a] hover:text-[#062920] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#062920] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Authentication & User Account Avatar */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#ecefeb] transition-colors"
                  aria-label="User profile menu"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#735c00]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#062920] text-[#ffe088] flex items-center justify-center font-bold text-xs uppercase">
                      {user.email ? user.email[0] : 'U'}
                    </div>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#c1c8c4]/60 shadow-2xl py-3 z-50 text-left animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-[#ecefeb]">
                      <span className="text-xs font-semibold text-[#00110c] block truncate">
                        {user.displayName || 'Patron'}
                      </span>
                      <span className="text-[11px] text-[#717975] block truncate">
                        {user.email}
                      </span>
                      {dbUser?.role === 'boutique' && (
                        <span className="mt-1 inline-block px-2 py-0.5 bg-[#062920] text-[#ffe088] text-[9px] uppercase font-bold tracking-wider">
                          Boutique Partner ({dbUser.boutiqueProfile?.approvedTier.toUpperCase()})
                        </span>
                      )}
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openOrders();
                        }}
                        className="w-full px-4 py-2 hover:bg-[#f1f4f0] text-left flex items-center gap-2 text-[#00110c]"
                      >
                        <Package className="w-3.5 h-3.5 text-[#735c00]" />
                        <span>My Orders &amp; Invoices</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openSupabaseModal();
                        }}
                        className="w-full px-4 py-2 hover:bg-[#f1f4f0] text-left flex items-center gap-2 text-[#00110c]"
                      >
                        <Database className="w-3.5 h-3.5 text-[#735c00]" />
                        <span>Supabase Backend &amp; Schema</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('wholesale');
                        }}
                        className="w-full px-4 py-2 hover:bg-[#f1f4f0] text-left flex items-center gap-2 text-[#00110c]"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#735c00]" />
                        <span>B2B Wholesale Portal</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOutUser();
                        }}
                        className="w-full px-4 py-2 hover:bg-[#f1f4f0] text-left flex items-center gap-2 text-[#ba1a1a]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-3.5 py-1.5 bg-[#062920] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#ffe088]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="xl:hidden p-2 text-[#181c1a] hover:text-[#062920] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#f7faf6] border-b border-[#c1c8c4] px-6 py-6 space-y-4 shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#ecefeb] px-3 py-2 border-b border-[#c1c8c4] mb-4">
            <Search className="w-4 h-4 text-[#414845] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search haute silhouettes..."
              className="bg-transparent text-sm text-[#181c1a] placeholder:text-[#717975] focus:outline-none w-full"
            />
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-3 text-sm font-medium tracking-widest uppercase">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2 border-b border-[#ecefeb] transition-colors ${
                  currentPage === link.id ? 'text-[#062920] font-semibold' : 'text-[#414845]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openOrders();
              }}
              className="text-left py-2 border-b border-[#ecefeb] text-[#735c00] font-semibold"
            >
              Order Tracking &amp; Invoices
            </button>
          </div>

          {/* Mobile WhatsApp Link */}
          <div className="pt-4">
            <a
              href="https://wa.me/917203949101"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#062920] text-[#f7faf6] text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#ffe088]" />
              <span>WhatsApp Concierge: +91 7203949101</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
