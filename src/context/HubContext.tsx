'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const ADMIN_EMAIL = 'osiamijnr@gmail.com';
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

interface HubContextType {
  user: FirebaseUser | null;
  isAdmin: boolean;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (val: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  isAdminAuth: boolean;
  setIsAdminAuth: (val: boolean) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (val: boolean) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (val: boolean) => void;
  isGalleryModalOpen: boolean;
  setIsGalleryModalOpen: (val: boolean) => void;
  unreadCount: number;
  totalPending: number;
  openBooking: () => void;
  openAuth: (mode?: 'login' | 'register', adminOnly?: boolean) => void;
  openHistory: () => void;
  toggleAdminView: () => void;
}

const HubContext = createContext<HubContextType | undefined>(undefined);

export function HubProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [lastSeenCount, setLastSeenCount] = useState(0);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const initialBookingsReceived = React.useRef(false);
  const initialMessagesReceived = React.useRef(false);
  const initialUserReceived = React.useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin_last_seen_count');
      if (stored) {
        setLastSeenCount(parseInt(stored, 10));
      }
      audioRef.current = new Audio(NOTIFICATION_SOUND);
    }
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const adminDoc = await getDoc(doc(db, 'authorized_admins', currentUser.email?.toLowerCase() || ''));

          const isHardcodedAdmin = currentUser.email === ADMIN_EMAIL;
          const isRoleAdmin = userDoc.exists() && userDoc.data().role === 'admin';
          const isAuthorizedAdmin = adminDoc.exists();

          setIsAdmin(isHardcodedAdmin || isRoleAdmin || isAuthorizedAdmin);
        } catch (e) {
          console.error('Error verifying admin privileges:', e);
          setIsAdmin(currentUser.email === ADMIN_EMAIL);
        }
      } else {
        setIsAdmin(false);
        setIsAdminView(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time notifications for Admin & Clients
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
      const bookingsQuery = query(collection(db, 'bookings'), where('status', '==', 'pending'));
      const messagesQuery = query(collection(db, 'contacts'), where('status', '==', 'new'));

      const unsubBookings = onSnapshot(bookingsQuery, (snapshot) => {
        const count = snapshot.size;
        if (isInitialBookings || !initialBookingsReceived.current) {
          setTotalPending((prev) => prev + count);
          isInitialBookings = false;
          initialBookingsReceived.current = true;
          return;
        }

        const added = snapshot.docChanges().filter((change) => change.type === 'added');
        if (added.length > 0) {
          audioRef.current?.play().catch(() => {});
          setTotalPending((prev) => prev + added.length);
        }

        const removed = snapshot.docChanges().filter((change) => change.type === 'removed');
        if (removed.length > 0) {
          setTotalPending((prev) => Math.max(0, prev - removed.length));
        }
      });

      const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
        const count = snapshot.size;
        if (isInitialMessages || !initialMessagesReceived.current) {
          setTotalPending((prev) => prev + count);
          isInitialMessages = false;
          initialMessagesReceived.current = true;
          return;
        }

        const added = snapshot.docChanges().filter((change) => change.type === 'added');
        if (added.length > 0) {
          audioRef.current?.play().catch(() => {});
          setTotalPending((prev) => prev + added.length);
        }

        const removed = snapshot.docChanges().filter((change) => change.type === 'removed');
        if (removed.length > 0) {
          setTotalPending((prev) => Math.max(0, prev - removed.length));
        }
      });

      unsubscribes.push(unsubBookings, unsubMessages);
    } else {
      const userBookingsQuery = query(collection(db, 'bookings'), where('userId', '==', user.uid));
      const unsubUser = onSnapshot(userBookingsQuery, (snapshot) => {
        if (isInitialUser || !initialUserReceived.current) {
          isInitialUser = false;
          initialUserReceived.current = true;
          return;
        }

        const modified = snapshot
          .docChanges()
          .filter(
            (change) =>
              change.type === 'modified' &&
              ['confirmed', 'rescheduled'].includes(change.doc.data().status)
          );

        if (modified.length > 0) {
          audioRef.current?.play().catch(() => {});
          setUnreadCount((prev) => prev + modified.length);
        }
      });
      unsubscribes.push(unsubUser);
    }

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [user, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      const count = Math.max(0, totalPending - lastSeenCount);
      setUnreadCount(count);
    }
  }, [totalPending, lastSeenCount, isAdmin]);

  const openBooking = () => {
    setIsBookingOpen(true);
  };

  const openAuth = (mode: 'login' | 'register' = 'login', adminOnly = false) => {
    setAuthMode(mode);
    setIsAdminAuth(adminOnly);
    setIsAuthModalOpen(true);
  };

  const openHistory = () => {
    if (!user) {
      openAuth('login', false);
      return;
    }
    setIsHistoryOpen(true);
  };

  const toggleAdminView = () => {
    if (!isAdmin) {
      openAuth('login', true);
      return;
    }
    setIsAdminView(!isAdminView);
  };

  return (
    <HubContext.Provider
      value={{
        user,
        isAdmin,
        isAdminView,
        setIsAdminView,
        isBookingOpen,
        setIsBookingOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isAdminAuth,
        setIsAdminAuth,
        isHistoryOpen,
        setIsHistoryOpen,
        isContactModalOpen,
        setIsContactModalOpen,
        isGalleryModalOpen,
        setIsGalleryModalOpen,
        unreadCount,
        totalPending,
        openBooking,
        openAuth,
        openHistory,
        toggleAdminView,
      }}
    >
      {children}
    </HubContext.Provider>
  );
}

export function useHub() {
  const context = useContext(HubContext);
  if (!context) {
    throw new Error('useHub must be used within a HubProvider');
  }
  return context;
}
