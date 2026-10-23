'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Sparkles,
  Scissors,
  Layers,
  Palette,
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useHub } from '../../context/HubContext';

export default function AboutPage() {
  const { openBooking } = useHub();

  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden pt-20">
      {/* 1. HERO */}
      <section className="relative min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Story & CTAs */}
            <div className="lg:col-span-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F2937] border border-amber-500/30 mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                  The Best Creative Hub Story
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-white mb-5"
              >
                Rooted in Akure.{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Built on Mastery.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg text-[#F8F9FA]/75 max-w-xl leading-relaxed mb-8"
              >
                From executive grooming at Best Salon to architectural 3D signage engineering at Best Signs
                &amp; Craft, and fine-art canvases at Best Art, we unite premier creative trades in Ondo
                State under one prestigious roof.
              </motion.p>

              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  href="/portfolio"
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2"
                >
                  <span>Explore Our Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-[#1F2937] hover:bg-[#283548] border border-white/15 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all"
                >
                  Visit The Hub
                </Link>
              </div>
            </div>

            {/* Right Column: High Quality Creative Studio Atmosphere */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="lg:col-span-5 w-full"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#1F2937] shadow-2xl group aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200"
                  alt="Best Creative Hub Physical Studio Architecture in Akure"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent" />

                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#0A192F]/85 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Akure Headquarters</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0A192F]/90 backdrop-blur-md border border-white/15">
                  <p className="font-arcade text-amber-400 text-xs uppercase tracking-wide">
                    BEST CREATIVE HUB
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mt-0.5">
                    Block 1, Plot 7, Ogundola layout &bull; Akure, Nigeria
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. OUR NARRATIVE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-3">
              Our Genesis
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-6">
              More Than A Business &mdash; A Standard of Creative Living
            </h2>
            <div className="space-y-4 text-[#F8F9FA]/75 text-sm sm:text-base leading-relaxed">
              <p>
                Best Creative Hub began with a passionate commitment to revolutionize grooming in
                Akure through <strong className="text-white">Best Salon</strong> &mdash; introducing
                strict clinical hygiene, master barbering precision, and executive hospitality to
                discerning clients.
              </p>
              <p>
                As our reputation for obsessive detail grew, we expanded our creative workshop to
                fulfill our clients&apos; commercial and architectural needs. This led to the birth
                of <strong className="text-white">Best Signs &amp; Craft</strong>, engineered to
                produce high-impact illuminated 3D letters, weather-sealed lightboxes, and vehicle fleet
                branding.
              </p>
              <p>
                To complete the creative triangle, our resident artists established{' '}
                <strong className="text-white">Best Art Studio</strong>, producing museum-grade oil
                and acrylic portraits, bespoke modern abstract canvases, and transformative wall
                murals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 bg-[#1F2937]">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600"
                alt="Master Barber Grooming at Best Salon"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 bg-[#1F2937] mt-8">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600"
                alt="Fine Art Canvas Creation at Best Art Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="py-20 bg-[#050D1A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
              Our Foundation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              The Principles That Guide Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: 'Excellence in Execution',
                desc: 'Every fade, laser cut, and brushstroke is executed with obsessive precision and zero shortcuts.',
              },
              {
                icon: ShieldCheck,
                title: 'Integrity & Hygiene',
                desc: 'Medical-grade sterilization for salon tools, honest bill-of-quantities for signage, and archival supplies for art.',
              },
              {
                icon: Users,
                title: 'Community Empowerment',
                desc: 'Through our Training Academy, we equip young men and women in Ondo State with high-income creative skills.',
              },
              {
                icon: Sparkles,
                title: 'Enduring Aesthetics',
                desc: 'We design looks, signs, and paintings built to command admiration today, tomorrow, and years from now.',
              },
            ].map((val, i) => {
              const Icon = val.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 hover:border-amber-500/40 transition-all shadow-xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold uppercase text-white mb-2">{val.title}</h4>
                  <p className="text-xs text-[#F8F9FA]/70 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HUB CAMPUS & INVITATION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#1F2937] border border-white/15 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl">
          <MapPin className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h3 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight mb-4">
            Experience Best Creative Hub in Person
          </h3>
          <p className="text-[#F8F9FA]/75 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Located at Block 1, Plot 7, Ogundola layout, Akure. We invite you to visit our luxury
            salon lounge, tour our signage fabrication workshop, or view original art in our studio.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openBooking}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Book Salon Session
            </button>
            <Link
              href="/portfolio"
              className="px-6 py-3.5 bg-[#0A192F] hover:bg-[#1F2937] text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/10 transition-all"
            >
              Explore Our Portfolio
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-[#0A192F] hover:bg-[#1F2937] text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/10 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
