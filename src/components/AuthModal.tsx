import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, ArrowRight, AlertCircle, Scissors, Sparkles, Eye, EyeOff } from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  adminOnly?: boolean;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', adminOnly = false }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync mode with initialMode when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccess(null);
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  const ADMIN_EMAIL = 'osiamijnr@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        if (!email) {
          throw new Error('Please enter your email address to receive a reset link.');
        }
        await sendPasswordResetEmail(auth, email);
        setSuccess('We\'ve sent a password reset link to your email. Please check your inbox (and spam folder).');
        setEmail('');
        return;
      }

      if (mode === 'register') {
        if (adminOnly) {
          throw new Error('This area is restricted to authorized staff only. Registration is disabled here.');
        }
        if (!firstName || !lastName || !phone) {
          throw new Error('Please fill in all the required fields to create your account.');
        }
        if (password.length < 6) {
          throw new Error('For your security, your password must be at least 6 characters long.');
        }

        let userCredential;
        try {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            // If email exists, try to sign in and then ensure firestore doc exists
            try {
              userCredential = await signInWithEmailAndPassword(auth, email, password);
            } catch (signInError: any) {
              // If sign in fails, it might be a wrong password, so we re-throw the original error
              // but with a clearer message
              throw new Error('This email address is already associated with an account. Try logging in instead.');
            }
          } else {
            throw error;
          }
        }

        const user = userCredential.user;
        const displayName = `${firstName} ${lastName}`;

        await updateProfile(user, {
          displayName
        });

        // Save user data to Firestore - Use setDoc with merge: true to ensure we don't overwrite if it exists,
        // but we ensure it DOES exist.
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName,
          lastName,
          displayName,
          email: email.toLowerCase(),
          phoneNumber: phone,
          role: 'client',
          createdAt: serverTimestamp()
        }, { merge: true });

        setSuccess(
          <span className="flex items-center gap-1">
            Account ready! Welcome to <span className="font-arcade text-amber-500 uppercase">best salon services & creative hub</span>.
          </span> as unknown as string
        );
        // Clear all fields
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhone('');
      } else {
        if (!email || !password) {
          throw new Error('Please provide both your email and password to log in.');
        }
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (adminOnly) {
          // Check if user is admin in Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const adminDoc = await getDoc(doc(db, 'authorized_admins', email));
          
          const isHardcodedAdmin = email === ADMIN_EMAIL;
          const isRoleAdmin = userDoc.exists() && userDoc.data().role === 'admin';
          const isAuthorizedAdmin = adminDoc.exists();

          if (!isHardcodedAdmin && !isRoleAdmin && !isAuthorizedAdmin) {
            await auth.signOut();
            throw new Error('Access Denied: You are not authorized to access the admin panel. Please log in with an administrator account.');
          }
        }
        setSuccess('Login successful! Redirecting...');
        // Clear all fields
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhone('');
      }
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      console.error('Auth error full object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      let message = 'Something went wrong. Please check your connection and try again.';
      
      const errorCode = err.code || (err.message?.includes('auth/') ? err.message.match(/auth\/[a-z-]+/)?.[0] : null);

      if (errorCode === 'auth/user-not-found') {
        message = 'We couldn\'t find an account with that email address. Please check the spelling or register for a new account.';
      } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential' || err.message?.includes('invalid-credential')) {
        message = 'The password you entered is incorrect. Please try again or reset your password.';
      } else if (errorCode === 'auth/email-already-in-use') {
        message = 'This email address is already associated with an account. Try logging in instead.';
      } else if (errorCode === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (errorCode === 'auth/weak-password') {
        message = 'Your password is too weak. Please use at least 6 characters.';
      } else if (errorCode === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please try again later for your security.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full h-full md:h-auto md:max-w-md bg-zinc-900 md:border md:border-white/10 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors z-30 bg-black/40 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 left-10 w-12 h-12 text-amber-500"
          >
            <Scissors className="w-full h-full" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 right-10 w-16 h-16 text-amber-500"
          >
            <Sparkles className="w-full h-full" />
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
          <div className="p-6 md:p-10 min-h-full flex flex-col justify-center">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2">
                {adminOnly 
                  ? 'Admin Login' 
                  : mode === 'login' 
                    ? 'Welcome Back' 
                    : mode === 'register'
                      ? 'Join Us'
                      : 'Reset Password'}
              </h2>
              <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold">
                {adminOnly 
                  ? 'Restricted Access: Authorized Staff Only' 
                  : mode === 'login' 
                    ? 'Sign in to access your appointment history and manage your bookings' 
                    : mode === 'register'
                      ? 'Create an account for a seamless experience'
                      : 'Enter your email to receive a reset link'}
              </p>
            </div>

            <div className="min-h-[40px]">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-[10px] font-bold uppercase tracking-widest mb-6"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-[10px] font-bold uppercase tracking-widest mb-6"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <AnimatePresence mode="popLayout">
                {mode === 'register' && !adminOnly && (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">First Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                          <input
                            required
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/10 focus:border-amber-500/50 outline-none transition-all"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                          <input
                            required
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/10 focus:border-amber-500/50 outline-none transition-all"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/10 focus:border-amber-500/50 outline-none transition-all"
                          placeholder="+234..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/10 focus:border-amber-500/50 outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[9px] font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-12 text-white text-sm placeholder:text-white/10 focus:border-amber-500/50 outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-black font-black py-4 rounded-xl hover:bg-amber-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Login Now' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {!adminOnly && (
              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <div className="inline-block px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    {mode === 'login' 
                      ? "Don't have an account?" 
                      : mode === 'register' 
                        ? "Already have an account?" 
                        : "Remembered your password?"}
                    <button
                      onClick={() => {
                        setMode(mode === 'register' ? 'login' : mode === 'login' ? 'register' : 'login');
                        setError(null);
                        setSuccess(null);
                      }}
                      className="ml-2 text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-4"
                    >
                      {mode === 'login' ? 'Register Here' : 'Login Here'}
                    </button>
                  </p>
                </div>
              </div>
            )}
            {adminOnly && mode === 'forgot' && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setMode('login')}
                  className="text-amber-500 hover:text-amber-400 text-[10px] font-bold uppercase tracking-widest transition-colors underline underline-offset-4"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
