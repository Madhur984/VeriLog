# VeriQuest - Phase 1

An interactive web-based educational platform that teaches digital logic fundamentals through game-like activities.

## 🎯 Features

- **4 Interactive Activities:**
  - Activity 1: Complete the Circuit (learn about signals)
  - Activity 2: AND Gate Decision (hardware decision-making)
  - Activity 3: OR Gate Decision (different logic gates)
  - Activity 4: Multi-Gate Workbench (combining gates)

- **Game-Like Experience:**
  - Drag-and-drop circuit building
  - Animated wire glow effects
  - LED mascot bot character
  - Smooth animations with anime.js
  - Confetti celebrations

- **Educational Focus:**
  - Visual-first learning
  - No theory dumps
  - Interaction before explanation
  - Encouraging feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **anime.js** - Animations
- **SVG** - Circuit graphics

## 📁 Project Structure

```
src/
├── components/
│   ├── Bot/              # Bot character component
│   ├── activities/       # 4 learning activities
│   └── WelcomeScreen.tsx # Entry screen
├── stores/               # Zustand state stores
├── constants/            # Animation timings, messages
├── types/                # TypeScript interfaces
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## 🎮 How to Use

1. Click "Start Playing" on the welcome screen
2. Complete Activity 1 by dragging components to complete the circuit
3. Progress through Activities 2-4, learning about logic gates
4. Enjoy the confetti celebration when you complete Activity 4!

## 📝 Phase-1 Scope

This is Phase-1 only, which includes:
- ✅ 4 pre-login activities
- ✅ Bot character system
- ✅ Drag-and-drop simulator
- ✅ Wire glow animations
- ✅ Interactive switches and gates

**Not included in Phase-1:**
- ❌ User accounts / login
- ❌ Verilog coding
- ❌ FSMs, clocks, timing diagrams
- ❌ Mobile app
- ❌ Backend server

## 🎨 Design Philosophy

VeriQuest follows a **Visual → Interaction → Intuition → Naming** approach:
1. Show the component visually
2. Let users interact with it
3. Observe what happens
4. Then introduce terminology

Inspired by: Duolingo × Angry Birds × Among Us electrical tasks

## 📄 License

This project is part of an educational initiative.

## 🤝 Contributing

This is a Phase-1 implementation. Future phases will expand functionality.
