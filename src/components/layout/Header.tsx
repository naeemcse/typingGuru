import React from 'react';
import {
  Keyboard,
  BookOpen,
  Target,
  Award,
  BarChart3,
  Settings as SettingsIcon,
  Globe,
  Zap,
  Flame,
  Info
} from 'lucide-react';
import { AppMode, Language, BanglaLayout, UserSettings } from '../../types';

interface HeaderProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSettings: () => void;
  bestWpm: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onModeChange,
  settings,
  onUpdateSettings,
  onOpenSettings,
  bestWpm,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300 font-sans">
                TypingGuru
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                BN/EN
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bangla hidden sm:block">
              {settings.language === 'bn' ? 'বাংলা ও ইংরেজি টাইপিং অ্যাসেসমেন্ট' : 'Bangla & English Assessment'}
            </p>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => onModeChange('tutorial')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeMode === 'tutorial'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{settings.language === 'bn' ? 'টিউটোরিয়াল' : 'Tutorial'}</span>
          </button>

          <button
            onClick={() => onModeChange('practice')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeMode === 'practice'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{settings.language === 'bn' ? 'অনুশীলন' : 'Practice'}</span>
          </button>

          <button
            onClick={() => onModeChange('exam')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeMode === 'exam'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{settings.language === 'bn' ? 'পরীক্ষা (Exam)' : 'Exam'}</span>
          </button>

          <button
            onClick={() => onModeChange('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeMode === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{settings.language === 'bn' ? 'এনালাইটিক্স' : 'Analytics'}</span>
          </button>

          <button
            onClick={() => onModeChange('about')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeMode === 'about'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>{settings.language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
          </button>
        </nav>

        {/* Controls: Language, Bangla Layout, Best Score, Settings */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Personal Best WPM Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>PB: {bestWpm} WPM</span>
          </div>

          {/* Language Switcher Toggle */}
          <button
            onClick={() => onUpdateSettings({ language: settings.language === 'bn' ? 'en' : 'bn' })}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{settings.language === 'bn' ? 'বাংলা' : 'English'}</span>
          </button>

          {/* Bangla Layout Dropdown (only visible when Bangla language is selected) */}
          {settings.language === 'bn' && (
            <select
              value={settings.banglaLayout}
              onChange={(e) => onUpdateSettings({ banglaLayout: e.target.value as BanglaLayout })}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="bijoy">বিজয় (Bijoy)</option>
              <option value="national">জাতীয় (National)</option>
              <option value="avro">অভ্র (Avro Phonetic)</option>
            </select>
          )}

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 py-2 px-2 bg-slate-950/90">
        <button
          onClick={() => onModeChange('tutorial')}
          className={`px-3 py-1 rounded-lg text-xs font-medium ${activeMode === 'tutorial' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
        >
          {settings.language === 'bn' ? 'টিউটোরিয়াল' : 'Tutorial'}
        </button>
        <button
          onClick={() => onModeChange('practice')}
          className={`px-3 py-1 rounded-lg text-xs font-medium ${activeMode === 'practice' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
        >
          {settings.language === 'bn' ? 'অনুশীলন' : 'Practice'}
        </button>
        <button
          onClick={() => onModeChange('exam')}
          className={`px-3 py-1 rounded-lg text-xs font-medium ${activeMode === 'exam' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
        >
          {settings.language === 'bn' ? 'পরীক্ষা' : 'Exam'}
        </button>
        <button
          onClick={() => onModeChange('analytics')}
          className={`px-3 py-1 rounded-lg text-xs font-medium ${activeMode === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
        >
          {settings.language === 'bn' ? 'এনালাইটিক্স' : 'Analytics'}
        </button>
        <button
          onClick={() => onModeChange('about')}
          className={`px-3 py-1 rounded-lg text-xs font-medium ${activeMode === 'about' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
        >
          {settings.language === 'bn' ? 'সম্পর্কে' : 'About'}
        </button>
      </div>
    </header>
  );
};
