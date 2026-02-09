import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUI } from '../../../contexts/UIContext';
import { useTasks } from '../../../contexts/TasksContext';
import { useUsers } from '../../../contexts/UsersContext';
import { useLeads } from '../../../contexts/LeadsContext';
import { useContacts } from '../../../contexts/ContactsContext';
import { useDeals } from '../../../contexts/DealsContext';
import type { TaskPriority, User, Lead, Contact, Deal } from '../../../types';
import Button from '../../../components/shared/ui/Button';

const CreateTaskModal: React.FC = () => {
  const { isCreateTaskModalOpen, closeCreateTaskModal } = useUI();
  const { addTask } = useTasks();
  const { users } = useUsers();
  const { leads } = useLeads();
  const { contacts } = useContacts();
  const { deals } = useDeals();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assignedToId, setAssignedToId] = useState('');
  const [relatedToType, setRelatedToType] = useState<'Lead' | 'Contact' | 'Deal' | ''>('');
  const [relatedToId, setRelatedToId] = useState('');

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isCreateTaskModalOpen) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setAssignedToId('');
      setRelatedToType('');
      setRelatedToId('');
    }
  }, [isCreateTaskModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Please fill in Title and Due Date.');
      return;
    }
    
    // Get related entity name
    let relatedToName = '';
    if (relatedToType && relatedToId) {
      switch (relatedToType) {
        case 'Lead':
          const lead = leads.find(l => l.id === relatedToId);
          relatedToName = lead ? `${lead.firstName} ${lead.lastName}` : '';
          break;
        case 'Contact':
          const contact = contacts.find(c => c.id === relatedToId);
          relatedToName = contact ? (contact.name || '') : '';
          break;
        case 'Deal':
          const deal = deals.find(d => d.id === relatedToId);
          relatedToName = deal ? deal.name : '';
          break;
      }
    }
    
    addTask({ 
      title, 
      description, 
      dueDate, 
      priority,
      assignedToId: assignedToId || undefined,
      relatedTo: relatedToType && relatedToId ? {
        type: relatedToType,
        id: relatedToId,
        name: relatedToName
      } : undefined
    });
    
    // Reset form and close modal
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setAssignedToId('');
    setRelatedToType('');
    setRelatedToId('');
    closeCreateTaskModal();
  };

  // Get related entities based on selected type
  const getRelatedEntities = () => {
    switch (relatedToType) {
      case 'Lead':
        return leads.map((lead: Lead) => ({ id: lead.id, name: `${lead.firstName} ${lead.lastName}` }));
      case 'Contact':
        return contacts.map((contact: Contact) => ({ id: contact.id, name: contact.name || '' }));
      case 'Deal':
        return deals.map((deal: Deal) => ({ id: deal.id, name: deal.name }));
      default:
        return [];
    }
  };

  const relatedEntities = getRelatedEntities();

  if (!isCreateTaskModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-main">Create New Task</h2>
          <button 
            onClick={closeCreateTaskModal} 
            className="p-1 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date <span className="text-red-500">*</span></label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign To</label>
              <select 
                value={assignedToId} 
                onChange={e => setAssignedToId(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select user</option>
                {Object.values(users).map((user: User) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Related To Type</label>
                <select 
                  value={relatedToType} 
                  onChange={e => {
                    setRelatedToType(e.target.value as 'Lead' | 'Contact' | 'Deal' | '');
                    setRelatedToId('');
                  }} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select type</option>
                  <option value="Lead">Lead</option>
                  <option value="Contact">Contact</option>
                  <option value="Deal">Deal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Related To</label>
                <select 
                  value={relatedToId} 
                  onChange={e => setRelatedToId(e.target.value)} 
                  disabled={!relatedToType}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select entity</option>
                  {relatedEntities.map(entity => (
                    <option key={entity.id} value={entity.id}>{entity.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end items-center space-x-3 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeCreateTaskModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;