import React, { useState } from 'react';
import { Ruler, MessageCircle, Info, Sparkles, Check } from 'lucide-react';

export const SizeGuidePage: React.FC = () => {
  // Sizing Calculator State
  const [userHeightFeet, setUserHeightFeet] = useState<number>(5);
  const [userHeightInches, setUserHeightInches] = useState<number>(4);
  const [heelHeight, setHeelHeight] = useState<'flat' | 'mid' | 'high'>('mid');
  const [fitStyle, setFitStyle] = useState<'traditional' | 'cropped' | 'flowing'>('traditional');

  // Calculation Logic
  // Total height in inches
  const totalHeightInches = userHeightFeet * 12 + userHeightInches;

  // Abaya length is standard shoulder-to-floor. Usually height - 10 to 11 inches for flat.
  // Standard Gulf mapping:
  // 4'10" - 5'0" (58-60 in) => Size 50 (length 50")
  // 5'1" - 5'2" (61-62 in) => Size 52 (length 52")
  // 5'3" - 5'4" (63-64 in) => Size 54 (length 54")
  // 5'5" - 5'6" (65-66 in) => Size 56 (length 56")
  // 5'7" - 5'8" (67-68 in) => Size 58 (length 58")
  // 5'9"+ (69+ in) => Size 60 (length 60")

  let recommendedBaseSize = 54;
  if (totalHeightInches <= 60) recommendedBaseSize = 50;
  else if (totalHeightInches <= 62) recommendedBaseSize = 52;
  else if (totalHeightInches <= 64) recommendedBaseSize = 54;
  else if (totalHeightInches <= 66) recommendedBaseSize = 56;
  else if (totalHeightInches <= 68) recommendedBaseSize = 58;
  else recommendedBaseSize = 60;

  // Heel adjustment
  let adjustedSize = recommendedBaseSize;
  if (heelHeight === 'high' && adjustedSize < 60) {
    adjustedSize += 2;
  }
  if (fitStyle === 'cropped' && adjustedSize > 50) {
    adjustedSize -= 2;
  }

  const sizingData = [
    {
      size: 'Size 50',
      height: "4'10″ – 5'0″ (147–152 cm)",
      length: '50 Inches (127 cm)',
      bust: '40 Inches',
      sleeve: '26 Inches',
      flare: '110 Inches',
      isStandard: false,
    },
    {
      size: 'Size 52',
      height: "5'1″ – 5'2″ (155–158 cm)",
      length: '52 Inches (132 cm)',
      bust: '42 Inches',
      sleeve: '27 Inches',
      flare: '115 Inches',
      isStandard: false,
    },
    {
      size: 'Size 54',
      height: "5'3″ – 5'4″ (160–163 cm)",
      length: '54 Inches (137 cm)',
      bust: '44 Inches',
      sleeve: '28 Inches',
      flare: '120 Inches',
      isStandard: true,
    },
    {
      size: 'Size 56',
      height: "5'5″ – 5'6″ (165–168 cm)",
      length: '56 Inches (142 cm)',
      bust: '46 Inches',
      sleeve: '29 Inches',
      flare: '120 Inches',
      isStandard: false,
    },
    {
      size: 'Size 58',
      height: "5'7″ – 5'8″ (170–173 cm)",
      length: '58 Inches (147 cm)',
      bust: '48 Inches',
      sleeve: '30 Inches',
      flare: '125 Inches',
      isStandard: false,
    },
    {
      size: 'Size 60',
      height: "5'9″ – 5'11″ (175–180 cm)",
      length: '60 Inches (152 cm)',
      bust: '50 Inches',
      sleeve: '31 Inches',
      flare: '125 Inches',
      isStandard: false,
    },
  ];

  return (
    <div className="w-full bg-[#f7faf6] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-1">
            Atelier Precision Fit
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#00110c] font-normal">
            Abaya Sizing &amp; Measurement Guide
          </h1>
          <div className="w-16 h-0.5 bg-[#735c00] mx-auto mt-4 mb-4" />
          <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed">
            Traditional Gulf sizing is designated by the garment's total shoulder-to-hem length in inches. Use our interactive tailor calculator below to determine your exact royal drape.
          </p>
        </div>

        {/* Interactive Fit Recommender */}
        <div className="bg-white border border-[#c1c8c4]/40 p-6 sm:p-10 mb-16 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#735c00] uppercase tracking-widest font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Fit Recommender</span>
          </div>
          <h2 className="font-serif text-2xl text-[#00110c] font-normal mb-6">
            Calculate Your Bespoke Abaya Size
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#414845] font-semibold mb-2">
                  1. Your Natural Height
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-[#717975] block mb-1">Feet</span>
                    <select
                      value={userHeightFeet}
                      onChange={(e) => setUserHeightFeet(parseInt(e.target.value))}
                      className="w-full bg-[#f1f4f0] p-2.5 text-xs text-[#00110c] font-semibold border border-[#c1c8c4]/60 focus:outline-none"
                    >
                      <option value={4}>4 Feet</option>
                      <option value={5}>5 Feet</option>
                      <option value={6}>6 Feet</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#717975] block mb-1">Inches</span>
                    <select
                      value={userHeightInches}
                      onChange={(e) => setUserHeightInches(parseInt(e.target.value))}
                      className="w-full bg-[#f1f4f0] p-2.5 text-xs text-[#00110c] font-semibold border border-[#c1c8c4]/60 focus:outline-none"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i}>
                          {i} Inches ({Math.round((userHeightFeet * 12 + i) * 2.54)} cm)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#414845] font-semibold mb-2">
                  2. Usual Footwear / Heel Choice
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setHeelHeight('flat')}
                    className={`p-3 text-xs uppercase tracking-wider border font-medium transition-all ${
                      heelHeight === 'flat'
                        ? 'bg-[#062920] text-white border-[#062920]'
                        : 'bg-[#f1f4f0] text-[#414845] border-[#c1c8c4]/40 hover:bg-[#ecefeb]'
                    }`}
                  >
                    Flats / Slides (0″)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeelHeight('mid')}
                    className={`p-3 text-xs uppercase tracking-wider border font-medium transition-all ${
                      heelHeight === 'mid'
                        ? 'bg-[#062920] text-white border-[#062920]'
                        : 'bg-[#f1f4f0] text-[#414845] border-[#c1c8c4]/40 hover:bg-[#ecefeb]'
                    }`}
                  >
                    Mid Heels (1–2″)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeelHeight('high')}
                    className={`p-3 text-xs uppercase tracking-wider border font-medium transition-all ${
                      heelHeight === 'high'
                        ? 'bg-[#062920] text-white border-[#062920]'
                        : 'bg-[#f1f4f0] text-[#414845] border-[#c1c8c4]/40 hover:bg-[#ecefeb]'
                    }`}
                  >
                    Stilettos (3″+)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#414845] font-semibold mb-2">
                  3. Preferred Modest Silhouette Drape
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFitStyle('cropped')}
                    className={`p-3 text-xs uppercase tracking-wider border font-medium transition-all ${
                      fitStyle === 'cropped'
                        ? 'bg-[#062920] text-white border-[#062920]'
                        : 'bg-[#f1f4f0] text-[#414845] border-[#c1c8c4]/40 hover:bg-[#ecefeb]'
                    }`}
                  >
                    Ankle-Free (Easy walk)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitStyle('traditional')}
                    className={`p-3 text-xs uppercase tracking-wider border font-medium transition-all ${
                      fitStyle === 'traditional'
                        ? 'bg-[#062920] text-white border-[#062920]'
                        : 'bg-[#f1f4f0] text-[#414845] border-[#c1c8c4]/40 hover:bg-[#ecefeb]'
                    }`}
                  >
                    Floor-Kissing (Regal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitStyle('flowing')}
                    className={`p-3 text-xs uppercase tracking-wider border font-medium transition-all ${
                      fitStyle === 'flowing'
                        ? 'bg-[#062920] text-white border-[#062920]'
                        : 'bg-[#f1f4f0] text-[#414845] border-[#c1c8c4]/40 hover:bg-[#ecefeb]'
                    }`}
                  >
                    Grand Sweep (Trailing)
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendation Result Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#062920] text-white p-8 border border-[#ffe088]/30 shadow-md">
              <span className="text-xs text-[#ffe088] uppercase tracking-[0.25em] font-semibold block mb-2">
                Tailor's Recommendation
              </span>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-5xl text-[#ffe088] font-normal">
                  Size {adjustedSize}
                </span>
                <span className="text-sm text-[#e6e9e5]/80 font-light">
                  ({adjustedSize} Inches Length)
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#e6e9e5]/90 py-4 border-y border-white/15 my-4">
                <p>
                  <strong>Total Garment Length:</strong> {adjustedSize}″ (
                  {Math.round(adjustedSize * 2.54)} cm)
                </p>
                <p>
                  <strong>Built-in Bust Ease:</strong> Cut with 4–6″ ease to allow graceful movement over dresses.
                </p>
                <p>
                  <strong>Flare Sweep:</strong> 120″ (305 cm) umbrella circumference preventing ankle display.
                </p>
              </div>

              <a
                href={`https://wa.me/917203949101?text=Salam%20NOORI,%20my%20height%20is%20${userHeightFeet}ft%20${userHeightInches}in.%20I%20would%20like%20to%20confirm%20Size%20${adjustedSize}%20for%20my%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#ffe088] text-[#00110c] text-xs uppercase tracking-widest font-semibold hover:bg-[#fed65b] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm Size with Tailor</span>
              </a>
            </div>
          </div>
        </div>

        {/* Traditional Gulf Sizing Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Table (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-[#c1c8c4]/40 p-6 shadow-xs overflow-x-auto">
            <div className="flex items-center gap-2 text-xs text-[#735c00] uppercase tracking-wider font-semibold mb-3">
              <Ruler className="w-4 h-4" />
              <span>Standard Architectural Proportions</span>
            </div>
            <h3 className="font-serif text-2xl text-[#00110c] font-normal mb-4">
              Complete Dimensions Matrix
            </h3>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f1f4f0] uppercase tracking-wider text-[#00110c] border-b border-[#c1c8c4]/60 font-semibold">
                  <th className="p-3.5">Abaya Size</th>
                  <th className="p-3.5">Height Bracket</th>
                  <th className="p-3.5">Length</th>
                  <th className="p-3.5">Bust</th>
                  <th className="p-3.5">Sleeve</th>
                  <th className="p-3.5">Flare Hem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecefeb] text-[#181c1a]">
                {sizingData.map((row) => (
                  <tr key={row.size} className="hover:bg-[#f7faf6] transition-colors">
                    <td className="p-3.5 font-semibold text-[#00110c] flex items-center gap-2">
                      <span>{row.size}</span>
                      {row.isStandard && (
                        <span className="px-1.5 py-0.5 bg-[#ffe088] text-[#00110c] text-[9px] uppercase font-bold">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-[#414845]">{row.height}</td>
                    <td className="p-3.5 font-medium">{row.length}</td>
                    <td className="p-3.5">{row.bust}</td>
                    <td className="p-3.5">{row.sleeve}</td>
                    <td className="p-3.5 font-semibold text-[#735c00]">{row.flare}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 p-3 bg-[#f1f4f0] text-[#414845] text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#735c00] shrink-0" />
                <span>Require custom hem alterations or bust expansion?</span>
              </span>
              <a
                href="https://wa.me/917203949101?text=Salam%20NOORI,%20I%20would%20like%20a%20custom%20size%20alteration."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#062920] font-semibold hover:underline"
              >
                Speak with Head Tailor →
              </a>
            </div>
          </div>

          {/* How to Measure Instructions (4 cols) */}
          <div className="lg:col-span-4 bg-[#f1f4f0] border border-[#c1c8c4]/40 p-6 space-y-5">
            <span className="text-xs text-[#735c00] uppercase tracking-widest font-semibold block">
              Tailor Instructions
            </span>
            <h3 className="font-serif text-xl text-[#00110c] font-normal">
              How to Measure at Home
            </h3>

            <div className="space-y-4 text-xs text-[#414845] leading-relaxed">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#062920] text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                  1
                </span>
                <div>
                  <strong className="text-[#00110c] block font-semibold">Abaya Length</strong>
                  <span>
                    Measure vertically from the highest point of the shoulder over the bust down to the floor with your intended footwear on.
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#062920] text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                  2
                </span>
                <div>
                  <strong className="text-[#00110c] block font-semibold">Bust Circumference</strong>
                  <span>
                    Measure across the fullest part of your bust. Abayas are intentionally cut with 4–6 inches of built-in ease for fluid drape.
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#062920] text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                  3
                </span>
                <div>
                  <strong className="text-[#00110c] block font-semibold">Sleeve Length</strong>
                  <span>
                    Measure from the base of the neck along the shoulder down to the wrist bone.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#c1c8c4]/60">
              <a
                href="https://wa.me/917203949101?text=Salam%20NOORI,%20please%20help%20me%20confirm%20my%20measurements."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#062920] text-white text-xs uppercase tracking-wider block text-center font-semibold hover:bg-[#0B3B2F] transition-colors"
              >
                Request Sizing Concierge
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
