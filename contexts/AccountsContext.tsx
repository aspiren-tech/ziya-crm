
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_ACCOUNTS, MOCK_USERS } from '../constants';
import type { Account } from '../types';

interface AccountsContextType {
  accounts: Account[];
  addAccount: (accountData: Omit<Account, 'id' | 'ownerId'>) => void;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);

  const addAccount = (accountData: Omit<Account, 'id' | 'ownerId'>) => {
    const defaultOwner = MOCK_USERS.user_1; // Assign to a default user
    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      name: accountData.name,
      industry: accountData.industry,
      phone: accountData.phone,
      website: accountData.website,
      ownerId: defaultOwner.id,
    };
    setAccounts(prevAccounts => [newAccount, ...prevAccounts]);
  };

  return (
    <AccountsContext.Provider value={{ accounts, addAccount }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within a AccountsProvider');
  }
  return context;
};
