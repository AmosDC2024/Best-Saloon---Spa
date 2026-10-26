'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Scissors, UserCheck, Zap, Star, Clock, DollarSign, Sparkles, Flower2, Calendar } from 'lucide-react';

const services = [
  {
    id: 'haircut',
    name: 'Classic Haircut',
    description: 'Precision cut tailored to your style and face shape.',
    price: '5,000',
    duration: 45,
    icon: Scissors,
    image: '/images/portfolio/barbing/barbing-classic-fade-beard-portrait.jpg'
  },
  {
    id: 'skin-fade',
    name: 'Skin Fade',
    description: 'Seamless blend from skin to hair. Our specialty.',
    price: '7,000',
    duration: 60,
    icon: Zap,
    image: '/images/portfolio/barbing/barbing-curly-top-fade.jpg'
  },
  {
    id: 'massage',
    name: 'Full Body Massage',
    description: 'Relax and rejuvenate with our signature aromatherapy massage.',
    price: '15,000',
    duration: 60,
    icon: Sparkles,
    image: '/images/spa-massage.jpg'
  },
  {
    id: 'facial-spa',
    name: 'Luxury Glow Facial',
    description: 'Premium skin treatment for a radiant and healthy complexion.',
    price: '12,000',
    duration: 45,
    icon: Flower2,
    image: '/images/glow-facial.jpg'
  },
  {
    id: 'beard-trim',
    name: 'Beard Sculpting',
    description: 'Shape, trim, and line up for the perfect beard.',
    price: '3,500',
    duration: 30,
    icon: UserCheck,
    image: '/images/portfolio/barbing/barbing-sharp-fade-beard-detail.jpg'
  },
  {
    id: 'hot-shave',
    name: 'Luxury Hot Shave',
    description: 'Traditional straight razor shave with hot towels.',
    price: '6,000',
    duration: 45,
    icon: Star,
    image: '/images/portfolio/barbing/barbing-barber-finishing-beard.jpg'
  }
];

interface ServicesProps {
  onOpenBooking: () => void;
}

export default function Services({ onOpenBooking }: ServicesProps) {
  return (
    <section id="services" className="section-padding bg-[#0A192F]">
      <div className="container-max">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4"
          >
            Our <span className="text-amber-500">Services</span>
          </motion.h2>
          <p className="text-[#F8F9FA]/60 max-w-2xl mx-auto uppercase tracking-wider text-xs font-bold">
            Crafted experiences for the modern gentleman
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#1F2937] rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all flex flex-col shadow-xl"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                    <service.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    ₦{service.price}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
                  {service.name}
                </h3>
                <p className="text-[#F8F9FA]/60 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wider font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {service.duration} MIN
                  </div>
                  <button 
                    onClick={onOpenBooking}
                    className="text-amber-400 text-xs font-bold uppercase tracking-wider hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Now</span>
                    <Scissors className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-block p-8 sm:p-10 bg-[#1F2937] rounded-3xl border border-white/10 shadow-2xl">
            <p className="text-[#F8F9FA]/70 mb-6 uppercase tracking-wider text-xs font-bold">
              Ready for a transformation?
            </p>
            <button
              onClick={onOpenBooking}
              className="px-10 py-4 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-all uppercase tracking-wider text-xs inline-flex items-center gap-2.5 cursor-pointer shadow-xl shadow-amber-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Salon Session</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
