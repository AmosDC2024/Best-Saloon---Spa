import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Chidi Okafor",
    role: "Regular Client",
    content: "Omo, this is the best fade I've ever had in Akure. The attention to detail is just different. The vibe is premium and the barbers really know their stuff. I don't go anywhere else now.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "Amina Yusuf",
    role: "Spa Enthusiast",
    content: "The massage was exactly what I needed after a long week. The environment is so peaceful and the staff are very professional. My skin is literally glowing after the facial!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    name: "Tunde Balogun",
    role: "Business Owner",
    content: "Clean, sharp, and consistent every single time. They handle my hair texture perfectly. The booking system is also very smooth, no long wait times. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=200"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-zinc-950 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4"
          >
            Client <span className="text-amber-500">Stories</span>
          </motion.h2>
          <p className="text-white/60 uppercase tracking-widest text-xs">
            What the gentlemen are saying
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-900 p-8 md:p-12 rounded-3xl border border-white/5 relative"
            >
              <Quote className="absolute top-6 left-6 w-12 h-12 text-amber-500/10" />
              
              <div className="flex flex-col items-center text-center">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-white/80 italic leading-relaxed mb-8">
                  "{testimonials[currentIndex].content}"
                </p>
                
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full border-2 border-amber-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <h4 className="text-white font-bold uppercase tracking-tight">{testimonials[currentIndex].name}</h4>
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 bg-zinc-900 border border-white/5 rounded-full text-white hover:text-amber-500 hover:border-amber-500/30 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="p-3 bg-zinc-900 border border-white/5 rounded-full text-white hover:text-amber-500 hover:border-amber-500/30 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
