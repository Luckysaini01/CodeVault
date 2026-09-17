import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home' as Screen, label: 'Home', icon: 'home' },
    { id: 'dsa' as Screen, label: 'DSA', icon: 'psychology' },
    { id: 'public-runner' as Screen, label: 'Runner', icon: 'play_circle' },
    { id: 'add-code' as Screen, label: 'New', icon: 'add', isSpecial: true },
    { id: 'my-codes' as Screen, label: 'Codes', icon: 'data_object' },
    { id: 'dashboard' as Screen, label: 'Dash', icon: 'dashboard' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#171c23]/95 backdrop-blur-xl border-t border-[#30353d]/50 shadow-[0_-1px_12px_rgba(0,0,0,0.35)]">
      <div className="h-16 px-1 flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[#bbcabf] hover:text-[#dee2ec] transition-all active:scale-95 group"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                    isActive
                      ? 'bg-[#10b981] text-[#003824]'
                      : 'bg-[#30353d] group-hover:bg-[#10b981]/20 text-[#4edea3]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">
                    {tab.icon}
                  </span>
                </div>
                <span
                  className={`font-label-sm mt-1 transition-colors ${
                    isActive ? 'text-[#4edea3] font-semibold' : 'text-[#bbcabf]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors active:scale-95 ${
                isActive ? 'text-[#4edea3] font-semibold' : 'text-[#bbcabf] hover:text-[#dee2ec]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
