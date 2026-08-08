import { StorageAdapter } from './storageAdapter';
import { Language } from '../../types';

/**
 * Weakness Engine — Analyzes candidate typing error history and dynamically
 * constructs a targeted practice drill focusing on weak characters & words.
 */
export function generateWeaknessTargetedDrill(language: Language): {
  title: string;
  text: string;
  weakKeys: string[];
} {
  const weakCharsData = StorageAdapter.getWeakCharacters(8);
  const weakKeys = weakCharsData.map((item) => item.char);

  if (weakKeys.length === 0) {
    // Default practice if user has no error history yet
    if (language === 'bn') {
      return {
        title: 'সাধারণ অনুশীলনী (মৌলিক অক্ষর)',
        text: 'ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ ড় ঢ় য়',
        weakKeys: ['ক', 'খ', 'গ'],
      };
    } else {
      return {
        title: 'Basic Key Drill',
        text: 'the quick brown fox jumps over the lazy dog asdf jkl; qwerty uiop zxcvbnm',
        weakKeys: ['e', 't', 'a'],
      };
    }
  }

  // Construct target pattern repeat sequences
  const textParts: string[] = [];
  
  // Repeat each weak key in groups of 3, pairs, and word combinations
  weakKeys.forEach((key) => {
    textParts.push(`${key}${key}`);
    textParts.push(`${key}${key}${key}`);
  });

  // Combine into a structured practice text
  const combinedText = textParts.join(' ') + ' ' + weakKeys.join('');

  return {
    title: language === 'bn' ? 'স্মার্ট দুর্বলতা-ভিত্তিক ড্রিল' : 'Targeted Weakness Drill',
    text: combinedText,
    weakKeys,
  };
}
