# Workspace Rules & Guidelines — Bangla & English Typing Test Platform

## 1. Project Overview & Architecture
This repository contains a high-performance **Bangla + English Typing Test & Tutor Platform** built with **React 18, Vite, TypeScript, and Tailwind CSS**.

- **Decoupled JSON Content**: Passages, character sets, drills, and exam packages are stored strictly in `/src/content/` (`/bangla/`, `/english/`). Never hardcode passage strings inside UI components.
- **Input Engine**: Supports **Bijoy (Unicode-mapped)**, **Avro Phonetic**, and **National (Unicode Fixed)** layout adapters. All layout engines output standard Bangla Unicode codepoints.
- **Storage Adapter Pattern**: User progress and settings use a decoupled `storageAdapter` interface (`localStorage` currently, designed for easy REST/GraphQL API migration).

## 2. Coding & TypeScript Standards
- **Strict Typing**: All JSON content, keymaps, test results, and user profiles must have strict TypeScript interfaces in `/src/types/`.
- **Component Design**: Keep UI components modular, accessible, and responsive across screens.
- **State Management**: Use lightweight state management (Zustand / React Context + `useReducer`).
- **Font Rendering**: Always verify Bangla text rendering with self-hosted Noto Sans Bengali / Hind Siliguri font families.

## 3. Deployment & Build Standards
- Keep project build-ready for **Vercel** (`npm run build` executing `tsc && vite build`).
- Ensure no TypeScript compilation (`tsc`) errors or unresolved module imports before committing code.
- Ignore build artifacts (`dist/`), temporary cache (`.vite/`), and local configuration files (`.env.local`) via `.gitignore`.
