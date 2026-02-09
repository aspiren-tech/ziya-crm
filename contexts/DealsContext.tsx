import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_DEALS } from '../constants';
import type { Deal, DealStage } from '../types';

interface DealsContextType {
  deals: Deal[];
  updateDealStage: (dealId: string, newStage: DealStage) => void;
  editDeal: (dealId: string, dealData: Partial<Deal>) => void;
  deleteDeal: (dealId: string) => void;
  createDeal: (deal: Omit<Deal, 'id'>) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  
  const updateDealStage = (dealId: string, newStage: DealStage) => {
    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );
  };
  
  const editDeal = (dealId: string, dealData: Partial<Deal>) => {
    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId ? { ...deal, ...dealData } : deal
      )
    );
  };
  
  const deleteDeal = (dealId: string) => {
    setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId));
  };
  
  const createDeal = (dealData: Omit<Deal, 'id'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal_${Date.now()}`,
    };
    setDeals(prevDeals => [newDeal, ...prevDeals]);
  };

  return (
    <DealsContext.Provider value={{ deals, updateDealStage, editDeal, deleteDeal, createDeal }}>
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
};