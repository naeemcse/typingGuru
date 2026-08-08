import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Trash2, 
  Flame, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Globe 
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
import { UserSettings, TypingSession } from '../../types';
import { StorageAdapter } from '../../lib/storage/storageAdapter';

interface AnalyticsModuleProps {
  settings: UserSettings;
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ settings }) => {
  const [history, setHistory] = useState<TypingSession[]>([]);
  const [weakChars, setWeakChars] = useState<Array<{ char: string; errorCount: number }>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const sessions = StorageAdapter.getHistory();
    setHistory(sessions);
    setWeakChars(StorageAdapter.getWeakCharacters(12));
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = ['Session ID', 'Date', 'Module', 'Language', 'Layout', 'Net WPM', 'CPM', 'Accuracy %', 'Errors'];
    const rows = history.map((s) => [
      s.sessionId,
      new Date(s.startedAt).toLocaleString(),
      s.moduleType,
      s.language,
      s.layoutUsed,
      s.metrics.netWpm,
      s.metrics.cpm,
      Math.round(s.metrics.accuracy * 100),
      s.metrics.errorCount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `typing_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear session history?')) {
      StorageAdapter.clearHistory();
      loadData();
    }
  };

  // Prepare chart data chronologically
  const chartData = history
    .slice()
    .reverse()
    .map((s, idx) => ({
      index: idx + 1,
      date: new Date(s.startedAt).toLocaleDateString(),
      wpm: s.metrics.netWpm,
      cpm: s.metrics.cpm,
      accuracy: Math.round(s.metrics.accuracy * 100),
    }));

  return (
    <div className="w-full flex flex-col gap-6 max-w-6xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
              {settings.language === 'bn' ? 'টাইপিং এনালাইটিক্স ও ইতিহাস' : 'Analytics & History'}
            </h2>
            <p className="text-xs text-slate-400 font-bangla pt-1">
              {settings.language === 'bn'
                ? 'টাইপিং গতির উন্নতি পর্যবেক্ষণ করুন, দুর্বল কী চিহ্নিত করুন এবং ব্যাকআপ ডাউনলোড করুন।'
                : 'Track speed trends, monitor weak key heatmaps, and export performance metrics.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
            title="Clear History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>{settings.language === 'bn' ? 'গতি ও উন্নতির সময়রেখা (Net WPM over Time)' : 'Speed Improvement Trend'}</span>
          </h3>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="index" stroke="#94a3b8" fontSize={11} label={{ value: 'Sessions', position: 'insideBottom', offset: -2 }} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }} />
                <Area type="monotone" dataKey="wpm" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#chartWpm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Weak Keys Heatmap Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{settings.language === 'bn' ? 'ঐতিহাসিক দুর্বল অক্ষরসমূহ (Weak Key Matrix)' : 'Historical Weak Key Heatmap'}</span>
        </h3>
        {weakChars.length > 0 ? (
          <div className="flex flex-wrap gap-3 pt-2">
            {weakChars.map((item) => (
              <div
                key={item.char}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl flex items-center gap-3 font-bangla"
              >
                <span className="text-xl font-bold text-white">{item.char}</span>
                <span className="text-xs text-red-400 font-mono font-bold bg-red-950 px-2 py-0.5 rounded-md">
                  {item.errorCount} errors
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-bangla pt-1">
            {settings.language === 'bn'
              ? 'এখনো পর্যাপ্ত সেশন ডেটা নেই। অনুশীলন শুরু করলে দুর্বল অক্ষরগুলো অটোমেটিক চিহ্নিত হবে।'
              : 'No historical error data logged yet.'}
          </p>
        )}
      </div>

      {/* Session History Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>{settings.language === 'bn' ? 'সাম্প্রতিক সেশন ইতিহাস' : 'Recent Session History'}</span>
        </h3>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Layout</th>
                  <th className="p-3">WPM</th>
                  <th className="p-3">CPM</th>
                  <th className="p-3">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((s) => (
                  <tr key={s.sessionId} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 text-slate-300 font-mono text-[11px]">
                      {new Date(s.startedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 uppercase text-[10px] font-bold text-indigo-400">{s.moduleType}</td>
                    <td className="p-3 text-slate-200 font-bangla">{s.contentTitle}</td>
                    <td className="p-3 uppercase text-slate-400 font-mono text-[11px]">{s.layoutUsed}</td>
                    <td className="p-3 font-bold text-indigo-400">{s.metrics.netWpm}</td>
                    <td className="p-3 font-bold text-emerald-400">{s.metrics.cpm}</td>
                    <td className="p-3 font-bold text-amber-400">{Math.round(s.metrics.accuracy * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-bangla">
            {settings.language === 'bn' ? 'কোনো ইতিহাস সংরক্ষিত নেই।' : 'No session history recorded.'}
          </p>
        )}
      </div>
    </div>
  );
};
