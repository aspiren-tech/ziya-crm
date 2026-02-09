import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useUI } from '../../../contexts/UIContext';
import { useContacts } from '../../../contexts/ContactsContext';
import Button from '../../../components/shared/ui/Button';

const CreateContactModal: React.FC = () => {
  const { isCreateContactModalOpen, closeCreateContactModal } = useUI();
  const { addContact } = useContacts();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill in Name and Phone Number.');
      return;
    }
    addContact({ name, phone: `91${phone}` });
    
    setName('');
    setPhone('');
    closeCreateContactModal();
  };

  if (!isCreateContactModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg transform transition-all animate-fadeIn">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-main">Create Contact</h2>
          <button 
            onClick={closeCreateContactModal} 
            className="p-1 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 transform hover:scale-110"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                <div className="relative mt-1">
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                      maxLength={100} 
                      className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300" 
                      placeholder="User Name" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{name.length}/100</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <div className="mt-1 flex rounded-lg shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                        <button 
                          type="button" 
                          className="relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-lg text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                        >
                            <span>India</span>
                            <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                    </div>
                    <span className="inline-flex items-center px-3 border border-l-0 border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        +91
                    </span>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} 
                      required 
                      className="flex-1 block w-full rounded-none rounded-r-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300" 
                      placeholder="WhatsApp Number" 
                    />
                </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end items-center space-x-3 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeCreateContactModal}
              className="transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Create Contact
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContactModal;