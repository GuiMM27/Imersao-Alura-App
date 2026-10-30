import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { GoalFilter, GoalSort } from '../types/goal';

interface GoalFilterBarProps {
  filter: GoalFilter;
  onFilterChange: (filter: GoalFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: GoalSort;
  onSortChange: (sort: GoalSort) => void;
  counts: {
    todos: number;
    nao_iniciado: number;
    em_andamento: number;
    concluido: number;
  };
}

export const GoalFilterBar: React.FC<GoalFilterBarProps> = ({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs mb-6 flex flex-col gap-4">
      {/* Top search & sort row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="w-4 h-4 text-stone-500 flex-shrink-0" />
          <label htmlFor="sort-select" className="text-xs text-stone-500 whitespace-nowrap sr-only">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as GoalSort)}
            className="w-full sm:w-auto px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="deadline-asc">Prazo: Mais próximo primeiro</option>
            <option value="deadline-desc">Prazo: Mais distante primeiro</option>
            <option value="created-desc">Data de criação: Mais recentes</option>
            <option value="title-asc">Título: Ordem alfabética (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs / Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
        <span className="text-stone-400 flex items-center gap-1 mr-1 text-[11px] uppercase tracking-wider font-semibold">
          <Filter className="w-3 h-3" />
          Filtrar:
        </span>

        <button
          type="button"
          onClick={() => onFilterChange('todos')}
          className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            filter === 'todos'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          <span>Todos</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filter === 'todos' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {counts.todos}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('nao_iniciado')}
          className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            filter === 'nao_iniciado'
              ? 'bg-stone-700 text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          <span>A Iniciar</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filter === 'nao_iniciado' ? 'bg-stone-600 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {counts.nao_iniciado}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('em_andamento')}
          className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            filter === 'em_andamento'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
          }`}
        >
          <span>Em andamento</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filter === 'em_andamento' ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            {counts.em_andamento}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange('concluido')}
          className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            filter === 'concluido'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
          }`}
        >
          <span>Concluídos</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filter === 'concluido' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {counts.concluido}
          </span>
        </button>
      </div>
    </div>
  );
};
