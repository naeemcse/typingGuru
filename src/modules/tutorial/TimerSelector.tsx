import React from 'react';
import { Clock } from 'lucide-react';
import { TimerDuration } from '../../types';

interface TimerSelectorProps {
  selectedDuration: TimerDuration;
  onSelectDuration: (duration: TimerDuration) => void;
}

const TIMER_OPTIONS: { value: TimerDuration; label: string; labelBn: string }[] = [
  { value: 30, label: '30s', labelBn: '৩০ সে.' },
  { value: 60, label: '1 min', labelBn: '১ মি.' },
  { value: 120, label: '2 min', labelBn: '২ মি.' },
  { value: 300, label: '5 min', labelBn: '৫ মি.' },
];

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  selectedDuration,
  onSelectDuration,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Clock className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">সময়</span>
      <div className="flex items-center gap-1 bg-slate-900/60 rounded-xl p-0.5 border border-slate-800">
        {TIMER_OPTIONS.map((opt) => {
          const isActive = selectedDuration === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelectDuration(opt.value)}
              className={`
                px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 timer-pill-active'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <span className="font-sans">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
