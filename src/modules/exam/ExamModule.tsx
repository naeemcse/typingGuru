import React, { useState } from 'react';
import { Award, Clock, ShieldAlert, CheckCircle2, AlertTriangle, Trophy, Target, Filter, ChevronRight, Zap, BookOpen } from 'lucide-react';
import { UserSettings, SessionMetrics, ExamSet } from '../../types';
import banglaExamData from '../../content/bangla/exam-sets.json';
import englishExamData from '../../content/english/exam-sets.json';
import { TypingArea } from '../../components/typing/TypingArea';

interface ExamModuleProps {
  settings: UserSettings;
  onSessionComplete: (metrics: SessionMetrics) => void;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; labelBn: string; icon: React.ReactNode }> = {
  beginner: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Beginner', labelBn: 'প্রবেশ', icon: <BookOpen className="w-3 h-3" /> },
  standard: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Standard', labelBn: 'সাধারণ', icon: <Target className="w-3 h-3" /> },
  advanced: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Advanced', labelBn: 'উন্নত', icon: <Zap className="w-3 h-3" /> },
  expert: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Expert', labelBn: 'বিশেষজ্ঞ', icon: <Trophy className="w-3 h-3" /> },
};

export const ExamModule: React.FC<ExamModuleProps> = ({
  settings,
  onSessionComplete,
  onUpdateSettings,
}) => {
  const [selectedExamIdx, setSelectedExamIdx] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [isExamStarted, setIsExamStarted] = useState(false);

  const allExamSets: ExamSet[] = settings.language === 'bn' 
    ? banglaExamData.examSets as any
    : englishExamData.examSets as any;

  // Filter by difficulty
  const examSets = difficultyFilter === 'all'
    ? allExamSets
    : allExamSets.filter((e: any) => e.difficulty === difficultyFilter);

  const currentExam = examSets[selectedExamIdx] || examSets[0];

  const handleExamFinish = (metrics: SessionMetrics) => {
    const passed = metrics.netWpm >= currentExam.passCriteria.minWpm &&
      (1 - metrics.accuracy) <= currentExam.passCriteria.maxErrorRate;
    setIsExamStarted(false);
    onSessionComplete({ ...metrics, passed });
  };

  const handleSelectExam = (idx: number) => {
    setSelectedExamIdx(idx);
    setIsExamStarted(false);
  };

  const getDiffConfig = (difficulty: string) => DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.standard;

  if (!currentExam) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            {settings.language === 'bn' ? 'এই কঠিনতায় কোনো পরীক্ষা নেই। ফিল্টার পরিবর্তন করুন।' : 'No exams for this difficulty. Change filter.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5 max-w-6xl mx-auto px-4 py-6">
      
      {/* Exam Banner Header */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-sans">
                {settings.language === 'bn' ? 'নিয়োগ টাইপিং পরীক্ষা' : 'Recruitment Exam Simulation'}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-sans">
                {allExamSets.length} {settings.language === 'bn' ? 'সেট' : 'Sets'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bangla pt-0.5">
              {settings.language === 'bn'
                ? 'সরকারি চাকরির টাইপিং পরীক্ষার সিমুলেশন। পাস/ফেল স্বয়ংক্রিয়ভাবে মূল্যায়ন হবে।'
                : 'Simulate real government typing exams with automatic pass/fail assessment.'}
            </p>
          </div>
        </div>

        {/* Strict Mode Toggle */}
        <button
          onClick={() => onUpdateSettings({ strictMode: !settings.strictMode, backspaceAllowed: settings.strictMode })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            settings.strictMode
              ? 'bg-red-500/15 border-red-500/30 text-red-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{settings.strictMode
            ? (settings.language === 'bn' ? 'স্ট্রিক্ট মোড চালু' : 'Strict ON')
            : (settings.language === 'bn' ? 'স্ট্রিক্ট মোড' : 'Strict Mode')
          }</span>
        </button>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
          {settings.language === 'bn' ? 'কঠিনতা' : 'Difficulty'}
        </span>
        <div className="flex items-center gap-0.5 bg-slate-900/60 rounded-xl p-0.5 border border-slate-800">
          <button
            onClick={() => { setDifficultyFilter('all'); setSelectedExamIdx(0); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              difficultyFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {settings.language === 'bn' ? 'সব' : 'All'}
          </button>
          {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setDifficultyFilter(key); setSelectedExamIdx(0); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                difficultyFilter === key ? `${cfg.bg} ${cfg.color} ${cfg.border} border` : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cfg.icon}
              <span>{settings.language === 'bn' ? cfg.labelBn : cfg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exam Set Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {examSets.map((exam: any, eIdx: number) => {
          const isSelected = eIdx === selectedExamIdx;
          const dc = getDiffConfig(exam.difficulty || 'standard');
          const durationMin = Math.floor(exam.durationSec / 60);
          const durationSec = exam.durationSec % 60;

          return (
            <button
              key={exam.id}
              onClick={() => handleSelectExam(eIdx)}
              className={`
                glass-card rounded-2xl p-4 border text-left flex flex-col justify-between gap-3 transition-all group
                ${isSelected ? 'border-emerald-500/60 bg-emerald-950/20 ring-1 ring-emerald-500/40' : 'border-slate-800 hover:border-slate-700'}
              `}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`text-xs font-bold font-bangla leading-snug ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {exam.title}
                  </h3>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 font-bangla leading-relaxed">{exam.content}</p>
              </div>

              {/* Exam Meta Info */}
              <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 gap-2 flex-wrap">
                {/* Duration Badge */}
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{durationMin}{durationSec > 0 ? `:${durationSec.toString().padStart(2, '0')}` : ''} মি.</span>
                </div>

                {/* Difficulty Badge */}
                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${dc.bg} ${dc.color} ${dc.border} border`}>
                  {dc.icon}
                  {settings.language === 'bn' ? dc.labelBn : dc.label}
                </span>

                {/* Pass Criteria */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>≥{exam.passCriteria.minWpm} WPM</span>
                  <span className="w-px h-3 bg-slate-700" />
                  <span>≤{Math.round(exam.passCriteria.maxErrorRate * 100)}% ত্রুটি</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Start Exam Button (if not started yet) */}
      {!isExamStarted && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsExamStarted(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 shadow-xl shadow-emerald-600/25 transition-all"
          >
            <Trophy className="w-5 h-5" />
            <span className="font-bangla">
              {settings.language === 'bn' ? 'পরীক্ষা শুরু করুন' : 'Start Exam'}
            </span>
            <span className="text-[10px] text-emerald-200 font-mono ml-1">
              ({Math.floor(currentExam.durationSec / 60)} মি.)
            </span>
          </button>
        </div>
      )}

      {/* Typing Area (only shown after starting) */}
      {isExamStarted && (
        <TypingArea
          targetText={currentExam.content}
          contentTitle={currentExam.title}
          settings={settings}
          durationSec={currentExam.durationSec}
          onSessionComplete={handleExamFinish}
        />
      )}
    </div>
  );
};
