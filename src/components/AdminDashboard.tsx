'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { format } from 'date-fns';
import { Mail, Calendar, CheckCircle, Clock, Trash2, X, MessageSquare, User, TrendingUp, Inbox, ShieldCheck, Scissors } from 'lucide-react';
import AdminUsers from './AdminUsers';
import AdminSchedule from './AdminSchedule';
import { toast } from 'sonner';

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  createdAt: any;
  rescheduleAccepted?: boolean;
  rescheduleDeclined?: boolean;
  rescheduleSuggestedDate?: string;
  rescheduleSuggestedTime?: string;
  rescheduleMessage?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: any;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'messages' | 'users' | 'schedule'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState<{ isOpen: boolean; booking: Booking | null }>({ isOpen: false, booking: null });
  const [rescheduleMessage, setRescheduleMessage] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  useEffect(() => {
    // Listen for Bookings
    const qBookings = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribeBookings = onSnapshot(qBookings, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'bookings');
    });

    // Listen for Contact Messages
    const qMessages = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
      setMessages(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'contacts');
    });

    return () => {
      unsubscribeBookings();
      unsubscribeMessages();
    };
  }, []);

  const updateBookingStatus = async (id: string, status: string, booking?: Booking) => {
    try {
      const updates: any = { status };
      
      // Clear reschedule flags if confirmed or cancelled
      if (status === 'confirmed' || status === 'cancelled') {
        updates.rescheduleAccepted = false;
        updates.rescheduleDeclined = false;
      }

      await updateDoc(doc(db, 'bookings', id), updates);
      
      // If confirming, send email
      if (status === 'confirmed' && booking) {
        try {
          const response = await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userName: booking.userName,
              userEmail: booking.userEmail,
              serviceName: booking.serviceName,
              category: booking.category,
              date: booking.date,
              time: booking.time,
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Email API failed:', errorData);
            toast.error(`Booking confirmed in database, but email failed: ${errorData.error || 'Unknown error'}`);
          }
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          toast.error('Booking confirmed in database, but could not reach email server.');
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModal.booking) return;
    setIsRescheduling(true);
    setRescheduleSuccess(false);

    try {
      // 1. Update status to rescheduled in Firestore FIRST to ensure in-app UI updates
      await updateDoc(doc(db, 'bookings', rescheduleModal.booking.id), { 
        status: 'rescheduled',
        rescheduleSuggestedDate: suggestedDate,
        rescheduleSuggestedTime: suggestedTime,
        rescheduleMessage: rescheduleMessage,
        rescheduleAccepted: false,
        rescheduleDeclined: false
      });

      // 2. Send Reschedule Email
      try {
        await fetch('/api/send-reschedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: rescheduleModal.booking.userName,
            userEmail: rescheduleModal.booking.userEmail,
            serviceName: rescheduleModal.booking.serviceName,
            originalDate: rescheduleModal.booking.date,
            originalTime: rescheduleModal.booking.time,
            suggestedDate: suggestedDate,
            suggestedTime: suggestedTime,
            message: rescheduleMessage,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send reschedule email:', emailError);
      }

      // 3. Show success state in modal
      setRescheduleSuccess(true);
      
      // 4. Show success notification toast as well
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-24 right-6 z-[100] bg-emerald-500 text-black px-6 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl animate-bounce';
      successMsg.innerHTML = 'Reschedule Request Sent to Client Panel!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

      // 4. Wait 5 seconds before closing the modal as requested
      setTimeout(() => {
        setRescheduleModal({ isOpen: false, booking: null });
        setRescheduleMessage('');
        setSuggestedDate('');
        setSuggestedTime('');
        setRescheduleSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Failed to reschedule:', error);
      toast.error('We encountered an error while trying to reschedule. Please check your internet connection and try again.');
    } finally {
      setIsRescheduling(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'contacts', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contacts/${id}`);
    }
  };

  const deleteItem = async (id: string, type: 'bookings' | 'contacts') => {
    try {
      await deleteDoc(doc(db, type, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${type}/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-2xl p-1 flex items-center justify-center animate-pulse">
          <Image
            src="/images/logo.jpg"
            alt="Best Creative Hub Logo"
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-amber-500 font-black uppercase tracking-widest text-xs sm:text-sm">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A192F] text-white py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Admin Hero Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-8">
          <div className="min-w-0 max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 shadow-md flex items-center justify-center p-0.5">
                <Image
                  src="/images/logo.jpg"
                  alt="Best Creative Hub Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Operations Console</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Admin <span className="text-amber-500">Control</span>
            </h1>
            <p className="text-white/50 text-xs sm:text-sm uppercase tracking-[0.25em] mt-2 font-bold">
              Manage Best Creative Hub operations
            </p>
          </div>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={async () => {
                if (!auth.currentUser?.email) return;
                try {
                  const res = await fetch('/api/send-test-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: auth.currentUser.email }),
                  });
                  if (res.ok) toast.success('Testing link sent to your email!');
                  else toast.error('Failed to send link.');
                } catch (err) {
                  console.error(err);
                  toast.error('Error sending link.');
                }
              }}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 hover:border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Send Test Link to Me</span>
            </button>
          </div>
        </header>

        {/* Dashboard Navigation Tabs */}
        <nav aria-label="Dashboard Tabs" className="mb-8 md:mb-10">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex sm:flex items-center bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 gap-1.5 min-w-max sm:min-w-0 shadow-xl">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>Schedule</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Bookings</span>
                {bookings.filter((b) => b.status === 'pending').length > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      activeTab === 'bookings' ? 'bg-black text-amber-500' : 'bg-amber-500 text-black'
                    }`}
                  >
                    {bookings.filter((b) => b.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'messages'
                    ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Messages</span>
                {messages.filter((m) => m.status === 'new').length > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      activeTab === 'messages' ? 'bg-black text-amber-500' : 'bg-amber-500 text-black'
                    }`}
                  >
                    {messages.filter((m) => m.status === 'new').length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Admins</span>
              </button>
            </div>
          </div>
        </nav>

        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Total Bookings</span>
              </div>
              <div className="text-4xl font-black tracking-tighter">{bookings.length}</div>
            </div>
            <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Confirmed</span>
              </div>
              <div className="text-4xl font-black tracking-tighter">{bookings.filter(b => b.status === 'confirmed').length}</div>
            </div>
            <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Inbox className="w-6 h-6" />
                </div>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">New Messages</span>
              </div>
              <div className="text-4xl font-black tracking-tighter">{messages.filter(m => m.status === 'new').length}</div>
            </div>
          </div>
        ) : activeTab === 'schedule' ? (
          <AdminSchedule />
        ) : activeTab === 'bookings' ? (
          <div className="grid grid-cols-1 gap-4">
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-white/10">
                <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 uppercase tracking-widest text-sm">No bookings yet</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <motion.div
                  layout
                  key={booking.id}
                  className="bg-zinc-900 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500' : 
                      booking.status === 'rescheduled' ? 'bg-blue-500/20 text-blue-400' :
                      booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 
                      booking.rescheduleAccepted ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' :
                      'bg-amber-500/20 text-amber-500'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{booking.userName}</h3>
                      <p className="text-white/40 text-sm mb-2">{booking.userEmail}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-500">
                          {booking.serviceName}
                        </span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60">
                          {booking.date} @ {booking.time}
                        </span>
                        {booking.status === 'rescheduled' && (
                          <span className="px-3 py-1 bg-blue-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                            Reschedule Sent
                          </span>
                        )}
                        {booking.status === 'pending' && booking.rescheduleAccepted && (
                          <span className="px-3 py-1 bg-emerald-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">
                            User Accepted Reschedule
                          </span>
                        )}
                        {booking.status === 'pending' && booking.rescheduleDeclined && (
                          <span className="px-3 py-1 bg-red-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500">
                            User Declined Reschedule
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {booking.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed', booking)}
                          className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all group"
                          title="Accept & Notify Client"
                        >
                          <CheckCircle className="w-5 h-5 group-active:scale-90 transition-transform" />
                        </button>
                        <button
                          onClick={() => setRescheduleModal({ isOpen: true, booking })}
                          className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-black transition-all group"
                          title="Reschedule"
                        >
                          <Clock className="w-5 h-5 group-active:scale-90 transition-transform" />
                        </button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all group"
                        title="Mark as Done"
                      >
                        <CheckCircle className="w-5 h-5 group-active:scale-90 transition-transform" />
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-black transition-all group"
                        title="Cancel"
                      >
                        <X className="w-5 h-5 group-active:scale-90 transition-transform" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteItem(booking.id, 'bookings')}
                      className="p-3 bg-white/5 text-white/40 rounded-xl hover:bg-red-500 hover:text-white transition-all group"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-5 h-5 group-active:scale-90 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : activeTab === 'messages' ? (
          <div className="grid grid-cols-1 gap-4">
            {messages.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-white/10">
                <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 uppercase tracking-widest text-sm">No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  layout
                  key={msg.id}
                  className={`bg-zinc-900 p-6 rounded-2xl border transition-all ${
                    msg.status === 'new' ? 'border-amber-500/30' : 'border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-amber-500">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold">{msg.name}</h3>
                        <p className="text-white/40 text-xs">{msg.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {msg.status === 'new' && (
                        <button
                          onClick={() => updateMessageStatus(msg.id, 'read')}
                          className="px-3 py-1 bg-amber-500 text-black text-[10px] font-bold rounded-lg uppercase tracking-widest"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(msg.id, 'contacts')}
                        className="p-2 bg-white/5 text-white/40 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl">
                    <h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">{msg.subject || 'No Subject'}</h4>
                    <p className="text-white/70 text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">
                      Received: {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), 'PPP p') : 'Just now'}
                    </span>
                    <a 
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="text-amber-500 text-xs font-bold uppercase tracking-widest hover:underline"
                    >
                      Reply via Email
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <AdminUsers />
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 w-full max-w-md rounded-3xl border border-white/10 p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Reschedule <span className="text-amber-500">Appointment</span></h2>
              <button onClick={() => setRescheduleModal({ isOpen: false, booking: null })} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Suggested Date</label>
                <input 
                  type="date" 
                  value={suggestedDate}
                  onChange={(e) => setSuggestedDate(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Suggested Time</label>
                <input 
                  type="time" 
                  value={suggestedTime}
                  onChange={(e) => setSuggestedTime(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Message to Client</label>
                <textarea 
                  value={rescheduleMessage}
                  onChange={(e) => setRescheduleMessage(e.target.value)}
                  placeholder="Explain why you need to reschedule..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all h-32 resize-none"
                />
              </div>

              <button 
                onClick={handleRescheduleSubmit}
                disabled={isRescheduling || rescheduleSuccess}
                className={`w-full py-4 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                  rescheduleSuccess 
                    ? 'bg-emerald-500 text-black' 
                    : 'bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50'
                }`}
              >
                {rescheduleSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Success! Closing in 5s...
                  </>
                ) : isRescheduling ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reschedule Email'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
