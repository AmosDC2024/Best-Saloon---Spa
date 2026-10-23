'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Scissors,
  Layers,
  Palette,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Users,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

const courses = [
  {
    icon: Scissors,
    title: 'Professional Barbering & Executive Grooming Masterclass',
    duration: '8 Weeks (Intensive Studio Practicum)',
    level: 'Beginner to Advanced',
    badge: 'High Employment Rate',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
    desc: 'Master scissor ergonomics, low and skin fades, tapers, razor line-ups, hot towel shaving, facial massage, and executive salon client relationship management.',
    curriculum: [
      'Clipper mechanics & guard techniques',
      'Zero skin fades, taper fades & textured crops',
      'Beard sculpting, fading & razor line-up',
      'Facial massage, steam extraction & scalp hygiene',
      'Client consultation & shop management basics',
    ],
    buttonColor: 'bg-amber-500 hover:bg-amber-400 text-black',
  },
  {
    icon: Layers,
    title: '3D Signage Design & Fabrication Apprenticeship',
    duration: '12 Weeks (Hands-on Workshop)',
    level: 'Comprehensive Technical Training',
    badge: 'Commercial Craft',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    desc: 'Learn laser-cut acrylic letter assembly, LED wiring and power supply load calculation, lightbox aluminum framing, vinyl plotter cutting, and secure site mounting.',
    curriculum: [
      'CorelDraw / CAD vector prep for laser cutting',
      'Acrylic heating, edge bending & solvent bonding',
      'IP67 LED module spacing & power supply wiring',
      'Lightbox aluminum profiles & tension fabric',
      'On-site scaffolding, drilling & electrical installation',
    ],
    buttonColor: 'bg-amber-500 hover:bg-amber-400 text-black',
  },
  {
    icon: Palette,
    title: 'Fine Art, Portraiture & Mural Atelier Program',
    duration: '10 Weeks (Studio Mentorship)',
    level: 'Creative Skill Development',
    badge: 'Studio Atelier',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    desc: 'Develop deep understanding of anatomical proportions, oil and acrylic color mixing, tonal values, textural abstract layering with gold leaf, and large-scale mural execution.',
    curriculum: [
      'Facial anatomy, proportions & tonal mapping',
      'Heavy-body acrylic blending & oil curing',
      'Abstract texture modeling & 24K gold foil gilding',
      'Grid scaling & scaffolding for architectural murals',
      'Artwork pricing, conservation varnishing & framing',
    ],
    buttonColor: 'bg-amber-500 hover:bg-amber-400 text-black',
  },
];

export default function TrainingPage() {
  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden pt-20">
      {/* 1. HERO - TWO COLUMN DESKTOP */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-widest font-bold text-amber-400">
                  Best Creative Hub Academy &bull; Akure
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#F8F9FA] mb-6 leading-[1.1]">
                Master a Practical{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Creative Career
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
                Hands-on apprenticeships and professional masterclasses in barbering, 3D signage
                fabrication, and fine art painting guided by industry veterans in Akure.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20enroll%20in%20an%20Academy%20Masterclass."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enroll via WhatsApp</span>
                </a>

                <a
                  href="#courses"
                  className="px-8 py-4 bg-[#1F2937] hover:bg-[#1F2937]/80 text-[#F8F9FA] border border-white/10 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span>View Courses</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </a>
              </div>

              {/* Highlights Pill Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% Studio Practicum</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Max 6 per Cohort</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Certified Credential</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:col-span-5 relative w-full">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200"
                  alt="Best Creative Hub Training Academy Workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent pointer-events-none" />

                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#1F2937]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
                      Akure Studio Workshop
                    </p>
                    <p className="text-xs font-bold text-white">Live Industry Mentorship</p>
                  </div>
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE ACADEMY COURSES */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
            Curriculum &amp; Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#F8F9FA] tracking-tight">
            Specialized Vocational Programs
          </h2>
          <p className="text-white/60 text-sm mt-3">
            Choose your creative discipline and learn directly on real equipment and live projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => {
            const Icon = course.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-white/10 bg-[#1F2937] overflow-hidden flex flex-col justify-between shadow-2xl hover:border-amber-500/40 transition-all group"
              >
                <div>
                  {/* Course Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0A192F]">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-transparent to-transparent" />
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#1F2937]/90 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-amber-400">
                      {course.badge}
                    </span>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-white/60 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {course.duration}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-tight text-[#F8F9FA] mb-3">
                      {course.title}
                    </h3>

                    <p className="text-xs text-white/70 leading-relaxed mb-6">{course.desc}</p>

                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400/80 mb-2">
                        Core Syllabus Highlights:
                      </p>
                      {course.curriculum.map((item, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2 text-xs text-white/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0">
                  <a
                    href={`https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20enroll%20in%20the%20${encodeURIComponent(
                      course.title
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2 shadow-lg ${course.buttonColor}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enroll via WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WHY TRAIN WITH US */}
      <section className="py-20 bg-[#0A192F] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
              Academy Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#F8F9FA] tracking-tight">
              Why Learn at Best Creative Hub?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: '100% Practical Studio',
                desc: 'Train with actual live clients, professional clippers, CNC laser tables, and artist canvases.',
              },
              {
                icon: Award,
                title: 'Certificate of Mastery',
                desc: 'Earn a recognized credential from Best Creative Hub validating your hands-on competencies.',
              },
              {
                icon: Users,
                title: 'Direct Apprenticeship',
                desc: 'Shadow our senior barbers, master sign fabricators, and lead painters in real daily operations.',
              },
              {
                icon: Clock,
                title: 'Flexible Schedules',
                desc: 'Morning, evening, and weekend batches tailored to working professionals and students.',
              },
            ].map((adv, i) => {
              const Icon = adv.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#1F2937] border border-white/10 hover:border-amber-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold uppercase text-[#F8F9FA] mb-2">{adv.title}</h4>
                  <p className="text-xs text-white/60 leading-relaxed">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ADMISSIONS CONTACT */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-[#1F2937] border border-white/15 p-8 sm:p-12 rounded-3xl shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#F8F9FA] tracking-tight mb-4">
            Next Batch Starts Soon
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Class sizes are strictly limited to 6 students per session to ensure individualized
            mentorship. Speak with our admissions coordinator today.
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20information%20on%20upcoming%20academy%20start%20dates%20and%20tuition%20fees."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Inquire About Tuition &amp; Start Dates</span>
          </a>
        </div>
      </section>
    </div>
  );
}
