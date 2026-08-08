# TypingGuru BN/EN — Bangla & English Typing Test & Assessment Platform

[![React](https://img.shields.io/badge/React-19.1-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black.svg?logo=vercel)](https://vercel.com/)

**TypingGuru** is a modern, high-performance **Bangla and English** typing tutor, free-form practice, and recruitment examination platform built with **React 19, Vite, TypeScript, and Tailwind CSS**. 

Designed specifically for job candidates, students, and professionals in Bangladesh and beyond, TypingGuru features layout support for **Bijoy (Unicode-mapped)**, **Avro Phonetic**, and **National (Jatiyo Unicode)** keyboard standards, comprehensive step-by-step tutorials, custom text typing, real-time analytics, and government-standard recruitment exam simulations.

---

## 🌟 Key Features

### ⌨️ 1. Multi-Layout Bangla Input Engine
- **Bijoy (Unicode-mapped)**: Default recruiter standard layout mapping physical keys to clean Bangla Unicode codepoints (NFC normalized).
- **Avro Phonetic**: Stateful phonetic conversion engine (`amar` → `আমার`).
- **National (Jatiyo)**: Standard fixed Unicode layout specification.
- Seamless layout switching with zero layout-shifting or font glitches using self-hosted **Hind Siliguri** and **Noto Sans Bengali** typography.

### 📚 2. 22+ Step-by-Step Bangla Tutorial Lessons
- **Serialized Lesson Sidebar**: 22+ structured lessons progressing from basic vowels (`অ-ঔ`), vowel marks (`কার চিহ্ন`), consonant groups (`ক-বর্গ` to `প-বর্গ`), numbers (`০-৯`), punctuation, complex conjuncts (`যুক্তাক্ষর`), to official government sentences.
- **Humanized Bangla Guides**: Every lesson includes dedicated instructional guidance explaining key positions, finger alignment, and tips in natural Bangla.
- **Sub-Lesson Drills & Mixed Practice**: Practice individual characters, target words, or trigger automated **"মিশ্র অনুশীলন" (Mixed Practice)** drills combining all characters from a lesson.
- **100+ Practice Sentences**: Built-in corpus categorized by difficulty (Beginner, Intermediate, Advanced, Mixed).
- **Custom Text & Free Typing**: Option to paste custom text or practice in a blank free-form typing field without target prompts.
- **Configurable Timer**: Switch session duration on the fly between **30s**, **1 min** (default), **2 min**, and **5 min**.

### 🎯 3. Free-Form Practice & Weakness Engine
- **Difficulty Filtering**: Filter practice paragraphs and words by `Easy`, `Medium`, or `Hard`.
- **1-Click Weakness Engine**: Dynamically generates targeted drills focusing on characters you historically struggle with based on local storage analytics.
- **Custom Text Input**: Paste any custom Bangla or English passage to practice at your own pace.

### 🏆 4. Government & Corporate Recruitment Exam Simulation
- **Standardized Exam Sets**: Curated recruitment test packages matching real government ministry, secretariat, and banking sector typing assessments.
- **Strict Mode (Exam Condition)**: Toggleable Strict Mode that disables Backspace to simulate real recruitment hall constraints.
- **Automated Pass/Fail Criteria**: Automatic evaluation based on Net WPM, CPM, and maximum allowed error rate thresholds.

### 📊 5. Real-Time Analytics & Feedback
- **Live Counters**: Real-time Gross WPM, Net WPM, CPM, Accuracy %, and countdown/countup timers.
- **Historical Trends & Heatmaps**: Track speed progression over time and view character-by-character error heatmaps.
- **Audio Feedback Engine**: Optional keyclick sounds, error warning beeps, and completion chimes.

### 📁 6. Decoupled JSON Content Architecture
- Content (passages, words, exams, characters) is **100% decoupled** from application logic in structured JSON files (`/src/content/bangla/`, `/src/content/english/`). Adding new content requires zero code changes.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **Language** | TypeScript 5.8 (Strict Mode) |
| **Styling** | Tailwind CSS 3.4 + Glassmorphism Aesthetics |
| **Icons** | Lucide React |
| **Audio** | Web Audio API / Sound Engine Adapter |
| **Storage** | Decoupled `StorageAdapter` (localStorage → API ready) |
| **Typography** | Hind Siliguri, Noto Sans Bengali, Inter |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **pnpm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/typingTest.git
   cd typingTest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📖 Content Management Guide

All content resides inside the [`/src/content/`](file:///f:/Professional%20WebApp/typingTest/src/content) directory. You can add or modify practice materials without touching TypeScript or React code.

### Folder Structure
```
src/content/
├── bangla/
│   ├── characters.json          # 22+ tutorial lessons & guides
│   ├── tutorial-sentences.json  # 100+ practice sentences
│   ├── words-common.json        # Word drill dataset
│   ├── paragraphs.json          # Practice paragraphs
│   └── exam-sets.json           # Timed recruitment exam papers
└── english/
    ├── words-common.json
    ├── paragraphs.json
    └── exam-sets.json
```

### Example: Adding a New Practice Paragraph
Edit [`src/content/bangla/paragraphs.json`](file:///f:/Professional%20WebApp/typingTest/src/content/bangla/paragraphs.json):
```json
{
  "id": "bn-para-16",
  "title": "আপনার অনুচ্ছেদের শিরোনাম",
  "category": "প্রশাসন",
  "difficulty": "medium",
  "text": "এখানে আপনার টাইপিং অনুচ্ছেদ টেক্সট লিখুন..."
}
```

### Example: Adding a New Exam Package
Edit [`src/content/bangla/exam-sets.json`](file:///f:/Professional%20WebApp/typingTest/src/content/bangla/exam-sets.json):
```json
{
  "id": "exam-set-bn-09",
  "title": "নতুন বিসিএস/সরকারি নিয়োগ টাইপিং সেট",
  "type": "paragraph",
  "durationSec": 300,
  "difficulty": "standard",
  "content": "পরীক্ষার অনুচ্ছেদ টেক্সট...",
  "passCriteria": {
    "minWpm": 25,
    "minCpm": 125,
    "maxErrorRate": 0.05
  }
}
```

---

## 🤝 Open Source Contribution & PR Guidelines

We welcome contributions from the community! Whether you want to add new Bangla content, enhance input layout keymaps, build new UI features, or fix bugs, please follow these guidelines.

### Workflow & Branching Strategy

1. **Fork the Repository**: Create your own fork on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes
   git checkout -b fix/your-bug-fix
   ```
3. **Keep Commits Clean & Descriptive**: Use conventional commit messages:
   - `feat: add 5 new government exam sets for Bangla`
   - `fix: correct Bijoy layout mapping for reph character`
   - `docs: update setup guide in README`

### Code Standards & Conventions
- **Strict TypeScript**: Avoid `any` types. Add explicit interfaces in [`src/types/index.ts`](file:///f:/Professional%20WebApp/typingTest/src/types/index.ts).
- **Unicode Normalization**: Always verify that Bangla text changes apply `NFC` normalization (`String.prototype.normalize('NFC')`).
- **Decoupled Architecture**: Never hardcode text passages inside React UI components. Always place text content in `/src/content/`.
- **Component Styling**: Use Tailwind CSS utilities and existing glassmorphism classes (`glass-panel`, `glass-card`).
- **Build Verification**: Run `npm run build` locally to ensure zero TypeScript compiler (`tsc`) errors before creating a Pull Request.

### Pull Request Checklist
Before submitting your PR, ensure:
- [ ] Code builds cleanly with `npm run build` (`tsc && vite build`).
- [ ] No syntax or linting errors exist.
- [ ] All new content JSON files follow the required schema.
- [ ] PR description clearly explains the changes made and includes screenshots for UI modifications.

---

## 🌐 Deployment (Vercel)

This project is optimized for 1-click deployment on **Vercel**:

1. Push your repository to GitHub.
2. Connect your repo on [Vercel Dashboard](https://vercel.com/).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it for personal, educational, or commercial projects.

---

<p center font-sans text-xs text-slate-400>
Made with ❤️ for the Bangla & English Typing Community.
</p>
