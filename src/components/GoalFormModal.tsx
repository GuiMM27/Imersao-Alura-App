import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, FileText, CheckCircle2, Clock, CircleDot } from 'lucide-react';
import { StudyGoal, GoalFormData, GoalStatus } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GoalFormData) => void;
  editingGoal?: StudyGoal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGoal = null,
}) => {
  const isEditing = !!editingGoal;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');

  const [errors, setErrors] = useState<{
    title?: string;
    deadline?: string;
  }>({});

  // Reset or fill form when modal opens or editingGoal changes
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description);
      setDeadline(editingGoal.deadline);
      setStatus(editingGoal.status);
    } else {
      // Default initial date: today + 7 days
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const defaultDeadline = defaultDate.toISOString().split('T')[0];

      setTitle('');
      setDescription('');
      setDeadline(defaultDeadline);
      setStatus('nao_iniciado');
    }
    setErrors({});
  }, [editingGoal, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, selecione um prazo para sua meta.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-form-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 id="goal-form-modal-title" className="text-base font-bold text-stone-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEditing
                  ? 'Atualize as informações para manter seu planejamento em dia'
                  : 'Defina uma meta clara para focar e aprender melhor'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="goal-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Ex.: Aprender laços de repetição (for e while)"
                maxLength={100}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-stone-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              {errors.title ? (
                <span className="text-rose-600 font-medium">{errors.title}</span>
              ) : (
                <span className="text-stone-400">Dica: Seja específico e direto</span>
              )}
              <span className="text-stone-400">{title.length}/100</span>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              Descrição do que estudar
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Assistir a aula 3, fazer os exercícios de 1 a 10 e anotar as dúvidas para o fórum."
              maxLength={400}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-100 transition resize-none"
            />
            <div className="flex justify-end text-xs text-stone-400 mt-1">
              <span>{description.length}/400</span>
            </div>
          </div>

          {/* Prazo & Status em grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                Prazo Estimado <span className="text-rose-500">*</span>
              </label>
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 transition ${
                  errors.deadline
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-stone-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.deadline && (
                <span className="block mt-1 text-xs text-rose-600 font-medium">
                  {errors.deadline}
                </span>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Status Inicial
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setStatus('nao_iniciado')}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    status === 'nao_iniciado'
                      ? 'bg-white text-stone-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <CircleDot className="w-3.5 h-3.5 mb-0.5 text-stone-400" />
                  <span className="text-[11px] leading-tight">A Iniciar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('em_andamento')}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    status === 'em_andamento'
                      ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 mb-0.5 text-indigo-600" />
                  <span className="text-[11px] leading-tight">Estudando</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('concluido')}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    status === 'concluido'
                      ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mb-0.5 text-emerald-600" />
                  <span className="text-[11px] leading-tight">Concluído</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 active:bg-stone-200 text-sm font-medium transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg transition cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
