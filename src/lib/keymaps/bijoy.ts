// Bijoy Layout (Unicode Mapped) implementation for standard QWERTY physical key inputs

export const BIJOY_KEYMAP: Record<string, string> = {
  // Lowercase physical keys
  'a': 'ৃ',
  'b': 'ন',
  'c': 'এ',
  'd': 'ি',
  'e': 'ড',
  'f': 'আ',
  'g': '্', // Hasanta / Virama for conjuncts
  'h': 'ব',
  'i': 'হ',
  'j': 'ক',
  'k': 'ত',
  'l': 'দ',
  'm': 'শ',
  'n': 'স',
  'o': 'গ',
  'p': 'ড়',
  'q': 'ং',
  'r': 'প',
  's': 'ু',
  't': 'ট',
  'u': 'জ',
  'v': 'র',
  'w': 'য',
  'x': 'ও',
  'y': 'চ',
  'z': '্র',
  '[': 'ে',
  ']': 'ো',
  '\\': 'ৎ',
  '`': '`',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
  '0': '০',

  // Uppercase / Shift modified physical keys
  'A': 'র্',
  'B': 'ণ',
  'C': 'ঐ',
  'D': 'ী',
  'E': 'ঢ',
  'F': 'অ',
  'G': '।', // Dari
  'H': 'ভ',
  'I': 'ঞ',
  'J': 'খ',
  'K': 'থ',
  'L': 'ধ',
  'M': 'ষ',
  'N': 'স',
  'O': 'ঘ',
  'P': 'ঢ়',
  'Q': 'ঃ',
  'R': 'ফ',
  'S': 'ূ',
  'T': 'ঠ',
  'U': 'ঝ',
  'V': 'ল',
  'W': 'য়',
  'X': 'ঔ',
  'Y': 'ছ',
  'Z': '্য',
  '{': 'ৈ',
  '}': 'ৌ',
  '|': 'ঁ',
  '~': '~',
  '!': '!',
  '@': '@',
  '#': '#',
  '$': '৳', // Taka symbol
  '%': '%',
  '^': '^',
  '&': '&',
  '*': '*',
  '(': '(',
  ')': ')',
};

/**
 * Translates a key event into Bijoy Unicode character output.
 */
export function translateBijoyKey(key: string): string {
  if (BIJOY_KEYMAP[key] !== undefined) {
    return BIJOY_KEYMAP[key];
  }
  return key;
}
