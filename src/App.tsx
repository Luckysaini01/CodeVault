import { useState, useEffect, useCallback } from 'react';
import { Screen, Snippet, UserProfile, DsaUserProgress } from './types';
import { initialSnippets, defaultUserProfile } from './data/initialSnippets';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { PublicRunnerScreen } from './components/PublicRunnerScreen';
import { AddSnippetScreen } from './components/AddSnippetScreen';
import { MyCodesScreen } from './components/MyCodesScreen';
import { SnippetInspectorScreen } from './components/SnippetInspectorScreen';
import { DsaHubScreen } from './components/DsaHubScreen';
import { CodeSearchModal } from './components/CodeSearchModal';
import { AuthModal } from './components/AuthModal';
import { testFirestoreConnection } from './lib/firebase';
import { subscribeToAuth, mapFirebaseUserToProfile } from './services/authService';
import {
  subscribeToSnippets,
  saveSnippetToDatabase,
  deleteSnippetFromDatabase,
  toggleStarSnippetInDatabase
} from './services/snippetService';
import {
  subscribeToDsaProgress,
  getLocalDsaProgress
} from './services/dsaService';

interface Toast {
  id: string;
  message: string;
  icon?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [dsaProgressMap, setDsaProgressMap] = useState<Record<string, DsaUserProgress>>(() => getLocalDsaProgress());
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    try {
      const saved = localStorage.getItem('codevault_snippets');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return initialSnippets;
  });

  const [selectedSnippet, setSelectedSnippet] = useState<Snippet>(snippets[0] || initialSnippets[0]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pendingSnippetTitle, setPendingSnippetTitle] = useState<string>('');

  // Subscribe to live Firebase Authentication state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((fbUser) => {
      const mapped = mapFirebaseUserToProfile(fbUser, snippets.length);
      setUser(mapped);
    });
    return () => unsubscribe();
  }, [snippets.length]);

  // Global keyboard shortcut: Cmd+K or Ctrl+K or '/' to open search anytime
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      // '/' when not in input / textarea
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast notification system
  const triggerToast = useCallback((message: string, icon?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-3), { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  // Validate Firestore connectivity on startup
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsDbConnected(connected);
      if (connected) {
        console.log('[CodeVault] Firestore cloud database connection verified.');
      }
    });
  }, []);

  // Subscribe to real-time snippets from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToSnippets(
      (cloudSnippets) => {
        if (cloudSnippets.length > 0) {
          setSnippets(cloudSnippets);
          setIsDbConnected(true);
          // Sync with localStorage as fast offline cache
          try {
            localStorage.setItem('codevault_snippets', JSON.stringify(cloudSnippets));
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        console.warn('[CodeVault] Cloud DB fallback to local cache:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to real-time DSA progress from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToDsaProgress((progress) => {
      setDsaProgressMap(progress);
    });

    return () => unsubscribe();
  }, []);

  // Persist snippets in localStorage as instant offline backup
  useEffect(() => {
    try {
      localStorage.setItem('codevault_snippets', JSON.stringify(snippets));
    } catch {
      // ignore
    }
  }, [snippets]);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSnippet = async (snippet: Snippet) => {
    // Optimistic UI update
    setSnippets((prev) => [snippet, ...prev]);
    setSelectedSnippet(snippet);

    try {
      await saveSnippetToDatabase(snippet);
      triggerToast('Snippet saved to Cloud Database', 'cloud_done');
    } catch (err) {
      console.error('Failed to sync snippet to cloud database:', err);
      triggerToast('Saved to local storage cache', 'cloud_off');
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
    if (selectedSnippet.id === id) {
      const remaining = snippets.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setSelectedSnippet(remaining[0]);
      }
    }

    try {
      await deleteSnippetFromDatabase(id);
      triggerToast('Snippet deleted from Cloud Database', 'delete');
    } catch (err) {
      console.error('Failed to delete snippet from database:', err);
    }
  };

  const handleToggleStar = async (id: string) => {
    const target = snippets.find((s) => s.id === id);
    if (!target) return;

    const newStarred = !target.starred;
    setSnippets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, starred: newStarred } : s))
    );

    try {
      await toggleStarSnippetInDatabase(id, Boolean(target.starred));
      triggerToast(newStarred ? 'Starred in Cloud DB' : 'Unstarred in Cloud DB', 'star');
    } catch (err) {
      console.error('Failed to toggle star in database:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141b] text-[#dee2ec] flex flex-col font-sans selection:bg-[#4edea3] selection:text-[#003824]">
      {/* Top Main Navigation Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        user={user}
        isDbConnected={isDbConnected}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenTelemetry={() => handleNavigate('public-runner')}
        onOpenNotifications={() => triggerToast('Cloud database & compiler services operational', 'check_circle')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pt-18 sm:pt-20 pb-24 md:pb-12">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            snippetCount={snippets.length}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onSelectSnippet={(snippet) => {
              setSelectedSnippet(snippet);
              handleNavigate('snippet-inspector');
            }}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen
            user={user}
            snippets={snippets}
            onNavigate={handleNavigate}
            onSelectSnippet={(snippet) => {
              setSelectedSnippet(snippet);
              handleNavigate('snippet-inspector');
            }}
            isDbConnected={isDbConnected}
            dsaProgressMap={dsaProgressMap}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentScreen === 'dsa' && (
          <DsaHubScreen
            progressMap={dsaProgressMap}
            onNavigate={handleNavigate}
            onSaveSnippetToVault={handleSaveSnippet}
            isDbConnected={isDbConnected}
          />
        )}

        {currentScreen === 'public-runner' && (
          <PublicRunnerScreen
            onNavigate={handleNavigate}
            onToast={triggerToast}
          />
        )}

        {currentScreen === 'my-codes' && (
          <MyCodesScreen
            snippets={snippets}
            onNavigate={handleNavigate}
            onSelectSnippet={setSelectedSnippet}
            onDeleteSnippet={handleDeleteSnippet}
            onToggleStar={handleToggleStar}
            onToast={triggerToast}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onPrepareNewSnippet={(title) => setPendingSnippetTitle(title)}
          />
        )}

        {currentScreen === 'add-code' && (
          <AddSnippetScreen
            onNavigate={handleNavigate}
            onSave={handleSaveSnippet}
            onToast={triggerToast}
            initialTitle={pendingSnippetTitle}
            existingSnippets={snippets}
            onViewExistingSnippet={(snippet) => {
              setSelectedSnippet(snippet);
              handleNavigate('snippet-inspector');
            }}
          />
        )}

        {currentScreen === 'snippet-inspector' && (
          <SnippetInspectorScreen
            snippet={selectedSnippet}
            onNavigate={handleNavigate}
            onDelete={handleDeleteSnippet}
            onToast={triggerToast}
          />
        )}
      </main>

      {/* Global Instant Code Search & Vault Finder Modal */}
      <CodeSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        snippets={snippets}
        onSelectSnippet={(snippet) => {
          setSelectedSnippet(snippet);
          setIsSearchModalOpen(false);
          handleNavigate('snippet-inspector');
        }}
        onNavigate={(screen) => {
          handleNavigate(screen);
          setIsSearchModalOpen(false);
        }}
        onSaveSnippet={handleSaveSnippet}
        onToast={triggerToast}
        onPrepareNewSnippet={(title) => setPendingSnippetTitle(title)}
      />

      {/* Real Firebase Authentication & Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onToast={triggerToast}
      />

      {/* Bottom Navigation Dock (Responsive Mobile-Friendly) */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />

      {/* Floating Dynamic Toasts Hub */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none items-center w-full max-w-md px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1b2027] border border-[#30353d] text-[#dee2ec] font-code-sm shadow-xl pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
              {toast.icon || 'info'}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
