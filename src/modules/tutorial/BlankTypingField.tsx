import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Keyboard, Clock, Type } from 'lucide-react';
import { UserSettings, TimerDuration } from '../../types';
import { translateKey } from '../../lib/keymaps/keymapAdapter';
import { SoundEngine } from '../../lib/audio/soundEngine';

interface BlankTypingFieldProps {
  settings: UserSettings;
  durationSec: TimerDuration;
}

export const BlankTypingField: React.FC<BlankTypingFieldProps> = ({
  settings,
  durationSec,
}) => {
  const [typedText, setTypedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [avroBuffer, setAvroBuffer] = useState('');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<any>(null);

  const charCount = typedText.length;
  const wordCount = typedText.trim() ? typedText.trim().split(/\s+/).length : 0;
  const minutesElapsed = Math.max(elapsedSec / 60, 1 / 60);
  const liveWpm = Math.round((charCount / 5) / minutesElapsed);
  const liveCpm = Math.round(charCount / minutesElapsed);
  const remainingSec = Math.max(0, durationSec - elapsedSec);

  const formattedTime = `${Math.floor(remainingSec / 60)}:${(remainingSec % 60).toString().padStart(2, '0')}`;
  const formattedElapsed = `${Math.floor(elapsedSec / 60)}:${(elapsedSec % 60).toString().padStart(2, '0')}`;

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Timer
  useEffect(() => {
    if (isStarted) {
      timerRef.current = setInterval(() => {
        setElapsedSec((prev) => {
          const next = prev + 1;
          if (next >= durationSec) {
            clearInterval(timerRef.current);
            SoundEngine.playCompletionChime(settings.soundEnabled, settings.soundVolume);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, durationSec, settings.soundEnabled, settings.soundVolume]);

  const isFinished = elapsedSec >= durationSec;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isFinished) {
      e.preventDefault();
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      if (typedText.length > 0) {
        setTypedText((prev) => prev.slice(0, -1));
        SoundEngine.playKeyClick(settings.soundEnabled, settings.soundVolume);
      }
      return;
    }

    // Handle Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isStarted) setIsStarted(true);
      setTypedText((prev) => prev + '\n');
      SoundEngine.playKeyClick(settings.soundEnabled, settings.soundVolume);
      return;
    }

    // Ignore modifier keys
    if (e.key.length > 1 && e.key !== 'Space') {
      return;
    }

    e.preventDefault();

    if (!isStarted) {
      setIsStarted(true);
    }

    const keyInput = e.key === 'Space' ? ' ' : e.key;
    const translatedChar = translateKey(
      keyInput,
      settings.language,
      settings.banglaLayout,
      avroBuffer
    );

    if (settings.language === 'bn' && settings.banglaLayout === 'avro') {
      setAvroBuffer((prev) => prev + keyInput);
    }

    setTypedText((prev) => prev + translatedChar);
    SoundEngine.playKeyClick(settings.soundEnabled, settings.soundVolume);
  };

  const handleReset = () => {
    setTypedText('');
    setIsStarted(false);
    setElapsedSec(0);
    setAvroBuffer('');
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Stats Bar */}
      <div className="glass-panel rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold text-slate-300 font-bangla">
            {settings.language === 'bn' ? 'ফ্রি টাইপিং' : 'Free Typing'}
          </span>
          {isFinished && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              সম্পন্ন
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase font-sans font-bold tracking-wider">WPM</span>
            <span className="text-base font-extrabold text-indigo-400">{isStarted ? liveWpm : 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase font-sans font-bold tracking-wider">CPM</span>
            <span className="text-base font-extrabold text-emerald-400">{isStarted ? liveCpm : 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase font-sans font-bold tracking-wider">অক্ষর</span>
            <span className="text-base font-extrabold text-amber-400">{charCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 uppercase font-sans font-bold tracking-wider">শব্দ</span>
            <span className="text-base font-extrabold text-violet-400">{wordCount}</span>
          </div>

          <div className="flex flex-col items-center px-2 py-0.5 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase font-sans font-bold tracking-wider">
              <Clock className="w-3 h-3 inline mr-0.5" />সময়
            </span>
            <span className="text-base font-extrabold text-white">{formattedTime}</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="রিসেট"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Typing Area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`
          w-full min-h-[200px] glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl cursor-text transition-all
          ${isFinished ? 'opacity-60' : 'hover:border-indigo-500/30'}
        `}
      >
        {!isStarted && typedText.length === 0 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg w-fit mb-4">
            <Type className="w-4 h-4" />
            <span className="font-bangla">
              {settings.language === 'bn'
                ? 'স্বাধীনভাবে টাইপ করুন — টাইমার স্বয়ংক্রিয়ভাবে শুরু হবে।'
                : 'Type freely — timer starts automatically on first keypress.'}
            </span>
          </div>
        )}

        <textarea
          ref={inputRef}
          value={typedText}
          onKeyDown={handleKeyDown}
          onChange={() => {}} // controlled component
          readOnly={isFinished}
          className="w-full min-h-[160px] bg-transparent text-xl font-bangla text-slate-200 leading-relaxed resize-none focus:outline-none placeholder-slate-600"
          placeholder={settings.language === 'bn' ? 'এখানে টাইপ করুন...' : 'Start typing here...'}
        />
      </div>
    </div>
  );
};
