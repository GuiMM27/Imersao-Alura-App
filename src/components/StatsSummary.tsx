import React from 'react';
import { Target, Clock, CheckCircle2, CircleDot } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface StatsSummaryProps {
  goals: StudyGoal[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ goals }) => {
  const total = goals.length;
  const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;

  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section aria-label="Estatísticas de objetivos" className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Visão Geral do Seu Progresso
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Acompanhe o ritmo dos seus aprendizados diários
          </p>
        </div>

        {/* Counter highlight */}
        <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
          <span className="text-xs font-medium text-stone-600">Total de Objetivos:</span>
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
            {total} {total === 1 ? 'meta' : 'metas'}
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-3 my-4">
        {/* Não Iniciados */}
        <div className="bg-stone-50/70 border border-stone-200/70 rounded-xl p-3 flex flex-col items-start transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-1">
            <CircleDot className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium">Não iniciados</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-stone-800">{naoIniciados}</span>
        </div>

        {/* Em Andamento */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex flex-col items-start transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-indigo-700 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium">Em andamento</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-indigo-700">{emAndamento}</span>
        </div>

        {/* Concluídos */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex flex-col items-start transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">Concluídos</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-emerald-700">{concluidos}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
          <span className="font-medium">Taxa de Conclusão</span>
          <span className="font-semibold text-stone-900">{percentConcluido}%</span>
        </div>
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentConcluido}%` }}
          />
        </div>
      </div>
    </section>
  );
};
