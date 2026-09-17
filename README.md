# CodeVault ⚡
link:https://code-vault1.netlify.app/

CodeVault is a cloud-native coding workspace, DSA practice platform, and snippet management IDE. It features real sandboxed code execution, step-by-step algorithm visualizers, an integrated Gemini AI assistant, and persistent cloud synchronization with Firebase.

---

## Key Features

### 1. Real IDE Sandboxed Execution Engine
- **Multi-Language Runtimes**: Live compilation and execution for:
  - **C++23**: GCC HEAD with `-O2 -std=c++23`
  - **C17**: GCC HEAD Native Compiler
  - **Java**: OpenJDK 21 LTS (`javac` / `java`)
  - **Python**: CPython 3.14 Official VM
  - **JavaScript**: Node.js 20 LTS (V8 Engine)
  - **Rust & Go**: Compiler support via Wandbox sandboxes
- **Full Standard I/O**: Captures real `stdout`, detailed compiler warnings, and runtime `stderr` diagnostics with exact process exit codes and latency benchmarks.
- **Custom STDIN Stream**: Dedicated interactive standard input buffer for programs utilizing `cin`, `input()`, `Scanner`, and standard input streams.
- **Client-Side Fallback Engine**: Embedded JS/Python/Java simulation VM that ensures uninterrupted offline capability if external sandbox endpoints are unreachable.

### 2. DSA Practice & Problem Bank
- Curated collection of fundamental data structures and algorithms problems (Arrays, Two Pointers, Binary Search, Dynamic Programming, Trees, and Graphs).
- Multi-language starter templates with automated test suites and sample verification.

### 3. Algorithm Step-by-Step Visualizer
- Interactive, step-by-step visualizers demonstrating algorithmic execution states:
  - Binary Search pointer convergence (`low`, `mid`, `high`)
  - Two Pointers array traversal
  - Array sorting passes with live swaps and element comparisons

### 4. Gemini AI Coding Assistant
- Context-aware coding assistant powered by Google Gemini.
- Capabilities include code explanation, bug detection, time/space complexity analysis, and DSA problem hint generation.

### 5. Cloud Persistence & Resilient Authentication
- **Firebase Authentication**: Native Google OAuth and Email/Password sign-in.
- **Instant Vault Mode**: Zero-friction local authentication fallback that allows instant sign-in with your developer email even when offline or before cloud providers are configured.
- **Cloud Firestore**: Real-time synchronization and storage of user-created snippets, bookmarks, and DSA solving progress.

#### Enabling Live Cloud Email/Password in Firebase Console:
If you see a notice that Email/Password is not enabled or domain is unauthorized:
1. Open [Firebase Console](https://console.firebase.google.com/) and choose your project (`ai-studio-instantlayoutbui-15515df1-6d60-4a60-9842-6d16214301d8`).
2. Navigate to **Build > Authentication > Sign-in method**.
3. Click on **Email/Password**, toggle **Enable**, and click **Save**.
4. To allow sign-in from your Netlify domain (`code-vault01.netlify.app`):
   - Go to **Authentication > Settings > Authorized domains**.
   - Click **Add domain**, enter `code-vault01.netlify.app`, and save.
5. In CodeVault, you can also click **1-Tap Sign In** or **Continue (Instant Vault Mode)** to access your vault immediately without any setup required.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React & Material Symbols
- **AI**: Google Gen AI SDK (`@google/genai`)
- **Backend & Persistence**: Firebase Auth & Cloud Firestore
- **Compiler Infrastructure**: Wandbox Sandboxed Execution API

---

## Getting Started

### Prerequisites
- Node.js (version 20 or higher recommended)
- npm or bun

### Installation

1. Clone or extract the repository:
   ```bash
   git clone <repository-url>
   cd codevault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Launch Development Server:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

---

## Available Scripts

- `npm run dev`: Starts the Vite development server on port 3000.
- `npm run build`: Compiles TypeScript and creates an optimized production build in `dist/`.
- `npm run lint`: Performs type checking using `tsc --noEmit`.
- `npm run preview`: Previews the production build locally.
- `npm run clean`: Cleans build output directories.

---

## Security & Architecture

- **Sandbox Isolation**: Arbitrary user code is executed in isolated microVM containers with airgapped network policies and resource caps (memory, CPU, timeout limits).
- **API Protection**: Sensitive API credentials and Firebase configurations are secured and decoupled from public distribution.

---

## License

This project is open source and available under the [MIT License](LICENSE).
