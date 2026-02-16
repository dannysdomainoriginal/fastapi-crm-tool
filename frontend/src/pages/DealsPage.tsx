import React, { useState } from 'react';
import DealList from '../components/DealList';
import DealForm from '../components/DealForm';
import DealsKanban from '../components/DealsKanban';
import { useContactsQuery } from '../hooks/api/useContacts';
import { 
  useDealsQuery, 
  useCreateDealMutation, 
  useUpdateDealMutation, 
  useDeleteDealMutation 
} from '../hooks/api/useDeals';
import type { Deal, DealCreate, DealUpdate } from '../types';

const DealsPage: React.FC = () => {
  const { data: deals = [], isLoading: isDealsLoading, error: dealsError, refetch: refetchDeals } = useDealsQuery();
  const { data: contacts = [], isLoading: isContactsLoading } = useContactsQuery();
  
  const createMutation = useCreateDealMutation();
  const updateMutation = useUpdateDealMutation();
  const deleteMutation = useDeleteDealMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [view, setView] = useState<'list' | 'kanban'>('kanban');

  const handleAddDeal = async (newDeal: DealCreate | DealUpdate) => {
    try {
      await createMutation.mutateAsync(newDeal as DealCreate);
      setIsAdding(false);
    } catch (err) {
      alert('Failed to create deal');
    }
  };

  const handleEditDeal = async (updatedDeal: DealCreate | DealUpdate) => {
    if (!editingDeal) return;
    try {
      await updateMutation.mutateAsync({ id: editingDeal.id, deal: updatedDeal as DealUpdate });
      setEditingDeal(null);
    } catch (err) {
      alert('Failed to update deal');
    }
  };

  const handleDeleteDeal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      alert('Failed to delete deal');
    }
  };

  const startEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setIsAdding(false);
  };

  if (dealsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load deals
          <button 
            onClick={() => refetchDeals()}
            className="ml-4 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Deals</h1>
        <div className="flex items-center gap-3">
          {!isAdding && !editingDeal && (
            <div className="flex bg-gray-200 rounded-md p-1">
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'kanban'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
          )}
          {!isAdding && !editingDeal && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
            >
              Add Deal
            </button>
          )}
        </div>
      </div>

      {(isAdding || editingDeal) ? (
        <div className="mb-6">
          <DealForm
            initialData={editingDeal}
            onSubmit={editingDeal ? handleEditDeal : handleAddDeal}
            onCancel={() => {
              setIsAdding(false);
              setEditingDeal(null);
            }}
            contacts={contacts}
          />
        </div>
      ) : view === 'kanban' ? (
        <DealsKanban
          deals={deals}
          contacts={contacts}
          onEdit={startEdit}
        />
      ) : (
        <DealList
          deals={deals}
          contacts={contacts}
          onEdit={startEdit}
          onDelete={handleDeleteDeal}
          isLoading={isDealsLoading}
        />
      )}
    </div>
  );
};

export default DealsPage;

