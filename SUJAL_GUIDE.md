# 🌏 Budget Bandhu: The Ultimate Sujal's Manifesto

Welcome, Sujal. You are now the guardian of **Budget Bandhu**. This project isn't just code; it's a financial revolution designed to empower users with AI. 

This guide is **exhaustively detailed**. It breaks down the repository **file-by-file** so you can navigate the codebase like you wrote it yourself.

---

## 📂 Root Configuration Files

- **`.env.local`**: The "Glbs". Contains `NEXT_PUBLIC_ML_API_URL` which points to Tanuj's FastAPI backend. Essential for all ML features.
- **`package.json`**: The heart of the build. Note the high-end dependencies: `three.js`, `gsap`, `framer-motion`, and `zustand`. 
- **`tsconfig.json`**: Strict TypeScript configuration for type safety.
- **`next.config.ts`**: Standard Next.js config.
- **`tailwind.config.ts`**: Custom design tokens, including a "Metamask" inspired color palette and animations.
- **`postcss.config.mjs`**: CSS processing.
- **`eslint.config.mjs`**: Keeping the code clean and consistent.

---

## 🏗 Source Code (`src/`)

### 🌐 App Router (`src/app/`)
This is where the routing and page logic live.

- **`layout.tsx`**: The Root Layout. It wraps the app in `ConditionalLayout`, `Toaster`, and Google Fonts (Outfit).
- **`page.tsx`**: The **Landing Page**. It's a visual masterpiece using `Framer Motion` for reveal animations and `GSAP` for smooth transitions.
- **`globals.css`**: Base Tailwind directives and root CSS variables.

#### 📁 Routes
- **`auth/`**:
    - `login/page.tsx` & `register/page.tsx`: Mobile-first authentication flows.
- **`transactions/page.tsx`**: The heavy lifter. Handles:
    - Manual transaction entry.
    - Bulk upload via CSV/JSON.
    - OCR receipt scanning integration.
    - Real-time anomaly flagging (High/Medium/Low).
- **`chat/page.tsx`**: The AI Assistant interface. Connects to the RAG pipeline for financial advice.
- **`budget/`**, **`goals/`**, **`gamification/`**: Dedicated pages for each specific ML feature.
- **`literacy/`**: Educational content for users.
- **`profile/`**: User settings and income management.

---

### 🎨 Internal Architecture (`src/components/`)

#### 📁 UI Atoms (`src/components/ui/`)
Standardized components following the design system:
- **`button.tsx`**: High-performance interactive buttons.
- **`card.tsx`**: The building block for the dashboard, with custom hover expansions (`card-hover-expand.css`).
- **`input.tsx`**: Accessible, styled form inputs.
- **`modal.tsx` / `dialogue.tsx`**: For overlays and popups.
- **`progress.tsx`**: Used heavily in Goals and Gamification.

#### 📁 Complex Shared Logic (`src/components/shared/`)
- **`Logo3D.tsx`**: Uses `Three.js` to render a 3D animated Budget Bandhu logo.
- **`ParallaxBackground.tsx`**: Creates depth on the landing page.
- **`LanguageSelector.tsx`**: Handles the translation of the UI into 10+ Indian languages using the `translate` API service.
- **`MockToggle.tsx`**: Allows Sujal to test the UI even when the ML backend is offline by switching to mock data.

---

### 🧠 The Brain (`src/lib/`)

#### 📁 API Client (`src/lib/api/`)
- **`ml-api.ts`**: **CRITICAL FILE.** Maps every single endpoint on Tanuj's FastAPI.
    - `user`: Auth & Profile.
    - `transactions`: Add, Bulk, Stats, Anomalies.
    - `budget`: Recommendations & Feedback loop.
    - `chat`: RAG communication.
    - `ocr`: Image processing.
- **`client.ts`**: The `smartFetch` wrapper that handles errors and logging.
- **`mock-data.ts`**: Exhaustive mock dataset for development.

#### 📁 Stores (`src/lib/store/`)
- **`useUserStore.ts`**: Using `Zustand` with `persist`. Saves the user session to `localStorage`. If you need to change how auth works, start here.

#### 📁 Utilities (`src/lib/utils/`)
- **`formatters.ts`**: Currency symbols (₹) and date formatting.
- **`gamification.ts`**: XP calculation logic and badge trigger descriptions.

---

### 💅 Styles (`src/styles/`)
A modular CSS system that goes beyond Tailwind:
- **`metamask-theme.css`**: Recreates the premium look of decentralized apps.
- **`animations.css`**: Custom keyframes for those "1000x" micro-animations.
- **`chat-page.css`**: Highly specific styling for the AI chat bubble interactions.

---

## 🚀 Sujal's "1000x" To-Do List

1.  **Voice Integration**: Use the Web Speech API to let users "talk" to their budget.
2.  **Web3 Wallets**: Integrate MetaMask to track crypto assets alongside fiat.
3.  **Predictive Analytics**: The backend has a `forecast` endpoint—build a "Crystal Ball" UI for it.
4.  **Social Saving**: Add a way to share saving streaks to WhatsApp directly from the UI.

Now, go forth and build the future of finance! 🚀
