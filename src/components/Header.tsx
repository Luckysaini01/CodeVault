import React from 'react';
import { Screen, UserProfile } from '../types';
import { CodeVaultLogo } from './CodeVaultLogo';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
  onOpenSearch: () => void;
  onOpenTelemetry: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  user: UserProfile;
  isDbConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  onOpenSearch,
  onOpenTelemetry,
  onOpenNotifications,
  onOpenAuth,
  user,
  isDbConnected = true
}) => {
  const isDetailView = currentScreen === 'snippet-inspector' || currentScreen === 'add-code';

  const screenTitleMap: Record<Screen, string> = {
    'home': 'Home',
    'dashboard': 'Dashboard',
    'public-runner': 'Public Runner',
    'my-codes': 'My Codes',
    'dsa': 'DSA Practice',
    'add-code': 'Snippet Inspector',
    'snippet-inspector': 'Snippet Inspector'
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#171c23]/90 backdrop-blur-xl border-b border-[#30353d]/40 shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
      <div className="h-14 px-4 flex items-center justify-between gap-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          {isDetailView && (
            <button
              onClick={onBack || (() => onNavigate('my-codes'))}
              aria-label="Navigate back"
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-lg text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#252a32] transition-colors active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center group text-left shrink-0 cursor-pointer focus:outline-none"
            aria-label="CodeVault Home"
          >
            <CodeVaultLogo
              size="sm"
              showText={true}
              subtitle={screenTitleMap[currentScreen]}
              isAnimated={true}
            />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Global Code Search & Finder */}
          <button
            onClick={onOpenSearch}
            title="Search any code, algorithm or function (⌘K)"
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-[#1b2027] hover:bg-[#252f3d] text-[#bbcabf] hover:text-[#dee2ec] border border-[#30353d]/70 text-xs font-mono transition-all active:scale-95 cursor-pointer shadow-sm group"
          >
            <span className="material-symbols-outlined text-[17px] text-[#4edea3] group-hover:scale-110 transition-transform">search</span>
            <span className="hidden md:inline text-[11px]">Find & Save Code...</span>
            <kbd className="hidden lg:inline px-1.5 py-0.2 rounded bg-[#0c1015] text-[#86948a] border border-[#30353d]/60 text-[10px]">⌘K</kbd>
          </button>

          {/* DSA Practice Hub Quick Button */}
          <button
            onClick={() => onNavigate('dsa')}
            title="Open DSA Practice & Problem Solver"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all active:scale-95 cursor-pointer ${
              currentScreen === 'dsa'
                ? 'bg-[#4edea3] text-[#003824] font-semibold shadow-[0_0_10px_rgba(78,222,163,0.35)]'
                : 'bg-[#1b2027] text-[#4edea3] hover:bg-[#252f3d] border border-[#30353d]/70'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>DSA</span>
          </button>

          {/* Cloud Database Sync Status */}
          <div
            title={isDbConnected ? "Firestore Cloud Database: Live & Connected" : "Connecting to Firestore..."}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1b2027] border border-[#30353d]/70 text-xs font-mono select-none"
          >
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.6)]' : 'bg-[#eab308] animate-pulse'}`} />
            <span className="text-[#bbcabf] text-[11px]">
              {isDbConnected ? 'Cloud DB' : 'Connecting...'}
            </span>
          </div>

          <button
            onClick={onOpenTelemetry}
            aria-label="Telemetry Terminal"
            title="Open Sandbox Telemetry Terminal"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#bbcabf] hover:text-[#4cd7f6] hover:bg-[#1b2027] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
          </button>

          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            title="System & Compiler Notifications"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#1b2027] transition-colors active:scale-95 relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#4edea3] ring-2 ring-[#0f141b]"></span>
          </button>

          {isDetailView && (
            <button
              aria-label="More actions"
              onClick={onOpenTelemetry}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#bbcabf] hover:text-[#4cd7f6] hover:bg-[#1b2027] transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          )}

          <button
            onClick={onOpenAuth}
            aria-label="Profile Account Settings"
            title={user.isAuthenticated ? `Signed in as ${user.name}` : "Sign In to CodeVault"}
            className="flex items-center gap-1.5 pl-1 focus:outline-none group active:scale-95 transition-transform"
          >
            {user.isAuthenticated ? (
              <div className="relative">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#4edea3]/60 group-hover:ring-[#4edea3] transition-all"
                  src={user.avatarUrl}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#171c23]"></span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4edea3]/10 hover:bg-[#4edea3]/20 border border-[#4edea3]/30 text-[#4edea3] text-xs font-mono font-medium transition-all shadow-sm">
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span className="hidden sm:inline">Sign In</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
