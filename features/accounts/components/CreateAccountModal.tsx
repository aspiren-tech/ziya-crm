
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUI } from '../../../contexts/UIContext';
import { useAccounts } from '../../../contexts/AccountsContext';
import Button from '../../../components/shared/ui/Button';

const CreateAccountModal: React.FC = () => {
  const { isCreateAccountModalOpen, closeCreateAccountModal } = useUI();
  const { addAccount } = useAccounts();
  
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Please fill in Account Name.');
      return;
    }
    addAccount({ name, industry, phone, website });
    
    // Reset form and close modal
    setName('');
    setIndustry('');
    setPhone('');
    setWebsite('');
    closeCreateAccountModal();
  };

  if (!isCreateAccountModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-main">Create New Account</h2>
          <button 
            onClick={closeCreateAccountModal} 
            className="p-1 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end items-center space-x-3 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeCreateAccountModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;
