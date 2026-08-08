import React, { useState } from 'react';
import { PenLine, Play, RotateCcw, FileText, AlertCircle } from 'lucide-react';

interface CustomTextInputProps {
  onStartTyping: (text: string) => void;
  language: 'bn' | 'en';
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
  onStartTyping,
  language,
}) => {
  const [customText, setCustomText] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  const charCount = customText.length;
  const wordCount = customText.trim() ? customText.trim().split(/\s+/).length : 0;

  const handleStart = () => {
    if (customText.trim().length < 5) return;
    setIsEditing(false);
    onStartTyping(customText.trim());
  };

  const handleReset = () => {
    setCustomText('');
    setIsEditing(true);
  };

  if (!isEditing) {
    return (
      <div className="glass-card rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300 font-sans">
              {language === 'bn' ? 'কাস্টম টেক্সট লোড হয়েছে' : 'Custom Text Loaded'}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            {language === 'bn' ? 'পরিবর্তন' : 'Change'}
          </button>
        </div>
        <p className="text-xs text-slate-400 font-bangla line-clamp-2 leading-relaxed">
          {customText.slice(0, 150)}{customText.length > 150 ? '...' : ''}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center">
          <PenLine className="w-4.5 h-4.5 text-violet-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white font-bangla">
            {language === 'bn' ? 'নিজের টেক্সট লিখুন বা পেস্ট করুন' : 'Enter or paste your own text'}
          </h4>
          <p className="text-[10px] text-slate-500 font-sans">
            {language === 'bn' ? 'যেকোনো বাংলা বা ইংরেজি টেক্সট দিয়ে অনুশীলন করুন' : 'Practice with any Bangla or English text'}
          </p>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        placeholder={language === 'bn'
          ? 'এখানে আপনার টেক্সট লিখুন অথবা পেস্ট করুন...'
          : 'Type or paste your text here...'
        }
        rows={5}
        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 font-bangla placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all"
      />

      {/* Footer: Stats & Start Button */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span>{charCount} অক্ষর</span>
          <span className="w-px h-3 bg-slate-700" />
          <span>{wordCount} শব্দ</span>
        </div>

        <div className="flex items-center gap-2">
          {charCount > 0 && charCount < 5 && (
            <div className="flex items-center gap-1 text-[10px] text-amber-400">
              <AlertCircle className="w-3 h-3" />
              <span>কমপক্ষে ৫ অক্ষর</span>
            </div>
          )}
          <button
            onClick={handleStart}
            disabled={charCount < 5}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
              ${charCount >= 5
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            <Play className="w-3.5 h-3.5" />
            {language === 'bn' ? 'টাইপিং শুরু করুন' : 'Start Typing'}
          </button>
        </div>
      </div>
    </div>
  );
};
