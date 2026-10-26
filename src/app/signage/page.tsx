'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Send,
  MessageSquare,
  ArrowRight,
  Zap,
  Building2,
  Car,
  Compass,
  FileText,
  Clock,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';

const signageServices = [
  {
    icon: Zap,
    title: '3D Illuminated Channel Letters',
    desc: 'Precision laser-cut acrylic and metal channel letters featuring front-lit, halo backlit, or dual illumination. Built with weather-sealed IP67 Samsung LEDs.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    tags: ['Storefronts', 'Halo Backlit', 'Stainless Steel', 'Acrylic Face'],
  },
  {
    icon: Layers,
    title: 'Slimline LED Lightbox Systems',
    desc: 'Ultra-bright, energy-efficient aluminum lightboxes with tension fabric or acrylic diffuser panels for retail facades, banks, and modern restaurant menus.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    tags: ['Weatherproof', 'High Lux Output', 'Easy Graphic Swap', 'Interior/Exterior'],
  },
  {
    icon: Building2,
    title: 'Pylon, Monolith & Directional Signs',
    desc: 'Monumental roadside pylon towers and free-standing directional monoliths engineered to withstand harsh wind and weather while providing 24/7 brand visibility.',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=800',
    tags: ['Plaza Entrances', 'Wayfinding', 'Steel Structure', 'Dual Sided'],
  },
  {
    icon: Car,
    title: 'Fleet Vehicle Branding & Full Wraps',
    desc: 'High-performance cast vinyl wraps and vehicle graphics with UV-protective overlaminate. Turn your delivery fleet and company cars into mobile billboards.',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
    tags: ['UV Laminate', 'Full & Partial Wraps', 'No Residue Removal', 'Commercial Fleets'],
  },
  {
    icon: Compass,
    title: 'Architectural Wayfinding & Safety Markers',
    desc: 'Clear, elegant directional navigation systems, ADA-compliant room identifiers, emergency exit maps, and safety markers for multi-story buildings.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    tags: ['Corporate Offices', 'Hospitals', 'Schools', 'Hotels'],
  },
  {
    icon: Sparkles,
    title: 'Bespoke Reception Logos & Craft Plaques',
    desc: 'Luxury executive reception feature walls, gold-finished brass plaques, frosted glass privacy vinyl, and custom laser-engraved acrylic craft art.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
    tags: ['Reception Walls', 'Engraved Brass', 'Glass Frosting', 'Boardrooms'],
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Site Survey & Consultation',
    desc: 'We visit your location in Akure or neighboring cities to take precise architectural measurements, assess structural mountings, and evaluate electrical feeds.',
  },
  {
    step: '02',
    title: '3D Mockups & Quotation',
    desc: 'Our graphic engineers provide scale 3D renders showing how your signage will look day and night, alongside transparent bill-of-quantities.',
  },
  {
    step: '03',
    title: 'Laser Cutting & Craft Assembly',
    desc: 'Crafted in our hub workshop using CNC lasers, acrylic benders, precision soldering, and high-efficiency certified LED components.',
  },
  {
    step: '04',
    title: 'Installation & Warranty',
    desc: 'Certified electrical connection, secure masonry anchors, site clean-up, and an active craftsmanship warranty on all fabricated assemblies.',
  },
];

export default function SignagePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    signageType: '3D Illuminated Channel Letters',
    location: '',
    details: '',
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
          subject: `Signage Quote Request: ${formData.signageType} (${formData.name})`,
          message: `Phone: ${formData.phone}\nSignage Type: ${formData.signageType}\nLocation: ${formData.location}\n\nProject Details:\n${formData.details}`,
        }),
      });

      if (response.ok) {
        toast.success('Your signage quote request has been sent! Our team will contact you shortly.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          signageType: '3D Illuminated Channel Letters',
          location: '',
          details: '',
        });
      } else {
        toast.error('Failed to submit quote request. Please reach out via WhatsApp.');
      }
    } catch (err) {
      console.error('Signage quote submit error:', err);
      toast.error('Could not connect to server. Please chat with us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden pt-20">
      {/* 1. HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-sky-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text & CTAs */}
            <div className="lg:col-span-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F2937] border border-sky-500/30 mb-6"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-sky-400">
                  Best Signs &amp; Craft &bull; Best Creative Hub
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight mb-5"
              >
                3D Illuminated Signage &amp;{' '}
                <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
                  Brand Fabrication
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-[#F8F9FA]/75 max-w-xl leading-relaxed mb-8"
              >
                Transforming storefronts, commercial plazas, and corporate headquarters across Akure
                and Ondo State. We fabricate laser-cut 3D channel letters, ultra-bright LED lightboxes,
                monumental pylon towers, and vehicle fleet branding.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5"
              >
                <a
                  href="#quote"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Request Signage Quote</span>
                </a>

                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Signs%20%26%20Craft!%20I'd%20like%20to%20discuss%20a%20signage%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Fabrication Lead</span>
                </a>
              </motion.div>
            </div>

            {/* Right Column: High Quality Illuminated Signage Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="lg:col-span-5 w-full"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#1F2937] shadow-2xl group aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5]">
                <img
                  src="/images/portfolio/signage/signage-ondipa-monument-sign.jpg"
                  alt="ONDIPA Multi-Panel Architectural Monument Signage Fabrication"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent" />

                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#0A192F]/85 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Industrial Fabrication</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0A192F]/90 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-arcade text-sky-400 text-xs uppercase tracking-wide">
                        BEST SIGNS &amp; CRAFT
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mt-0.5">
                        CNC Laser Cut &bull; IP67 LEDs &bull; Architectural Metals
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-bold text-[10px] uppercase tracking-wider">
                      Commercial Grade
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID WITH SUPPORTING IMAGES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold block mb-2">
            Engineering &amp; Production
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Our Signage Capabilities
          </h2>
          <p className="text-[#F8F9FA]/60 text-sm mt-3">
            Built with industrial CNC laser cutters, high-grade acrylic, corrosion-resistant metals,
            and IP67-rated waterproof LEDs for long-lasting brilliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {signageServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-[#1F2937] border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                {/* Supporting Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#0A192F]/80 backdrop-blur-md border border-white/10 text-sky-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#F8F9FA]/70 leading-relaxed mb-6">{service.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                    {service.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-[#0A192F]/60 text-[10px] uppercase tracking-wider text-sky-300 font-semibold"
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

      {/* 3. FABRICATION WORKFLOW */}
      <section className="py-20 bg-[#050D1A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider text-sky-400 font-bold block mb-2">
              Structured Quality Control
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Our 4-Step Production Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item, idx) => (
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
        </div>
      </section>

      {/* 4. INTERACTIVE QUOTE REQUEST FORM */}
      <section id="quote" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-[#1F2937] border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
              Fast Response Service
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Request a Signage Quote
            </h2>
            <p className="text-[#F8F9FA]/70 text-sm mt-2">
              Tell us about your brand or storefront signage requirements. We respond with technical
              specs and an estimate within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                  Full Name / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Hospital / John Adebayo"
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
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                  Phone Number (WhatsApp Preferred)
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
                  Signage Category
                </label>
                <select
                  value={formData.signageType}
                  onChange={(e) => setFormData({ ...formData, signageType: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="3D Illuminated Channel Letters">3D Illuminated Channel Letters</option>
                  <option value="Slimline LED Lightbox">Slimline LED Lightbox</option>
                  <option value="Roadside Pylon / Monolith">Roadside Pylon / Monolith</option>
                  <option value="Fleet Vehicle Branding">Fleet Vehicle Branding</option>
                  <option value="Reception Logo / Craft Plaque">Reception Logo / Craft Plaque</option>
                  <option value="Directional / Wayfinding System">Directional / Wayfinding System</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                Project Installation City / Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Alagbaka, Akure / Ondo Town / Ado-Ekiti"
                className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                Estimated Dimensions &amp; Project Description
              </label>
              <textarea
                rows={4}
                required
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Mention estimated width/height, building surface, lighting style (halo or front-lit), and timeline..."
                className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Submitting Project Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Signage Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
