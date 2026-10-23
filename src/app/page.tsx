'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Scissors,
  Layers,
  Palette,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  MessageCircle,
  Clock,
  MapPin,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useHub } from '../context/HubContext';

const businesses = [
  {
    id: 'salon',
    title: 'Best Salon',
    subtitle: 'Luxury Grooming & Spa Wellness',
    description:
      'Akure’s premier grooming sanctuary offering precision fades, luxury beard sculpting, restorative spa therapies, and clinical facial treatments in a sophisticated executive atmosphere.',
    href: '/salon',
    icon: Scissors,
    accent: 'amber',
    stats: '10+ Master Barbers & Therapists',
    image:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1200',
    tags: ['Skin Fades', 'Hot Towel Shave', 'Body Massage', 'Glow Facials'],
    ctaText: 'Explore Salon & Spa',
    actionText: 'Book Appointment',
  },
  {
    id: 'signage',
    title: 'Best Signs & Craft',
    subtitle: '3D Fabrication, LED Signs & Brand Identity',
    description:
      'High-impact architectural signage engineering. We fabricate illuminated 3D channel letters, ultra-bright LED lightboxes, corporate pylon monoliths, and bespoke vehicle fleet branding.',
    href: '/signage',
    icon: Layers,
    accent: 'sky',
    stats: '500+ Commercial Installations',
    image:
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=1200',
    tags: ['3D Channel Letters', 'LED Lightboxes', 'Pylon Signage', 'Vehicle Wraps'],
    ctaText: 'Explore Signs & Craft',
    actionText: 'Request Quote',
  },
  {
    id: 'art',
    title: 'Best Art',
    subtitle: 'Bespoke Fine Art, Portraiture & Murals',
    description:
      'Fine art atelier crafting original hand-painted realism portraits, statement abstract canvases, and transformative architectural wall murals for luxury residences and corporate spaces.',
    href: '/art',
    icon: Palette,
    accent: 'emerald',
    stats: '300+ Commissioned Canvases',
    image:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
    tags: ['Oil & Acrylic Portraits', 'Abstract Art', 'Wall Murals', 'Art Decor'],
    ctaText: 'Explore Art Studio',
    actionText: 'Commission Art',
  },
];

const highlights = [
  {
    icon: Award,
    title: 'Multi-Disciplinary Mastery',
    desc: 'Three world-class creative studios under one unified roof in Akure.',
  },
  {
    icon: ShieldCheck,
    title: 'Uncompromising Standards',
    desc: 'Medical-grade hygiene for salon, premium materials for signs, museum-grade pigments for art.',
  },
  {
    icon: Users,
    title: 'Master Craftsmen & Artists',
    desc: 'Dedicated specialists with over a decade of hands-on expertise in their respective trades.',
  },
  {
    icon: Sparkles,
    title: 'Bespoke Client Experience',
    desc: 'Personalized consultations, digital updates, and guaranteed client satisfaction.',
  },
];

export default function HomePage() {
  const { openBooking } = useHub();

  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-[#1F2937]/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 left-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7 text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F2937] border border-white/15 backdrop-blur-md mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                  Akure, Nigeria &bull; Premier Creative Ecosystem
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight mb-5"
              >
                Where Craft, Style &amp;{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Vision Converge
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-[#F8F9FA]/75 max-w-xl leading-relaxed mb-8"
              >
                <strong className="text-white font-semibold">Best Creative Hub</strong> unites three
                premier creative powerhouses in Ogundola layout, Akure: luxury grooming at{' '}
                <span className="text-amber-400 font-semibold">Best Salon</span>, architectural brand engineering at{' '}
                <span className="text-sky-400 font-semibold">Best Signs &amp; Craft</span>, and bespoke fine art at{' '}
                <span className="text-emerald-400 font-semibold">Best Art</span>.
              </motion.p>

              {/* Hero CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 mb-10"
              >
                <a
                  href="#businesses"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Businesses</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={openBooking}
                  className="px-6 py-3.5 bg-[#1F2937] hover:bg-[#283548] border border-white/15 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Book Salon</span>
                </button>

                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20make%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Hub</span>
                </a>
              </motion.div>

              {/* Quick Metrics */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#1F2937]/70 border border-white/10 rounded-2xl backdrop-blur-xl"
              >
                {[
                  { val: '10+', label: 'Years Experience' },
                  { val: '3', label: 'Specialized Studios' },
                  { val: '10,000+', label: 'Clients Served' },
                  { val: '100%', label: 'Quality Guarantee' },
                ].map((stat, i) => (
                  <div key={i} className="text-left sm:text-center p-2">
                    <span className="text-xl sm:text-2xl font-black text-amber-400 block tracking-tight">
                      {stat.val}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-white/70 block mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Hero Visual Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="lg:col-span-5 w-full"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#1F2937] shadow-2xl group aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
                  alt="Best Creative Hub Flagship Workshop and Atelier"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent" />

                {/* Floating Hub Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#0A192F]/85 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Akure Flagship Hub</span>
                </div>

                {/* Bottom Card Summary */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0A192F]/90 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-arcade text-amber-400 text-xs uppercase tracking-wide">
                      BEST CREATIVE HUB
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
                      Ogundola Layout, Akure
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                    <div className="p-1 rounded-lg bg-white/5">
                      <span className="text-[10px] font-bold text-amber-400 block">Salon</span>
                      <span className="text-[9px] text-white/50">Grooming &amp; Spa</span>
                    </div>
                    <div className="p-1 rounded-lg bg-white/5">
                      <span className="text-[10px] font-bold text-sky-400 block">Signage</span>
                      <span className="text-[9px] text-white/50">3D Fabrication</span>
                    </div>
                    <div className="p-1 rounded-lg bg-white/5">
                      <span className="text-[10px] font-bold text-emerald-400 block">Art</span>
                      <span className="text-[9px] text-white/50">Fine Portraits</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE BUSINESSES SECTION */}
      <section id="businesses" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Our Creative Pillars
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Three Businesses, One Standard of Excellence
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Whether you seek the sharpest haircut, high-impact commercial signage, or a museum-grade
            portrait, Best Creative Hub delivers mastery across every medium.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {businesses.map((biz) => {
            const Icon = biz.icon;
            return (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#1F2937] border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group shadow-2xl"
              >
                {/* Image Cover */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={biz.image}
                    alt={biz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />
                  <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#0A192F]/80 backdrop-blur-md border border-white/10">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
                      {biz.stats}
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                      {biz.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                      {biz.subtitle}
                    </p>
                    <p className="text-sm text-[#F8F9FA]/70 leading-relaxed mb-6">
                      {biz.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {biz.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-[#0A192F]/60 border border-white/10 text-[10px] uppercase tracking-wider text-white/70 font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <Link
                      href={biz.href}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-black text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>{biz.ctaText}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {biz.id === 'salon' ? (
                      <button
                        onClick={openBooking}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        {biz.actionText}
                      </button>
                    ) : (
                      <Link
                        href={biz.href}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl border border-white/10 transition-all"
                      >
                        {biz.actionText}
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. WHY CHOOSE BEST CREATIVE HUB */}
      <section className="py-20 bg-[#050D1A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#1F2937] border border-white/10 hover:border-amber-500/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold uppercase tracking-tight text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#F8F9FA]/60 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TRAINING & ACADEMY TEASER */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1F2937] via-[#1F2937]/90 to-[#0A192F] p-8 sm:p-14 border border-white/15 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Creative Academy &bull; Akure
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Learn a High-Income Creative Trade
            </h2>
            <p className="text-[#F8F9FA]/75 text-sm sm:text-base leading-relaxed mb-8">
              Launch your career in professional barbering, 3D signage fabrication, or fine art
              portraiture. 100% practical, studio-based apprenticeships guided by master craftsmen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/training"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <span>View Training Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="px-6 py-3.5 bg-[#1F2937] hover:bg-[#283548] text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/10 transition-all"
              >
                View Works Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HUB LOCATION & DIRECT CONTACT */}
      <section className="py-20 bg-[#050D1A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
                Visit Best Creative Hub
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-6">
                Your Destination for Grooming &amp; Creative Craft in Akure
              </h2>
              <div className="space-y-4 text-sm text-[#F8F9FA]/70 mb-8">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Studio Address:</strong> Block 1, Plot 7,
                    Ogundola layout, Akure, Ondo State, Nigeria.
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>
                    <strong className="text-white">Operating Hours:</strong> Mon – Sat: 8:00 AM –
                    8:00 PM | Sun: 12:00 PM – 6:00 PM
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>
                    <strong className="text-white">Direct Line:</strong> +234 806 805 9823
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all"
                >
                  Contact Hub Staff
                </Link>
                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20visit%20your%20hub%20in%20Akure."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-xs rounded-xl transition-all"
                >
                  Direct WhatsApp Chat
                </a>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-white/15 aspect-[4/3] bg-[#1F2937] relative">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000"
                alt="Creative Studio Atmosphere"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-transparent to-transparent flex items-end p-8">
                <div>
                  <span className="font-arcade text-lg text-amber-400 uppercase block">
                    BEST CREATIVE HUB
                  </span>
                  <p className="text-xs text-[#F8F9FA]/70 uppercase tracking-wider">
                    Block 1, Plot 7, Ogundola layout &bull; Akure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
