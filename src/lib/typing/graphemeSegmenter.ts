/**
 * Bangla & English Grapheme Cluster Segmenter
 * Accurately splits text into user-perceived characters (grapheme clusters),
 * preserving Bangla conjuncts (যুক্তাক্ষর), vowel modifiers (মাত্রা), and codepoints as single visual units.
 */

export function segmentText(text: string): string[] {
  if (!text) return [];

  // Use native Intl.Segmenter if supported by browser
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new (Intl as any).Segmenter('bn', { granularity: 'grapheme' });
    const segments = segmenter.segment(text);
    return Array.from(segments, (s: any) => s.segment);
  }

  // Fallback using Regex matching Bangla conjuncts & grapheme clusters
  // Matches base character + optional combining marks (Virama, Matras, Nukta)
  const graphemeRegex = /[\u0980-\u09FF][\u09BC\u09BE-\u09CD\u09D7]*|./g;
  return text.match(graphemeRegex) || Array.from(text);
}

/**
 * Splits text into words while keeping word boundaries intact.
 */
export function segmentWords(text: string): string[] {
  if (!text) return [];
  return text.trim().split(/\s+/);
}
