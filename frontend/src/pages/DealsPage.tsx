import React, { useState, useEffect } from 'react';
import DealList from '../components/DealList';
import DealForm from '../components/DealForm';
import { dealsApi, contactsApi } from '../services/api';
import type { Deal, DealCreate, DealUpdate, Contact } from '../types';

const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [dealsData, contactsData] = await Promise.all([
        dealsApi.getAll(),
        contactsApi.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load deals');
      console.error('Error loading deals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDeal = async (newDeal: DealCreate | DealUpdate) => {
    try {
      const created = await dealsApi.create(newDeal as DealCreate);
      setDeals([...deals, created]);
      setIsAdding(false);
    } catch (err) {
      console.error('Error creating deal:', err);
      alert('Failed to create deal');
    }
  };

  const handleEditDeal = async (updatedDeal: DealCreate | DealUpdate) => {
    if (!editingDeal) return;
    
    try {
      const updated = await dealsApi.update(editingDeal.id, updatedDeal as DealUpdate);
      setDeals(deals.map(d => d.id === editingDeal.id ? updated : d));
      setEditingDeal(null);
    } catch (err) {
      console.error('Error updating deal:', err);
      alert('Failed to update deal');
    }
  };

  const handleDeleteDeal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) {
      return;
    }
    
    try {
      await dealsApi.delete(id);
      setDeals(deals.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting deal:', err);
      alert('Failed to delete deal');
    }
  };

  const startEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setIsAdding(false);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={loadData}
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
        {!isAdding && !editingDeal && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Deal
          </button>
        )}
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
      ) : (
        <DealList
          deals={deals}
          contacts={contacts}
          onEdit={startEdit}
          onDelete={handleDeleteDeal}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default DealsPage;
