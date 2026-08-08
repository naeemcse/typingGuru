export type Language = 'bn' | 'en';

export type BanglaLayout = 'bijoy' | 'national' | 'avro';
export type EnglishLayout = 'qwerty';
export type KeyboardLayout = BanglaLayout | EnglishLayout;

export type AppMode = 'tutorial' | 'practice' | 'exam' | 'analytics';

export type ContentCategory = 'characters' | 'words' | 'sentences' | 'paragraphs' | 'weakness';

export interface UserSettings {
  language: Language;
  banglaLayout: BanglaLayout;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  theme: 'dark' | 'light' | 'cyberpunk';
  backspaceAllowed: boolean;
  warningGranularity: 'character' | 'word' | 'off';
  timerMode: 'countdown' | 'countup' | 'untimed';
  timerDurationSec: number;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  showVirtualKeyboard: boolean;
  showFingerGuide: boolean;
  strictMode: boolean; // For recruitment exam
}

export interface MetricSnapshot {
  timestampSec: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
}

export interface SessionMetrics {
  grossWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number; // 0 to 1
  totalChars: number;
  correctChars: number;
  errorCount: number;
  durationSec: number;
  charErrors: Record<string, number>;
  missedWords: string[];
  timeline: MetricSnapshot[];
  passed?: boolean;
}

export interface TypingSession {
  sessionId: string;
  userId: string;
  moduleType: AppMode;
  language: Language;
  layoutUsed: KeyboardLayout;
  contentTitle: string;
  contentRefId: string;
  startedAt: string;
  durationSec: number;
  settingsSnapshot: Partial<UserSettings>;
  metrics: SessionMetrics;
}

export interface CharacterItem {
  char: string;
  romanized?: string;
  keyMapBijoy?: string;
  drillPattern: string[];
}

export interface CharacterGroup {
  id: string;
  title: string;
  titleEn: string;
  guide?: string;
  guideEn?: string;
  items: CharacterItem[];
  practiceSentences?: string[];
}

export type TutorialSubView = 'character' | 'mixed' | 'sentences' | 'custom' | 'blank';

export type TimerDuration = 30 | 60 | 120 | 300;

export interface WordItem {
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface ParagraphItem {
  id: string;
  title: string;
  category: string;
  text: string;
}

export interface ExamSet {
  id: string;
  title: string;
  type: 'paragraph' | 'words';
  durationSec: number;
  content: string;
  passCriteria: {
    minWpm: number;
    minCpm: number;
    maxErrorRate: number;
  };
}
