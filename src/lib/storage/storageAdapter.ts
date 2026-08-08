import { TypingSession, UserSettings } from '../../types';

const STORAGE_KEY_SESSIONS = 'typingapp:v1:sessions';
const STORAGE_KEY_SETTINGS = 'typingapp:v1:settings';
const STORAGE_KEY_CANDIDATE_NAME = 'typingapp:v1:candidatename';

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'bn',
  banglaLayout: 'bijoy',
  soundEnabled: true,
  soundVolume: 0.5,
  theme: 'dark',
  backspaceAllowed: true,
  warningGranularity: 'character',
  timerMode: 'countdown',
  timerDurationSec: 300,
  fontSize: 'base',
  showVirtualKeyboard: true,
  showFingerGuide: true,
  strictMode: false,
};

export class StorageAdapter {
  static getSettings(): UserSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  }

  static getHistory(): TypingSession[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.sessions) ? parsed.sessions : [];
    } catch {
      return [];
    }
  }

  static saveSession(session: TypingSession): void {
    try {
      const history = this.getHistory();
      history.unshift(session); // Add newest first
      
      // Limit local storage to last 100 sessions
      const trimmed = history.slice(0, 100);
      localStorage.setItem(
        STORAGE_KEY_SESSIONS,
        JSON.stringify({ userId: session.userId || 'local-anonymous', sessions: trimmed })
      );
    } catch (e) {
      console.error('Failed to save session history to localStorage:', e);
    }
  }

  static getWeakCharacters(limit = 10): Array<{ char: string; errorCount: number }> {
    const history = this.getHistory();
    const aggregate: Record<string, number> = {};

    history.forEach((sess) => {
      if (sess.metrics?.charErrors) {
        Object.entries(sess.metrics.charErrors).forEach(([char, count]) => {
          aggregate[char] = (aggregate[char] || 0) + count;
        });
      }
    });

    return Object.entries(aggregate)
      .map(([char, errorCount]) => ({ char, errorCount }))
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, limit);
  }

  static getCandidateName(): string {
    try {
      return localStorage.getItem(STORAGE_KEY_CANDIDATE_NAME) || '';
    } catch {
      return '';
    }
  }

  static saveCandidateName(name: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_CANDIDATE_NAME, name);
    } catch (e) {
      console.error('Failed to save candidate name to localStorage:', e);
    }
  }

  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
  }

  static exportBackup(): string {
    const history = this.getHistory();
    const settings = this.getSettings();
    return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), settings, history }, null, 2);
  }
}
