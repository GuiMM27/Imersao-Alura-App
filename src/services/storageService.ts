import { StudyGoal, GoalFormData } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

/**
 * Service to handle localStorage persistence for StudyFlow goals.
 * Ensures data stays intact across page refreshes and browser sessions.
 */
export const storageService = {
  /**
   * Retrieves all goals from localStorage
   */
  getGoals(): StudyGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Saves the entire list of goals to localStorage
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Creates a new goal and persists it
   */
  createGoal(formData: GoalFormData): StudyGoal {
    const goals = this.getGoals();
    const newGoal: StudyGoal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Updates an existing goal by ID
   */
  updateGoal(id: string, formData: GoalFormData): StudyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const updatedGoal: StudyGoal = {
      ...goals[index],
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  },

  /**
   * Deletes a goal by ID
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) return false;
    this.saveGoals(filtered);
    return true;
  },

  /**
   * Provides initial sample goals for first-time onboarding if requested
   */
  getSampleGoals(): StudyGoal[] {
    const today = new Date();
    const inThreeDays = new Date(today);
    inThreeDays.setDate(today.getDate() + 3);

    const inSevenDays = new Date(today);
    inSevenDays.setDate(today.getDate() + 7);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return [
      {
        id: 'sample-1',
        title: 'Compreender Funções e Variáveis em JavaScript',
        description: 'Assistir às aulas do módulo 2 e praticar resolvendo 5 exercícios de lógica básica.',
        deadline: inThreeDays.toISOString().split('T')[0],
        status: 'em_andamento',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sample-2',
        title: 'Leitura do Capítulo 1 de Estrutura de Dados',
        description: 'Fazer fichamento sobre Arrays e Listas Encadeadas destacando diferenças de performance.',
        deadline: inSevenDays.toISOString().split('T')[0],
        status: 'nao_iniciado',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sample-3',
        title: 'Instalar e Configurar o Ambiente de Desenvolvimento',
        description: 'Instalar o VS Code, Git e configurar o terminal para os estudos.',
        deadline: yesterday.toISOString().split('T')[0],
        status: 'concluido',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },
};
