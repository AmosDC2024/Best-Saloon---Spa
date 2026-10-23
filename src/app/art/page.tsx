'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Palette,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Send,
  MessageSquare,
  ArrowRight,
  Eye,
  Frame,
  Layers,
  Heart,
} from 'lucide-react';
import { toast } from 'sonner';

const artOfferings = [
  {
    icon: Heart,
    title: 'Custom Hand-Painted Portraits',
    desc: 'Hyper-realistic and expressive portraits in oil and heavy-body acrylic on primed Italian linen. Perfect for family legacies, leadership tributes, and wedding commemorations.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    tags: ['Oil on Linen', 'Acrylic Realism', 'Family Portraits', 'Celebration Art'],
  },
  {
    icon: Layers,
    title: 'Modern Textured Abstract Canvases',
    desc: 'Contemporary minimalist and textured abstract masterpieces layered with marble dust, 24K gold leaf foil, and architectural palettes tailored to luxury living rooms.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    tags: ['Gold Leaf Accents', 'Textured Mixed Media', 'Large Format', 'Custom Palettes'],
  },
  {
    icon: Sparkles,
    title: 'Architectural Wall Murals',
    desc: 'Transformative site-specific murals for boutique hotels, upscale lounges, creative spaces, and residential feature walls. Hand-painted with UV-resistant acrylics.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    tags: ['Interior Murals', 'Exterior Facades', 'Lounges & Cafes', 'Corporate Walls'],
  },
  {
    icon: Palette,
    title: 'Cultural & Afrocentric Heritage Art',
    desc: 'Vibrant explorations of Yoruba folklore, royal coronation regalia, rhythmic drumming, and contemporary African identity rendered with rich cultural reverence.',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&q=80&w=800',
    tags: ['Afro-Expressionism', 'Cultural Heritage', 'Royal Regalia', 'Collector Series'],
  },
  {
    icon: Frame,
    title: 'Museum-Grade Framing & Preservation',
    desc: 'Bespoke floating hardwood frames, shadow boxes, canvas stretching, and archival varnishing designed to preserve artwork against humidity and sunlight.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    tags: ['Hardwood Floaters', 'Archival Varnish', 'Custom Stretching', 'Conservation Glass'],
  },
];

const commissionSteps = [
  {
    step: '01',
    title: 'Creative Dialogue & Vision',
    desc: 'Share your favorite photos, interior wall dimensions, and color palette preferences with our resident lead artist.',
  },
  {
    step: '02',
    title: 'Composition Sketch & Approval',
    desc: 'We prepare preliminary digital or pencil sketches ensuring composition, lighting, and proportions are dialed in.',
  },
  {
    step: '03',
    title: 'Studio Painting with Updates',
    desc: 'As the canvas develops in our Akure studio, you receive high-resolution photo and video milestones of the progress.',
  },
  {
    step: '04',
    title: 'Curing, Framing & Delivery',
    desc: 'The painting is sealed with archival protective varnish, framed to your taste, and delivered ready to hang.',
  },
];

const showcaseArt = [
  {
    title: 'The Royal Matriarch',
    medium: 'Oil on Belgian Canvas • 48" x 60"',
    category: 'Portraiture',
    image:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Resonance in Indigo & Gold',
    medium: 'Mixed Media & Gold Leaf • 60" x 72"',
    category: 'Abstract',
    image:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Ondo Cultural Echoes',
    medium: 'Acrylic Architectural Mural',
    category: 'Wall Mural',
    image:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
  },
];

export default function ArtPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    artType: 'Custom Hand-Painted Portrait',
    dimensions: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Fine Art Commission Inquiry: ${formData.artType} (${formData.name})`,
          message: `Phone: ${formData.phone}\nArt Type: ${formData.artType}\nDesired Dimensions: ${formData.dimensions}\n\nVision Details:\n${formData.description}`,
        }),
      });

      if (response.ok) {
        toast.success('Your art commission inquiry has been sent! The studio will be in touch.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          artType: 'Custom Hand-Painted Portrait',
          dimensions: '',
          description: '',
        });
      } else {
        toast.error('Failed to submit commission request. Please message our studio via WhatsApp.');
      }
    } catch (err) {
      console.error('Art commission submit error:', err);
      toast.error('Could not connect to server. Please chat with us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden pt-20">
      {/* 1. HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text & CTAs */}
            <div className="lg:col-span-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F2937] border border-emerald-500/30 mb-6"
              >
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                  Best Art &bull; Best Creative Hub
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight mb-5"
              >
                Bespoke Fine Art,{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
                  Portraits &amp; Murals
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-[#F8F9FA]/75 max-w-xl leading-relaxed mb-8"
              >
                Enriching residences, cultural spaces, and executive corporate offices with museum-grade
                hand-painted artwork. Handcrafted on linen canvas in our Akure atelier with authentic mastery.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5"
              >
                <a
                  href="#commission"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  <span>Commission an Artwork</span>
                </a>

                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Art!%20I'd%20like%20to%20discuss%20a%20painting%20commission."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with the Studio Artist</span>
                </a>
              </motion.div>
            </div>

            {/* Right Column: Hero Art Atelier Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="lg:col-span-5 w-full"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#1F2937] shadow-2xl group aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200"
                  alt="Fine Art Portraiture and Stretched Canvas Painting in Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent" />

                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#0A192F]/85 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Akure Fine Art Atelier</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0A192F]/90 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-arcade text-emerald-400 text-xs uppercase tracking-wide">
                        BEST ART
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mt-0.5">
                        Belgian Linen &bull; 24K Gold Leaf &bull; Conservation
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase tracking-wider">
                      Museum Grade
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ART SPECIALTIES WITH SUPPORTING IMAGES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-2">
            Fine Art Disciplines
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Original Art for Discerning Collectors
          </h2>
          <p className="text-[#F8F9FA]/60 text-sm mt-3">
            Handcrafted original compositions tailored to private residences, hotels, and corporate executive suites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artOfferings.map((offering, idx) => {
            const Icon = offering.icon;
            return (
              <div
                key={idx}
                className="bg-[#1F2937] border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                {/* Supporting Discipline Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={offering.image}
                    alt={offering.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#0A192F]/80 backdrop-blur-md border border-white/10 text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
                      {offering.title}
                    </h3>
                    <p className="text-sm text-[#F8F9FA]/70 leading-relaxed mb-6">{offering.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                    {offering.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-[#0A192F]/60 text-[10px] uppercase tracking-wider text-emerald-300 font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SHOWCASE PREVIEW */}
      <section className="py-20 bg-[#050D1A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-2">
              Studio Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Selected Atelier Canvases
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {showcaseArt.map((art, idx) => (
              <div
                key={idx}
                className="rounded-3xl overflow-hidden border border-white/10 bg-[#1F2937] group shadow-xl"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent flex items-end p-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
                        {art.category}
                      </span>
                      <h4 className="text-lg font-bold text-white uppercase">{art.title}</h4>
                      <p className="text-xs text-[#F8F9FA]/70 mt-1">{art.medium}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMMISSION WORKFLOW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-2">
            The Bespoke Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            How to Commission an Artwork
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {commissionSteps.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#1F2937] border border-white/10 relative hover:border-amber-500/30 transition-all"
            >
              <span className="text-4xl font-black text-amber-500/20 block mb-3 font-mono">
                {item.step}
              </span>
              <h4 className="text-base font-bold uppercase text-white mb-2">{item.title}</h4>
              <p className="text-xs text-[#F8F9FA]/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. COMMISSION INQUIRY FORM */}
      <section id="commission" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-[#1F2937] border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
              Start Your Masterpiece
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Commission Inquiry Form
            </h2>
            <p className="text-[#F8F9FA]/70 text-sm mt-2">
              Tell us about your subject, desired size, and deadline. Our lead artist will reply
              within 24 hours with consultation availability.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chief Olumide Adekunle"
                  className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="olumide@example.com"
                  className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                  Phone (WhatsApp Preferred)
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                  Artwork Type
                </label>
                <select
                  value={formData.artType}
                  onChange={(e) => setFormData({ ...formData, artType: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="Custom Hand-Painted Portrait">Custom Hand-Painted Portrait</option>
                  <option value="Modern Textured Abstract Canvas">Modern Textured Abstract Canvas</option>
                  <option value="Architectural Wall Mural">Architectural Wall Mural</option>
                  <option value="Cultural / Afrocentric Art">Cultural / Afrocentric Art</option>
                  <option value="Other Custom Artwork">Other Custom Artwork</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                Approximate Size / Canvas Dimensions (e.g., 36" x 48", or Wall Size)
              </label>
              <input
                type="text"
                required
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="e.g. 3 feet by 4 feet / Living room accent wall"
                className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                Vision &amp; Details
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your subject, occasion, preferred mood/colors, or special symbolism..."
                className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Submitting Commission Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Commission Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
