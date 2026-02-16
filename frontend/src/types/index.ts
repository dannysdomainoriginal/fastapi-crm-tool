// Contact Types
export interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
}

export interface ContactCreate {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
}

export interface ContactUpdate {
  name?: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
}

// Deal Types
export interface Deal {
  id: number;
  title: string;
  value: number;
  stage: DealStage;
  contact_id: number | null;
}

export interface DealCreate {
  title: string;
  value: number;
  stage?: DealStage;
  contact_id?: number | null;
}

export interface DealUpdate {
  title?: string;
  value?: number;
  stage?: DealStage;
  contact_id?: number | null;
}

export type DealStage = 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export const DEAL_STAGES: DealStage[] = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

// Task Types
export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  related_to: string | null;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
  related_to?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  status?: TaskStatus;
  related_to?: string | null;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export const TASK_STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
