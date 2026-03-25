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
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'skin-fade',
    name: 'Skin Fade',
    description: 'Seamless blend from skin to hair. Our specialty.',
    price: '7,000',
    duration: 60,
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1622286332618-f2803b1950d4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'massage',
    name: 'Full Body Massage',
    description: 'Relax and rejuvenate with our signature aromatherapy massage.',
    price: '15,000',
    duration: 60,
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'facial-spa',
    name: 'Luxury Glow Facial',
    description: 'Premium skin treatment for a radiant and healthy complexion.',
    price: '12,000',
    duration: 45,
    icon: Flower2,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'beard-trim',
    name: 'Beard Sculpting',
    description: 'Shape, trim, and line up for the perfect beard.',
    price: '3,500',
    duration: 30,
    icon: UserCheck,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hot-shave',
    name: 'Luxury Hot Shave',
    description: 'Traditional straight razor shave with hot towels.',
    price: '6,000',
    duration: 45,
    icon: Star,
    image: 'https://images.unsplash.com/photo-1593702295094-ada74bc4a149?auto=format&fit=crop&q=80&w=800'
  }
];

interface ServicesProps {
  onOpenBooking: () => void;
}

export default function Services({ onOpenBooking }: ServicesProps) {
  return (
    <section id="services" className="section-padding bg-black">
      <div className="container-max">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6"
          >
            Our <span className="text-amber-500">Services</span>
          </motion.h2>
          <p className="text-white/40 max-w-2xl mx-auto uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">
            Crafted experiences for the modern gentleman
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                    <service.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    ₦{service.price}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">
                  {service.name}
                </h3>
                <p className="text-white/40 text-sm mb-8 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration} MIN
                  </div>
                  <button 
                    onClick={onOpenBooking}
                    className="text-amber-500 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    Book Now <Scissors className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-block p-10 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
            <p className="text-white/40 mb-8 uppercase tracking-[0.3em] text-[10px] font-bold">
              Ready for a transformation?
            </p>
            <button
              onClick={onOpenBooking}
              className="px-16 py-5 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all uppercase tracking-[0.2em] inline-flex items-center gap-3 cursor-pointer shadow-2xl shadow-amber-500/20"
            >
              <Calendar className="w-5 h-5" />
              Book Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
