import { BigOComplexityItem } from '../types';

export const BIG_O_COMPLEXITIES: BigOComplexityItem[] = [
  {
    name: 'Array / Dynamic Array',
    category: 'Data Structure',
    accessAvg: 'O(1)',
    searchAvg: 'O(N)',
    insertAvg: 'O(1)*',
    deleteAvg: 'O(N)',
    worstTime: 'O(N)',
    spaceComplexity: 'O(N)',
    notes: 'Amortized O(1) appending. Inserting/deleting at index requires shifting elements.'
  },
  {
    name: 'Singly Linked List',
    category: 'Data Structure',
    accessAvg: 'O(N)',
    searchAvg: 'O(N)',
    insertAvg: 'O(1)',
    deleteAvg: 'O(1)*',
    worstTime: 'O(N)',
    spaceComplexity: 'O(N)',
    notes: 'O(1) insertion/deletion if pointer to target node is already known.'
  },
  {
    name: 'Doubly Linked List',
    category: 'Data Structure',
    accessAvg: 'O(N)',
    searchAvg: 'O(N)',
    insertAvg: 'O(1)',
    deleteAvg: 'O(1)',
    worstTime: 'O(N)',
    spaceComplexity: 'O(N)',
    notes: 'Can traverse backwards; slightly more memory per node (2 pointers).'
  },
  {
    name: 'Stack (LIFO)',
    category: 'Data Structure',
    accessAvg: 'O(N)',
    searchAvg: 'O(N)',
    insertAvg: 'O(1)',
    deleteAvg: 'O(1)',
    worstTime: 'O(1)',
    spaceComplexity: 'O(N)',
    notes: 'Push and Pop are strictly O(1). Great for parentheses, DFS, recursion trees.'
  },
  {
    name: 'Queue (FIFO)',
    category: 'Data Structure',
    accessAvg: 'O(N)',
    searchAvg: 'O(N)',
    insertAvg: 'O(1)',
    deleteAvg: 'O(1)',
    worstTime: 'O(1)',
    spaceComplexity: 'O(N)',
    notes: 'Enqueue and Dequeue are strictly O(1). Essential for BFS graph traversal.'
  },
  {
    name: 'Hash Table / Map',
    category: 'Data Structure',
    accessAvg: 'O(1)',
    searchAvg: 'O(1)',
    insertAvg: 'O(1)',
    deleteAvg: 'O(1)',
    worstTime: 'O(N)',
    spaceComplexity: 'O(N)',
    notes: 'Average O(1) lookup via hashing. Worst case O(N) on hash collisions.'
  },
  {
    name: 'Binary Search Tree (Balanced)',
    category: 'Data Structure',
    accessAvg: 'O(log N)',
    searchAvg: 'O(log N)',
    insertAvg: 'O(log N)',
    deleteAvg: 'O(log N)',
    worstTime: 'O(N)*',
    spaceComplexity: 'O(N)',
    notes: 'O(log N) operations on AVL/Red-Black trees. Degenerates to O(N) if skewed.'
  },
  {
    name: 'Binary Heap (Min/Max)',
    category: 'Data Structure',
    accessAvg: 'O(1) min/max',
    searchAvg: 'O(N)',
    insertAvg: 'O(log N)',
    deleteAvg: 'O(log N)',
    worstTime: 'O(log N)',
    spaceComplexity: 'O(N)',
    notes: 'Peek is O(1). ExtractMin/Max is O(log N). Ideal for Dijkstra and Top-K items.'
  },
  {
    name: 'Trie (Prefix Tree)',
    category: 'Data Structure',
    accessAvg: 'O(L)',
    searchAvg: 'O(L)',
    insertAvg: 'O(L)',
    deleteAvg: 'O(L)',
    worstTime: 'O(L)',
    spaceComplexity: 'O(ALPHABET * L * N)',
    notes: 'L = length of word/key. Fast auto-complete and prefix lookups.'
  },
  {
    name: 'Quicksort',
    category: 'Sorting Algorithm',
    accessAvg: 'O(N log N)',
    searchAvg: 'O(N log N)',
    insertAvg: 'O(N log N)',
    deleteAvg: 'O(N log N)',
    worstTime: 'O(N^2)',
    spaceComplexity: 'O(log N)',
    notes: 'In-place partition. Worst-case O(N^2) if pivot is poorly chosen; randomize pivot.'
  },
  {
    name: 'Mergesort',
    category: 'Sorting Algorithm',
    accessAvg: 'O(N log N)',
    searchAvg: 'O(N log N)',
    insertAvg: 'O(N log N)',
    deleteAvg: 'O(N log N)',
    worstTime: 'O(N log N)',
    spaceComplexity: 'O(N)',
    notes: 'Guaranteed O(N log N) worst-case. Stable sorting algorithm. Divide and conquer.'
  },
  {
    name: 'Heapsort',
    category: 'Sorting Algorithm',
    accessAvg: 'O(N log N)',
    searchAvg: 'O(N log N)',
    insertAvg: 'O(N log N)',
    deleteAvg: 'O(N log N)',
    worstTime: 'O(N log N)',
    spaceComplexity: 'O(1)',
    notes: 'Guaranteed O(N log N) in-place sorting. Unstable sort.'
  }
];

export const DSA_BIT_TRICKS = [
  { trick: 'x & 1', meaning: 'Check if number is Odd (1) or Even (0)' },
  { trick: 'x & (x - 1)', meaning: 'Drops the lowest set bit. If result is 0, x is a power of 2.' },
  { trick: 'x ^ x', meaning: 'Always equals 0. Great for finding unique element in pairs.' },
  { trick: 'x & (-x)', meaning: 'Isolates the rightmost set bit.' },
  { trick: '1 << k', meaning: 'Sets the k-th bit (equivalent to 2^k).' },
  { trick: 'x >> 1', meaning: 'Fast integer division by 2.' }
];

export const DSA_RECURRENCE_FORMULAS = [
  { name: 'Binary Search', recurrence: 'T(n) = T(n/2) + O(1)', solution: 'O(log n)' },
  { name: 'Merge Sort', recurrence: 'T(n) = 2T(n/2) + O(n)', solution: 'O(n log n)' },
  { name: 'Binary Tree Traversal', recurrence: 'T(n) = 2T(n/2) + O(1)', solution: 'O(n)' },
  { name: 'Master Theorem Case 1', recurrence: 'T(n) = aT(n/b) + O(n^c)', solution: 'If c < log_b(a) -> O(n^(log_b(a)))' },
  { name: 'Master Theorem Case 2', recurrence: 'T(n) = aT(n/b) + O(n^c)', solution: 'If c = log_b(a) -> O(n^c log n)' }
];
