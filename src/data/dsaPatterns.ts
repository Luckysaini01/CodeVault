import { DsaPatternInfo } from '../types';

export const DSA_PATTERNS: DsaPatternInfo[] = [
  {
    id: 'Two Pointers',
    name: 'Two Pointers Technique',
    description: 'Use two pointers traversing from opposite ends or at different speeds to solve searching, pairing, or palindromes in linear time.',
    whenToUse: [
      'Array or string is sorted',
      'Searching for a pair satisfying a sum condition (e.g. Two Sum II, 3Sum)',
      'Reversing an array or validating a palindrome in-place'
    ],
    keyTemplate: `left, right = 0, len(arr) - 1
while left < right:
    curr_sum = arr[left] + arr[right]
    if curr_sum == target:
        return [left, right]
    elif curr_sum < target:
        left += 1
    else:
        right -= 1`,
    exampleProblem: 'Two Sum II, 3Sum, Container With Most Water, Valid Palindrome'
  },
  {
    id: 'Sliding Window',
    name: 'Sliding Window',
    description: 'Maintain a subsegment [left...right] that expands and contracts dynamically, avoiding O(N^2) brute force subsegment recalculations.',
    whenToUse: [
      'Problem asks for longest/shortest subarray or substring matching a condition',
      'Maximum sum subarray of size K',
      'Substring without repeating characters or with K distinct characters'
    ],
    keyTemplate: `left = 0
window = {}
for right in range(len(s)):
    # 1. Add s[right] to window state
    # 2. Shrink while invalid:
    while window_is_invalid():
        # remove s[left] from window
        left += 1
    # 3. Update answer with window length (right - left + 1)`,
    exampleProblem: 'Longest Substring Without Repeating Characters, Minimum Size Subarray Sum'
  },
  {
    id: 'Fast & Slow Pointers',
    name: 'Fast & Slow (Floyd\'s Tortoise and Hare)',
    description: 'Advance two pointers at different speeds (1 step vs 2 steps) through a sequence or linked list.',
    whenToUse: [
      'Detecting cycles in a Linked List or finite sequence',
      'Finding the middle node of a Linked List in one pass',
      'Finding the start of a loop in linked structures'
    ],
    keyTemplate: `slow = head
fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
        return True # Cycle detected!
return False`,
    exampleProblem: 'Linked List Cycle, Middle of the Linked List, Happy Number'
  },
  {
    id: 'Prefix Sum',
    name: 'Prefix Sum / Cumulative Accumulator',
    description: 'Precompute prefix totals to allow O(1) range sum queries or O(N) subarray sum equals K lookups with hash maps.',
    whenToUse: [
      'Repeated range sum queries [i...j]',
      'Subarray sum equals K',
      'Continuous subarray modulo problems'
    ],
    keyTemplate: `prefix = {0: 1}
curr_sum = 0
count = 0
for num in nums:
    curr_sum += num
    if curr_sum - k in prefix:
        count += prefix[curr_sum - k]
    prefix[curr_sum] = prefix.get(curr_sum, 0) + 1`,
    exampleProblem: 'Subarray Sum Equals K, Range Sum Query'
  },
  {
    id: 'Monotonic Stack',
    name: 'Monotonic Stack',
    description: 'Stack elements maintained in strict increasing or decreasing order to find the next/previous greater or smaller element in O(N).',
    whenToUse: [
      'Next Greater Element / Previous Smaller Element',
      'Daily Temperatures / Stock Spanners',
      'Largest Rectangle in Histogram, Trapping Rain Water'
    ],
    keyTemplate: `stack = [] # indices
result = [-1] * len(arr)
for i, val in enumerate(arr):
    while stack and arr[stack[-1]] < val:
        prev_idx = stack.pop()
        result[prev_idx] = val
    stack.append(i)`,
    exampleProblem: 'Daily Temperatures, Next Greater Element, Trapping Rain Water'
  },
  {
    id: 'Binary Search',
    name: 'Binary Search / Search on Answer',
    description: 'Eliminate half of the search space at each iteration when a monotonic predicate (True/False) applies.',
    whenToUse: [
      'Sorted arrays or rotated sorted arrays',
      'Minimizing the maximum or maximizing the minimum (e.g. Koko Eating Bananas, Capacity to Ship Packages)',
      'Finding peak elements'
    ],
    keyTemplate: `low, high = 0, len(arr) - 1
while low <= high:
    mid = low + (high - low) // 2
    if condition(mid):
        ans = mid
        high = mid - 1 # or low = mid + 1 depending on monotonicity
    else:
        low = mid + 1`,
    exampleProblem: 'Binary Search, Search in Rotated Sorted Array, Koko Eating Bananas'
  },
  {
    id: 'BFS & DFS',
    name: 'Breadth-First & Depth-First Search',
    description: 'Systematically explore graphs, grids, and trees level-by-level (BFS with queue) or path-by-path (DFS with stack/recursion).',
    whenToUse: [
      'Shortest path in unweighted graph -> BFS',
      'Connected components or island counting -> BFS or DFS',
      'Cycle detection, topological sort -> DFS'
    ],
    keyTemplate: `# BFS:
queue = collections.deque([start])
visited = set([start])
while queue:
    node = queue.popleft()
    for neighbor in graph[node]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)`,
    exampleProblem: 'Number of Islands, Rotting Oranges, Clone Graph, Word Ladder'
  },
  {
    id: 'Dynamic Programming',
    name: 'Dynamic Programming (Memoization & Tabulation)',
    description: 'Solve complex problems by breaking them into overlapping subproblems with optimal substructure.',
    whenToUse: [
      'Count distinct ways (Climbing stairs)',
      'Optimization (Min/Max cost, Knapsack, Coin Change)',
      'Longest Common Subsequence, Longest Increasing Subsequence'
    ],
    keyTemplate: `# Tabulation 1D:
dp = [0] * (n + 1)
dp[0] = base_val
for i in range(1, n + 1):
    dp[i] = min(dp[i - c] + 1 for c in coins if i - c >= 0)`,
    exampleProblem: 'Climbing Stairs, Coin Change, House Robber, Longest Common Subsequence'
  },
  {
    id: 'Heap / Top K',
    name: 'Heap / Top K Elements',
    description: 'Maintain the top K elements dynamically in O(N log K) without sorting the entire dataset.',
    whenToUse: [
      'Find the Kth largest or smallest element in an array or stream',
      'Merge K sorted lists',
      'Find Top K frequent words or numbers'
    ],
    keyTemplate: `import heapq
min_heap = []
for num in nums:
    heapq.heappush(min_heap, num)
    if len(min_heap) > k:
        heapq.heappop(min_heap)
return min_heap[0]`,
    exampleProblem: 'Kth Largest Element in an Array, Top K Frequent Elements, Merge K Sorted Lists'
  },
  {
    id: 'Backtracking',
    name: 'Backtracking (Exhaustive State Search)',
    description: 'Incrementally build candidates to the solution and abandon ("backtrack") as soon as a candidate fails constraints.',
    whenToUse: [
      'Subsets, Permutations, Combinations',
      'N-Queens, Sudoku Solver',
      'Word Search on 2D grid'
    ],
    keyTemplate: `def backtrack(start, path):
    res.append(list(path))
    for i in range(start, len(nums)):
        path.append(nums[i])
        backtrack(i + 1, path)
        path.pop() # backtrack step`,
    exampleProblem: 'Subsets, Permutations, Combination Sum, Word Search'
  }
];
