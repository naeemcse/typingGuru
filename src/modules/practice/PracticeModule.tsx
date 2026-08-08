import React, { useState, useMemo } from 'react';
import { Target, Flame, FileText, AlignLeft, Sparkles, PenLine, Clock, Filter, ChevronRight } from 'lucide-react';
import { UserSettings, SessionMetrics, ContentCategory, TimerDuration } from '../../types';
import banglaWordsData from '../../content/bangla/words-common.json';
import banglaParasData from '../../content/bangla/paragraphs.json';
import englishWordsData from '../../content/english/words-common.json';
import englishParasData from '../../content/english/paragraphs.json';
import { generateWeaknessTargetedDrill } from '../../lib/storage/weaknessEngine';
import { TypingArea } from '../../components/typing/TypingArea';
import { VirtualKeyboard } from '../../components/keyboard/VirtualKeyboard';

interface PracticeModuleProps {
  settings: UserSettings;
  onSessionComplete: (metrics: SessionMetrics) => void;
}

const TIMER_OPTIONS: { value: TimerDuration; label: string }[] = [
  { value: 30, label: '30s' },
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 300, label: '5 min' },
];

const DIFFICULTY_FILTERS = [
  { value: 'all', label: 'সব', labelEn: 'All' },
  { value: 'easy', label: 'সহজ', labelEn: 'Easy' },
  { value: 'medium', label: 'মাঝারি', labelEn: 'Medium' },
  { value: 'hard', label: 'কঠিন', labelEn: 'Hard' },
];

type PracticeView = 'paragraphs' | 'words' | 'weakness' | 'custom';

export const PracticeModule: React.FC<PracticeModuleProps> = ({
  settings,
  onSessionComplete,
}) => {
  const [category, setCategory] = useState<PracticeView>('paragraphs');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(60);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [customText, setCustomText] = useState('');
  const [isCustomReady, setIsCustomReady] = useState(false);

  // Content resolution
  const wordsList = settings.language === 'bn' ? banglaWordsData.words : englishWordsData.words;
  const rawParasList = settings.language === 'bn' ? banglaParasData.paragraphs : englishParasData.paragraphs;

  // Filter paragraphs by difficulty
  const parasList = useMemo(() => {
    if (difficultyFilter === 'all') return rawParasList;
    return rawParasList.filter((p: any) => p.difficulty === difficultyFilter);
  }, [rawParasList, difficultyFilter]);

  // Filter words by difficulty
  const filteredWords = useMemo(() => {
    if (difficultyFilter === 'all') return wordsList;
    return wordsList.filter((w) => w.difficulty === difficultyFilter);
  }, [wordsList, difficultyFilter]);

  // Resolve active prompt
  let activePromptText = '';
  let activeTitle = '';

  if (category === 'weakness') {
    const drill = generateWeaknessTargetedDrill(settings.language);
    activePromptText = drill.text;
    activeTitle = drill.title;
  } else if (category === 'words') {
    activePromptText = filteredWords.map((w) => w.text).join(' ');
    activeTitle = settings.language === 'bn'
      ? `শব্দ অনুশীলন (${difficultyFilter === 'all' ? 'সব' : difficultyFilter}) — ${filteredWords.length} শব্দ`
      : `Word Drill (${difficultyFilter === 'all' ? 'All' : difficultyFilter}) — ${filteredWords.length} words`;
  } else if (category === 'custom') {
    activePromptText = customText;
    activeTitle = settings.language === 'bn' ? 'কাস্টম টেক্সট অনুশীলন' : 'Custom Text Practice';
  } else {
    const currentPara = parasList[selectedIdx] || parasList[0];
    if (currentPara) {
      activePromptText = currentPara.text;
      activeTitle = currentPara.title;
    }
  }

  const handleCategoryChange = (cat: PracticeView) => {
    setCategory(cat);
    setSelectedIdx(0);
    if (cat !== 'custom') setIsCustomReady(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 max-w-6xl mx-auto px-4 py-6">
      
      {/* Banner Header */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-sans">
                {settings.language === 'bn' ? 'টাইপিং অনুশীলন' : 'Typing Practice'}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-sans">
                {settings.language === 'bn' ? `${rawParasList.length} অনুচ্ছেদ` : `${rawParasList.length} Passages`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bangla pt-0.5">
              {settings.language === 'bn'
                ? 'অনুচ্ছেদ, শব্দাবলী অথবা কাস্টম টেক্সট দিয়ে অনুশীলন করুন। সময় ও কঠিনতা নিজের মতো সেট করুন।'
                : 'Practice with paragraphs, words, or custom text. Configure time and difficulty.'}
            </p>
          </div>
        </div>

        {/* Weakness Drill Quick Action */}
        <button
          onClick={() => handleCategoryChange('weakness')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{settings.language === 'bn' ? 'দুর্বলতা সংশোধন' : 'Weakness Drill'}</span>
        </button>
      </div>

      {/* Controls Row: Category Tabs + Timer + Difficulty Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/60 rounded-xl p-0.5 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => handleCategoryChange('paragraphs')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
              category === 'paragraphs' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{settings.language === 'bn' ? 'অনুচ্ছেদ' : 'Paragraphs'}</span>
          </button>

          <button
            onClick={() => handleCategoryChange('words')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
              category === 'words' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>{settings.language === 'bn' ? 'শব্দাবলী' : 'Words'}</span>
          </button>

          <button
            onClick={() => handleCategoryChange('weakness')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
              category === 'weakness' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings.language === 'bn' ? 'দুর্বলতা ড্রিল' : 'Weakness'}</span>
          </button>

          <button
            onClick={() => handleCategoryChange('custom')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
              category === 'custom' ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>{settings.language === 'bn' ? 'কাস্টম টেক্সট' : 'Custom Text'}</span>
          </button>
        </div>

        {/* Timer + Difficulty Row */}
        <div className="flex items-center gap-3">
          {/* Difficulty Filter */}
          {(category === 'paragraphs' || category === 'words') && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <div className="flex items-center gap-0.5 bg-slate-900/60 rounded-lg p-0.5 border border-slate-800">
                {DIFFICULTY_FILTERS.map((df) => (
                  <button
                    key={df.value}
                    onClick={() => { setDifficultyFilter(df.value); setSelectedIdx(0); }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                      difficultyFilter === df.value
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {settings.language === 'bn' ? df.label : df.labelEn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timer Selector */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <div className="flex items-center gap-0.5 bg-slate-900/60 rounded-lg p-0.5 border border-slate-800">
              {TIMER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTimerDuration(opt.value)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-sans transition-all ${
                    timerDuration === opt.value
                      ? 'bg-indigo-600 text-white timer-pill-active'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Paragraph Selector Cards (if paragraph mode) */}
      {category === 'paragraphs' && parasList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {parasList.map((p: any, pIdx: number) => {
            const isSelected = pIdx === selectedIdx;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedIdx(pIdx)}
                className={`
                  text-left p-3 rounded-xl border transition-all group
                  ${isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/40 ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold font-bangla truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {p.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-sans">{(p as any).category}</span>
                      {(p as any).difficulty && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-sans ${
                          (p as any).difficulty === 'easy' ? 'bg-emerald-500/15 text-emerald-400' :
                          (p as any).difficulty === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                          'bg-red-500/15 text-red-400'
                        }`}>
                          {(p as any).difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Text Input */}
      {category === 'custom' && !isCustomReady && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2.5 mb-3">
            <PenLine className="w-5 h-5 text-violet-400" />
            <h4 className="text-sm font-bold text-white font-bangla">
              {settings.language === 'bn' ? 'নিজের টেক্সট লিখুন বা পেস্ট করুন' : 'Enter or paste your own text'}
            </h4>
          </div>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={settings.language === 'bn'
              ? 'এখানে আপনার টেক্সট লিখুন অথবা পেস্ট করুন...'
              : 'Type or paste your text here...'
            }
            rows={5}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 font-bangla placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-slate-500 font-mono">
              {customText.length} {settings.language === 'bn' ? 'অক্ষর' : 'chars'}
            </span>
            <button
              onClick={() => { if (customText.trim().length >= 5) setIsCustomReady(true); }}
              disabled={customText.trim().length < 5}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                customText.trim().length >= 5
                  ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {settings.language === 'bn' ? 'টাইপিং শুরু করুন' : 'Start Typing'}
            </button>
          </div>
        </div>
      )}

      {/* Typing Area */}
      {(category !== 'custom' || isCustomReady) && activePromptText && (
        <TypingArea
          targetText={activePromptText}
          contentTitle={activeTitle}
          settings={settings}
          durationSec={timerDuration}
          onSessionComplete={onSessionComplete}
        />
      )}

      {/* Virtual Keyboard */}
      {settings.showVirtualKeyboard && <VirtualKeyboard settings={settings} />}
    </div>
  );
};
