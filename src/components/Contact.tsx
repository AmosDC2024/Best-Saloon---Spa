import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Instagram, Twitter, Facebook, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      try {
        await addDoc(collection(db, 'contacts'), {
          ...formData,
          status: 'new',
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'contacts');
      }

      // Send email notifications via our new API
      try {
        await fetch('/api/send-contact-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (emailError) {
        console.error('Failed to trigger contact emails:', emailError);
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error saving contact message:', error);
      alert('Failed to send message. Please try again or use WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm ${formData.name}. I have a question: ${formData.message}`;
    const url = `https://wa.me/2348068059823?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="py-12 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4"
          >
            Get In <span className="text-amber-500">Touch</span>
          </motion.h2>
          <p className="text-white/60 uppercase tracking-widest text-xs">
            We're here to answer your questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Message Sent!</h3>
                <p className="text-white/60 mb-8">Thank you for reaching out. We'll get back to you shortly.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 bg-amber-500 text-black font-bold rounded-xl uppercase tracking-widest"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="What is this about?"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="py-4 px-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black rounded-xl hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5">
                <MapPin className="w-6 h-6 text-amber-500 mb-4" />
                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Location</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Block 1, Plot 7, Ogundola layout, Opp. FMC Owo Annex, Oda Road, Before Bovas Filling Station, Akure Ondo State<br />
                  340103
                </p>
              </div>
              <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5">
                <Phone className="w-6 h-6 text-amber-500 mb-4" />
                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Phone</h4>
                <p className="text-white/60 text-sm leading-relaxed">+234 806 805 9823</p>
              </div>
            </div>

            <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5">
              <Clock className="w-6 h-6 text-amber-500 mb-4" />
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Hours</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-white/60 text-sm">
                <span>Mon - Fri</span> <span>9:00 AM - 8:00 PM</span>
                <span>Saturday</span> <span>9:00 AM - 9:00 PM</span>
                <span>Sunday</span> <span>10:00 AM - 6:00 PM</span>
              </div>
            </div>

            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-4 bg-zinc-900 rounded-2xl border border-white/5 text-white/40 hover:text-amber-500 hover:border-amber-500/30 transition-all"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

