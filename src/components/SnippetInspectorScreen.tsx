import React, { useState, useEffect } from 'react';
import { Screen, Snippet } from '../types';
import {
  executeCode,
  executeCodeAsync,
  detectLanguageFromCode,
  ExecutionResult
} from '../services/codeExecutionEngine';

interface SnippetInspectorScreenProps {
  snippet: Snippet;
  onNavigate: (screen: Screen) => void;
  onDelete: (id: string) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const SnippetInspectorScreen: React.FC<SnippetInspectorScreenProps> = ({
  snippet,
  onNavigate,
  onDelete,
  onToast
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(4);

  // Auto-detect dialect if it's Java (e.g. user pasted Java code)
  const effectiveLang = snippet.language === 'java' || detectLanguageFromCode(snippet.code) === 'java'
    ? 'java'
    : snippet.language;

  // Real-time execution output
  const [executionResult, setExecutionResult] = useState<ExecutionResult>(() => {
    return executeCode(snippet.code, effectiveLang);
  });

  useEffect(() => {
    let isMounted = true;
    executeCodeAsync(snippet.code, effectiveLang)
      .then((res) => {
        if (isMounted) setExecutionResult(res);
      })
      .catch(() => {
        if (isMounted) setExecutionResult(executeCode(snippet.code, effectiveLang));
      });

    return () => {
      isMounted = false;
    };
  }, [snippet.id, snippet.code, effectiveLang]);

  const lines = snippet.code.split('\n');

  const handleRun = async () => {
    setIsRunning(true);
    setActiveStep(1);
    onToast(`Compiling ${effectiveLang.toUpperCase()} via real cloud compiler...`, 'terminal');

    try {
      setActiveStep(2);
      const res = await executeCodeAsync(snippet.code, effectiveLang);
      setActiveStep(3);
      setExecutionResult(res);
      setActiveStep(4);
      const firstLine = (res.stdout || res.stderr || 'Done').split('\n').filter(Boolean)[0] || 'Done';
      onToast(`Completed: ${firstLine.substring(0, 35)}`, res.exitCode === 0 ? 'task_alt' : 'error');
    } catch {
      const res = executeCode(snippet.code, effectiveLang);
      setExecutionResult(res);
      setActiveStep(4);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      onToast('Source code copied to clipboard', 'done');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast('Code ready for copying', 'content_copy');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const ext = effectiveLang === 'cpp' ? 'cpp' : effectiveLang === 'py' ? 'py' : effectiveLang === 'java' ? 'java' : 'js';
    link.download = `${snippet.id}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onToast(`Downloaded ${snippet.id}.${ext}`, 'download');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${snippet.title}" from your vault?`)) {
      onDelete(snippet.id);
      onToast(`Deleted "${snippet.title}"`, 'delete');
      onNavigate('my-codes');
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-4 max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1 text-[#bbcabf] font-label-sm pt-1">
        <button
          onClick={() => onNavigate('my-codes')}
          className="hover:text-[#4edea3] transition-colors cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">folder_code</span>
          My Codes
        </button>
        <span className="material-symbols-outlined text-[12px] opacity-40">chevron_right</span>
        <span className="text-[#dee2ec] truncate font-medium">{snippet.title}</span>
      </div>

      {/* Main Info Card with Metadata */}
      <div className="bg-[#171c23] rounded-xl p-4 border border-[#30353d]/40 shadow-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#4edea3]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#dee2ec]">
                {snippet.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-[#bbcabf] font-code-sm">
                <span className="material-symbols-outlined text-[14px] text-[#4edea3]">schedule</span>
                <span>Updated {snippet.updatedAt}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#30353d] text-[#4cd7f6] font-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                {effectiveLang === 'java' ? 'Java (OpenJDK 21)' : effectiveLang === 'cpp' ? 'C++ (GCC 13)' : effectiveLang === 'py' ? 'Python (3.14)' : effectiveLang === 'js' ? 'JavaScript (Node 20)' : effectiveLang.toUpperCase()}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#252a32] text-[#bbcabf] font-label-sm">
                {snippet.topic}
              </span>
            </div>
          </div>
          <p className="font-body-sm text-[#bbcabf] leading-relaxed bg-[#1b2027]/60 p-3 rounded-lg border border-[#30353d]/30">
            {snippet.description}
          </p>
        </div>
      </div>

      {/* Tactile Action Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Run Primary Button */}
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#4edea3] hover:bg-[#34d399] rounded-lg text-[#003824] font-code-md font-semibold active:scale-95 transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${isRunning ? 'animate-spin' : ''}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isRunning ? 'refresh' : 'play_arrow'}
          </span>
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>

        {/* Copy Code Button */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#252a32] rounded-lg text-[#dee2ec] font-code-md hover:bg-[#30353d] active:scale-95 transition-all cursor-pointer border border-[#30353d]/40"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copied ? 'done' : 'content_copy'}
          </span>
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#252a32] rounded-lg text-[#dee2ec] font-code-md hover:bg-[#30353d] active:scale-95 transition-all cursor-pointer border border-[#30353d]/40"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>.{snippet.language === 'cpp' ? 'cpp' : snippet.language === 'py' ? 'py' : snippet.language === 'java' ? 'java' : 'js'}</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#252a32] rounded-lg text-[#ffb4ab] font-code-md hover:bg-[#93000a]/40 active:scale-95 transition-all cursor-pointer border border-[#30353d]/40"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          <span>Delete</span>
        </button>
      </div>

      {/* Responsive Workbench Grid: Side-by-side on desktop (lg:grid-cols-2), stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Read-Only Code Viewer Container */}
        <div className="flex flex-col bg-[#090f15] rounded-xl border border-[#30353d]/50 shadow-md overflow-hidden">
          {/* Code Window Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#171c23] border-b border-[#30353d]/40">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]/60 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#03b5d3]/60 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]/60 inline-block"></span>
              </div>
              <span className="font-code-sm text-[#dee2ec] font-medium ml-1 truncate max-w-[180px] sm:max-w-none">
                {snippet.id.replace(/-/g, '_')}.{snippet.language === 'cpp' ? 'cpp' : snippet.language === 'py' ? 'py' : snippet.language === 'java' ? 'java' : 'js'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#bbcabf] font-code-sm">
              <span className="hidden sm:inline">UTF-8</span>
              <span className="px-1.5 py-0.5 rounded bg-[#1b2027] text-[10px] text-[#7bd0ff] font-medium">
                Read-Only
              </span>
              <span>{lines.length} Lines</span>
            </div>
          </div>

          {/* Code Body with Line Numbers */}
          <div className="relative overflow-x-auto p-2.5 font-code-sm leading-[22px] select-text min-h-[300px] lg:min-h-[460px] max-h-[600px]">
            <div className="min-w-[360px] flex">
              {/* Line Numbers Column */}
              <div className="flex flex-col text-right pr-3 pl-1 select-none text-[#86948a] font-code-sm opacity-60 border-r border-[#30353d]/30">
                {lines.map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>

              {/* Syntax Monospace Text */}
              <pre className="flex-1 font-code-sm text-[#dee2ec] pl-3 overflow-visible m-0 whitespace-pre">
                {snippet.code}
              </pre>
            </div>
          </div>
        </div>

        {/* Execution Sandbox Section */}
        <div className="flex flex-col bg-[#171c23] rounded-xl p-3 sm:p-4 border border-[#30353d]/40 shadow-md space-y-3">
          {/* Live Sandbox Status Flow */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4edea3]"></span>
              </span>
              <span className="font-code-md font-semibold text-[#dee2ec]">Execution Sandbox</span>
            </div>
            <span className="font-label-sm text-[#4edea3] bg-[#4edea3]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#4edea3]/20">
              <span className="material-symbols-outlined text-[13px]">shield</span>
              Cloud Isolated
            </span>
          </div>

          {/* Stepper Tracker */}
          <div className="grid grid-cols-4 gap-1.5 py-1 text-center font-code-sm">
            <div className={`flex flex-col items-center gap-1 p-1.5 rounded-lg ${activeStep >= 1 ? 'bg-[#252a32] text-[#4edea3]' : 'bg-[#1b2027] text-[#86948a]'}`}>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span className="text-[11px] font-medium">Prepared</span>
            </div>
            <div className={`flex flex-col items-center gap-1 p-1.5 rounded-lg ${activeStep >= 2 ? 'bg-[#252a32] text-[#4edea3]' : 'bg-[#1b2027] text-[#86948a]'}`}>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span className="text-[11px] font-medium">Compiled</span>
            </div>
            <div className={`flex flex-col items-center gap-1 p-1.5 rounded-lg ${activeStep >= 3 ? 'bg-[#252a32] text-[#4edea3]' : 'bg-[#1b2027] text-[#86948a]'}`}>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span className="text-[11px] font-medium">Executed</span>
            </div>
            <div className={`flex flex-col items-center gap-1 p-1.5 rounded-lg ${activeStep >= 4 ? 'bg-[#4edea3]/20 text-[#4edea3] font-semibold' : 'bg-[#1b2027] text-[#86948a]'}`}>
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span className="text-[11px]">Finished</span>
            </div>
          </div>

          {/* Telemetry Badges Strip */}
          <div className="grid grid-cols-3 gap-2 font-code-sm">
            <div className="bg-[#090f15] rounded-lg p-2.5 flex flex-col border border-[#30353d]/30">
              <span className="text-[#bbcabf] text-[10px]">EXIT CODE</span>
              <span className={`font-semibold ${executionResult.exitCode === 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                {executionResult.exitCode} ({executionResult.exitCode === 0 ? 'Success' : 'Error'})
              </span>
            </div>
            <div className="bg-[#090f15] rounded-lg p-2.5 flex flex-col border border-[#30353d]/30">
              <span className="text-[#bbcabf] text-[10px]">TIME</span>
              <span className="text-[#4cd7f6] font-semibold">{executionResult.time}</span>
            </div>
            <div className="bg-[#090f15] rounded-lg p-2.5 flex flex-col border border-[#30353d]/30">
              <span className="text-[#bbcabf] text-[10px]">MEMORY</span>
              <span className="text-[#7bd0ff] font-semibold">{executionResult.memory}</span>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="bg-[#090f15] rounded-xl p-3.5 font-code-sm overflow-x-auto shadow-inner border border-[#30353d]/40">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#30353d]/30 text-[#bbcabf] text-[11px]">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-[15px] text-[#4edea3]">terminal</span>
                <span className="text-[#dee2ec] font-bold">Standard Output (Console)</span>
                <span className="text-[#86948a]">[{effectiveLang.toUpperCase()}]</span>
              </span>
              <span className="text-[#4edea3] text-[10px] font-code-sm flex items-center gap-1 bg-[#4edea3]/10 px-2 py-0.5 rounded-full border border-[#4edea3]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                Live Sandbox Output
              </span>
            </div>

            <div className="flex flex-col gap-2 font-mono">
              {/* Command Invocation */}
              <div className="text-[#7bd0ff] text-xs flex items-center gap-1.5 select-none">
                <span className="text-[#4edea3] font-bold">$</span>
                <span>{executionResult.command.replace(/^\$\s*/, '')}</span>
              </div>

              {/* Actual Output */}
              {executionResult.stderr && executionResult.exitCode !== 0 ? (
                <div className="bg-[#240b0e] text-[#ffb4ab] p-3 rounded-lg border border-[#ffb4ab]/30 font-mono text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                  <div className="text-[#ff897d] font-bold text-xs mb-1 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    Compiler / Runtime Error
                  </div>
                  {executionResult.stderr}
                </div>
              ) : (
                <div className="bg-[#121820] text-[#4edea3] p-3 rounded-lg border border-[#4edea3]/25 font-mono text-sm font-semibold whitespace-pre-wrap leading-relaxed shadow-sm min-h-[120px]">
                  {executionResult.stdout || '[Program executed with empty output]'}
                </div>
              )}

              {/* Status Footer */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#86948a] border-t border-[#30353d]/20">
                <span className={`flex items-center gap-1 ${executionResult.exitCode === 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {executionResult.exitCode === 0 ? 'check_circle' : 'error'}
                  </span>
                  Process finished with exit code {executionResult.exitCode}
                </span>
                <span>Execution Time: {executionResult.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
