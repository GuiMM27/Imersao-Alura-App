import React from 'react';
import { BookOpen, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Welcoming Tagline */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">StudyFlow</h1>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Iniciante
              </span>
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Organize seus estudos passo a passo, no seu ritmo
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto flex items-center justify-end">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Novo Objetivo
          </button>
        </div>
      </div>
    </header>
  );
};
