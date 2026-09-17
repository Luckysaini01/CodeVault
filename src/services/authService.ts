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

/**
 * Maps a real Firebase User object to the CodeVault UserProfile interface
 */
export function mapFirebaseUserToProfile(
  fbUser: User | null,
  codesCount: number = 0
): UserProfile {
  if (!fbUser) {
    return {
      ...defaultUserProfile,
      codesSaved: codesCount,
      isAuthenticated: false
    };
  }

  const name =
    fbUser.displayName ||
    (fbUser.email ? fbUser.email.split('@')[0] : (fbUser.isAnonymous ? 'Guest Developer' : 'CodeVault Developer'));

  const handle =
    '@' +
    (fbUser.email
      ? fbUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
      : fbUser.isAnonymous
      ? `guest_${fbUser.uid.substring(0, 5)}`
      : 'vault_dev');

  const avatarUrl =
    fbUser.photoURL ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fbUser.uid)}`;

  const providerId = fbUser.providerData?.[0]?.providerId || (fbUser.isAnonymous ? 'anonymous' : 'password');

  return {
    name,
    email: fbUser.email || (fbUser.isAnonymous ? 'guest@codevault.dev' : 'user@codevault.dev'),
    handle,
    avatarUrl,
    codesSaved: codesCount,
    maxCodes: 500,
    vaultStatus: 'Active',
    uid: fbUser.uid,
    isAnonymous: fbUser.isAnonymous,
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
      return 'This sign-in method is not enabled. Please contact support or use guest access.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again in a few moments.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Sign in using Google OAuth Provider
 */
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}

/**
 * Sign in using Email and Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return userCredential.user;
}

/**
 * Register a new user using Email and Password
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, {
      displayName: displayName.trim()
    });
  }
  return userCredential.user;
}

/**
 * Sign in anonymously as a guest developer
 */
export async function signInAsGuest(): Promise<User> {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to real-time auth state changes
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
