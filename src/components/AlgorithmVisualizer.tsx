import React, { useState, useEffect } from 'react';

type VisualizerMode = 'binary-search' | 'two-pointers' | 'sorting' | 'stack';

export const AlgorithmVisualizer: React.FC = () => {
  const [mode, setMode] = useState<VisualizerMode>('binary-search');

  // Binary Search State
  const bsArray = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];
  const [bsTarget, setBsTarget] = useState<number>(23);
  const [bsStep, setBsStep] = useState<number>(0);
  const [bsIsPlaying, setBsIsPlaying] = useState<boolean>(false);

  // Generate binary search steps
  const bsSteps = React.useMemo(() => {
    const steps: { low: number; high: number; mid: number; desc: string; found: boolean }[] = [];
    let l = 0;
    let h = bsArray.length - 1;
    while (l <= h) {
      const m = Math.floor((l + h) / 2);
      if (bsArray[m] === bsTarget) {
        steps.push({
          low: l,
          high: h,
          mid: m,
          desc: `Match found! nums[${m}] == ${bsTarget}. Target located at index ${m}.`,
          found: true
        });
        break;
      } else if (bsArray[m] < bsTarget) {
        steps.push({
          low: l,
          high: h,
          mid: m,
          desc: `nums[${m}] (${bsArray[m]}) < ${bsTarget}. Discard left half. Move low to ${m + 1}.`,
          found: false
        });
        l = m + 1;
      } else {
        steps.push({
          low: l,
          high: h,
          mid: m,
          desc: `nums[${m}] (${bsArray[m]}) > ${bsTarget}. Discard right half. Move high to ${m - 1}.`,
          found: false
        });
        h = m - 1;
      }
    }
    if (steps.length === 0 || !steps[steps.length - 1].found) {
      steps.push({
        low: l,
        high: h,
        mid: -1,
        desc: `Search space exhausted (low > high). Target ${bsTarget} is not in the array. Return -1.`,
        found: false
      });
    }
    return steps;
  }, [bsTarget]);

  // Two Pointers State (Container With Most Water)
  const tpHeights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const [tpStep, setTpStep] = useState<number>(0);
  const tpSteps = React.useMemo(() => {
    const steps: { left: number; right: number; area: number; maxArea: number; desc: string }[] = [];
    let l = 0;
    let r = tpHeights.length - 1;
    let maxA = 0;
    while (l < r) {
      const h = Math.min(tpHeights[l], tpHeights[r]);
      const w = r - l;
      const area = h * w;
      if (area > maxA) maxA = area;
      const willMoveLeft = tpHeights[l] < tpHeights[r];
      steps.push({
        left: l,
        right: r,
        area,
        maxArea: maxA,
        desc: `Left: h[${l}]=${tpHeights[l]}, Right: h[${r}]=${tpHeights[r]}. Current Area = min(${tpHeights[l]}, ${tpHeights[r]}) * (${r} - ${l}) = ${area}. ${willMoveLeft ? 'Left is shorter, advance Left.' : 'Right is shorter or equal, decrement Right.'}`
      });
      if (willMoveLeft) l++;
      else r--;
    }
    return steps;
  }, []);

  // Sorting Visualizer State (Bubble Sort)
  const initialBars = [45, 18, 62, 28, 85, 34, 70, 12, 53];
  const [sortBars, setSortBars] = useState<number[]>([...initialBars]);
  const [activeCompare, setActiveCompare] = useState<[number, number] | null>(null);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  // Stack Visualizer State
  const [stackTokens, setStackTokens] = useState<string[]>(['(', '[', '{']);
  const [stackInput, setStackInput] = useState<string>('(');

  // Auto-play timer for Binary Search
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (bsIsPlaying) {
      interval = setInterval(() => {
        setBsStep((prev) => {
          if (prev >= bsSteps.length - 1) {
            setBsIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [bsIsPlaying, bsSteps]);

  // Bubble sort step-by-step runner
  const runBubbleSort = async () => {
    setIsSorting(true);
    const arr = [...sortBars];
    const sorted: number[] = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveCompare([j, j + 1]);
        await new Promise((r) => setTimeout(r, 450));
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setSortBars([...arr]);
          await new Promise((r) => setTimeout(r, 450));
        }
      }
      sorted.push(n - i - 1);
      setSortedIndices([...sorted]);
    }
    sorted.push(0);
    setSortedIndices([...sorted]);
    setActiveCompare(null);
    setIsSorting(false);
  };

  const resetSort = () => {
    setSortBars([...initialBars]);
    setActiveCompare(null);
    setSortedIndices([]);
    setIsSorting(false);
  };

  const currentBsStep = bsSteps[Math.min(bsStep, bsSteps.length - 1)] || bsSteps[0];
  const currentTpStep = tpSteps[Math.min(tpStep, tpSteps.length - 1)] || tpSteps[0];

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#171c23] rounded-xl border border-[#30353d]/50 overflow-x-auto">
        <button
          onClick={() => setMode('binary-search')}
          className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            mode === 'binary-search'
              ? 'bg-[#4edea3] text-[#003824] shadow-sm'
              : 'text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#252a32]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span>Binary Search</span>
        </button>

        <button
          onClick={() => setMode('two-pointers')}
          className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            mode === 'two-pointers'
              ? 'bg-[#4edea3] text-[#003824] shadow-sm'
              : 'text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#252a32]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">sync_alt</span>
          <span>Two Pointers</span>
        </button>

        <button
          onClick={() => setMode('sorting')}
          className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            mode === 'sorting'
              ? 'bg-[#4edea3] text-[#003824] shadow-sm'
              : 'text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#252a32]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">bar_chart</span>
          <span>Sorting Stepper</span>
        </button>

        <button
          onClick={() => setMode('stack')}
          className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            mode === 'stack'
              ? 'bg-[#4edea3] text-[#003824] shadow-sm'
              : 'text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#252a32]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">layers</span>
          <span>Stack LIFO</span>
        </button>
      </div>

      {/* 1. BINARY SEARCH VISUALIZER */}
      {mode === 'binary-search' && (
        <div className="bg-[#171c23] rounded-2xl p-5 border border-[#30353d]/70 flex flex-col gap-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#dee2ec] flex items-center gap-2">
                <span className="text-[#4edea3] font-mono">O(log N)</span>
                <span>Binary Search Halving Simulator</span>
              </h3>
              <p className="text-xs text-[#bbcabf] mt-0.5">
                Observe pointers <span className="text-[#7bd0ff] font-mono font-bold">L (Low)</span>,{' '}
                <span className="text-[#fde047] font-mono font-bold">M (Mid)</span>, and{' '}
                <span className="text-[#f43f5e] font-mono font-bold">H (High)</span> eliminate half of the search window each step.
              </p>
            </div>

            {/* Target Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#bbcabf]">Target:</span>
              <select
                value={bsTarget}
                onChange={(e) => {
                  setBsTarget(Number(e.target.value));
                  setBsStep(0);
                  setBsIsPlaying(false);
                }}
                className="h-8 px-2.5 bg-[#252a32] text-[#dee2ec] font-mono text-xs rounded-lg border border-[#30353d] focus:outline-none focus:border-[#4edea3]"
              >
                {bsArray.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
                <option value={99}>99 (Not Found)</option>
              </select>
            </div>
          </div>

          {/* Array Visual Display */}
          <div className="py-6 px-2 bg-[#0e131a] rounded-xl border border-[#30353d]/50 flex items-center justify-center overflow-x-auto gap-2">
            {bsArray.map((val, idx) => {
              const isLow = idx === currentBsStep.low;
              const isHigh = idx === currentBsStep.high;
              const isMid = idx === currentBsStep.mid;
              const isOutOfRange = idx < currentBsStep.low || idx > currentBsStep.high;
              const isMatched = isMid && currentBsStep.found;

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                  {/* Pointer markers */}
                  <div className="h-5 flex items-center justify-center gap-0.5 text-[10px] font-mono font-bold">
                    {isLow && <span className="px-1 py-0.2 bg-[#7bd0ff] text-[#002d45] rounded">L</span>}
                    {isMid && <span className="px-1 py-0.2 bg-[#fde047] text-[#4a3b00] rounded">M</span>}
                    {isHigh && <span className="px-1 py-0.2 bg-[#f43f5e] text-white rounded">H</span>}
                  </div>

                  {/* Value Box */}
                  <div
                    className={`w-11 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                      isMatched
                        ? 'bg-[#4edea3] text-[#003824] scale-110 shadow-[0_0_16px_rgba(78,222,163,0.5)]'
                        : isMid
                        ? 'bg-[#fde047] text-[#4a3b00] scale-105 border-2 border-white'
                        : isOutOfRange
                        ? 'bg-[#1b212a] text-[#454c59] opacity-35'
                        : 'bg-[#252f3d] text-[#dee2ec] border border-[#30353d]'
                    }`}
                  >
                    {val}
                  </div>

                  {/* Index */}
                  <span className="text-[10px] font-mono text-[#748277]">[{idx}]</span>
                </div>
              );
            })}
          </div>

          {/* Step Explanation Banner */}
          <div className="p-3 bg-[#1f2631] rounded-xl border border-[#30353d]/60 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#4edea3] shrink-0">
              {currentBsStep.found ? 'check_circle' : 'info'}
            </span>
            <span className="text-xs font-mono text-[#dee2ec] leading-relaxed">
              Step {bsStep + 1} of {bsSteps.length}: {currentBsStep.desc}
            </span>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                disabled={bsStep === 0}
                onClick={() => setBsStep((p) => Math.max(0, p - 1))}
                className="h-8 px-3 rounded-lg bg-[#252a32] text-[#dee2ec] hover:bg-[#30353d] disabled:opacity-40 font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>Prev Step</span>
              </button>

              <button
                disabled={bsStep >= bsSteps.length - 1}
                onClick={() => setBsStep((p) => Math.min(bsSteps.length - 1, p + 1))}
                className="h-8 px-3 rounded-lg bg-[#252a32] text-[#dee2ec] hover:bg-[#30353d] disabled:opacity-40 font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBsIsPlaying(!bsIsPlaying)}
                className="h-8 px-3 rounded-lg bg-[#4edea3]/20 hover:bg-[#4edea3]/30 text-[#4edea3] font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {bsIsPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>{bsIsPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                onClick={() => {
                  setBsStep(0);
                  setBsIsPlaying(false);
                }}
                className="h-8 px-2.5 rounded-lg bg-[#252a32] text-[#bbcabf] hover:text-white font-mono text-xs cursor-pointer"
                title="Reset to beginning"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TWO POINTERS VISUALIZER */}
      {mode === 'two-pointers' && (
        <div className="bg-[#171c23] rounded-2xl p-5 border border-[#30353d]/70 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#dee2ec] flex items-center gap-2">
                <span className="text-[#4edea3] font-mono">O(N)</span>
                <span>Container With Most Water (Two Pointers)</span>
              </h3>
              <p className="text-xs text-[#bbcabf] mt-0.5">
                Pointers start at outer limits and advance inward, shifting whichever wall is smaller to seek higher capacity.
              </p>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-mono text-[#bbcabf]">Max Water Trapped</div>
              <div className="text-base font-mono font-bold text-[#4edea3]">{currentTpStep.maxArea} units</div>
            </div>
          </div>

          {/* Bar Diagram Display */}
          <div className="h-48 px-4 bg-[#0e131a] rounded-xl border border-[#30353d]/50 flex items-end justify-between gap-2 pt-6">
            {tpHeights.map((h, idx) => {
              const isL = idx === currentTpStep.left;
              const isR = idx === currentTpStep.right;
              const isInside = idx >= currentTpStep.left && idx <= currentTpStep.right;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end gap-1">
                  <div className="text-[10px] font-mono text-[#bbcabf]">{h}</div>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 relative ${
                      isL || isR
                        ? 'bg-gradient-to-t from-[#4edea3] to-[#4cd7f6] shadow-[0_0_12px_rgba(78,222,163,0.4)]'
                        : isInside
                        ? 'bg-[#253242] border-t border-[#4cd7f6]/40'
                        : 'bg-[#1b2027]'
                    }`}
                    style={{ height: `${(h / 9) * 100}%` }}
                  >
                    {(isL || isR) && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-1 text-[9px] font-mono font-bold rounded bg-white text-black">
                        {isL ? 'L' : 'R'}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-[#748277]">[{idx}]</span>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="p-3 bg-[#1f2631] rounded-xl border border-[#30353d]/60 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">swap_horiz</span>
            <span className="text-xs font-mono text-[#dee2ec] leading-relaxed">
              Step {tpStep + 1} of {tpSteps.length}: {currentTpStep.desc}
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                disabled={tpStep === 0}
                onClick={() => setTpStep((p) => Math.max(0, p - 1))}
                className="h-8 px-3 rounded-lg bg-[#252a32] text-[#dee2ec] hover:bg-[#30353d] disabled:opacity-40 font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>Prev Step</span>
              </button>

              <button
                disabled={tpStep >= tpSteps.length - 1}
                onClick={() => setTpStep((p) => Math.min(tpSteps.length - 1, p + 1))}
                className="h-8 px-3 rounded-lg bg-[#252a32] text-[#dee2ec] hover:bg-[#30353d] disabled:opacity-40 font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <button
              onClick={() => setTpStep(0)}
              className="h-8 px-3 rounded-lg bg-[#252a32] text-[#bbcabf] hover:text-white font-mono text-xs cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* 3. SORTING VISUALIZER */}
      {mode === 'sorting' && (
        <div className="bg-[#171c23] rounded-2xl p-5 border border-[#30353d]/70 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#dee2ec] flex items-center gap-2">
                <span className="text-[#fde047] font-mono">O(N^2)</span>
                <span>Bubble Sort Interactive Step Animator</span>
              </h3>
              <p className="text-xs text-[#bbcabf] mt-0.5">
                Elements compare adjacent pairs and bubble the maximum element to the right of the array.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={isSorting}
                onClick={runBubbleSort}
                className="h-8 px-3 rounded-lg bg-[#4edea3] text-[#003824] font-mono text-xs font-bold flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>{isSorting ? 'Sorting...' : 'Start Sort'}</span>
              </button>

              <button
                disabled={isSorting}
                onClick={resetSort}
                className="h-8 px-3 rounded-lg bg-[#252a32] text-[#dee2ec] font-mono text-xs hover:bg-[#30353d] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Bar Columns Display */}
          <div className="h-44 px-4 bg-[#0e131a] rounded-xl border border-[#30353d]/50 flex items-end justify-between gap-3 pt-6">
            {sortBars.map((val, idx) => {
              const isComparing = activeCompare && (activeCompare[0] === idx || activeCompare[1] === idx);
              const isSorted = sortedIndices.includes(idx);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end gap-1">
                  <div className="text-[10px] font-mono text-[#bbcabf]">{val}</div>
                  <div
                    className={`w-full rounded-t-md transition-all duration-200 ${
                      isComparing
                        ? 'bg-[#fde047] shadow-[0_0_14px_rgba(253,224,71,0.5)]'
                        : isSorted
                        ? 'bg-[#4edea3] shadow-[0_0_10px_rgba(78,222,163,0.3)]'
                        : 'bg-[#2a3442]'
                    }`}
                    style={{ height: `${(val / 95) * 100}%` }}
                  />
                  <span className="text-[9px] font-mono text-[#748277]">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#bbcabf]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#fde047]"></span>
              <span>Active Pair Comparing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#4edea3]"></span>
              <span>Sorted Placement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#2a3442]"></span>
              <span>Unsorted Pool</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. STACK VISUALIZER */}
      {mode === 'stack' && (
        <div className="bg-[#171c23] rounded-2xl p-5 border border-[#30353d]/70 flex flex-col gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-[#dee2ec] flex items-center gap-2">
              <span className="text-[#4edea3] font-mono">LIFO</span>
              <span>Stack Frame & Parentheses Simulator</span>
            </h3>
            <p className="text-xs text-[#bbcabf] mt-0.5">
              Test pushing and popping bracket tokens to see Last-In, First-Out stack mechanics in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Interactive Stack Tube */}
            <div className="w-44 h-56 bg-[#0e131a] rounded-b-2xl border-x-2 border-b-2 border-[#30353d] flex flex-col-reverse p-2 gap-1.5 justify-start relative shadow-inner">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#bbcabf]">
                Top of Stack
              </div>

              {stackTokens.length === 0 ? (
                <div className="text-center text-xs font-mono text-[#586259] my-auto">
                  Stack is Empty
                </div>
              ) : (
                stackTokens.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full h-9 rounded-lg bg-[#253242] border border-[#4edea3]/40 text-[#4edea3] font-mono font-bold flex items-center justify-center text-sm shadow-sm transition-all"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#bbcabf]">Select Token:</span>
                {['(', '[', '{', ')', ']', '}'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setStackInput(sym)}
                    className={`w-8 h-8 rounded-lg font-mono text-sm font-bold border transition-all cursor-pointer ${
                      stackInput === sym
                        ? 'bg-[#4edea3] text-[#003824] border-[#4edea3]'
                        : 'bg-[#252a32] text-[#dee2ec] border-[#30353d] hover:bg-[#30353d]'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (stackTokens.length < 5) {
                      setStackTokens([...stackTokens, stackInput]);
                    }
                  }}
                  disabled={stackTokens.length >= 5}
                  className="h-9 px-4 rounded-lg bg-[#4edea3] text-[#003824] font-mono text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  <span>Push (&quot;{stackInput}&quot;)</span>
                </button>

                <button
                  onClick={() => {
                    if (stackTokens.length > 0) {
                      setStackTokens(stackTokens.slice(0, -1));
                    }
                  }}
                  disabled={stackTokens.length === 0}
                  className="h-9 px-4 rounded-lg bg-[#f43f5e]/20 text-[#f43f5e] hover:bg-[#f43f5e]/30 font-mono text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  <span>Pop Top</span>
                </button>

                <button
                  onClick={() => setStackTokens([])}
                  className="h-9 px-3 rounded-lg bg-[#252a32] text-[#bbcabf] hover:text-white font-mono text-xs cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="p-3 bg-[#1f2631] rounded-xl border border-[#30353d]/60 text-xs font-mono text-[#dee2ec]">
                <div>Current Stack Depth: {stackTokens.length} (Max: 5)</div>
                <div className="text-[11px] text-[#bbcabf] mt-1">
                  Peek (Top Element):{' '}
                  <span className="text-[#4edea3] font-bold">
                    {stackTokens.length > 0 ? stackTokens[stackTokens.length - 1] : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
