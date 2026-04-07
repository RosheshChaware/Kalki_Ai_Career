import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useAutoLogout } from '../hooks/useAutoLogout';

const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-logout user after 15 minutes of inactivity across tabs
  useAutoLogout(user, 15);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign up — does NOT sign in the session until email is verified
  const signUp = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await sendEmailVerification(cred.user);
    // Sign out immediately so the user must verify before accessing the app
    await signOut(auth);
    return cred.user;
  };

  const sendLoginAlert = async (user) => {
    try {
      console.log('[Frontend] Initiating Login Alert for:', user.email);
      const response = await fetch(`${API_URL}/api/v1/auth/send-login-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          displayName: user.displayName || 'User',
          userAgent: navigator.userAgent
        })
      });
      
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `HTTP error status: ${response.status}`);
      }
      
      console.log('[Frontend] Login alert API call successful:', data);
    } catch (err) {
      console.error('[Frontend] Error sending login alert API call:', err.message);
    }
  };

  const signIn = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      throw Object.assign(new Error('email-not-verified'), { code: 'auth/email-not-verified' });
    }
    await sendLoginAlert(cred.user);
    return cred;
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await sendLoginAlert(cred.user);
    return cred;
  };

  const resendVerificationEmail = async (email, password) => {
    // Re-sign in temporarily to get the user object, then send email
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    await signOut(auth);
  };

  // Poll Firebase to check if user has clicked the verification link
  const checkEmailVerified = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await cred.user.reload();
    if (cred.user.emailVerified) {
      // Keep the user signed in
      setUser(cred.user);
      await sendLoginAlert(cred.user);
      return true;
    }
    await signOut(auth);
    return false;
  };

  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, resendVerificationEmail, checkEmailVerified, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
