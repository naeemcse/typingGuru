import React, { useState } from 'react';
import { Target, Flame, FileText, AlignLeft, Sparkles, Layers } from 'lucide-react';
import { UserSettings, SessionMetrics, ContentCategory } from '../../types';
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

export const PracticeModule: React.FC<PracticeModuleProps> = ({
  settings,
  onSessionComplete,
}) => {
  const [category, setCategory] = useState<ContentCategory>('paragraphs');
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Dynamically resolve content based on language & selected category
  const wordsList = settings.language === 'bn' ? banglaWordsData.words : englishWordsData.words;
  const parasList = settings.language === 'bn' ? banglaParasData.paragraphs : englishParasData.paragraphs;

  let activePromptText = '';
  let activeTitle = '';

  if (category === 'weakness') {
    const drill = generateWeaknessTargetedDrill(settings.language);
    activePromptText = drill.text;
    activeTitle = drill.title;
  } else if (category === 'words') {
    activePromptText = wordsList.map((w) => w.text).join(' ');
    activeTitle = settings.language === 'bn' ? 'সাধারণ শব্দ অনুশীলন' : 'Common Words Drill';
  } else {
    const currentPara = parasList[selectedIdx] || parasList[0];
    activePromptText = currentPara.text;
    activeTitle = currentPara.title;
  }

  return (
    <div className="w-full flex flex-col gap-6 max-w-6xl mx-auto px-4 py-6">
      
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
                {settings.language === 'bn' ? 'ফ্রি-ফর্ম টাইপিং অনুশীলন' : 'Free-Form Practice'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Exploratory
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bangla pt-1">
              {settings.language === 'bn'
                ? 'শব্দ, অনুচ্ছেদ অথবা আপনার পূর্ববর্তী ভুলের ওপর ভিত্তি করে দুর্বলতা সংশোধন ড্রিল অনুশীলন করুন।'
                : 'Practice words, paragraphs, or target historical weak characters.'}
            </p>
          </div>
        </div>

        {/* 1-Click Weakness Engine Drill Trigger */}
        <button
          onClick={() => setCategory('weakness')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all shadow-lg shadow-amber-500/10"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{settings.language === 'bn' ? 'দুর্বলতা সংশোধন ড্রিল' : 'Generate Weakness Drill'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setCategory('paragraphs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            category === 'paragraphs' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{settings.language === 'bn' ? 'অনুচ্ছেদ (Paragraphs)' : 'Paragraphs'}</span>
        </button>

        <button
          onClick={() => setCategory('words')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            category === 'words' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
          <span>{settings.language === 'bn' ? 'শব্দাবলী (Words)' : 'Words'}</span>
        </button>

        <button
          onClick={() => setCategory('weakness')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            category === 'weakness' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{settings.language === 'bn' ? 'দুর্বলতা ড্রিল (Weakness)' : 'Weakness Engine'}</span>
        </button>
      </div>

      {/* Paragraph Selector (if paragraph mode) */}
      {category === 'paragraphs' && (
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {parasList.map((p, pIdx) => (
            <button
              key={p.id}
              onClick={() => setSelectedIdx(pIdx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-bangla border transition-all min-w-max ${
                pIdx === selectedIdx ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Typing Area */}
      <TypingArea
        targetText={activePromptText}
        contentTitle={activeTitle}
        settings={settings}
        durationSec={300}
        onSessionComplete={onSessionComplete}
      />

      {/* Virtual Keyboard */}
      <VirtualKeyboard settings={settings} />
    </div>
  );
};
