import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, CheckCircle2, Clock3, Scissors, LogOut, Check, X } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export default function AppointmentHistory() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRescheduleAction = async (bookingId: string, action: 'accept' | 'decline', booking: any) => {
    setActionLoading(bookingId);
    try {
      if (action === 'accept') {
        await updateDoc(doc(db, 'bookings', bookingId), {
          status: 'pending', // Set back to pending so admin can confirm
          date: booking.rescheduleSuggestedDate,
          time: booking.rescheduleSuggestedTime,
          rescheduleAccepted: true
        });
        alert('Reschedule accepted! The admin will now confirm your appointment for the new time.');
      } else {
        await updateDoc(doc(db, 'bookings', bookingId), {
          status: 'cancelled',
          rescheduleDeclined: true
        });
        alert('Reschedule request declined. The appointment has been cancelled.');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setBookings([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching user bookings:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="py-24 text-center px-6">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Login Required</h3>
        <p className="text-white/60 mb-8 max-w-md mx-auto text-sm">
          You have to log in to manage or view your appointments. This helps us keep your grooming history secure and accessible only to you.
        </p>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4"
          >
            Your <span className="text-amber-500">Appointments</span>
          </motion.h2>
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/60 uppercase tracking-widest text-xs">
              Manage and track your grooming sessions
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              Logout from Account
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-zinc-900 rounded-3xl border border-white/5 p-12 text-center">
            <Calendar className="w-16 h-16 text-white/10 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">No Appointments Found</h3>
            <p className="text-white/60 mb-8">You haven't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900 rounded-2xl border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <Scissors className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-1">
                      {booking.serviceName}
                    </h4>
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                      {booking.category}
                    </p>
                    <div className="flex flex-wrap gap-4 text-white/40 text-xs uppercase tracking-widest font-bold">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(booking.date), 'PPP')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {booking.time}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Status</span>
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      booking.status === 'pending' 
                        ? "bg-amber-500/10 text-amber-500" 
                        : booking.status === 'rescheduled'
                        ? "bg-blue-500/10 text-blue-400"
                        : booking.status === 'cancelled'
                        ? "bg-red-500/10 text-red-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {booking.status === 'pending' ? (
                        <>
                          <Clock3 className="w-3 h-3" />
                          Pending
                        </>
                      ) : booking.status === 'rescheduled' ? (
                        <>
                          <Clock className="w-3 h-3" />
                          Rescheduled
                        </>
                      ) : booking.status === 'cancelled' ? (
                        <>
                          <X className="w-4 h-4" />
                          Cancelled
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Confirmed
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {booking.status === 'rescheduled' && (
                  <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl w-full">
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Reschedule Suggestion
                    </p>
                    <p className="text-white/70 text-xs mb-3 italic">"{booking.rescheduleMessage}"</p>
                    <div className="flex flex-wrap gap-4 text-white/90 text-xs font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        New Date: {booking.rescheduleSuggestedDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-blue-400" />
                        New Time: {booking.rescheduleSuggestedTime}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleRescheduleAction(booking.id, 'accept', booking)}
                        disabled={actionLoading === booking.id}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-black text-[10px] font-black rounded-xl hover:bg-emerald-400 transition-all uppercase tracking-widest disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        Accept New Time
                      </button>
                      <button
                        onClick={() => handleRescheduleAction(booking.id, 'decline', booking)}
                        disabled={actionLoading === booking.id}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 text-[10px] font-black rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest border border-red-500/20 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                    
                    <p className="mt-4 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      * Please check your email for full details and confirmation instructions.
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
