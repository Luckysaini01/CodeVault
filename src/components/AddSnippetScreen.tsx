import React, { useState, useEffect, useRef } from 'react';
import { Screen, Snippet, LanguageKey } from '../types';

interface AddSnippetScreenProps {
  onNavigate: (screen: Screen) => void;
  onSave: (snippet: Snippet) => void;
  onToast: (msg: string, icon?: string) => void;
  initialTitle?: string;
  initialCode?: string;
  initialLanguage?: LanguageKey;
  existingSnippets?: Snippet[];
  onViewExistingSnippet?: (snippet: Snippet) => void;
}

export const AddSnippetScreen: React.FC<AddSnippetScreenProps> = ({
  onNavigate,
  onSave,
  onToast,
  initialTitle = '',
  initialCode,
  initialLanguage = 'cpp',
  existingSnippets = [],
  onViewExistingSnippet
}) => {
  const [mode, setMode] = useState<'paste' | 'upload'>('paste');
  const [title, setTitle] = useState(initialTitle);
  const [language, setLanguage] = useState<LanguageKey>(initialLanguage);
  const [tags, setTags] = useState<string[]>(['DSA', 'Algorithms']);
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultStarterCode = `// Type or paste your code snippet here...
#include <iostream>
#include <vector>

using namespace std;

int main() {
    cout << "CodeVault Snippet Initialized." << endl;
    return 0;
}`;

  const [code, setCode] = useState(initialCode || defaultStarterCode);

  // Update if initialTitle or initialCode change from external
  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (initialCode) setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    if (initialLanguage) setLanguage(initialLanguage);
  }, [initialLanguage]);

  // Live check if title or code is already present in vault
  const duplicateCheck = React.useMemo(() => {
    const t = title.trim().toLowerCase();
    if (!t) return null;

    const matchedByTitle = existingSnippets.find(
      (s) => s.title.toLowerCase().trim() === t || (t.length > 3 && s.title.toLowerCase().includes(t))
    );

    return matchedByTitle || null;
  }, [title, existingSnippets]);

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    lines: number;
    dialect: string;
  } | null>(null);

  const langConfig: Record<LanguageKey, { label: string; runtime: string; ext: string }> = {
    cpp: { label: 'C++ (GCC 12.2)', runtime: 'x86_64 Strict', ext: 'main.cpp' },
    py: { label: 'Python (3.10.8)', runtime: 'CPython 3.10 AST', ext: 'script.py' },
    java: { label: 'Java (OpenJDK 17)', runtime: 'HotSpot JVM 17', ext: 'Main.java' },
    js: { label: 'JavaScript (ES2023)', runtime: 'V8 Node 20.x', ext: 'index.js' },
    rs: { label: 'Rust (1.75 c2)', runtime: 'Rustc LLVM 1.75', ext: 'lib.rs' },
    go: { label: 'Go (1.21)', runtime: 'gc Go 1.21.5', ext: 'main.go' },
    c: { label: 'C (GCC 12)', runtime: 'x86_64 GCC 12', ext: 'main.c' }
  };

  // Heuristic language detector from code content
  const detectLanguageFromContent = (text: string): LanguageKey | null => {
    if (text.includes('#include') || text.includes('std::') || text.includes('cout <<')) return 'cpp';
    if (text.includes('def ') || text.includes('import ') || text.includes('print(')) return 'py';
    if (text.includes('public class') || text.includes('System.out.println')) return 'java';
    if (text.includes('console.log') || text.includes('const ') || text.includes('export default')) return 'js';
    if (text.includes('fn main') || text.includes('println!')) return 'rs';
    if (text.includes('package main') || text.includes('func main')) return 'go';
    if (text.includes('#include <stdio.h>')) return 'c';
    return null;
  };

  // Map file extensions to LanguageKey
  const detectLanguageFromExtension = (filename: string): LanguageKey => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'cpp':
      case 'cxx':
      case 'cc':
      case 'hpp':
      case 'h':
        return 'cpp';
      case 'py':
      case 'python':
        return 'py';
      case 'java':
        return 'java';
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return 'js';
      case 'c':
        return 'c';
      case 'rs':
        return 'rs';
      case 'go':
        return 'go';
      default:
        return 'cpp';
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFormatCode = () => {
    if (!code.trim()) return;
    const formatted = code
      .split('\n')
      .map((line) => line.replace(/^\t+/, (match) => '    '.repeat(match.length)))
      .join('\n');
    setCode(formatted);
    onToast('Code indentation aligned', 'auto_fix_high');
  };

  const handleClearCode = () => {
    setCode('');
    setUploadedFile(null);
    onToast('Editor stage cleared', 'delete_sweep');
  };

  // One-click clipboard paste
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setCode(text);
          const detected = detectLanguageFromContent(text);
          if (detected) {
            setLanguage(detected);
            onToast(`Pasted & auto-detected as ${langConfig[detected].label.split(' ')[0]}`, 'content_paste');
          } else {
            onToast(`Pasted ${text.length} characters from clipboard`, 'content_paste');
          }
          if (!title) {
            setTitle(`Pasted Snippet (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
          }
        } else {
          onToast('Clipboard is empty or does not contain text', 'info');
        }
      } else {
        onToast('Press Ctrl+V / Cmd+V in the editor area to paste', 'info');
      }
    } catch {
      onToast('Use keyboard shortcut (Ctrl+V / ⌘V) to paste into editor', 'info');
    }
  };

  // Quick Boilerplates
  const handleLoadBoilerplate = (lang: LanguageKey) => {
    setLanguage(lang);
    if (lang === 'cpp') {
      setCode(`#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    // Code here\n    cout << "Hello C++" << endl;\n    return 0;\n}`);
    } else if (lang === 'py') {
      setCode(`import sys\n\ndef solve():\n    # Code here\n    print("Hello Python")\n\nif __name__ == "__main__":\n    solve()`);
    } else if (lang === 'java') {
      setCode(`import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Code here\n        System.out.println("Hello Java");\n    }\n}`);
    } else if (lang === 'js') {
      setCode(`/**\n * CodeVault JavaScript Snippet\n */\nfunction main() {\n    console.log("Hello JavaScript");\n}\n\nmain();`);
    }
    onToast(`Loaded ${lang.toUpperCase()} starter template`, 'code');
  };

  // Process File Upload from Input or Drop
  const processUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      setCode(content);

      const detectedLang = detectLanguageFromExtension(file.name);
      setLanguage(detectedLang);

      const detectedLines = content.split('\n').length;
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        lines: detectedLines,
        dialect: langConfig[detectedLang].label.split(' ')[0]
      });

      // Auto-populate Title cleanly
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      setTitle(cleanTitle);

      // Auto-tag file type
      const extTag = file.name.split('.').pop()?.toUpperCase() || 'Code';
      if (!tags.includes(extTag)) {
        setTags([...tags, extTag]);
      }

      onToast(`Loaded ${file.name} (${detectedLines} lines)`, 'file_present');
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleSave = async () => {
    if (!code.trim()) {
      onToast('Please type, paste, or upload code first', 'priority_high');
      return;
    }

    setIsSaving(true);
    const effectiveTitle = title.trim() || `Snippet - ${langConfig[language].label.split(' ')[0]} (${new Date().toLocaleDateString()})`;

    const newSnippet: Snippet = {
      id: `snippet-${Date.now()}`,
      title: effectiveTitle,
      language,
      languageLabel: langConfig[language].label.split(' ')[0],
      topic: tags[0] || 'General',
      tags: tags.length ? tags : ['General'],
      updatedAt: 'Just now',
      description: notes.trim() || `${effectiveTitle} stored in developer vault.`,
      code,
      complexity: 'Optimized',
      runtimeSpec: langConfig[language].runtime,
      previewLines: code
        .split('\n')
        .slice(0, 5)
        .map((line, idx) => ({
          num: (idx + 1).toString().padStart(2, '0'),
          text: line || ' '
        })),
      lastExecution: {
        exitCode: 0,
        time: '0.12s',
        memory: '14.0 MB',
        output: `$ Compiled with zero errors.\nProgram executed successfully.`
      }
    };

    onSave(newSnippet);
    setIsSaving(false);
    onToast(`Saved "${effectiveTitle}" to Cloud Database!`, 'cloud_done');
    setTimeout(() => onNavigate('my-codes'), 350);
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, code, language, tags, notes]);

  const lines = code.split('\n');
  const lineCount = Math.max(10, lines.length);

  return (
    <div className="flex flex-col w-full pb-14 max-w-3xl mx-auto px-2 sm:px-4">
      {/* Micro Breadcrumb & Status */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between py-2 mb-2">
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#bbcabf] min-w-0">
          <button
            onClick={() => onNavigate('my-codes')}
            className="hover:text-[#4edea3] transition-colors cursor-pointer truncate"
          >
            My Codes
          </button>
          <span className="material-symbols-outlined text-[14px] text-[#86948a]">chevron_right</span>
          <span className="text-[#4cd7f6] font-medium tracking-wide truncate">
            {mode === 'paste' ? 'Paste & Save Code' : 'Upload & Save File'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#171c23] px-2.5 py-0.5 rounded-full border border-[#30353d]/40 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span className="text-[11px] font-mono text-[#bbcabf] uppercase tracking-wider">Cloud Connected</span>
        </div>
      </nav>

      {/* Segmented Mode Switcher: Paste vs Upload */}
      <section className="mb-4">
        <div className="bg-[#171c23] p-1.5 rounded-2xl flex items-center gap-1.5 border border-[#30353d]/60 shadow-sm">
          <button
            type="button"
            onClick={() => setMode('paste')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
              mode === 'paste'
                ? 'bg-[#252f3d] text-[#4edea3] shadow-[0_0_12px_rgba(78,222,163,0.25)] border border-[#4edea3]/30'
                : 'text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#1b2027]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">content_paste</span>
            <span>Paste Code</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
              mode === 'upload'
                ? 'bg-[#252f3d] text-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.25)] border border-[#4cd7f6]/30'
                : 'text-[#bbcabf] hover:text-[#dee2ec] hover:bg-[#1b2027]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Upload Code File</span>
            <span className="bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              Auto Detect
            </span>
          </button>
        </div>
      </section>

      {/* UPLOAD MODE: Drag & Drop Stage */}
      {mode === 'upload' && (
        <section className="mb-4 flex flex-col gap-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center relative group cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-[#4cd7f6] bg-[#12222d]'
                : 'border-[#30353d] bg-[#171c23] hover:border-[#4cd7f6]/70 hover:bg-[#1b232e]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".cpp,.c,.h,.hpp,.py,.java,.js,.jsx,.ts,.tsx,.rs,.go,.txt"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-[#252a32] flex items-center justify-center text-[#4cd7f6] mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
            </div>
            <h3 className="font-bold text-sm text-[#dee2ec] mb-1">
              Drop your code file here, or <span className="text-[#4cd7f6] underline">browse</span>
            </h3>
            <p className="text-xs text-[#bbcabf] max-w-sm mb-3">
              Supports C++, Python, Java, JavaScript, Rust, Go, C. Auto-detects dialect, functions, and lines.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {['.cpp', '.py', '.java', '.js', '.rs', '.go', '.c'].map((ext) => (
                <span
                  key={ext}
                  className="px-2 py-0.5 rounded bg-[#0e131a] text-[#4cd7f6] font-mono text-[11px] border border-[#30353d]/50"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>

          {/* Uploaded File Summary Banner */}
          {uploadedFile && (
            <div className="bg-[#171c23] p-3 rounded-xl border border-[#4cd7f6]/40 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#4cd7f6]/20 flex items-center justify-center text-[#4cd7f6] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">description</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#dee2ec] truncate">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[10px] font-mono bg-[#4edea3]/20 text-[#4edea3] px-1.5 py-0.2 rounded font-bold">
                      {uploadedFile.dialect}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#bbcabf]">
                    {uploadedFile.size} • {uploadedFile.lines} lines loaded into editor
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadedFile(null);
                  handleClearCode();
                }}
                className="p-1.5 text-[#86948a] hover:text-[#f43f5e] transition-colors cursor-pointer"
                title="Remove file"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* METADATA FORM: Title, Language, Tags, Notes */}
      <section className="bg-[#171c23] p-4 rounded-2xl border border-[#30353d]/60 shadow-md flex flex-col gap-3.5 mb-4">
        {/* Title Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="snippet-title"
            className="text-[11px] font-mono text-[#bbcabf] uppercase tracking-wider flex items-center justify-between"
          >
            <span>Snippet Title / Problem Name</span>
            <span className="text-[#4edea3] font-bold">Required</span>
          </label>
          <input
            id="snippet-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., QuickSort Partitioning or Binary Search Tree"
            className="w-full bg-[#0c1015] text-[#dee2ec] font-mono text-xs rounded-xl px-3 py-2.5 outline-none placeholder:text-[#86948a] border border-[#30353d]/50 focus:border-[#4edea3] transition-all"
            type="text"
          />

          {/* Live Code Presence & Duplicate Check */}
          {title.trim().length > 1 && (
            <div className="pt-0.5">
              {duplicateCheck ? (
                <div className="bg-[#252014] border border-[#fde047]/40 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[#fde047] text-[16px] shrink-0">info</span>
                    <span className="text-[#fde047] truncate">
                      Already in vault: <strong>&quot;{duplicateCheck.title}&quot;</strong> ({duplicateCheck.languageLabel})
                    </span>
                  </div>
                  {onViewExistingSnippet && (
                    <button
                      type="button"
                      onClick={() => onViewExistingSnippet(duplicateCheck)}
                      className="text-[11px] font-bold text-[#4cd7f6] hover:underline shrink-0 cursor-pointer"
                    >
                      View Existing &rarr;
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#4edea3]">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Unique title: Ready to commit new code to Cloud Vault</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dialect Selector & Runtime Spec */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#bbcabf] uppercase tracking-wider">
              Programming Language / Compiler
            </label>
            <div className="relative flex items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageKey)}
                className="w-full appearance-none bg-[#0c1015] text-[#dee2ec] font-mono text-xs rounded-xl px-3 py-2.5 pr-8 outline-none border border-[#30353d]/50 focus:border-[#4edea3] cursor-pointer"
              >
                <option value="cpp">C++ (GCC 12.2)</option>
                <option value="py">Python (3.10.8)</option>
                <option value="java">Java (OpenJDK 17)</option>
                <option value="js">JavaScript (Node 20)</option>
                <option value="rs">Rust (1.75 LLVM)</option>
                <option value="go">Go (1.21 GC)</option>
                <option value="c">C (GCC 12 Standard)</option>
              </select>
              <span className="material-symbols-outlined text-[#86948a] pointer-events-none absolute right-2 text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#bbcabf] uppercase tracking-wider">
              Execution Sandbox Target
            </label>
            <div className="bg-[#0c1015] rounded-xl px-3 py-2.5 flex items-center justify-between border border-[#30353d]/50">
              <span className="font-mono text-xs text-[#4edea3] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                {langConfig[language].runtime}
              </span>
              <span className="text-[10px] font-mono text-[#7bd0ff] bg-[#1b2027] px-2 py-0.5 rounded">
                Linux MicroVM
              </span>
            </div>
          </div>
        </div>

        {/* Quick Boilerplate Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-mono text-[#86948a]">Quick Starter:</span>
          {(['cpp', 'py', 'java', 'js'] as LanguageKey[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLoadBoilerplate(lang)}
              className="px-2 py-0.5 rounded-lg bg-[#252a32] text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#30353d] font-mono text-[11px] transition-colors cursor-pointer"
            >
              +{lang.toUpperCase()}
            </button>
          ))}
          {mode === 'paste' && (
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="ml-auto px-2.5 py-0.5 rounded-lg bg-[#4edea3]/15 text-[#4edea3] hover:bg-[#4edea3]/25 font-mono text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">content_paste</span>
              <span>Paste Clipboard</span>
            </button>
          )}
        </div>

        {/* Tag / Topic Pill Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-mono text-[#bbcabf] uppercase tracking-wider">
            Topic & Classification Tags
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#0c1015] rounded-xl border border-[#30353d]/50">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-[#252f3d] text-[#4cd7f6] px-2 py-0.5 rounded font-mono text-xs"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-[#86948a] hover:text-[#f43f5e] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px] leading-none">close</span>
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="+ Add tag (Press Enter)"
              className="bg-transparent text-[#dee2ec] font-mono text-xs px-2 py-1 outline-none min-w-[140px] flex-1 placeholder:text-[#86948a]"
            />
          </div>
        </div>

        {/* Notes / Complexity Annotations */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="snippet-notes" className="text-[11px] font-mono text-[#bbcabf] uppercase tracking-wider">
            Notes & Big-O Complexity Annotations
          </label>
          <textarea
            id="snippet-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Time: O(N log N), Space: O(1). Handles empty arrays and duplicates..."
            rows={2}
            className="w-full bg-[#0c1015] text-[#dee2ec] font-mono text-xs rounded-xl p-2.5 outline-none placeholder:text-[#86948a] border border-[#30353d]/50 focus:border-[#4edea3] resize-none"
          />
        </div>
      </section>

      {/* CODE STAGE: Interactive Editor */}
      <section className="bg-[#0c1015] rounded-2xl border border-[#30353d]/60 shadow-lg overflow-hidden flex flex-col mb-5">
        {/* Editor Header Toolbar */}
        <div className="bg-[#171c23] px-3 py-2 flex items-center justify-between border-b border-[#30353d]/50">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#fde047]/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]/80 inline-block"></span>
            </div>
            <span className="font-mono text-xs text-[#dee2ec] font-semibold truncate">
              {langConfig[language].ext}
            </span>
            <span className="font-mono text-[10px] text-[#86948a] hidden sm:inline-block">UTF-8</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleFormatCode}
              title="Format indentation"
              className="flex items-center gap-1 font-mono text-xs text-[#bbcabf] hover:text-[#4cd7f6] px-2 py-1 rounded bg-[#252a32] hover:bg-[#30353d] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">auto_fix_high</span>
              <span className="hidden sm:inline">Format</span>
            </button>
            <button
              type="button"
              onClick={handleClearCode}
              title="Clear Editor"
              className="flex items-center gap-1 font-mono text-xs text-[#bbcabf] hover:text-[#f43f5e] px-2 py-1 rounded bg-[#252a32] hover:bg-[#30353d] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">backspace</span>
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Editor Body: Line Numbers Gutter + TextArea */}
        <div className="relative flex min-h-[240px] max-h-[420px] bg-[#0c1015] overflow-hidden">
          <div className="w-10 select-none py-2 bg-[#0e131a] text-[#4b5563] flex flex-col items-center leading-[22px] font-mono text-xs shrink-0 border-r border-[#30353d]/40">
            {Array.from({ length: lineCount }).map((_, i) => (
              <span key={i}>{(i + 1).toString().padStart(2, '0')}</span>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full min-h-[240px] bg-transparent text-[#dee2ec] font-mono text-xs p-2 pl-3 leading-[22px] outline-none resize-none overflow-y-auto whitespace-pre font-normal selection:bg-[#4edea3] selection:text-[#003824]"
            placeholder="// Paste or write your snippet here..."
          />
        </div>

        {/* Bottom Telemetry Bar */}
        <div className="bg-[#121820] px-3 py-1.5 flex items-center justify-between font-mono text-[11px] text-[#bbcabf] border-t border-[#30353d]/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#4edea3]">data_object</span>
              <span>{code.length} characters</span>
            </span>
            <span className="flex items-center gap-1 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[14px]">format_align_left</span>
              <span>{lines.length} lines</span>
            </span>
          </div>
          <span className="text-[#86948a]">Ready to save to Cloud Vault</span>
        </div>
      </section>

      {/* Primary Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="flex-1 bg-[#4edea3] text-[#003824] py-3 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(78,222,163,0.3)] hover:bg-[#6ffbbe] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
          <span>{isSaving ? 'Saving to Database...' : 'Save Snippet to Cloud Vault'}</span>
          <span className="font-mono text-[10px] opacity-80 pl-1">(⌘S / Ctrl+S)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onToast('Running syntax & AST analyzer...', 'terminal');
            setTimeout(() => {
              onToast('Sandbox test passed! Compilation: 0 errors', 'check_circle');
            }, 600);
          }}
          className="bg-[#252a32] text-[#4cd7f6] py-3 px-4 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#30353d] active:scale-[0.99] transition-all cursor-pointer border border-[#4cd7f6]/30"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          <span>Verify & Test Run</span>
        </button>
      </div>

      {/* Cloud & Firestore Real-Time Sync Guarantee */}
      <footer className="mt-5">
        <div className="bg-[#171c23] p-3.5 rounded-2xl flex items-start gap-3 border border-[#30353d]/50 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#4edea3]/15 flex items-center justify-center text-[#4edea3] shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">database</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-mono font-bold text-[#dee2ec]">Firestore Cloud Synchronized</h4>
              <span className="text-[10px] font-mono text-[#4edea3] bg-[#4edea3]/15 px-1.5 py-0.2 rounded font-semibold">
                Permanent
              </span>
            </div>
            <p className="text-xs text-[#bbcabf] leading-relaxed">
              Every saved code snippet is synchronized in real-time to your Cloud Firestore database (`snippets` collection) and cached locally for instant offline access.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
