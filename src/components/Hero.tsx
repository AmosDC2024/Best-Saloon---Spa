import React from 'react';
import { motion } from 'motion/react';
import { Scissors, Calendar, ChevronRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenContact: () => void;
}

export default function Hero({ onOpenBooking, onOpenContact }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 md:pt-40">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-20">
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-[10%] w-16 h-16 text-amber-500"
        >
          <Scissors className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 40, 0],
            rotate: [0, -20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-[10%] w-24 h-24 text-amber-500"
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/3 right-1/4 w-12 h-12 text-amber-500/30"
        >
          <Scissors className="w-full h-full" />
        </motion.div>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2000"
          alt="Barber cutting hair"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-max section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-8">
            <Scissors className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.3em]">
              Premium Grooming Experience
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 text-balance">
            Sharp Cuts.<br />
            <span className="text-amber-500">Clean Confidence.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-xl text-white/60 mb-12 leading-relaxed text-balance">
            Experience the art of grooming and relaxation at Best Salon & SPA. We combine traditional techniques with modern styles to give you the perfect look and feel.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-all hover:scale-105 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              Book Me
            </button>
            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-white/10 cursor-pointer"
            >
              Contact Us
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-amber-500 to-transparent"></div>
      </motion.div>
    </section>
  );
}
