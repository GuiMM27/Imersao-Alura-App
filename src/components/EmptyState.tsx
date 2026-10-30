import React from 'react';
import { Compass, Plus, Sparkles, BookOpenCheck } from 'lucide-react';

interface EmptyStateProps {
  onOpenCreateModal: () => void;
  onLoadSamples: () => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenCreateModal,
  onLoadSamples,
  isFiltered = false,
  onClearFilters,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 bg-stone-100 text-stone-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Compass className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h3 className="text-lg font-semibold text-stone-800 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-stone-500 mb-5">
          Não encontramos nenhum objetivo correspondente aos filtros selecionados. Tente buscar por outros termos ou limpar a filtragem.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium transition cursor-pointer"
          >
            Limpar filtros de busca
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-stone-50 to-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-xs">
      {/* Decorative Icon */}
      <div className="relative w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs">
        <BookOpenCheck className="w-10 h-10 text-indigo-600 stroke-[1.8]" />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center text-xs font-bold shadow-xs">
          ✨
        </span>
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">
        Sua jornada de estudos começa aqui!
      </h3>
      <p className="text-stone-600 text-sm leading-relaxed max-w-md mx-auto mb-8">
        Você ainda não tem objetivos de estudo cadastrados. Que tal definir sua primeira meta de aprendizado? Pode ser a leitura de um artigo, um exercício prático ou um capítulo de livro.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-indigo-200 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Cadastrar primeiro objetivo
        </button>

        <button
          type="button"
          onClick={onLoadSamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-stone-50 active:scale-[0.98] text-stone-700 border border-stone-300 text-sm font-medium transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Ver exemplos prontos
        </button>
      </div>

      <p className="text-xs text-stone-400 mt-6">
        💡 Seus dados ficam salvos automaticamente no seu navegador.
      </p>
    </div>
  );
};
