import { useQuery, useMutation } from '@tanstack/react-query';
import { dealsApi } from '../../services/api';
import { queryClient } from '../../libraries/tanstack';
import type { Deal, DealCreate, DealUpdate } from '../../types';

export const useDealsQuery = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: dealsApi.getAll,
  });
};

export const useCreateDealMutation = () => {
  return useMutation({
    mutationFn: (newDeal: DealCreate) => dealsApi.create(newDeal),
    onMutate: async (newDeal: DealCreate) => {
      await queryClient.cancelQueries({ queryKey: ['deals'] });
      const previousDeals = queryClient.getQueryData<Deal[]>(['deals']);
      if (previousDeals) {
        queryClient.setQueryData(['deals'], [
          ...previousDeals,
          { ...newDeal, id: Math.random(), stage: newDeal.stage || 'Lead' } as Deal
        ]);
      }
      return { previousDeals };
    },
    onError: (_err: unknown, _newDeal: DealCreate, context) => {
      if (context?.previousDeals) {
        queryClient.setQueryData(['deals'], context.previousDeals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};

export const useUpdateDealMutation = () => {
  return useMutation({
    mutationFn: ({ id, deal }: { id: number; deal: DealUpdate }) => 
      dealsApi.update(id, deal),
    onMutate: async ({ id, deal }: { id: number; deal: DealUpdate }) => {
      await queryClient.cancelQueries({ queryKey: ['deals'] });
      const previousDeals = queryClient.getQueryData<Deal[]>(['deals']);
      if (previousDeals) {
        queryClient.setQueryData(['deals'], previousDeals.map(d => 
          d.id === id ? { ...d, ...deal } : d
        ));
      }
      return { previousDeals };
    },
    onError: (_err: unknown, _variables: { id: number; deal: DealUpdate }, context) => {
      if (context?.previousDeals) {
        queryClient.setQueryData(['deals'], context.previousDeals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};

export const useDeleteDealMutation = () => {
  return useMutation({
    mutationFn: (id: number) => dealsApi.delete(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['deals'] });
      const previousDeals = queryClient.getQueryData<Deal[]>(['deals']);
      if (previousDeals) {
        queryClient.setQueryData(['deals'], previousDeals.filter(d => d.id !== id));
      }
      return { previousDeals };
    },
    onError: (_err: unknown, _id: number, context) => {
      if (context?.previousDeals) {
        queryClient.setQueryData(['deals'], context.previousDeals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};
