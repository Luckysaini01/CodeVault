import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signInAsGuest,
  logoutUser,
  resetPassword,
  formatAuthErrorMessage
} from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onToast: (message: string, icon?: string) => void;
}

type AuthTab = 'signin' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onToast
}) => {
  const [tab, setTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const fbUser = await signInWithGoogle();
      onToast(`Welcome, ${fbUser.displayName || 'Developer'}!`, 'verified_user');
      onClose();
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setErrorMessage(formatAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (tab !== 'forgot' && !password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (tab === 'signin') {
        const fbUser = await signInWithEmail(email, password);
        onToast(`Signed in as ${fbUser.email}`, 'login');
        onClose();
      } else if (tab === 'signup') {
        const fbUser = await signUpWithEmail(email, password, displayName);
        onToast(`Account created for ${fbUser.email}!`, 'badge');
        onClose();
      } else if (tab === 'forgot') {
        await resetPassword(email);
        onToast(`Password reset link sent to ${email}`, 'mark_email_read');
        setTab('signin');
      }
    } catch (err: any) {
      console.error('Email auth failed:', err);
      setErrorMessage(formatAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInAsGuest();
      onToast('Logged in as Guest Developer', 'person_pin');
      onClose();
    } catch (err: any) {
      console.error('Guest Sign In failed:', err);
      setErrorMessage(formatAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      onToast('Signed out successfully', 'logout');
      onClose();
    } catch (err: any) {
      console.error('Sign out failed:', err);
      onToast('Failed to sign out', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = Boolean(user.uid && user.isAuthenticated);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-[#13181f] border border-[#30353d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#dee2ec]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30353d]/60 bg-[#171c24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined text-[18px]">
                {isAuthenticated ? 'manage_accounts' : 'lock'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#dee2ec]">
                {isAuthenticated ? 'Developer Account' : 'CodeVault Authentication'}
              </h3>
              <p className="text-[11px] font-mono text-[#86948a]">
                {isAuthenticated ? 'Live Firebase Session' : 'Secure Cloud Database Sync'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#252a32] transition-colors"
            title="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isAuthenticated ? (
            /* ================= LOGGED IN PROFILE VIEW ================= */
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1b2129] border border-[#30353d]/70">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#4edea3]/40 shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-[#dee2ec] truncate">{user.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
                      {user.isAnonymous ? 'Guest' : 'Verified'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#4cd7f6]">{user.handle}</p>
                  <p className="text-xs text-[#86948a] truncate mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Status / Cloud Sync Info */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#0e1217] border border-[#30353d]/50 flex flex-col">
                  <span className="text-[#86948a] text-[10px] uppercase">Vault Snippets</span>
                  <span className="text-sm font-bold text-[#dee2ec] mt-0.5">
                    {user.codesSaved} <span className="text-xs text-[#86948a]">/ {user.maxCodes}</span>
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0e1217] border border-[#30353d]/50 flex flex-col">
                  <span className="text-[#86948a] text-[10px] uppercase">Cloud Sync</span>
                  <span className="text-sm font-bold text-[#4edea3] mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                    Live Connected
                  </span>
                </div>
              </div>

              {/* UID Box */}
              {user.uid && (
                <div className="p-2.5 rounded-lg bg-[#0c1015] border border-[#30353d]/40 flex items-center justify-between text-xs font-mono text-[#86948a]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#bbcabf]">UID:</span>
                    <span className="truncate">{user.uid}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.uid || '');
                      onToast('UID copied to clipboard', 'content_copy');
                    }}
                    className="hover:text-[#4edea3] transition-colors p-1"
                    title="Copy Firebase UID"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2a1b1e] hover:bg-[#381e22] text-[#ffb4ab] border border-[#ffb4ab]/30 font-medium text-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>{isLoading ? 'Signing Out...' : 'Sign Out of Vault'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= SIGN IN / SIGN UP FORM ================= */
            <div className="space-y-4">
              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs flex items-start gap-2 animate-in fade-in">
                  <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1-Click Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#ffffff] hover:bg-[#f1f3f4] text-[#1f1f1f] font-medium text-sm transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2 text-xs text-[#86948a] font-mono">
                <div className="h-[1px] flex-1 bg-[#30353d]"></div>
                <span>or email & password</span>
                <div className="h-[1px] flex-1 bg-[#30353d]"></div>
              </div>

              {/* Tab Switcher */}
              <div className="flex rounded-lg bg-[#1b2129] p-1 border border-[#30353d]/60">
                <button
                  type="button"
                  onClick={() => {
                    setTab('signin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    tab === 'signin'
                      ? 'bg-[#252f3d] text-[#4edea3] shadow-sm'
                      : 'text-[#bbcabf] hover:text-[#dee2ec]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('signup');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    tab === 'signup'
                      ? 'bg-[#252f3d] text-[#4edea3] shadow-sm'
                      : 'text-[#bbcabf] hover:text-[#dee2ec]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-mono text-[#bbcabf] mb-1">
                      Full Name / Handle
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Satoshi Nakamoto"
                      className="w-full px-3 py-2 rounded-lg bg-[#0e1217] border border-[#30353d] text-[#dee2ec] text-sm focus:outline-none focus:border-[#4edea3] transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-[#bbcabf] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1217] border border-[#30353d] text-[#dee2ec] text-sm focus:outline-none focus:border-[#4edea3] transition-colors"
                  />
                </div>

                {tab !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-mono text-[#bbcabf]">
                        Password
                      </label>
                      {tab === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setTab('forgot')}
                          className="text-[11px] text-[#4cd7f6] hover:underline"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e1217] border border-[#30353d] text-[#dee2ec] text-sm focus:outline-none focus:border-[#4edea3] transition-colors pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86948a] hover:text-[#dee2ec] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#4edea3] hover:bg-[#3ec48e] text-[#003824] font-semibold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-4"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#003824] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        {tab === 'signin' ? 'login' : tab === 'signup' ? 'person_add' : 'mail'}
                      </span>
                      <span>
                        {tab === 'signin'
                          ? 'Sign In to Vault'
                          : tab === 'signup'
                          ? 'Create Vault Account'
                          : 'Send Reset Link'}
                      </span>
                    </>
                  )}
                </button>
              </form>

              {tab === 'forgot' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setTab('signin')}
                    className="text-xs text-[#4cd7f6] hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}

              {/* Guest Access Alternative */}
              <div className="pt-2 border-t border-[#30353d]/50 text-center">
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={isLoading}
                  className="text-xs text-[#bbcabf] hover:text-[#4edea3] flex items-center justify-center gap-1.5 mx-auto transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">person_outline</span>
                  <span>Continue without account as Guest</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
