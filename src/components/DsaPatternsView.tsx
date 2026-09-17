import React, { useState } from 'react';
import { DSA_PATTERNS } from '../data/dsaPatterns';
import { DsaPattern } from '../types';

interface DsaPatternsViewProps {
  onSelectPatternForPractice: (pattern: DsaPattern) => void;
}

export const DsaPatternsView: React.FC<DsaPatternsViewProps> = ({ onSelectPatternForPractice }) => {
  const [selectedPatternId, setSelectedPatternId] = useState<DsaPattern>(DSA_PATTERNS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentPattern = DSA_PATTERNS.find((p) => p.id === selectedPatternId) || DSA_PATTERNS[0];

  const handleCopyTemplate = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-[#17202c] to-[#121820] rounded-2xl p-5 border border-[#30353d]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#252f3d] text-[#4edea3] text-[11px] font-mono mb-2 border border-[#4edea3]/20">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            <span>ALGORITHMIC SCHEMAS</span>
          </div>
          <h2 className="text-lg font-bold text-[#dee2ec]">Core 10+ DSA Algorithmic Patterns</h2>
          <p className="text-xs text-[#bbcabf] mt-1 max-w-xl">
            Instead of memorizing 500 individual questions, learn the foundational mental patterns that solve 90% of technical coding interviews.
          </p>
        </div>

        <button
          onClick={() => onSelectPatternForPractice(currentPattern.id)}
          className="h-9 px-4 rounded-xl bg-[#4edea3] text-[#003824] font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(78,222,163,0.3)] hover:bg-[#6ffbbe] active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <span>Practice {currentPattern.id}</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Pattern List Navigation Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-1.5 bg-[#171c23] rounded-2xl p-2.5 border border-[#30353d]/70 max-h-[580px] overflow-y-auto">
          <div className="text-[11px] font-mono text-[#bbcabf] px-2 py-1 uppercase tracking-wider font-semibold">
            Select Pattern ({DSA_PATTERNS.length})
          </div>
          {DSA_PATTERNS.map((pat) => {
            const isSelected = pat.id === selectedPatternId;
            return (
              <button
                key={pat.id}
                onClick={() => setSelectedPatternId(pat.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
                  isSelected
                    ? 'bg-[#253242] border border-[#4edea3]/40 shadow-sm'
                    : 'hover:bg-[#1f2530] text-[#bbcabf]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono ${isSelected ? 'text-[#4edea3]' : 'text-[#dee2ec]'}`}>
                    {pat.name}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-[#4edea3]">check</span>
                  )}
                </div>
                <span className="text-[11px] text-[#86948a] line-clamp-1">{pat.description}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Pattern Detailed Guide */}
        <div className="lg:col-span-8 flex flex-col gap-4 bg-[#171c23] rounded-2xl p-5 border border-[#30353d]/70 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#dee2ec] flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-xs font-mono">
                  Pattern
                </span>
                <span>{currentPattern.name}</span>
              </h3>
              <p className="text-xs text-[#bbcabf] mt-1.5 leading-relaxed">{currentPattern.description}</p>
            </div>

            <button
              onClick={() => onSelectPatternForPractice(currentPattern.id)}
              className="px-3 py-1.5 rounded-lg bg-[#252a32] text-[#4edea3] hover:bg-[#30353d] font-mono text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Solve Problems</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>

          {/* When to Use Checklist */}
          <div className="p-3.5 bg-[#0e131a] rounded-xl border border-[#30353d]/50 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-[#7bd0ff] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>WHEN TO USE THIS PATTERN</span>
            </span>
            <ul className="space-y-1 text-xs text-[#bbcabf] pl-1">
              {currentPattern.whenToUse.map((condition, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#4edea3] font-bold">•</span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Canonical Template Code */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#bbcabf]">
                CANONICAL IMPLEMENTATION SKELETON
              </span>
              <button
                onClick={() => handleCopyTemplate(currentPattern.keyTemplate, currentPattern.id)}
                className="text-xs font-mono text-[#4edea3] hover:text-[#6ffbbe] flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedId === currentPattern.id ? 'done' : 'content_copy'}
                </span>
                <span>{copiedId === currentPattern.id ? 'Copied' : 'Copy Skeleton'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#0e131a] rounded-xl border border-[#30353d]/60 font-mono text-xs text-[#dee2ec] overflow-x-auto leading-relaxed">
              <code>{currentPattern.keyTemplate}</code>
            </pre>
          </div>

          {/* Example Problems */}
          <div className="p-3 bg-[#1b222d] rounded-xl border border-[#30353d]/50 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-[#bbcabf]">HALLMARK PROBLEMS</span>
              <span className="text-xs font-semibold text-[#dee2ec] mt-0.5">{currentPattern.exampleProblem}</span>
            </div>
            <button
              onClick={() => onSelectPatternForPractice(currentPattern.id)}
              className="px-2.5 py-1 rounded bg-[#4edea3]/15 text-[#4edea3] text-xs font-mono font-semibold hover:bg-[#4edea3]/25 cursor-pointer"
            >
              Filter Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
