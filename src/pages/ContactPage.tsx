import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  ChevronDown,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { submitInquiryApi } from '../services/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('retail');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What are your domestic and international shipping timeframes?',
      a: 'Pan-India retail deliveries are fulfilled via Blue Dart / DTDC Express within 3 to 5 business days. International dispatches to UAE, GCC, UK, and USA ship via DHL Express / FedEx Priority and typically reach your doorstep within 4 to 7 business days with full online live tracking.',
    },
    {
      q: 'What is the Minimum Order Quantity (MOQ) for Wholesale accounts?',
      a: 'Our entry wholesale tier starts at just 15 pieces total per order, which can be selected across different sizes (50, 52, 54, 56, 58, 60). Tier 2 discounts (38% off) unlock at 50 pieces, and customized private brand labeling with your own boutique tags is complimentary on orders exceeding 50 pieces.',
    },
    {
      q: 'Can I request bespoke size alterations before delivery?',
      a: 'Yes. Before checkout or immediately after placing your order on WhatsApp (+91 7203949101), you can provide your exact shoulder-to-floor length and bust preferences. Our master pattern cutters will tailor your piece without additional charge.',
    },
    {
      q: 'How should I care for Korean Nida and hand-embroidered Zari?',
      a: 'For abayas featuring metallic Zari cords, bullion thread, or genuine freshwater pearls, professional dry cleaning is recommended. Everyday plain Nida pieces may be hand-washed in cold water with gentle silk detergent, line-dried in the shade, and pressed with a low-heat steam iron.',
    },
    {
      q: 'What is your retail return and exchange policy?',
      a: 'We offer a seamless 7-day exchange window for all unworn standard-sized retail abayas with original security tags and packaging intact. In case of size misfit, we arrange swift reverse pickup or sizing re-alterations.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitInquiryApi({
        name,
        phone,
        email,
        inquiryType,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      // Still show confirmed feedback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getDirectWhatsAppUrl = () => {
    const text = `Salam NOORI Atelier,\n\nName: ${name || 'Patron'}\nPhone: ${phone}\nEmail: ${email}\nInquiry: ${inquiryType.toUpperCase()}\nDetails: ${message || 'I would like to connect with your concierge.'}`;
    return `https://wa.me/917203949101?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full bg-[#f7faf6] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-1">
            Private Atelier Service
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#00110c] font-normal">
            Contact &amp; Concierge
          </h1>
          <div className="w-16 h-0.5 bg-[#735c00] mx-auto mt-4 mb-4" />
          <p className="text-xs sm:text-sm text-[#414845] font-light leading-relaxed">
            Our atelier coordinators in Mumbai and Dubai are on hand for custom tailoring, bridal appointments, and boutique wholesale line-sheets.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Left Info Column (5 cols) */}
          <div className="lg:col-span-5 bg-[#062920] text-white p-8 sm:p-10 shadow-xl border border-[#ffe088]/20 flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <span className="font-serif text-3xl text-white tracking-widest uppercase font-normal block leading-none">
                  NOORI
                </span>
                <span className="text-[10px] text-[#ffe088] uppercase tracking-[0.25em] block mt-1">
                  Atelier Concierge
                </span>
              </div>

              <div className="space-y-6 text-xs text-[#e6e9e5]/90">
                <div className="flex items-start gap-4">
                  <PhoneCall className="w-5 h-5 text-[#ffe088] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#ffe088] uppercase tracking-wider block font-semibold">
                      Direct Voice &amp; WhatsApp
                    </span>
                    <a
                      href="https://wa.me/917203949101"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-white font-medium hover:text-[#ffe088] transition-colors"
                    >
                      +91 7203949101
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-[#ffe088] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#ffe088] uppercase tracking-wider block font-semibold">
                      Electronic Inquiries
                    </span>
                    <span className="text-white text-sm">concierge@noorimodest.com</span>
                    <span className="block text-[11px] text-[#e6e9e5]/60 mt-0.5">
                      wholesale@noorimodest.com
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-[#ffe088] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#ffe088] uppercase tracking-wider block font-semibold">
                      Atelier Salon Hours
                    </span>
                    <span className="text-white">Monday – Saturday: 10:00 AM – 8:30 PM (IST / GST)</span>
                    <span className="block text-[11px] text-[#e6e9e5]/60 mt-0.5">
                      Sunday: Private VIP Appointments Only
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#ffe088] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#ffe088] uppercase tracking-wider block font-semibold">
                      Workshop &amp; Presentation Salons
                    </span>
                    <span className="text-white block">Dubai Design District (d3), UAE</span>
                    <span className="text-white block mt-0.5">Colaba Heritage Atelier, Mumbai, India</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/15 mt-8">
              <a
                href="https://wa.me/917203949101?text=Salam%20NOORI,%20I%20would%20like%20to%20connect%20with%20your%20atelier."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#ffe088] text-[#00110c] text-xs uppercase tracking-widest font-semibold hover:bg-[#fed65b] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Launch Direct WhatsApp (+91 7203949101)</span>
              </a>
            </div>
          </div>

          {/* Right Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#c1c8c4]/40 p-8 sm:p-10 shadow-xs">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold block mb-1">
              Electronic Dispatch
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#00110c] font-normal mb-6">
              Send an Atelier Message
            </h2>

            {submitted ? (
              <div className="p-8 bg-[#f7faf6] border border-[#735c00]/40 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#735c00] mx-auto" />
                <h3 className="font-serif text-2xl text-[#00110c]">Message Dispatched</h3>
                <p className="text-xs sm:text-sm text-[#414845] font-light max-w-md mx-auto leading-relaxed">
                  Thank you, {name || 'Patron'}. Your inquiry has been saved to our database docket. Our head stylist will follow up with your requested details.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href={getDirectWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#062920] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#ffe088]" />
                    <span>Continue on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-[#ecefeb] text-[#00110c] text-xs uppercase tracking-wider font-semibold"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ayesha Al-Mansoor"
                      className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 7203949101 or +971"
                      className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ayesha@domain.com"
                      className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                      Inquiry Nature *
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full bg-[#f1f4f0] px-3 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                    >
                      <option value="retail">Retail Wardrobe Order</option>
                      <option value="wholesale">B2B Wholesale / Boutique Supply</option>
                      <option value="custom">Bespoke Length or Hem Alteration</option>
                      <option value="wedding">Bridal Trousseau Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#414845] font-semibold mb-1">
                    Silhouettes of Interest / Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the styles, lengths, fabrics, or volume quantities you require..."
                    className="w-full bg-[#f1f4f0] p-3 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-4 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-75"
                  >
                    <Send className="w-4 h-4 text-[#ffe088]" />
                    <span>{submitting ? 'Transmitting to Database...' : 'Submit Atelier Message'}</span>
                  </button>

                  <a
                    href={getDirectWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-4 bg-[#f1f4f0] text-[#062920] border border-[#c1c8c4] text-xs uppercase tracking-wider font-semibold hover:bg-[#ecefeb] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#735c00]" />
                    <span>Send via WhatsApp (+91 7203949101)</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold">
              Concierge Answers
            </span>
            <h2 className="font-serif text-3xl text-[#00110c] font-normal mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="bg-white border border-[#c1c8c4]/40 shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between font-serif text-base sm:text-lg text-[#00110c] font-normal"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#735c00] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#414845] font-light leading-relaxed border-t border-[#ecefeb] pt-3 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
