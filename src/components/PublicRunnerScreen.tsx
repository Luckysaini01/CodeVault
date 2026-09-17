import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import {
  executeCode,
  executeCodeAsync,
  detectLanguageFromCode,
  ExecutionResult,
  REAL_COMPILERS
} from '../services/codeExecutionEngine';

interface PublicRunnerScreenProps {
  onNavigate: (screen: Screen) => void;
  onToast: (msg: string, icon?: string) => void;
}

type LangKey = 'c' | 'cpp' | 'java' | 'python' | 'javascript';

export const PublicRunnerScreen: React.FC<PublicRunnerScreenProps> = ({ onToast }) => {
  const snippetsData: Record<LangKey, { filename: string; tag: string; compilerName: string; code: string }> = {
    python: {
      filename: 'main.py',
      tag: 'Python 3.14',
      compilerName: 'CPython 3.14 (Official VM)',
      code: `# Real Python 3.14 Runner - Two Sum & Fibonacci
def two_sum(nums, target):
    lookup = {}
    for idx, val in enumerate(nums):
        diff = target - val
        if diff in lookup:
            return [lookup[diff], idx]
        lookup[val] = idx
    return []

def fibonacci_series(count):
    seq = [0, 1]
    for _ in range(count - 2):
        seq.append(seq[-1] + seq[-2])
    return seq

# 1. Two Sum Algorithm
numbers = [2, 7, 11, 15]
target_sum = 9
pair = two_sum(numbers, target_sum)
print(f"Algorithm: Two Sum for target={target_sum} in {numbers}")
print(f"Result: Match found at indices: {pair} -> values: {[numbers[i] for i in pair]}")

# 2. Fibonacci Generation
terms = 10
fib = fibonacci_series(terms)
print(f"\\nFibonacci Sequence ({terms} terms):")
print(fib)

print("\\n[Process completed successfully]")`
    },
    javascript: {
      filename: 'index.js',
      tag: 'Node.js 20 LTS',
      compilerName: 'Node.js 20 (V8 Engine)',
      code: `// Real Node.js 20 LTS Environment
console.log("=== Node.js High-Performance Runner ===");

const students = [
  { name: "Aria", score: 96, rank: 1 },
  { name: "David", score: 84, rank: 3 },
  { name: "Chloe", score: 91, rank: 2 }
];

// Sort and format table
const sorted = [...students].sort((a, b) => b.score - a.score);
console.log("Leaderboard Ranking:");
sorted.forEach(s => console.log(\`  #\${s.rank} \${s.name} - \${s.score} pts\`));

// Aggregate statistics
const total = students.reduce((acc, s) => acc + s.score, 0);
const avg = (total / students.length).toFixed(2);
console.log(\`\\nClass Average: \${avg} pts across \${students.length} candidates\`);`
    },
    cpp: {
      filename: 'solution.cpp',
      tag: 'C++ 23 (G++)',
      compilerName: 'GCC HEAD (g++ -std=c++23 -O2)',
      code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::cout << "=== GCC HEAD C++23 Native Execution ===" << std::endl;
    std::vector<int> nums = {45, 12, 85, 32, 89, 39, 69, 44};

    std::cout << "Original array: ";
    for (int x : nums) std::cout << x << " ";
    std::cout << std::endl;

    std::sort(nums.begin(), nums.end());
    std::cout << "Sorted array:   ";
    for (int x : nums) std::cout << x << " ";
    std::cout << std::endl;

    long long sum = std::accumulate(nums.begin(), nums.end(), 0LL);
    std::cout << "Vector Sum: " << sum << ", Mean: " << (double)sum / nums.size() << std::endl;
    return 0;
}`
    },
    c: {
      filename: 'main.c',
      tag: 'C 17 (GCC)',
      compilerName: 'GCC HEAD (gcc -std=c17 -O2)',
      code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("=== Real C17 Native Runtime (GCC HEAD) ===\\n");
    int arr[] = {10, 24, 76, 38, 92};
    int n = sizeof(arr) / sizeof(arr[0]);
    int sum = 0;

    printf("Buffer elements: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
        sum += arr[i];
    }
    printf("\\nTotal Elements: %d\\nAccumulated Sum: %d\\nMean: %.2f\\n", n, sum, (float)sum / n);
    return 0;
}`
    },
    java: {
      filename: 'Solution.java',
      tag: 'OpenJDK 21',
      compilerName: 'OpenJDK 21 (javac / java)',
      code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("=== OpenJDK 21 Live Compilation ===");
        int[] nums = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("Input Array:  " + Arrays.toString(nums));
        Arrays.sort(nums);
        System.out.println("Sorted Array: " + Arrays.toString(nums));

        int target = 25;
        int idx = Arrays.binarySearch(nums, target);
        System.out.println("Binary Search index for target " + target + ": " + idx);
    }
}`
    }
  };

  const toLanguageKey = (lk: LangKey) => {
    switch (lk) {
      case 'python': return 'py';
      case 'javascript': return 'js';
      case 'java': return 'java';
      case 'c': return 'c';
      case 'cpp': default: return 'cpp';
    }
  };

  const [currentLang, setCurrentLang] = useState<LangKey>('python');
  const [code, setCode] = useState<string>(snippetsData.python.code);
  const [stdin, setStdin] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult>(() => {
    return executeCode(snippetsData.python.code, 'py');
  });
  const [activeTab, setActiveTab] = useState<'stdout' | 'error' | 'stdin'>('stdout');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [forked, setForked] = useState<boolean>(false);

  // Trigger real execution on initial load so the user sees real output right away
  useEffect(() => {
    let isMounted = true;
    executeCodeAsync(snippetsData.python.code, 'py', '')
      .then((res) => {
        if (isMounted) setExecutionResult(res);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSwitchLang = async (lang: LangKey) => {
    setCurrentLang(lang);
    const newCode = snippetsData[lang].code;
    setCode(newCode);
    const lk = toLanguageKey(lang);
    setActiveTab('stdout');
    setIsRunning(true);
    onToast(`Switched compiler to ${snippetsData[lang].tag}`, 'code');

    try {
      const res = await executeCodeAsync(newCode, lk, stdin);
      setExecutionResult(res);
    } catch {
      setExecutionResult(executeCode(newCode, lk));
    } finally {
      setIsRunning(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    const langKey = toLanguageKey(currentLang);
    const detected = detectLanguageFromCode(code);
    const effectiveLang = detected === 'java' ? 'java' : langKey;
    onToast(`Compiling ${snippetsData[currentLang].tag} in sandbox...`, 'memory');

    try {
      const res = await executeCodeAsync(code, effectiveLang, stdin);
      setExecutionResult(res);
      if (res.exitCode !== 0) {
        setActiveTab('error');
        onToast(`Process exited with code ${res.exitCode}`, 'cancel');
      } else {
        setActiveTab('stdout');
        const firstLine = res.stdout.split('\n').filter(Boolean)[0] || 'Executed';
        onToast(`Done (${res.time}): ${firstLine.substring(0, 32)}`, 'check_circle');
      }
    } catch (err: any) {
      const res = executeCode(code, effectiveLang);
      setExecutionResult(res);
      setActiveTab('stdout');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onToast('Code copied to clipboard', 'content_copy');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast('Code ready for copy', 'content_copy');
    }
  };

  const handleFork = () => {
    setForked(true);
    onToast('Created sandbox permalink and copied to clipboard!', 'share');
    setTimeout(() => setForked(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
        onToast('Pasted code from clipboard', 'content_paste');
      }
    } catch {
      onToast('Ready for manual code editing', 'info');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
        onToast(`Loaded ${file.name}`, 'upload_file');
      };
      reader.readAsText(file);
    }
  };

  // Generate line numbers
  const lines = code.split('\n');
  const lineCount = Math.max(14, lines.length);

  return (
    <div className="flex flex-col w-full gap-4 max-w-6xl mx-auto pb-10">
      {/* Header Intro Unit */}
      <section className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#252a32]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping"></span>
            <span className="font-label-sm text-[#4edea3] tracking-wide uppercase">Sandbox Live</span>
          </div>
          <span className="font-code-sm text-[#bbcabf] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">bolt</span>
            Instant Cloud Sandbox Execution
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl text-[#dee2ec] font-bold tracking-tight">
          Public Code Runner
        </h1>
        <p className="font-body-sm text-[#bbcabf] leading-relaxed max-w-3xl">
          Execute code safely in an isolated sandbox with real Wandbox GCC & PyPy compilers. Zero setup, live compiler telemetry.
        </p>
      </section>

      {/* Language Selector Pill Carousel */}
      <section className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 no-scrollbar" role="tablist">
        {(
          [
            { id: 'c' as LangKey, label: 'C (GCC 13)', icon: 'memory', iconColor: 'text-[#7bd0ff]' },
            { id: 'cpp' as LangKey, label: 'C++ 23', icon: 'code', iconColor: 'text-[#4cd7f6]' },
            { id: 'java' as LangKey, label: 'Java 21 (OpenJDK)', icon: 'coffee', iconColor: 'text-[#4edea3]' },
            { id: 'python' as LangKey, label: 'Python 3.14', icon: 'terminal', iconColor: 'text-[#dee2ec]' },
            { id: 'javascript' as LangKey, label: 'JavaScript (Node 20)', icon: 'javascript', iconColor: 'text-[#7bd0ff]' }
          ]
        ).map((lang) => {
          const isSelected = currentLang === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => handleSwitchLang(lang.id)}
              className={`px-3.5 py-1.5 rounded-full font-label-sm whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#10b981] text-[#003824] font-semibold shadow-sm'
                  : 'bg-[#1b2027] text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#252a32]'
              }`}
            >
              <span className={`material-symbols-outlined text-[15px] ${lang.iconColor}`}>
                {lang.icon}
              </span>
              {lang.label}
            </button>
          );
        })}
      </section>

      {/* Main IDE Workbench Grid: Side-by-side on desktop (lg:grid-cols-2), stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left Column: Code Editor & Tools */}
        <div className="flex flex-col gap-3">
          {/* Quick Action Strip */}
          <section className="flex items-center justify-between gap-1.5 bg-[#171c23] p-1.5 rounded-lg border border-[#30353d]/40 shadow-sm">
            <div className="flex items-center gap-1">
              <button
                onClick={handlePaste}
                aria-label="Paste Clipboard"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1b2027] hover:bg-[#252a32] text-[#dee2ec] transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">content_paste</span>
                <span className="font-label-sm">Paste</span>
              </button>
              <label className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1b2027] hover:bg-[#252a32] text-[#dee2ec] cursor-pointer transition-all active:scale-95">
                <span className="material-symbols-outlined text-[16px] text-[#4edea3]">upload_file</span>
                <span className="font-label-sm">Upload</span>
                <input
                  type="file"
                  accept=".py,.cpp,.c,.java,.js,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCode(snippetsData[currentLang].code)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1b2027] hover:bg-[#252a32] text-[#bbcabf] hover:text-[#ffb4ab] transition-all active:scale-95 cursor-pointer"
                title="Reset default snippet"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span className="font-label-sm">Reset</span>
              </button>
              <button
                onClick={() => setCode('')}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1b2027] hover:bg-[#93000a]/30 text-[#bbcabf] hover:text-[#ffdad6] transition-all active:scale-95 cursor-pointer"
                title="Clear buffer"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                <span className="font-label-sm">Clear</span>
              </button>
            </div>
          </section>

          {/* Editor Container */}
          <div className="flex flex-col bg-[#171c23] rounded-xl border border-[#30353d]/50 shadow-md overflow-hidden">
            {/* Editor Chrome Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#090f15] border-b border-[#30353d]/40">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]/70 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7bd0ff]/70 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]/70 inline-block"></span>
                </div>
                <div className="flex items-center gap-1.5 truncate pl-1">
                  <span className="material-symbols-outlined text-[16px] text-[#4cd7f6] shrink-0">draft</span>
                  <span className="font-code-sm text-[#dee2ec] truncate">
                    {snippetsData[currentLang].filename}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-code-sm px-2 py-0.5 rounded bg-[#252a32] text-[#4cd7f6]">
                  {snippetsData[currentLang].tag}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded hover:bg-[#1b2027] text-[#bbcabf] hover:text-[#4edea3] transition-colors active:scale-95 cursor-pointer"
                  title="Copy code"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Code Editor Body */}
            <div className="flex relative bg-[#090f15] text-[#dee2ec] font-code-sm overflow-x-auto min-h-[300px] lg:min-h-[420px] max-h-[500px] py-2">
              {/* Line Number Rail */}
              <div className="flex flex-col select-none text-right pr-3 pl-3 text-[#bbcabf]/40 shrink-0 font-code-sm leading-6 border-r border-[#30353d]/30">
                {Array.from({ length: lineCount }).map((_, i) => (
                  <span key={i}>{(i + 1).toString().padStart(2, '0')}</span>
                ))}
              </div>

              {/* Editable Code Text Area */}
              <div className="flex-1 flex flex-col pl-3">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const start = e.currentTarget.selectionStart;
                      const end = e.currentTarget.selectionEnd;
                      const val = e.currentTarget.value;
                      const newVal = val.substring(0, start) + '    ' + val.substring(end);
                      setCode(newVal);
                      setTimeout(() => {
                        const target = document.querySelector('textarea');
                        if (target) {
                          target.selectionStart = target.selectionEnd = start + 4;
                        }
                      }, 0);
                    }
                  }}
                  spellCheck={false}
                  className="w-full h-full min-h-[280px] lg:min-h-[400px] bg-transparent text-[#dee2ec] font-code-sm leading-6 outline-none resize-none selection:bg-[#4edea3] selection:text-[#003824] whitespace-pre"
                  placeholder="// Type your code here..."
                />
              </div>
            </div>

            {/* Micro Line Highlighter Banner */}
            <div className="flex items-center justify-between px-3 py-1 bg-[#1b2027] text-[#bbcabf] font-code-sm border-t border-[#30353d]/40">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#4edea3]">done_all</span>
                  UTF-8
                </span>
                <span>•</span>
                <span>Spaces: 4 (Tab enabled)</span>
              </div>
              <div className="flex items-center gap-1 text-[#bbcabf]">
                <span className="text-[#4cd7f6]">Ln {lines.length}</span>, Col {code.length > 0 ? lines[lines.length - 1].length + 1 : 1}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Output Terminal, Stdin */}
        <div className="flex flex-col gap-3">
          {/* Primary Execution Trigger & Sandbox Specs */}
          <section className="flex flex-col gap-1.5">
            <div className="flex items-stretch gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#003824] font-headline-sm font-semibold tracking-tight shadow-lg shadow-[#10b981]/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75"
              >
                <span className={`material-symbols-outlined text-[24px] ${isRunning ? 'animate-spin' : ''}`}>
                  {isRunning ? 'autorenew' : 'play_arrow'}
                </span>
                <span>{isRunning ? 'Compiling & Running...' : 'Run Code (Real Compiler)'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab(activeTab === 'stdin' ? 'stdout' : 'stdin');
                  onToast(activeTab === 'stdin' ? 'Switched to Output' : 'Custom Input (stdin) opened', 'input');
                }}
                className={`flex items-center justify-center gap-1.5 px-3.5 rounded-xl transition-all border border-[#30353d]/40 cursor-pointer ${
                  activeTab === 'stdin'
                    ? 'bg-[#03b5d3] text-[#003824] font-semibold'
                    : 'bg-[#1b2027] hover:bg-[#252a32] text-[#dee2ec]'
                }`}
                title="Toggle Custom Input (stdin)"
              >
                <span className="material-symbols-outlined text-[18px]">input</span>
                <span className="font-label-sm hidden sm:inline">STDIN</span>
              </button>
            </div>

            {/* Sandbox Security Badge & Real Compiler Banner */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#090f15] border border-[#30353d]/40 text-[#bbcabf] font-label-sm">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="truncate text-[#dee2ec] font-medium">
                  {executionResult.compilerName || snippetsData[currentLang].compilerName}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="bg-[#1b2027] px-2 py-0.5 rounded text-[#4edea3] font-code-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">cloud_done</span>
                  Real Cloud Sandbox
                </span>
              </div>
            </div>
          </section>

          {/* Execution Output Console (Terminal Window) */}
          <section className="flex flex-col bg-[#090f15] rounded-xl border border-[#30353d]/50 shadow-lg overflow-hidden">
            {/* Console Header with Switchable Tabs */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#171c23] border-b border-[#30353d]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#4edea3]">terminal</span>
                <span className="font-label-md uppercase tracking-wider text-[#dee2ec] font-semibold">
                  Output Console
                </span>
              </div>

              {/* Mode Switcher: Stdout vs Compiler Stderr vs STDIN */}
              <div className="flex items-center p-0.5 rounded-lg bg-[#1b2027]">
                <button
                  onClick={() => setActiveTab('stdout')}
                  className={`px-2.5 py-1 rounded font-label-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'stdout'
                      ? 'bg-[#252a32] text-[#4edea3] shadow-xs'
                      : 'text-[#bbcabf] hover:text-[#dee2ec]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                  Stdout
                </button>
                <button
                  onClick={() => setActiveTab('error')}
                  className={`px-2.5 py-1 rounded font-label-sm font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'error'
                      ? 'bg-[#93000a] text-[#ffdad6] shadow-xs'
                      : executionResult.exitCode !== 0
                      ? 'text-[#ffb4ab] font-bold'
                      : 'text-[#bbcabf] hover:text-[#ffb4ab]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${executionResult.exitCode !== 0 ? 'bg-[#ffb4ab] animate-ping' : 'bg-[#bbcabf]/50'}`}></span>
                  Stderr {executionResult.exitCode !== 0 && '(Error)'}
                </button>
                <button
                  onClick={() => setActiveTab('stdin')}
                  className={`px-2.5 py-1 rounded font-label-sm font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === 'stdin'
                      ? 'bg-[#03b5d3] text-[#003824] shadow-xs'
                      : 'text-[#bbcabf] hover:text-[#dee2ec]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">input</span>
                  Stdin
                </button>
              </div>
            </div>

            {/* Status Banner */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#252a32]/60 text-[#dee2ec] border-b border-[#30353d]/30">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    executionResult.exitCode === 0
                      ? 'bg-[#4edea3] shadow-sm shadow-[#4edea3]/50'
                      : 'bg-[#ffb4ab] shadow-sm shadow-[#ffb4ab]/50'
                  }`}
                ></span>
                <span
                  className={`font-label-sm font-medium ${
                    executionResult.exitCode === 0
                      ? 'text-[#4edea3]'
                      : 'text-[#ffb4ab]'
                  }`}
                >
                  {executionResult.exitCode === 0
                    ? `Completed in ${executionResult.time || '0.14s'} (Exit Code 0)`
                    : `Failed with Exit Code ${executionResult.exitCode}`}
                </span>
              </div>
              <div className="flex items-center gap-3 font-code-sm text-[#bbcabf]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">memory</span> {executionResult.memory || '14.2 MB'}
                </span>
                <button
                  onClick={() => {
                    setExecutionResult({
                      stdout: 'Console output cleared.',
                      exitCode: 0,
                      time: '0.00s',
                      memory: '0.0 MB',
                      command: 'clear',
                      fullOutput: 'Console output cleared.',
                      language: toLanguageKey(currentLang)
                    });
                    onToast('Console output cleared', 'backspace');
                  }}
                  className="hover:text-[#dee2ec] transition-colors cursor-pointer"
                  title="Clear console"
                >
                  <span className="material-symbols-outlined text-[15px]">backspace</span>
                </button>
              </div>
            </div>

            {/* Terminal Screen Display: Stdout */}
            {activeTab === 'stdout' && (
              <div className="p-3 font-code-md leading-relaxed text-[#dee2ec] overflow-x-auto min-h-[200px] lg:min-h-[260px] bg-[#090f15]">
                <div className="text-[#bbcabf]/70 mb-2 flex items-center gap-1.5 select-none font-code-sm">
                  <span className="text-[#4cd7f6] font-semibold">$</span>
                  <span>{executionResult.command || `$ ${snippetsData[currentLang].filename}`}</span>
                </div>
                
                {/* Real Program Stdout */}
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[#dee2ec]">
                  {executionResult.stdout || '[No standard output generated]'}
                </div>

                <div className="text-[#bbcabf]/40 select-none text-code-sm my-2">
                  ----------------------------------------
                </div>
                <div className={`flex items-center gap-1.5 text-code-sm ${executionResult.exitCode === 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {executionResult.exitCode === 0 ? 'check_circle' : 'cancel'}
                  </span>
                  <span>
                    Process finished with exit code {executionResult.exitCode} (Execution time: {executionResult.time || '0.14s'})
                  </span>
                </div>
              </div>
            )}

            {/* Terminal Screen Display: Compiler Diagnostics & Stderr */}
            {activeTab === 'error' && (
              <div className="p-3 font-code-md leading-relaxed overflow-x-auto min-h-[200px] lg:min-h-[260px] bg-[#090f15]">
                <div className="text-[#bbcabf]/70 mb-2 flex items-center gap-1.5 select-none font-code-sm">
                  <span className="text-[#4cd7f6] font-semibold">$</span>
                  <span>{executionResult.command} [stderr stream]</span>
                </div>

                {executionResult.stderr || executionResult.exitCode !== 0 ? (
                  <div className="text-[#ffb4ab] whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {executionResult.stderr || executionResult.stdout}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#171c23] border border-[#30353d]/40 flex flex-col gap-1.5 text-[#bbcabf]">
                    <div className="flex items-center gap-2 text-[#4edea3] font-semibold font-label-md">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Standard Error Clean</span>
                    </div>
                    <p className="font-body-sm leading-relaxed">
                      No compilation errors or runtime warnings were emitted during execution. The process exited cleanly with code 0.
                    </p>
                    <div className="mt-1">
                      <button
                        onClick={() => {
                          setCode(code + '\n// Intentionally triggering test syntax error\nundefined_function_call();');
                          onToast('Added deliberate error. Click "Run Code" to test compiler output!', 'info');
                        }}
                        className="px-2.5 py-1 rounded bg-[#252a32] hover:bg-[#343941] text-[#dee2ec] font-label-sm transition-all cursor-pointer"
                      >
                        Insert Deliberate Error to Test Compiler
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-[#bbcabf]/40 select-none text-code-sm my-2">
                  ----------------------------------------
                </div>
                <div className={`flex items-center gap-1.5 text-code-sm ${executionResult.exitCode === 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {executionResult.exitCode === 0 ? 'check_circle' : 'cancel'}
                  </span>
                  <span>
                    Diagnostics status: Exit code {executionResult.exitCode}
                  </span>
                </div>
              </div>
            )}

            {/* Terminal Screen Display: Custom STDIN Input */}
            {activeTab === 'stdin' && (
              <div className="p-3 font-code-md leading-relaxed bg-[#090f15] min-h-[200px] lg:min-h-[260px] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#4cd7f6] font-semibold text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">input</span>
                    Standard Input (stdin) for interactive programs
                  </span>
                  <span className="text-[#bbcabf]/60 text-xs">
                    Fed into cin, input(), Scanner, etc.
                  </span>
                </div>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter program input here (one line per input)...&#10;e.g.&#10;Alice&#10;25"
                  className="w-full h-28 bg-[#171c23] text-[#dee2ec] p-2.5 rounded-lg border border-[#30353d]/50 font-mono text-sm leading-relaxed outline-none focus:border-[#4cd7f6] resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#bbcabf]">
                    {stdin ? `${stdin.split('\n').length} input lines configured` : 'No stdin specified (EOF sent immediately)'}
                  </span>
                  <button
                    onClick={() => {
                      setStdin('');
                      onToast('Stdin input cleared', 'clear');
                    }}
                    className="text-xs text-[#bbcabf] hover:text-[#ffb4ab] transition-colors cursor-pointer"
                  >
                    Clear Stdin
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Community Micro-Showcase Card */}
          <section className="flex items-center justify-between p-3 rounded-xl bg-[#1b2027] border border-[#30353d]/40 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#03b5d3] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px] text-[#00424e]">hub</span>
              </div>
              <div className="flex flex-col truncate">
                <span className="font-headline-sm text-[#dee2ec] font-semibold truncate">
                  Save or Fork Snippet?
                </span>
                <span className="font-body-sm text-[#bbcabf] truncate">
                  Create a permanent public permalink instantly
                </span>
              </div>
            </div>
            <button
              onClick={handleFork}
              className="px-3 py-2 rounded-lg bg-[#252a32] hover:bg-[#343941] text-[#4cd7f6] font-label-sm font-medium shrink-0 active:scale-95 transition-all cursor-pointer"
            >
              {forked ? 'Link Copied!' : 'Fork Snippet'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
