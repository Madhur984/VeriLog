# BitForBytes / VeriLog

An interactive web-based educational platform that teaches digital logic fundamentals, Verilog HDL synthesis, and chip design from zero.

---

## ⚡ VoltMonkey AI & Interactive Navigation Bot

**VoltMonkey** is the in-app AI study buddy and interactive site navigator. It features a dual-indexing RAG architecture that allows students to ask questions or navigate the platform naturally.

### 🧠 Dual-Indexing RAG Architecture

1. **Route Map Collection (`routes`)**: Indexes `routes.json` with domain keywords, categories, and descriptions.
2. **Codebase Collection (`codebase`)**: Indexes source files via `GitLoader` and semantic chunking.
3. **Intent Classifier**: Automatically detects `NAVIGATE` vs `INFO` intents.
   - **Navigation Queries** (e.g. *"Take me to verilog playground"*): Returns structured JSON actions `{ "type": "navigate", "path": "/verilog-playground", ... }`.
   - **Informational Queries** (e.g. *"What is a K-Map?"*): Returns grounded Markdown explanations with relevant route links.

---

## 🚀 How to Index Routes & Run Tests

### 1. Extract & Index Site Routes
Extract site routes into `routes.json` and build ChromaDB vector collections:

```bash
# 1. Extract routes from PDF / route map
python3 extract_routes.py

# 2. Build Chroma vector DB collections ('routes' and 'codebase')
python3 rag_pipeline.py
```

### 2. Run Navigation Bot Test Suite
Execute the automated test suite to verify intent classification and navigation target accuracy:

```bash
python3 test_nav_bot.py
```

---

## 🎨 Interactive Navigation UI Components

The frontend ([`AssistantPanel.tsx`](file:///Users/adarshyadav/Desktop/VeriLog/frontend/src/components/AssistantPanel.tsx)) automatically parses navigation actions and displays:
- **Auto-Redirect Toast:** Live 2-second countdown with pulsing visual indicator before executing navigation.
- **Manual Fallback Button:** Neo-brutalist `"Go there"` button to navigate manually.
- **Cancel Button:** Stops auto-redirection if the student prefers to stay on the current page.

---

## 🎯 Platform Features

- **Interactive Activities:**
  - Complete the Circuit (Signals & loops)
  - AND / OR / NOT Logic Decision Workbench
  - Multi-Gate & Netlist Workbench
- **Hardware LeetCode (Verilog Judge):** Write Verilog and grade against testbenches in browser.
- **K-Map Lab:** Karnaugh map minimisation lab.
- **Career Roadmap:** From Sand to Silicon VLSI career guidance.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand
- **Backend / Edge:** Supabase Edge Functions (Deno), Python RAG services, LangChain, ChromaDB
- **LLM Fallback Stack:** Groq, Cerebras, Google Gemini, OpenRouter, Mistral AI

---

## 📁 Project Structure

```
├── frontend/             # React application & UI components
│   └── src/
│       ├── components/
│       │   └── AssistantPanel.tsx  # Interactive VoltMonkey AI Chatbot UI
│       └── lib/
│           ├── assistant.ts        # Client API for Edge Function
│           └── pageContext.ts      # Live DOM & route context reader
├── supabase/
│   └── functions/
│       └── assistant/index.ts      # Multi-provider Edge proxy & system prompt
├── extract_routes.py     # Parses site route map into routes.json
├── rag_pipeline.py       # Dual-indexing Chroma RAG pipeline
├── rag_agent.py          # RAG Navigation Agent & Intent Classifier
├── test_nav_bot.py       # Automated integration test suite
└── routes.json           # Site route map database
```
