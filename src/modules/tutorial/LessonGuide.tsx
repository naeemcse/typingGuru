import React from 'react';
import { Lightbulb, Info } from 'lucide-react';

interface LessonGuideProps {
  title: string;
  titleEn: string;
  guide?: string;
  lessonNumber: number;
  totalItems: number;
  language: 'bn' | 'en';
}

export const LessonGuide: React.FC<LessonGuideProps> = ({
  title,
  titleEn,
  guide,
  lessonNumber,
  totalItems,
  language,
}) => {
  if (!guide) return null;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-600/8 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-500/6 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start gap-3 mb-3 relative">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white font-bangla">
              পাঠ {lessonNumber}: {title}
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 rounded-full font-sans">
              {totalItems} অক্ষর
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans mt-0.5">{titleEn}</p>
        </div>
      </div>

      {/* Guide Text */}
      <div className="flex items-start gap-2.5 mt-2 relative">
        <Info className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-300 font-bangla leading-relaxed">
          {guide}
        </p>
      </div>
    </div>
  );
};
