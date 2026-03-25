import React from 'react';
import { motion } from 'motion/react';
import { Camera, ExternalLink } from 'lucide-react';

const styles = [
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
    id: 3,
    title: 'Classic Pompadour',
    category: 'Classic',
    image: 'https://images.unsplash.com/photo-1621605815841-28d944683b83?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    title: 'Mid Skin Fade',
    category: 'Fades',
    image: 'https://images.unsplash.com/photo-1593702295094-ada74bc4a149?auto=format&fit=crop&q=80&w=800'
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
    <section id="gallery" className="section-padding bg-black">
      <div className="container-max">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6"
            >
              The <span className="text-amber-500">Lookbook</span>
            </motion.h2>
            <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">
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
            className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-white/5 rounded-full text-amber-500 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-amber-500 hover:text-black transition-all group"
          >
            Follow on Instagram <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {styles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl"
            >
              <img
                src={style.image}
                alt={style.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-3 block">
                  {style.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                  {style.title}
                </h3>
                <div className="w-12 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </div>

              <div className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-amber-500 hover:text-black">
                <Camera className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
