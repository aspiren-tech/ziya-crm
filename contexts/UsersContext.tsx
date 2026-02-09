import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_USERS } from '../constants';
import type { User } from '../types';

interface UsersContextType {
  users: Record<string, User>;
  updateUser: (userId: string, userData: Partial<User>) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<Record<string, User>>(MOCK_USERS);

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [userId]: {
        ...prevUsers[userId],
        ...userData
      }
    }));
  };

  return (
    <UsersContext.Provider value={{ users, updateUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};