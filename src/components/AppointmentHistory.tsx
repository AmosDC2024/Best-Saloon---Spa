'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, CheckCircle2, Clock3, Scissors, LogOut, Check, X, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { toast } from 'sonner';

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

  const handleRescheduleAction = async (bookingId: string, action: 'accept' | 'decline') => {
    setActionLoading(bookingId);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error('You must be logged in to manage your appointments.');
        return;
      }

      const idToken = await currentUser.getIdToken();
      const response = await fetch('/api/booking/reschedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ bookingId, action }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Failed to update reschedule status.');
        return;
      }

      if (action === 'accept') {
        toast.success(
          data.message || 'Reschedule accepted! The new time is secured and awaiting admin confirmation.'
        );
      } else {
        toast.error(data.message || 'Reschedule request declined. The appointment has been cancelled.');
      }
    } catch (error) {
      console.error('Reschedule API error:', error);
      toast.error('Could not reach the server. Please check your internet connection and try again.');
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
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-bold text-white uppercase tracking-tight">
                        {booking.serviceName}
                      </h4>
                      {booking.price && (
                        <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full">
                          {booking.price}
                        </span>
                      )}
                    </div>
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                      {booking.category}
                    </p>
                    <div className="flex flex-wrap gap-4 text-white/40 text-xs uppercase tracking-widest font-bold mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {format(new Date(booking.date), 'PPP')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {booking.time}
                      </div>
                    </div>

                    {/* Payment Information */}
                    {booking.depositPaidNaira !== undefined && (
                      <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-xs space-y-1 max-w-md">
                        <div className="flex items-center justify-between text-white/70">
                          <span>30% Deposit Paid:</span>
                          <strong className="text-emerald-400">₦{booking.depositPaidNaira.toLocaleString()}</strong>
                        </div>
                        {booking.balanceDueNaira !== undefined && (
                          <div className="flex items-center justify-between text-white/60">
                            <span>Balance Due at Salon (70%):</span>
                            <strong className="text-amber-300">₦{booking.balanceDueNaira.toLocaleString()}</strong>
                          </div>
                        )}
                        {booking.paymentReference && (
                          <div className="text-[10px] text-white/40 font-mono pt-0.5">
                            Ref: {booking.paymentReference}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Late Payment Notice */}
                    {booking.latePaymentConflict && (
                      <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>Your deposit was safely received. Due to a schedule conflict, our admin team will contact you directly to agree on an updated appointment time.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  {/* Payment Badge */}
                  {booking.paymentStatus === 'paid_deposit' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CreditCard className="w-3 h-3" />
                      Deposit Paid
                    </div>
                  )}

                  {/* Booking Status Badge */}
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Appointment Status</span>
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      booking.status === 'pending' 
                        ? "bg-amber-500/10 text-amber-400" 
                        : booking.status === 'rescheduled'
                        ? "bg-blue-500/10 text-blue-400"
                        : booking.status === 'cancelled'
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    )}>
                      {booking.status === 'pending' ? (
                        <>
                          <Clock3 className="w-3 h-3" />
                          Pending Review
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
                        onClick={() => handleRescheduleAction(booking.id, 'accept')}
                        disabled={actionLoading === booking.id}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-black text-[10px] font-black rounded-xl hover:bg-emerald-400 transition-all uppercase tracking-widest disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        Accept New Time
                      </button>
                      <button
                        onClick={() => handleRescheduleAction(booking.id, 'decline')}
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
