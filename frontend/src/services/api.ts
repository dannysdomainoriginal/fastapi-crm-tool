import axios from 'axios';
import type { 
  Contact, 
  ContactCreate, 
  ContactUpdate,
  Deal,
  DealCreate,
  DealUpdate,
  Task,
  TaskCreate,
  TaskUpdate
} from '../types';

const API_URL = import.meta.env.DEV ? "http://localhost:8000/api" : "/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============= CONTACTS API =============

export const contactsApi = {
  getAll: async (): Promise<Contact[]> => {
    const response = await api.get<Contact[]>('/contacts/');
    return response.data;
  },

  getById: async (id: number): Promise<Contact> => {
    const response = await api.get<Contact>(`/contacts/${id}`);
    return response.data;
  },

  create: async (contact: ContactCreate): Promise<Contact> => {
    const response = await api.post<Contact>('/contacts/', contact);
    return response.data;
  },

  update: async (id: number, contact: ContactUpdate): Promise<Contact> => {
    const response = await api.patch<Contact>(`/contacts/${id}`, contact);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },
};

// ============= DEALS API =============

export const dealsApi = {
  getAll: async (): Promise<Deal[]> => {
    const response = await api.get<Deal[]>('/deals/');
    return response.data;
  },

  getById: async (id: number): Promise<Deal> => {
    const response = await api.get<Deal>(`/deals/${id}`);
    return response.data;
  },

  create: async (deal: DealCreate): Promise<Deal> => {
    const response = await api.post<Deal>('/deals/', deal);
    return response.data;
  },

  update: async (id: number, deal: DealUpdate): Promise<Deal> => {
    const response = await api.patch<Deal>(`/deals/${id}`, deal);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/deals/${id}`);
  },
};

// ============= TASKS API =============

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/');
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  create: async (task: TaskCreate): Promise<Task> => {
    const response = await api.post<Task>('/tasks/', task);
    return response.data;
  },

  update: async (id: number, task: TaskUpdate): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;
