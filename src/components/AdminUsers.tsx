import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, onSnapshot, setDoc, doc, deleteDoc, serverTimestamp, getDocs, updateDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { Mail, Shield, Trash2, Plus, UserPlus, AlertCircle, CheckCircle2, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

interface AuthorizedAdmin {
  email: string;
  addedBy: string;
  createdAt: any;
}

interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  role: 'client' | 'admin';
  phoneNumber?: string;
}

export default function AdminUsers() {
  const [authorizedAdmins, setAuthorizedAdmins] = useState<AuthorizedAdmin[]>([]);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Listen for Authorized Admins - Sort by createdAt to identify super admins
    const qAdmins = query(collection(db, 'authorized_admins'), orderBy('createdAt', 'asc'));
    const unsubscribeAdmins = onSnapshot(qAdmins, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as AuthorizedAdmin);
      setAuthorizedAdmins(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'authorized_admins');
    });

    // Listen for App Users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as AppUser);
      setAppUsers(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    return () => {
      unsubscribeAdmins();
      unsubscribeUsers();
    };
  }, []);

  const handleAddAuthorizedAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const email = newAdminEmail.toLowerCase().trim();
      await setDoc(doc(db, 'authorized_admins', email), {
        email,
        addedBy: auth.currentUser?.email || 'System',
        createdAt: serverTimestamp()
      });

      // Also check if user already exists and update their role
      const existingUser = appUsers.find(u => u.email.toLowerCase() === email);
      if (existingUser) {
        await updateDoc(doc(db, 'users', existingUser.uid), {
          role: 'admin'
        });
      }

      setNewAdminEmail('');
      setMessage({ type: 'success', text: `${email} has been authorized as an admin.` });
    } catch (error) {
      console.error('Error adding admin:', error);
      setMessage({ type: 'error', text: 'Failed to add admin. Please check your permissions.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    const currentUserEmail = auth.currentUser?.email?.toLowerCase();
    const primaryAdmin = 'osiamijnr@gmail.com';
    
    // Identify super admins (first two added)
    const superAdmins = authorizedAdmins
      .slice(0, 2)
      .map(a => a.email.toLowerCase());

    if (email === primaryAdmin) {
      toast.error('The primary admin cannot be removed.');
      return;
    }

    // Only super admins can delete others
    if (!currentUserEmail || !superAdmins.includes(currentUserEmail)) {
      toast.error('Only the primary admin and the second designated admin have permission to remove other admins.');
      return;
    }

    toast(`Are you sure you want to remove ${email}?`, {
      action: {
        label: 'Remove',
        onClick: async () => {
          setActionLoading(true);
          try {
            await deleteDoc(doc(db, 'authorized_admins', email));
            
            // Also update user role if they exist
            const existingUser = appUsers.find(u => u.email.toLowerCase() === email);
            if (existingUser) {
              await updateDoc(doc(db, 'users', existingUser.uid), {
                role: 'client'
              });
            }
            
            toast.success(`${email} has been removed from admin list.`);
          } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `authorized_admins/${email}`);
          } finally {
            setActionLoading(false);
          }
        }
      }
    });
  };

  const promoteToAdmin = async (user: AppUser) => {
    if (!window.confirm(`Promote ${user.displayName} to Admin?`)) return;

    setActionLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: 'admin'
      });
      // Also add to authorized_admins for persistence across re-registration
      await setDoc(doc(db, 'authorized_admins', user.email.toLowerCase()), {
        email: user.email.toLowerCase(),
        addedBy: auth.currentUser?.email || 'System',
        createdAt: serverTimestamp()
      });
      setMessage({ type: 'success', text: `${user.displayName} is now an admin.` });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Add New Admin Form */}
      <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Authorize New Admin</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Add an email to grant admin access</p>
          </div>
        </div>

        <form onSubmit={handleAddAuthorizedAdmin} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              required
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={actionLoading}
            className="px-8 py-4 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Authorize
          </button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest ${
                message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Authorized Admins List */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 px-2">Authorized Admins</h3>
        <div className="grid grid-cols-1 gap-4">
          {authorizedAdmins.map((admin) => (
            <div key={admin.email} className="bg-zinc-900 p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{admin.email}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Added by: {admin.addedBy}</p>
                </div>
              </div>
              {admin.email !== 'osiamijnr@gmail.com' && 
               authorizedAdmins.slice(0, 2).some(sa => sa.email.toLowerCase() === auth.currentUser?.email?.toLowerCase()) && (
                <button
                  onClick={() => handleRemoveAdmin(admin.email)}
                  className="p-3 bg-white/5 text-white/40 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* App Users List (Potential Admins) */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 px-2">Registered Users</h3>
        <div className="grid grid-cols-1 gap-4">
          {appUsers.filter(u => u.role !== 'admin').map((user) => (
            <div key={user.uid} className="bg-zinc-900 p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{user.displayName}</h4>
                  <p className="text-xs text-white/40">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => promoteToAdmin(user)}
                className="px-4 py-2 bg-white/5 text-white/60 text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
              >
                Promote to Admin
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
