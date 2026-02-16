import { useQuery, useMutation } from '@tanstack/react-query';
import { tasksApi } from '../../services/api';
import { queryClient } from '../../libraries/tanstack';
import type { Task, TaskCreate, TaskUpdate } from '../../types';

export const useTasksQuery = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
  });
};

export const useCreateTaskMutation = () => {
  return useMutation({
    mutationFn: (newTask: TaskCreate) => tasksApi.create(newTask),
    onMutate: async (newTask: TaskCreate) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      if (previousTasks) {
        queryClient.setQueryData(['tasks'], [
          ...previousTasks,
          { ...newTask, id: Math.random(), status: newTask.status || 'Pending' } as Task
        ]);
      }
      return { previousTasks };
    },
    onError: (_err: unknown, _newTask: TaskCreate, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTaskMutation = () => {
  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: TaskUpdate }) => 
      tasksApi.update(id, task),
    onMutate: async ({ id, task }: { id: number; task: TaskUpdate }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      if (previousTasks) {
        queryClient.setQueryData(['tasks'], previousTasks.map(t => 
          t.id === id ? { ...t, ...task } : t
        ));
      }
      return { previousTasks };
    },
    onError: (_err: unknown, _variables: { id: number; task: TaskUpdate }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  return useMutation({
    mutationFn: (id: number) => tasksApi.delete(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      if (previousTasks) {
        queryClient.setQueryData(['tasks'], previousTasks.filter(t => t.id !== id));
      }
      return { previousTasks };
    },
    onError: (_err: unknown, _id: number, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
