import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA5e7ZJudLtcfQLMUsTKpPlB3D4S1MLwAo",
  authDomain: "suvida-ai-8c6aa.firebaseapp.com",
  projectId: "suvida-ai-8c6aa",
  storageBucket: "suvida-ai-8c6aa.firebasestorage.app",
  messagingSenderId: "47818812340",
  appId: "1:47818812340:web:b565a04937b18a43dd60e1",
  measurementId: "G-K0KG4BXQY6",
};

// Prevent multiple initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export default app;

