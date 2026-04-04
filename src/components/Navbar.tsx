import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Menu, X, User, LogOut, Calendar, MessageCircle, Sparkles, LogIn, Bell } from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { cn } from '../lib/utils';
import AuthModal from './AuthModal';

interface NavbarProps {
  onOpenGallery: () => void;
  onOpenBooking: () => void;
  onOpenContact: () => void;
  onOpenHistory: () => void;
  onToggleAdmin: () => void;
  isAdminView: boolean;
  isAdmin: boolean;
  user: FirebaseUser | null;
  onOpenAuth: (mode: 'login' | 'register', adminOnly?: boolean) => void;
}

interface NavLink {
  name: string;
  href?: string;
  action?: () => void;
  hideOnAdmin?: boolean;
  alwaysShow?: boolean;
  showIfAdmin?: boolean;
  hideOnDesktop?: boolean;
}

const ADMIN_EMAIL = 'osiamijnr@gmail.com';
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export default function Navbar({ onOpenGallery, onOpenBooking, onOpenContact, onOpenHistory, onToggleAdmin, isAdminView, isAdmin, user, onOpenAuth }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [lastSeenCount, setLastSeenCount] = useState(() => {
    return parseInt(localStorage.getItem('admin_last_seen_count') || '0');
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Use refs for initial load flags to ensure they persist across effect re-runs
  const initialBookingsReceived = React.useRef(false);
  const initialMessagesReceived = React.useRef(false);
  const initialUserReceived = React.useRef(false);

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND);
  }, []);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      initialBookingsReceived.current = false;
      initialMessagesReceived.current = false;
      initialUserReceived.current = false;
      return;
    }

    const unsubscribes: (() => void)[] = [];
    let isInitialBookings = true;
    let isInitialMessages = true;
    let isInitialUser = true;

    if (isAdmin) {
      // Admin listens for new bookings and messages
      const bookingsQuery = query(collection(db, 'bookings'), where('status', '==', 'pending'));
      const messagesQuery = query(collection(db, 'contacts'), where('status', '==', 'new'));

      const unsubBookings = onSnapshot(bookingsQuery, (snapshot) => {
        const count = snapshot.size;
        
        if (isInitialBookings || !initialBookingsReceived.current) {
          setTotalPending(prev => prev + count);
          isInitialBookings = false;
          initialBookingsReceived.current = true;
          return;
        }

        const added = snapshot.docChanges().filter(change => change.type === 'added');
        if (added.length > 0) {
          // Play sound on all devices where the admin is logged in
          audioRef.current?.play().catch(e => console.log('Audio play failed:', e));
          setTotalPending(prev => prev + added.length);
          setToastMessage('New booking request received!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        }
        
        // If items were removed (confirmed/cancelled), update totalPending
        const removed = snapshot.docChanges().filter(change => change.type === 'removed');
        if (removed.length > 0) {
          setTotalPending(prev => Math.max(0, prev - removed.length));
        }
      });

      const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
        const count = snapshot.size;

        if (isInitialMessages || !initialMessagesReceived.current) {
          setTotalPending(prev => prev + count);
          isInitialMessages = false;
          initialMessagesReceived.current = true;
          return;
        }

        const added = snapshot.docChanges().filter(change => change.type === 'added');
        if (added.length > 0) {
          // Play sound on all devices where the admin is logged in
          audioRef.current?.play().catch(e => console.log('Audio play failed:', e));
          setTotalPending(prev => prev + added.length);
          setToastMessage('New contact message received!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        }

        // If items were removed (marked read), update totalPending
        const removed = snapshot.docChanges().filter(change => change.type === 'removed');
        if (removed.length > 0) {
          setTotalPending(prev => Math.max(0, prev - removed.length));
        }
      });

      unsubscribes.push(unsubBookings, unsubMessages);
    } else {
      // User listens for status changes in their bookings
      const userBookingsQuery = query(collection(db, 'bookings'), where('userId', '==', user.uid));
      
      const unsubUser = onSnapshot(userBookingsQuery, (snapshot) => {
        if (isInitialUser || !initialUserReceived.current) {
          isInitialUser = false;
          initialUserReceived.current = true;
          return;
        }

        const modified = snapshot.docChanges().filter(change => 
          change.type === 'modified' && 
          ['confirmed', 'rescheduled'].includes(change.doc.data().status)
        );
        
        if (modified.length > 0) {
          audioRef.current?.play().catch(e => console.log('Audio play failed:', e));
          setUnreadCount(prev => prev + modified.length);
          setToastMessage('Appointment status updated! Check your email.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        }
      });
      unsubscribes.push(unsubUser);
    }

    return () => unsubscribes.forEach(unsub => unsub());
  }, [user, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      const count = Math.max(0, totalPending - lastSeenCount);
      setUnreadCount(count);
    }
  }, [totalPending, lastSeenCount, isAdmin]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLoginClick = () => {
    onOpenAuth('login', false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks: NavLink[] = [
    { name: 'Home', href: '#home', hideOnAdmin: true },
    { name: 'Services', href: '#services', hideOnAdmin: true },
    { name: 'Gallery', action: onOpenGallery, hideOnAdmin: true },
    { name: 'About', href: '#about', hideOnAdmin: true },
    { name: 'Contact', action: onOpenContact, hideOnAdmin: true },
    {
      name: 'My Appointments', 
      action: () => {
        if (!user) {
          onOpenAuth('login', false);
          return;
        }
        onOpenHistory();
      },
      hideOnAdmin: true
    },
    {
      name: isAdminView ? 'Back to Site' : 'Admin Panel',
      action: () => {
        if (!isAdmin) {
          onOpenAuth('login', true);
          return;
        }
        onToggleAdmin();
      },
      alwaysShow: true
    },
    { name: 'WhatsApp', action: () => window.open('https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Salon%20%26%20SPA!%20I%27d%20like%20to%20make%20an%20inquiry.', '_blank'), hideOnAdmin: true, hideOnDesktop: true },
  ];

  const filteredLinks = navLinks.filter(link => {
    if (isAdminView) {
      return !!link.alwaysShow || !!link.showIfAdmin;
    }
    if (link.alwaysShow) return true;
    if (link.showIfAdmin) return isAdmin;
    return true;
  });

  const desktopLinks = filteredLinks.filter(link => !link.hideOnDesktop);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center overflow-hidden group-hover:rotate-12 transition-transform">
              <Scissors className="w-6 h-6 text-black absolute z-0" />
              <img 
                src="https://ais-pre-htn43e6zff3d6tqo54gu7b-182291592896.europe-west2.run.app/api/attachments/67e26880-9941-4712-98e3-086574f884a4" 
                alt="Logo" 
                className="w-full h-full object-cover mix-blend-multiply relative z-10"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="font-arcade text-[10px] sm:text-xs md:text-sm lg:text-lg text-amber-500 leading-none uppercase tracking-tighter">
            best salon services & creative hub
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {desktopLinks.map((link) => (
            link.action ? (
              <button
                key={link.name}
                onClick={link.action}
                className="text-sm font-medium text-white/70 hover:text-amber-500 transition-colors uppercase tracking-widest cursor-pointer"
              >
                {link.name}
              </button>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-amber-500 transition-colors uppercase tracking-widest"
              >
                {link.name}
              </a>
            )
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="relative group/notif">
                <button 
                  onClick={() => {
                    if (isAdmin) {
                      setLastSeenCount(totalPending);
                      localStorage.setItem('admin_last_seen_count', totalPending.toString());
                      if (!isAdminView) onToggleAdmin();
                    } else {
                      setUnreadCount(0);
                      onOpenHistory();
                    }
                  }}
                  className="p-2 text-white/70 hover:text-amber-500 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 animate-in zoom-in duration-300">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              {!isAdminView && (
                <button
                  onClick={onOpenBooking}
                  className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold rounded-lg hover:bg-amber-500 hover:text-black transition-all uppercase tracking-widest"
                >
                  Book Me
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-red-400 transition-colors uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <div className="relative group/user">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=f59e0b&color=000`}
                  alt={user.displayName || ''}
                  className="w-8 h-8 rounded-full border border-amber-500"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handleLoginClick}
                className="text-sm font-medium text-white/70 hover:text-amber-500 transition-colors uppercase tracking-widest"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register', false)}
                className="px-6 py-2 bg-amber-500 text-black text-sm font-bold rounded-full hover:bg-amber-400 transition-colors uppercase tracking-widest"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 lg:hidden flex flex-col gap-4 shadow-2xl"
          >
            {filteredLinks.map((link) => (
              link.action ? (
                <button
                  key={link.name}
                  onClick={() => {
                    link.action?.();
                    setIsOpen(false);
                  }}
                  className="text-left text-sm font-bold text-white/70 hover:text-amber-500 transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-bold text-white/70 hover:text-amber-500 transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </a>
              )
            ))}
            
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=f59e0b&color=000`}
                      alt={user.displayName || ''}
                      className="w-8 h-8 rounded-full border border-amber-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white truncate max-w-[120px]">{user.displayName}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => {
                          if (isAdmin) {
                            setLastSeenCount(totalPending);
                            localStorage.setItem('admin_last_seen_count', totalPending.toString());
                            if (!isAdminView) onToggleAdmin();
                          } else {
                            setUnreadCount(0);
                            onOpenHistory();
                          }
                          setIsOpen(false);
                        }}
                        className="p-2 text-white/70 hover:text-amber-500 transition-colors relative"
                      >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>
                    {!isAdminView && (
                      <button
                        onClick={() => {
                          onOpenBooking();
                          setIsOpen(false);
                        }}
                        className="px-3 py-2 bg-amber-500 text-black text-[10px] font-black rounded-lg hover:bg-amber-400 transition-colors uppercase tracking-widest flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        Book
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      handleLoginClick();
                      setIsOpen(false);
                    }}
                    className="py-3 bg-white/5 text-white text-xs font-black rounded-xl hover:bg-white/10 transition-colors uppercase tracking-widest border border-white/10"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('register', false);
                      setIsOpen(false);
                    }}
                    className="py-3 bg-amber-500 text-black text-xs font-black rounded-xl hover:bg-amber-400 transition-colors uppercase tracking-widest shadow-lg shadow-amber-500/20"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[60] px-6 py-3 bg-amber-500 text-black font-black rounded-2xl shadow-2xl flex items-center gap-3 uppercase tracking-widest text-[10px] border border-black/10"
          >
            <Bell className="w-4 h-4" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
