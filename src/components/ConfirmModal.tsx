import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface ConfirmModalProps {
  isOpen: boolean;
  goal: StudyGoal | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  goal,
  onConfirm,
  onCancel,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !goal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-stone-200 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 id="confirm-modal-title" className="text-lg font-bold text-stone-900">
                Confirmar Exclusão
              </h3>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Fechar"
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-stone-600 mt-2">
              Tem certeza de que deseja excluir o objetivo:
            </p>

            <div className="my-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <p className="text-sm font-semibold text-stone-800 line-clamp-2">
                "{goal.title}"
              </p>
            </div>

            <p className="text-xs text-rose-600">
              Esta ação removerá este objetivo permanentemente do seu dispositivo.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 active:bg-stone-200 text-sm font-medium transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Sim, excluir objetivo
          </button>
        </div>
      </div>
    </div>
  );
};
