export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export type GoalFormData = {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
};

export type GoalFilter = 'todos' | GoalStatus;
export type GoalSort = 'deadline-asc' | 'deadline-desc' | 'created-desc' | 'title-asc';
