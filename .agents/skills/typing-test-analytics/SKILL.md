---
name: typing-test-analytics
description: Formulas, performance metrics, accuracy scoring, WPM/CPM calculations, and localStorage data synchronization rules for typing tests.
---

# Typing Test Analytics Skill

## Overview
This skill defines the mathematical formulas, metrics standards, mistake classification, and data persistence interfaces for evaluating Bangla and English typing tests.

## Metrics & Formulas

### 1. Words Per Minute (WPM)
- **Standard Word Definition**: 1 Word = 5 keystrokes (including spaces and punctuation).
- **Gross WPM**:
  $$\text{Gross WPM} = \frac{\text{Total Typed Characters} / 5}{\text{Time Elapsed in Minutes}}$$
- **Net WPM**:
  $$\text{Net WPM} = \max\left(0, \frac{(\text{Total Typed Characters} / 5) - \text{Uncorrected Errors}}{\text{Time Elapsed in Minutes}}\right)$$

### 2. Characters Per Minute (CPM)
$$\text{CPM} = \frac{\text{Total Typed Characters}}{\text{Time Elapsed in Minutes}}$$

### 3. Accuracy Percentage
$$\text{Accuracy (\%)} = \left(\frac{\text{Correct Characters Typed}}{\text{Total Characters Typed}}\right) \times 100$$

## Error Categorization
- **Insertion**: Extra character typed that was not present in target text.
- **Deletion / Omission**: Character skipped by candidate.
- **Substitution**: Incorrect character typed in place of target character.

## Data Persistence Adapter
Candidate test results and practice stats are saved to `localStorage` via a defined adapter interface:

```typescript
export interface TestResult {
  id: string;
  timestamp: number;
  language: 'bangla' | 'english';
  mode: 'tutorial' | 'practice' | 'exam';
  durationSeconds: number;
  grossWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  totalErrors: number;
  layoutUsed?: string;
}
```
