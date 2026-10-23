'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Scissors,
  Layers,
  Palette,
  ExternalLink,
  Tag,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { useHub } from '../../context/HubContext';

type CategoryFilter = 'all' | 'salon' | 'signage' | 'art';

const portfolioItems = [
  // Salon Works
  {
    id: 's1',
    category: 'salon',
    businessName: 'Best Salon',
    title: 'Executive Low Skin Fade & Textured Crop',
    client: 'Private Executive Client',
    description: 'Zero-gap clipper precision with textured scissor top and razor-sharp perimeter line up.',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
    tags: ['Haircut', 'Skin Fade', 'Razor Finish'],
  },
  {
    id: 's2',
    category: 'salon',
    businessName: 'Best Salon',
    title: 'Luxury Beard Sculpting & Hot Towel Treatment',
    client: 'Grooming Member',
    description: 'Botanical oil beard hydration, symmetric jawline sculpting, and steam pore therapy.',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
    tags: ['Beard', 'Hot Towel', 'Luxury Treatment'],
  },
  {
    id: 's3',
    category: 'salon',
    businessName: 'Best Salon',
    title: 'Mid-Taper Fade & Waves Definition',
    client: 'Client Showcase',
    description: 'Clean temple taper with natural wave pattern enhancement and nourishing balm.',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800',
    tags: ['Taper Fade', 'Waves', 'Styling'],
  },

  // Signs & Craft Works
  {
    id: 'sg1',
    category: 'signage',
    businessName: 'Best Signs & Craft',
    title: '3D Halo-Backlit Channel Letters',
    client: 'Apex Corporate Plaza, Alagbaka',
    description: 'Brushed gold stainless steel faces with warm 3000K waterproof Samsung LED illumination.',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=800',
    tags: ['3D Letters', 'Halo Lit', 'Stainless Steel'],
  },
  {
    id: 'sg2',
    category: 'signage',
    businessName: 'Best Signs & Craft',
    title: 'Slimline Outdoor LED Lightbox Display',
    client: 'Urban Gourmet Restaurant',
    description: 'Weather-sealed aluminum extruded frame with high-clarity acrylic diffuser panel.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    tags: ['LED Lightbox', 'Storefront', 'Weatherproof'],
  },
  {
    id: 'sg3',
    category: 'signage',
    businessName: 'Best Signs & Craft',
    title: 'Full Commercial Fleet Vehicle Wrap',
    client: 'Swift Logistics Nigeria',
    description: 'Cast vinyl vehicle wrap with UV protective overlaminate for high-traffic branding.',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
    tags: ['Vehicle Wrap', 'Fleet Branding', 'UV Laminate'],
  },

  // Art Studio Works
  {
    id: 'a1',
    category: 'art',
    businessName: 'Best Art',
    title: 'The Royal Matriarch (Bespoke Oil Portrait)',
    client: 'Private Family Commission',
    description: 'Hyper-realistic oil on Italian linen capturing 80th birthday matriarch celebration.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    tags: ['Oil on Linen', 'Portraiture', 'Realism'],
  },
  {
    id: 'a2',
    category: 'art',
    businessName: 'Best Art',
    title: 'Resonance in Indigo & Gold Leaf',
    client: 'Penthouse Living Room Decor',
    description: 'Large-scale contemporary abstract canvas featuring genuine 24K gold foil and heavy textures.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    tags: ['Abstract Canvas', 'Gold Leaf', 'Mixed Media'],
  },
  {
    id: 'a3',
    category: 'art',
    businessName: 'Best Art',
    title: 'Ondo Cultural Echoes (Architectural Mural)',
    client: 'Boutique Hotel Feature Wall',
    description: 'Site-specific architectural wall mural celebrating traditional drumming and heritage regalia.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    tags: ['Wall Mural', 'Afro-Art', 'Public Space'],
  },
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const { openBooking } = useHub();

  const filteredItems = portfolioItems.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden pt-20">
      {/* 1. HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Intro */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F2937] border border-amber-500/30 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                  A Decade of Creation &bull; Akure, Nigeria
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-white mb-5">
                Our Works{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Portfolio
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#F8F9FA]/75 max-w-xl leading-relaxed mb-8">
                Explore curated craftsmanship across luxury grooming at Best Salon, architectural 3D signage
                engineering at Best Signs &amp; Craft, and original fine art portraiture and murals at Best Art.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#gallery-grid"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer"
                >
                  Browse Selected Works
                </a>
                <button
                  onClick={openBooking}
                  className="px-6 py-3.5 bg-[#1F2937] hover:bg-[#283548] border border-white/15 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer"
                >
                  Book Salon Session
                </button>
              </div>
            </div>

            {/* Right Column: Portfolio Visual Showcase */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#1F2937] shadow-2xl group aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1200"
                  alt="Best Creative Hub Portfolio Showcase"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent" />

                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#0A192F]/85 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Works</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0A192F]/90 backdrop-blur-md border border-white/15">
                  <p className="font-arcade text-amber-400 text-xs uppercase tracking-wide">
                    BEST CREATIVE HUB PORTFOLIO
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mt-0.5">
                    Grooming &bull; 3D Fabrication &bull; Fine Art
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER TABS */}
      <section id="gallery-grid" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-2xl bg-[#1F2937] border border-white/10 max-w-2xl mx-auto shadow-lg">
          {[
            { id: 'all', label: 'All Works' },
            { id: 'salon', label: 'Best Salon', icon: Scissors },
            { id: 'signage', label: 'Signs & Craft', icon: Layers },
            { id: 'art', label: 'Best Art', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as CategoryFilter)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. PORTFOLIO GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1F2937] border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col group shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0A192F]/80 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-amber-400">
                  {item.businessName}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-amber-400/90 mb-3 font-semibold">{item.client}</p>
                  <p className="text-xs text-[#F8F9FA]/70 leading-relaxed mb-6">{item.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-[#0A192F]/60 text-[10px] uppercase tracking-wider text-amber-300 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-20 p-10 rounded-3xl bg-[#1F2937] border border-white/15 text-center max-w-3xl mx-auto shadow-2xl">
          <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-3">
            Have a Project or Grooming Need in Mind?
          </h3>
          <p className="text-[#F8F9FA]/75 text-sm mb-6 max-w-lg mx-auto">
            Book an appointment with Best Salon, request a custom signage quote, or commission original
            art from our master team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openBooking}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Book Salon Appointment
            </button>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-[#0A192F] hover:bg-[#1F2937] text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/10 transition-all"
            >
              Contact The Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
