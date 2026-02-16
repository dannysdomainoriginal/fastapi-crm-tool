import { useQuery, useMutation } from '@tanstack/react-query';
import { contactsApi } from '../../services/api';
import { queryClient } from '../../libraries/tanstack';
import type { Contact, ContactCreate, ContactUpdate } from '../../types';

export const useContactsQuery = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: contactsApi.getAll,
  });
};

export const useCreateContactMutation = () => {
  return useMutation({
    mutationFn: (newContact: ContactCreate) => contactsApi.create(newContact),
    onMutate: async (newContact: ContactCreate) => {
      await queryClient.cancelQueries({ queryKey: ['contacts'] });
      const previousContacts = queryClient.getQueryData<Contact[]>(['contacts']);
      if (previousContacts) {
        queryClient.setQueryData(['contacts'], [
          ...previousContacts,
          { ...newContact, id: Math.random() } as Contact // Temporary ID for optimistic UI
        ]);
      }
      return { previousContacts };
    },
    onError: (_err, _newContact, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(['contacts'], context.previousContacts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useUpdateContactMutation = () => {
  return useMutation({
    mutationFn: ({ id, contact }: { id: number; contact: ContactUpdate }) => 
      contactsApi.update(id, contact),
    onMutate: async ({ id, contact }: { id: number; contact: ContactUpdate }) => {
      await queryClient.cancelQueries({ queryKey: ['contacts'] });
      const previousContacts = queryClient.getQueryData<Contact[]>(['contacts']);
      if (previousContacts) {
        queryClient.setQueryData(['contacts'], previousContacts.map(c => 
          c.id === id ? { ...c, ...contact } : c
        ));
      }
      return { previousContacts };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(['contacts'], context.previousContacts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useDeleteContactMutation = () => {
  return useMutation({
    mutationFn: (id: number) => contactsApi.delete(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['contacts'] });
      const previousContacts = queryClient.getQueryData<Contact[]>(['contacts']);
      if (previousContacts) {
        queryClient.setQueryData(['contacts'], previousContacts.filter(c => c.id !== id));
      }
      return { previousContacts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(['contacts'], context.previousContacts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
