'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Camera, ExternalLink } from 'lucide-react';

const styles = [
  {
    id: 'b-curly-top-fade',
    title: 'Textured Top & Clean Fade',
    category: 'Featured Haircut',
    image: '/images/portfolio/barbing/barbing-curly-top-fade.jpg'
  },
  {
    id: 'b-classic-fade-beard',
    title: 'Classic Fade & Beard',
    category: 'Beards & Fades',
    image: '/images/portfolio/barbing/barbing-classic-fade-beard-portrait.jpg'
  },
  {
    id: 'b-sharp-fade-beard',
    title: 'Precision Fade & Beard Detail',
    category: 'Precision Detailing',
    image: '/images/portfolio/barbing/barbing-sharp-fade-beard-detail.jpg'
  },
  {
    id: 'b-taper-fade',
    title: 'Taper Fade Profile',
    category: 'Taper Fade',
    image: '/images/portfolio/barbing/barbing-taper-fade-front-profile.jpg'
  },
  {
    id: 'b-low-fade',
    title: 'Low Fade Profile',
    category: 'Low Fade',
    image: '/images/portfolio/barbing/barbing-low-fade-profile.jpg'
  },
  {
    id: 'b-textured-top',
    title: 'Textured Top Finish',
    category: 'Textured Crop',
    image: '/images/portfolio/barbing/barbing-textured-top-fade-portrait.png'
  },
  {
    id: 'b-cross-design',
    title: 'Custom Hair Design',
    category: 'Creative Design',
    image: '/images/portfolio/barbing/barbing-cross-design-fade-detail.png'
  },
  {
    id: 'b-fade-back',
    title: 'Fade & Neckline Detail',
    category: 'Fade Detail',
    image: '/images/portfolio/barbing/barbing-fade-back-detail.jpg'
  },
  {
    id: 'b-barber-finishing-beard',
    title: 'Finishing Touches',
    category: 'Process Detailing',
    image: '/images/portfolio/barbing/barbing-barber-finishing-beard.jpg'
  },
  {
    id: 'b-cut-in-progress',
    title: 'Precision Cut in Progress',
    category: 'Scissor Work',
    image: '/images/portfolio/barbing/barbing-cut-in-progress.jpg'
  },
  {
    id: 'b-clipper-work',
    title: 'Detailing the Hairline',
    category: 'Hairline & Edges',
    image: '/images/portfolio/barbing/barbing-clipper-work-in-progress.jpg'
  },
  {
    id: 1,
    title: 'Textured Crop',
    category: 'Fades',
    image: 'https://images.unsplash.com/photo-1599351431247-f5094021186d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Sharp Lineup',
    category: 'Beards',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    title: 'Waves & Taper',
    category: 'Waves',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 6,
    title: 'Buzz Cut',
    category: 'Minimal',
    image: 'https://images.unsplash.com/photo-1512690196252-751d1df86240?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Gallery() {
  return (
    <section id="gallery" className="section-padding bg-[#0A192F]">
      <div className="container-max">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4"
            >
              The <span className="text-amber-500">Lookbook</span>
            </motion.h2>
            <p className="text-[#F8F9FA]/60 uppercase tracking-wider text-xs font-bold">
              Showcasing our finest transformations
            </p>
          </div>
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#1F2937] border border-white/15 rounded-xl text-amber-400 font-bold uppercase tracking-wider text-xs hover:bg-amber-500 hover:text-black transition-all group"
          >
            <span>Follow on Instagram</span>
            <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {styles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#1F2937] border border-white/10 shadow-xl"
            >
              <img
                src={style.image}
                alt={style.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2 block">
                  {style.category}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-snug mb-3">
                  {style.title}
                </h3>
                <div className="w-10 h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </div>

              <div className="absolute top-6 right-6 p-2.5 bg-[#0A192F]/80 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-500 hover:text-black text-white">
                <Camera className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
