'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Inquiries',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `[${formData.department}] ${formData.subject || 'Direct Contact Message'}`,
          message: `Department: ${formData.department}\n\n${formData.message}`,
        }),
      });

      if (response.ok) {
        toast.success(
          'Your message has been sent to Best Creative Hub! We will get back to you within 24 hours.'
        );
        setFormData({
          name: '',
          email: '',
          department: 'General Inquiries',
          subject: '',
          message: '',
        });
      } else {
        toast.error('Could not submit form. Please contact our team via WhatsApp.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      toast.error('Network error. Please chat with us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A192F] text-[#F8F9FA] overflow-hidden pt-20">
      {/* 1. HERO - TWO COLUMN DESKTOP */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] uppercase tracking-widest font-bold text-amber-400">
                  Direct Hub Concierge &bull; Akure
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#F8F9FA] mb-6 leading-[1.1]">
                Connect With{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Best Creative Hub
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
                Have a question about Best Salon bookings, a 3D signage quote, fine art commissions,
                or academy enrollment? Reach our executive concierge team in Akure.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20make%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>

                <a
                  href="tel:+2348068059823"
                  className="px-8 py-4 bg-[#1F2937] hover:bg-[#1F2937]/80 text-[#F8F9FA] border border-white/10 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call +234 806 805 9823</span>
                </a>
              </div>

              {/* Highlights Pill Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Mon&ndash;Sat: 8AM &ndash; 8PM</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>On-site Parking</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>&lt; 24h Response</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:col-span-5 relative w-full">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200"
                  alt="Best Creative Hub Concierge Lounge"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent pointer-events-none" />

                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#1F2937]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
                      Akure Creative Campus
                    </p>
                    <p className="text-xs font-bold text-white">Block 1, Plot 7, Ogundola Layout</p>
                  </div>
                  <Building className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information Cards */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#F8F9FA] mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Hub Location
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Block 1, Plot 7, Ogundola layout, Akure, Ondo State, Nigeria.
              </p>
              <p className="text-xs text-amber-400/80 leading-snug">
                Convenient on-site parking and executive lounge available for all visitors.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#F8F9FA] mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Working Hours
              </h3>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span>Monday &ndash; Saturday</span>
                  <span className="font-mono text-white font-bold">8:00 AM &ndash; 8:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Sunday</span>
                  <span className="font-mono text-white font-bold">12:00 PM &ndash; 6:00 PM</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#1F2937] border border-white/10 shadow-xl space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#F8F9FA] mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-400" />
                Direct Communication
              </h3>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Call Center</p>
                <p className="text-sm text-white font-mono mt-0.5 font-bold">+234 806 805 9823</p>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Email Inbox</p>
                <p className="text-sm text-white font-mono mt-0.5 font-bold">osiamijnr@gmail.com</p>
              </div>
              <div className="pt-2">
                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20make%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-2">
            <div className="p-8 sm:p-12 rounded-3xl bg-[#1F2937] border border-white/15 shadow-2xl">
              <div className="mb-8">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
                  Online Inquiry
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#F8F9FA] tracking-tight">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  Fill in your details and our team will get back to you promptly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Ade"
                      className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-[#F8F9FA] text-sm focus:outline-none focus:border-amber-500 placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-[#F8F9FA] text-sm focus:outline-none focus:border-amber-500 placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                      Department / Business
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-[#F8F9FA] text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="General Inquiries">General Hub Inquiries</option>
                      <option value="Best Salon">Best Salon Concierge</option>
                      <option value="Best Signs & Craft">Best Signs &amp; Craft Fabrication</option>
                      <option value="Best Art">Best Art Studio Commissions</option>
                      <option value="Training Academy">Creative Academy Admissions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Signage Inquiry / Haircut Question"
                      className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-[#F8F9FA] text-sm focus:outline-none focus:border-amber-500 placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 bg-[#0A192F] border border-white/10 rounded-xl text-[#F8F9FA] text-sm focus:outline-none focus:border-amber-500 placeholder:text-white/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Hub</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
