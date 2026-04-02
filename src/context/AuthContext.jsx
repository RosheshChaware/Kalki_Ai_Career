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

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const signIn = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      throw Object.assign(new Error('email-not-verified'), { code: 'auth/email-not-verified' });
    }
    return cred;
  };

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

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
