import React, { createContext, useContext, ReactNode } from 'react';
import CrmApi from '../src/api/crmApi';
import MetaApiService from '../src/api/metaApiService';

interface ApiContextType {
  crmApi: CrmApi;
  metaApi: MetaApiService;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const crmApi = new CrmApi();
  const metaApi = new MetaApiService();

  return (
    <ApiContext.Provider value={{ crmApi, metaApi }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};