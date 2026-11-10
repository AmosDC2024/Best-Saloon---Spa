'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Heart,
  Layers,
  MapPin,
  MessageCircle,
  Palette,
  Quote,
  Scissors,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Compass,
} from 'lucide-react';

const stats = [
  {
    value: '25+',
    label: 'Years of Mastery',
    detail: 'Professional barbering, creative styling & business leadership',
  },
  {
    value: '~20',
    label: 'Core Workforce',
    detail: 'Full-time professionals employed across our creative divisions',
  },
  {
    value: '100+',
    label: 'Apprentices Trained',
    detail: 'Graduates successfully mentored into viable careers and businesses',
  },
  {
    value: '3',
    label: 'Unified Studios',
    detail: 'Best Salon, Best Signs & Craft, and Best Art under one umbrella',
  },
];

const expertiseAreas = [
  {
    title: 'Professional Barbering',
    desc: 'Precision fading, razor sculpting, and contemporary grooming mastery honed over two decades.',
    icon: Scissors,
    accent: 'border-amber-500/30 text-amber-400',
  },
  {
    title: 'Hairdressing & Styling',
    desc: 'Advanced hair care, treatments, executive styling, and technical hair architecture.',
    icon: Sparkles,
    accent: 'border-amber-500/30 text-amber-400',
  },
  {
    title: 'Salon Management',
    desc: 'End-to-end studio operations, clinical hygiene systems, customer hospitality, and staff leadership.',
    icon: Briefcase,
    accent: 'border-amber-500/30 text-amber-400',
  },
  {
    title: 'Business Consulting',
    desc: 'Advising salon founders and creative entrepreneurs on sustainability, pricing, and scaling.',
    icon: TrendingUp,
    accent: 'border-sky-500/30 text-sky-400',
  },
  {
    title: 'Professional Training',
    desc: 'Curriculum-led vocational education, practical workshops, and masterclass apprentice development.',
    icon: GraduationCap,
    accent: 'border-sky-500/30 text-sky-400',
  },
  {
    title: 'Creative Design',
    desc: 'Conceptual brand development, visual aesthetics, spatial styling, and creative direction.',
    icon: Compass,
    accent: 'border-sky-500/30 text-sky-400',
  },
  {
    title: 'Signage Production',
    desc: 'Fabrication of illuminated 3D channel letters, monument signs, and architectural displays.',
    icon: Layers,
    accent: 'border-emerald-500/30 text-emerald-400',
  },
  {
    title: 'Interior Decoration',
    desc: 'Bespoke aesthetic transformations, ambient lighting concepts, and corporate interior design.',
    icon: Award,
    accent: 'border-emerald-500/30 text-emerald-400',
  },
  {
    title: 'Resin Art',
    desc: 'Custom resin artistry, high-gloss finishes, abstract textures, and luxury bespoke surfaces.',
    icon: Palette,
    accent: 'border-emerald-500/30 text-emerald-400',
  },
];

const qualifications = [
  {
    type: 'Academic Degree',
    title: 'Bachelor of Science (B.Sc.) in Psychology',
    institution: 'Nasarawa State University, Keffi',
    description:
      'Providing deep insight into human behaviour, client relationships, effective mentorship, and strategic organizational management.',
    icon: GraduationCap,
    tag: 'Academic Qualification',
    accent: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  },
  {
    type: 'Vocational Certification',
    title: 'Higher Diploma in Barbering and Hairdressing',
    institution: 'Excellent Best Limited',
    description:
      'Rigorous mastery of executive grooming standards, advanced styling techniques, and technical salon management.',
    icon: Award,
    tag: 'Professional Diploma',
    accent: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
  },
  {
    type: 'Trade Certification',
    title: 'Certificate III in Hairdressing',
    institution: 'Accredited Professional Certification',
    description:
      'Comprehensive benchmark in trichology, hygiene protocols, precision cutting, and commercial client care.',
    icon: BookOpen,
    tag: 'Trade Benchmark',
    accent: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  },
];

export default function FounderPage() {
  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden pt-20">
      {/* ── BREADCRUMB ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <Link href="/about" className="hover:text-amber-400 transition-colors">
            About Us
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <span className="text-amber-400 font-bold">Founder Profile</span>
        </nav>
      </div>

      {/* ── SECTION A: HERO / FOUNDER INTRODUCTION ─────────────────── */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Narrative Introduction */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F2937] border border-amber-500/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                Founder &amp; Chief Executive Officer
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                Williams <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Olorunfemi Bola
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base uppercase tracking-widest text-amber-400 font-bold">
                Founder &amp; CEO &bull; Best Creative Hub
              </p>
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border-l-2 border-amber-500 pl-4 py-1 text-base sm:text-lg text-white/90 font-medium italic leading-relaxed"
            >
              &ldquo;A Journey of Vision, Resilience, Excellence and Entrepreneurship.&rdquo;
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4 text-sm sm:text-base text-[#F8F9FA]/80 leading-relaxed"
            >
              <p>
                With more than <strong>25 years of hands-on experience</strong> spanning professional
                barbering, advanced hairstyling, salon management, and creative business consulting,
                Williams Olorunfemi Bola stands as a pioneer in Nigeria&apos;s personal care and creative
                industries.
              </p>
              <p>
                As the visionary founder behind <strong>Best Creative Hub</strong>, he transformed a
                singular craft into a multi-disciplinary ecosystem that unites luxury grooming (Best
                Salon), architectural engineering (Best Signs &amp; Craft), and fine art (Best Art Studio)
                in Akure, Ondo State.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-2 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#story"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Read His Story
              </a>
              <a
                href="#expertise"
                className="px-6 py-3.5 bg-[#1F2937] hover:bg-[#283548] border border-white/15 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all"
              >
                Areas of Expertise
              </a>
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 text-white/80 hover:text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all"
              >
                Connect With The Hub
              </Link>
            </motion.div>
          </div>

          {/* Right Column: High Quality Founder Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-[#1F2937] shadow-2xl group">
              <div className="relative aspect-[9/16] sm:aspect-[9/15] w-full overflow-hidden bg-[#0A192F]">
                <Image
                  src="/images/founder.jpg"
                  alt="Williams Olorunfemi Bola — Founder & CEO of Best Creative Hub"
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/10 to-transparent pointer-events-none" />
              </div>

              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#0A192F]/90 backdrop-blur-md border border-white/15">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shrink-0 shadow-sm flex items-center justify-center p-0.5">
                      <Image
                        src="/images/logo.jpg"
                        alt="Best Creative Hub Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm uppercase tracking-tight">
                        Williams O. Bola
                      </p>
                      <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                        Founder &amp; CEO
                      </p>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                    25+ Yrs
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION B: THE BEGINNING — FROM A BORROWED STOOL ────────── */}
      <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#050D1A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
              Humble Beginnings &amp; Tenacity
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Every Great Journey Begins Somewhere
            </h2>
          </div>

          {/* Emotional Centerpiece Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#1F2937] via-[#112240] to-[#0A192F] border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 rounded-2xl bg-[#0A192F]/80 border border-white/10 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="font-bold uppercase tracking-wider text-white text-sm">A Single Clipper</h3>
                <p className="text-xs text-white/60 mt-1">His foundational instrument of precision</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0A192F]/80 border border-white/10 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold uppercase tracking-wider text-white text-sm">A Barber Apron</h3>
                <p className="text-xs text-white/60 mt-1">A badge of work ethic, dignity, and commitment</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0A192F]/80 border border-white/10 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold uppercase tracking-wider text-white text-sm">A Borrowed Stool</h3>
                <p className="text-xs text-white/60 mt-1">The humble seat where a lasting vision took root</p>
              </div>
            </div>

            <div className="space-y-5 text-sm sm:text-base text-[#F8F9FA]/80 leading-relaxed">
              <p>
                The story of Best Creative Hub is not one of inherited privilege or immediate overnight
                capital. It began in the most modest of circumstances &mdash; when Williams Olorunfemi
                Bola stepped out with nothing more than <strong>a clipper, an apron, and a borrowed stool</strong>.
              </p>
              <p>
                Without a grand shopfront or commercial backing, his only currencies were unwavering
                determination, technical excellence, deep personal integrity, and an obsessive focus on
                customer satisfaction. Every client who sat on that borrowed stool received the same
                meticulous care, executive precision, and warmth that today defines Best Salon.
              </p>
              <p>
                Through consistency, long hours, and disciplined reinvestment, word of mouth quickly
                spread. The stool became a salon chair; the single chair grew into a full studio; and
                that humble salon grew into the multi-disciplinary creative landmark known today as Best
                Creative Hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION C: BUILDING A BRAND & DEVELOPING PEOPLE ───────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
            Impact &amp; Growth
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Building a Brand and Developing People
          </h2>
          <p className="mt-3 text-sm text-[#F8F9FA]/70">
            For Williams, true success is never measured solely in enterprise revenue, but in the
            number of lives uplifted and careers created.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 hover:border-amber-500/40 transition-all shadow-xl text-center"
            >
              <div className="text-4xl sm:text-5xl font-black text-amber-400 mb-2 font-mono">
                {s.value}
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">{s.label}</h3>
              <p className="text-xs text-white/60 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Narrative Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-[#1F2937]/80 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-white">
              Over 100 Apprentices Mentored &amp; Launched
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Through structured, patient hands-on instruction, Williams has trained more than 100
              young men and women in technical barbering, styling, and salon enterprise management &mdash;
              helping many launch their own self-sustaining businesses across Nigeria.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#1F2937]/80 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-white">
              Scholarships for Financially Disadvantaged Youths
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Remembering his own modest beginnings, he consistently sponsors tuition-free vocational
              training opportunities, toolkits, and apprenticeships for young people from disadvantaged
              backgrounds to break cycles of poverty.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION D: PROFESSIONAL EXPERTISE ──────────────────────── */}
      <section id="expertise" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#050D1A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
              Cross-Disciplinary Mastery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Areas of Professional Expertise
            </h2>
            <p className="mt-3 text-sm text-[#F8F9FA]/70">
              A rare combination of artisan craftsmanship, strategic business consultation, and architectural design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertiseAreas.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-[#1F2937] border border-white/10 hover:border-amber-500/40 transition-all group shadow-xl"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-white/5 border ${item.accent} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F8F9FA]/70 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION E: EDUCATION & QUALIFICATIONS ─────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
            Academic &amp; Professional Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Education and Professional Qualifications
          </h2>
          <p className="mt-3 text-sm text-[#F8F9FA]/70">
            Blending formal academic training with accredited vocational mastery to lead with both
            psychological acumen and technical authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qualifications.map((q, i) => {
            const Icon = q.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${q.accent}`}>
                      {q.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-1">
                    {q.title}
                  </h3>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-4">
                    {q.institution}
                  </p>
                  <p className="text-xs sm:text-sm text-[#F8F9FA]/70 leading-relaxed">
                    {q.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION F: LEADERSHIP, MENTORSHIP & IMPACT ─────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#050D1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                Empowerment &amp; Standards
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Leadership, Mentorship and Community Impact
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#F8F9FA]/75 leading-relaxed">
                <p>
                  Williams believes that technical craftsmanship carries a moral responsibility to
                  its surrounding community. Through the <strong>Best Creative Hub Training Academy</strong>,
                  he champions rigorous vocational education designed to elevate trade work from a casual
                  hustle to a respected, high-income profession.
                </p>
                <p>
                  His mentorship extends far beyond styling techniques &mdash; covering clinical tool
                  sterilization, financial literacy, customer diplomacy, and executive ethics. By
                  raising professional standards across Ondo State and mentoring aspiring shop owners,
                  he continues to drive grassroots economic empowerment.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/training"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
                >
                  <span>Explore Training Academy</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Vocational Education',
                  desc: 'Transforming trades into structured careers with recognised certifications and standards.',
                },
                {
                  title: 'Entrepreneurship',
                  desc: 'Equipping apprentices with business acumen to launch and sustain their own studios.',
                },
                {
                  title: 'Professional Hygiene',
                  desc: 'Enforcing clinical-grade hospital protocols and client safety as non-negotiables.',
                },
                {
                  title: 'Economic Empowerment',
                  desc: 'Creating sustainable livelihood pathways for young men and women in the community.',
                },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#1F2937] border border-white/10 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mb-3" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION G: FAITH, FAMILY AND PERSONAL VALUES ──────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-[#1F2937] border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <Heart className="w-6 h-6" />
            </div>

            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
              Core Convictions
            </span>

            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Faith, Family and Grounded Values
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#F8F9FA]/80 leading-relaxed text-left sm:text-center">
              <p>
                Behind Williams Olorunfemi Bola&apos;s relentless drive is a devout Christian faith
                that anchors his ethical standards, humility, and compassion for every person who enters
                his doors.
              </p>
              <p>
                A devoted family man, Williams credits much of his endurance, clarity, and success to
                the steadfast love and partnership of his beloved wife, <strong>Helen</strong>. Together,
                they share a commitment to living by example, raising their household with integrity,
                and treating their staff and apprentices as extended members of a supportive family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION H: VISION FOR THE FUTURE ──────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#050D1A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-2">
              The Next Horizon
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Vision for the Future
            </h2>
            <p className="mt-3 text-sm text-[#F8F9FA]/70">
              Expanding beyond borders to position Nigerian creative trades on the global stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 hover:border-amber-500/40 transition-all shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold uppercase tracking-tight text-white mb-2">
                International Expansion
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Establishing the Best Creative Hub brand and service model across regional and
                international markets, exporting Nigerian creative ingenuity and luxury standards.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 hover:border-amber-500/40 transition-all shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold uppercase tracking-tight text-white mb-2">
                Structured Vocational Academies
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Developing state-of-the-art training campuses with standardised curricula, equipping
                thousands of young Africans with globally competitive, certified creative trades.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 hover:border-amber-500/40 transition-all shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold uppercase tracking-tight text-white mb-2">
                Creative Industry Innovation
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Pioneering advanced architectural signage engineering, smart digital lightboxes, and
                bespoke contemporary resin art installations for high-profile landmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION I: PERSONAL PHILOSOPHY ────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#112240] via-[#1F2937] to-[#0A192F] border-2 border-amber-500/40 p-8 sm:p-14 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-6">
            <Quote className="w-7 h-7" />
          </div>

          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-4">
            Personal Philosophy &bull; Williams Olorunfemi Bola
          </span>

          <blockquote className="text-lg sm:text-2xl md:text-3xl font-serif italic text-white/95 max-w-3xl mx-auto leading-relaxed mb-8">
            &ldquo;Excellence is not an accident; it is the deliberate reward of discipline, resilience,
            and an unwavering commitment to mastering one&apos;s craft. When you build people with genuine
            dedication, the brand naturally rises to endure.&rdquo;
          </blockquote>

          <div className="inline-flex flex-col items-center border-t border-amber-500/40 pt-5">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md mb-3 flex items-center justify-center p-0.5">
              <Image
                src="/images/logo.jpg"
                alt="Best Creative Hub Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-arcade text-amber-400 text-sm tracking-widest uppercase">
              WILLIAMS OLORUNFEMI BOLA
            </p>
            <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mt-0.5">
              Founder &amp; Chief Executive Officer, Best Creative Hub
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="px-6 py-3 bg-[#0A192F] hover:bg-white/10 border border-white/15 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all"
            >
              Back to About Us
            </Link>
            <Link
              href="/portfolio"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              Explore Hub Portfolio
            </Link>
            <a
              href="https://api.whatsapp.com/send?phone=2348068059823&text=Hello%20Williams%20Bola%20and%20Best%20Creative%20Hub!%20I'd%20like%20to%20connect."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-xs rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

