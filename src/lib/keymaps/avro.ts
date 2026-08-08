/**
 * Avro Phonetic Transliteration Engine
 * Translates phonetic English typing patterns into Bangla Unicode characters.
 */

// Phonetic pattern table sorted by pattern length descending
const PHONETIC_PATTERNS: Array<{ pattern: string; replace: string }> = [
  { pattern: 'kkh', replace: 'ক্ষ' },
  { pattern: 'kSh', replace: 'ক্ষ' },
  { pattern: 'rri', replace: 'ঋ' },
  { pattern: 'Rri', replace: 'ঋ' },
  { pattern: 'tth', replace: 'ত্থ' },
  { pattern: 'dth', replace: 'দ্থ' },
  { pattern: 'ggh', replace: 'ঘ্ঘ' },
  { pattern: 'cch', replace: 'চ্ছ' },
  { pattern: 'jJh', replace: 'ঝ্ঝ' },
  { pattern: 'ng', replace: 'ং' },
  { pattern: 'Ng', replace: 'ঙ' },
  { pattern: 'Nj', replace: 'ঞ্জ' },
  { pattern: 'NC', replace: 'ঞ্চ' },
  { pattern: 'kh', replace: 'খ' },
  { pattern: 'gh', replace: 'ঘ' },
  { pattern: 'ch', replace: 'চ' },
  { pattern: 'Ch', replace: 'ছ' },
  { pattern: 'jh', replace: 'ঝ' },
  { pattern: 'Th', replace: 'ঠ' },
  { pattern: 'Dh', replace: 'ঢ' },
  { pattern: 'th', replace: 'থ' },
  { pattern: 'dh', replace: 'ধ' },
  { pattern: 'ph', replace: 'ফ' },
  { pattern: 'bh', replace: 'ভ' },
  { pattern: 'sh', replace: 'শ' },
  { pattern: 'Sh', replace: 'ষ' },
  { pattern: 'Rh', replace: 'ঢ়' },
  { pattern: 'oi', replace: 'ঐ' },
  { pattern: 'ou', replace: 'ঔ' },
  { pattern: 'ee', replace: 'ঈ' },
  { pattern: 'oo', replace: 'ঊ' },

  // Single characters
  { pattern: 'k', replace: 'ক' },
  { pattern: 'g', replace: 'গ' },
  { pattern: 'j', replace: 'জ' },
  { pattern: 'T', replace: 'ট' },
  { pattern: 'D', replace: 'ড' },
  { pattern: 'N', replace: 'ণ' },
  { pattern: 't', replace: 'ত' },
  { pattern: 'd', replace: 'দ' },
  { pattern: 'n', replace: 'ন' },
  { pattern: 'p', replace: 'প' },
  { pattern: 'f', replace: 'ফ' },
  { pattern: 'b', replace: 'ব' },
  { pattern: 'm', replace: 'ম' },
  { pattern: 'z', replace: 'য' },
  { pattern: 'r', replace: 'র' },
  { pattern: 'l', replace: 'ল' },
  { pattern: 's', replace: 'স' },
  { pattern: 'h', replace: 'হ' },
  { pattern: 'R', replace: 'ড়' },
  { pattern: 'y', replace: 'য়' },
  { pattern: 'w', replace: 'ওয়' },
  
  // Vowels
  { pattern: 'a', replace: 'আ' },
  { pattern: 'i', replace: 'ই' },
  { pattern: 'u', replace: 'উ' },
  { pattern: 'e', replace: 'এ' },
  { pattern: 'o', replace: 'অ' },

  // Numbers
  { pattern: '0', replace: '০' },
  { pattern: '1', replace: '১' },
  { pattern: '2', replace: '২' },
  { pattern: '3', replace: '৩' },
  { pattern: '4', replace: '৪' },
  { pattern: '5', replace: '৫' },
  { pattern: '6', replace: '৬' },
  { pattern: '7', replace: '৭' },
  { pattern: '8', replace: '৮' },
  { pattern: '9', replace: '৯' },
];

/**
 * Converts a phonetic Roman string into Bangla Unicode.
 */
export function transliterateAvro(input: string): string {
  let output = '';
  let i = 0;

  while (i < input.length) {
    let matched = false;

    // Check longer pattern matches first
    for (const { pattern, replace } of PHONETIC_PATTERNS) {
      if (input.startsWith(pattern, i)) {
        output += replace;
        i += pattern.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      output += input[i];
      i++;
    }
  }

  return output;
}
