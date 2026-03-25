import React from 'react';
import { Scissors, Instagram, Twitter, Facebook, ArrowUp, Sparkles } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://ais-pre-htn43e6zff3d6tqo54gu7b-182291592896.europe-west2.run.app/api/attachments/67e26880-9941-4712-98e3-086574f884a4" 
                    alt="Logo" 
                    className="w-full h-full object-cover mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-1 leading-none">
                <span className="font-arcade text-[22px] text-amber-500 leading-none">BEST</span> Salon & SPA
              </span>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed mb-8">
              The ultimate grooming destination for the modern man. We believe in quality, precision, and the power of a great haircut.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="text-white/30 hover:text-amber-500 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-white/40 hover:text-amber-500 transition-colors text-sm uppercase tracking-widest">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Newsletter</h4>
            <p className="text-white/40 text-sm mb-4">Get style tips and exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="bg-zinc-900 border border-white/5 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 w-full"
              />
              <button className="p-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors">
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            © 2026 <span className="font-arcade text-[10px] text-amber-500/50">BEST</span> Salon & SPA. All Rights Reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/20 hover:text-amber-500 transition-colors text-[10px] uppercase tracking-widest font-bold"
          >
            Back to Top <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
