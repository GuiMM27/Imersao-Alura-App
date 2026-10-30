import { GoalStatus } from '../types/goal';

/**
 * Formats a YYYY-MM-DD date into Brazilian format DD/MM/AAAA
 */
export function formatDateBR(dateString: string): string {
  if (!dateString) return 'Sem prazo';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
}

/**
 * Returns human-readable relative deadline info with status badge context
 */
export function getDeadlineStatus(deadlineStr: string, status: GoalStatus): {
  label: string;
  isUrgent: boolean;
  isOverdue: boolean;
  colorClass: string;
} {
  if (status === 'concluido') {
    return {
      label: 'Concluído',
      isUrgent: false,
      isOverdue: false,
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }

  if (!deadlineStr) {
    return {
      label: 'Sem prazo',
      isUrgent: false,
      isOverdue: false,
      colorClass: 'text-slate-600 bg-slate-50 border-slate-200',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = deadlineStr.split('-');
  const deadline = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysLate = Math.abs(diffDays);
    return {
      label: daysLate === 1 ? 'Atrasado (ontem)' : `Atrasado há ${daysLate} dias`,
      isUrgent: true,
      isOverdue: true,
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Vence hoje!',
      isUrgent: true,
      isOverdue: false,
      colorClass: 'text-amber-800 bg-amber-50 border-amber-300 font-medium',
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Vence amanhã',
      isUrgent: true,
      isOverdue: false,
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  }

  if (diffDays <= 3) {
    return {
      label: `Faltam ${diffDays} dias`,
      isUrgent: false,
      isOverdue: false,
      colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
    };
  }

  return {
    label: `Prazo: ${diffDays} dias`,
    isUrgent: false,
    isOverdue: false,
    colorClass: 'text-slate-600 bg-slate-50 border-slate-200',
  };
}

export const STATUS_CONFIG: Record<
  GoalStatus,
  { label: string; badgeClass: string; dotClass: string; description: string }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    description: 'Ainda aguardando para começar',
  },
  em_andamento: {
    label: 'Em andamento',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500 animate-pulse',
    description: 'Estudo em progresso no momento',
  },
  concluido: {
    label: 'Concluído',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    description: 'Meta alcançada com sucesso',
  },
};
