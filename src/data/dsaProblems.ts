import { DsaProblem } from '../types';

export const DSA_PROBLEMS: DsaProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    topic: 'Arrays',
    pattern: 'Hash Map / Frequency',
    difficulty: 'Easy',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    acceptanceRate: '53.2%',
    sheets: ['blind75', 'striver-sde', 'college-core'],
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    hints: [
      'A brute force O(N^2) searches all pairs. Can we store seen numbers in O(1)?',
      'For each element num, what number are you looking for? (target - num)',
      'Use a Hash Map to store {num: index} while iterating.'
    ],
    editorial: {
      approach: 'Hash Map Complement Lookup (One Pass)',
      intuition: 'While traversing the array, check if target - current_number has already been recorded in the hash map. If yes, the pair is found.',
      algorithmSteps: [
        'Initialize an empty hash map (val -> index).',
        'Iterate through the array with index i and value num.',
        'Calculate complement = target - num.',
        'If complement is in map, return [map[complement], i].',
        'Otherwise insert num into map with index i.'
      ],
      timeComplexity: 'O(N) - single pass with O(1) hash map lookups',
      spaceComplexity: 'O(N) - stores up to N elements in the map'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        explanation: 'Index 0 (2) + Index 1 (7) = 9'
      },
      {
        id: 'tc-2',
        input: '[3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
        explanation: 'Index 1 (2) + Index 2 (4) = 6'
      },
      {
        id: 'tc-3',
        input: '[3, 3], target = 6',
        expectedOutput: '[0, 1]',
        explanation: 'Index 0 (3) + Index 1 (3) = 6'
      }
    ],
    defaultCode: {
      py: `def two_sum(nums, target):
    # Write your O(N) solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution
print("Output:", two_sum([2, 7, 11, 15], 9))`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (mp.find(complement) != mp.end()) {
            return {mp[complement], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = twoSum(nums, 9);
    cout << "Output: [" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
      java: `import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[] {2, 7, 11, 15}, 9);
        System.out.println("Output: " + Arrays.toString(res));
    }
}`,
      js: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log("Output:", twoSum([2, 7, 11, 15], 9));`
    },
    solutionCode: {
      py: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int comp = target - nums[i];
        if (seen.count(comp)) return {seen[comp], i};
        seen[nums[i]] = i;
    }
    return {};
}`
    }
  },
  {
    id: 'kadanes-algorithm',
    title: 'Maximum Subarray (Kadane\'s)',
    topic: 'Arrays',
    pattern: 'Dynamic Programming',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    acceptanceRate: '50.9%',
    sheets: ['blind75', 'striver-sde', 'college-core'],
    companies: ['Amazon', 'Microsoft', 'Google', 'Cisco'],
    description:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.'
      }
    ],
    hints: [
      'Think about whether a negative running sum helps you when extending to the next number.',
      'If current sum becomes negative, reset it to 0 or start fresh at nums[i].',
      'Track the global maximum seen so far.'
    ],
    editorial: {
      approach: 'Kadane\'s Greedy Dynamic Programming',
      intuition: 'At each index i, either add nums[i] to the running subarray or start a new subarray at nums[i]: currentMax = max(nums[i], currentMax + nums[i]).',
      algorithmSteps: [
        'Initialize max_so_far = nums[0] and curr_max = nums[0].',
        'Loop from index 1 to N-1.',
        'curr_max = max(nums[i], curr_max + nums[i]).',
        'max_so_far = max(max_so_far, curr_max).',
        'Return max_so_far.'
      ],
      timeComplexity: 'O(N) - single iteration through the array',
      spaceComplexity: 'O(1) - constant variables'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expectedOutput: '6',
        explanation: 'Subarray [4, -1, 2, 1] sums to 6'
      },
      {
        id: 'tc-2',
        input: '[1]',
        expectedOutput: '1'
      },
      {
        id: 'tc-3',
        input: '[5, 4, -1, 7, 8]',
        expectedOutput: '23'
      }
    ],
    defaultCode: {
      py: `def max_sub_array(nums):
    # Kadane's Algorithm
    max_so_far = nums[0]
    curr_max = nums[0]
    for num in nums[1:]:
        curr_max = max(num, curr_max + num)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far

print("Max Subarray:", max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0];
    int currMax = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        currMax = max(nums[i], currMax + nums[i]);
        maxSoFar = max(maxSoFar, currMax);
    }
    return maxSoFar;
}

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << "Max Subarray: " << maxSubArray(nums) << endl;
    return 0;
}`,
      java: `public class Solution {
    public static int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currMax = Math.max(nums[i], currMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currMax);
        }
        return maxSoFar;
    }

    public static void main(String[] args) {
        System.out.println("Max: " + maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));
    }
}`,
      js: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currMax = Math.max(nums[i], currMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}

console.log("Max Subarray:", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`
    }
  },
  {
    id: 'three-sum',
    title: '3Sum (Zero Sum Triplets)',
    topic: 'Arrays',
    pattern: 'Two Pointers',
    difficulty: 'Medium',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    acceptanceRate: '34.8%',
    sheets: ['blind75', 'striver-sde'],
    companies: ['Meta', 'Amazon', 'Apple', 'Google'],
    description:
      'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'Distinct triplets summing to 0 are [-1, 0, 1] and [-1, -1, 2].'
      }
    ],
    hints: [
      'Sorting the array first in O(N log N) makes handling duplicates trivial.',
      'Fix the first element nums[i], then use two pointers (left and right) to find pairs summing to -nums[i].',
      'Skip duplicate elements for i, left, and right to prevent duplicate triplets.'
    ],
    editorial: {
      approach: 'Sort Array + Two Pointers',
      intuition: 'Sorting reduces 3-variable search to a single fixed element plus the standard 2-pointer two-sum problem on a sorted array.',
      algorithmSteps: [
        'Sort nums in ascending order.',
        'Iterate i from 0 to N-3. If nums[i] > 0, break (cannot sum to 0).',
        'If i > 0 and nums[i] == nums[i-1], skip to prevent duplicate triplets.',
        'Set left = i + 1, right = N - 1. While left < right: check sum = nums[i] + nums[left] + nums[right].',
        'If sum == 0, record triplet and advance pointers skipping duplicates. If sum < 0, left++. If sum > 0, right--.'
      ],
      timeComplexity: 'O(N^2) - O(N log N) sort + N iterations of O(N) two pointers',
      spaceComplexity: 'O(1) extra space (excluding output array)'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[-1, 0, 1, 2, -1, -4]',
        expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]'
      },
      {
        id: 'tc-2',
        input: '[0, 1, 1]',
        expectedOutput: '[]'
      },
      {
        id: 'tc-3',
        input: '[0, 0, 0]',
        expectedOutput: '[[0, 0, 0]]'
      }
    ],
    defaultCode: {
      py: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1
    return res

print("3Sum:", three_sum([-1, 0, 1, 2, -1, -4]))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for (int i = 0; i < (int)nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int left = i + 1, right = nums.size() - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                res.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left+1]) left++;
                while (left < right && nums[right] == nums[right-1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return res;
}

int main() {
    vector<int> nums = {-1, 0, 1, 2, -1, -4};
    auto r = threeSum(nums);
    cout << "Found " << r.size() << " triplets" << endl;
    return 0;
}`,
      js: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return res;
}

console.log("Triplets:", JSON.stringify(threeSum([-1, 0, 1, 2, -1, -4])));`
    }
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    topic: 'Arrays',
    pattern: 'Two Pointers',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    acceptanceRate: '54.6%',
    sheets: ['blind75', 'striver-sde'],
    companies: ['Amazon', 'Google', 'Meta', 'Adobe'],
    description:
      'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The max area is between index 1 (height 8) and index 8 (height 7). Area = min(8, 7) * (8 - 1) = 7 * 7 = 49.'
      }
    ],
    hints: [
      'The area is always limited by the shorter of the two lines: min(h[L], h[R]) * (R - L).',
      'Start with the widest container: L = 0, R = n - 1.',
      'Which pointer should you move inwards? The shorter one!'
    ],
    editorial: {
      approach: 'Two Pointers Shorter Height Inward Step',
      intuition: 'Moving the taller line inward cannot possibly increase the area because width decreases and height is bounded by the shorter line. Thus we must move the shorter line.',
      algorithmSteps: [
        'Set left = 0, right = length - 1, max_area = 0.',
        'While left < right:',
        'area = min(height[left], height[right]) * (right - left).',
        'max_area = max(max_area, area).',
        'If height[left] < height[right], left++, else right--.',
        'Return max_area.'
      ],
      timeComplexity: 'O(N) - two pointers meet in the middle',
      spaceComplexity: 'O(1) - only two pointers maintained'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[1, 8, 6, 2, 5, 4, 8, 3, 7]',
        expectedOutput: '49'
      },
      {
        id: 'tc-2',
        input: '[1, 1]',
        expectedOutput: '1'
      }
    ],
    defaultCode: {
      py: `def max_area(height):
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        h = min(height[left], height[right])
        w = right - left
        max_water = max(max_water, h * w)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water

print("Max Water:", max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxWater = 0;
    while (left < right) {
        int h = min(height[left], height[right]);
        maxWater = max(maxWater, h * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}

int main() {
    vector<int> h = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << "Max Water: " << maxArea(h) << endl;
    return 0;
}`,
      js: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, h * (right - left));
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}

console.log("Max Area:", maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));`
    }
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    topic: 'Linked Lists',
    pattern: 'Two Pointers',
    difficulty: 'Easy',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    acceptanceRate: '75.4%',
    sheets: ['blind75', 'striver-sde', 'college-core'],
    companies: ['Microsoft', 'Amazon', 'Apple', 'Google'],
    description:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'Reversing 1->2->3->4->5 gives 5->4->3->2->1.'
      }
    ],
    hints: [
      'Think about reversing pointers iteratively using 3 pointers: prev, curr, and next_node.',
      'Remember to save curr.next before overwriting it with prev!'
    ],
    editorial: {
      approach: 'Iterative 3-Pointer Link Reversal',
      intuition: 'At each node, redirect its next pointer to point backwards to prev. Move prev and curr forward.',
      algorithmSteps: [
        'Set prev = None, curr = head.',
        'While curr is not None:',
        'nxt = curr.next (save forward pointer).',
        'curr.next = prev (reverse the link).',
        'prev = curr; curr = nxt (step forward).',
        'Return prev (new head).'
      ],
      timeComplexity: 'O(N) - each node visited once',
      spaceComplexity: 'O(1) - iterative in-place pointer manipulation'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '[5, 4, 3, 2, 1]'
      },
      {
        id: 'tc-2',
        input: '[1, 2]',
        expectedOutput: '[2, 1]'
      },
      {
        id: 'tc-3',
        input: '[]',
        expectedOutput: '[]'
      }
    ],
    defaultCode: {
      py: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Build 1->2->3
h = ListNode(1, ListNode(2, ListNode(3)))
new_head = reverse_list(h)
print("Reversed Head Val:", new_head.val)`,
      cpp: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}

int main() {
    ListNode* head = new ListNode(1);
    head->next = new ListNode(2);
    ListNode* rev = reverseList(head);
    cout << "Reversed Head: " << rev->val << endl;
    return 0;
}`,
      js: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

const list = { val: 1, next: { val: 2, next: { val: 3, next: null } } };
console.log("Reversed:", reverseList(list));`
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    topic: 'Stacks & Queues',
    pattern: 'Monotonic Stack',
    difficulty: 'Easy',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    acceptanceRate: '40.8%',
    sheets: ['blind75', 'striver-sde', 'college-core'],
    companies: ['Amazon', 'Google', 'Meta', 'Bloomberg'],
    description:
      'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets in the correct order.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    hints: [
      'Whenever you encounter a closing bracket, it must match the most recently seen opening bracket.',
      'Last-in First-out (LIFO) order matches the Stack data structure perfectly.'
    ],
    editorial: {
      approach: 'LIFO Stack Matching',
      intuition: 'Push opening brackets onto stack. When closing bracket arrives, pop and verify matching type.',
      algorithmSteps: [
        'Create stack and map of closing to opening brackets.',
        'Iterate through characters of string.',
        'If closing bracket: check if stack top matches; if not return false. Pop top.',
        'If opening bracket: push onto stack.',
        'Return true if stack is empty at the end, else false.'
      ],
      timeComplexity: 'O(N) - one pass over string',
      spaceComplexity: 'O(N) - up to N characters on stack'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '"()[]{}"',
        expectedOutput: 'true'
      },
      {
        id: 'tc-2',
        input: '"(]"',
        expectedOutput: 'false'
      },
      {
        id: 'tc-3',
        input: '"([{}])"',
        expectedOutput: 'true'
      }
    ],
    defaultCode: {
      py: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack

print("Is valid ()[]{}:", is_valid("()[]{}"))
print("Is valid (]:", is_valid("(]"))`,
      cpp: `#include <iostream>
#include <stack>
#include <unordered_map>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (map.count(c)) {
            if (st.empty() || st.top() != map[c]) return false;
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}

int main() {
    cout << boolalpha << isValid("()[]{}") << endl;
    return 0;
}`,
      js: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}

console.log(isValid("()[]{}"));`
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    topic: 'Binary Search',
    pattern: 'Binary Search',
    difficulty: 'Easy',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    acceptanceRate: '57.8%',
    sheets: ['blind75', 'striver-sde', 'college-core'],
    companies: ['Apple', 'Microsoft', 'Google', 'Amazon'],
    description:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.',
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All integers in nums are unique and sorted in ascending order.'
    ],
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    hints: [
      'Calculate mid = low + (high - low) // 2 to prevent integer overflow in C++/Java.',
      'If nums[mid] == target, return mid.',
      'If nums[mid] < target, discard left half (low = mid + 1), else high = mid - 1.'
    ],
    editorial: {
      approach: 'Divide and Conquer Interval Halving',
      intuition: 'Because the array is sorted, comparing target with the midpoint eliminates 50% of the remaining search window.',
      algorithmSteps: [
        'Set low = 0, high = len - 1.',
        'While low <= high: mid = low + (high - low) // 2.',
        'If nums[mid] == target: return mid.',
        'If nums[mid] < target: low = mid + 1.',
        'Else: high = mid - 1.',
        'Return -1 if loop exits without match.'
      ],
      timeComplexity: 'O(log N) - halves search space each iteration',
      spaceComplexity: 'O(1) - purely iterative pointers'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[-1, 0, 3, 5, 9, 12], target = 9',
        expectedOutput: '4'
      },
      {
        id: 'tc-2',
        input: '[-1, 0, 3, 5, 9, 12], target = 2',
        expectedOutput: '-1'
      }
    ],
    defaultCode: {
      py: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

print("Found index:", binary_search([-1, 0, 3, 5, 9, 12], 9))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> nums = {-1, 0, 3, 5, 9, 12};
    cout << "Index: " << search(nums, 9) << endl;
    return 0;
}`,
      js: `function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

console.log("Index:", search([-1, 0, 3, 5, 9, 12], 9));`
    }
  },
  {
    id: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Strings',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, M))',
    acceptanceRate: '34.9%',
    sheets: ['blind75', 'striver-sde'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    hints: [
      'Maintain a sliding window [left...right].',
      'Use a hash map or set to record characters currently inside the window.',
      'When s[right] is already in the window, shrink from left until s[right] is removed.'
    ],
    editorial: {
      approach: 'Sliding Window with Character Index Map',
      intuition: 'Store the last seen index of each character. When a duplicate appears, jump left pointer past the previous occurrence.',
      algorithmSteps: [
        'Initialize char_map = {}, left = 0, max_len = 0.',
        'Loop right through string:',
        'If s[right] in map and map[s[right]] >= left: left = map[s[right]] + 1.',
        'map[s[right]] = right.',
        'max_len = max(max_len, right - left + 1).',
        'Return max_len.'
      ],
      timeComplexity: 'O(N) - right pointer advances N times, left moves forward monotonically',
      spaceComplexity: 'O(min(N, alphabet_size)) - map stores unique chars'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '"abcabcbb"',
        expectedOutput: '3'
      },
      {
        id: 'tc-2',
        input: '"bbbbb"',
        expectedOutput: '1'
      },
      {
        id: 'tc-3',
        input: '"pwwkew"',
        expectedOutput: '3'
      }
    ],
    defaultCode: {
      py: `def length_of_longest_substring(s):
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len

print("Length abcabcbb:", length_of_longest_substring("abcabcbb"))`,
      cpp: `#include <iostream>
#include <unordered_map>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> map;
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        if (map.count(s[right]) && map[s[right]] >= left) {
            left = map[s[right]] + 1;
        }
        map[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

int main() {
    cout << "Max len: " << lengthOfLongestSubstring("abcabcbb") << endl;
    return 0;
}`,
      js: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

console.log("Length:", lengthOfLongestSubstring("abcabcbb"));`
    }
  },
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    topic: 'Trees',
    pattern: 'BFS & DFS',
    difficulty: 'Easy',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    acceptanceRate: '77.1%',
    sheets: ['blind75', 'striver-sde', 'college-core'],
    companies: ['Google', 'Meta', 'Amazon', 'Twitter'],
    description:
      'Given the root of a binary tree, invert the tree, and return its root. Inverting a tree means swapping every left child with its right child.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    examples: [
      {
        input: 'root = [4,2,7,1,3,6,9]',
        output: '[4,7,2,9,6,3,1]',
        explanation: 'All left and right children are recursively swapped.'
      }
    ],
    hints: [
      'What happens if root is None? Return None.',
      'Recursively invert root.left and root.right, then swap them!'
    ],
    editorial: {
      approach: 'Recursive Depth-First Post-order Swap',
      intuition: 'Inverting a binary tree simply requires swapping the left and right subtrees for every node in the hierarchy.',
      algorithmSteps: [
        'Base case: if root is None, return None.',
        'Swap root.left and root.right.',
        'Recursively call invertTree(root.left).',
        'Recursively call invertTree(root.right).',
        'Return root.'
      ],
      timeComplexity: 'O(N) - visits every node once',
      spaceComplexity: 'O(H) - call stack proportional to tree height'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[4, 2, 7, 1, 3, 6, 9]',
        expectedOutput: '[4, 7, 2, 9, 6, 3, 1]'
      },
      {
        id: 'tc-2',
        input: '[2, 1, 3]',
        expectedOutput: '[2, 3, 1]'
      }
    ],
    defaultCode: {
      py: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root):
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invert_tree(root.left)
    invert_tree(root.right)
    return root

# Build tree 2 -> (1, 3)
tree = TreeNode(2, TreeNode(1), TreeNode(3))
inv = invert_tree(tree)
print("Inverted root children:", inv.left.val, inv.right.val)`,
      cpp: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* temp = root->left;
    root->left = invertTree(root->right);
    root->right = invertTree(temp);
    return root;
}`,
      js: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`
    }
  },
  {
    id: 'coin-change',
    title: 'Coin Change (Fewest Coins)',
    topic: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    difficulty: 'Medium',
    timeComplexity: 'O(Amount * Coins)',
    spaceComplexity: 'O(Amount)',
    acceptanceRate: '43.7%',
    sheets: ['blind75', 'striver-sde'],
    companies: ['Amazon', 'Bloomberg', 'Goldman Sachs', 'Microsoft'],
    description:
      'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins).'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: 'Cannot make 3 using only denomination 2.'
      }
    ],
    hints: [
      'Let dp[i] be the minimum coins needed to make amount i.',
      'Base case: dp[0] = 0. All other dp values initialize to infinity.',
      'For each amount from 1 to target, dp[i] = min(dp[i], dp[i - coin] + 1).'
    ],
    editorial: {
      approach: 'Bottom-up Dynamic Programming (Unbounded Knapsack)',
      intuition: 'To form amount a, we can try taking every available coin c <= a and add 1 coin to optimal subproblem dp[a - c].',
      algorithmSteps: [
        'Initialize dp array of size amount + 1 filled with float("inf").',
        'Set dp[0] = 0.',
        'Loop a from 1 to amount: for each coin c in coins: if a - c >= 0: dp[a] = min(dp[a], dp[a - c] + 1).',
        'Return dp[amount] if dp[amount] != inf else -1.'
      ],
      timeComplexity: 'O(Amount * |Coins|) - nested loop',
      spaceComplexity: 'O(Amount) - 1D DP array'
    },
    testCases: [
      {
        id: 'tc-1',
        input: 'coins = [1, 2, 5], amount = 11',
        expectedOutput: '3'
      },
      {
        id: 'tc-2',
        input: 'coins = [2], amount = 3',
        expectedOutput: '-1'
      },
      {
        id: 'tc-3',
        input: 'coins = [1], amount = 0',
        expectedOutput: '0'
      }
    ],
    defaultCode: {
      py: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

print("Fewest coins for 11 with [1,2,5]:", coin_change([1, 2, 5], 11))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (a - c >= 0) {
                dp[a] = min(dp[a], dp[a - c] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

int main() {
    vector<int> coins = {1, 2, 5};
    cout << "Coins: " << coinChange(coins, 11) << endl;
    return 0;
}`,
      js: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a - c >= 0) {
        dp[a] = Math.min(dp[a], dp[a - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log("Coins:", coinChange([1, 2, 5], 11));`
    }
  },
  {
    id: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    topic: 'Heap & Priority Queue',
    pattern: 'Heap / Top K',
    difficulty: 'Medium',
    timeComplexity: 'O(N log K)',
    spaceComplexity: 'O(K)',
    acceptanceRate: '67.2%',
    sheets: ['blind75', 'striver-sde'],
    companies: ['Meta', 'Amazon', 'Microsoft', 'LinkedIn'],
    description:
      'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element. Can you solve it in O(n) or O(n log k) time complexity?',
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        explanation: 'Sorted order is [1, 2, 3, 4, 5, 6]. 2nd largest is 5.'
      }
    ],
    hints: [
      'Sorting takes O(N log N). Can you do better with a min-heap?',
      'Maintain a min-heap of size K. When size exceeds K, pop the minimum.',
      'At the end, the top of the heap is the Kth largest element.'
    ],
    editorial: {
      approach: 'Min-Heap of Size K',
      intuition: 'By keeping a min-heap bounded to size K, the smallest element of the top K largest is always at the root of the heap.',
      algorithmSteps: [
        'Initialize an empty min-heap.',
        'Iterate through each element in nums.',
        'Push element onto heap.',
        'If heap size > k, pop root (the smallest).',
        'Return heap root (heap[0]).'
      ],
      timeComplexity: 'O(N log K) - N insertions into size K heap',
      spaceComplexity: 'O(K) - heap stores K elements'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[3, 2, 1, 5, 6, 4], k = 2',
        expectedOutput: '5'
      },
      {
        id: 'tc-2',
        input: '[3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4',
        expectedOutput: '4'
      }
    ],
    defaultCode: {
      py: `import heapq

def find_kth_largest(nums, k):
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

print("2nd largest in [3,2,1,5,6,4]:", find_kth_largest([3, 2, 1, 5, 6, 4], 2))`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) minHeap.pop();
    }
    return minHeap.top();
}

int main() {
    vector<int> nums = {3, 2, 1, 5, 6, 4};
    cout << "Kth largest: " << findKthLargest(nums, 2) << endl;
    return 0;
}`,
      js: `function findKthLargest(nums, k) {
  // Sort descending and return index k - 1
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}

console.log("Kth largest:", findKthLargest([3, 2, 1, 5, 6, 4], 2));`
    }
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    topic: 'Graphs',
    pattern: 'BFS & DFS',
    difficulty: 'Medium',
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(M * N)',
    acceptanceRate: '58.3%',
    sheets: ['blind75', 'striver-sde'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    description:
      'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    examples: [
      {
        input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
        output: '3',
        explanation: 'There are 3 connected components of 1s.'
      }
    ],
    hints: [
      'Think of each cell as a graph node connected to its 4 neighbors.',
      'Whenever you encounter a 1, increment count and trigger DFS/BFS to sink the entire island (turn 1s into 0s).'
    ],
    editorial: {
      approach: 'Breadth/Depth-First Search Flood Fill',
      intuition: 'Each unvisited land cell starts a new island. Flood-filling all adjacent cells marks them visited so they are not counted again.',
      algorithmSteps: [
        'Iterate through every cell (r, c) in grid.',
        'If cell is "1": increment island count.',
        'Run DFS/BFS starting from (r, c) to convert all connected "1"s into "0"s.',
        'Return total island count.'
      ],
      timeComplexity: 'O(M * N) - each cell visited constant times',
      spaceComplexity: 'O(M * N) - recursion depth in worst case grid of all 1s'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[["1","1","0"],["1","1","0"],["0","0","1"]]',
        expectedOutput: '2'
      }
    ],
    defaultCode: {
      py: `def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0' # mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count

grid = [
    ["1", "1", "0"],
    ["1", "1", "0"],
    ["0", "0", "1"]
]
print("Total Islands:", num_islands(grid))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}

int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    int count = 0;
    for (int r = 0; r < grid.size(); r++) {
        for (int c = 0; c < grid[0].size(); c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }
    return count;
}

int main() {
    vector<vector<char>> g = {{'1','1','0'},{'1','1','0'},{'0','0','1'}};
    cout << "Islands: " << numIslands(g) << endl;
    return 0;
}`,
      js: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}

const g = [["1","1","0"],["1","1","0"],["0","0","1"]];
console.log("Islands:", numIslands(g));`
    }
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    topic: 'Arrays',
    pattern: 'Two Pointers',
    difficulty: 'Hard',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    acceptanceRate: '61.1%',
    sheets: ['blind75', 'striver-sde'],
    companies: ['Google', 'Goldman Sachs', 'Amazon', 'Meta'],
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'In this elevation map, 6 units of rain water are trapped between peaks.'
      }
    ],
    hints: [
      'Water at index i is trapped by: min(max_left, max_right) - height[i].',
      'Use two pointers from left and right. The smaller max decides the water trapped!'
    ],
    editorial: {
      approach: 'Two Pointers Max-Boundary Traversal',
      intuition: 'By moving whichever pointer has a lower maximum barrier, we can compute the exact water trapped above that bar in O(1) space.',
      algorithmSteps: [
        'Set left = 0, right = n - 1.',
        'Set left_max = height[left], right_max = height[right], water = 0.',
        'While left < right:',
        'If left_max < right_max: left++, left_max = max(left_max, height[left]), water += left_max - height[left].',
        'Else: right--, right_max = max(right_max, height[right]), water += right_max - height[right].',
        'Return water.'
      ],
      timeComplexity: 'O(N) - single pass from both ends',
      spaceComplexity: 'O(1) - constant extra space'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        expectedOutput: '6'
      },
      {
        id: 'tc-2',
        input: '[4, 2, 0, 3, 2, 5]',
        expectedOutput: '9'
      }
    ],
    defaultCode: {
      py: `def trap(height):
    if not height:
        return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water

h = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
print("Trapped Water:", trap(h))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    if (height.empty()) return 0;
    int left = 0, right = height.size() - 1;
    int leftMax = height[left], rightMax = height[right];
    int water = 0;
    while (left < right) {
        if (leftMax < rightMax) {
            left++;
            leftMax = max(leftMax, height[left]);
            water += leftMax - height[left];
        } else {
            right--;
            rightMax = max(rightMax, height[right]);
            water += rightMax - height[right];
        }
    }
    return water;
}

int main() {
    vector<int> h = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
    cout << "Trapped Water: " << trap(h) << endl;
    return 0;
}`,
      js: `function trap(height) {
  if (!height.length) return 0;
  let left = 0, right = height.length - 1;
  let leftMax = height[left], rightMax = height[right];
  let water = 0;
  while (left < right) {
    if (leftMax < rightMax) {
      left++;
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
    } else {
      right--;
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
    }
  }
  return water;
}

console.log("Trapped Water:", trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));`
    }
  },
  {
    id: 'merge-intervals',
    title: 'Merge Overlapping Intervals',
    topic: 'Arrays',
    pattern: 'Greedy',
    difficulty: 'Medium',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    acceptanceRate: '47.5%',
    sheets: ['blind75', 'striver-sde'],
    companies: ['Amazon', 'Google', 'Meta', 'Uber'],
    description:
      'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4'
    ],
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].'
      }
    ],
    hints: [
      'Sort the intervals by their start times first.',
      'Compare current interval start with previous merged interval end. If start <= end, extend end to max(end, current_end).'
    ],
    editorial: {
      approach: 'Sort by Start + Greedy Merge',
      intuition: 'Once sorted by start time, overlapping intervals will always appear consecutive in the list.',
      algorithmSteps: [
        'Sort intervals by start time: intervals.sort(key=lambda x: x[0]).',
        'Initialize merged = [intervals[0]].',
        'Loop interval in intervals[1:]:',
        'If interval.start <= merged[-1].end: merged[-1].end = max(merged[-1].end, interval.end).',
        'Else: merged.append(interval).',
        'Return merged.'
      ],
      timeComplexity: 'O(N log N) - sorting dominated',
      spaceComplexity: 'O(N) - output list'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[[1, 3], [2, 6], [8, 10], [15, 18]]',
        expectedOutput: '[[1, 6], [8, 10], [15, 18]]'
      },
      {
        id: 'tc-2',
        input: '[[1, 4], [4, 5]]',
        expectedOutput: '[[1, 5]]'
      }
    ],
    defaultCode: {
      py: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] <= prev[1]:
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)
    return merged

print("Merged:", merge([[1,3],[2,6],[8,10],[15,18]]))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    for (auto& iv : intervals) {
        if (merged.empty() || merged.back()[1] < iv[0]) {
            merged.push_back(iv);
        } else {
            merged.back()[1] = max(merged.back()[1], iv[1]);
        }
    }
    return merged;
}

int main() {
    vector<vector<int>> iv = {{1,3},{2,6},{8,10},{15,18}};
    auto res = merge(iv);
    cout << "Merged count: " << res.size() << endl;
    return 0;
}`,
      js: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const prev = merged[merged.length - 1];
    if (current[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}

console.log("Merged:", JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]])));`
    }
  },
  {
    id: 'single-number',
    title: 'Single Number',
    topic: 'Bit Manipulation',
    pattern: 'Bit Manipulation',
    difficulty: 'Easy',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    acceptanceRate: '72.9%',
    sheets: ['blind75', 'striver-sde', 'college-core'],
    companies: ['Amazon', 'Google', 'Meta'],
    description:
      'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.',
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '-3 * 10^4 <= nums[i] <= 3 * 10^4',
      'Each element in the array appears twice except for one element which appears once.'
    ],
    examples: [
      {
        input: 'nums = [4,1,2,1,2]',
        output: '4',
        explanation: '1 and 2 appear twice. 4 appears once.'
      }
    ],
    hints: [
      'Think about bitwise XOR properties: A ^ A = 0, and A ^ 0 = A.',
      'If you XOR all numbers together, pairs cancel each other out, leaving only the unique element!'
    ],
    editorial: {
      approach: 'Bitwise XOR Accumulator',
      intuition: 'XOR is associative and commutative. Every duplicate cancels to 0: (x ^ x = 0). The solitary number XOR 0 yields itself.',
      algorithmSteps: [
        'Initialize acc = 0.',
        'For each num in nums: acc ^= num.',
        'Return acc.'
      ],
      timeComplexity: 'O(N) - single iteration',
      spaceComplexity: 'O(1) - single integer'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[2, 2, 1]',
        expectedOutput: '1'
      },
      {
        id: 'tc-2',
        input: '[4, 1, 2, 1, 2]',
        expectedOutput: '4'
      }
    ],
    defaultCode: {
      py: `def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

print("Single number in [4,1,2,1,2]:", single_number([4, 1, 2, 1, 2]))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int n : nums) res ^= n;
    return res;
}

int main() {
    vector<int> nums = {4, 1, 2, 1, 2};
    cout << "Single: " << singleNumber(nums) << endl;
    return 0;
}`,
      js: `function singleNumber(nums) {
  return nums.reduce((acc, curr) => acc ^ curr, 0);
}

console.log("Single:", singleNumber([4, 1, 2, 1, 2]));`
    }
  },
  {
    id: 'subsets',
    title: 'Subsets (Power Set)',
    topic: 'Recursion',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    timeComplexity: 'O(N * 2^N)',
    spaceComplexity: 'O(N)',
    acceptanceRate: '77.8%',
    sheets: ['blind75', 'striver-sde', 'college-core'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
    description:
      'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.',
    constraints: [
      '1 <= nums.length <= 10',
      '-10 <= nums[i] <= 10',
      'All the numbers of nums are unique.'
    ],
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
        explanation: 'All 2^3 = 8 subsets.'
      }
    ],
    hints: [
      'At each element, we have a choice: include it or exclude it.',
      'Use backtracking: push element, recurse, pop element (backtrack).'
    ],
    editorial: {
      approach: 'Backtracking State Tree',
      intuition: 'At each index from start to N-1, add nums[i] to current subset, explore further combinations, then remove it.',
      algorithmSteps: [
        'Initialize result = [].',
        'Define backtrack(start, current_subset):',
        'result.append(list(current_subset)).',
        'For i from start to len(nums) - 1: current_subset.append(nums[i]); backtrack(i + 1, current_subset); current_subset.pop().',
        'Call backtrack(0, []). Return result.'
      ],
      timeComplexity: 'O(N * 2^N) - 2^N subsets, copying each takes O(N)',
      spaceComplexity: 'O(N) - recursion call stack'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '[1, 2, 3]',
        expectedOutput: '[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]'
      },
      {
        id: 'tc-2',
        input: '[0]',
        expectedOutput: '[[], [0]]'
      }
    ],
    defaultCode: {
      py: `def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result

print("Subsets of [1,2]:", subsets([1, 2]))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void backtrack(int start, vector<int>& nums, vector<int>& path, vector<vector<int>>& res) {
    res.push_back(path);
    for (int i = start; i < nums.size(); i++) {
        path.push_back(nums[i]);
        backtrack(i + 1, nums, path, res);
        path.pop_back();
    }
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> path;
    backtrack(0, nums, path, res);
    return res;
}

int main() {
    vector<int> nums = {1, 2};
    auto r = subsets(nums);
    cout << "Total subsets: " << r.size() << endl;
    return 0;
}`,
      js: `function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}

console.log("Subsets:", JSON.stringify(subsets([1, 2])));`
    }
  }
];
