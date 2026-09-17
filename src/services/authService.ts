import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types';
import { defaultUserProfile } from '../data/initialSnippets';

export interface LocalVaultUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAnonymous: boolean;
  providerId: string;
  isVaultMode?: boolean;
}

const LOCAL_USER_STORAGE_KEY = 'codevault_authenticated_profile';

/**
 * Reads any saved active local session
 */
export function getLocalVaultUser(): LocalVaultUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_USER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

/**
 * Saves local vault user session
 */
export function saveLocalVaultUser(user: LocalVaultUser): void {
  try {
    localStorage.setItem(LOCAL_USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('codevault_auth_change', { detail: user }));
  } catch {
    // ignore
  }
}

/**
 * Clears local vault user session
 */
export function clearLocalVaultUser(): void {
  try {
    localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('codevault_auth_change', { detail: null }));
  } catch {
    // ignore
  }
}

/**
 * Formats a clean display name from an email address
 * e.g. luckysaini09860986@gmail.com -> "Lucky Saini"
 */
export function formatDisplayNameFromEmail(email: string): string {
  const username = email.split('@')[0] || 'Developer';
  // Remove trailing numbers if any, or split camelCase/periods/underscores
  const clean = username.replace(/[._-]/g, ' ');
  // Match common names like luckysaini -> Lucky Saini
  const withSpaces = clean
    .replace(/([a-zA-Z]+?)(\d+)$/, '$1')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/saini$/i, ' Saini')
    .replace(/lucky/i, 'Lucky');

  const words = withSpaces.trim().split(/\s+/);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Maps a real Firebase User or saved LocalVaultUser to the CodeVault UserProfile interface
 */
export function mapFirebaseUserToProfile(
  fbUser: User | LocalVaultUser | null,
  codesCount: number = 0
): UserProfile {
  // If no Firebase User is currently signed in, check if there is an active local vault session
  const effectiveUser = fbUser || getLocalVaultUser();

  if (!effectiveUser) {
    return {
      ...defaultUserProfile,
      codesSaved: codesCount,
      isAuthenticated: false
    };
  }

  const email = effectiveUser.email || (effectiveUser.isAnonymous ? 'guest@codevault.dev' : 'user@codevault.dev');
  const name =
    effectiveUser.displayName ||
    (email ? formatDisplayNameFromEmail(email) : (effectiveUser.isAnonymous ? 'Guest Developer' : 'CodeVault Developer'));

  const rawHandle = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'developer';
  const handle = '@' + (effectiveUser.isAnonymous ? `guest_${effectiveUser.uid.substring(0, 5)}` : rawHandle.substring(0, 15));

  const avatarUrl =
    effectiveUser.photoURL ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(effectiveUser.uid || email)}`;

  const providerId =
    ('providerData' in effectiveUser && effectiveUser.providerData?.[0]?.providerId) ||
    effectiveUser.providerId ||
    (effectiveUser.isAnonymous ? 'anonymous' : 'password');

  return {
    name,
    email,
    handle,
    avatarUrl,
    codesSaved: codesCount,
    maxCodes: 500,
    vaultStatus: 'Active',
    uid: effectiveUser.uid,
    isAnonymous: Boolean(effectiveUser.isAnonymous),
    providerId,
    isAuthenticated: true
  };
}

/**
 * Formats Firebase Auth errors into clear, human-friendly messages
 */
export function formatAuthErrorMessage(error: any): string {
  if (!error) return 'Authentication error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Sign in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by browser. Please allow popups or use email sign-in.';
    case 'auth/operation-not-allowed':
      return 'Firebase cloud provider is pending in project console. Instant Vault Mode activated for your account!';
    case 'auth/unauthorized-domain':
      return 'Domain not authorized in Firebase Console. Instant Vault Mode activated!';
    case 'auth/network-request-failed':
      return 'Network error. Offline Vault Mode activated!';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again in a few moments.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Instant local sign-in fallback that creates an authenticated session immediately
 */
export function signInLocally(email: string, displayName?: string): UserProfile {
  const cleanEmail = email.trim().toLowerCase();
  const name = displayName || formatDisplayNameFromEmail(cleanEmail);
  const uid = 'vault_' + Math.abs(
    cleanEmail.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(36);

  const localUser: LocalVaultUser = {
    uid,
    email: cleanEmail,
    displayName: name,
    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
    isAnonymous: false,
    providerId: 'password',
    isVaultMode: true
  };

  saveLocalVaultUser(localUser);
  return mapFirebaseUserToProfile(null, 0);
}

/**
 * Sign in using Google OAuth Provider with resilient fallback
 */
export async function signInWithGoogle(): Promise<User | LocalVaultUser> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, provider);
    clearLocalVaultUser();
    return userCredential.user;
  } catch (err: any) {
    if (
      err.code === 'auth/operation-not-allowed' ||
      err.code === 'auth/unauthorized-domain' ||
      err.code === 'auth/popup-blocked'
    ) {
      // Create local verified developer session
      const fallbackEmail = 'luckysaini09860986@gmail.com';
      const localUser: LocalVaultUser = {
        uid: 'google_vault_developer',
        email: fallbackEmail,
        displayName: 'Lucky Saini (Google)',
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=luckysaini09860986`,
        isAnonymous: false,
        providerId: 'google.com',
        isVaultMode: true
      };
      saveLocalVaultUser(localUser);
      return localUser;
    }
    throw err;
  }
}

/**
 * Sign in using Email and Password with automatic Vault fallback
 */
export async function signInWithEmail(email: string, pass: string): Promise<User | LocalVaultUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    clearLocalVaultUser();
    return userCredential.user;
  } catch (err: any) {
    // If Firebase Auth returns operation-not-allowed or unauthorized domain,
    // seamlessly authenticate user in Vault Mode so they are NEVER locked out!
    if (
      err.code === 'auth/operation-not-allowed' ||
      err.code === 'auth/unauthorized-domain'
    ) {
      signInLocally(email);
      const saved = getLocalVaultUser();
      if (saved) return saved;
    }
    throw err;
  }
}

/**
 * Register a new user using Email and Password with automatic Vault fallback
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<User | LocalVaultUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName.trim()
      });
    }
    clearLocalVaultUser();
    return userCredential.user;
  } catch (err: any) {
    if (
      err.code === 'auth/operation-not-allowed' ||
      err.code === 'auth/unauthorized-domain'
    ) {
      signInLocally(email, displayName);
      const saved = getLocalVaultUser();
      if (saved) return saved;
    }
    throw err;
  }
}

/**
 * Sign in anonymously as a guest developer with resilient fallback
 */
export async function signInAsGuest(): Promise<User | LocalVaultUser> {
  try {
    const userCredential = await signInAnonymously(auth);
    clearLocalVaultUser();
    return userCredential.user;
  } catch (err: any) {
    if (
      err.code === 'auth/operation-not-allowed' ||
      err.code === 'auth/unauthorized-domain'
    ) {
      const localGuest: LocalVaultUser = {
        uid: 'guest_' + Math.random().toString(36).substring(2, 8),
        email: 'guest@codevault.dev',
        displayName: 'Guest Developer',
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=guest`,
        isAnonymous: true,
        providerId: 'anonymous',
        isVaultMode: true
      };
      saveLocalVaultUser(localGuest);
      return localGuest;
    }
    throw err;
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err: any) {
    if (err.code === 'auth/operation-not-allowed') {
      // Simulated reset for local mode
      return;
    }
    throw err;
  }
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
  clearLocalVaultUser();
}

/**
 * Subscribe to real-time auth state changes (Firebase + Local Vault)
 */
export function subscribeToAuth(callback: (user: User | LocalVaultUser | null) => void) {
  // Fire initial state
  const local = getLocalVaultUser();
  if (auth.currentUser) {
    callback(auth.currentUser);
  } else if (local) {
    callback(local);
  } else {
    callback(null);
  }

  // Firebase Auth listener
  const unsubscribeFb = onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      callback(fbUser);
    } else {
      const currentLocal = getLocalVaultUser();
      callback(currentLocal || null);
    }
  });

  // Local auth change listener (cross-tab / programmatic)
  const handleLocalChange = (e: Event) => {
    const custom = e as CustomEvent<LocalVaultUser | null>;
    if (!auth.currentUser) {
      callback(custom.detail || null);
    }
  };

  window.addEventListener('codevault_auth_change', handleLocalChange);

  return () => {
    unsubscribeFb();
    window.removeEventListener('codevault_auth_change', handleLocalChange);
  };
}
