import React, { useState } from 'react';
import { BIG_O_COMPLEXITIES, DSA_BIT_TRICKS, DSA_RECURRENCE_FORMULAS } from '../data/dsaCheatSheet';

export const DsaCheatSheetView: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Data Structure' | 'Sorting Algorithm'>('All');
  const [search, setSearch] = useState('');

  const filteredItems = BIG_O_COMPLEXITIES.filter((item) => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.notes.toLowerCase().includes(q);
    }
    return true;
  });

  const getComplexityColor = (val: string) => {
    if (val.includes('1') || val === 'O(1)' || val === 'O(1)*') return 'text-[#4edea3] bg-[#4edea3]/10';
    if (val.includes('log N') || val === 'O(log N)') return 'text-[#7bd0ff] bg-[#7bd0ff]/10';
    if (val.includes('N log N')) return 'text-[#fde047] bg-[#fde047]/10';
    if (val.includes('N^2') || val.includes('N^') || val.includes('2^N')) return 'text-[#f43f5e] bg-[#f43f5e]/10';
    if (val.includes('N')) return 'text-[#ffb77d] bg-[#ffb77d]/10';
    return 'text-[#bbcabf] bg-[#252a32]';
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#17202c] to-[#121820] rounded-2xl p-5 border border-[#30353d]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#252f3d] text-[#4edea3] text-[11px] font-mono mb-2 border border-[#4edea3]/20">
            <span className="material-symbols-outlined text-[14px]">table_chart</span>
            <span>REFERENCE MATRIX</span>
          </div>
          <h2 className="text-lg font-bold text-[#dee2ec]">Big-O Complexity & Formula Cheat Sheet</h2>
          <p className="text-xs text-[#bbcabf] mt-1 max-w-xl">
            Quickly reference time and space complexities for core data structures, sorting algorithms, bitwise tricks, and recurrence equations.
          </p>
        </div>

        {/* Complexity Legend */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3]">O(1) Excellent</span>
          <span className="px-2 py-0.5 rounded bg-[#7bd0ff]/15 text-[#7bd0ff]">O(log N) Good</span>
          <span className="px-2 py-0.5 rounded bg-[#ffb77d]/15 text-[#ffb77d]">O(N) Fair</span>
          <span className="px-2 py-0.5 rounded bg-[#f43f5e]/15 text-[#f43f5e]">O(N^2) Bad</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#86948a]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search data structure or sorting algorithm..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#171c23] border border-[#30353d]/60 text-xs font-mono text-[#dee2ec] placeholder-[#86948a] focus:outline-none focus:border-[#4edea3]"
          />
        </div>

        <div className="flex items-center bg-[#171c23] p-0.5 rounded-lg border border-[#30353d]/60 shrink-0">
          {(['All', 'Data Structure', 'Sorting Algorithm'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#252f3d] text-[#4edea3] font-semibold shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Complexity Table */}
      <div className="w-full bg-[#171c23] rounded-2xl border border-[#30353d]/70 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#121820] text-[#bbcabf] border-b border-[#30353d]/70">
                <th className="py-3 px-4 font-semibold">Name / Type</th>
                <th className="py-3 px-3 font-semibold">Access (Avg)</th>
                <th className="py-3 px-3 font-semibold">Search (Avg)</th>
                <th className="py-3 px-3 font-semibold">Insertion</th>
                <th className="py-3 px-3 font-semibold">Deletion</th>
                <th className="py-3 px-3 font-semibold">Worst Time</th>
                <th className="py-3 px-3 font-semibold">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30353d]/40">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#1b232e]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#dee2ec]">{item.name}</div>
                    <div className="text-[10px] text-[#86948a] line-clamp-1 mt-0.5">{item.notes}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getComplexityColor(item.accessAvg)}`}>
                      {item.accessAvg}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getComplexityColor(item.searchAvg)}`}>
                      {item.searchAvg}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getComplexityColor(item.insertAvg)}`}>
                      {item.insertAvg}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getComplexityColor(item.deleteAvg)}`}>
                      {item.deleteAvg}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getComplexityColor(item.worstTime)}`}>
                      {item.worstTime}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold text-[#bbcabf] bg-[#252a32]">
                      {item.spaceComplexity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bit Manipulation and Recurrences Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bit Manipulation Tricks */}
        <div className="bg-[#171c23] rounded-2xl p-4 border border-[#30353d]/70 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">memory</span>
            <h3 className="text-sm font-bold text-[#dee2ec]">Essential Bit Manipulation Tricks</h3>
          </div>

          <div className="flex flex-col gap-2">
            {DSA_BIT_TRICKS.map((trick, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-[#0e131a] border border-[#30353d]/40 text-xs font-mono">
                <code className="text-[#4edea3] font-bold px-1.5 py-0.5 rounded bg-[#4edea3]/10 shrink-0">
                  {trick.trick}
                </code>
                <span className="text-[#bbcabf] text-right">{trick.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recurrence Relations / Master Theorem */}
        <div className="bg-[#171c23] rounded-2xl p-4 border border-[#30353d]/70 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#fde047]">functions</span>
            <h3 className="text-sm font-bold text-[#dee2ec]">Master Theorem & Recurrence Relations</h3>
          </div>

          <div className="flex flex-col gap-2">
            {DSA_RECURRENCE_FORMULAS.map((f, i) => (
              <div key={i} className="flex flex-col p-2.5 rounded-lg bg-[#0e131a] border border-[#30353d]/40 gap-1 text-xs font-mono">
                <div className="flex items-center justify-between text-[#dee2ec]">
                  <span className="font-semibold">{f.name}</span>
                  <span className="text-[#4edea3] font-bold">{f.solution}</span>
                </div>
                <div className="text-[11px] text-[#86948a]">{f.recurrence}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
