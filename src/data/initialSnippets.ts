import { Snippet, UserProfile } from '../types';

export const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 'circular-linked-list',
    title: 'Circular Linked List',
    language: 'cpp',
    languageLabel: 'C++',
    topic: 'Linked List',
    tags: ['DSA', 'LinkedList'],
    updatedAt: '13 Sep 2026',
    description: 'Practice implementation of circular singly linked list with head pointer, insertion at tail, node traversal, and memory cleanup.',
    complexity: 'ptr loop',
    runtimeSpec: 'x86_64 GCC 12.2',
    notes: 'Circular singly linked list with tail pointer maintenance for O(1) appending and loop validation.',
    starred: true,
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class CircularLinkedList {
    Node* head;
public:
    CircularLinkedList() : head(nullptr) {}
    void insert(int val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = newNode;
            head->next = head;
            return;
        }
        Node* temp = head;
        while (temp->next != head) temp = temp->next;
        temp->next = newNode;
        newNode->next = head;
    }

    void display() {
        if (!head) return;
        Node* temp = head;
        do {
            cout << temp->data << " -> ";
            temp = temp->next;
        } while (temp != head);
        cout << "(head: " << head->data << ")" << endl;
    }
};

int main() {
    CircularLinkedList cll;
    cll.insert(10);
    cll.insert(20);
    cll.insert(30);
    cout << "✔ Circular Linked List initialized successfully." << endl;
    cout << "➜ Nodes connected in ring: ";
    cll.display();
    cout << "✔ Traversal complete with zero memory leaks." << endl;
    return 0;
}`,
    previewLines: [
      { num: '01', text: 'struct Node { int val; Node* next; };' },
      { num: '02', text: 'void insertEnd(Node** head, int data) {' },
      { num: '03', text: '    // Traverse till last node connects to head' }
    ],
    lastExecution: {
      exitCode: 0,
      time: '0.14s',
      memory: '14.2 MB',
      output: `$ g++ -O2 circular_linked_list.cpp -o main && ./main
✔ Circular Linked List initialized successfully.
➜ Nodes connected in ring: 10 -> 20 -> 30 -> (head: 10)
✔ Traversal complete with zero memory leaks.
----------------------------------------
Program executed successfully.`
    }
  },
  {
    id: 'dijkstra-shortest-path',
    title: 'Dijkstra Shortest Path',
    language: 'cpp',
    languageLabel: 'C++',
    topic: 'Graph Theory',
    tags: ['Graph Theory', 'Greedy', 'ShortestPath'],
    updatedAt: '10 Sep 2026',
    description: 'Single-source shortest path algorithm using priority queue and adjacency list on non-negative weighted graphs.',
    complexity: 'Greedy',
    runtimeSpec: 'x86_64 GCC 12.2',
    notes: 'O((V + E) log V) time complexity using std::priority_queue with min-heap comparator.',
    starred: true,
    code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

typedef pair<int, int> Pair;

void dijkstra(int src, int V, vector<vector<Pair>>& adj) {
    priority_queue<Pair, vector<Pair>, greater<Pair>> pq;
    vector<int> dist(V, 1e9);
    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        int u = pq.top().second;
        int d = pq.top().first;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }

    cout << "Dijkstra computed from node " << src << ":" << endl;
    for (int i = 0; i < V; ++i) {
        cout << "Node " << i << " -> Distance: " << dist[i] << endl;
    }
}

int main() {
    int V = 4;
    vector<vector<Pair>> adj(V);
    adj[0].push_back({1, 4});
    adj[0].push_back({2, 1});
    adj[2].push_back({1, 2});
    adj[1].push_back({3, 1});
    adj[2].push_back({3, 5});
    dijkstra(0, V, adj);
    return 0;
}`,
    previewLines: [
      { num: '01', text: 'priority_queue<Pair, vector<Pair>, greater<Pair>> pq;' },
      { num: '02', text: 'dist[src] = 0;' },
      { num: '03', text: 'pq.push({0, src}); // O(E log V) complexity' }
    ],
    lastExecution: {
      exitCode: 0,
      time: '0.18s',
      memory: '15.1 MB',
      output: `$ g++ -O2 dijkstra.cpp -o dijkstra && ./dijkstra
Dijkstra computed from node 0:
Node 0 -> Distance: 0
Node 1 -> Distance: 3
Node 2 -> Distance: 1
Node 3 -> Distance: 4
----------------------------------------
Program executed successfully.`
    }
  },
  {
    id: 'merge-sort-in-place',
    title: 'Merge Sort In-Place',
    language: 'java',
    languageLabel: 'Java',
    topic: 'Sorting',
    tags: ['Sorting', 'DivideAndConquer', 'SpaceOptimized'],
    updatedAt: '05 Sep 2026',
    description: 'In-place merge sort algorithm implementing shell-gap approach for strict auxiliary O(1) memory consumption.',
    complexity: 'O(1) Space',
    runtimeSpec: 'OpenJDK 17 HotSpot',
    notes: 'Uses gap method (similar to Shell Sort) to merge two sorted segments in place.',
    starred: false,
    code: `import java.util.Arrays;

public class MergeSortInPlace {
    private static int nextGap(int gap) {
        if (gap <= 1) return 0;
        return (gap / 2) + (gap % 2);
    }

    public static void inPlaceMerge(int[] arr, int start, int end) {
        int gap = end - start + 1;
        for (gap = nextGap(gap); gap > 0; gap = nextGap(gap)) {
            for (int i = start; i + gap <= end; i++) {
                int j = i + gap;
                if (arr[i] > arr[j]) {
                    int tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] nums = {12, 4, 8, 3, 19, 1, 7};
        System.out.println("Original: " + Arrays.toString(nums));
        inPlaceMerge(nums, 0, nums.length - 1);
        System.out.println("Sorted In-Place: " + Arrays.toString(nums));
    }
}`,
    previewLines: [
      { num: '01', text: 'public void inPlaceMerge(int[] arr, int start, int end) {' },
      { num: '02', text: '    int gap = end - start + 1;' },
      { num: '03', text: '    for (gap = nextGap(gap); gap > 0; gap = nextGap(gap))' }
    ],
    lastExecution: {
      exitCode: 0,
      time: '0.24s',
      memory: '22.8 MB',
      output: `$ javac MergeSortInPlace.java && java MergeSortInPlace
Original: [12, 4, 8, 3, 19, 1, 7]
Sorted In-Place: [1, 3, 4, 7, 8, 12, 19]
----------------------------------------
Program executed successfully.`
    }
  },
  {
    id: 'lru-cache-implementation',
    title: 'LRU Cache Implementation',
    language: 'py',
    languageLabel: 'Python',
    topic: 'System Design',
    tags: ['System Design', 'Cache', 'DSA'],
    updatedAt: '28 Aug 2026',
    description: 'Least Recently Used (LRU) Cache data structure with O(1) get and put operations via hashmap and doubly linked list.',
    complexity: 'OrderedDict',
    runtimeSpec: 'Python 3.10 CPython',
    notes: 'Standard LeetCode 146 solution using collections.OrderedDict with move_to_end.',
    starred: true,
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

if __name__ == "__main__":
    lru = LRUCache(2)
    lru.put(1, 1)
    lru.put(2, 2)
    print("get(1):", lru.get(1))
    lru.put(3, 3) # evicts key 2
    print("get(2) [evicted]:", lru.get(2))
    print("LRU Cache operations verified.")`,
    previewLines: [
      { num: '01', text: 'class LRUCache:' },
      { num: '02', text: '    def __init__(self, capacity: int):' },
      { num: '03', text: '        self.cache = OrderedDict()' }
    ],
    lastExecution: {
      exitCode: 0,
      time: '0.09s',
      memory: '11.4 MB',
      output: `$ python3 lru_cache.py
get(1): 1
get(2) [evicted]: -1
LRU Cache operations verified.
----------------------------------------
Program executed successfully.`
    }
  },
  {
    id: 'binary-search-tree-balancing',
    title: 'Binary Search Tree Balancing',
    language: 'java',
    languageLabel: 'Java',
    topic: 'Trees',
    tags: ['Trees', 'AVL', 'BST'],
    updatedAt: 'Yesterday',
    description: 'Self-balancing AVL tree rotation algorithm handling LL, RR, LR, and RL imbalance states with recursive height updates.',
    complexity: 'AVL Rotation ready',
    runtimeSpec: 'OpenJDK 17 HotSpot',
    notes: 'Height-balanced binary search tree with logarithmic height guarantee.',
    starred: false,
    code: `class AVLNode {
    int key, height;
    AVLNode left, right;

    AVLNode(int d) {
        key = d;
        height = 1;
    }
}

public class AVLTree {
    AVLNode root;

    int height(AVLNode N) {
        return (N == null) ? 0 : N.height;
    }

    int getBalance(AVLNode N) {
        return (N == null) ? 0 : height(N.left) - height(N.right);
    }

    AVLNode rightRotate(AVLNode y) {
        AVLNode x = y.left;
        AVLNode T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        return x;
    }

    AVLNode insert(AVLNode node, int key) {
        if (node == null) return new AVLNode(key);
        if (key < node.key) node.left = insert(node.left, key);
        else if (key > node.key) node.right = insert(node.right, key);
        else return node;

        node.height = 1 + Math.max(height(node.left), height(node.right));
        int balance = getBalance(node);

        if (balance > 1 && key < node.left.key) return rightRotate(node);
        return node;
    }

    public static void main(String[] args) {
        AVLTree tree = new AVLTree();
        tree.root = tree.insert(tree.root, 10);
        tree.root = tree.insert(tree.root, 20);
        tree.root = tree.insert(tree.root, 30);
        System.out.println("AVL Tree balanced successfully. Root key: " + tree.root.key);
    }
}`,
    previewLines: [
      { num: '01', text: 'class AVLNode { int key, height; AVLNode left, right; }' },
      { num: '02', text: 'AVLNode rightRotate(AVLNode y) {' },
      { num: '03', text: '    AVLNode x = y.left; y.left = x.right; return x;' }
    ],
    lastExecution: {
      exitCode: 0,
      time: '0.22s',
      memory: '24.1 MB',
      output: `$ javac AVLTree.java && java AVLTree
AVL Tree balanced successfully. Root key: 20
----------------------------------------
Program executed successfully.`
    }
  },
  {
    id: 'fast-matrix-exponentiation',
    title: 'Fast Matrix Exponentiation',
    language: 'py',
    languageLabel: 'Python',
    topic: 'Math / DSA',
    tags: ['Math', 'DSA', 'DivideAndConquer'],
    updatedAt: '3d ago',
    description: 'Calculate large Fibonacci numbers and recurrence relations in logarithmic O(log N) time complexity with 2x2 matrix powers.',
    complexity: 'O(log N) optimized',
    runtimeSpec: 'Python 3.10 CPython',
    notes: 'Used in competitive programming for calculating 10^18-th Fibonacci terms modulo 10^9+7.',
    starred: true,
    code: `MOD = 10**9 + 7

def multiply(A, B):
    return [
        [(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % MOD, (A[0][0]*B[0][1] + A[0][1]*B[1][1]) % MOD],
        [(A[1][0]*B[0][0] + A[1][1]*B[1][0]) % MOD, (A[1][0]*B[0][1] + A[1][1]*B[1][1]) % MOD]
    ]

def power(M, p):
    res = [[1, 0], [0, 1]]
    base = M
    while p > 0:
        if p & 1:
            res = multiply(res, base)
        base = multiply(base, base)
        p >>= 1
    return res

def fibonacci(n):
    if n == 0: return 0
    T = [[1, 1], [1, 0]]
    result = power(T, n - 1)
    return result[0][0]

if __name__ == "__main__":
    n = 1000
    print(f"Fibonacci({n}) mod {MOD} = {fibonacci(n)}")
    print("Matrix Exponentiation O(log N) completed.")`,
    previewLines: [
      { num: '01', text: 'def power(M, p):' },
      { num: '02', text: '    res = [[1, 0], [0, 1]]; base = M' },
      { num: '03', text: '    while p > 0: if p & 1: res = multiply(res, base)...' }
    ],
    lastExecution: {
      exitCode: 0,
      time: '0.08s',
      memory: '10.8 MB',
      output: `$ python3 matrix_expo.py
Fibonacci(1000) mod 1000000007 = 517691607
Matrix Exponentiation O(log N) completed.
----------------------------------------
Program executed successfully.`
    }
  }
];

export const CURRENT_USER: UserProfile = {
  name: 'Alex Rivera',
  email: 'developer@example.com',
  handle: '@alex_vault',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1NJYDLITUJtWuif4ZLzACs5PV3NwOU4KvGv6yTloaF6UuRcLimEp8jmrpm7b_dJ1PJl8UNSHHHjyDAJa9Snb4nLOGme4TSTJnF3vO_mXm4C2iDnD1MoK4VVJrnILbWo2XMbepn_kVJuQmqs345lFiET3QzLnPpA4tbX6ScNt1bS9V9kpFH8OC3MpZhNMgu8l5E9T5DO8wcvIBdUOnQT7bTvQFlHcHGwyGB3aNjA12Z-pUdM1hTNLX',
  codesSaved: 18,
  maxCodes: 500,
  vaultStatus: 'Active'
};

export const initialSnippets = INITIAL_SNIPPETS;
export const defaultUserProfile = CURRENT_USER;
