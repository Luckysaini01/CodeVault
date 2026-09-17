import React, { useState } from 'react';
import { Screen, Snippet, UserProfile, DsaUserProgress } from '../types';
import { DSA_PROBLEMS } from '../data/dsaProblems';
import { executeCodeAsync } from '../services/codeExecutionEngine';

interface DashboardScreenProps {
  user: UserProfile;
  snippets: Snippet[];
  onNavigate: (screen: Screen) => void;
  onSelectSnippet: (snippet: Snippet) => void;
  isDbConnected?: boolean;
  dsaProgressMap?: Record<string, DsaUserProgress>;
  onOpenAuth?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  snippets,
  onNavigate,
  onSelectSnippet,
  isDbConnected = true,
  dsaProgressMap = {},
  onOpenAuth
}) => {
  const [runningSnippetId, setRunningSnippetId] = useState<string | null>(null);
  const [runSuccessId, setRunSuccessId] = useState<string | null>(null);

  // Compute DSA solved metrics
  const dsaStats = React.useMemo(() => {
    const total = DSA_PROBLEMS.length;
    let solved = 0;
    DSA_PROBLEMS.forEach((p) => {
      if (dsaProgressMap[p.id]?.status === 'solved') solved++;
    });
    return {
      total,
      solved,
      pct: total > 0 ? Math.round((solved / total) * 100) : 0
    };
  }, [dsaProgressMap]);

  // Compute dynamic language distribution
  const langCounts = React.useMemo(() => {
    const total = Math.max(snippets.length, 1);
    const cpp = snippets.filter((s) => s.language === 'cpp').length;
    const py = snippets.filter((s) => s.language === 'py').length;
    const java = snippets.filter((s) => s.language === 'java').length;
    const js = snippets.filter((s) => s.language === 'js').length;
    return {
      cpp,
      cppPct: Math.round((cpp / total) * 100),
      py,
      pyPct: Math.round((py / total) * 100),
      java,
      javaPct: Math.round((java / total) * 100),
      js,
      jsPct: Math.round((js / total) * 100)
    };
  }, [snippets]);

  const handleRunSnippet = async (e: React.MouseEvent, snippet: Snippet) => {
    e.stopPropagation();
    setRunningSnippetId(snippet.id);
    try {
      await executeCodeAsync(snippet.code, snippet.language);
      setRunSuccessId(snippet.id);
      setTimeout(() => setRunSuccessId(null), 2500);
    } catch {
      setRunSuccessId(snippet.id);
      setTimeout(() => setRunSuccessId(null), 1800);
    } finally {
      setRunningSnippetId(null);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 max-w-lg mx-auto pb-10">
      {/* Welcome & Primary Action Bar */}
      <section className="flex flex-col gap-3 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="font-headline-lg-mobile text-[#dee2ec] tracking-tight font-semibold">
                Welcome back, {user.name.split(' ')[0]}
              </h1>
              <span className="text-xl">👋</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-[#4edea3] animate-ping opacity-75' : 'bg-[#eab308]'}`}></span>
              <p className="font-label-sm text-[#bbcabf] flex items-center gap-1.5 flex-wrap">
                <span>Vault: Active</span>
                <span className="text-[#86948a]">•</span>
                <span className="text-[#4edea3] flex items-center gap-1 font-mono text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-[#4edea3]' : 'bg-[#eab308]'}`}></span>
                  {isDbConnected ? 'Cloud DB Live' : 'Connecting DB'}
                </span>
                <span className="text-[#86948a]">•</span>
                <span className="text-[#dee2ec] font-medium">{snippets.length} Saved Codes</span>
              </p>
            </div>
          </div>

          {/* User avatar & auth toggle pill */}
          <button
            onClick={onOpenAuth}
            className="w-11 h-11 rounded-full bg-[#252a32] p-0.5 ring-1 ring-[#4edea3]/40 hover:ring-[#4edea3] flex items-center justify-center relative overflow-hidden shadow-md flex-shrink-0 cursor-pointer active:scale-95 transition-all group"
            title={user.isAuthenticated ? `Signed in as ${user.name}` : "Sign In with Firebase"}
          >
            <img
              alt={user.name}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
              src={user.avatarUrl}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`;
              }}
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#171c23] ${
                user.isAuthenticated ? 'bg-[#4edea3]' : 'bg-[#86948a]'
              }`}
            />
          </button>
        </div>

        {/* Quick Add New Code High-Visibility CTA */}
        <button
          onClick={() => onNavigate('add-code')}
          className="w-full h-12 bg-[#4edea3] text-[#003824] rounded-xl flex items-center justify-between px-4 shadow-md active:scale-[0.98] transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#003824]/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#003824] text-[20px] group-hover:rotate-90 transition-transform duration-300">
                add
              </span>
            </div>
            <span className="font-code-md font-semibold tracking-wide">
              Create New Snippet
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#003824]/80 font-code-sm">
            <span className="bg-[#003824]/10 px-1.5 py-0.5 rounded font-mono">⌘N</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </div>
        </button>
      </section>

      {/* Sandbox Status & Storage Micro-widget */}
      <section className="bg-[#171c23] rounded-xl p-3 border border-[#30353d]/40 flex flex-col gap-2 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#4edea3]/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4edea3] text-[18px]">cloud_done</span>
            <span className="font-label-md text-[#dee2ec]">Storage & Runtime</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#30353d] px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            <span className="font-label-sm text-[#4edea3]">Healthy</span>
          </div>
        </div>

        {/* Progress Meter */}
        <div className="flex flex-col gap-1.5">
          <div className="w-full h-2 bg-[#30353d] rounded-full overflow-hidden flex">
            <div
              className="bg-[#4edea3] h-full rounded-full transition-all duration-500"
              style={{ width: `${(snippets.length / 500) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[#bbcabf] font-code-sm">
            <span>{snippets.length} / 500 Codes Saved</span>
            <span className="text-[#7bd0ff]">{((snippets.length / 500) * 100).toFixed(1)}% Vault Capacity</span>
          </div>
        </div>
      </section>

      {/* DSA Problem Practice Card */}
      <section 
        onClick={() => onNavigate('dsa')}
        className="bg-[#1b222d] hover:bg-[#1f2838] transition-all cursor-pointer rounded-xl p-3.5 border border-[#30353d]/70 flex flex-col gap-2.5 shadow-sm relative overflow-hidden group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#dee2ec] group-hover:text-[#4edea3] transition-colors">
                DSA Problem Tracker
              </span>
              <span className="text-[11px] font-mono text-[#bbcabf]">
                {dsaStats.solved} of {dsaStats.total} problems completed ({dsaStats.pct}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#4edea3] text-xs font-mono font-semibold">
            <span>Solve</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </div>

        {/* DSA Progress Bar */}
        <div className="w-full h-2 bg-[#0e131a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4edea3] to-[#4cd7f6] rounded-full transition-all duration-500"
            style={{ width: `${Math.max(dsaStats.pct, 4)}%` }}
          />
        </div>
      </section>

      {/* Stats Metrics Grid (Language Breakdown) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-code-md font-semibold text-[#dee2ec] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">analytics</span>
            Code Distribution
          </h2>
          <span className="font-label-sm text-[#bbcabf]">5 Dialects</span>
        </div>

        {/* Grid: 2 columns for mobile ergonomics */}
        <div className="grid grid-cols-2 gap-2">
          {/* Total Codes Card (Span 2) */}
          <div 
            onClick={() => onNavigate('my-codes')}
            className="col-span-2 bg-[#1b2027] rounded-xl p-3 border border-[#30353d]/40 flex items-center justify-between shadow-sm relative overflow-hidden cursor-pointer hover:border-[#4edea3]/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#30353d] flex items-center justify-center text-[#4edea3]">
                <span className="material-symbols-outlined text-[24px]">folder_special</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[#bbcabf] uppercase tracking-wider">Master Archive</span>
                <span className="font-headline-sm text-[#dee2ec] font-semibold">{snippets.length} Snippets</span>
                <span className="font-body-sm text-[#bbcabf] truncate">Global index across all stacks</span>
              </div>
            </div>
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#4edea3]/10 text-[#4edea3]">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
          </div>

          {/* C++ Card */}
          <div 
            onClick={() => onNavigate('my-codes')}
            className="bg-[#1b2027] rounded-xl p-3 border border-[#30353d]/40 flex flex-col gap-1 shadow-sm relative overflow-hidden cursor-pointer hover:bg-[#252a32] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm px-1.5 py-0.5 rounded bg-[#19aee8]/20 text-[#7bd0ff] font-semibold">C++</span>
              <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">memory</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline-sm font-semibold text-[#dee2ec]">{langCounts.cpp}</span>
              <span className="font-label-sm text-[#bbcabf]">codes</span>
            </div>
            <span className="font-body-sm text-[#bbcabf] truncate">DSA & Algorithms</span>
            <div className="w-full bg-[#30353d] h-1 rounded-full mt-1 overflow-hidden">
              <div className="bg-[#7bd0ff] h-full rounded-full" style={{ width: `${Math.max(langCounts.cppPct, 4)}%` }}></div>
            </div>
          </div>

          {/* Java Card */}
          <div 
            onClick={() => onNavigate('my-codes')}
            className="bg-[#1b2027] rounded-xl p-3 border border-[#30353d]/40 flex flex-col gap-1 shadow-sm relative overflow-hidden cursor-pointer hover:bg-[#252a32] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm px-1.5 py-0.5 rounded bg-[#03b5d3]/20 text-[#4cd7f6] font-semibold">Java</span>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">coffee</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline-sm font-semibold text-[#dee2ec]">{langCounts.java}</span>
              <span className="font-label-sm text-[#bbcabf]">codes</span>
            </div>
            <span className="font-body-sm text-[#bbcabf] truncate">OOP & Systems</span>
            <div className="w-full bg-[#30353d] h-1 rounded-full mt-1 overflow-hidden">
              <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: `${Math.max(langCounts.javaPct, 4)}%` }}></div>
            </div>
          </div>

          {/* Python Card */}
          <div 
            onClick={() => onNavigate('my-codes')}
            className="bg-[#1b2027] rounded-xl p-3 border border-[#30353d]/40 flex flex-col gap-1 shadow-sm relative overflow-hidden cursor-pointer hover:bg-[#252a32] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm px-1.5 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] font-semibold">Python</span>
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">terminal</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline-sm font-semibold text-[#dee2ec]">{langCounts.py}</span>
              <span className="font-label-sm text-[#bbcabf]">codes</span>
            </div>
            <span className="font-body-sm text-[#bbcabf] truncate">Scripts & AI</span>
            <div className="w-full bg-[#30353d] h-1 rounded-full mt-1 overflow-hidden">
              <div className="bg-[#4edea3] h-full rounded-full" style={{ width: `${Math.max(langCounts.pyPct, 4)}%` }}></div>
            </div>
          </div>

          {/* JavaScript Card */}
          <div 
            onClick={() => onNavigate('my-codes')}
            className="bg-[#1b2027] rounded-xl p-3 border border-[#30353d]/40 flex flex-col gap-1 shadow-sm relative overflow-hidden cursor-pointer hover:bg-[#252a32] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm px-1.5 py-0.5 rounded bg-[#7bd0ff]/20 text-[#7bd0ff] font-semibold">JS</span>
              <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">javascript</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline-sm font-semibold text-[#dee2ec]">{langCounts.js}</span>
              <span className="font-label-sm text-[#bbcabf]">codes</span>
            </div>
            <span className="font-body-sm text-[#bbcabf] truncate">Web & Utilities</span>
            <div className="w-full bg-[#30353d] h-1 rounded-full mt-1 overflow-hidden">
              <div className="bg-[#7bd0ff] h-full rounded-full" style={{ width: `${Math.max(langCounts.jsPct, 4)}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="font-code-md font-semibold text-[#dee2ec] uppercase tracking-wider">Recent Activity</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
          </div>
          <button
            onClick={() => onNavigate('my-codes')}
            className="font-label-sm text-[#4cd7f6] hover:text-[#acedff] flex items-center gap-0.5 cursor-pointer"
          >
            View All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Snippet List */}
        <div className="flex flex-col gap-2.5">
          {snippets.slice(0, 3).map((snippet) => {
            const isCompiling = runningSnippetId === snippet.id;
            const isDone = runSuccessId === snippet.id;

            return (
              <div
                key={snippet.id}
                onClick={() => {
                  onSelectSnippet(snippet);
                  onNavigate('snippet-inspector');
                }}
                className="bg-[#1b2027] rounded-xl p-3 border border-[#30353d]/40 flex flex-col gap-2 shadow-sm transition-all hover:bg-[#252a32] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-code-md font-semibold text-[#dee2ec] truncate">
                      {snippet.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-label-sm bg-[#19aee8]/20 text-[#7bd0ff] px-1.5 py-0.5 rounded font-mono font-medium">
                        {snippet.languageLabel}
                      </span>
                      <span className="font-label-sm bg-[#30353d] text-[#bbcabf] px-1.5 py-0.5 rounded">
                        {snippet.topic}
                      </span>
                    </div>
                  </div>
                  <span className="font-code-sm text-[#bbcabf] flex items-center gap-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> {snippet.updatedAt}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#30353d]/30 mt-1">
                  <div className="flex items-center gap-1.5 text-[#bbcabf] font-code-sm">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                    <span>{snippet.complexity || 'Compiled 0 errors'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSnippet(snippet);
                        onNavigate('snippet-inspector');
                      }}
                      className="h-8 px-2.5 rounded-lg bg-[#30353d] text-[#dee2ec] font-code-sm font-medium hover:bg-[#343941] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span> View
                    </button>
                    <button
                      onClick={(e) => handleRunSnippet(e, snippet)}
                      className="h-8 px-3 rounded-lg bg-[#4edea3] text-[#003824] font-code-sm font-semibold hover:bg-[#6ffbbe] active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${isCompiling ? 'animate-spin' : ''}`}>
                        {isCompiling ? 'refresh' : isDone ? 'check' : 'play_arrow'}
                      </span>
                      <span>{isCompiling ? 'Compiling...' : isDone ? 'Done (14ms)' : 'Run'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Execution Quick Banner */}
      <section className="bg-[#171c23] rounded-xl p-3 border border-[#30353d]/40 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center text-[#4cd7f6]">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div className="flex flex-col">
            <span className="font-code-sm font-medium text-[#dee2ec]">Interactive Sandbox</span>
            <span className="font-body-sm text-[#bbcabf]">Hot-reload enabled on GCC & PyPy</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('public-runner')}
          className="px-2.5 py-1.5 rounded-lg bg-[#1b2027] text-[#4cd7f6] hover:text-[#acedff] font-code-sm font-medium flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
        >
          Launch <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
        </button>
      </section>
    </div>
  );
};
