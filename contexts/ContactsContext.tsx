import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_CONTACTS } from '../constants';
import type { Contact } from '../types';

interface ContactsContextType {
  contacts: Contact[];
  addContact: (contactData: Omit<Contact, 'id' | 'tags' | 'source' | 'customFields' | 'createdAt' | 'updatedAt' | 'normalizedPhone'>) => void;
  editContact: (contactId: string, contactData: Partial<Contact>) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);

  const addContact = (contactData: Omit<Contact, 'id' | 'tags' | 'source' | 'customFields' | 'createdAt' | 'updatedAt' | 'normalizedPhone'>) => {
    const newContact: Contact = {
      id: `contact_${Date.now()}`,
      name: contactData.name,
      phone: contactData.phone,
      normalizedPhone: `+${contactData.phone}`,
      tags: [],
      source: 'Manual Entry',
      customFields: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContacts(prevContacts => [newContact, ...prevContacts]);
  };

  const editContact = (contactId: string, contactData: Partial<Contact>) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId ? { ...contact, ...contactData, updatedAt: new Date().toISOString() } : contact
      )
    );
  };

  return (
    <ContactsContext.Provider value={{ contacts, addContact, editContact }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};