'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, CheckCircle2, Scissors, MessageSquare, 
  Sparkles, Loader2, ChevronLeft, ChevronRight, ChevronDown, 
  Check, Lock, ShieldCheck, AlertCircle, CreditCard 
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { format, addDays, startOfToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, addMonths, subMonths, getDay } from 'date-fns';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM'
];

export interface CategoryItem {
  id: 'hair' | 'beard' | 'spa' | 'treatments';
  name: string;
}

const categories: CategoryItem[] = [
  { id: 'hair', name: 'Hair' },
  { id: 'beard', name: 'Beard' },
  { id: 'spa', name: 'Spa & Wellness' },
  { id: 'treatments', name: 'Treatments' }
];

export interface ServiceItem {
  id: string;
  category: 'hair' | 'beard' | 'spa' | 'treatments';
  name: string;
  price: string;
}

const services: ServiceItem[] = [
  // ── HAIR (10 services) ───────────────────────────────────────────────
  { id: 'haircut', category: 'hair', name: 'Classic Haircut', price: '5,000' },
  { id: 'skin-fade', category: 'hair', name: 'Skin Fade', price: '7,000' },
  { id: 'low-fade', category: 'hair', name: 'Low Fade', price: 'Price on request' },
  { id: 'mid-fade', category: 'hair', name: 'Mid Fade', price: 'Price on request' },
  { id: 'high-fade', category: 'hair', name: 'High Fade', price: 'Price on request' },
  { id: 'taper-fade', category: 'hair', name: 'Taper Fade', price: 'Price on request' },
  { id: 'haircut-styling', category: 'hair', name: 'Haircut & Styling', price: 'Price on request' },
  { id: 'hair-wash', category: 'hair', name: 'Hair Wash', price: 'Price on request' },
  { id: 'hair-colouring', category: 'hair', name: 'Hair Colouring', price: 'Price on request' },
  { id: 'hair-treatment', category: 'hair', name: 'Hair Treatment', price: 'Price on request' },

  // ── BEARD (10 services) ──────────────────────────────────────────────
  { id: 'beard-trim', category: 'beard', name: 'Beard Trim', price: '3,500' },
  { id: 'beard-shaping', category: 'beard', name: 'Beard Shaping', price: 'Price on request' },
  { id: 'beard-grooming', category: 'beard', name: 'Beard Grooming', price: 'Price on request' },
  { id: 'beard-lineup', category: 'beard', name: 'Beard Line-up', price: 'Price on request' },
  { id: 'beard-colouring', category: 'beard', name: 'Beard Colouring', price: 'Price on request' },
  { id: 'hot-towel-shave', category: 'beard', name: 'Hot Towel Shave', price: '6,000' },
  { id: 'full-beard-styling', category: 'beard', name: 'Full Beard Styling', price: 'Price on request' },
  { id: 'mustache-grooming', category: 'beard', name: 'Mustache Grooming', price: 'Price on request' },
  { id: 'beard-conditioning', category: 'beard', name: 'Beard Conditioning', price: 'Price on request' },
  { id: 'premium-beard-treatment', category: 'beard', name: 'Premium Beard Treatment', price: 'Price on request' },

  // ── SPA & WELLNESS (11 services) ─────────────────────────────────────
  { id: 'swedish-massage', category: 'spa', name: 'Swedish Massage', price: 'Price on request' },
  { id: 'deep-tissue-massage', category: 'spa', name: 'Deep Tissue Massage', price: 'Price on request' },
  { id: 'relaxation-massage', category: 'spa', name: 'Relaxation Massage', price: 'Price on request' },
  { id: 'aromatherapy', category: 'spa', name: 'Aromatherapy', price: 'Price on request' },
  { id: 'body-scrub', category: 'spa', name: 'Body Scrub', price: 'Price on request' },
  { id: 'body-polish', category: 'spa', name: 'Body Polish', price: 'Price on request' },
  { id: 'facial-spa', category: 'spa', name: 'Facial Spa', price: '12,000' },
  { id: 'foot-spa', category: 'spa', name: 'Foot Spa', price: 'Price on request' },
  { id: 'manicure', category: 'spa', name: 'Manicure', price: '8,000' },
  { id: 'pedicure', category: 'spa', name: 'Pedicure', price: 'Price on request' },
  { id: 'full-body-massage', category: 'spa', name: 'Full Body Massage', price: '15,000' },

  // ── TREATMENTS (11 services) ─────────────────────────────────────────
  { id: 'hair-conditioning-treatment', category: 'treatments', name: 'Hair Conditioning Treatment', price: 'Price on request' },
  { id: 'scalp-treatment', category: 'treatments', name: 'Scalp Treatment', price: '4,000' },
  { id: 'hair-repair-treatment', category: 'treatments', name: 'Hair Repair Treatment', price: 'Price on request' },
  { id: 'anti-dandruff-treatment', category: 'treatments', name: 'Anti-Dandruff Treatment', price: 'Price on request' },
  { id: 'facial-cleansing', category: 'treatments', name: 'Facial Cleansing', price: 'Price on request' },
  { id: 'deep-cleansing-facial', category: 'treatments', name: 'Deep Cleansing Facial', price: '10,000' },
  { id: 'skin-rejuvenation', category: 'treatments', name: 'Skin Rejuvenation', price: 'Price on request' },
  { id: 'hair-restoration-consultation', category: 'treatments', name: 'Hair Restoration Consultation', price: 'Price on request' },
  { id: 'moisturising-treatment', category: 'treatments', name: 'Moisturising Treatment', price: 'Price on request' },
  { id: 'premium-hair-treatment', category: 'treatments', name: 'Premium Hair Treatment', price: 'Price on request' },
  { id: 'scalp-massage', category: 'treatments', name: 'Scalp Massage', price: '4,000' }
];

const formatPrice = (price: string) => {
  if (!price || price.toLowerCase().includes('request')) {
    return 'Price on request';
  }
  return price.startsWith('₦') ? price : `₦${price}`;
};

interface BookingProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function Booking({ onOpenAuth }: BookingProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem>(categories[0]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [success, setSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Authenticate user & load profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check URL query parameters for Paystack return callback (?reference=... or ?trxref=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference') || urlParams.get('trxref');

    if (reference) {
      // Clear URL params to avoid re-triggering verification on manual page refresh
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      handleVerifyPayment(reference);
    }
  }, []);

  const handleVerifyPayment = async (reference: string) => {
    setLoading(true);
    setLoadingMessage('Verifying Paystack payment with server...');
    setVerificationError(null);

    try {
      const response = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment verification failed.');
      }

      setBookingResult(data);
      setSuccess(true);
      toast.success('Payment verified! Your booking request has been submitted.');
    } catch (err: any) {
      console.error('Payment verification error:', err);
      const msg = err.message || 'Payment could not be verified.';
      setVerificationError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Close service dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServiceDropdownOpen(false);
      }
    };

    if (isServiceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isServiceDropdownOpen]);

  // Filter services by active category
  const filteredServices = services.filter((s) => s.category === selectedCategory.id);

  const handleCategorySelect = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setSelectedService(null);
    setIsServiceDropdownOpen(false);
  };

  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  // Compute 30% commitment fee and 70% balance
  const getFeeBreakdown = (service: ServiceItem | null) => {
    if (!service || !service.price || service.price.toLowerCase().includes('request')) {
      return null;
    }
    const numeric = parseFloat(service.price.replace(/[^0-9.]/g, '')) || 0;
    if (numeric <= 0) return null;
    const deposit = Math.round(numeric * 0.3);
    const balance = numeric - deposit;
    return {
      fullPrice: numeric,
      deposit,
      balance,
    };
  };

  const feeInfo = getFeeBreakdown(selectedService);

  // Initiates 10-minute slot reservation and redirects to Paystack
  const handleBooking = async () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }

    if (!selectedService) {
      toast.error('Please choose a service to proceed');
      setIsServiceDropdownOpen(true);
      return;
    }

    if (selectedService.price.toLowerCase().includes('request')) {
      toast.error('This service requires consultation ("Price on request"). Please book via WhatsApp or contact us directly.');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select an appointment time slot');
      return;
    }

    setLoading(true);
    setLoadingMessage('Reserving appointment slot...');
    setVerificationError(null);

    try {
      // 1. Obtain verified Firebase Auth ID token
      const idToken = await user.getIdToken();

      // 2. Call server-side slot reservation API (/api/booking/reserve-slot)
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const reserveRes = await fetch('/api/booking/reserve-slot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          date: formattedDate,
          time: selectedTime,
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          category: selectedCategory.name,
          price: selectedService.price,
          userName: userData?.displayName || user.displayName || 'Valued Client',
        }),
      });

      const reserveData = await reserveRes.json();
      if (!reserveRes.ok) {
        throw new Error(reserveData.error || 'Failed to reserve appointment slot.');
      }

      const slotId = reserveData.reservation?.slotId;
      if (!slotId) {
        throw new Error('Slot reservation response was invalid.');
      }

      // 3. Initialize Paystack transaction (/api/paystack/initialize)
      setLoadingMessage('Initializing secure Paystack checkout...');
      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          slotId,
          serviceId: selectedService.id,
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok) {
        throw new Error(initData.error || 'Failed to initialize payment.');
      }

      const authorizationUrl = initData.data?.authorizationUrl;
      if (!authorizationUrl) {
        throw new Error('No checkout authorization URL received from payment provider.');
      }

      // 4. Redirect customer to Paystack secure checkout
      setLoadingMessage('Redirecting to Paystack checkout...');
      window.location.href = authorizationUrl;

    } catch (error: any) {
      console.error('Booking checkout initiation failed:', error);
      toast.error(error.message || 'Failed to start payment checkout. Please try again.');
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!selectedService) {
      toast.error('Please choose a service first');
      setIsServiceDropdownOpen(true);
      return;
    }

    const message = `Hi Best Salon at Best Creative Hub! I'd like to book a ${selectedService.name} (${selectedCategory.name}) on ${format(selectedDate, 'PPP')} at ${selectedTime}. My name is ${userData?.displayName || user?.displayName || 'a client'}.`;
    const url = `https://api.whatsapp.com/send?phone=2348068059823&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="py-12 px-6 bg-[#0A192F] relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-16 h-16 text-amber-500"
        >
          <Scissors className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-20 h-20 text-amber-500"
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-3"
          >
            Book <span className="text-amber-500">Appointment</span>
          </motion.h2>
          <p className="text-[#F8F9FA]/60 uppercase tracking-wider text-xs font-bold">
            Secure your spot in the chair with a 30% commitment fee
          </p>
        </div>

        <div className="bg-[#1F2937] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                    Deposit Paid & Booking Received!
                  </h3>
                  <p className="text-[#F8F9FA]/70 mb-4 max-w-md mx-auto text-sm leading-relaxed">
                    Your 30% commitment deposit has been successfully verified. Your appointment request has been submitted and is currently pending admin confirmation.
                  </p>

                  {bookingResult?.latePaymentConflict && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs max-w-md mx-auto text-left flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <strong>Slot Adjustment Notice:</strong> Payment was received after the initial reservation window expired, and the original slot had a conflict. Your payment is safely recorded and the admin team will contact you directly to agree on a convenient alternative time.
                      </div>
                    </div>
                  )}

                  <div className="mb-8 p-5 bg-white/5 rounded-2xl max-w-sm mx-auto text-xs text-white/70 space-y-2 text-left border border-white/5">
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Confirmation receipt sent to your email.
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      70% remaining balance is payable at the salon.
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Admin will review and confirm your schedule.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSuccess(false);
                      setSelectedService(null);
                      setSelectedTime('');
                      setBookingResult(null);
                    }}
                    className="px-8 py-3 bg-amber-500 text-black font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Book Another Appointment
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="booking-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10"
                >
                  {/* Verification Error Notice */}
                  {verificationError && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Payment Verification Error</strong>
                          {verificationError}
                          <p className="text-white/50 text-[11px] mt-1">
                            If your account was debited, please contact our support at admin@bestcreativehub.com or WhatsApp +234 806 805 9823.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVerificationError(null)}
                        className="text-rose-400 hover:text-white text-xs font-bold p-1 cursor-pointer"
                        aria-label="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* 1. Category Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
                      <Scissors className="w-3.5 h-3.5 text-amber-400" /> 1. Select Category
                    </label>
                    <div className="flex flex-wrap gap-3 pb-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className={cn(
                            'px-6 py-3 rounded-xl border text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                            selectedCategory.id === cat.id
                              ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20'
                              : 'bg-[#0A192F] border-white/10 text-white/70 hover:border-white/20'
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Service Selection Dropdown */}
                  <div>
                    <label className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
                      <Scissors className="w-3.5 h-3.5 text-amber-400" /> 2. Select Service
                    </label>

                    <div ref={serviceDropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsServiceDropdownOpen((prev) => !prev)}
                        className={cn(
                          'w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer group',
                          isServiceDropdownOpen
                            ? 'bg-[#0A192F] border-amber-500 ring-2 ring-amber-500/20 shadow-lg shadow-amber-500/10'
                            : selectedService
                              ? 'bg-[#0A192F] border-amber-500/60 hover:border-amber-500'
                              : 'bg-[#0A192F] border-white/10 hover:border-white/20'
                        )}
                        aria-haspopup="listbox"
                        aria-expanded={isServiceDropdownOpen}
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          {selectedService ? (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                              <span className="font-bold text-white uppercase tracking-tight text-sm sm:text-base truncate">
                                {selectedService.name}
                              </span>
                              <span className={cn(
                                'text-xs sm:text-sm font-black whitespace-nowrap',
                                selectedService.price.toLowerCase().includes('request')
                                  ? 'text-white/50 font-medium'
                                  : 'text-amber-400'
                              )}>
                                {formatPrice(selectedService.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white/40 text-sm font-semibold">
                              Choose a service
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {selectedService && (
                            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-amber-500" />
                          )}
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 text-amber-400 transition-transform duration-200',
                              isServiceDropdownOpen && 'rotate-180'
                            )}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isServiceDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-2 z-40 bg-[#0A192F] border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
                          >
                            <div className="p-2.5 border-b border-white/5 flex items-center justify-between text-[11px] text-white/40 px-4 bg-white/[0.02]">
                              <span className="uppercase tracking-wider font-bold text-amber-400/80">
                                {selectedCategory.name} Services ({filteredServices.length})
                              </span>
                              <span>Select an option</span>
                            </div>

                            <div className="max-h-64 sm:max-h-72 overflow-y-auto divide-y divide-white/5 overscroll-contain">
                              {filteredServices.map((service) => {
                                const isSelected = selectedService?.id === service.id;
                                return (
                                  <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedService(service);
                                      setIsServiceDropdownOpen(false);
                                    }}
                                    className={cn(
                                      'w-full px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between text-left transition-all cursor-pointer',
                                      isSelected
                                        ? 'bg-amber-500 text-black font-bold'
                                        : 'hover:bg-white/5 text-white'
                                    )}
                                  >
                                    <div className="flex items-center gap-3 min-w-0 pr-3">
                                      {isSelected ? (
                                        <Check className="w-4 h-4 shrink-0 text-black" />
                                      ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                                      )}
                                      <span className={cn(
                                        'uppercase tracking-tight text-xs sm:text-sm truncate',
                                        isSelected ? 'font-black text-black' : 'font-semibold text-white'
                                      )}>
                                        {service.name}
                                      </span>
                                    </div>

                                    <span className={cn(
                                      'text-xs sm:text-sm font-black whitespace-nowrap shrink-0',
                                      isSelected
                                        ? 'text-black/80'
                                        : service.price.toLowerCase().includes('request')
                                          ? 'text-white/40 font-medium'
                                          : 'text-amber-400'
                                    )}>
                                      {formatPrice(service.price)}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* 3. Date Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setCalendarMonth(selectedDate);
                          setShowCalendar(!showCalendar);
                        }}
                        className="p-0 bg-transparent border-none cursor-pointer hover:scale-110 transition-transform"
                        title="Open calendar"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                      3. Select Date
                      {showCalendar && (
                        <span className="ml-auto text-[10px] text-amber-400/60 normal-case tracking-normal font-medium">
                          Tap calendar icon to close
                        </span>
                      )}
                    </label>

                    <div className="flex flex-wrap gap-3 pb-4">
                      {next7Days.map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => {
                            setSelectedDate(date);
                            setShowCalendar(false);
                          }}
                          className={cn(
                            'flex-shrink-0 w-[calc(33.33%-12px)] sm:w-20 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer',
                            isSameDay(selectedDate, date)
                              ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20'
                              : 'bg-[#0A192F] border-white/10 text-white/70 hover:border-white/20'
                          )}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
                            {format(date, 'EEE')}
                          </span>
                          <span className="text-2xl font-black">{format(date, 'd')}</span>
                        </button>
                      ))}
                    </div>

                    {!next7Days.some((d) => isSameDay(d, selectedDate)) && (
                      <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-sm font-bold text-amber-400">
                          Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                    )}

                    <AnimatePresence>
                      {showCalendar && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 rounded-2xl bg-[#0A192F] border border-white/10 mb-4">
                            <div className="flex items-center justify-between mb-5">
                              <button
                                type="button"
                                onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                                disabled={isBefore(endOfMonth(subMonths(calendarMonth, 1)), startOfToday())}
                                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-bold text-white uppercase tracking-wider">
                                {format(calendarMonth, 'MMMM yyyy')}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-1">
                                  {day}
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                              {Array.from({ length: getDay(startOfMonth(calendarMonth)) }).map((_, i) => (
                                <div key={`empty-${i}`} />
                              ))}

                              {eachDayOfInterval({
                                start: startOfMonth(calendarMonth),
                                end: endOfMonth(calendarMonth),
                              }).map((day) => {
                                const isPast = isBefore(day, startOfToday());
                                const isSelected = isSameDay(selectedDate, day);
                                const isToday = isSameDay(startOfToday(), day);

                                return (
                                  <button
                                    key={day.toISOString()}
                                    type="button"
                                    disabled={isPast}
                                    onClick={() => {
                                      setSelectedDate(day);
                                      setSelectedTime('');
                                      setShowCalendar(false);
                                    }}
                                    className={cn(
                                      'h-10 rounded-lg text-xs font-bold transition-all',
                                      isPast
                                        ? 'text-white/10 cursor-not-allowed'
                                        : isSelected
                                          ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                          : isToday
                                            ? 'bg-white/10 text-amber-400 hover:bg-white/15'
                                            : 'text-white/60 hover:bg-white/10 hover:text-white cursor-pointer'
                                    )}
                                  >
                                    {format(day, 'd')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 4. Time Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> 4. Select Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            'py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                            selectedTime === time
                              ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20'
                              : 'bg-[#0A192F] border-white/10 text-white/70 hover:border-white/20'
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Payment Summary Breakdown */}
                  {selectedService && (
                    <div className="rounded-2xl border border-white/10 bg-[#0A192F]/80 p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          Payment Breakdown
                        </span>
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full">
                          30% Deposit Required
                        </span>
                      </div>

                      {feeInfo ? (
                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between text-white/70">
                            <span>Full Service Price:</span>
                            <span className="font-bold text-white">₦{feeInfo.fullPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-amber-400 font-bold bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                              30% Commitment Fee (Payable Now):
                            </span>
                            <span className="font-black text-sm">₦{feeInfo.deposit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-white/60">
                            <span>Remaining Balance (Payable at Salon):</span>
                            <span className="font-bold text-white/80">₦{feeInfo.balance.toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-white/40 pt-1 leading-relaxed">
                            * A 30% commitment fee secures your appointment chair. Your booking request will be confirmed by the admin after payment verification. The remaining 70% is settled when you arrive at Best Salon.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                          <div className="leading-relaxed">
                            <strong className="block font-bold">Consultation Required ("Price on request")</strong>
                            This bespoke service requires in-person or direct consultation. Online commitment fee cannot be calculated. Please book directly with our concierge via WhatsApp below.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 6. Submission Controls */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={handleBooking}
                      disabled={loading || (selectedService?.price.toLowerCase().includes('request') ?? false)}
                      className="flex-1 py-5 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-amber-500/10"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {loadingMessage}
                        </>
                      ) : selectedService?.price.toLowerCase().includes('request') ? (
                        'Consultation Required'
                      ) : feeInfo ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay ₦{feeInfo.deposit.toLocaleString()} & Book
                        </>
                      ) : (
                        'Select Service & Time to Book'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="py-5 px-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black rounded-2xl hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5" />
                      WhatsApp
                    </button>
                  </div>
                  
                  {!user && (
                    <p className="text-center text-white/40 text-[10px] uppercase tracking-widest font-bold">
                      * Please login to proceed with appointment booking and secure payment
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
