import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Extended interface for Meta account with additional fields for API integration
interface MetaAccount {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  adAccounts: AdAccount[];
  isConnected: boolean;
  lastSynced?: string;
}

interface AdAccount {
  id: string;
  name: string;
  accountId: string;
  currency: string;
  timezone: string;
}

// New interfaces for Meta API data
interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  created_time: string;
  start_time?: string;
  stop_time?: string;
  spend?: number;
  clicks?: number;
  impressions?: number;
  reach?: number;
  conversions?: number;
}

interface MetaAdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  created_time: string;
  start_time?: string;
  end_time?: string;
}

interface MetaAd {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  creative_id: string;
  status: string;
  created_time: string;
}

interface MetaLead {
  id: string;
  created_time: string;
  ad_id: string;
  ad_name: string;
  campaign_id: string;
  campaign_name: string;
  form_id: string;
  field_data: Array<{
    name: string;
    values: string[];
  }>;
}

interface LeadForm {
  id: string;
  name: string;
  locale: string;
  created_time: string;
  last_updated_time: string;
  leads_count: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
}

interface LeadFormLead {
  id: string;
  created_time: string;
  field_data: Array<{
    name: string;
    values: string[];
  }>;
  ad_id: string;
  ad_name: string;
  campaign_id: string;
  campaign_name: string;
}

interface MetaAccountContextType {
  metaAccount: MetaAccount;
  connectAccount: (accessToken: string) => void;
  disconnectAccount: () => void;
  refreshAdAccounts: () => Promise<void>;
  fetchCampaigns: (adAccountId: string) => Promise<MetaCampaign[]>;
  fetchAdSets: (campaignId: string) => Promise<MetaAdSet[]>;
  fetchAds: (campaignId: string) => Promise<MetaAd[]>;
  fetchLeads: (formId: string) => Promise<MetaLead[]>;
  fetchLeadForms: (pageId: string) => Promise<LeadForm[]>;
  fetchLeadsFromForm: (formId: string) => Promise<LeadFormLead[]>;
  isLoading: boolean;
  error: string | null;
}

const MetaAccountContext = createContext<MetaAccountContextType | undefined>(undefined);

export const MetaAccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metaAccount, setMetaAccount] = useState<MetaAccount>(() => {
    // Try to load saved account state from localStorage
    const savedAccount = localStorage.getItem('metaAccount');
    if (savedAccount) {
      try {
        return JSON.parse(savedAccount);
      } catch (e) {
        return { 
          id: '', 
          email: '', 
          name: '', 
          accessToken: '', 
          adAccounts: [], 
          isConnected: false 
        };
      }
    }
    return { 
      id: '', 
      email: '', 
      name: '',
      accessToken: '', 
      adAccounts: [], 
      isConnected: false 
    };
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save account state to localStorage whenever it changes
  useEffect(() => {
    if (metaAccount.isConnected && metaAccount.email) {
      localStorage.setItem('metaAccount', JSON.stringify(metaAccount));
    } else {
      localStorage.removeItem('metaAccount');
    }
  }, [metaAccount]);

  const connectAccount = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch user info from Meta API
      const response = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${accessToken}&fields=id,name,email`);
      const userData = await response.json();
      
      if (userData.error) {
        throw new Error(`Meta API Error: ${userData.error.message || 'Failed to fetch user data'}`);
      }
      
      // Check if we got valid user data
      if (!userData.id) {
        throw new Error('Invalid access token or insufficient permissions');
      }
      
      const account: MetaAccount = { 
        id: userData.id,
        email: userData.email || '',
        name: userData.name || 'Unknown User',
        accessToken,
        adAccounts: [],
        isConnected: true,
        lastSynced: new Date().toISOString()
      };
      
      setMetaAccount(account);
      
      // Automatically fetch ad accounts after connection
      await refreshAdAccountsInternal(accessToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Meta account';
      setError(errorMessage);
      console.error('Error connecting to Meta account:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectAccount = () => {
    const account: MetaAccount = { 
      id: '', 
      email: '', 
      name: '',
      accessToken: '', 
      adAccounts: [], 
      isConnected: false 
    };
    setMetaAccount(account);
  };

  // Internal function to refresh ad accounts
  const refreshAdAccountsInternal = async (token: string) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/me/adaccounts?access_token=${token}&fields=name,account_id,currency,timezone`);
      const data = await response.json();
      
      if (data.error) {
        let errorMessage = data.error.message || 'Failed to fetch ad accounts';
        
        // Provide more specific error messages for common issues
        if (data.error.code === 190) {
          errorMessage = 'Invalid or expired access token. Please generate a new token.';
        } else if (data.error.code === 100) {
          errorMessage = 'Insufficient permissions. Make sure your access token has ads_read permission.';
        } else if (data.error.code === 200) {
          errorMessage = 'Permissions error. Make sure your access token has business_management permission.';
        }
        
        throw new Error(`Meta API Error: ${errorMessage}`);
      }
      
      // Check if we got valid data
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response from Meta API when fetching ad accounts');
      }
      
      const adAccounts: AdAccount[] = data.data.map((account: any) => ({
        id: account.id,
        name: account.name || 'Unnamed Account',
        accountId: account.account_id,
        currency: account.currency || 'USD',
        timezone: account.timezone || 'UTC'
      }));
      
      setMetaAccount(prev => ({
        ...prev,
        adAccounts,
        lastSynced: new Date().toISOString()
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ad accounts';
      setError(errorMessage);
      console.error('Error fetching ad accounts:', err);
      throw new Error(errorMessage);
    }
  };

  // Public function to refresh ad accounts
  const refreshAdAccounts = async (): Promise<void> => {
    if (!metaAccount.isConnected || !metaAccount.accessToken) {
      setError('Not connected to Meta');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await refreshAdAccountsInternal(metaAccount.accessToken);
    } catch (err) {
      setError('Failed to fetch ad accounts');
      console.error('Error fetching ad accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch campaigns for an ad account
  const fetchCampaigns = async (adAccountId: string): Promise<MetaCampaign[]> => {
    if (!metaAccount.isConnected || !metaAccount.accessToken) {
      throw new Error('Not connected to Meta');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${adAccountId}/campaigns?access_token=${metaAccount.accessToken}&fields=id,name,status,objective,created_time,start_time,stop_time,insights{spend,clicks,impressions,reach,conversions}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to fetch campaigns');
      }
      
      return data.data.map((campaign: any) => {
        const insights = campaign.insights?.data[0] || {};
        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          objective: campaign.objective,
          created_time: campaign.created_time,
          start_time: campaign.start_time,
          stop_time: campaign.stop_time,
          spend: parseFloat(insights.spend) || 0,
          clicks: parseInt(insights.clicks) || 0,
          impressions: parseInt(insights.impressions) || 0,
          reach: parseInt(insights.reach) || 0,
          conversions: parseInt(insights.conversions) || 0
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      console.error('Error fetching campaigns:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ad sets for a campaign
  const fetchAdSets = async (campaignId: string): Promise<MetaAdSet[]> => {
    if (!metaAccount.isConnected || !metaAccount.accessToken) {
      throw new Error('Not connected to Meta');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${campaignId}/adsets?access_token=${metaAccount.accessToken}&fields=id,name,campaign_id,status,created_time,start_time,end_time`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to fetch ad sets');
      }
      
      return data.data.map((adSet: any) => ({
        id: adSet.id,
        name: adSet.name,
        campaign_id: adSet.campaign_id,
        status: adSet.status,
        created_time: adSet.created_time,
        start_time: adSet.start_time,
        end_time: adSet.end_time
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ad sets');
      console.error('Error fetching ad sets:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ads for a campaign
  const fetchAds = async (campaignId: string): Promise<MetaAd[]> => {
    if (!metaAccount.isConnected || !metaAccount.accessToken) {
      throw new Error('Not connected to Meta');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${campaignId}/ads?access_token=${metaAccount.accessToken}&fields=id,name,adset_id,campaign_id,creative{id},status,created_time,insights{ctr,cpc,cpm,actions}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to fetch ads');
      }
      
      return data.data.map((ad: any) => {
        const insights = ad.insights?.data[0] || {};
        return {
          id: ad.id,
          name: ad.name,
          adset_id: ad.adset_id,
          campaign_id: ad.campaign_id,
          creative_id: ad.creative?.id || '',
          status: ad.status,
          created_time: ad.created_time
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ads');
      console.error('Error fetching ads:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch leads for a form
  const fetchLeads = async (formId: string): Promise<MetaLead[]> => {
    if (!metaAccount.isConnected || !metaAccount.accessToken) {
      throw new Error('Not connected to Meta');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${formId}/leads?access_token=${metaAccount.accessToken}&fields=id,created_time,ad_id,ad_name,campaign_id,campaign_name,form_id,field_data`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to fetch leads');
      }
      
      return data.data.map((lead: any) => ({
        id: lead.id,
        created_time: lead.created_time,
        ad_id: lead.ad_id,
        ad_name: lead.ad_name,
        campaign_id: lead.campaign_id,
        campaign_name: lead.campaign_name,
        form_id: lead.form_id,
        field_data: lead.field_data || []
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
      console.error('Error fetching leads:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch lead forms for a page
  const fetchLeadForms = async (pageId: string): Promise<LeadForm[]> => {
    if (!metaAccount.isConnected || !metaAccount.accessToken) {
      throw new Error('Not connected to Meta');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${pageId}/leadgen_forms?access_token=${metaAccount.accessToken}&fields=id,name,locale,created_time,last_updated_time,leads_count,status`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to fetch lead forms');
      }
      
      return data.data.map((form: any) => ({
        id: form.id,
        name: form.name,
        locale: form.locale,
        created_time: form.created_time,
        last_updated_time: form.last_updated_time,
        leads_count: form.leads_count || 0,
        status: form.status
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lead forms');
      console.error('Error fetching lead forms:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch leads from a specific lead form
  const fetchLeadsFromForm = async (formId: string): Promise<LeadFormLead[]> => {
    if (!metaAccount.isConnected || !metaAccount.accessToken) {
      throw new Error('Not connected to Meta');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${formId}/leads?access_token=${metaAccount.accessToken}&fields=id,created_time,field_data,ad_id,ad_name,campaign_id,campaign_name`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to fetch leads from form');
      }
      
      return data.data.map((lead: any) => ({
        id: lead.id,
        created_time: lead.created_time,
        field_data: lead.field_data || [],
        ad_id: lead.ad_id,
        ad_name: lead.ad_name,
        campaign_id: lead.campaign_id,
        campaign_name: lead.campaign_name
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads from form');
      console.error('Error fetching leads from form:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MetaAccountContext.Provider value={{ 
      metaAccount, 
      connectAccount, 
      disconnectAccount,
      refreshAdAccounts,
      fetchCampaigns,
      fetchAdSets,
      fetchAds,
      fetchLeads,
      fetchLeadForms,
      fetchLeadsFromForm,
      isLoading,
      error
    }}>
      {children}
    </MetaAccountContext.Provider>
  );
};

export const useMetaAccount = () => {
  const context = useContext(MetaAccountContext);
  if (context === undefined) {
    throw new Error('useMetaAccount must be used within a MetaAccountProvider');
  }
  return context;
};