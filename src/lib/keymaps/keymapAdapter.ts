import { translateBijoyKey } from './bijoy';
import { translateNationalKey } from './national';
import { transliterateAvro } from './avro';
import { BanglaLayout, Language } from '../../types';

/**
 * Translates a single physical key press into the active target language/layout unicode character.
 */
export function translateKey(
  key: string,
  language: Language,
  banglaLayout: BanglaLayout,
  buffer = ''
): string {
  // If control keys (Backspace, Enter, Tab, Escape, Shift, Alt, Meta), pass through as-is
  if (key.length > 1 && key !== 'Space') {
    return key;
  }

  if (language === 'en') {
    return key;
  }

  // Bangla input translation
  switch (banglaLayout) {
    case 'bijoy':
      return translateBijoyKey(key);
    case 'national':
      return translateNationalKey(key);
    case 'avro':
      return transliterateAvro(buffer + key);
    default:
      return translateBijoyKey(key);
  }
}

/**
 * Returns physical key label and Bangla unicode char corresponding to physical key for active layout.
 */
export function getPhysicalKeyMapping(
  physicalKey: string,
  isShift: boolean,
  banglaLayout: BanglaLayout
): string {
  const charKey = isShift ? physicalKey.toUpperCase() : physicalKey.toLowerCase();
  
  if (banglaLayout === 'bijoy') {
    return translateBijoyKey(charKey);
  } else if (banglaLayout === 'national') {
    return translateNationalKey(charKey);
  } else {
    return translateBijoyKey(charKey); // Default fallthrough reference
  }
}
