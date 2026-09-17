import React, { useState, useMemo } from 'react';
import { Screen, Snippet } from '../types';

interface MyCodesScreenProps {
  snippets: Snippet[];
  onNavigate: (screen: Screen) => void;
  onSelectSnippet: (snippet: Snippet) => void;
  onDeleteSnippet: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToast: (msg: string, icon?: string) => void;
  onOpenSearch?: () => void;
  onPrepareNewSnippet?: (title: string) => void;
}

export const MyCodesScreen: React.FC<MyCodesScreenProps> = ({
  snippets,
  onNavigate,
  onSelectSnippet,
  onDeleteSnippet,
  onToggleStar,
  onToast,
  onOpenSearch,
  onPrepareNewSnippet
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alpha'>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [runningSnippetId, setRunningSnippetId] = useState<string | null>(null);

  const availableLangs = useMemo(() => {
    const list: { id: string; label: string; count: number }[] = [
      { id: 'All', label: 'All', count: snippets.length },
      { id: 'cpp', label: 'C++', count: snippets.filter((s) => s.language === 'cpp').length },
      { id: 'py', label: 'Python', count: snippets.filter((s) => s.language === 'py').length },
      { id: 'java', label: 'Java', count: snippets.filter((s) => s.language === 'java').length },
      { id: 'js', label: 'JavaScript', count: snippets.filter((s) => s.language === 'js').length },
      { id: 'rs', label: 'Rust', count: snippets.filter((s) => s.language === 'rs').length },
      { id: 'go', label: 'Go', count: snippets.filter((s) => s.language === 'go').length },
      { id: 'c', label: 'C', count: snippets.filter((s) => s.language === 'c').length }
    ];
    // Keep 'All' plus any languages that have at least 1 snippet or are core
    return list.filter((item) => item.id === 'All' || item.count > 0 || ['cpp', 'py', 'java', 'js'].includes(item.id));
  }, [snippets]);

  const availableTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    snippets.forEach((s) => {
      if (s.topic && s.topic.trim()) topicsSet.add(s.topic.trim());
    });
    return ['All Topics', ...Array.from(topicsSet).sort()];
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    return snippets
      .filter((snippet) => {
        // Search filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          snippet.title.toLowerCase().includes(q) ||
          snippet.topic.toLowerCase().includes(q) ||
          snippet.code.toLowerCase().includes(q) ||
          snippet.tags.some((t) => t.toLowerCase().includes(q));

        // Language filter
        const matchesLang =
          selectedLang === 'All' ||
          snippet.language === selectedLang ||
          snippet.languageLabel.toLowerCase() === selectedLang.toLowerCase();

        // Topic filter
        const matchesTopic = selectedTopic === 'All Topics' || snippet.topic === selectedTopic;

        return matchesSearch && matchesLang && matchesTopic;
      })
      .sort((a, b) => {
        if (sortOrder === 'alpha') {
          return a.title.localeCompare(b.title);
        }
        if (sortOrder === 'oldest') {
          return a.id.localeCompare(b.id);
        }
        return 0; // Default newest
      });
  }, [snippets, searchQuery, selectedLang, selectedTopic, sortOrder]);

  const handleCopyCode = (e: React.MouseEvent, snippet: Snippet) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(snippet.code);
      onToast(`Copied "${snippet.title}" code to clipboard!`, 'content_copy');
    } catch {
      onToast('Select and copy from inspector', 'info');
    }
  };

  const handleRunSnippet = (e: React.MouseEvent, snippet: Snippet) => {
    e.stopPropagation();
    setRunningSnippetId(snippet.id);
    onToast(`Executing ${snippet.title} in sandbox...`, 'play_arrow');
    setTimeout(() => {
      setRunningSnippetId(null);
      onToast(`Program executed successfully (Exit Code 0)`, 'check_circle');
    }, 600);
  };

  const handleDelete = (e: React.MouseEvent, snippet: Snippet) => {
    e.stopPropagation();
    if (window.confirm(`Archive ${snippet.title} from your private vault?`)) {
      onDeleteSnippet(snippet.id);
      onToast(`Archived ${snippet.title}`, 'delete');
    }
  };

  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case 'Linked List':
        return 'alt_route';
      case 'Graph Theory':
        return 'hub';
      case 'Sorting':
        return 'swap_vert';
      case 'System Design':
        return 'memory';
      case 'Trees':
        return 'account_tree';
      case 'Math / DSA':
        return 'functions';
      default:
        return 'code';
    }
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-lg mx-auto pb-10">
      {/* Header Banner */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#171c23] p-3.5 border border-[#30353d]/40 shadow-md">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#4edea3]/10 blur-2xl pointer-events-none"></div>
        <div className="flex flex-col gap-1 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                folder_special
              </span>
              <span className="font-headline-lg-mobile text-[#dee2ec] font-semibold">
                My Codes Library
              </span>
            </div>
            <span className="font-code-sm px-2 py-0.5 rounded-full bg-[#4edea3]/10 text-[#4edea3] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              {snippets.length} Synced
            </span>
          </div>
          <p className="font-body-sm text-[#bbcabf]">
            Private collection accessible only by you ({snippets.length} codes)
          </p>
        </div>
      </div>

      {/* Search & Filters Container */}
      <div className="flex flex-col gap-2.5 bg-[#171c23] p-3 rounded-xl border border-[#30353d]/40 shadow-sm">
        {/* Search Field */}
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#bbcabf] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snippets by title, topic, or keyword..."
            className="w-full pl-9 pr-8 py-2 bg-[#0f141b] text-[#dee2ec] placeholder:text-[#86948a] font-code-md rounded-lg outline-none border border-[#30353d]/50 focus:border-[#4edea3]/50 focus:bg-[#1b2027] transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-[#bbcabf] hover:text-[#dee2ec] flex items-center cursor-pointer"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {availableLangs.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedLang(item.id)}
              className={`shrink-0 px-3 py-1 rounded-full font-label-sm transition-all cursor-pointer ${
                selectedLang === item.id
                  ? 'bg-[#4edea3] text-[#003824] font-semibold shadow-sm'
                  : 'bg-[#0f141b] text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#1b2027] border border-[#30353d]/40'
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>

        {/* Dropdown Bars */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full appearance-none bg-[#0f141b] text-[#dee2ec] font-code-sm py-1.5 pl-2.5 pr-7 rounded-lg outline-none border border-[#30353d]/50 focus:border-[#4edea3]/50 cursor-pointer"
            >
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-[16px] text-[#bbcabf]">
              expand_more
            </span>
          </div>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'alpha')}
              className="w-full appearance-none bg-[#0f141b] text-[#dee2ec] font-code-sm py-1.5 pl-2.5 pr-7 rounded-lg outline-none border border-[#30353d]/50 focus:border-[#4edea3]/50 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest</option>
              <option value="alpha">Title A-Z</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-[16px] text-[#bbcabf]">
              sort
            </span>
          </div>
        </div>

        {/* View Toggle & Metrics */}
        <div className="flex items-center justify-between pt-1 border-t border-[#30353d]/30">
          <span className="font-code-sm text-[#bbcabf]">
            Showing <span className="text-[#4edea3] font-medium">{filteredSnippets.length}</span> of{' '}
            {snippets.length} repositories
          </span>
          <div className="flex items-center bg-[#0f141b] p-0.5 rounded-lg border border-[#30353d]/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center w-7 h-7 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#252a32] text-[#4edea3] shadow-sm'
                  : 'text-[#bbcabf] hover:text-[#dee2ec]'
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center w-7 h-7 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#252a32] text-[#4edea3] shadow-sm'
                  : 'text-[#bbcabf] hover:text-[#dee2ec]'
              }`}
              title="List View"
            >
              <span className="material-symbols-outlined text-[18px]">view_agenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Snippets Deck */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
        {filteredSnippets.length === 0 ? (
          <div className="p-6 sm:p-8 text-center bg-[#171c23] rounded-xl border border-[#30353d]/40 flex flex-col items-center">
            <span className="material-symbols-outlined text-[36px] text-[#86948a] mb-2">code_off</span>
            <h3 className="font-headline-sm text-[#dee2ec] font-semibold">
              {searchQuery ? `No code snippet found matching "${searchQuery}"` : 'No snippets match your filter'}
            </h3>
            <p className="font-body-sm text-[#bbcabf] mt-1 max-w-md">
              {searchQuery
                ? `You don't have "${searchQuery}" saved in your vault yet. You can search the built-in algorithm library or save this new snippet right now!`
                : 'Try resetting your search query or language filter to view all saved codes.'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {searchQuery && onOpenSearch && (
                <button
                  onClick={onOpenSearch}
                  className="px-3.5 py-1.5 bg-[#252f3d] text-[#4cd7f6] hover:bg-[#323d4e] font-code-sm font-semibold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border border-[#4cd7f6]/30"
                >
                  <span className="material-symbols-outlined text-[16px]">manage_search</span>
                  <span>Search DSA Library</span>
                </button>
              )}
              {searchQuery ? (
                <button
                  onClick={() => {
                    if (onPrepareNewSnippet) onPrepareNewSnippet(searchQuery);
                    onNavigate('add-code');
                  }}
                  className="px-3.5 py-1.5 bg-[#4edea3] text-[#003824] hover:bg-[#6ffbbe] font-code-sm font-semibold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Save &quot;{searchQuery}&quot; to Vault</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('add-code')}
                  className="px-3.5 py-1.5 bg-[#4edea3] text-[#003824] hover:bg-[#6ffbbe] font-code-sm font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  + Add Snippet
                </button>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLang('All');
                  setSelectedTopic('All Topics');
                }}
                className="px-3 py-1.5 bg-[#252a32] text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#30353d] font-code-sm font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          filteredSnippets.map((snippet) => {
            const isCompiling = runningSnippetId === snippet.id;

            return (
              <div
                key={snippet.id}
                onClick={() => {
                  onSelectSnippet(snippet);
                  onNavigate('snippet-inspector');
                }}
                className="flex flex-col bg-[#171c23] rounded-xl overflow-hidden border border-[#30353d]/40 shadow-md transition-all hover:bg-[#1b2027] hover:border-[#30353d] cursor-pointer"
              >
                {/* Header Strip */}
                <div className="flex items-center justify-between px-3 py-2 bg-[#090f15]/80 border-b border-[#30353d]/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">
                      {getTopicIcon(snippet.topic)}
                    </span>
                    <span className="font-headline-sm text-[#dee2ec] font-medium truncate">
                      {snippet.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-label-sm font-semibold px-2 py-0.5 rounded bg-[#4cd7f6]/15 text-[#4cd7f6]">
                      {snippet.languageLabel}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(snippet.id);
                        onToast(snippet.starred ? 'Removed star' : 'Starred snippet', 'star');
                      }}
                      className={`w-6 h-6 flex items-center justify-center rounded transition-colors cursor-pointer ${
                        snippet.starred ? 'text-[#ffb4ab]' : 'text-[#86948a] hover:text-[#dee2ec]'
                      }`}
                      title="Star code"
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={snippet.starred ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        star
                      </span>
                    </button>
                  </div>
                </div>

                <div className="p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[#bbcabf]">
                    <span className="font-code-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#4edea3]">category</span>
                      Topic: {snippet.topic}
                    </span>
                    <span className="font-code-sm text-[#86948a]">Updated: {snippet.updatedAt}</span>
                  </div>

                  {/* Code preview snippet */}
                  <div className="relative bg-[#0f141b] rounded-lg p-2 font-code-sm overflow-x-auto shadow-inner border border-[#30353d]/40">
                    <div className="flex items-start gap-2">
                      <div className="select-none text-[#30353d] flex flex-col font-code-sm pr-1">
                        {snippet.previewLines.map((l) => (
                          <span key={l.num}>{l.num}</span>
                        ))}
                      </div>
                      <pre className="font-code-sm leading-relaxed overflow-x-auto text-[#dee2ec] m-0">
                        {snippet.previewLines.map((l, idx) => (
                          <div key={idx}>{l.text}</div>
                        ))}
                      </pre>
                    </div>
                    {snippet.complexity && (
                      <div className="absolute right-2 top-2">
                        <span className="font-label-sm px-1.5 py-0.5 rounded bg-[#1b2027] text-[#bbcabf] border border-[#30353d]/40">
                          {snippet.complexity}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action button group */}
                  <div className="flex items-center justify-between pt-1 gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSnippet(snippet);
                          onNavigate('snippet-inspector');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#252a32] text-[#dee2ec] font-code-sm hover:bg-[#343941] transition-colors active:scale-95 cursor-pointer"
                        title="Open full inspector"
                      >
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                        <span>View</span>
                      </button>
                      <button
                        onClick={(e) => handleCopyCode(e, snippet)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#252a32] text-[#bbcabf] hover:text-[#4edea3] font-code-sm hover:bg-[#343941] transition-colors active:scale-95 cursor-pointer border border-[#30353d]/30"
                        title="Copy code to clipboard"
                      >
                        <span className="material-symbols-outlined text-[15px]">content_copy</span>
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={(e) => handleRunSnippet(e, snippet)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4edea3] text-[#003824] font-code-sm font-semibold hover:bg-[#6ffbbe] transition-all active:scale-95 shadow-sm cursor-pointer"
                      >
                        <span
                          className={`material-symbols-outlined text-[15px] ${isCompiling ? 'animate-spin' : ''}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {isCompiling ? 'refresh' : 'play_arrow'}
                        </span>
                        <span>{isCompiling ? 'Running...' : 'Run'}</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, snippet)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ffb4ab]/80 hover:text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors active:scale-95 cursor-pointer"
                      title={`Delete ${snippet.title}`}
                    >
                      <span className="material-symbols-outlined text-[17px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Privacy Note Banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#171c23]/60 border border-[#30353d]/30 shadow-sm relative overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-[#252a32] flex items-center justify-center shrink-0 text-[#4edea3]">
          <span className="material-symbols-outlined text-[18px]">lock</span>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-label-md text-[#dee2ec] font-semibold">End-to-end user isolation</span>
          <p className="font-body-sm text-[#bbcabf] leading-relaxed">
            Codes are strictly tied to your account ID and shielded from public access.
          </p>
        </div>
      </div>
    </div>
  );
};
