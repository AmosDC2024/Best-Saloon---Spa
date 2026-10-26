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
  Eye,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useHub } from '../../context/HubContext';

type CategoryFilter = 'all' | 'barbing' | 'signage' | 'art';

const portfolioItems = [
  // --- Barbing Works (11 New Supplied Works + 3 Original Salon Works) ---
  {
    id: 'b-curly-top-fade',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Textured Top & Clean Fade',
    client: 'Featured Client Cut',
    description: 'Strong, close-up finished haircut featuring a precision skin fade, sharp perimeter lines, and natural textured curly top.',
    image: '/images/portfolio/barbing/barbing-curly-top-fade.jpg',
    tags: ['Featured', 'Curly Top', 'Clean Fade', 'Barbing'],
  },
  {
    id: 'b-classic-fade-beard',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Classic Fade & Beard',
    client: 'Client Portrait',
    description: 'Finished classic fade combined with a sculpted, hydrated full beard and clean neckline.',
    image: '/images/portfolio/barbing/barbing-classic-fade-beard-portrait.jpg',
    tags: ['Classic Fade', 'Beard Grooming', 'Portrait'],
  },
  {
    id: 'b-sharp-fade-beard',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Precision Fade & Beard Detail',
    client: 'Grooming Showcase',
    description: 'High-definition fade blending smoothly into sculpted facial hair with crisp razor definition.',
    image: '/images/portfolio/barbing/barbing-sharp-fade-beard-detail.jpg',
    tags: ['Precision Fade', 'Razor Finish', 'Beard Detail'],
  },
  {
    id: 'b-taper-fade',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Taper Fade',
    client: 'Client Profile',
    description: 'Front-profile perspective highlighting temple graduation, clean hairline, and defined facial symmetry.',
    image: '/images/portfolio/barbing/barbing-taper-fade-front-profile.jpg',
    tags: ['Taper Fade', 'Front Profile', 'Hairline'],
  },
  {
    id: 'b-low-fade',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Low Fade Profile',
    client: 'Client Profile',
    description: 'Subtle low drop fade keeping density at the crown while delivering an ultra-clean ear arch and nape line.',
    image: '/images/portfolio/barbing/barbing-low-fade-profile.jpg',
    tags: ['Low Fade', 'Side Profile', 'Precision'],
  },
  {
    id: 'b-textured-top',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Textured Top Finish',
    client: 'Executive Client',
    description: 'Close portrait of a textured crop with balanced volume on top and gradual skin transition on sides.',
    image: '/images/portfolio/barbing/barbing-textured-top-fade-portrait.png',
    tags: ['Textured Top', 'Crop', 'Skin Fade'],
  },
  {
    id: 'b-cross-design',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Custom Hair Design',
    client: 'Artistic Cut Showcase',
    description: 'Freehand razor-etched cross design etched into a seamless fade, showcasing creative precision.',
    image: '/images/portfolio/barbing/barbing-cross-design-fade-detail.png',
    tags: ['Hair Design', 'Freestyling', 'Razor Art'],
  },
  {
    id: 'b-fade-back',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Fade & Neckline Detail',
    client: 'Craftsmanship Detail',
    description: 'Posterior view showcasing seamless gradient fade from occipital bone down to a spotless tapered neckline.',
    image: '/images/portfolio/barbing/barbing-fade-back-detail.jpg',
    tags: ['Neckline', 'Back Fade', 'Detail'],
  },
  {
    id: 'b-barber-finishing-beard',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Finishing Touches',
    client: 'Master Barber Session',
    description: 'Master barber applying precision detailing to client beard line in the executive salon chair.',
    image: '/images/portfolio/barbing/barbing-barber-finishing-beard.jpg',
    tags: ['Process', 'Beard Trim', 'Master Barber'],
  },
  {
    id: 'b-cut-in-progress',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Precision Cut in Progress',
    client: 'Live Studio Session',
    description: 'Live studio haircut demonstration emphasizing scissor-over-comb and sectioning technique.',
    image: '/images/portfolio/barbing/barbing-cut-in-progress.jpg',
    tags: ['In Progress', 'Scissor Work', 'Craftsmanship'],
  },
  {
    id: 'b-clipper-work',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Detailing the Hairline',
    client: 'Lineup Session',
    description: 'Close-up precision edge-up and hairline detailing using cordless zero-gap trimmers.',
    image: '/images/portfolio/barbing/barbing-clipper-work-in-progress.jpg',
    tags: ['Lineup', 'Clipper Detailing', 'Edge Up'],
  },
  {
    id: 's1',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Executive Low Skin Fade & Textured Crop',
    client: 'Private Executive Client',
    description: 'Zero-gap clipper precision with textured scissor top and razor-sharp perimeter line up.',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
    tags: ['Haircut', 'Skin Fade', 'Razor Finish'],
  },
  {
    id: 's2',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Luxury Beard Sculpting & Hot Towel Treatment',
    client: 'Grooming Member',
    description: 'Botanical oil beard hydration, symmetric jawline sculpting, and steam pore therapy.',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
    tags: ['Beard', 'Hot Towel', 'Luxury Treatment'],
  },
  {
    id: 's3',
    category: 'barbing',
    businessName: 'Best Salon',
    title: 'Mid-Taper Fade & Waves Definition',
    client: 'Client Showcase',
    description: 'Clean temple taper with natural wave pattern enhancement and nourishing balm.',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800',
    tags: ['Taper Fade', 'Waves', 'Styling'],
  },

  // --- Signs & Craft Works (4 New Supplied Works + 3 Original Signage Works) ---
  {
    id: 'sg-ondipa-monument',
    category: 'signage',
    businessName: 'Best Signs & Craft',
    title: 'ONDIPA Monument Signage',
    client: 'ONDIPA Agency (Featured Monument)',
    description: 'Freestanding multi-panel architectural monument sign engineered for roadside visibility and high impact.',
    image: '/images/portfolio/signage/signage-ondipa-monument-sign.jpg',
    tags: ['Featured', 'Monument Sign', 'Architectural', 'Signage'],
  },
  {
    id: 'sg-amity-house',
    category: 'signage',
    businessName: 'Best Signs & Craft',
    title: 'Amity House Exterior Signage',
    client: 'Amity House Facility',
    description: 'Dimensional exterior building branding fabricated for clean architectural contrast and outdoor longevity.',
    image: '/images/portfolio/signage/signage-amity-house-building-sign.jpg',
    tags: ['Building Sign', 'Exterior Branding', 'Commercial'],
  },
  {
    id: 'sg-vikky-mart',
    category: 'signage',
    businessName: 'Best Signs & Craft',
    title: 'Vikky Mart 3D Lettering',
    client: 'Vikky Mart Superstore',
    description: 'Dimensional storefront lettering fabricated with precision-cut acrylic and bold vibrant yellow faces.',
    image: '/images/portfolio/signage/signage-vikky-mart-3d-lettering.jpg',
    tags: ['3D Lettering', 'Storefront', 'Retail Branding'],
  },
  {
    id: 'sg-money-wealth-pylon',
    category: 'signage',
    businessName: 'Best Signs & Craft',
    title: 'Money Wealth Pylon Sign',
    client: 'Money Wealth Plaza',
    description: 'Dual-sided roadside pylon monolith sign with structured steel frame and high-durability finish.',
    image: '/images/portfolio/signage/signage-money-wealth-pylon.jpg',
    tags: ['Pylon Monolith', 'Roadside Sign', 'Steel Fabrication'],
  },
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

  // --- Art Studio Works ---
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
  const [selectedItem, setSelectedItem] = useState<(typeof portfolioItems)[0] | null>(null);
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
                  src="/images/portfolio-hero.jpg"
                  alt="Best Creative Hub Multi-Disciplinary Design and Craft Portfolio"
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
            { id: 'barbing', label: 'Barbing', icon: Scissors },
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
              <div
                className="aspect-[4/3] overflow-hidden relative cursor-pointer group"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0A192F]/80 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-amber-400">
                  {item.businessName}
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-[#0A192F]/80 backdrop-blur-md border border-white/10 text-[10px] text-white/80 font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>View Full Photo</span>
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

        {/* 4. LIGHTBOX / FULL-IMAGE DETAIL MODAL */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#1F2937] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block mb-1">
                    {selectedItem.businessName} &bull; {selectedItem.client}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
                    {selectedItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#0A192F]/80">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-xl"
                />
              </div>

              <div className="p-4 sm:p-6 border-t border-white/10 bg-[#1F2937]">
                <p className="text-xs sm:text-sm text-[#F8F9FA]/80 leading-relaxed mb-4">
                  {selectedItem.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-[#0A192F] text-[10px] uppercase tracking-wider text-amber-300 font-semibold border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
