import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Check if a user document exists in Firestore.
 * @param {string} uid - Firebase Auth user ID
 * @returns {Promise<boolean>}
 */
export async function checkUserExists(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists();
  } catch (err) {
    console.error('[Firestore] checkUserExists error:', err.message);
    return false;
  }
}

/**
 * Get user data from Firestore.
 * @param {string} uid - Firebase Auth user ID
 * @returns {Promise<object|null>}
 */
export async function getUserData(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.error('[Firestore] getUserData error:', err.message);
    return null;
  }
}

/**
 * Save all onboarding data to Firestore in ONE document: users/{uid}
 * This is called ONLY after onboarding Step 4 is complete.
 *
 * STRICT flat structure — every field is top-level, no nesting.
 *
 * @param {string} uid
 * @param {object} data - Clean, validated user data object
 */
export async function saveOnboardingData(uid, data) {
  try {
    // Validate: name must be a string, not inside an array
    const name = typeof data.name === 'string' ? data.name : '';
    const email = typeof data.email === 'string' ? data.email : '';
    const selectedClass = typeof data.class === 'string' ? data.class : '';
    const stream = typeof data.stream === 'string' ? data.stream : '';
    const goal = typeof data.goal === 'string' ? data.goal : '';

    // Validate: arrays must only contain their correct values
    const interests = Array.isArray(data.interests) ? data.interests.filter(v => typeof v === 'string') : [];
    const strongSubjects = Array.isArray(data.strongSubjects) ? data.strongSubjects.filter(v => typeof v === 'string') : [];
    const weakSubjects = Array.isArray(data.weakSubjects) ? data.weakSubjects.filter(v => typeof v === 'string') : [];
    const weakTopics = Array.isArray(data.weakTopics) ? data.weakTopics.filter(v => typeof v === 'string') : [];

    // Validate: scores must be array of {subject, score, correctQs, incorrectQs}
    const scores = Array.isArray(data.scores)
      ? data.scores.map(s => ({
          subject: typeof s.subject === 'string' ? s.subject : '',
          score: typeof s.score === 'number' ? s.score : Number(s.score) || 0,
          correctQs: typeof s.correctQs === 'number' ? s.correctQs : Number(s.correctQs) || 0,
          incorrectQs: typeof s.incorrectQs === 'number' ? s.incorrectQs : Number(s.incorrectQs) || 0,
        }))
      : [];

    // Build clean, flat top-level document — NO extra fields
    const userData = {
      name,
      email,
      class: selectedClass,
      stream,
      goal,
      interests,
      strongSubjects,
      weakSubjects,
      scores,
      weakTopics,
      updatedAt: serverTimestamp(),
    };

    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, userData, { merge: true });

    console.log('[Firestore] Onboarding data saved for user:', uid);
    return true;
  } catch (err) {
    console.error('[Firestore] saveOnboardingData error:', err.message);
    return false;
  }
}

/**
 * Update ONLY profile fields in Firestore.
 * Does NOT touch scores or weakTopics.
 *
 * @param {string} uid
 * @param {object} profileData
 */
export async function updateProfile(uid, profileData) {
  try {
    // Only include fields that were explicitly passed (not undefined)
    // This prevents overwriting scores, weakTopics etc.
    const fieldMap = {
      name: profileData.name,
      email: profileData.email,
      class: profileData.currentClass,
      stream: profileData.stream,
      goal: profileData.goal,
      interests: profileData.interests,
      strongSubjects: profileData.strongSubjects,
      weakSubjects: profileData.weakSubjects,
    };

    const updateData = {};
    for (const [key, value] of Object.entries(fieldMap)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    updateData.updatedAt = serverTimestamp();

    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, updateData, { merge: true });

    console.log('[Firestore] Profile updated for user:', uid);
    return true;
  } catch (err) {
    console.error('[Firestore] updateProfile error:', err.message);
    return false;
  }
}
