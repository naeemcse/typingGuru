# Bangla + English Typing Test Platform — Project Plan

## 1. Project Overview

A React-based typing practice and assessment platform for job candidates, covering both **Bangla** and **English** typing. It combines:

- **Character/word tutorials** (like typing tutor sites — A, AA, AAA... progression)
- **Practice tasks** (untimed/timed drills, mistake-focused)
- **Exam tasks** (timed, scored, simulates real recruitment typing tests)
- **Smart analytics** (per-character accuracy, weak keys, speed trends)

Content (characters, words, sentences, paragraphs) is stored in **separate JSON files**, decoupled from app logic, so a backend/CMS can replace them later without touching the UI.

Progress is tracked in **browser localStorage** for now, structured so it maps cleanly onto a future backend (user accounts, cross-device sync, leaderboard, recruiter dashboards).

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + Vite | Fast dev/build, no need for Next.js SSR since content is client-driven |
| Language | TypeScript | Typed JSON schemas catch content errors early; safer as the dataset grows |
| Styling | Tailwind CSS | Fast iteration, easy theming (light/dark/custom) |
| State | Zustand (or Context + useReducer) | Lightweight, no Redux boilerplate needed for this scope |
| Routing | React Router | Multi-module navigation (tutorial/practice/exam/results/profile) |
| Storage | localStorage now → REST/GraphQL API later | Wrap all storage calls in a `storageAdapter` interface so swapping to backend is a one-file change |
| Charts | Recharts | Speed-over-time graphs, error heatmaps in result popup |
| Sound | Howler.js (or native Audio API) | Keystroke sound, error beep, completion chime |
| Fonts | Bangla: Noto Sans Bengali / Hind Siliguri (self-hosted, not CDN-dependent) | Reliable Bangla glyph rendering across OS/browsers |
| i18n | react-i18next | UI itself should support Bangla/English toggle, not just content |
| Input layer | Custom keymap engine | Translates raw keystrokes to Bangla Unicode text based on active layout (Avro Phonetic / Bijoy / National Unicode-fixed) |

---

## 3. Bangla Input Layout Support

Three layouts, switchable via a **Settings > Input Method** toggle, all producing standard Bangla Unicode text so downstream diffing/scoring logic never needs to know which layout was used:

| Layout | Description | Notes |
|---|---|---|
| **Avro Phonetic** | Type Bangla by sound using Roman keys (`amar` → `আমার`) | Most common for casual/home users; needs a phonetic transliteration engine, not a 1:1 keymap |
| **Bijoy (Unicode-mapped)** | Bijoy's classic physical key layout, but outputting Unicode codepoints instead of legacy ANSI/SutonnyMJ glyphs | This is what most job candidates are actually trained on — treat as the primary/default layout since it's the official government standard |
| **National / Unicode Fixed Layout** | Bangladesh's standardized Unicode keyboard layout (Jatiyo layout) | Official fixed key-to-glyph mapping, distinct from Bijoy's physical layout |

**Architecture:**
- Each layout is a **pure input adapter**: `keyEvent → bangla unicode char(s)`, defined in its own JSON/TS keymap file (`/src/lib/keymaps/avro.ts`, `bijoy.ts`, `national.ts`).
- All three adapters implement one interface, e.g. `translateKey(event: KeyboardEvent, buffer: string): string`. Avro's is stateful/rule-based (phonetic conversion, e.g. matching `kh`, `rri`, vowel-modifiers); Bijoy and National are direct key→glyph maps (mostly stateless, aside from reph/conjunct ordering).
- The typing engine and scoring logic only ever see the resulting Unicode string — layout choice is invisible past the input layer.
- **Tutorial module must be layout-aware**: the character/key lessons and on-screen keyboard need to switch their key associations based on the selected layout, since "which physical key produces অ" differs completely between Avro and Bijoy.
- Recommend verifying exact Bijoy and National keymap tables against the official government/BSTI specification before hardcoding, since public JS implementations vary slightly in edge cases (reph, hasanta, ya-phala ordering).
- Default the app to **Bijoy**, since it's the official standard candidates are tested on, with Avro offered as the friendlier on-ramp for beginners.

---

## 4. Content Architecture (JSON-Driven)

Keep **content** (what to type) fully separate from **app code**. Suggested folder:

```
/src/content/
  /bangla/
    characters.json
    character-groups.json      // matra-based, juktakkhor (conjuncts), etc.
    words-basic.json
    words-common.json          // frequency-analyzed from real exam data
    sentences.json
    paragraphs.json
    exam-sets.json             // curated sets mimicking real test patterns
  /english/
    characters.json
    words-basic.json
    words-common.json
    sentences.json
    paragraphs.json
    exam-sets.json
  /shared/
    themes.json
    settings-defaults.json
```

### Example schema — `characters.json`
```json
{
  "language": "bn",
  "level": "beginner",
  "groups": [
    {
      "id": "vowels-1",
      "title": "স্বরবর্ণ - প্রথম ধাপ",
      "items": [
        { "char": "অ", "romanized": "o", "keyMap": "\\", "drillPattern": ["অ", "অঅ", "অঅঅ"] },
        { "char": "আ", "romanized": "a", "keyMap": "shift+\\", "drillPattern": ["আ", "আআ"] }
      ]
    }
  ]
}
```

### Example schema — `words-common.json`
```json
{
  "language": "bn",
  "source": "exam-frequency-analysis-2025",
  "words": [
    { "text": "প্রার্থী", "difficulty": "medium", "tags": ["job-form", "common"] },
    { "text": "আবেদন", "difficulty": "easy", "tags": ["job-form", "common"] }
  ]
}
```

### Example schema — `exam-sets.json`
```json
{
  "id": "exam-set-bn-01",
  "title": "সরকারি চাকরির আবেদন অনুশীলন",
  "type": "paragraph",
  "durationSec": 300,
  "content": "প্রকৃত পরীক্ষার প্যাটার্ন অনুসরণে তৈরি অনুচ্ছেদ...",
  "passCriteria": { "minWpm": 25, "maxErrorRate": 0.05 }
}
```

Each JSON is versioned (`"version": 1`) so future backend migration can detect schema drift.

---

## 5. Module Breakdown

### A. Tutorial Module (Learn)
- Layout-aware key introduction (Bangla: Unicode/Avro-style layout reference; English: QWERTY)
- Progressive drilling: single char → repeated char (`অ`, `অঅ`, `অঅঅ`) → char pairs → common conjuncts (juktakkhor) → short words
- On-screen keyboard highlight showing finger placement
- "Unlock next lesson" gating based on accuracy threshold (e.g., 90%+ to proceed)

### B. Practice Module
- Free-form practice by category: characters / words / sentences / paragraphs
- **Weakness-targeted practice**: auto-generates a session using characters/words the candidate historically mistypes most (pulled from localStorage history)
- Adjustable difficulty and content length
- No hard pass/fail — exploratory

### C. Exam Module
- Timed, scored, mimics real recruitment test conditions
- Fixed content sets (`exam-sets.json`) so all candidates get standardized material
- Optional "strict mode": no backspace, no pause, full-screen lock
- Produces a shareable/exportable result certificate (PDF later)

### D. Results & Analytics (Smart Popup)
Shown immediately after any session ends:
- **Speed**: gross WPM, net WPM (CPM for Bangla since word-boundary WPM is less meaningful for Bangla — offer both)
- **Accuracy %**, total errors, error rate
- **Per-character heatmap**: which characters/conjuncts had highest error rate
- **Weak vs strong characters** — ranked list
- **Missed words** — words typed incorrectly or skipped
- **Time-series graph**: speed fluctuation across the session (via Recharts)
- **Comparison to last session** and **personal best**
- Actionable suggestion: "Practice these 5 characters" → deep-links into a generated Practice session

### E. Settings (per-session, persisted as user preference)
- Warning granularity: per-character / per-word / off
- Sound: keystroke click, error beep, completion chime — each toggleable, volume control
- Theme: light / dark / high-contrast / custom accent color
- Allow backspace: on/off
- Timer: countdown / count-up / untimed
- Font size / keyboard layout reference visibility
- Language: Bangla / English / mixed
- **Bangla input method**: Avro Phonetic / Bijoy / National Unicode — switchable per session, defaults to Bijoy

### F. Profile / History (local-first, backend-ready)
- Session history list (date, module, wpm, accuracy)
- Progress trend charts over time
- Character mastery map (visual grid, color-coded by proficiency)
- Export history as JSON/CSV (useful before backend exists, and as a manual backup)

---

## 6. Local Storage Design (Backend-Ready Shape)

Store everything under a namespaced key and a schema that mirrors a future DB table, so migration is a straight upload:

```
localStorage key: "typingapp:v1:sessions"
```

```json
{
  "userId": "local-anonymous",          // replaced by real userId post-auth
  "sessions": [
    {
      "sessionId": "uuid-v4",
      "moduleType": "exam",             // tutorial | practice | exam
      "language": "bn",
      "contentRefId": "exam-set-bn-01",
      "startedAt": "2026-08-06T10:00:00Z",
      "durationSec": 300,
      "settingsSnapshot": { "backspaceAllowed": false, "sound": true },
      "metrics": {
        "grossWpm": 32,
        "netWpm": 28,
        "accuracy": 0.94,
        "totalChars": 900,
        "errorCount": 54,
        "charErrors": { "ক্ষ": 6, "য়": 4 },
        "missedWords": ["প্রার্থী", "আবেদন"]
      }
    }
  ]
}
```

- Wrap all reads/writes in a `storageAdapter.ts` with methods like `saveSession()`, `getHistory()`, `getWeakCharacters()`. Swapping localStorage for API calls later means changing only this file, not any components.
- Add a lightweight migration function that runs on load to bump schema versions as the app evolves.

---

## 7. Suggested Folder Structure

```
/src
  /content          (JSON, as above)
  /components
    /keyboard        (on-screen keyboard, finger-guide)
    /typing-engine   (core input capture, diffing, error detection)
    /result-popup
    /settings-panel
    /charts
  /modules
    /tutorial
    /practice
    /exam
    /profile
  /hooks
    useTypingSession.ts
    useSettings.ts
    useSessionHistory.ts
  /lib
    storageAdapter.ts
    metricsCalculator.ts   (wpm/cpm/accuracy/error-heatmap logic)
    weaknessEngine.ts      (analyzes history → generates targeted practice sets)
  /i18n
  /themes
```

---

## 8. Smart/Differentiating Features (beyond a basic typing test)

- **Weakness Engine**: analyzes historical `charErrors` across sessions to auto-build a "focus practice" set — this is the core differentiator vs. generic typing sites.
- **Bangla-specific handling**: conjunct (যুক্তাক্ষর) detection as a unit, not just character-by-character diffing — a candidate who mistypes a conjunct shouldn't be scored as multiple unrelated character errors.
- **Layout-aware input**: support both Avro phonetic and standard Bangla Unicode layout, since real candidates use different input methods.
- **Adaptive difficulty**: session content difficulty nudges up/down based on rolling accuracy.
- **Exam-realism mode**: strict mode replicating real government exam typing test conditions (no backspace, fixed duration, no pause).
- **Exportable result certificate**: shareable proof of typing speed/accuracy for job applications.
- **Offline-first**: works fully without backend today via localStorage; service worker/PWA later for true offline use.

---

## 9. Phased Roadmap

**Phase 1 — Core Engine (MVP)**
- Typing engine (input capture, real-time diffing, error detection)
- Character + word tutorial module (English first, since content is simpler to validate the engine)
- Basic settings panel
- Result popup with core metrics
- localStorage session save

**Phase 2 — Bangla Content + Conjunct Handling**
- Bangla character/word/sentence JSON sets
- Conjunct-aware diffing logic
- Bangla font/input layout support

**Phase 3 — Exam Module + Weakness Engine**
- Exam sets with pass criteria
- Weakness Engine generating targeted practice
- History/profile module with trend charts

**Phase 4 — Polish**
- Themes, sound design, keyboard visual guide
- Export (PDF certificate / CSV history)
- PWA/offline support

**Phase 5 — Backend Integration**
- Auth (candidate accounts)
- API replacing `storageAdapter.ts` internals only
- Recruiter-facing dashboard (aggregate candidate results) — separate app/module
- Content managed via CMS instead of static JSON

---

## 10. Open Decisions to Confirm

- WPM definition for Bangla (word-based is ambiguous for Bangla; CPM may be the more honest metric to lead with)
- Whether "exam mode" results should be tamper-evident (e.g., hashed/timestamped) for real recruitment use, anticipating backend integration
- Exact Bijoy and National Unicode keymap tables — source and verify against the official specification before hardcoding
