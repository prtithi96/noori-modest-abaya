import React, { useState } from 'react';
import { PageId } from '../types';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#00110c] text-[#f7faf6]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col">
            <span className="font-serif text-3xl text-white tracking-widest uppercase font-normal leading-none">
              NOORI
            </span>
            <span className="text-[10px] text-[#ffe088] uppercase tracking-[0.25em] mt-1 font-medium">
              Modest Abaya · Haute Couture
            </span>
          </div>
          <p className="text-sm text-[#e6e9e5]/80 max-w-md font-light leading-relaxed">
            Architectural modest wear defined by serene luxury, pure Japanese crepe silks, and precision hand-embroidery. Catering to discerning retail connoisseurs and premier international wholesale boutiques across Dubai, London, and Mumbai.
          </p>
          <div className="flex flex-col gap-1 text-xs text-[#e6e9e5]/90 pt-2">
            <span className="text-[#ffe088] tracking-wider uppercase font-semibold">
              Private Concierge &amp; Wholesale Desk
            </span>
            <a
              href="https://wa.me/917203949101"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#ffe088] transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#ffe088]" />
              <span>WhatsApp / Voice: +91 7203949101</span>
            </a>
            <span className="text-[#e6e9e5]/60">Inquiries: concierge@noorimodest.com</span>
          </div>
        </div>

        {/* Boutique Navigation */}
        <div className="space-y-3">
          <h3 className="text-sm text-white tracking-wider uppercase font-medium border-b border-white/20 pb-2">
            Boutique
          </h3>
          <ul className="space-y-2.5 text-xs uppercase tracking-wider text-[#e6e9e5]/70">
            <li>
              <button
                onClick={() => navigateTo('collection')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Haute Couture Line
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('collection')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Everyday Minimalist
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('collection')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Bridal &amp; Festive Kaftans
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('lookbook')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Editorial Lookbook
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('about')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Textile &amp; Craft Archive
              </button>
            </li>
          </ul>
        </div>

        {/* Wholesale & Care */}
        <div className="space-y-3">
          <h3 className="text-sm text-white tracking-wider uppercase font-medium border-b border-white/20 pb-2">
            Wholesale &amp; Client Care
          </h3>
          <ul className="space-y-2.5 text-xs uppercase tracking-wider text-[#e6e9e5]/70">
            <li>
              <button
                onClick={() => navigateTo('wholesale')}
                className="hover:text-[#ffe088] transition-colors"
              >
                B2B Volume Line-Sheets
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('wholesale')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Custom Ratio Packing (MOQ)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('size-guide')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Bespoke Atelier Size Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('contact')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Global Express Freight
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('about')}
                className="hover:text-[#ffe088] transition-colors"
              >
                Authenticity Certificates
              </button>
            </li>
          </ul>
        </div>

        {/* Private Salon Invitation */}
        <div className="space-y-3">
          <h3 className="text-sm text-white tracking-wider uppercase font-medium border-b border-white/20 pb-2">
            Private Salon Dispatch
          </h3>
          <p className="text-xs text-[#e6e9e5]/70 font-light leading-relaxed">
            Subscribe for private collection previews, seasonal line-sheets, and curated wholesale tiered catalogues.
          </p>
          {subscribed ? (
            <div className="p-3 bg-[#062920] border border-[#ffe088]/40 text-[#ffe088] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ffe088]" />
              <span>Invitation confirmed. Welcome to the NOORI Atelier circle.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-white/10 border-b border-[#ffe088]/40 px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#ffe088]"
              />
              <button
                type="submit"
                className="mt-2 w-full py-2.5 bg-[#ffe088] text-[#00110c] text-xs uppercase font-semibold tracking-widest hover:bg-[#fed65b] transition-colors"
              >
                Receive Invitation
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[#e6e9e5]/60 text-xs tracking-widest uppercase">
          <span>© 2025 NOORI MODEST ABAYA. Haute Couture Retail &amp; Global Wholesale. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Atelier Certified Pure Silk</span>
            <span>·</span>
            <span>Express Worldwide Delivery</span>
            <span>·</span>
            <span>VAT &amp; Export Licensed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
