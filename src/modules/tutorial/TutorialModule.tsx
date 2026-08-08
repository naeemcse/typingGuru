import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lock, Play, Sparkles } from 'lucide-react';
import { UserSettings, SessionMetrics } from '../../types';
import banglaCharsData from '../../content/bangla/characters.json';
import { TypingArea } from '../../components/typing/TypingArea';
import { VirtualKeyboard } from '../../components/keyboard/VirtualKeyboard';

interface TutorialModuleProps {
  settings: UserSettings;
  onSessionComplete: (metrics: SessionMetrics) => void;
}

export const TutorialModule: React.FC<TutorialModuleProps> = ({
  settings,
  onSessionComplete,
}) => {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(1);

  const groups = banglaCharsData.groups;
  const currentGroup = groups[selectedGroupIdx] || groups[0];
  const currentItem = currentGroup.items[selectedItemIdx] || currentGroup.items[0];

  const promptText = currentItem.drillPattern.join(' ');

  const handleLessonFinish = (metrics: SessionMetrics) => {
    // Unlock next level if accuracy >= 90%
    if (metrics.accuracy >= 0.9) {
      setUnlockedLevel((prev) => Math.max(prev, selectedGroupIdx + 2));
    }
    onSessionComplete(metrics);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-6xl mx-auto px-4 py-6">
      
      {/* Module Banner Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
                {settings.language === 'bn' ? 'টিউটোরিয়াল ও কিবোর্ড মাস্টার' : 'Tutorial & Key Tutor'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Step-by-Step
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bangla pt-1">
              {settings.language === 'bn'
                ? 'এক একটি অক্ষর থেকে শুরু করে ধাপে ধাপে টাইপিং আয়ত্ত করুন। ৯০%+ নির্ভুলতা অর্জন করলে পরবর্তী পাঠ আনলক হবে।'
                : 'Master keys step-by-step from individual characters to short words.'}
            </p>
          </div>
        </div>
      </div>

      {/* Group & Lesson Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {groups.map((grp, gIdx) => {
          const isUnlocked = gIdx < unlockedLevel;
          const isSelected = gIdx === selectedGroupIdx;

          return (
            <button
              key={grp.id}
              disabled={!isUnlocked}
              onClick={() => {
                setSelectedGroupIdx(gIdx);
                setSelectedItemIdx(0);
              }}
              className={`
                glass-card rounded-2xl p-4 border text-left flex items-center justify-between transition-all
                ${isSelected ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/50' : 'border-slate-800 hover:border-slate-700'}
                ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {gIdx + 1}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 font-bangla">{grp.title}</h3>
                  <span className="text-[10px] text-slate-400 font-sans">{grp.items.length} Lessons</span>
                </div>
              </div>

              <div>
                {isUnlocked ? (
                  <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Item Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        {currentGroup.items.map((item, iIdx) => {
          const isSelected = iIdx === selectedItemIdx;
          return (
            <button
              key={iIdx}
              onClick={() => setSelectedItemIdx(iIdx)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold font-bangla transition-all min-w-max border
                ${isSelected ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}
              `}
            >
              অক্ষর: <span className="text-base font-extrabold ml-1">{item.char}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Typing Section */}
      <TypingArea
        targetText={promptText}
        contentTitle={`পাঠ ${selectedGroupIdx + 1}.${selectedItemIdx + 1}: ${currentItem.char} (${(currentItem as any).titleEn || currentGroup.title})`}
        settings={settings}
        durationSec={120}
        onSessionComplete={handleLessonFinish}
      />

      {/* On-Screen Keyboard */}
      <VirtualKeyboard
        activeTargetKey={currentItem.char}
        settings={settings}
      />
    </div>
  );
};
