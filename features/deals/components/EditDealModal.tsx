import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useUI } from '../../../contexts/UIContext';
import { useDeals } from '../../../contexts/DealsContext';
import { useUsers } from '../../../contexts/UsersContext';
import { Deal, DealStage, User } from '../../../types';
import Button from '../../../components/shared/ui/Button';

interface EditDealModalProps {
  deal?: Deal | null;
  defaultStage?: DealStage;
  defaultOwnerId?: string;
}

const EditDealModal: React.FC<EditDealModalProps> = ({ deal, defaultStage, defaultOwnerId }) => {
  const { isEditDealModalOpen, isCreateDealModalOpen, closeEditDealModal, closeCreateDealModal } = useUI();
  const { editDeal, createDeal } = useDeals();
  const { users } = useUsers();
  const [name, setName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [stage, setStage] = useState<DealStage>(defaultStage || 'Prospecting');
  const [value, setValue] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [ownerId, setOwnerId] = useState(defaultOwnerId || '');

  // Reset form when deal changes
  useEffect(() => {
    if (deal) {
      setName(deal.name);
      setAccountName(deal.accountName);
      setStage(deal.stage);
      setValue(deal.value.toString());
      setCloseDate(deal.closeDate);
      setOwnerId(deal.ownerId);
    } else {
      // Reset form when no deal is selected
      setName('');
      setAccountName('');
      setStage(defaultStage || 'Prospecting');
      setValue('');
      setCloseDate('');
      setOwnerId(defaultOwnerId || '');
    }
  }, [deal, defaultStage, defaultOwnerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Please fill in the deal name.');
      return;
    }
    
    if (deal) {
      // Editing existing deal
      editDeal(deal.id, { 
        name, 
        accountName, 
        stage, 
        value: parseFloat(value) || 0, 
        closeDate, 
        ownerId 
      });
    } else {
      // Creating new deal
      createDeal({
        name,
        accountId: '', // This would need to be set properly in a real app
        accountName,
        stage,
        value: parseFloat(value) || 0,
        closeDate,
        ownerId,
      });
    }
    
    // Close modal
    if (deal) {
      closeEditDealModal();
    } else {
      closeCreateDealModal();
    }
  };

  // Check if we're creating a new deal
  const isCreating = !deal && (isCreateDealModalOpen || defaultStage);

  if ((!isEditDealModalOpen && !isCreateDealModalOpen) || (!deal && !defaultStage)) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-main">
            {isCreating ? 'Create Deal' : 'Edit Deal'}
          </h2>
          <button 
            onClick={isCreating ? closeCreateDealModal : closeEditDealModal} 
            className="p-1 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Deal Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input 
                type="text" 
                value={accountName} 
                onChange={e => setAccountName(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stage</label>
              <select 
                value={stage} 
                onChange={e => setStage(e.target.value as DealStage)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="Prospecting">Prospecting</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed - Won">Closed - Won</option>
                <option value="Closed - Lost">Closed - Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Value</label>
              <input 
                type="number" 
                value={value} 
                onChange={e => setValue(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Close Date</label>
              <input 
                type="date" 
                value={closeDate} 
                onChange={e => setCloseDate(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner</label>
              <select 
                value={ownerId} 
                onChange={e => setOwnerId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {Object.values(users).map((user: User) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end items-center space-x-3 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={isCreating ? closeCreateDealModal : closeEditDealModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={isCreating ? Plus : undefined}
            >
              {isCreating ? 'Create Deal' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDealModal;