'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  MessageCircle,
  Sparkles,
  LogIn,
  Bell,
  ChevronDown,
  Palette,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useHub } from '../context/HubContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { cn } from '../lib/utils';

const businesses = [
  {
    name: 'Best Salon',
    description: 'Luxury grooming, haircuts, beard sculpting & spa wellness',
    href: '/salon',
    icon: Scissors,
    accent: 'from-amber-500/20 to-amber-500/5 text-amber-400',
  },
  {
    name: 'Best Signs & Craft',
    description: '3D illuminated letters, LED lightboxes, pylon signs & craft branding',
    href: '/signage',
    icon: Layers,
    accent: 'from-sky-500/20 to-sky-500/5 text-sky-400',
  },
  {
    name: 'Best Art',
    description: 'Bespoke portraits, modern fine art canvases & wall murals',
    href: '/art',
    icon: Palette,
    accent: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
  },
];

interface NavbarProps {
  onOpenGallery?: () => void;
  onOpenBooking?: () => void;
  onOpenContact?: () => void;
  onOpenHistory?: () => void;
  onToggleAdmin?: () => void;
  isAdminView?: boolean;
  isAdmin?: boolean;
  user?: any;
  onOpenAuth?: (mode: 'login' | 'register', adminOnly?: boolean) => void;
}

export default function Navbar(props: NavbarProps = {}) {
  const pathname = usePathname();
  const hub = useHub();

  const user = props.user !== undefined ? props.user : hub.user;
  const isAdmin = props.isAdmin !== undefined ? props.isAdmin : hub.isAdmin;
  const isAdminView = props.isAdminView !== undefined ? props.isAdminView : hub.isAdminView;
  const unreadCount = hub.unreadCount;
  const totalPending = hub.totalPending;

  const openBooking = props.onOpenBooking || hub.openBooking;
  const openAuth = props.onOpenAuth || hub.openAuth;
  const openHistory = props.onOpenHistory || hub.openHistory;
  const toggleAdminView = props.onToggleAdmin || hub.toggleAdminView;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBusinessesOpen, setIsBusinessesOpen] = useState(false);
  const [isMobileBusinessesOpen, setIsMobileBusinessesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsBusinessesOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBusinessesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Training', href: '/training' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0A192F]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-[#0A192F] via-[#0A192F]/80 to-transparent py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg group-hover:scale-105 transition-transform">
                B
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-arcade text-sm sm:text-base tracking-wider text-amber-500 uppercase leading-none group-hover:text-amber-400 transition-colors">
                BEST CREATIVE HUB
              </span>
              <span className="text-[9px] tracking-widest uppercase text-white/50 font-semibold mt-0.5">
                Salon &bull; Signage &bull; Art
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className={cn(
                'px-3 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-colors',
                pathname === '/'
                  ? 'text-amber-500 bg-white/5'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              )}
            >
              Home
            </Link>

            {/* Our Businesses Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsBusinessesOpen(!isBusinessesOpen)}
                onMouseEnter={() => setIsBusinessesOpen(true)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer',
                  ['/salon', '/signage', '/art'].includes(pathname)
                    ? 'text-amber-500 bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <span>Our Businesses</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    isBusinessesOpen ? 'rotate-180 text-amber-500' : 'text-white/50'
                  )}
                />
              </button>

              <AnimatePresence>
                {isBusinessesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    onMouseLeave={() => setIsBusinessesOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 bg-[#0A192F] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                        Specialized Hub Subsidiaries
                      </p>
                    </div>
                    {businesses.map((biz) => {
                      const Icon = biz.icon;
                      const isActive = pathname === biz.href;
                      return (
                        <Link
                          key={biz.href}
                          href={biz.href}
                          onClick={() => setIsBusinessesOpen(false)}
                          className={cn(
                            'flex items-start gap-3 p-3 rounded-xl transition-all group/item',
                            isActive
                              ? 'bg-amber-500/10 border border-amber-500/30'
                              : 'hover:bg-white/5 border border-transparent'
                          )}
                        >
                          <div
                            className={cn(
                              'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br transition-all group-hover/item:scale-105',
                              biz.accent
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  'text-xs font-bold uppercase tracking-wider',
                                  isActive ? 'text-amber-500' : 'text-white group-hover/item:text-amber-400'
                                )}
                              >
                                {biz.name}
                              </span>
                              <ArrowRight className="w-3 h-3 text-white/30 group-hover/item:text-amber-500 group-hover/item:translate-x-0.5 transition-all" />
                            </div>
                            <p className="text-[11px] text-white/50 leading-snug mt-0.5">
                              {biz.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-colors',
                  pathname === link.href
                    ? 'text-amber-500 bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Admin Switch */}
            {isAdmin && (
              <button
                onClick={toggleAdminView}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer',
                  isAdminView
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-amber-500 border border-amber-500/30'
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAdminView ? 'Exit Admin' : 'Admin'}</span>
                {unreadCount > 0 && !isAdminView && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
            )}

            {/* Book Salon CTA */}
            <button
              onClick={openBooking}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Salon</span>
            </button>

            {/* Auth / Profile */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
                >
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.displayName || 'User'
                      )}&background=f59e0b&color=000`
                    }
                    alt="User Avatar"
                    className="w-7 h-7 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold text-white max-w-[90px] truncate">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-white/50" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute right-0 mt-2 w-56 bg-[#0A192F] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50"
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-xs font-bold text-white truncate">
                          {user.displayName || 'Valued Client'}
                        </p>
                        <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openHistory();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>My Appointments</span>
                      </button>

                      <a
                        href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20make%20an%20inquiry."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Hub</span>
                      </a>

                      <div className="my-1 border-t border-white/5" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => openAuth('login', false)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-widest font-bold text-white/80 hover:text-white hover:bg-white/5 rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-500" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAdmin && (
              <button
                onClick={toggleAdminView}
                className={cn(
                  'p-2 rounded-xl text-xs font-bold transition-all',
                  isAdminView ? 'bg-amber-500 text-black' : 'bg-white/10 text-amber-500'
                )}
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-amber-500 bg-white/5 border border-white/10 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A192F] border-b border-white/10 px-6 py-6 overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider',
                  pathname === '/' ? 'bg-amber-500/10 text-amber-500' : 'text-white hover:bg-white/5'
                )}
              >
                Home
              </Link>

              {/* Mobile "Our Businesses" Accordion */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setIsMobileBusinessesOpen(!isMobileBusinessesOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider text-amber-400"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Our Businesses
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isMobileBusinessesOpen ? 'rotate-180' : ''
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isMobileBusinessesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-2 pb-3 space-y-1 border-t border-white/5"
                    >
                      {businesses.map((biz) => {
                        const Icon = biz.icon;
                        const isActive = pathname === biz.href;
                        return (
                          <Link
                            key={biz.href}
                            href={biz.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg transition-colors',
                              isActive
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'text-white/80 hover:bg-white/5'
                            )}
                          >
                            <div className={cn('p-2 rounded-lg bg-white/5', biz.accent)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide">{biz.name}</p>
                              <p className="text-[10px] text-white/50">{biz.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider',
                    pathname === link.href
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'text-white hover:bg-white/5'
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {user && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openHistory();
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white hover:bg-white/5 flex items-center justify-between"
                >
                  <span>My Appointments</span>
                  <Calendar className="w-4 h-4 text-amber-500" />
                </button>
              )}

              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openBooking();
                  }}
                  className="w-full py-3.5 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Salon Appointment
                </button>

                <a
                  href="https://api.whatsapp.com/send?phone=2348068059823&text=Hi%20Best%20Creative%20Hub!%20I'd%20like%20to%20make%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out ({user.displayName?.split(' ')[0] || user.email})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuth('login', false);
                    }}
                    className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-amber-500" />
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
