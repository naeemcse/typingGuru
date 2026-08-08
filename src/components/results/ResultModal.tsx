import React, { useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Award, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Target, 
  Download, 
  TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import confetti from 'canvas-confetti';
import { SessionMetrics, UserSettings } from '../../types';

interface ResultModalProps {
  metrics: SessionMetrics;
  contentTitle: string;
  settings: UserSettings;
  onRetry: () => void;
  onPracticeWeakness: () => void;
  onOpenCertificate: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  metrics,
  contentTitle,
  settings,
  onRetry,
  onPracticeWeakness,
  onOpenCertificate,
}) => {
  useEffect(() => {
    // Fire celebratory confetti if accuracy >= 90%
    if (metrics.accuracy >= 0.9) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [metrics.accuracy]);

  const errorHeatmapEntries = Object.entries(metrics.charErrors || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl my-8 relative flex flex-col gap-6">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white font-sans">
                {settings.language === 'bn' ? 'ফলাফল ও অ্যাসেসমেন্ট' : 'Session Results & Performance'}
              </h2>
              <p className="text-xs text-slate-400 font-bangla">{contentTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold transition-all"
            >
              <Award className="w-4 h-4" />
              <span>{settings.language === 'bn' ? 'সার্টিফিকেট গ্রহণ' : 'Get Certificate'}</span>
            </button>
          </div>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Net WPM */}
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-800">
            <span className="text-[11px] text-slate-400 font-sans uppercase font-bold tracking-wider">NET WPM</span>
            <span className="text-3xl sm:text-4xl font-black text-indigo-400 my-1">{metrics.netWpm}</span>
            <span className="text-[10px] text-slate-500 font-sans">Gross: {metrics.grossWpm} WPM</span>
          </div>

          {/* CPM */}
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-800">
            <span className="text-[11px] text-slate-400 font-sans uppercase font-bold tracking-wider">CPM</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 my-1">{metrics.cpm}</span>
            <span className="text-[10px] text-slate-500 font-sans">Chars/Min</span>
          </div>

          {/* Accuracy */}
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-800">
            <span className="text-[11px] text-slate-400 font-sans uppercase font-bold tracking-wider">ACCURACY</span>
            <span className={`text-3xl sm:text-4xl font-black my-1 ${metrics.accuracy >= 0.9 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {Math.round(metrics.accuracy * 100)}%
            </span>
            <span className="text-[10px] text-slate-500 font-sans">{metrics.correctChars} / {metrics.totalChars} Chars</span>
          </div>

          {/* Error Count */}
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-800">
            <span className="text-[11px] text-slate-400 font-sans uppercase font-bold tracking-wider font-sans">ERRORS</span>
            <span className="text-3xl sm:text-4xl font-black text-red-400 my-1">{metrics.errorCount}</span>
            <span className="text-[10px] text-slate-500 font-sans">Time: {metrics.durationSec}s</span>
          </div>
        </div>

        {/* Timeline WPM Graph */}
        {metrics.timeline && metrics.timeline.length > 1 && (
          <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>{settings.language === 'bn' ? 'গতি ও টাইপিং ট্রেন্ড (WPM Chart)' : 'Typing Speed Fluctuation'}</span>
            </div>
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.timeline}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="timestampSec" stroke="#94a3b8" fontSize={10} unit="s" />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                  />
                  <Area type="monotone" dataKey="wpm" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorWpm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Character Error Heatmap & Missed Words */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Weak Key Heatmap */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300 font-sans flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-400" />
              {settings.language === 'bn' ? 'ভুল টাইপ করা অক্ষরসমূহ' : 'Character Error Heatmap'}
            </span>
            {errorHeatmapEntries.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {errorHeatmapEntries.map(([char, count]) => (
                  <span
                    key={char}
                    className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-xs font-bangla font-semibold flex items-center gap-1.5"
                  >
                    <span className="text-sm font-bold text-white">{char}</span>
                    <span className="text-[10px] text-red-400 bg-red-950 px-1 rounded">{count}x</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-400 pt-2 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {settings.language === 'bn' ? 'কোনো অক্ষর ভুল হয়নি! চমৎকার নির্ভুলতা।' : 'Perfect accuracy! Zero character errors.'}
              </p>
            )}
          </div>

          {/* Targeted Action */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-300 font-sans flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                {settings.language === 'bn' ? 'দুর্বলতা সংশোধন ব্যবস্থা' : 'Weakness Improvement Recommendation'}
              </h4>
              <p className="text-xs text-slate-400 font-bangla pt-1">
                {settings.language === 'bn'
                  ? 'আপনার ভুল টাইপ করা অক্ষরের ওপর ভিত্তি করে ১-ক্লিকে দুর্বলতা কাটিয়ে ওঠার বিশেষ ড্রিল শুরু করুন।'
                  : 'Target historical weak characters in an automatically generated focused drill session.'}
              </p>
            </div>

            <button
              onClick={onPracticeWeakness}
              className="w-full py-2 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{settings.language === 'bn' ? 'দুর্বল অক্ষরে প্র্যাকটিস শুরু করুন' : 'Practice Weak Characters'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{settings.language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
