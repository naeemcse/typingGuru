import React, { useState } from 'react';
import { Award, Clock, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { UserSettings, SessionMetrics, ExamSet } from '../../types';
import banglaExamData from '../../content/bangla/exam-sets.json';
import englishExamData from '../../content/english/exam-sets.json';
import { TypingArea } from '../../components/typing/TypingArea';

interface ExamModuleProps {
  settings: UserSettings;
  onSessionComplete: (metrics: SessionMetrics) => void;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const ExamModule: React.FC<ExamModuleProps> = ({
  settings,
  onSessionComplete,
  onUpdateSettings,
}) => {
  const [selectedExamIdx, setSelectedExamIdx] = useState(0);

  const examSets: ExamSet[] = settings.language === 'bn' 
    ? banglaExamData.examSets as any
    : englishExamData.examSets as any;

  const currentExam = examSets[selectedExamIdx] || examSets[0];

  const handleExamFinish = (metrics: SessionMetrics) => {
    // Evaluate Pass/Fail criteria based on exam set rules
    const passed = metrics.netWpm >= currentExam.passCriteria.minWpm &&
      (1 - metrics.accuracy) <= currentExam.passCriteria.maxErrorRate;

    onSessionComplete({ ...metrics, passed });
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-6xl mx-auto px-4 py-6">
      
      {/* Exam Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
                {settings.language === 'bn' ? 'নিয়োগ টাইপিং পরীক্ষা (Exam Simulation)' : 'Recruitment Exam Simulation'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Standardized
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bangla pt-1">
              {settings.language === 'bn'
                ? 'সরকারি চাকরির টাইপিং পরীক্ষার বাস্তবসম্মত সিমুলেশন। সময় ও নির্ভুলতার ভিত্তিতে স্বয়ংক্রিয় পাস/ফেল অ্যাসেসমেন্ট।'
                : 'Simulate government recruitment typing tests with timed evaluation and pass criteria.'}
            </p>
          </div>
        </div>

        {/* Strict Mode Toggle */}
        <button
          onClick={() => onUpdateSettings({ strictMode: !settings.strictMode, backspaceAllowed: settings.strictMode })}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
            settings.strictMode
              ? 'bg-red-500/20 border-red-500/40 text-red-300 shadow-lg shadow-red-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>{settings.strictMode ? 'Strict Mode ON (No Backspace)' : 'Enable Strict Mode'}</span>
        </button>
      </div>

      {/* Exam Set Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examSets.map((exam, eIdx) => {
          const isSelected = eIdx === selectedExamIdx;

          return (
            <button
              key={exam.id}
              onClick={() => setSelectedExamIdx(eIdx)}
              className={`
                glass-card rounded-2xl p-5 border text-left flex flex-col justify-between gap-3 transition-all
                ${isSelected ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/50' : 'border-slate-800 hover:border-slate-700'}
              `}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white font-bangla">{exam.title}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-indigo-300 rounded">
                    {Math.floor(exam.durationSec / 60)} Mins
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 font-bangla">{exam.content}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400 font-mono">
                <span>Pass Criteria: <strong>{exam.passCriteria.minWpm} WPM</strong></span>
                <span>Max Errors: <strong>{Math.round(exam.passCriteria.maxErrorRate * 100)}%</strong></span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Typing Assessment */}
      <TypingArea
        targetText={currentExam.content}
        contentTitle={currentExam.title}
        settings={settings}
        durationSec={currentExam.durationSec}
        onSessionComplete={handleExamFinish}
      />
    </div>
  );
};
