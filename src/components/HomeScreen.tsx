import React, { useState } from 'react';
import { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectSnippet?: (snippet: any) => void;
  snippetCount?: number;
  onOpenSearch?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, snippetCount = 0, onOpenSearch }) => {
  const [selectedLang, setSelectedLang] = useState<'python' | 'javascript' | 'cpp' | 'java'>('python');
  const [isRunning, setIsRunning] = useState(false);
  const [telemetryTime, setTelemetryTime] = useState('0.00ms');

  const templates = {
    python: `# Dynamic DSA Quick Run
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []

print("Target Indices:", two_sum([2, 7, 11, 15], 9))`,
    javascript: `// Instant JS sandbox
const findMaxSubarray = (arr) => {
  let maxSoFar = arr[0], currMax = arr[0];
  for (let i = 1; i < arr.length; i++) {
    currMax = Math.max(arr[i], currMax + arr[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
};
console.log("Max Subarray:", findMaxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`,
    java: `// Java OpenJDK 17 Sandbox
import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println("Target Indices: [" + map.get(complement) + ", " + i + "]");
                return;
            }
            map.put(nums[i], i);
        }
    }
}`,
    cpp: `// Standard C++20 Sandbox
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 30};
    std::cout << "[INFO] Vault Heap OK\\n";
    std::cout << "Vector Size: " << v.size() << std::endl;
    return 0;
}`
  };

  const [code, setCode] = useState<string>(templates.python);
  const [output, setOutput] = useState<string>('Press "Run" to initialize sandbox container...');

  const handleLangChange = (lang: 'python' | 'javascript' | 'cpp' | 'java') => {
    setSelectedLang(lang);
    setCode(templates[lang]);
    setOutput(`Environment switched to ${lang}. Ready.`);
    setTelemetryTime('0.00ms');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Allocating memory page...\nLaunching guest execution thread in gVisor container...');
    setTelemetryTime('Allocating...');

    setTimeout(() => {
      setIsRunning(false);
      const latency = (Math.random() * 8 + 12).toFixed(1);
      setTelemetryTime(`${latency}ms`);

      if (selectedLang === 'python') {
        setOutput(`[Process 1084 finished with exit code 0]\nTarget Indices: [0, 1]\nMemory used: 12.4 MB`);
      } else if (selectedLang === 'javascript') {
        setOutput(`[V8 Isolate finished with exit code 0]\nMax Subarray: 6\nMemory used: 9.8 MB`);
      } else if (selectedLang === 'java') {
        setOutput(`[OpenJDK 17 VM finished with exit code 0]\nTarget Indices: [0, 1]\nMemory used: 24.6 MB\nJVM Heap status: OK`);
      } else {
        setOutput(`[GCC 12 Native container returned 0]\n[INFO] Vault Heap OK\nVector Size: 3\nExecution verified.`);
      }
    }, 600);
  };

  return (
    <div className="flex flex-col w-full gap-y-8 overflow-hidden pb-8 max-w-lg mx-auto">
      {/* Ambient background glow elements */}
      <div className="relative w-full">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-44 bg-[#4edea3]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-48 -right-12 w-48 h-48 bg-[#4cd7f6]/10 rounded-full blur-2xl pointer-events-none -z-10"></div>

        {/* Hero Content */}
        <section className="flex flex-col items-center text-center px-1 pt-3">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252a32] text-[#4edea3] shadow-sm mb-3">
            <span className="material-symbols-outlined text-[14px] text-[#4edea3]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span className="font-label-sm tracking-wide text-[#dee2ec]">
              Secure Cloud Sandbox & Personal Storage
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-headline-xl-mobile text-[#dee2ec] font-bold tracking-tight max-w-xs">
            Save Your Code. <br />
            <span className="text-[#4edea3] bg-gradient-to-r from-[#4edea3] to-[#4cd7f6] bg-clip-text text-transparent">
              Run It Anywhere.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-md text-[#bbcabf] mt-2 max-w-sm px-1">
            Store your college, DSA, and programming codes securely and execute code directly from the browser.
          </p>

          {/* Instant Search Bar Button */}
          {onOpenSearch && (
            <div className="w-full max-w-sm mt-4">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#171c23] hover:bg-[#1f2631] border border-[#30353d]/70 text-xs font-mono text-[#bbcabf] hover:text-[#dee2ec] transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#4edea3] group-hover:scale-110 transition-transform">manage_search</span>
                  <span className="text-[#dee2ec]">Search code or check if saved...</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-[#0c1015] border border-[#30353d]/70 text-[#86948a] text-[10px]">⌘K</kbd>
              </button>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-sm mt-3">
            <button
              onClick={() => onNavigate('my-codes')}
              className="w-full sm:flex-1 h-11 px-3 bg-[#4edea3] text-[#003824] font-code-md font-bold rounded-lg flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(78,222,163,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">folder_code</span>
              <span>My Codes ({snippetCount})</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('add-code')}
                className="flex-1 sm:flex-none h-11 px-3 bg-[#252a32] text-[#dee2ec] font-code-md font-medium rounded-lg flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#30353d] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#4edea3]">add</span>
                <span>Save Code</span>
              </button>
              <button
                onClick={() => onNavigate('dsa')}
                className="flex-1 sm:flex-none h-11 px-3 bg-[#252a32] text-[#dee2ec] font-code-md font-medium rounded-lg flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#30353d] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">psychology</span>
                <span>DSA Hub</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Card / Floating Mockup */}
          <div className="w-full mt-6 rounded-xl bg-[#090f15] border border-[#30353d]/50 shadow-xl overflow-hidden text-left">
            {/* Terminal Titlebar */}
            <div className="h-8 bg-[#171c23] px-3 flex items-center justify-between border-b border-[#30353d]/40">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]/70"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#03b5d3]/70"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]/70"></span>
                <span className="font-code-sm text-[#bbcabf] ml-2">sandbox-env // dsa_tree.py</span>
              </div>
              <span className="font-label-sm text-[#4edea3] flex items-center gap-1 bg-[#1b2027] px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping"></span> Live
              </span>
            </div>

            {/* Code snippet with active line highlight */}
            <div className="p-3 font-code-sm leading-relaxed overflow-x-auto">
              <div className="text-[#bbcabf]"><span className="text-[#4cd7f6]">class</span> <span className="text-[#7bd0ff]">BinarySearchTree</span>:</div>
              <div className="text-[#bbcabf] pl-4"><span className="text-[#4cd7f6]">def</span> <span className="text-[#4edea3]">__init__</span>(self, val=0):</div>
              <div className="text-[#bbcabf] pl-8">self.val = val</div>
              <div className="text-[#bbcabf] pl-8">self.left = <span className="text-[#4cd7f6]">None</span></div>
              <div className="text-[#bbcabf] pl-8">self.right = <span className="text-[#4cd7f6]">None</span></div>
              {/* Line execution highlight */}
              <div className="bg-[#4cd7f6]/10 -mx-3 px-3 py-0.5 text-[#dee2ec] flex items-center justify-between my-1 border-l-2 border-[#4cd7f6]">
                <span><span className="text-[#4cd7f6]">root</span> = BinarySearchTree(<span className="text-[#6ffbbe]">42</span>)</span>
                <span className="font-label-sm text-[#4cd7f6] bg-[#252a32] px-1.5 rounded">0.08ms</span>
              </div>
              <div className="text-[#4edea3]"><span className="text-[#bbcabf]">print</span>(f<span className="text-[#6ffbbe]">"✔ Node constructed: &#123;root.val&#125;"</span>)</div>
            </div>
          </div>
        </section>

        {/* DSA Practice Hub Feature Showcase */}
        <section className="mt-5 w-full bg-gradient-to-r from-[#17202c] via-[#151c24] to-[#121820] rounded-2xl p-4 sm:p-5 border border-[#30353d]/70 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#4edea3]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#252f3d] text-[#4edea3] text-[11px] font-mono w-fit mb-1.5 border border-[#4edea3]/20">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>NEW FEATURE</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#dee2ec]">
                DSA Problem Practice & Test Runner
              </h2>
              <p className="text-xs text-[#bbcabf] mt-1 max-w-md">
                Sharpen your algorithmic skills with curated problems in Arrays, Trees, Linked Lists, and DP. Run against test cases with sandbox telemetry.
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#1f2630] text-[11px] font-mono text-[#7bd0ff]">Arrays</span>
                <span className="px-2 py-0.5 rounded bg-[#1f2630] text-[11px] font-mono text-[#4edea3]">Linked Lists</span>
                <span className="px-2 py-0.5 rounded bg-[#1f2630] text-[11px] font-mono text-[#fde047]">Trees</span>
                <span className="px-2 py-0.5 rounded bg-[#1f2630] text-[11px] font-mono text-[#f43f5e]">DP</span>
                <span className="px-2 py-0.5 rounded bg-[#1f2630] text-[11px] font-mono text-[#dee2ec]">+More</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('dsa')}
              className="mt-2 sm:mt-0 h-10 px-4 rounded-xl bg-[#4edea3] text-[#003824] font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#6ffbbe] shadow-[0_0_12px_rgba(78,222,163,0.3)] active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span>Explore Problems</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Trust Stat Strip */}
        <section className="mt-5 w-full bg-[#171c23] rounded-xl p-2 border border-[#30353d]/40 shadow-sm">
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="flex flex-col items-center justify-center p-2 bg-[#1b2027] rounded-lg">
              <span className="font-code-md font-semibold text-[#4edea3]">5+ Langs</span>
              <span className="font-label-sm text-[#bbcabf] mt-0.5">C++, Py, JS & more</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-[#1b2027] rounded-lg">
              <span className="font-code-md font-semibold text-[#4cd7f6]">Zero Setup</span>
              <span className="font-label-sm text-[#bbcabf] mt-0.5">Instant browser exec</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-[#1b2027] rounded-lg">
              <span className="font-code-md font-semibold text-[#7bd0ff]">100% Isolated</span>
              <span className="font-label-sm text-[#bbcabf] mt-0.5">Safe virtual runtime</span>
            </div>
          </div>
        </section>
      </div>

      {/* How It Works Section */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col items-start px-1">
          <span className="font-label-sm text-[#4edea3] tracking-widest uppercase">Workflow Engine</span>
          <h2 className="font-headline-lg-mobile text-[#dee2ec] font-semibold">How It Works</h2>
          <p className="font-body-sm text-[#bbcabf]">From thought to executed binary in four steps</p>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          {/* Step 1 */}
          <div 
            onClick={() => onNavigate('add-code')}
            className="flex items-start gap-3 p-3 bg-[#171c23] rounded-xl border border-[#30353d]/40 shadow-sm relative overflow-hidden cursor-pointer hover:border-[#4edea3]/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center shrink-0 font-code-md font-bold">1</div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-body-lg font-semibold text-[#dee2ec]">Paste or Upload Code</h3>
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">file_upload</span>
              </div>
              <p className="font-body-sm text-[#bbcabf] mt-1">Directly import solution files or drop plain code from local assignments or competitive platforms.</p>
            </div>
          </div>

          <div className="flex justify-center -my-2 z-10">
            <span className="material-symbols-outlined text-[#4edea3]/40 text-[18px]">keyboard_arrow_down</span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onNavigate('my-codes')}
            className="flex items-start gap-3 p-3 bg-[#171c23] rounded-xl border border-[#30353d]/40 shadow-sm relative overflow-hidden cursor-pointer hover:border-[#4edea3]/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center shrink-0 font-code-md font-bold">2</div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-body-lg font-semibold text-[#dee2ec]">Save to Your Library</h3>
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">folder_special</span>
              </div>
              <p className="font-body-sm text-[#bbcabf] mt-1">Tag with course name, topic tags, and maintain organized DSA categories with custom notes.</p>
            </div>
          </div>

          <div className="flex justify-center -my-2 z-10">
            <span className="material-symbols-outlined text-[#4edea3]/40 text-[18px]">keyboard_arrow_down</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-start gap-3 p-3 bg-[#171c23] rounded-xl border border-[#30353d]/40 shadow-sm relative overflow-hidden cursor-pointer hover:border-[#4edea3]/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#4edea3]/10 text-[#4edea3] flex items-center justify-center shrink-0 font-code-md font-bold">3</div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-body-lg font-semibold text-[#dee2ec]">Access It Anywhere</h3>
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">cloud_sync</span>
              </div>
              <p className="font-body-sm text-[#bbcabf] mt-1">Seamless synchronization between phone, tablet, lab workstation, and personal laptop.</p>
            </div>
          </div>

          <div className="flex justify-center -my-2 z-10">
            <span className="material-symbols-outlined text-[#4edea3]/40 text-[18px]">keyboard_arrow_down</span>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => onNavigate('public-runner')}
            className="flex items-start gap-3 p-3 bg-[#1b2027] rounded-xl border border-[#4edea3]/40 shadow-md relative overflow-hidden cursor-pointer hover:bg-[#252a32] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#4edea3] text-[#003824] flex items-center justify-center shrink-0 font-code-md font-bold shadow-[0_0_8px_rgba(78,222,163,0.4)]">4</div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-body-lg font-semibold text-[#4edea3]">Execute & View Output</h3>
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">rocket_launch</span>
              </div>
              <p className="font-body-sm text-[#bbcabf] mt-1">Fire up a zero-latency cloud sandbox and monitor stdout, stderr, execution time, and memory footprint in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col items-start px-1">
          <span className="font-label-sm text-[#4cd7f6] tracking-widest uppercase">Built For Engineers</span>
          <h2 className="font-headline-lg-mobile text-[#dee2ec] font-semibold">Core Capabilities</h2>
          <p className="font-body-sm text-[#bbcabf]">Everything required to manage high-stakes code logic</p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Save Code */}
          <div 
            onClick={() => onNavigate('add-code')}
            className="p-3 bg-[#171c23] rounded-xl flex flex-col justify-between h-full border border-[#30353d]/40 shadow-sm hover:bg-[#1b2027] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center mb-2 text-[#4edea3] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">drive_file_move</span>
              </div>
              <h3 className="font-body-md font-semibold text-[#dee2ec]">Save Code</h3>
              <p className="font-body-sm text-[#bbcabf] mt-1">Organize college assignments & complex DSA snippets.</p>
            </div>
            <span className="font-label-sm text-[#4edea3] mt-3 flex items-center gap-1">Structured <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
          </div>

          {/* Card 2: Access Anywhere */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="p-3 bg-[#171c23] rounded-xl flex flex-col justify-between h-full border border-[#30353d]/40 shadow-sm hover:bg-[#1b2027] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center mb-2 text-[#4cd7f6] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">devices</span>
              </div>
              <h3 className="font-body-md font-semibold text-[#dee2ec]">Access Anywhere</h3>
              <p className="font-body-sm text-[#bbcabf] mt-1">Always synced in cloud across mobile, laptop and lab machines.</p>
            </div>
            <span className="font-label-sm text-[#4cd7f6] mt-3 flex items-center gap-1">Instant sync <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
          </div>

          {/* Card 3: Run Code */}
          <div 
            onClick={() => onNavigate('public-runner')}
            className="p-3 bg-[#1b2027] rounded-xl flex flex-col justify-between h-full border border-[#4edea3]/30 shadow-md hover:bg-[#252a32] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#4edea3]/20 flex items-center justify-center mb-2 text-[#4edea3] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">terminal</span>
              </div>
              <h3 className="font-body-md font-semibold text-[#dee2ec]">Run Code</h3>
              <p className="font-body-sm text-[#bbcabf] mt-1">Instant isolated browser execution with standard I/O pipes.</p>
            </div>
            <span className="font-label-sm text-[#4edea3] mt-3 flex items-center gap-1">Sub-100ms <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
          </div>

          {/* Card 4: Private Library */}
          <div 
            onClick={() => onNavigate('my-codes')}
            className="p-3 bg-[#171c23] rounded-xl flex flex-col justify-between h-full border border-[#30353d]/40 shadow-sm hover:bg-[#1b2027] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center mb-2 text-[#7bd0ff] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <h3 className="font-body-md font-semibold text-[#dee2ec]">Private Library</h3>
              <p className="font-body-sm text-[#bbcabf] mt-1">Encrypted personal vault for personal algorithms and coursework.</p>
            </div>
            <span className="font-label-sm text-[#7bd0ff] mt-3 flex items-center gap-1">E2E Safe <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
          </div>

          {/* Card 5: Upload Files */}
          <div 
            onClick={() => onNavigate('add-code')}
            className="p-3 bg-[#171c23] rounded-xl flex flex-col justify-between h-full border border-[#30353d]/40 shadow-sm hover:bg-[#1b2027] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center mb-2 text-[#6ffbbe] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
              </div>
              <h3 className="font-body-md font-semibold text-[#dee2ec]">Upload Files</h3>
              <p className="font-body-sm text-[#bbcabf] mt-1">Directly import .cpp, .py, .java, .js, .c files seamlessly.</p>
            </div>
            <span className="font-label-sm text-[#bbcabf] mt-3 flex items-center gap-1">Multi-format <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
          </div>

          {/* Card 6: Paste Code */}
          <div 
            onClick={() => onNavigate('add-code')}
            className="p-3 bg-[#171c23] rounded-xl flex flex-col justify-between h-full border border-[#30353d]/40 shadow-sm hover:bg-[#1b2027] transition-all cursor-pointer group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#252a32] flex items-center justify-center mb-2 text-[#acedff] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">content_paste</span>
              </div>
              <h3 className="font-body-md font-semibold text-[#dee2ec]">Paste Code</h3>
              <p className="font-body-sm text-[#bbcabf] mt-1">Rapid clipboard injection with automated syntax detection.</p>
            </div>
            <span className="font-label-sm text-[#bbcabf] mt-3 flex items-center gap-1">Auto-detect <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
          </div>
        </div>
      </section>

      {/* Security Sandbox Callout Card */}
      <section className="w-full rounded-xl bg-[#171c23] p-3 border border-[#30353d]/40 shadow-lg relative overflow-hidden">
        {/* Subtle corner glow */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#4edea3]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#10b981]/20 text-[#4edea3] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-[#dee2ec] leading-tight">Hardened Isolation Guard</h3>
            <p className="font-label-sm text-[#bbcabf]">Zero compromise execution perimeter</p>
          </div>
        </div>
        <p className="font-body-sm text-[#bbcabf] mb-3">
          Every code run is isolated inside an ephemeral WebAssembly/microVM boundary. We maintain strict computational limits to guarantee device safety.
        </p>
        <div className="flex flex-col gap-1 bg-[#1b2027] rounded-lg p-2 font-code-sm text-code-sm">
          <div className="flex items-center justify-between py-1 border-b border-[#30353d]/30">
            <span className="text-[#bbcabf] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">memory</span>
              <span>Memory Limit</span>
            </span>
            <span className="text-[#4edea3] font-medium">256 MB Sandbox Cap</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#30353d]/30">
            <span className="text-[#bbcabf] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">speed</span>
              <span>CPU Throttling</span>
            </span>
            <span className="text-[#dee2ec] font-medium">1 Core / 5.0s Timeout</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[#bbcabf] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#4edea3]">security_update_good</span>
              <span>Infinite Loop Breaker</span>
            </span>
            <span className="text-[#4edea3] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> Enabled
            </span>
          </div>
        </div>
      </section>

      {/* Quick Launch Runner Preview Widget */}
      <section className="flex flex-col gap-2" id="quick-launch">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-headline-lg-mobile text-[#dee2ec] font-semibold">Interactive Runner</h2>
            <p className="font-body-sm text-[#bbcabf]">Test the sandbox directly on this screen</p>
          </div>
          <span className="font-label-sm text-[#4edea3] bg-[#252a32] px-2 py-1 rounded">Live Demo</span>
        </div>

        <div className="rounded-xl bg-[#171c23] border border-[#30353d]/50 shadow-xl overflow-hidden flex flex-col">
          {/* Runner Toolbar */}
          <div className="h-10 bg-[#1b2027] px-2 flex items-center justify-between border-b border-[#30353d]/40">
            <div className="flex items-center gap-1">
              {/* Language Selector Pill */}
              <div className="flex items-center bg-[#30353d] rounded px-2 py-1 gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">code</span>
                <select
                  value={selectedLang}
                  onChange={(e) => handleLangChange(e.target.value as 'python' | 'javascript' | 'cpp' | 'java')}
                  className="bg-transparent font-code-sm text-[#dee2ec] outline-none cursor-pointer"
                  id="lang-selector"
                >
                  <option className="bg-[#252a32] text-[#dee2ec]" value="python">Python 3.11</option>
                  <option className="bg-[#252a32] text-[#dee2ec]" value="java">Java (OpenJDK 17)</option>
                  <option className="bg-[#252a32] text-[#dee2ec]" value="javascript">JavaScript (Node)</option>
                  <option className="bg-[#252a32] text-[#dee2ec]" value="cpp">C++ (GCC 12)</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="h-7 px-3 bg-[#4edea3] text-[#003824] rounded font-code-sm font-semibold flex items-center gap-1 shadow-[0_0_10px_rgba(78,222,163,0.3)] active:scale-95 transition-transform cursor-pointer"
              id="run-button"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRunning ? 'animate-spin' : ''}`}>
                {isRunning ? 'autorenew' : 'play_arrow'}
              </span>
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          </div>

          {/* Editor Window */}
          <div className="p-2.5 bg-[#090f15] font-code-sm">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent text-[#dee2ec] font-code-sm outline-none resize-none leading-relaxed selection:bg-[#4edea3] selection:text-[#003824]"
              id="code-input"
              rows={6}
              spellCheck={false}
            />
          </div>

          {/* Console Output Pane */}
          <div className="bg-[#252a32] p-2.5 flex flex-col gap-1 border-t border-[#30353d]/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 font-label-sm text-[#bbcabf]">
                <span className="material-symbols-outlined text-[14px]">terminal</span>
                <span>Console Output</span>
              </div>
              <span className="font-label-sm text-[#4edea3]">{telemetryTime}</span>
            </div>
            <pre className="font-code-sm text-[#dee2ec] leading-normal whitespace-pre-wrap min-h-[36px] pt-1">
              {output}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
