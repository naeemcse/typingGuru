import { SessionMetrics, MetricSnapshot } from '../../types';
import { segmentText, segmentWords } from './graphemeSegmenter';

export function calculateMetrics(
  targetText: string,
  typedText: string,
  elapsedTimeSec: number,
  timelineSnapshots: MetricSnapshot[] = []
): SessionMetrics {
  const targetChars = segmentText(targetText);
  const typedChars = segmentText(typedText);
  
  let correctCharsCount = 0;
  let totalErrorsCount = 0;
  const charErrors: Record<string, number> = {};
  
  // Character-by-character comparison
  const limit = Math.min(targetChars.length, typedChars.length);
  for (let i = 0; i < limit; i++) {
    const target = targetChars[i];
    const typed = typedChars[i];

    if (target === typed) {
      correctCharsCount++;
    } else {
      totalErrorsCount++;
      charErrors[target] = (charErrors[target] || 0) + 1;
    }
  }

  // Count un-typed remaining target chars as pending, extra typed chars as errors
  if (typedChars.length > targetChars.length) {
    totalErrorsCount += typedChars.length - targetChars.length;
  }

  const minutes = Math.max(elapsedTimeSec / 60, 0.01);
  const totalTyped = typedChars.length;

  // Gross WPM (Standard: 5 characters per word)
  const grossWpm = Math.round((totalTyped / 5) / minutes);
  
  // Net WPM (Gross WPM minus errors per minute)
  const uncorrectedErrors = Math.max(0, totalTyped - correctCharsCount);
  const netWpm = Math.max(0, Math.round(grossWpm - (uncorrectedErrors / minutes)));

  // CPM (Characters Per Minute - precise for Bangla graphemes)
  const cpm = Math.round(totalTyped / minutes);

  // Accuracy Percentage (0 to 1)
  const accuracy = totalTyped > 0 ? Math.max(0, Math.min(1, correctCharsCount / totalTyped)) : 1.0;

  // Missed words identification
  const targetWords = segmentWords(targetText);
  const typedWords = segmentWords(typedText);
  const missedWords: string[] = [];

  for (let i = 0; i < typedWords.length && i < targetWords.length; i++) {
    if (targetWords[i] !== typedWords[i]) {
      missedWords.push(targetWords[i]);
    }
  }

  return {
    grossWpm,
    netWpm,
    cpm,
    accuracy,
    totalChars: totalTyped,
    correctChars: correctCharsCount,
    errorCount: totalErrorsCount,
    durationSec: elapsedTimeSec,
    charErrors,
    missedWords: Array.from(new Set(missedWords)),
    timeline: timelineSnapshots,
  };
}
