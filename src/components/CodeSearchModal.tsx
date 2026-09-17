import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Screen, Snippet, LanguageKey } from '../types';
import { DSA_PROBLEMS } from '../data/dsaProblems';

interface CodeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippets: Snippet[];
  onSelectSnippet: (snippet: Snippet) => void;
  onNavigate: (screen: Screen) => void;
  onSaveSnippet: (snippet: Snippet) => void;
  onToast: (msg: string, icon?: string) => void;
  onPrepareNewSnippet?: (title: string, code?: string, lang?: LanguageKey) => void;
}

export const CodeSearchModal: React.FC<CodeSearchModalProps> = ({
  isOpen,
  onClose,
  snippets,
  onSelectSnippet,
  onNavigate,
  onSaveSnippet,
  onToast,
  onPrepareNewSnippet
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'vault' | 'library'>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [savedProblemIds, setSavedProblemIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Track which problem IDs or titles exist in snippets vault
  const vaultSnippetTitles = useMemo<Set<string>>(() => {
    return new Set<string>(snippets.map((s) => s.title.toLowerCase().trim()));
  }, [snippets]);

  // Check if a problem is in vault
  const isProblemInVault = (problemTitle: string) => {
    const pTitle = problemTitle.toLowerCase().trim();
    return vaultSnippetTitles.has(pTitle) || Array.from(vaultSnippetTitles).some((t: string) => t.includes(pTitle) || pTitle.includes(t));
  };

  // 1. Search in Saved Vault (Snippets)
  const vaultMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return snippets.filter((s) => {
      // Language filter
      if (selectedLang !== 'all' && s.language !== selectedLang) return false;

      // Match title, topic, tags, description
      const titleMatch = s.title.toLowerCase().includes(q);
      const topicMatch = s.topic.toLowerCase().includes(q);
      const tagMatch = s.tags.some((t) => t.toLowerCase().includes(q));
      const descMatch = s.description.toLowerCase().includes(q);
      const codeMatch = s.code.toLowerCase().includes(q);

      return titleMatch || topicMatch || tagMatch || descMatch || codeMatch;
    });
  }, [snippets, query, selectedLang]);

  // 2. Search in Curated DSA Problems Library
  const libraryMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return DSA_PROBLEMS.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const topicMatch = p.topic.toLowerCase().includes(q);
      const patternMatch = p.pattern.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const companyMatch = p.companies?.some((c) => c.toLowerCase().includes(q));

      // Code match inside default solutions
      const codeMatch =
        (p.defaultCode.cpp && p.defaultCode.cpp.toLowerCase().includes(q)) ||
        (p.defaultCode.py && p.defaultCode.py.toLowerCase().includes(q)) ||
        (p.defaultCode.java && p.defaultCode.java.toLowerCase().includes(q));

      return titleMatch || topicMatch || patternMatch || descMatch || companyMatch || codeMatch;
    });
  }, [query]);

  // Find matching line in code for preview
  const getMatchedCodeSnippet = (code: string, q: string) => {
    if (!q) return null;
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(q.toLowerCase())) {
        return { lineNum: i + 1, text: lines[i].trim() };
      }
    }
    return null;
  };

  // Direct save library problem to Vault
  const handleSaveProblemToVault = (problem: (typeof DSA_PROBLEMS)[0], e: React.MouseEvent) => {
    e.stopPropagation();

    const preferredLang: LanguageKey = (selectedLang !== 'all' && ['cpp', 'py', 'java', 'js'].includes(selectedLang))
      ? (selectedLang as LanguageKey)
      : 'cpp';

    const codeToSave =
      problem.defaultCode[preferredLang as keyof typeof problem.defaultCode] ||
      problem.defaultCode.cpp ||
      problem.defaultCode.py ||
      problem.defaultCode.java ||
      '// Solution implementation\n';

    const langLabels: Record<LanguageKey, string> = {
      cpp: 'C++',
      py: 'Python',
      java: 'Java',
      js: 'JavaScript',
      rs: 'Rust',
      go: 'Go',
      c: 'C'
    };

    const newSnippet: Snippet = {
      id: `snippet-lib-${problem.id}-${Date.now()}`,
      title: problem.title,
      language: preferredLang,
      languageLabel: langLabels[preferredLang] || 'C++',
      topic: problem.topic,
      tags: ['DSA', problem.topic, problem.difficulty],
      updatedAt: 'Just now',
      description: `${problem.title} algorithm - Time: ${problem.timeComplexity}, Space: ${problem.spaceComplexity}. ${problem.description.slice(0, 100)}...`,
      complexity: problem.timeComplexity,
      runtimeSpec: 'x86_64 GCC 12.2',
      starred: true,
      notes: `Saved from Algorithm Library. Pattern: ${problem.pattern}. Complexity: ${problem.timeComplexity}.`,
      code: codeToSave,
      previewLines: codeToSave
        .split('\n')
        .slice(0, 5)
        .map((line, idx) => ({
          num: (idx + 1).toString().padStart(2, '0'),
          text: line || ' '
        })),
      lastExecution: {
        exitCode: 0,
        time: '0.08s',
        memory: '12.4 MB',
        output: `$ g++ -O3 solution.cpp -o main\nProgram executed with 0 errors.`
      }
    };

    onSaveSnippet(newSnippet);
    setSavedProblemIds((prev) => new Set(prev).add(problem.id));
    onToast(`Saved "${problem.title}" directly to your Cloud Vault!`, 'cloud_done');
  };

  // Copy code to clipboard
  const handleCopyCode = (code: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(code);
      onToast(`Copied "${title}" to clipboard!`, 'content_copy');
    } catch {
      onToast('Failed to copy. Please copy from inspector.', 'info');
    }
  };

  // Handle "+ Save New Code"
  const handleAddNewCode = (presetTitle?: string) => {
    const titleToUse = presetTitle || query.trim();
    if (onPrepareNewSnippet) {
      onPrepareNewSnippet(titleToUse);
    }
    onClose();
    onNavigate('add-code');
  };

  if (!isOpen) return null;

  const totalResults =
    (filterType === 'all' || filterType === 'vault' ? vaultMatches.length : 0) +
    (filterType === 'all' || filterType === 'library' ? libraryMatches.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-[#000000]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#12171f] rounded-2xl border border-[#30353d]/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#30353d]/60 bg-[#171c23] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#252f3d] flex items-center justify-center text-[#4edea3] shrink-0 border border-[#4edea3]/20">
              <span className="material-symbols-outlined text-[20px]">manage_search</span>
            </div>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any code, algorithm, function, or keyword... (e.g. Binary Search, DFS, LRU Cache)"
                className="w-full bg-[#0c1015] text-[#dee2ec] placeholder:text-[#86948a] font-mono text-sm px-3.5 py-2.5 rounded-xl outline-none border border-[#30353d]/70 focus:border-[#4edea3] transition-all pr-9"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#86948a] hover:text-[#dee2ec] cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#1b2027] hover:bg-[#252a32] text-[#bbcabf] hover:text-[#dee2ec] flex items-center justify-center transition-colors cursor-pointer border border-[#30353d]/50 shrink-0"
              title="Close (Esc)"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Filter Bar & Scope Selectors */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
            {/* Scope Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#0c1015] p-1 rounded-xl border border-[#30353d]/50">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#252f3d] text-[#4edea3] font-bold border border-[#4edea3]/30'
                    : 'text-[#bbcabf] hover:text-[#dee2ec]'
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setFilterType('vault')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'vault'
                    ? 'bg-[#252f3d] text-[#4edea3] font-bold border border-[#4edea3]/30'
                    : 'text-[#bbcabf] hover:text-[#dee2ec]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">folder_code</span>
                <span>My Vault ({vaultMatches.length})</span>
              </button>
              <button
                onClick={() => setFilterType('library')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'library'
                    ? 'bg-[#252f3d] text-[#4cd7f6] font-bold border border-[#4cd7f6]/30'
                    : 'text-[#bbcabf] hover:text-[#dee2ec]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">menu_book</span>
                <span>DSA Library ({libraryMatches.length})</span>
              </button>
            </div>

            {/* Language filter selector */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {['all', 'cpp', 'py', 'java', 'js'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2 py-0.5 rounded-md uppercase text-[11px] transition-colors cursor-pointer ${
                    selectedLang === lang
                      ? 'bg-[#4edea3] text-[#003824] font-bold'
                      : 'bg-[#1b2027] text-[#bbcabf] hover:text-[#dee2ec] border border-[#30353d]/40'
                  }`}
                >
                  {lang === 'all' ? 'Any Lang' : lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Action Prompt: If Query exists, allow saving right away */}
          {query.trim() && (
            <div className="bg-[#171c23] p-3 rounded-xl border border-[#4edea3]/30 flex items-center justify-between gap-3 flex-wrap shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">bookmark_add</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-mono font-bold text-[#dee2ec] truncate">
                    Want to save code for &quot;{query.trim()}&quot;?
                  </span>
                  <span className="text-[11px] font-mono text-[#bbcabf]">
                    Paste or upload your snippet and store it in your Cloud Vault permanently.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleAddNewCode()}
                className="px-3 py-1.5 rounded-lg bg-[#4edea3] text-[#003824] font-mono text-xs font-bold hover:bg-[#6ffbbe] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>+ Save This Code Now</span>
              </button>
            </div>
          )}

          {/* State 1: Empty Query - Show Quick Searches & Recent Codes */}
          {!query.trim() && (
            <div className="flex flex-col gap-5 py-2">
              {/* Common Search Suggestions */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#86948a] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Instant Search Algorithms</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Binary Search',
                    'Two Sum',
                    'Merge Sort',
                    'QuickSort',
                    'Reverse Linked List',
                    'Breadth First Search',
                    'Depth First Search',
                    'Dijkstra Shortest Path',
                    'Invert Binary Tree',
                    'LRU Cache',
                    'Kadane Algorithm',
                    'Knapsack DP'
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 rounded-lg bg-[#171c23] hover:bg-[#252f3d] text-[#dee2ec] hover:text-[#4edea3] border border-[#30353d]/50 font-mono text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px] text-[#4cd7f6]">search</span>
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recently Saved in Vault */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#86948a] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">folder_code</span>
                    <span>Currently Saved in Your Vault ({snippets.length})</span>
                  </h4>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('my-codes');
                    }}
                    className="text-xs font-mono text-[#4edea3] hover:underline cursor-pointer"
                  >
                    View all &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {snippets.slice(0, 6).map((snippet) => (
                    <div
                      key={snippet.id}
                      onClick={() => {
                        onSelectSnippet(snippet);
                        onClose();
                        onNavigate('snippet-inspector');
                      }}
                      className="p-2.5 bg-[#171c23] hover:bg-[#1f2631] border border-[#30353d]/50 hover:border-[#4edea3]/40 rounded-xl cursor-pointer transition-all flex flex-col gap-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#dee2ec] group-hover:text-[#4edea3] truncate">
                          {snippet.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#252f3d] text-[#4cd7f6]">
                          {snippet.languageLabel}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#bbcabf] truncate">
                        #{snippet.topic} • {snippet.complexity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* State 2: Active Query - Show Matches */}
          {query.trim() && totalResults === 0 && (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#171c23] flex items-center justify-center text-[#86948a] mb-3 border border-[#30353d]/50">
                <span className="material-symbols-outlined text-[30px]">search_off</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-[#dee2ec] mb-1">
                No matching code found for &quot;{query}&quot;
              </h3>
              <p className="text-xs font-mono text-[#bbcabf] max-w-md mb-4">
                This code snippet is not currently in your vault or library. You can save it right now!
              </p>
              <button
                onClick={() => handleAddNewCode()}
                className="px-4 py-2 bg-[#4edea3] text-[#003824] font-mono text-xs font-bold rounded-xl hover:bg-[#6ffbbe] transition-colors flex items-center gap-1.5 shadow-[0_0_14px_rgba(78,222,163,0.3)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Save &quot;{query}&quot; to Cloud Vault</span>
              </button>
            </div>
          )}

          {/* SECTION 1: Matches in Saved Vault (My Codes) */}
          {(filterType === 'all' || filterType === 'vault') && vaultMatches.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#4edea3] flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px]">folder_code</span>
                  <span>Found in Your Saved Vault ({vaultMatches.length})</span>
                </h4>
                <span className="text-[11px] font-mono text-[#bbcabf]">Ready to open / copy</span>
              </div>

              <div className="flex flex-col gap-2">
                {vaultMatches.map((snippet) => {
                  const matchedCodeLine = getMatchedCodeSnippet(snippet.code, query);
                  return (
                    <div
                      key={snippet.id}
                      onClick={() => {
                        onSelectSnippet(snippet);
                        onClose();
                        onNavigate('snippet-inspector');
                      }}
                      className="p-3 bg-[#171c23] hover:bg-[#1b232e] border border-[#30353d]/60 hover:border-[#4edea3]/60 rounded-xl cursor-pointer transition-all flex flex-col gap-2 group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-[#4edea3] shrink-0"></span>
                          <span className="font-mono text-xs font-bold text-[#dee2ec] group-hover:text-[#4edea3] transition-colors truncate">
                            {snippet.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#4edea3]/20 text-[#4edea3] font-bold shrink-0">
                            Saved in Vault
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => handleCopyCode(snippet.code, snippet.title, e)}
                            className="p-1 px-2 rounded bg-[#252a32] hover:bg-[#30353d] text-[#bbcabf] hover:text-[#4edea3] font-mono text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                            <span className="hidden sm:inline">Copy</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSnippet(snippet);
                              onClose();
                              onNavigate('public-runner');
                            }}
                            className="p-1 px-2 rounded bg-[#252a32] hover:bg-[#30353d] text-[#4cd7f6] font-mono text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Run in Sandbox"
                          >
                            <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                            <span className="hidden sm:inline">Run</span>
                          </button>
                        </div>
                      </div>

                      {/* Code Match Line Highlight */}
                      {matchedCodeLine && (
                        <div className="bg-[#0c1015] px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-[#bbcabf] border border-[#30353d]/40 flex items-center gap-2 overflow-x-auto">
                          <span className="text-[#86948a] shrink-0">Line {matchedCodeLine.lineNum}:</span>
                          <span className="text-[#4edea3] truncate">{matchedCodeLine.text}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#bbcabf] flex-wrap">
                        <span className="px-1.5 py-0.2 rounded bg-[#0c1015] text-[#4cd7f6]">
                          {snippet.languageLabel}
                        </span>
                        <span>#{snippet.topic}</span>
                        <span>•</span>
                        <span>{snippet.complexity}</span>
                        <span className="ml-auto text-[#86948a]">{snippet.updatedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: Matches in Curated DSA Problem Library */}
          {(filterType === 'all' || filterType === 'library') && libraryMatches.length > 0 && (
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#4cd7f6] flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span>Found in Standard DSA Library ({libraryMatches.length})</span>
                </h4>
                <span className="text-[11px] font-mono text-[#bbcabf]">
                  Click &quot;+ Save to My Vault&quot; to store
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {libraryMatches.map((problem) => {
                  const alreadySaved = isProblemInVault(problem.title) || savedProblemIds.has(problem.id);
                  return (
                    <div
                      key={problem.id}
                      onClick={() => {
                        onClose();
                        onNavigate('dsa');
                      }}
                      className="p-3 bg-[#171c23] hover:bg-[#1f2631] border border-[#30353d]/60 hover:border-[#4cd7f6]/50 rounded-xl cursor-pointer transition-all flex flex-col gap-2 group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#dee2ec] group-hover:text-[#4cd7f6] transition-colors truncate">
                            {problem.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${
                              problem.difficulty === 'Easy'
                                ? 'bg-[#4edea3]/15 text-[#4edea3]'
                                : problem.difficulty === 'Medium'
                                ? 'bg-[#fde047]/15 text-[#fde047]'
                                : 'bg-[#f43f5e]/15 text-[#f43f5e]'
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {alreadySaved ? (
                            <span className="px-2 py-1 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-[11px] font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              <span>In Vault</span>
                            </span>
                          ) : (
                            <button
                              onClick={(e) => handleSaveProblemToVault(problem, e)}
                              className="px-2.5 py-1 rounded-lg bg-[#4edea3] text-[#003824] hover:bg-[#6ffbbe] font-mono text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                              title="Save this algorithm directly to your vault"
                            >
                              <span className="material-symbols-outlined text-[15px]">add</span>
                              <span>+ Save to My Vault</span>
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              onNavigate('dsa');
                            }}
                            className="p-1 px-2 rounded bg-[#252a32] hover:bg-[#30353d] text-[#bbcabf] hover:text-[#dee2ec] font-mono text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Open Solver</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] font-mono text-[#bbcabf] line-clamp-2">
                        {problem.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#86948a] flex-wrap">
                        <span className="text-[#4cd7f6]">#{problem.topic}</span>
                        <span>•</span>
                        <span>{problem.pattern}</span>
                        <span>•</span>
                        <span>Time: {problem.timeComplexity}</span>
                        {problem.companies && (
                          <span className="ml-auto text-[10px] text-[#86948a] hidden sm:inline">
                            {problem.companies.slice(0, 3).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#171c23] border-t border-[#30353d]/50 flex items-center justify-between text-[11px] font-mono text-[#bbcabf] px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#0c1015] border border-[#30353d] text-[10px]">Esc</kbd>
              <span>Close</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#0c1015] border border-[#30353d] text-[10px]">⌘K / Ctrl+K</kbd>
              <span>Quick open anytime</span>
            </span>
          </div>

          <button
            onClick={() => handleAddNewCode()}
            className="text-[#4edea3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>Add Custom Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
