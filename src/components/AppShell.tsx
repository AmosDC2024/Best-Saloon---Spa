'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { Toaster } from 'sonner';
import { HubProvider, useHub } from '../context/HubContext';
import Navbar from './Navbar';
import Footer from './Footer';
import Booking from './Booking';
import AuthModal from './AuthModal';
import AppointmentHistory from './AppointmentHistory';
import AdminDashboard from './AdminDashboard';

function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#0A192F] rounded-3xl border border-white/10 shadow-2xl scrollbar-hide"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function HubContent({ children }: { children: React.ReactNode }) {
  const {
    isAdmin,
    isAdminView,
    isBookingOpen,
    setIsBookingOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    isAdminAuth,
    isHistoryOpen,
    setIsHistoryOpen,
    openAuth,
    openBooking,
  } = useHub();

  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtn(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-sans selection:bg-amber-500 selection:text-black flex flex-col">
      <Toaster position="top-center" richColors />
      <Navbar />

      <main className="flex-1">
        {isAdminView && isAdmin ? (
          <div className="pt-20">
            <AdminDashboard />
          </div>
        ) : (
          children
        )}
      </main>

      <Footer />

      {/* Global Booking Modal */}
      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}>
        <Booking onOpenAuth={(mode) => openAuth(mode, false)} />
      </Modal>

      {/* Global Appointment History Modal */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)}>
        <AppointmentHistory />
      </Modal>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        adminOnly={isAdminAuth}
      />

      {/* Floating Action Button for Mobile Quick Booking */}
      <AnimatePresence>
        {showFloatingBtn && !isBookingOpen && !isAdminView && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-0 right-0 z-40 px-6 sm:hidden pointer-events-none"
          >
            <button
              onClick={openBooking}
              className="pointer-events-auto w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs cursor-pointer active:scale-98 transition-transform"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Salon Appointment</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <HubProvider>
      <HubContent>{children}</HubContent>
    </HubProvider>
  );
}
