
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_CAMPAIGNS } from '../constants';
import type { Campaign } from '../types';

interface CampaignsContextType {
  campaigns: Campaign[];
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

export const CampaignsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);

  return (
    <CampaignsContext.Provider value={{ campaigns }}>
      {children}
    </CampaignsContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignsContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignsProvider');
  }
  return context;
};
