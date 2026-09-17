export type Screen = 'home' | 'dashboard' | 'public-runner' | 'add-code' | 'my-codes' | 'snippet-inspector' | 'dsa';

export type LanguageKey = 'cpp' | 'py' | 'java' | 'js' | 'c' | 'rs' | 'go';

export type DsaDifficulty = 'Easy' | 'Medium' | 'Hard';

export type DsaTopic =
  | 'Arrays'
  | 'Strings'
  | 'Linked Lists'
  | 'Stacks & Queues'
  | 'Trees'
  | 'Binary Search'
  | 'Graphs'
  | 'Dynamic Programming'
  | 'Recursion'
  | 'Heap & Priority Queue'
  | 'Bit Manipulation';

export type DsaPattern =
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Fast & Slow Pointers'
  | 'Prefix Sum'
  | 'Monotonic Stack'
  | 'Binary Search'
  | 'BFS & DFS'
  | 'Dynamic Programming'
  | 'Greedy'
  | 'Divide & Conquer'
  | 'Backtracking'
  | 'Hash Map / Frequency'
  | 'Heap / Top K'
  | 'Bit Manipulation';

export type DsaSheetId = 'all' | 'blind75' | 'striver-sde' | 'college-core';

export type DsaStatus = 'solved' | 'attempting' | 'todo';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  topic: DsaTopic;
  pattern: DsaPattern;
  difficulty: DsaDifficulty;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  defaultCode: Partial<Record<LanguageKey, string>>;
  solutionCode?: Partial<Record<LanguageKey, string>>;
  hints?: string[];
  editorial?: {
    approach: string;
    intuition: string;
    algorithmSteps: string[];
    timeComplexity: string;
    spaceComplexity: string;
  };
  acceptanceRate?: string;
  companies?: string[];
  sheets?: DsaSheetId[];
}

export interface DsaUserProgress {
  problemId: string;
  status: DsaStatus;
  solvedAt?: string;
  language?: LanguageKey;
  userCode?: string;
  notes?: string;
  bookmarked?: boolean;
}

export interface BigOComplexityItem {
  name: string;
  category: 'Data Structure' | 'Sorting Algorithm';
  accessAvg: string;
  searchAvg: string;
  insertAvg: string;
  deleteAvg: string;
  worstTime: string;
  spaceComplexity: string;
  notes: string;
}

export interface DsaPatternInfo {
  id: DsaPattern;
  name: string;
  description: string;
  whenToUse: string[];
  keyTemplate: string;
  exampleProblem: string;
}

export interface Snippet {
  id: string;
  title: string;
  language: LanguageKey;
  languageLabel: string;
  topic: string;
  tags: string[];
  updatedAt: string;
  description: string;
  code: string;
  previewLines: { num: string; text: string; highlight?: string }[];
  starred?: boolean;
  notes?: string;
  runtimeSpec?: string;
  complexity?: string;
  lastExecution?: {
    exitCode: number;
    time: string;
    memory: string;
    output: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  handle: string;
  avatarUrl: string;
  codesSaved: number;
  maxCodes: number;
  vaultStatus: 'Active' | 'Locked';
  uid?: string;
  isAnonymous?: boolean;
  providerId?: string;
  isAuthenticated?: boolean;
}
