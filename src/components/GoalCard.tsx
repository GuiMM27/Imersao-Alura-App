import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react';
import { StudyGoal, GoalStatus } from '../types/goal';
import { formatDateBR, getDeadlineStatus, STATUS_CONFIG } from '../utils/formatters';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onRequestDelete: (goal: StudyGoal) => void;
  onStatusChange: (goalId: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onRequestDelete,
  onStatusChange,
}) => {
  const isCompleted = goal.status === 'concluido';
  const statusInfo = STATUS_CONFIG[goal.status];
  const deadlineInfo = getDeadlineStatus(goal.deadline, goal.status);

  return (
    <article
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
        isCompleted
          ? 'border-emerald-200/90 bg-gradient-to-b from-emerald-50/20 to-white'
          : deadlineInfo.isOverdue
          ? 'border-rose-200/80 bg-gradient-to-b from-rose-50/10 to-white'
          : 'border-stone-200/80 hover:border-indigo-300'
      }`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
            {statusInfo.label}
          </span>

          {/* Deadline Pill */}
          <div
            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border ${deadlineInfo.colorClass}`}
          >
            {deadlineInfo.isOverdue && <AlertCircle className="w-3 h-3 text-rose-500" />}
            {deadlineInfo.label}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-base font-bold leading-snug mb-2 transition-colors ${
            isCompleted
              ? 'text-stone-500 line-through decoration-emerald-500/60 decoration-2'
              : 'text-stone-900 group-hover:text-indigo-950'
          }`}
        >
          {goal.title}
        </h3>

        {/* Description */}
        {goal.description ? (
          <p
            className={`text-xs leading-relaxed mb-4 line-clamp-3 ${
              isCompleted ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="text-xs text-stone-400 italic mb-4">Sem descrição detalhada.</p>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3.5 border-t border-stone-100 mt-2 flex flex-col gap-3">
        {/* Deadline Date & Quick status selector */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Prazo: {formatDateBR(goal.deadline)}</span>
          </div>

          {/* Quick status dropdown for frictionless updates */}
          <div className="relative inline-block">
            <select
              aria-label="Alterar status do objetivo"
              value={goal.status}
              onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
              className="text-xs font-medium py-1 pl-2 pr-6 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="nao_iniciado">Não iniciado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Quick complete toggle button */}
          <button
            type="button"
            onClick={() =>
              onStatusChange(goal.id, isCompleted ? 'em_andamento' : 'concluido')
            }
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
              isCompleted
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isCompleted ? 'Desmarcar' : 'Concluir'}
          </button>

          <div className="flex items-center gap-1">
            {/* Edit button */}
            <button
              type="button"
              onClick={() => onEdit(goal)}
              title="Editar objetivo"
              aria-label={`Editar objetivo ${goal.title}`}
              className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition cursor-pointer font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar
            </button>

            {/* Delete button (will trigger ConfirmModal) */}
            <button
              type="button"
              onClick={() => onRequestDelete(goal)}
              title="Excluir objetivo"
              aria-label={`Excluir objetivo ${goal.title}`}
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
