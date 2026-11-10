'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, CheckCircle2, Scissors, MessageSquare, LogIn, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, getDocFromServer, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { format, addDays, startOfToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, addMonths, subMonths, getDay } from 'date-fns';
import { cn } from '../lib/utils';
import AuthModal from './AuthModal';
import { toast } from 'sonner';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM'
];

const categories = [
  { id: 'hair', name: 'Hair' },
  { id: 'beard', name: 'Beard' },
  { id: 'spa', name: 'Spa & Wellness' },
  { id: 'treatments', name: 'Treatments' }
];

const services = [
  { id: 'haircut', category: 'hair', name: 'Classic Haircut', price: '5,000' },
  { id: 'skin-fade', category: 'hair', name: 'Skin Fade', price: '7,000' },
  { id: 'beard-trim', category: 'beard', name: 'Beard Sculpting', price: '3,500' },
  { id: 'hot-shave', category: 'beard', name: 'Luxury Hot Shave', price: '6,000' },
  { id: 'massage', category: 'spa', name: 'Full Body Massage', price: '15,000' },
  { id: 'facial-spa', category: 'spa', name: 'Luxury Glow Facial', price: '12,000' },
  { id: 'manicure', category: 'spa', name: 'Premium Manicure', price: '8,000' },
  { id: 'facial', category: 'treatments', name: 'Deep Cleanse Facial', price: '10,000' },
  { id: 'scalp', category: 'treatments', name: 'Scalp Massage', price: '4,000' }
];

interface BookingProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export default function Booking({ onOpenAuth }: BookingProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(services[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter services based on selected category
  const filteredServices = services.filter(s => s.category === selectedCategory.id);

  // Reset selected service when category changes if current service is not in new category
  useEffect(() => {
    if (selectedService.category !== selectedCategory.id) {
      setSelectedService(filteredServices[0]);
    }
  }, [selectedCategory]);

  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  const handleBooking = async () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        userId: user.uid,
        userName: userData?.displayName || user.displayName || 'Anonymous',
        userEmail: user.email || 'No Email',
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: selectedCategory.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      console.log('Attempting to save booking:', bookingData);
      
      try {
        const docRef = await addDoc(collection(db, 'bookings'), bookingData);
        console.log('Booking saved with ID:', docRef.id);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'bookings');
      }
      
      // Notify Admin ONLY (initial booking)
      try {
        await fetch('/api/notify-admin-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: bookingData.userName,
            userEmail: bookingData.userEmail,
            serviceName: bookingData.serviceName,
            category: bookingData.category,
            date: bookingData.date,
            time: bookingData.time,
          }),
        });
      } catch (emailError) {
        console.error('Failed to notify admin:', emailError);
      }

      setSuccess(true);
      // Reset form
      setSelectedTime('');
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Booking error details:', error);
      toast.error(`Failed to book appointment: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi Best Salon at Best Creative Hub! I'd like to book a ${selectedService.name} (${selectedCategory.name}) on ${format(selectedDate, 'PPP')} at ${selectedTime}. My name is ${userData?.displayName || user?.displayName || 'a client'}.`;
    const url = `https://api.whatsapp.com/send?phone=2348068059823&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleLoginClick = () => {
    onOpenAuth('login');
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
            Secure your spot in the chair
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
                  <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Booking Received!</h3>
                  <p className="text-[#F8F9FA]/70 mb-8">We'll confirm your appointment shortly via email.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3 bg-amber-500 text-black font-bold rounded-xl uppercase tracking-wider text-xs"
                  >
                    Book Another
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
                  {/* Category Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
                      <Scissors className="w-3.5 h-3.5 text-amber-400" /> 1. Select Category
                    </label>
                    <div className="flex flex-wrap gap-3 pb-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat)}
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

                  {/* Service Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
                      <Scissors className="w-3.5 h-3.5 text-amber-400" /> 2. Select Service
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className={cn(
                            'p-4 rounded-2xl border text-left transition-all flex justify-between items-center cursor-pointer',
                            selectedService.id === service.id
                              ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20'
                              : 'bg-[#0A192F] border-white/10 text-white/70 hover:border-white/20'
                          )}
                        >
                          <span className="font-bold uppercase tracking-tight">{service.name}</span>
                          <span className={cn(
                            'text-sm font-black',
                            selectedService.id === service.id ? 'text-black/70' : 'text-amber-400'
                          )}>₦{service.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
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

                    {/* Quick 7-day selector */}
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

                    {/* Show selected date if outside the 7-day range */}
                    {!next7Days.some((d) => isSameDay(d, selectedDate)) && (
                      <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-sm font-bold text-amber-400">
                          Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                    )}

                    {/* Calendar Date Picker */}
                    <AnimatePresence>
                      {showCalendar && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 rounded-2xl bg-[#0A192F] border border-white/10 mb-4">
                            {/* Month/Year Navigation */}
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

                            {/* Day-of-week headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-1">
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1">
                              {/* Leading empty cells for alignment */}
                              {Array.from({ length: getDay(startOfMonth(calendarMonth)) }).map((_, i) => (
                                <div key={`empty-${i}`} />
                              ))}

                              {/* Day cells */}
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

                  {/* Time Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> 4. Select Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
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

                  {/* Submit */}
                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleBooking}
                      disabled={loading}
                      className="flex-1 py-5 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="py-5 px-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black rounded-2xl hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      <MessageSquare className="w-5 h-5" />
                      WhatsApp
                    </button>
                  </div>
                  
                  {!user && (
                    <p className="text-center text-white/40 text-[10px] uppercase tracking-widest font-bold">
                      * Please login to confirm your booking
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
