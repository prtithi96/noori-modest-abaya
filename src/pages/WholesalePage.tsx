import React, { useState } from 'react';
import { Product } from '../types';
import {
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Download,
  Calculator,
  CheckCircle2,
  MessageCircle,
  Truck,
  PackageCheck,
  Tag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitInquiryApi, updateBoutiqueProfileApi } from '../services/api';

interface WholesalePageProps {
  products: Product[];
}

export const WholesalePage: React.FC<WholesalePageProps> = ({ products }) => {
  const { user, token, dbUser, refreshProfile } = useAuth();

  // Sizing Ratio Builder State
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [sizeQuantities, setSizeQuantities] = useState<{ [sz: string]: number }>({
    '50': 2,
    '52': 4,
    '54': 5,
    '56': 3,
    '58': 2,
    '60': 0,
  });

  // Inquiry Form State
  const [boutiqueName, setBoutiqueName] = useState(dbUser?.boutiqueProfile?.businessName || '');
  const [contactName, setContactName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(dbUser?.boutiqueProfile?.phone || '');
  const [country, setCountry] = useState(dbUser?.boutiqueProfile?.country || 'United Arab Emirates');
  const [city, setCity] = useState(dbUser?.boutiqueProfile?.city || '');
  const [projectedVolume, setProjectedVolume] = useState('15-49');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Calculate total pieces & pricing
  const totalPieces = Object.values(sizeQuantities).reduce((acc, curr) => acc + (curr || 0), 0);

  // Discount calculation
  let discountPercent = 0;
  let tierLabel = 'Under MOQ (15 Pcs)';
  let approvedTier = 'tier_1';

  if (totalPieces >= 200) {
    discountPercent = 45;
    tierLabel = 'Tier 3 · Enterprise Retail (45% Off)';
    approvedTier = 'tier_3';
  } else if (totalPieces >= 50) {
    discountPercent = 38;
    tierLabel = 'Tier 2 · Premier Stockist (38% Off)';
    approvedTier = 'tier_2';
  } else if (totalPieces >= 15) {
    discountPercent = 30;
    tierLabel = 'Tier 1 · Starter Boutique (30% Off)';
    approvedTier = 'tier_1';
  }

  const basePrice = selectedProduct ? selectedProduct.price : 4850;
  const discountedUnitPrice = Math.round(basePrice * (1 - discountPercent / 100));
  const totalOrderValue = discountedUnitPrice * totalPieces;
  const savings = Math.round(basePrice * (discountPercent / 100)) * totalPieces;

  const handleSizeChange = (sz: string, val: number) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [sz]: Math.max(0, val),
    }));
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Submit inquiry to database
      await submitInquiryApi({
        name: contactName,
        email: user?.email || `${contactName.toLowerCase().replace(/\s+/g, '')}@boutique.com`,
        phone,
        inquiryType: 'wholesale',
        message: `Boutique: ${boutiqueName}, Location: ${city}, ${country}, Volume: ${projectedVolume}. Notes: ${inquiryNotes}`,
      });

      // 2. If logged in, update boutique profile in PostgreSQL
      if (token) {
        await updateBoutiqueProfileApi(
          {
            businessName: boutiqueName,
            country,
            city,
            phone,
            approvedTier,
          },
          token
        );
        await refreshProfile();
      }

      setInquirySubmitted(true);
    } catch (err) {
      console.error('Failed to register boutique:', err);
      setInquirySubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const generateWholesaleWhatsAppDocket = () => {
    let msg = `Salam NOORI Wholesale Desk, I have created a B2B batch docket:\n\n`;
    msg += `Selected Model: ${selectedProduct?.name}\n`;
    msg += `Fabric: ${selectedProduct?.fabric}\n`;
    msg += `Total Pieces: ${totalPieces} Pcs\n`;
    msg += `Size Breakdown:\n`;
    Object.entries(sizeQuantities).forEach(([sz, qty]) => {
      if (qty > 0) msg += ` - Size ${sz}: ${qty} Pcs\n`;
    });
    msg += `\nApplied Discount: ${discountPercent}% (${tierLabel})\n`;
    msg += `B2B Per-Unit Price: ₹${discountedUnitPrice.toLocaleString('en-IN')}\n`;
    msg += `Total Order Estimate: ₹${totalOrderValue.toLocaleString('en-IN')}\n\n`;
    msg += `Please send the formal proforma invoice with freight options.`;
    return `https://wa.me/917203949101?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="w-full bg-[#f7faf6] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header Hero Banner */}
        <div className="bg-[#062920] text-white p-8 sm:p-12 lg:p-16 border border-[#ffe088]/20 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#ffe088] text-[11px] uppercase tracking-widest font-semibold mb-4 border border-[#ffe088]/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct Factory Manufacturing &amp; Global Boutique Supply</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight mb-4">
              WHOLESALE WITH NOORI <br />
              <span className="italic text-[#ffe088] font-light">B2B Atelier Partnership</span>
            </h1>

            <p className="text-sm sm:text-base text-[#e6e9e5]/90 font-light leading-relaxed mb-8">
              Empower your luxury boutique with high-retention modest couture. We manage end-to-end production: authentic Korean Nida sourcing, custom size-ratio packing, private neck labeling, and insured express air freight to Dubai, Riyadh, London, Toronto, and Pan-India.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#builder"
                className="px-6 py-3.5 bg-[#ffe088] text-[#00110c] text-xs uppercase tracking-widest font-semibold hover:bg-[#fed65b] transition-colors"
              >
                Interactive Sizing Calculator
              </a>
              <a
                href="https://wa.me/917203949101?text=Salam%20NOORI%20Wholesale%20Desk,%20please%20send%20the%202025%20B2B%20Lookbook%20and%20Line-sheet."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 text-white border border-white/20 text-xs uppercase tracking-wider font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#ffe088]" />
                <span>WhatsApp Line-Sheet Desk: +91 7203949101</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3 Tier Volume Cards */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold">
              Volume Economics
            </span>
            <h2 className="font-serif text-3xl text-[#00110c] font-normal mt-1">
              Tiered Wholesale Matrix
            </h2>
            <p className="text-xs sm:text-sm text-[#414845] font-light mt-1">
              Engineered to support independent boutiques testing new collections up to enterprise retail stockists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="bg-white p-8 border border-[#c1c8c4]/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#735c00] uppercase tracking-wider font-semibold block mb-2">
                  Tier 1 · Starter Boutique
                </span>
                <span className="font-serif text-3xl text-[#00110c] block mb-1">
                  15 – 49 Pieces
                </span>
                <span className="inline-block px-2.5 py-1 bg-[#f1f4f0] text-[#062920] text-xs font-semibold uppercase mb-4">
                  30% Off Retail Price
                </span>
                <ul className="space-y-2.5 text-xs text-[#414845] font-light mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#735c00] shrink-0" />
                    <span>Free mixed size-ratio selection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#735c00] shrink-0" />
                    <span>Standard NOORI luxury tissue packing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#735c00] shrink-0" />
                    <span>7–10 Business Day Express Air Dispatch</span>
                  </li>
                </ul>
              </div>
              <a
                href="#builder"
                className="w-full py-2.5 bg-[#f1f4f0] text-[#062920] text-xs uppercase tracking-wider font-semibold text-center block hover:bg-[#062920] hover:text-white transition-colors"
              >
                Calculate Tier 1 Order
              </a>
            </div>

            {/* Tier 2 */}
            <div className="bg-[#062920] text-white p-8 border border-[#ffe088]/40 shadow-xl flex flex-col justify-between relative">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-0.5 bg-[#ffe088] text-[#00110c] text-[10px] uppercase font-bold tracking-wider">
                  Most Popular
                </span>
              </div>
              <div>
                <span className="text-xs text-[#ffe088] uppercase tracking-wider font-semibold block mb-2">
                  Tier 2 · Premier Stockist
                </span>
                <span className="font-serif text-3xl text-white block mb-1">
                  50 – 199 Pieces
                </span>
                <span className="inline-block px-2.5 py-1 bg-white/10 text-[#ffe088] text-xs font-semibold uppercase mb-4 border border-[#ffe088]/30">
                  38% Off Retail Price
                </span>
                <ul className="space-y-2.5 text-xs text-[#e6e9e5]/90 font-light mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe088] shrink-0" />
                    <span>Complimentary custom woven neck labels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe088] shrink-0" />
                    <span>Custom ratio packing per boutique branch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe088] shrink-0" />
                    <span>Priority production batch queue</span>
                  </li>
                </ul>
              </div>
              <a
                href="#builder"
                className="w-full py-2.5 bg-[#ffe088] text-[#00110c] text-xs uppercase tracking-widest font-semibold text-center block hover:bg-[#fed65b] transition-colors"
              >
                Calculate Tier 2 Order
              </a>
            </div>

            {/* Tier 3 */}
            <div className="bg-white p-8 border border-[#c1c8c4]/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#735c00] uppercase tracking-wider font-semibold block mb-2">
                  Tier 3 · Enterprise Retail
                </span>
                <span className="font-serif text-3xl text-[#00110c] block mb-1">
                  200+ Pieces
                </span>
                <span className="inline-block px-2.5 py-1 bg-[#f1f4f0] text-[#062920] text-xs font-semibold uppercase mb-4">
                  45% Off Retail Price
                </span>
                <ul className="space-y-2.5 text-xs text-[#414845] font-light mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#735c00] shrink-0" />
                    <span>Exclusive bespoke silhouette co-development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#735c00] shrink-0" />
                    <span>Branded satin dustbags &amp; gold seal tags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#735c00] shrink-0" />
                    <span>Dedicated international logistics coordinator</span>
                  </li>
                </ul>
              </div>
              <a
                href="#builder"
                className="w-full py-2.5 bg-[#f1f4f0] text-[#062920] text-xs uppercase tracking-wider font-semibold text-center block hover:bg-[#062920] hover:text-white transition-colors"
              >
                Calculate Tier 3 Order
              </a>
            </div>
          </div>
        </div>

        {/* ================= INTERACTIVE B2B SIZING-RATIO & BULK ORDER BUILDER ================= */}
        <div id="builder" className="bg-white border border-[#c1c8c4]/40 p-6 sm:p-10 mb-16 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ecefeb]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#735c00] uppercase tracking-widest font-semibold mb-1">
                <Calculator className="w-4 h-4" />
                <span>Interactive Production Desk</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#00110c] font-normal">
                B2B Sizing-Ratio &amp; Bulk Order Builder
              </h2>
            </div>
            <div className="p-3 bg-[#f1f4f0] text-xs text-[#062920] font-medium border border-[#c1c8c4]/40">
              <span>Minimum Order Threshold: <strong>15 Pieces</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Config (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Silhouette Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#414845] font-semibold mb-2">
                  1. Select Abaya Silhouette Model
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#f1f4f0] p-3 text-xs text-[#00110c] font-medium uppercase tracking-wider border border-[#c1c8c4]/50 focus:outline-none focus:border-[#735c00]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price.toLocaleString('en-IN')} (Retail) · {p.fabric}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sizing Matrix Quantity Inputs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#414845] font-semibold">
                    2. Allocate Quantity Per Gulf Sizing (Inches)
                  </label>
                  <span className="text-[11px] text-[#717975]">Standard curve: 2-4-5-3-2</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {['50', '52', '54', '56', '58', '60'].map((sz) => (
                    <div key={sz} className="p-3 bg-[#f7faf6] border border-[#c1c8c4]/40 text-center">
                      <span className="block text-xs font-semibold text-[#00110c] mb-1">
                        Size {sz}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={sizeQuantities[sz] ?? 0}
                        onChange={(e) => handleSizeChange(sz, parseInt(e.target.value) || 0)}
                        className="w-full bg-white text-center py-1.5 text-xs font-semibold text-[#062920] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#062920] tabular-nums"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Private Labeling Checkboxes */}
              <div className="p-4 bg-[#f1f4f0] border border-[#c1c8c4]/40 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#062920] font-semibold block mb-1">
                  Optional Custom Value Add-ons
                </span>
                <label className="flex items-center gap-2.5 text-xs text-[#414845] cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={totalPieces >= 50}
                    className="accent-[#062920]"
                  />
                  <span>
                    Include custom woven private neck label (Complimentary for 50+ pcs)
                  </span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-[#414845] cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#062920]" />
                  <span>Individual luxury satin protective dustbag per piece</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-[#414845] cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#062920]" />
                  <span>Matching 2.2m Sheila scarf included with each abaya</span>
                </label>
              </div>
            </div>

            {/* Right Summary Docket (5 cols) */}
            <div className="lg:col-span-5 bg-[#062920] text-white p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/15 pb-3">
                  <span className="text-xs text-[#ffe088] uppercase tracking-wider font-semibold">
                    Batch Docket Overview
                  </span>
                  <span className="text-[11px] text-[#e6e9e5]/70">B2B Live Estimate</span>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-white font-normal">
                    {selectedProduct?.name}
                  </h3>
                  <span className="text-xs text-[#ffe088] block mt-0.5">
                    {selectedProduct?.fabric} · 120″ Flare
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#e6e9e5]/90 pt-2 border-t border-white/10">
                  <div className="flex justify-between">
                    <span>Aggregated Quantity:</span>
                    <span className="font-semibold text-white tabular-nums">
                      {totalPieces} Pieces
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>MOQ Qualification:</span>
                    <span
                      className={`font-semibold ${
                        totalPieces >= 15 ? 'text-[#ffe088]' : 'text-red-300'
                      }`}
                    >
                      {totalPieces >= 15 ? '✓ Approved (≥ 15 Pcs)' : 'Requires ≥ 15 Pcs'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Applied Tier Status:</span>
                    <span className="font-semibold text-[#ffe088]">{tierLabel}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Standard Retail Unit:</span>
                    <span className="line-through text-[#e6e9e5]/60 tabular-nums">
                      ₹{basePrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>B2B Wholesale Unit:</span>
                    <span className="font-semibold text-[#ffe088] tabular-nums">
                      ₹{discountedUnitPrice.toLocaleString('en-IN')} / Pc
                    </span>
                  </div>

                  <div className="flex justify-between text-emerald-300">
                    <span>Total Boutique Margin Saved:</span>
                    <span className="font-semibold tabular-nums">
                      ₹{savings.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider text-[#e6e9e5]/80">
                      Estimated Batch Total:
                    </span>
                    <span className="font-serif text-2xl text-[#ffe088] font-normal tabular-nums">
                      ₹{totalOrderValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#e6e9e5]/60 block mt-1">
                    Excludes customs tariffs · Includes insured freight calculation
                  </span>
                </div>
              </div>

              <div className="pt-6 space-y-2.5">
                <a
                  href={generateWholesaleWhatsAppDocket()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                    totalPieces >= 15
                      ? 'bg-[#ffe088] text-[#00110c] hover:bg-[#fed65b]'
                      : 'bg-white/20 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Transmit Docket to WhatsApp (+91 7203949101)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Private Labeling & B2B Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Specifications Box (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#c1c8c4]/40 p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-1">
                Atelier Standards
              </span>
              <h3 className="font-serif text-2xl text-[#00110c] font-normal">
                B2B Production Capabilities
              </h3>
            </div>

            <div className="space-y-4 text-xs text-[#414845] font-light leading-relaxed">
              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#00110c] block font-semibold">
                    Woven Damask Private Labeling
                  </strong>
                  <span>
                    Upload your high-resolution brand typography or vector artwork. We weave high-density soft edge labels that sew cleanly into the neck and Sheila scarf seam.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PackageCheck className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#00110c] block font-semibold">
                    Custom Branch Ratio Packaging
                  </strong>
                  <span>
                    Orders can be partitioned into distinct sub-cartons pre-labeled for individual retail branches across Dubai Mall, Mall of the Emirates, Riyadh Park, or Harrods.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-[#735c00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#00110c] block font-semibold">
                    Air Freight &amp; Customs Clearance
                  </strong>
                  <span>
                    We prepare official Certificates of Origin, commercial invoices, and tariff documents for seamless customs entry into GCC, UK, and European ports.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Wholesale Registration Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#f1f4f0] border border-[#c1c8c4]/40 p-8">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-1">
              Boutique Accreditation
            </span>
            <h3 className="font-serif text-2xl text-[#00110c] font-normal mb-6">
              Request Full 40+ Design Wholesale Catalogue
            </h3>

            {inquirySubmitted ? (
              <div className="p-6 bg-white border border-[#735c00]/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#735c00] mx-auto" />
                <h4 className="font-serif text-xl text-[#00110c]">
                  Wholesale Profile Registered in Database
                </h4>
                <p className="text-xs text-[#414845] max-w-md mx-auto font-light leading-relaxed">
                  Thank you, {contactName || 'Partner'}. Your boutique details have been saved to our Cloud SQL accounts desk. Our Head of B2B Accounts will transmit our complete price line-sheet to {phone || 'your WhatsApp'} within 3 business hours.
                </p>
                <button
                  onClick={() => setInquirySubmitted(false)}
                  className="px-6 py-2 bg-[#062920] text-white text-xs uppercase tracking-wider font-semibold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      Boutique / Store / Trade Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={boutiqueName}
                      onChange={(e) => setBoutiqueName(e.target.value)}
                      placeholder="e.g. Al-Noor Haute Boutique"
                      className="w-full bg-white px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      Buyer / Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full bg-white px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      WhatsApp / Business Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 / +44 / +91"
                      className="w-full bg-white px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      Store Country *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white px-3 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    >
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Kuwait / Qatar / Oman">Kuwait / Qatar / Oman</option>
                      <option value="Other International">Other International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Dubai, London, Riyadh"
                      className="w-full bg-white px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      Projected Order Volume *
                    </label>
                    <select
                      value={projectedVolume}
                      onChange={(e) => setProjectedVolume(e.target.value)}
                      className="w-full bg-white px-3 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    >
                      <option value="15-49">15 – 49 Pieces (Tier 1 · 30% Off)</option>
                      <option value="50-199">50 – 199 Pieces (Tier 2 · 38% Off)</option>
                      <option value="200+">200+ Pieces (Tier 3 · 45% Off)</option>
                      <option value="Custom">Custom Private Label Runway Collection</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                    Specific Model Requirements / Custom Tagging Details
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    placeholder="Tell us if you require custom sizing ratios, fabric changes, or sample dockets..."
                    className="w-full bg-white p-3 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors shadow-md disabled:opacity-75"
                >
                  {submitting ? 'Registering with Cloud SQL...' : 'Download Line-Sheet & Register Boutique'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
