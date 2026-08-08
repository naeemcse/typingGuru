import React from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronRight, Sparkles, Lock } from 'lucide-react';
import { CharacterGroup } from '../../types';

interface LessonSidebarProps {
  groups: CharacterGroup[];
  selectedGroupIdx: number;
  expandedGroupIdx: number | null;
  completedLessons: Set<string>;
  onSelectGroup: (idx: number) => void;
  onToggleExpand: (idx: number) => void;
  onSelectItem: (groupIdx: number, itemIdx: number) => void;
  selectedItemIdx: number;
  onSelectMixed: (groupIdx: number) => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  groups,
  selectedGroupIdx,
  expandedGroupIdx,
  completedLessons,
  onSelectGroup,
  onToggleExpand,
  onSelectItem,
  selectedItemIdx,
  onSelectMixed,
}) => {
  return (
    <aside className="tutorial-sidebar flex flex-col gap-1.5 overflow-y-auto pr-1">
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 px-3 py-2 mb-1">
        <BookOpen className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-sans">
          পাঠ তালিকা
        </h3>
        <span className="ml-auto text-[10px] text-slate-500 font-mono">
          {groups.length} পাঠ
        </span>
      </div>

      {groups.map((group, gIdx) => {
        const isSelected = gIdx === selectedGroupIdx;
        const isExpanded = gIdx === expandedGroupIdx;
        const isCompleted = completedLessons.has(group.id);

        return (
          <div key={group.id} className="flex flex-col">
            {/* Lesson Card */}
            <button
              onClick={() => {
                onSelectGroup(gIdx);
                onToggleExpand(gIdx);
              }}
              className={`
                w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 group
                ${isSelected
                  ? 'bg-indigo-600/20 border border-indigo-500/40 shadow-md shadow-indigo-500/10'
                  : 'hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50'
                }
              `}
            >
              {/* Lesson Number Badge */}
              <div
                className={`
                  w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors
                  ${isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                    : isCompleted
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }
                `}
              >
                {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : gIdx + 1}
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate font-bangla transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                  {group.title}
                </p>
                <p className="text-[10px] text-slate-500 font-sans truncate">
                  {group.titleEn} · {group.items.length} অক্ষর
                </p>
              </div>

              {/* Expand Arrow */}
              <div className="shrink-0 text-slate-500">
                {isExpanded
                  ? <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                  : <ChevronRight className="w-3.5 h-3.5" />
                }
              </div>
            </button>

            {/* Expanded Sub-lessons */}
            <div
              className={`
                accordion-content overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              <div className="pl-9 pr-2 py-1.5 flex flex-col gap-0.5">
                {/* Individual Character Items */}
                {group.items.map((item, iIdx) => {
                  const isItemSelected = isSelected && iIdx === selectedItemIdx;
                  return (
                    <button
                      key={iIdx}
                      onClick={() => onSelectItem(gIdx, iIdx)}
                      className={`
                        w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all
                        ${isItemSelected
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                        }
                      `}
                    >
                      <span className="font-bangla font-bold text-sm w-6 text-center">{item.char}</span>
                      <span className="font-sans text-[10px] text-slate-500">{item.romanized}</span>
                    </button>
                  );
                })}

                {/* Mixed Practice Button */}
                <button
                  onClick={() => onSelectMixed(gIdx)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 mt-0.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-bangla font-semibold">মিশ্র অনুশীলন</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
