import React from 'react';
import { PageId } from '../types';
import { Award, Compass, Feather, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#f7faf6] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Heritage Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block">
              Our Origins · Pure Artisanship
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#00110c] font-normal leading-tight">
              Crafted for Grace, <br />
              <span className="italic text-[#735c00]">Rooted in Modesty.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#414845] font-light leading-relaxed">
              Founded with a singular conviction: to liberate modest attire from synthetic monotony and restore it to the realm of bespoke haute couture. NOORI operates fair-wage artisan workshops in Mumbai and Dubai, pairing centuries-old Zari embroidery heritage with contemporary architectural draping.
            </p>
            <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed">
              Whether preparing a solitary wedding trousseau piece or dispatching a 500-unit seasonal collection to prestigious retail department stores in London, Toronto, Riyadh, and Jeddah, our devotion to immaculate finishing remains constant.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#c1c8c4]/40">
              <div>
                <span className="font-serif text-3xl text-[#00110c] block tabular-nums">14,000+</span>
                <span className="text-[10px] text-[#717975] uppercase tracking-wider block mt-1">
                  Abayas Tailored
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#00110c] block tabular-nums">28</span>
                <span className="text-[10px] text-[#717975] uppercase tracking-wider block mt-1">
                  Countries Shipped
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#735c00] block tabular-nums">99.4%</span>
                <span className="text-[10px] text-[#717975] uppercase tracking-wider block mt-1">
                  Client Satisfaction
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-[#ecefeb] shadow-lg overflow-hidden border border-[#c1c8c4]/40">
              <img
                src="/src/assets/images/artisan_embroidery_craft_1790415798725.jpg"
                alt="Artisan stitching gold zari thread"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] bg-[#ecefeb] shadow-lg overflow-hidden border border-[#c1c8c4]/40 mt-8">
              <img
                src="/src/assets/images/abaya_emerald_zari_1790415755824.jpg"
                alt="Emerald Zari modest abaya drapery"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Textile Archive & Provenance */}
        <div className="bg-white border border-[#c1c8c4]/40 p-8 sm:p-12 mb-20 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold">
              The Textile Standard
            </span>
            <h2 className="font-serif text-3xl text-[#00110c] font-normal mt-1">
              Fabric Provenance &amp; Material Anatomy
            </h2>
            <p className="text-xs sm:text-sm text-[#414845] font-light mt-1">
              Every yard is certified for opacity, breathability, and non-clinging anti-static weight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#f7faf6] border border-[#c1c8c4]/30 space-y-3">
              <div className="w-10 h-10 bg-[#062920] text-[#ffe088] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#00110c]">Grade-A Korean Nida</h3>
              <p className="text-xs text-[#414845] font-light leading-relaxed">
                Milled exclusively from high-density microfiber filaments. Yields an ink-rich matte finish with 0% transparency, natural cooling thermal properties, and total wrinkle resistance.
              </p>
              <span className="text-[10px] text-[#735c00] uppercase tracking-wider block font-semibold">
                Used in: Royal Emerald, Madinah Daily
              </span>
            </div>

            <div className="p-6 bg-[#f7faf6] border border-[#c1c8c4]/30 space-y-3">
              <div className="w-10 h-10 bg-[#062920] text-[#ffe088] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#00110c]">Japanese Textured Crepe</h3>
              <p className="text-xs text-[#414845] font-light leading-relaxed">
                Spun with double-twisted warp threads to create a tactile pebbled hand-feel. Heavy enough to drop in architectural lines without hugging the body or static cling.
              </p>
              <span className="text-[10px] text-[#735c00] uppercase tracking-wider block font-semibold">
                Used in: Sultana Kaftan, Al-Zahra Kimono
              </span>
            </div>

            <div className="p-6 bg-[#f7faf6] border border-[#c1c8c4]/30 space-y-3">
              <div className="w-10 h-10 bg-[#062920] text-[#ffe088] flex items-center justify-center">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#00110c]">Pure Silk Organza</h3>
              <p className="text-xs text-[#414845] font-light leading-relaxed">
                Imported gossamer silk with subtle structural crispness. Layered exclusively over opaque slip garments to generate ethereal, billowing sleeve volume without modesty compromise.
              </p>
              <span className="text-[10px] text-[#735c00] uppercase tracking-wider block font-semibold">
                Used in: Lumina Tiered Abaya
              </span>
            </div>

            <div className="p-6 bg-[#f7faf6] border border-[#c1c8c4]/30 space-y-3">
              <div className="w-10 h-10 bg-[#062920] text-[#ffe088] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#00110c]">Hand-Loomed Velvet</h3>
              <p className="text-xs text-[#414845] font-light leading-relaxed">
                Plush micro-pile crushed silk velvet that catches and reflects ambient night light. Tailored with reinforced shoulders to support heavy metallic gold cord bullion work.
              </p>
              <span className="text-[10px] text-[#735c00] uppercase tracking-wider block font-semibold">
                Used in: Nocturne Ceremonial Cape
              </span>
            </div>
          </div>
        </div>

        {/* Ethical Artisanship & Fair Wages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-5">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block">
              Ethical Atelier Commitments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00110c] font-normal leading-tight">
              Fair Wages &amp; Endangered Craft Preservation
            </h2>
            <p className="text-sm text-[#414845] font-light leading-relaxed">
              Zari embroidery is an endangered generational art. Our ateliers provide living wages, safe sunlit workshop facilities, and medical care for our 65 master embroiderers and pattern tailors. We reject disposable fast-fashion cycles in favor of heirlooms built to last decades.
            </p>
            <div className="p-4 bg-[#f1f4f0] border-l-2 border-[#735c00] text-xs text-[#062920] font-medium">
              Every NOORI abaya comes with the signature of the master tailor who oversaw its final press and 48-point quality verification inspection.
            </div>
          </div>

          <div className="p-8 bg-[#062920] text-white space-y-6 border border-[#ffe088]/30">
            <h3 className="font-serif text-2xl text-white">Experience NOORI Couture</h3>
            <p className="text-xs sm:text-sm text-[#e6e9e5]/80 font-light leading-relaxed">
              Whether you are curating personal wardrobe staples or outfitting an international retail showroom, our doors are open.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('collection')}
                className="px-6 py-3.5 bg-[#ffe088] text-[#00110c] text-xs uppercase tracking-widest font-semibold hover:bg-[#fed65b] transition-colors flex items-center gap-2"
              >
                <span>Browse Silhouettes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('wholesale')}
                className="px-6 py-3.5 bg-white/10 text-white border border-white/20 text-xs uppercase tracking-wider font-semibold hover:bg-white/20 transition-colors"
              >
                Wholesale Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
