import React, { useState, useEffect } from 'react';
import { UserSettings } from '../../types';
import { getPhysicalKeyMapping } from '../../lib/keymaps/keymapAdapter';

interface VirtualKeyboardProps {
  activeTargetKey?: string;
  settings: UserSettings;
}

interface KeyConfig {
  code: string;
  key: string;
  shiftKey?: string;
  width?: string;
  finger: 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';
}

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Row 1: Numbers & Symbols
  [
    { code: 'Backquote', key: '`', shiftKey: '~', finger: 'left-pinky' },
    { code: 'Digit1', key: '1', shiftKey: '!', finger: 'left-pinky' },
    { code: 'Digit2', key: '2', shiftKey: '@', finger: 'left-ring' },
    { code: 'Digit3', key: '3', shiftKey: '#', finger: 'left-middle' },
    { code: 'Digit4', key: '4', shiftKey: '$', finger: 'left-index' },
    { code: 'Digit5', key: '5', shiftKey: '%', finger: 'left-index' },
    { code: 'Digit6', key: '6', shiftKey: '^', finger: 'right-index' },
    { code: 'Digit7', key: '7', shiftKey: '&', finger: 'right-index' },
    { code: 'Digit8', key: '8', shiftKey: '*', finger: 'right-middle' },
    { code: 'Digit9', key: '9', shiftKey: '(', finger: 'right-ring' },
    { code: 'Digit0', key: '0', shiftKey: ')', finger: 'right-pinky' },
    { code: 'Minus', key: '-', shiftKey: '_', finger: 'right-pinky' },
    { code: 'Equal', key: '=', shiftKey: '+', finger: 'right-pinky' },
    { code: 'Backspace', key: 'Backspace', width: 'w-16 sm:w-20', finger: 'right-pinky' },
  ],
  // Row 2: Top QWERTY
  [
    { code: 'Tab', key: 'Tab', width: 'w-12 sm:w-16', finger: 'left-pinky' },
    { code: 'KeyQ', key: 'q', shiftKey: 'Q', finger: 'left-pinky' },
    { code: 'KeyW', key: 'w', shiftKey: 'W', finger: 'left-ring' },
    { code: 'KeyE', key: 'e', shiftKey: 'E', finger: 'left-middle' },
    { code: 'KeyR', key: 'r', shiftKey: 'R', finger: 'left-index' },
    { code: 'KeyT', key: 't', shiftKey: 'T', finger: 'left-index' },
    { code: 'KeyY', key: 'y', shiftKey: 'Y', finger: 'right-index' },
    { code: 'KeyU', key: 'u', shiftKey: 'U', finger: 'right-index' },
    { code: 'KeyI', key: 'i', shiftKey: 'I', finger: 'right-middle' },
    { code: 'KeyO', key: 'o', shiftKey: 'O', finger: 'right-ring' },
    { code: 'KeyP', key: 'p', shiftKey: 'P', finger: 'right-pinky' },
    { code: 'BracketLeft', key: '[', shiftKey: '{', finger: 'right-pinky' },
    { code: 'BracketRight', key: ']', shiftKey: '}', finger: 'right-pinky' },
    { code: 'Backslash', key: '\\', shiftKey: '|', finger: 'right-pinky' },
  ],
  // Row 3: Home Row
  [
    { code: 'CapsLock', key: 'Caps', width: 'w-14 sm:w-20', finger: 'left-pinky' },
    { code: 'KeyA', key: 'a', shiftKey: 'A', finger: 'left-pinky' },
    { code: 'KeyS', key: 's', shiftKey: 'S', finger: 'left-ring' },
    { code: 'KeyD', key: 'd', shiftKey: 'D', finger: 'left-middle' },
    { code: 'KeyF', key: 'f', shiftKey: 'F', finger: 'left-index' },
    { code: 'KeyG', key: 'g', shiftKey: 'G', finger: 'left-index' },
    { code: 'KeyH', key: 'h', shiftKey: 'H', finger: 'right-index' },
    { code: 'KeyJ', key: 'j', shiftKey: 'J', finger: 'right-index' },
    { code: 'KeyK', key: 'k', shiftKey: 'K', finger: 'right-middle' },
    { code: 'KeyL', key: 'l', shiftKey: 'L', finger: 'right-ring' },
    { code: 'Semicolon', key: ';', shiftKey: ':', finger: 'right-pinky' },
    { code: 'Quote', key: "'", shiftKey: '"', finger: 'right-pinky' },
    { code: 'Enter', key: 'Enter', width: 'w-16 sm:w-24', finger: 'right-pinky' },
  ],
  // Row 4: Bottom Row
  [
    { code: 'ShiftLeft', key: 'Shift', width: 'w-20 sm:w-24', finger: 'left-pinky' },
    { code: 'KeyZ', key: 'z', shiftKey: 'Z', finger: 'left-pinky' },
    { code: 'KeyX', key: 'x', shiftKey: 'X', finger: 'left-ring' },
    { code: 'KeyC', key: 'c', shiftKey: 'C', finger: 'left-middle' },
    { code: 'KeyV', key: 'v', shiftKey: 'V', finger: 'left-index' },
    { code: 'KeyB', key: 'b', shiftKey: 'B', finger: 'left-index' },
    { code: 'KeyN', key: 'n', shiftKey: 'N', finger: 'right-index' },
    { code: 'KeyM', key: 'm', shiftKey: 'M', finger: 'right-index' },
    { code: 'Comma', key: ',', shiftKey: '<', finger: 'right-middle' },
    { code: 'Period', key: '.', shiftKey: '>', finger: 'right-ring' },
    { code: 'Slash', key: '/', shiftKey: '?', finger: 'right-pinky' },
    { code: 'ShiftRight', key: 'Shift', width: 'w-20 sm:w-24', finger: 'right-pinky' },
  ],
  // Row 5: Space Bar
  [
    { code: 'Space', key: 'Space', width: 'w-64 sm:w-80', finger: 'thumb' },
  ]
];

const FINGER_BG_CLASSES: Record<string, string> = {
  'left-pinky': 'border-pink-500/30 hover:border-pink-500/60',
  'left-ring': 'border-purple-500/30 hover:border-purple-500/60',
  'left-middle': 'border-blue-500/30 hover:border-blue-500/60',
  'left-index': 'border-emerald-500/30 hover:border-emerald-500/60',
  'thumb': 'border-amber-500/30 hover:border-amber-500/60',
  'right-index': 'border-emerald-500/30 hover:border-emerald-500/60',
  'right-middle': 'border-blue-500/30 hover:border-blue-500/60',
  'right-ring': 'border-purple-500/30 hover:border-purple-500/60',
  'right-pinky': 'border-pink-500/30 hover:border-pink-500/60',
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeTargetKey,
  settings,
}) => {
  const [pressedCode, setPressedCode] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedCode(e.code);
    };
    const handleKeyUp = () => {
      setPressedCode(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!settings.showVirtualKeyboard) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 md:p-6 border border-slate-800 shadow-2xl flex flex-col items-center gap-2">
      
      {/* Keyboard Header / Finger Guide */}
      {settings.showFingerGuide && (
        <div className="w-full flex items-center justify-between px-2 mb-2 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-pink-500/60"></span> কনিষ্ঠা (Pinky)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500/60"></span> অনামিকা (Ring)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500/60"></span> মধ্যমা (Middle)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></span> তর্জনী (Index)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></span> বৃদ্ধাঙ্গুলি (Thumb)</span>
          </div>
          <div className="uppercase tracking-wider text-[10px] text-indigo-400 font-semibold">
            {settings.language === 'bn' ? `লেআউট: ${settings.banglaLayout.toUpperCase()}` : 'QWERTY LAYOUT'}
          </div>
        </div>
      )}

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 w-full items-center overflow-x-auto py-1">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1.5 justify-center min-w-max">
            {row.map((k) => {
              const isPressed = pressedCode === k.code;
              
              // Determine Bangla glyph translation for key if language is Bangla
              const primaryBangla = settings.language === 'bn' && k.key.length === 1 
                ? getPhysicalKeyMapping(k.key, false, settings.banglaLayout) 
                : null;
              const shiftBangla = settings.language === 'bn' && k.shiftKey && k.shiftKey.length === 1
                ? getPhysicalKeyMapping(k.shiftKey, true, settings.banglaLayout)
                : null;

              // Active target key highlight match
              const isTargetKey = activeTargetKey && (
                activeTargetKey === k.key ||
                activeTargetKey === primaryBangla ||
                activeTargetKey === shiftBangla
              );

              return (
                <div
                  key={k.code}
                  className={`
                    relative h-11 sm:h-12 flex flex-col justify-between p-1 sm:p-1.5 rounded-lg border text-xs font-semibold select-none transition-all duration-75
                    ${k.width || 'w-9 sm:w-11'}
                    ${FINGER_BG_CLASSES[k.finger]}
                    ${isPressed ? 'bg-indigo-600 border-indigo-400 text-white translate-y-0.5 shadow-inner' : 'bg-slate-900/90 text-slate-300'}
                    ${isTargetKey ? 'ring-2 ring-emerald-400 bg-emerald-950/60 text-emerald-200 border-emerald-500 animate-pulse' : ''}
                  `}
                >
                  {/* Top-right Shift character */}
                  {k.shiftKey && (
                    <span className="self-end text-[9px] sm:text-[10px] text-slate-500 font-normal leading-none">
                      {shiftBangla || k.shiftKey}
                    </span>
                  )}

                  {/* Center/Bottom Primary character */}
                  <span className="self-start font-bangla text-xs sm:text-sm font-bold leading-none text-slate-100">
                    {primaryBangla || k.key}
                  </span>

                  {/* Subscript physical key reference for Bangla mode */}
                  {settings.language === 'bn' && primaryBangla && (
                    <span className="absolute bottom-0.5 right-1 text-[8px] text-slate-500 font-mono">
                      {k.key.toUpperCase()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
