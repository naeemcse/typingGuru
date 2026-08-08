---
name: bangla-typing-engine
description: Implementation guidelines for Bangla keyboard layout mapping (Bijoy, Avro, National), Unicode normalization, and character diffing logic.
---

# Bangla Typing Engine Skill

## Overview
This skill provides technical specifications for handling Bangla text input, physical keyboard event mapping, Unicode codepoint normalization, and character-by-character accuracy calculations.

## Keyboard Layout Mappings
The platform supports three distinct Bangla layout adapters:

1. **Bijoy (Unicode-mapped)**:
   - Maps physical key combinations (e.g. `g` + `k` = `কা`) to standard Bangla Unicode codepoints.
   - Physical layout follows traditional Bijoy keyboard markings, but standardizes codepoint output (avoiding legacy SutonnyMJ ANSI fonts).

2. **Avro Phonetic**:
   - Stateful phonetic engine converting Roman input strings (`k`, `h`, `a`) into Bangla Unicode (`খা`).
   - Handles vowel modifiers, consonant clusters, and `rri`/`ref`/`hasanta` ordering rules.

3. **National / Jatiyo Layout**:
   - Fixed Unicode mapping according to Bangladesh National Standard (BSTI).

## Unicode Handling & Normalization
- **Normalization**: Always apply `String.prototype.normalize('NFC')` to both target passage text and user typed buffer to ensure accurate glyph comparison.
- **Grapheme Clusters**: Bangla conjuncts (যুক্তাক্ষর) and matras (কার) consist of multiple Unicode codepoints (e.g., `ক` + `্` + `ষ` = `ক্ষ`). Character comparison must handle grapheme cluster boundaries.

## Keymap Adapter Interface
All layout engines must adhere to a uniform TypeScript interface:

```typescript
export interface KeymapAdapter {
  id: 'bijoy' | 'avro' | 'national';
  name: string;
  translateKey(event: KeyboardEvent, currentBuffer: string): {
    newBuffer: string;
    insertedChar?: string;
  };
}
```
