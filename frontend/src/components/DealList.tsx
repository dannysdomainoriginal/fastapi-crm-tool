import React from 'react';
import type { Deal, Contact, DealStage } from '../types';

interface DealListProps {
  deals: Deal[];
  contacts: Contact[];
  onEdit: (deal: Deal) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const EditIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const getStageColor = (stage: DealStage): string => {
  const colors: Record<DealStage, string> = {
    'New': 'bg-gray-100 text-gray-800',
    'Qualified': 'bg-blue-100 text-blue-800',
    'Proposal': 'bg-yellow-100 text-yellow-800',
    'Negotiation': 'bg-orange-100 text-orange-800',
    'Won': 'bg-green-100 text-green-800',
    'Lost': 'bg-red-100 text-red-800',
  };
  return colors[stage] || 'bg-gray-100 text-gray-800';
};

const DealList: React.FC<DealListProps> = ({ deals, contacts, onEdit, onDelete, isLoading = false }) => {
  const getContactName = (contactId: number | null): string => {
    if (!contactId) return 'N/A';
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500">Loading deals...</p>
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500">No deals found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{deal.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    ${deal.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                    {deal.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getContactName(deal.contact_id)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(deal)}
                      className="text-blue-600 hover:text-blue-900 transition"
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => onDelete(deal.id)}
                      className="text-red-600 hover:text-red-900 transition"
                      title="Delete"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealList;
