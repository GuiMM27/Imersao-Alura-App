/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { GoalFilterBar } from './components/GoalFilterBar';
import { GoalCard } from './components/GoalCard';
import { EmptyState } from './components/EmptyState';
import { GoalFormModal } from './components/GoalFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { storageService } from './services/storageService';
import { StudyGoal, GoalFormData, GoalFilter, GoalSort, GoalStatus } from './types/goal';
import { Check, Info } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);

  // Delete confirmation modal state
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Filter & Search states
  const [filter, setFilter] = useState<GoalFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<GoalSort>('deadline-asc');

  // Friendly toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. Initial load from localStorage
  useEffect(() => {
    const savedGoals = storageService.getGoals();
    setGoals(savedGoals);
    setIsLoaded(true);
  }, []);

  // Handlers for CRUD operations
  const handleCreateOrUpdateGoal = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals((prev) =>
          prev.map((g) => (g.id === editingGoal.id ? updated : g))
        );
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = storageService.createGoal(formData);
      setGoals((prev) => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
    setEditingGoal(null);
  };

  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  const handleRequestDelete = (goal: StudyGoal) => {
    setGoalToDelete(goal);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      storageService.deleteGoal(goalToDelete.id);
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
      showToast('Objetivo excluído.');
    }
    setIsConfirmModalOpen(false);
    setGoalToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setGoalToDelete(null);
  };

  const handleStatusChange = (goalId: string, newStatus: GoalStatus) => {
    const target = goals.find((g) => g.id === goalId);
    if (!target) return;

    const updated = storageService.updateGoal(goalId, {
      title: target.title,
      description: target.description,
      deadline: target.deadline,
      status: newStatus,
    });

    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
      if (newStatus === 'concluido') {
        showToast('Parabéns! Mais um objetivo concluído 🎉');
      } else {
        showToast('Status atualizado.');
      }
    }
  };

  const handleLoadSamples = () => {
    const samples = storageService.getSampleGoals();
    storageService.saveGoals(samples);
    setGoals(samples);
    showToast('Metas de exemplo carregadas com sucesso!');
  };

  // Filter and sort calculations
  const filteredGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Status filter
        if (filter !== 'todos' && goal.status !== filter) {
          return false;
        }
        // Search query filter (title or description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = goal.title.toLowerCase().includes(q);
          const matchDesc = goal.description.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'deadline-asc': {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return a.deadline.localeCompare(b.deadline);
          }
          case 'deadline-desc': {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return b.deadline.localeCompare(a.deadline);
          }
          case 'created-desc': {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          case 'title-asc': {
            return a.title.localeCompare(b.title, 'pt-BR');
          }
          default:
            return 0;
        }
      });
  }, [goals, filter, searchQuery, sortBy]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      todos: goals.length,
      nao_iniciado: goals.filter((g) => g.status === 'nao_iniciado').length,
      em_andamento: goals.filter((g) => g.status === 'em_andamento').length,
      concluido: goals.filter((g) => g.status === 'concluido').length,
    };
  }, [goals]);

  // Don't render until loaded to avoid flash of empty
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-stone-100/60 flex items-center justify-center text-stone-500 text-sm">
        Carregando StudyFlow...
      </div>
    );
  }

  const hasAnyGoals = goals.length > 0;
  const isSearchOrFilterActive = filter !== 'todos' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-800 antialiased font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700/80 text-xs sm:text-sm animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header onOpenCreateModal={handleOpenCreateModal} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome motivational micro-header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Meus Objetivos de Estudo
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Transforme grandes matérias em pequenos passos possíveis de realizar.
            </p>
          </div>
          <div className="text-xs text-stone-500 flex items-center gap-1.5 self-start sm:self-auto bg-stone-50/80 px-2.5 py-1 rounded-lg border border-stone-200/60">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dados salvos no seu navegador</span>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsSummary goals={goals} />

        {/* If user has goals, show filter bar & grid */}
        {hasAnyGoals ? (
          <>
            <GoalFilterBar
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={counts}
            />

            {filteredGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleOpenEditModal}
                    onRequestDelete={handleRequestDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                onOpenCreateModal={handleOpenCreateModal}
                onLoadSamples={handleLoadSamples}
                isFiltered={true}
                onClearFilters={() => {
                  setFilter('todos');
                  setSearchQuery('');
                }}
              />
            )}
          </>
        ) : (
          /* Empty State when no goals exist at all */
          <EmptyState
            onOpenCreateModal={handleOpenCreateModal}
            onLoadSamples={handleLoadSamples}
            isFiltered={false}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/50 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudyFlow • Organização de estudos simples e intuitiva</span>
          <span>Focado no aprendizado contínuo</span>
        </div>
      </footer>

      {/* Goal Form Modal (Create or Edit) */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleCreateOrUpdateGoal}
        editingGoal={editingGoal}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        goal={goalToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
