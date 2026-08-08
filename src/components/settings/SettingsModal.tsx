import React from 'react';
import { X, Volume2, VolumeX, Keyboard, ShieldAlert, Sliders, Type, Clock } from 'lucide-react';
import { UserSettings } from '../../types';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative my-8 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-sans">
                {settings.language === 'bn' ? 'সেটিংস ও পছন্দসমূহ' : 'App Settings'}
              </h3>
              <p className="text-xs text-slate-400 font-bangla">
                {settings.language === 'bn' ? 'টাইপিং মোড, সাউন্ড ও কাস্টমাইজেশন' : 'Preferences & Customization'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-4 text-xs">
          
          {/* Sound & Audio Volume */}
          <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <div>
                <span className="font-semibold text-slate-200 block">
                  {settings.language === 'bn' ? 'কিবোর্ড সাউন্ড ইফেক্ট' : 'Key Sound Effects'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {settings.language === 'bn' ? 'টাইপ সাউন্ড ও এরর বিজার' : 'Keypress click & error buzzer'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                settings.soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Virtual Keyboard Visibility */}
          <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="font-semibold text-slate-200 block">
                  {settings.language === 'bn' ? 'অন-স্ক্রিন কিবোর্ড প্রদর্শন' : 'Virtual Keyboard'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {settings.language === 'bn' ? 'আঙ্গুলের অবস্থান নির্দেশিকা' : 'Show interactive layout guide'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ showVirtualKeyboard: !settings.showVirtualKeyboard })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                settings.showVirtualKeyboard
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.showVirtualKeyboard ? 'SHOW' : 'HIDE'}
            </button>
          </div>

          {/* Allow Backspace Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-semibold text-slate-200 block">
                  {settings.language === 'bn' ? 'ব্যাকস্পেস ব্যবহারের সুযোগ' : 'Allow Backspace'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {settings.language === 'bn' ? 'ভুল সংশোধন আনলক' : 'Enable key correction'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ backspaceAllowed: !settings.backspaceAllowed })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                settings.backspaceAllowed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}
            >
              {settings.backspaceAllowed ? 'ALLOWED' : 'LOCKED'}
            </button>
          </div>

          {/* Exam Strict Mode */}
          <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <div>
                <span className="font-semibold text-slate-200 block">
                  {settings.language === 'bn' ? 'পরীক্ষা স্ট্রিক্ট মোড' : 'Exam Strict Mode'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {settings.language === 'bn' ? 'ব্যাকস্পেস ও পজ লক' : 'Lock backspace & pause'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ 
                strictMode: !settings.strictMode,
                backspaceAllowed: settings.strictMode ? true : false,
              })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                settings.strictMode
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.strictMode ? 'STRICT' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            {settings.language === 'bn' ? 'সংরক্ষণ ও বন্ধ করুন' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
