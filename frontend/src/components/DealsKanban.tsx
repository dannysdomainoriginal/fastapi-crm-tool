import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Deal, DealStage, Contact } from '../types';
import { DEAL_STAGES } from '../types';
import { useUpdateDealMutation } from '../hooks/api/useDeals';

interface DealsKanbanProps {
  deals: Deal[];
  contacts: Contact[];
  onEdit: (deal: Deal) => void;
}

interface DraggableDealCardProps {
  deal: Deal;
  contact: Contact | undefined;
  onEdit: (deal: Deal) => void;
}

const DraggableDealCard: React.FC<DraggableDealCardProps> = ({ deal, contact, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-sm">{deal.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(deal);
          }}
          className="text-gray-400 hover:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold text-green-600">${deal.value.toLocaleString()}</p>
        {contact && (
          <p className="text-xs text-gray-500">
            <span className="font-medium">{contact.name}</span>
            {contact.company && ` • ${contact.company}`}
          </p>
        )}
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  stage: DealStage;
  deals: Deal[];
  contacts: Contact[];
  onEdit: (deal: Deal) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, deals, contacts, onEdit }) => {
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  const stageColors: Record<DealStage, string> = {
    Lead: 'bg-gray-100 border-gray-300',
    Qualified: 'bg-blue-50 border-blue-300',
    Proposal: 'bg-yellow-50 border-yellow-300',
    Negotiation: 'bg-orange-50 border-orange-300',
    Closed: 'bg-green-50 border-green-300',
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div ref={setNodeRef} className={`flex-shrink-0 w-80 ${stageColors[stage]} border-2 rounded-lg p-4`}>
      <div className="mb-4">
        <h2 className="font-bold text-gray-800 text-lg">{stage}</h2>
        <p className="text-sm text-gray-600">
          {deals.length} {deals.length === 1 ? 'deal' : 'deals'} • ${totalValue.toLocaleString()}
        </p>
      </div>
      <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[400px]">
          {deals.map((deal) => {
            const contact = contacts.find(c => c.id === deal.contact_id);
            return <DraggableDealCard key={deal.id} deal={deal} contact={contact} onEdit={onEdit} />;
          })}
        </div>
      </SortableContext>
    </div>
  );
};

const DealsKanban: React.FC<DealsKanbanProps> = ({ deals, contacts, onEdit }) => {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const updateMutation = useUpdateDealMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find(d => d.id === event.active.id);
    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as number;
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    // Determine the new stage
    let newStage: DealStage | null = null;

    // Check if dropped over a stage column
    if (DEAL_STAGES.includes(over.id as DealStage)) {
      newStage = over.id as DealStage;
    } else {
      // Dropped over another deal - find that deal's stage
      const targetDeal = deals.find(d => d.id === over.id);
      if (targetDeal) {
        newStage = targetDeal.stage;
      }
    }

    // Update if stage changed
    if (newStage && newStage !== deal.stage) {
      try {
        await updateMutation.mutateAsync({ id: dealId, deal: { stage: newStage } });
      } catch (error) {
        alert('Failed to update deal stage');
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {DEAL_STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          return (
            <KanbanColumn 
              key={stage}
              stage={stage} 
              deals={stageDeals} 
              contacts={contacts} 
              onEdit={onEdit} 
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeDeal ? (
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500 opacity-90 w-80 rotate-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">{activeDeal.title}</h3>
            <p className="text-lg font-bold text-green-600">${activeDeal.value.toLocaleString()}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DealsKanban;

