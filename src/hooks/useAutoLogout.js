import { useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Custom hook to automatically log out a user after a period of inactivity.
 * It tracks mouse movements, keystrokes, clicks, and scrolling.
 * It also seamlessly synchronizes the inactivity timeout across multiple browser tabs using localStorage.
 * 
 * @param {Object} user - The current logged-in user object from Firebase Auth.
 * @param {number} timeoutMinutes - Number of minutes of inactivity before automatic logout. Default is 15 minutes.
 */
export const useAutoLogout = (user, timeoutMinutes = 15) => {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const timeoutRef = useRef(null);

  useEffect(() => {
    // 1. Skip if no user is currently logged in
    if (!user) return;

    // 2. Clear state and trigger the logout
    const handleLogout = async () => {
      // Clear localStorage activity tracker to avoid looping
      localStorage.removeItem('lastActivity');
      
      // Optionally notify the user
      alert(`You have been inactive for over ${timeoutMinutes} minutes. You are being logged out for your security.`);
      
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error auto-logging out:', error);
      }
    };

    // 3. Reset the countdown timer
    const resetTimer = () => {
      // Clear any existing timeout to avoid multiple timeouts completing concurrently
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Update localStorage with current timestamp to notify other tabs
      localStorage.setItem('lastActivity', Date.now().toString());

      // Start a fresh timeout countdown
      timeoutRef.current = setTimeout(() => {
        handleLogout();
      }, timeoutMs);
    };

    // 4. Wrapper for DOM activity events
    const handleActivity = () => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10);
      const now = Date.now();
      
      // If inactivity limit already reached across any tab, trigger logout
      if (lastActivity && now - lastActivity > timeoutMs) {
        handleLogout();
        return;
      }

      // Throttle exact updates (limit to 1 save per second) to prevent performance lags
      if (!lastActivity || now - lastActivity > 1000) {
        resetTimer();
      }
    };

    // 5. Sync activity made by user across DIFFERENT open tabs
    const handleStorageChange = (e) => {
      if (e.key === 'lastActivity') {
        const lastActivity = parseInt(e.newValue || '0', 10);
        // If a tab reports very old activity context, logout here
        if (Date.now() - lastActivity > timeoutMs) {
          handleLogout();
        } else {
          // A different tab was active, so we refresh this tab's logic
          resetTimer();
        }
      }
    };

    // 6. Setup Initial state and attach event listeners
    resetTimer();

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    // Attach to window
    events.forEach(event => window.addEventListener(event, handleActivity));
    // Listen for storage events across tabs
    window.addEventListener('storage', handleStorageChange);

    // 7. Component Unmount / Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => window.removeEventListener(event, handleActivity));
      window.removeEventListener('storage', handleStorageChange);
    };

  }, [user, timeoutMs]); // Re-run effect only when relevant params change
};

export default useAutoLogout;
