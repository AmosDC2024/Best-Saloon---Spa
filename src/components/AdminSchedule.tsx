import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { format } from 'date-fns';
import { Clock, CheckCircle, Calendar, User, Scissors, Loader2 } from 'lucide-react';

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: any;
}

export default function AdminSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    // Listen for Bookings for the selected date
    const q = query(
      collection(db, 'bookings'), 
      where('date', '==', dateStr),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'bookings');
    });

    return () => unsubscribe();
  }, [dateStr]);

  const markAsDone = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'bookings', id), { status: 'completed' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    } finally {
      setActionLoading(null);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-amber-500 animate-pulse font-black uppercase tracking-widest">Loading Schedule...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Daily <span className="text-amber-500">Schedule</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => changeDate(-1)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
            >
              <Calendar className="w-4 h-4 rotate-180" />
            </button>
            <p className="text-white font-bold uppercase tracking-[0.3em] text-sm">
              {format(selectedDate, 'PPPP')}
            </p>
            <button 
              onClick={() => changeDate(1)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <input 
          type="date"
          value={dateStr}
          onChange={(e) => {
            if (e.target.value) {
              setSelectedDate(new Date(e.target.value));
              setLoading(true);
            }
          }}
          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-white/10">
            <Clock className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 uppercase tracking-widest text-sm">No appointments scheduled for this day</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <motion.div
              layout
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-zinc-900 p-6 md:p-8 rounded-3xl border transition-all ${
                booking.status === 'completed' 
                  ? 'border-white/5 opacity-50 grayscale' 
                  : 'border-amber-500/20 shadow-lg shadow-amber-500/5'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex gap-6 items-start">
                  <div className="text-2xl md:text-3xl font-black text-amber-500 w-20 md:w-24 flex-shrink-0 bg-black/40 p-3 md:p-4 rounded-2xl text-center border border-white/5">
                    {booking.time}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-white/40" />
                      <h3 className="font-bold text-lg md:text-xl">{booking.userName}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs md:text-sm mb-4">
                      <Scissors className="w-4 h-4" />
                      <span>{booking.serviceName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500' : 
                        booking.status === 'completed' ? 'bg-white/10 text-white/40' : 
                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                        'bg-amber-500/20 text-amber-500'
                      }`}>
                        {booking.status}
                      </span>
                      {booking.status === 'completed' && (
                        <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <button
                    onClick={() => markAsDone(booking.id)}
                    disabled={actionLoading === booking.id}
                    className="w-full md:w-auto px-8 py-4 bg-emerald-500 text-black text-xs font-black rounded-2xl uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === booking.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Mark Done'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
