'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scissors,
  Layers,
  Palette,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050D1A] text-white border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg">
                B
              </div>
              <div>
                <span className="font-arcade text-lg tracking-wider text-amber-500 uppercase leading-none block">
                  BEST CREATIVE HUB
                </span>
                <span className="text-[10px] tracking-widest uppercase text-white/50 font-bold">
                  Akure &bull; Salon &bull; Signage &bull; Art
                </span>
              </div>
            </Link>

            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">
              Akure&apos;s premier multi-disciplinary creative ecosystem uniting luxury grooming & spa
              wellness, architectural 3D signage & craft fabrication, and bespoke fine art commissions.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20make%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
              <span className="text-xs text-white/40 font-mono">+234 806 805 9823</span>
            </div>
          </div>

          {/* Col 1: Our Businesses */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Our Businesses
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/salon"
                  className="group flex items-center gap-2 text-white/60 hover:text-amber-400 text-xs uppercase tracking-wider transition-colors"
                >
                  <Scissors className="w-3.5 h-3.5 text-amber-500" />
                  <span>Best Salon</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/signage"
                  className="group flex items-center gap-2 text-white/60 hover:text-amber-400 text-xs uppercase tracking-wider transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Best Signs & Craft</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/art"
                  className="group flex items-center gap-2 text-white/60 hover:text-amber-400 text-xs uppercase tracking-wider transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Best Art</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Hub Navigation */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5">
              Hub Exploration
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'About Hub', href: '/about' },
                { name: 'Portfolio & Works', href: '/portfolio' },
                { name: 'Training Academy', href: '/training' },
                { name: 'Contact & Location', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-amber-400 text-xs uppercase tracking-wider transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Visit & Hours */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5">
              Visit The Hub
            </h4>
            <div className="space-y-3 text-xs text-white/60">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Block 1, Plot 7, Ogundola layout, Akure, Ondo State</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+234 806 805 9823</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>osiamijnr@gmail.com</span>
              </p>
              <div className="pt-2 border-t border-white/5">
                <p className="text-[11px] text-white/40">
                  <strong className="text-white/70">Mon – Sat:</strong> 8:00 AM – 8:00 PM
                  <br />
                  <strong className="text-white/70">Sun:</strong> 12:00 PM – 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold text-center sm:text-left">
            &copy; 2026{' '}
            <span className="font-arcade text-amber-500 uppercase">Best Creative Hub</span>. All
            Rights Reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/40 hover:text-amber-500 transition-colors text-xs uppercase tracking-widest font-bold cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
