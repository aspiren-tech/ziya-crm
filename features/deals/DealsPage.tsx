import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, GripVertical, DollarSign, Edit, Eye, Trash2, Plus } from 'lucide-react';
import type { Deal, DealStage } from '../../types';
import { useDeals } from '../../contexts/DealsContext';
import { useUsers } from '../../contexts/UsersContext';
import { useUI } from '../../contexts/UIContext';
import { DEAL_STAGES } from '../../constants';
import EditDealModal from './components/EditDealModal';
import Button from '../../components/shared/ui/Button';

const DealCard: React.FC<{ deal: Deal; onSelectDeal: (deal: Deal) => void }> = ({ deal, onSelectDeal }) => {
  const { users } = useUsers();
  const { deleteDeal } = useDeals();
  const { openEditDealModal } = useUI();
  const [showActions, setShowActions] = useState(false);
  const owner = users[deal.ownerId];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('dealId', deal.id);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectDeal(deal);
    openEditDealModal();
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the deal "${deal.name}"?`)) {
      deleteDeal(deal.id);
    }
    setShowActions(false);
  };
  
  return (
    <div 
      draggable 
      onDragStart={handleDragStart}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing mb-3"
    >
      <div className="flex justify-between items-start">
        <span className="font-semibold text-sm text-gray-800">{deal.name}</span>
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showActions && (
            <div 
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1" role="menu">
                <Link
                  to={`/deals/${deal.id}`}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Link>
                <button
                  onClick={handleEditClick}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  role="menuitem"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500">{deal.accountName}</p>
      <p className="text-sm font-bold text-gray-700 my-2">
        ${deal.value.toLocaleString()}
      </p>
      <div className="flex justify-end items-center text-xs">
        {owner && <img src={owner.avatar} alt={owner.name} className="w-6 h-6 rounded-full" title={owner.name} />}
      </div>
    </div>
  );
};

const DealColumn: React.FC<{ stage: DealStage; deals: Deal[]; onSelectDeal: (deal: Deal) => void; onCreateDeal: (stage: DealStage) => void }> = ({ stage, deals, onSelectDeal, onCreateDeal }) => {
  const { updateDealStage } = useDeals();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      updateDealStage(dealId, stage);
    }
    setIsDragOver(false);
  };

  const totalValue = useMemo(() => deals.reduce((sum, deal) => sum + deal.value, 0), [deals]);

  return (
    <div 
      className={`w-72 bg-gray-50 rounded-lg p-1 flex-shrink-0 h-full flex flex-col transition-colors ${isDragOver ? 'bg-blue-100' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center p-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase flex items-center">
          <GripVertical size={16} className="text-gray-400 mr-1" />
          {stage} <span className="text-gray-400 ml-2">{deals.length}</span>
        </h2>
        <span className="text-sm font-bold text-gray-600">${totalValue.toLocaleString()}</span>
      </div>
      <div className="overflow-y-auto px-2 flex-1">
        {deals.map(deal => <DealCard key={deal.id} deal={deal} onSelectDeal={onSelectDeal} />)}
        <div className="mb-2">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            className="w-full"
            onClick={() => onCreateDeal(stage)}
          >
            Add Deal
          </Button>
        </div>
      </div>
    </div>
  );
};

const DealsPage: React.FC = () => {
    const { deals } = useDeals();
    const { users } = useUsers();
    const { isEditDealModalOpen, isCreateDealModalOpen, openCreateDealModal, closeCreateDealModal } = useUI();
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [newDealStage, setNewDealStage] = useState<DealStage | null>(null);

    const dealsByStage = useMemo(() => {
        const grouped: { [key in DealStage]?: Deal[] } = {};
        for (const deal of deals) {
            if (!grouped[deal.stage]) {
                grouped[deal.stage] = [];
            }
            grouped[deal.stage]!.push(deal);
        }
        return grouped;
    }, [deals]);
    
    // Function to handle deal selection for editing
    const handleSelectDeal = (deal: Deal) => {
      setSelectedDeal(deal);
    };
    
    // Function to handle creating a new deal
    const handleCreateDeal = (stage: DealStage) => {
      setNewDealStage(stage);
      openCreateDealModal();
    };

  return (
    <div className="space-y-6 flex flex-col h-full">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-2">
                  <DollarSign className="w-8 h-8" />
                  Deals Pipeline
              </h1>
              <p className="text-text-light mt-1">Track and manage your sales deals.</p>
            </div>
            <div>
              <Button
                variant="primary"
                size="md"
                icon={Plus}
                onClick={() => {
                  setNewDealStage('Prospecting'); // Default to first stage
                  openCreateDealModal();
                }}
              >
                Create Deal
              </Button>
            </div>
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex space-x-4 overflow-x-auto pb-4 h-full">
            {DEAL_STAGES.map(stage => (
                <DealColumn
                key={stage}
                stage={stage}
                deals={dealsByStage[stage] || []}
                onSelectDeal={handleSelectDeal}
                onCreateDeal={handleCreateDeal}
                />
            ))}
            </div>
       </div>
       {isEditDealModalOpen && selectedDeal && <EditDealModal deal={selectedDeal} />}
       {isCreateDealModalOpen && !selectedDeal && newDealStage && (
         <EditDealModal 
           defaultStage={newDealStage} 
           defaultOwnerId={users.user_1.id} 
         />
       )}
    </div>
  );
};

export default DealsPage;