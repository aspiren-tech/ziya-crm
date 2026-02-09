import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUI } from '../../../contexts/UIContext';
import { useLeads } from '../../../contexts/LeadsContext';
import { LeadStatus } from '../../../types';
import Button from '../../../components/shared/ui/Button';

interface CreateLeadModalProps {
  defaultStatus?: LeadStatus;
}

const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ defaultStatus }) => {
  const { isCreateLeadModalOpen, closeCreateLeadModal } = useUI();
  const { createLead } = useLeads();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<LeadStatus>(defaultStatus || 'New');

  // Reset form when modal closes or defaultStatus changes
  useEffect(() => {
    if (!isCreateLeadModalOpen) {
      // Reset form
      setFirstName('');
      setLastName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setStatus(defaultStatus || 'New');
    }
  }, [isCreateLeadModalOpen, defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      alert('Please fill in First Name, Last Name, and Email.');
      return;
    }
    createLead({ firstName, lastName, company, email, phone }, status);
    // Reset form and close modal
    setFirstName('');
    setLastName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setStatus(defaultStatus || 'New');
    closeCreateLeadModal();
  };

  if (!isCreateLeadModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-main">Create New Lead</h2>
          <button 
            onClick={closeCreateLeadModal} 
            className="p-1 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as LeadStatus)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed - Won">Closed - Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end items-center space-x-3 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeCreateLeadModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Create Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;