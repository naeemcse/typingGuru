import React, { useState, useMemo } from 'react';
import { BookOpen, Type, Shuffle, FileText, PenLine, Keyboard, ChevronLeft, Menu } from 'lucide-react';
import { UserSettings, SessionMetrics, TutorialSubView, TimerDuration } from '../../types';
import banglaCharsData from '../../content/bangla/characters.json';
import banglaSentencesData from '../../content/bangla/tutorial-sentences.json';
import { TypingArea } from '../../components/typing/TypingArea';
import { VirtualKeyboard } from '../../components/keyboard/VirtualKeyboard';
import { LessonSidebar } from './LessonSidebar';
import { LessonGuide } from './LessonGuide';
import { TimerSelector } from './TimerSelector';
import { CustomTextInput } from './CustomTextInput';
import { BlankTypingField } from './BlankTypingField';

interface TutorialModuleProps {
  settings: UserSettings;
  onSessionComplete: (metrics: SessionMetrics) => void;
}

// Sub-view tabs configuration
const SUB_VIEW_TABS: { key: TutorialSubView; icon: React.ReactNode; labelBn: string; labelEn: string }[] = [
  { key: 'character', icon: <Type className="w-3.5 h-3.5" />, labelBn: 'অক্ষর', labelEn: 'Characters' },
  { key: 'mixed', icon: <Shuffle className="w-3.5 h-3.5" />, labelBn: 'মিশ্র অনুশীলন', labelEn: 'Mixed' },
  { key: 'sentences', icon: <FileText className="w-3.5 h-3.5" />, labelBn: 'বাক্য', labelEn: 'Sentences' },
  { key: 'custom', icon: <PenLine className="w-3.5 h-3.5" />, labelBn: 'কাস্টম টেক্সট', labelEn: 'Custom' },
  { key: 'blank', icon: <Keyboard className="w-3.5 h-3.5" />, labelBn: 'ফ্রি টাইপিং', labelEn: 'Free Type' },
];

export const TutorialModule: React.FC<TutorialModuleProps> = ({
  settings,
  onSessionComplete,
}) => {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [expandedGroupIdx, setExpandedGroupIdx] = useState<number | null>(0);
  const [subView, setSubView] = useState<TutorialSubView>('character');
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(60);
  const [customText, setCustomText] = useState<string | null>(null);
  const [completedLessons] = useState<Set<string>>(new Set());
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const groups = banglaCharsData.groups;
  const currentGroup = groups[selectedGroupIdx] || groups[0];
  const currentItem = currentGroup.items[selectedItemIdx] || currentGroup.items[0];

  // Generate prompt text based on active sub-view
  const promptText = useMemo(() => {
    switch (subView) {
      case 'character':
        return currentItem.drillPattern.join(' ');

      case 'mixed': {
        // Combine all characters from the current lesson group into a mixed drill
        const allChars = currentGroup.items.map((item) => item.char);
        const mixedDrill: string[] = [];
        // Individual characters
        mixedDrill.push(allChars.join(' '));
        // Pairs
        for (let i = 0; i < allChars.length; i++) {
          for (let j = 0; j < allChars.length; j++) {
            if (i !== j) mixedDrill.push(allChars[i] + allChars[j]);
          }
        }
        // Practice sentences from the group
        const groupSentences = (currentGroup as any).practiceSentences || [];
        return [...mixedDrill.slice(0, 20), ...groupSentences].join(' ');
      }

      case 'sentences': {
        // Use practice sentences from the current group + global sentences
        const groupSentences = (currentGroup as any).practiceSentences || [];
        const globalSentences = banglaSentencesData.sentences;
        
        // Determine difficulty level based on lesson position
        let levelSentences: string[] = [];
        if (selectedGroupIdx < 8) {
          levelSentences = globalSentences.beginner || [];
        } else if (selectedGroupIdx < 16) {
          levelSentences = globalSentences.intermediate || [];
        } else {
          levelSentences = globalSentences.advanced || [];
        }

        const allSentences = [...groupSentences, ...levelSentences];
        // Rotate through sentences
        const idx = sentenceIdx % Math.max(allSentences.length, 1);
        // Return a batch of sentences
        return allSentences.slice(idx, idx + 5).join(' ') || allSentences.join(' ');
      }

      case 'custom':
        return customText || '';

      default:
        return '';
    }
  }, [subView, currentItem, currentGroup, selectedGroupIdx, sentenceIdx, customText]);

  const contentTitle = useMemo(() => {
    const lessonPrefix = `পাঠ ${selectedGroupIdx + 1}`;
    switch (subView) {
      case 'character':
        return `${lessonPrefix}.${selectedItemIdx + 1}: ${currentItem.char} — ${currentGroup.title}`;
      case 'mixed':
        return `${lessonPrefix}: মিশ্র অনুশীলন — ${currentGroup.title}`;
      case 'sentences':
        return `${lessonPrefix}: বাক্য অনুশীলন — ${currentGroup.title}`;
      case 'custom':
        return 'কাস্টম টেক্সট অনুশীলন';
      case 'blank':
        return 'ফ্রি টাইপিং';
      default:
        return 'টিউটোরিয়াল';
    }
  }, [subView, selectedGroupIdx, selectedItemIdx, currentItem, currentGroup]);

  const handleSelectGroup = (idx: number) => {
    setSelectedGroupIdx(idx);
    setSelectedItemIdx(0);
    setSentenceIdx(0);
    if (subView === 'character' || subView === 'mixed' || subView === 'sentences') {
      // Keep the current sub-view
    }
  };

  const handleToggleExpand = (idx: number) => {
    setExpandedGroupIdx(expandedGroupIdx === idx ? null : idx);
  };

  const handleSelectItem = (groupIdx: number, itemIdx: number) => {
    setSelectedGroupIdx(groupIdx);
    setSelectedItemIdx(itemIdx);
    setSubView('character');
  };

  const handleSelectMixed = (groupIdx: number) => {
    setSelectedGroupIdx(groupIdx);
    setSubView('mixed');
  };

  const handleNextSentences = () => {
    setSentenceIdx((prev) => prev + 5);
  };

  const handleSessionFinish = (metrics: SessionMetrics) => {
    onSessionComplete(metrics);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6 flex flex-col gap-4">

      {/* Module Banner Header */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-sans">
                {settings.language === 'bn' ? 'টিউটোরিয়াল ও কিবোর্ড মাস্টার' : 'Tutorial & Key Tutor'}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-sans">
                {groups.length} পাঠ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bangla pt-0.5">
              {settings.language === 'bn'
                ? 'ধাপে ধাপে বাংলা টাইপিং শিখুন — স্বরবর্ণ থেকে দাপ্তরিক বাক্য পর্যন্ত।'
                : 'Learn Bangla typing step-by-step — from vowels to official sentences.'}
            </p>
          </div>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
        >
          {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          {sidebarOpen ? 'পাঠ লুকান' : 'পাঠ দেখুন'}
        </button>
      </div>

      {/* 2-Panel Layout */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* Left Panel: Lesson Sidebar */}
        <div className={`
          md:w-72 lg:w-80 shrink-0 glass-panel rounded-2xl border border-slate-800 p-3 transition-all duration-300
          ${sidebarOpen ? 'block' : 'hidden md:block'}
        `}
          style={{ maxHeight: 'calc(100vh - 220px)' }}
        >
          <LessonSidebar
            groups={groups}
            selectedGroupIdx={selectedGroupIdx}
            expandedGroupIdx={expandedGroupIdx}
            completedLessons={completedLessons}
            onSelectGroup={handleSelectGroup}
            onToggleExpand={handleToggleExpand}
            onSelectItem={handleSelectItem}
            selectedItemIdx={selectedItemIdx}
            onSelectMixed={handleSelectMixed}
          />
        </div>

        {/* Right Panel: Active Lesson Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Lesson Guide Banner */}
          <LessonGuide
            title={currentGroup.title}
            titleEn={currentGroup.titleEn}
            guide={(currentGroup as any).guide}
            lessonNumber={selectedGroupIdx + 1}
            totalItems={currentGroup.items.length}
            language={settings.language}
          />

          {/* Sub-View Tabs + Timer Selector Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Sub-view Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/60 rounded-xl p-0.5 border border-slate-800 overflow-x-auto">
              {SUB_VIEW_TABS.map((tab) => {
                const isActive = subView === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSubView(tab.key)}
                    className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all duration-200 whitespace-nowrap
                      ${isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }
                    `}
                  >
                    {tab.icon}
                    <span className="font-bangla">{settings.language === 'bn' ? tab.labelBn : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Timer Duration Selector */}
            {subView !== 'blank' && (
              <TimerSelector
                selectedDuration={timerDuration}
                onSelectDuration={setTimerDuration}
              />
            )}
          </div>

          {/* Character Selector Pills (only in character mode) */}
          {subView === 'character' && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
              {currentGroup.items.map((item, iIdx) => {
                const isSelected = iIdx === selectedItemIdx;
                return (
                  <button
                    key={iIdx}
                    onClick={() => setSelectedItemIdx(iIdx)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-bold font-bangla transition-all min-w-max border
                      ${isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/25'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }
                    `}
                  >
                    <span className="text-sm font-extrabold">{item.char}</span>
                    <span className="ml-1.5 text-[10px] font-sans text-slate-500">{item.romanized}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sentence Navigation (only in sentences mode) */}
          {subView === 'sentences' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextSentences}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all"
              >
                <FileText className="w-3 h-3" />
                {settings.language === 'bn' ? 'পরবর্তী বাক্যগুলো' : 'Next Sentences'}
              </button>
              <span className="text-[10px] text-slate-500 font-mono">
                #{sentenceIdx + 1}
              </span>
            </div>
          )}

          {/* Custom Text Input (only in custom mode) */}
          {subView === 'custom' && !customText && (
            <CustomTextInput
              onStartTyping={(text) => setCustomText(text)}
              language={settings.language}
            />
          )}

          {/* Blank Typing Field (only in blank mode) */}
          {subView === 'blank' && (
            <BlankTypingField
              settings={settings}
              durationSec={timerDuration}
            />
          )}

          {/* Main Typing Area (for character, mixed, sentences, custom modes) */}
          {subView !== 'blank' && promptText && (
            <TypingArea
              targetText={promptText}
              contentTitle={contentTitle}
              settings={settings}
              durationSec={timerDuration}
              onSessionComplete={handleSessionFinish}
            />
          )}

          {/* Virtual Keyboard */}
          {subView !== 'blank' && settings.showVirtualKeyboard && (
            <VirtualKeyboard
              activeTargetKey={subView === 'character' ? currentItem.char : undefined}
              settings={settings}
            />
          )}
        </div>
      </div>
    </div>
  );
};
