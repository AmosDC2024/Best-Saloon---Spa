'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Scissors,
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  MessageSquare,
  Clock,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useHub } from '../../context/HubContext';
import Services from '../../components/Services';
import Booking from '../../components/Booking';
import Gallery from '../../components/Gallery';
import Testimonials from '../../components/Testimonials';

export default function SalonPage() {
  const { openBooking, openAuth } = useHub();

  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden pt-20">
      {/* 1. SALON HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text & CTAs */}
            <div className="lg:col-span-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F2937] border border-amber-500/30 mb-6"
              >
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                  Best Salon &bull; Best Creative Hub
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight mb-5"
              >
                Precision Barbering &amp;{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Luxury Spa Wellness
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-[#F8F9FA]/75 max-w-xl leading-relaxed mb-8"
              >
                Akure’s ultimate grooming sanctuary in Ogundola layout. Experience tailored skin fades,
                sharp beard sculpting, rejuvenating steam facials, and full-body massage therapy in an
                executive lounge setting.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 mb-8"
              >
                <a
                  href="#booking"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Below</span>
                </a>

                <button
                  onClick={openBooking}
                  className="px-6 py-3.5 bg-[#1F2937] hover:bg-[#283548] border border-white/15 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer"
                >
                  Quick Modal Booking
                </button>

                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Salon!%20I'd%20like%20to%20book%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Salon</span>
                </a>
              </motion.div>
            </div>

            {/* Right Column: Approved Salon Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="lg:col-span-5 w-full"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#1F2937] shadow-2xl group aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5]">
                <img
                  src="/images/portfolio/barbing/barbing-curly-top-fade.jpg"
                  alt="Textured Top & Clean Fade Haircut at Best Salon"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent" />

                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#0A192F]/85 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Executive Grooming</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0A192F]/90 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-arcade text-amber-400 text-xs uppercase tracking-wide">
                        BEST SALON
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mt-0.5">
                        Haircut &bull; Beard &bull; Spa Therapies
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                      Open Daily
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SALON FEATURES */}
      <section className="py-16 bg-[#050D1A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Star, label: 'Master Barbers', desc: '10+ years precision cut experience' },
              { icon: ShieldCheck, label: 'Medical Hygiene', desc: 'Hospital-grade tool sterilization' },
              { icon: Users, label: 'Executive Lounge', desc: 'Complimentary drinks & luxury vibes' },
              { icon: Scissors, label: 'Trendsetting Styles', desc: 'Skin fades, tapers, beard sculpts' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-[#1F2937] border border-white/10 hover:border-amber-500/30 transition-all group">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    <Icon className="w-6 h-6 text-amber-500 group-hover:text-black" />
                  </div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                    {feature.label}
                  </h4>
                  <p className="text-[#F8F9FA]/60 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SERVICES LIST */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Services onOpenBooking={openBooking} />
      </section>

      {/* 4. EMBEDDED REAL BOOKING ENGINE */}
      <section id="booking" className="py-20 bg-[#050D1A] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
              Online Appointment System
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Reserve Your Salon &amp; Spa Session
            </h2>
            <p className="text-white/60 text-sm mt-2 max-w-xl mx-auto">
              Select your service, preferred date, and available time slot. Instant database
              reservation with email confirmation and admin notification.
            </p>
          </div>

          <div className="bg-[#0A192F] border border-white/15 rounded-3xl p-4 sm:p-8 shadow-2xl">
            <Booking onOpenAuth={(mode) => openAuth(mode, false)} />
          </div>
        </div>
      </section>

      {/* 5. GALLERY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
            Portfolio Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Our Grooming Craftsmanship
          </h2>
        </div>
        <Gallery />
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 bg-[#050D1A] border-t border-white/10">
        <Testimonials />
      </section>
    </div>
  );
}
