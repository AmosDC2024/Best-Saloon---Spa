import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, CheckCircle2, Scissors, MessageSquare, LogIn, Sparkles } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, getDocFromServer, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { cn } from '../lib/utils';
import AuthModal from './AuthModal';

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

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  const handleBooking = async () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }

    if (!selectedTime) {
      alert('Please select a time slot');
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
      alert(`Failed to book appointment: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'd like to book a ${selectedService.name} (${selectedCategory.name}) on ${format(selectedDate, 'PPP')} at ${selectedTime}.`;
    const url = `https://wa.me/2348104922415?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleLoginClick = () => {
    onOpenAuth('login');
  };

  return (
    <div className="py-12 px-6 bg-zinc-950 relative overflow-hidden">
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
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4"
          >
            Book <span className="text-amber-500">Appointment</span>
          </motion.h2>
          <p className="text-white/60 uppercase tracking-widest text-xs">
            Secure your spot in the chair
          </p>
        </div>

        <div className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
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
                  <p className="text-white/60 mb-8">We'll confirm your appointment shortly via email.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3 bg-amber-500 text-black font-bold rounded-xl uppercase tracking-widest"
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
                    <label className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                      <Scissors className="w-3 h-3" /> 1. Select Category
                    </label>
                    <div className="flex flex-wrap gap-3 pb-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            'px-6 py-3 rounded-xl border text-xs font-bold transition-all whitespace-nowrap',
                            selectedCategory.id === cat.id
                              ? 'bg-amber-500 border-amber-500 text-black'
                              : 'bg-black/40 border-white/5 text-white/70 hover:border-white/20'
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                      <Scissors className="w-3 h-3" /> 2. Select Service
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className={cn(
                            'p-4 rounded-2xl border text-left transition-all flex justify-between items-center',
                            selectedService.id === service.id
                              ? 'bg-amber-500 border-amber-500 text-black'
                              : 'bg-black/40 border-white/5 text-white/70 hover:border-white/20'
                          )}
                        >
                          <span className="font-bold uppercase tracking-tight">{service.name}</span>
                          <span className={cn(
                            'text-sm font-black',
                            selectedService.id === service.id ? 'text-black/60' : 'text-amber-500'
                          )}>₦{service.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                      <Calendar className="w-3 h-3" /> 3. Select Date
                    </label>
                    <div className="flex flex-wrap gap-3 pb-4">
                      {next7Days.map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            'flex-shrink-0 w-[calc(33.33%-12px)] sm:w-20 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all',
                            isSameDay(selectedDate, date)
                              ? 'bg-amber-500 border-amber-500 text-black'
                              : 'bg-black/40 border-white/5 text-white/70 hover:border-white/20'
                          )}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest mb-1">
                            {format(date, 'EEE')}
                          </span>
                          <span className="text-2xl font-black">{format(date, 'd')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                      <Clock className="w-3 h-3" /> 4. Select Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            'py-3 rounded-xl border text-xs font-bold transition-all',
                            selectedTime === time
                              ? 'bg-amber-500 border-amber-500 text-black'
                              : 'bg-black/40 border-white/5 text-white/70 hover:border-white/20'
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
                      {loading ? 'Processing...' : 'Confirm Booking'}
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
