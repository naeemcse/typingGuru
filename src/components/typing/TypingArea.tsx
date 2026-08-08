import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Play, Pause, AlertCircle, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { UserSettings, SessionMetrics, MetricSnapshot } from '../../types';
import { segmentText } from '../../lib/typing/graphemeSegmenter';
import { calculateMetrics } from '../../lib/typing/metricsCalculator';
import { translateKey } from '../../lib/keymaps/keymapAdapter';
import { SoundEngine } from '../../lib/audio/soundEngine';

interface TypingAreaProps {
  targetText: string;
  contentTitle: string;
  settings: UserSettings;
  durationSec?: number;
  onSessionComplete: (metrics: SessionMetrics) => void;
  onUpdateSettings?: (newSettings: Partial<UserSettings>) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  contentTitle,
  settings,
  durationSec = 300,
  onSessionComplete,
  onUpdateSettings,
}) => {
  const [typedText, setTypedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [timelineSnapshots, setTimelineSnapshots] = useState<MetricSnapshot[]>([]);
  const [avroBuffer, setAvroBuffer] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);
  const isFinishedRef = useRef(false);

  // Refs for state values inside steady interval callback
  const typedTextRef = useRef(typedText);
  typedTextRef.current = typedText;

  const targetTextRef = useRef(targetText);
  targetTextRef.current = targetText;

  const timelineSnapshotsRef = useRef(timelineSnapshots);
  timelineSnapshotsRef.current = timelineSnapshots;

  const targetChars = segmentText(targetText);
  const typedChars = segmentText(typedText);
  const currentIndex = typedChars.length;

  // Reset session state when prompt targetText changes
  useEffect(() => {
    handleReset();
  }, [targetText]);

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const finishSession = (finalSec: number) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    
    const currentTyped = typedTextRef.current;
    const currentTarget = targetTextRef.current;
    const currentSnapshots = timelineSnapshotsRef.current;
    
    const finalMetrics = calculateMetrics(currentTarget, currentTyped, Math.max(finalSec, 1), currentSnapshots);
    SoundEngine.playCompletionChime(settings.soundEnabled, settings.soundVolume);
    onSessionComplete(finalMetrics);
  };

  // Timer Countdown / Countup (Decoupled from typedText to prevent interval reset on keypress)
  useEffect(() => {
    if (isStarted && !isPaused && !isFinishedRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedSec((prev) => {
          const next = prev + 1;

          // Record timeline snapshot every 3 seconds
          if (next % 3 === 0) {
            const currentTyped = typedTextRef.current;
            const currentTarget = targetTextRef.current;
            const currentSnapshots = timelineSnapshotsRef.current;
            const currentMetrics = calculateMetrics(currentTarget, currentTyped, next, currentSnapshots);
            setTimelineSnapshots((snaps) => [
              ...snaps,
              {
                timestampSec: next,
                wpm: currentMetrics.netWpm,
                cpm: currentMetrics.cpm,
                accuracy: Math.round(currentMetrics.accuracy * 100),
                errors: currentMetrics.errorCount,
              },
            ]);
          }

          // Complete session when elapsed time reaches or exceeds durationSec
          if (next >= durationSec) {
            finishSession(next);
          }

          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isPaused, durationSec]);

  // Complete session if user typed the entire prompt text
  useEffect(() => {
    if (isStarted && !isFinishedRef.current && typedChars.length >= targetChars.length && targetChars.length > 0) {
      finishSession(elapsedSec);
    }
  }, [typedText, isStarted, targetChars.length, typedChars.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPaused || isFinishedRef.current) return;

    // Handle Backspace lock check
    if (e.key === 'Backspace') {
      if (!settings.backspaceAllowed) {
        e.preventDefault();
        SoundEngine.playErrorBeep(settings.soundEnabled, settings.soundVolume);
        return;
      }
      if (typedText.length > 0) {
        setTypedText((prev) => prev.slice(0, -1));
        SoundEngine.playKeyClick(settings.soundEnabled, settings.soundVolume);
      }
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

    // Update Avro phonetic buffer if layout is Avro
    if (settings.language === 'bn' && settings.banglaLayout === 'avro') {
      setAvroBuffer((prev) => prev + keyInput);
    }

    const nextTyped = typedText + translatedChar;
    setTypedText(nextTyped);

    // Play sound feedback
    const expectedChar = targetChars[typedChars.length];
    if (expectedChar === translatedChar) {
      SoundEngine.playKeyClick(settings.soundEnabled, settings.soundVolume);
    } else {
      SoundEngine.playErrorBeep(settings.soundEnabled, settings.soundVolume);
    }
  };

  const handleReset = () => {
    isFinishedRef.current = false;
    setTypedText('');
    setIsStarted(false);
    setIsPaused(false);
    setElapsedSec(0);
    setTimelineSnapshots([]);
    setAvroBuffer('');
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Real-time calculation metrics
  const liveMetrics = calculateMetrics(targetText, typedText, Math.max(elapsedSec, 1));
  const remainingSec = Math.max(0, durationSec - elapsedSec);
  const formattedTime = settings.timerMode === 'countdown'
    ? `${Math.floor(remainingSec / 60)}:${(remainingSec % 60).toString().padStart(2, '0')}`
    : `${Math.floor(elapsedSec / 60)}:${(elapsedSec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* Top Stats Bar */}
      <div className="w-full glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-xl">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <h2 className="text-sm font-semibold text-slate-200 font-sans truncate max-w-xs sm:max-w-md">
            {contentTitle}
          </h2>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-sm">
          
          {/* Net WPM */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">NET WPM</span>
            <span className="text-xl font-extrabold text-indigo-400">{liveMetrics.netWpm}</span>
          </div>

          {/* CPM */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">CPM</span>
            <span className="text-xl font-extrabold text-emerald-400">{liveMetrics.cpm}</span>
          </div>

          {/* Accuracy % */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">ACCURACY</span>
            <span className={`text-xl font-extrabold ${liveMetrics.accuracy >= 0.9 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {Math.round(liveMetrics.accuracy * 100)}%
            </span>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">TIME</span>
            <span className="text-xl font-extrabold text-white">{formattedTime}</span>
          </div>
        </div>

        {/* Controls: Reset, Pause, Sound */}
        <div className="flex items-center gap-2">
          
          {/* Strict Mode Indicator */}
          {settings.strictMode && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold" title="Strict Recruitment Exam Mode">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Strict Mode</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings?.({ soundEnabled: !settings.soundEnabled })}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Toggle Sound"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Pause / Play */}
          {isStarted && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            </button>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Restart Session"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden Native Input Capture */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute pointer-events-none w-0 h-0"
        onKeyDown={handleKeyDown}
        autoFocus
      />

      {/* Main Interactive Typing Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`
          w-full min-h-[220px] max-h-[340px] glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-y-auto cursor-text transition-all
          ${isPaused ? 'opacity-40 blur-xs pointer-events-none' : 'hover:border-indigo-500/40'}
        `}
      >
        {!isStarted && typedText.length === 0 && (
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg w-fit">
            <AlertCircle className="w-4 h-4" />
            <span>
              {settings.language === 'bn' 
                ? 'টাইপ করা শুরু করুন — কিবোর্ডে চাপ দিলেই সেশন শুরু হবে।' 
                : 'Start typing — timer will begin automatically on first keypress.'}
            </span>
          </div>
        )}

        {/* Character-by-Character Visual Render */}
        <div className="font-bangla leading-relaxed tracking-normal select-none break-words text-slate-400 text-xl sm:text-2xl">
          {targetChars.map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex;
            const typedVal = typedChars[index];
            const isCorrect = isTyped && typedVal === char;
            const isError = isTyped && typedVal !== char;

            return (
              <span
                key={index}
                className={`
                  relative transition-colors duration-75 inline-block
                  ${isCorrect ? 'text-emerald-400 font-medium' : ''}
                  ${isError ? 'text-red-400 bg-red-500/20 underline decoration-red-500 decoration-2 font-bold px-0.5 rounded' : ''}
                  ${isCurrent ? 'text-white font-bold bg-indigo-500/30 px-1 rounded ring-2 ring-indigo-400 animate-pulse' : ''}
                  ${!isTyped && !isCurrent ? 'text-slate-400/80' : ''}
                `}
              >
                {/* Active Blinking Cursor Caret */}
                {isCurrent && (
                  <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-indigo-400 animate-caret rounded-full" />
                )}
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
