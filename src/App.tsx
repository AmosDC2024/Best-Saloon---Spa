import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Scissors, Star, ShieldCheck, Users, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Booking from './components/Booking';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import AdminDashboard from './components/AdminDashboard';
import AppointmentHistory from './components/AppointmentHistory';
import AuthModal from './components/AuthModal';
import { auth } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const ADMIN_EMAIL = 'osiamijnr@gmail.com';

function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-full overflow-y-auto bg-zinc-950 rounded-3xl border border-white/10 shadow-2xl scrollbar-hide"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
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

function App() {
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if user is admin
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const adminDoc = await getDoc(doc(db, 'authorized_admins', user.email?.toLowerCase() || ''));
        
        const isHardcodedAdmin = user.email === ADMIN_EMAIL;
        const isRoleAdmin = userDoc.exists() && userDoc.data().role === 'admin';
        const isAuthorizedAdmin = adminDoc.exists();

        setIsAdmin(isHardcodedAdmin || isRoleAdmin || isAuthorizedAdmin);
      } else {
        setIsAdmin(false);
        setIsAdminView(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtn(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-amber-500 selection:text-black">
      <Navbar 
        onOpenGallery={() => setIsGalleryOpen(true)} 
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onToggleAdmin={() => {
          setIsAdminView(!isAdminView);
        }}
        isAdminView={isAdminView}
        isAdmin={isAdmin}
        user={user}
        onOpenAuth={(mode, adminOnly) => {
          setAuthMode(mode);
          setIsAdminAuth(adminOnly || false);
          setIsAuthModalOpen(true);
        }}
      />
      
      <main>
        {isAdminView && isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero 
              onOpenBooking={() => setIsBookingOpen(true)} 
              onOpenContact={() => setIsContactOpen(true)}
            />
            
            {/* Features Section */}
            <section className="section-padding bg-zinc-950 border-y border-white/5">
              <div className="container-max">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                  {[
                    { icon: Star, label: 'Premium Quality', desc: 'Expert barbers' },
                    { icon: ShieldCheck, label: 'Hygienic', desc: 'Sterilized tools' },
                    { icon: Users, label: 'Experienced', desc: '10+ years' },
                    { icon: Scissors, label: 'Modern Styles', desc: 'Latest trends' },
                  ].map((feature, i) => (
                    <div key={i} className="text-center group">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                        <feature.icon className="w-6 h-6 text-amber-500 group-hover:text-black" />
                      </div>
                      <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">{feature.label}</h4>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <Services onOpenBooking={() => setIsBookingOpen(true)} />
            
            {/* About Section */}
            <section id="about" className="section-padding bg-zinc-950 overflow-hidden">
              <div className="container-max">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1000"
                        alt="Barber Shop Vibe"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-8 -right-8 p-8 bg-amber-500 rounded-3xl hidden md:block">
                      <span className="text-4xl font-black text-black">10+</span>
                      <p className="text-black font-bold uppercase tracking-widest text-[10px]">Years of Excellence</p>
                    </div>
                  </motion.div>
                  
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8"
                    >
                      More Than Just A <span className="text-amber-500">Salon</span>
                    </motion.h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-8">
                      At Best Salon & SPA, we believe that grooming and relaxation are essential parts of a modern lifestyle. Our space is designed to be a sanctuary where you can relax, recharge, and leave feeling like your best self.
                    </p>
                    <div className="space-y-6">
                      {[
                        'Master barbers and spa therapists',
                        'Premium grooming and wellness products',
                        'Complimentary drinks and luxury atmosphere',
                        'The best salon & spa experience in the city'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-500 transition-colors">
                            <CheckCircleIcon className="w-3 h-3 text-amber-500 group-hover:text-black" />
                          </div>
                          <span className="text-white/80 font-medium uppercase tracking-widest text-xs">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Testimonials />
          </>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <Modal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)}>
        <Gallery />
      </Modal>

      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}>
        <Booking onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAdminAuth(false);
          setIsAuthModalOpen(true);
        }} />
      </Modal>

      <Modal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)}>
        <Contact />
      </Modal>

      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)}>
        <AppointmentHistory />
      </Modal>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
        adminOnly={isAdminAuth}
      />

      {/* Floating Action Button for Mobile */}
      <AnimatePresence>
        {showFloatingBtn && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 left-0 right-0 z-40 px-6 md:hidden"
          >
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              Book Me
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default App;

