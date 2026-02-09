// Meta API Service - Real implementation for production
// This would make actual HTTP requests to Meta's Graph API

interface MetaApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

interface AdAccount {
  id: string;
  name: string;
  account_id: string;
  currency: string;
  timezone_name: string;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  created_time: string;
  start_time?: string;
  stop_time?: string;
}

interface AdSet {
  id: string;
  name: string;
  status: string;
  created_time: string;
  start_time?: string;
  end_time?: string;
  daily_budget?: string;
  targeting?: any;
}

interface Ad {
  id: string;
  name: string;
  status: string;
  created_time: string;
  creative?: {
    id: string;
    name: string;
  };
}

interface Lead {
  id: string;
  created_time: string;
  field_data: Array<{
    name: string;
    values: string[];
  }>;
}

class MetaApiService {
  private accessToken: string | null = null;
  private baseUrl: string = 'https://graph.facebook.com/v18.0';
  
  setAccessToken(token: string) {
    this.accessToken = token;
  }
  
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<MetaApiResponse<T>> {
    if (!this.accessToken) {
      return {
        data: {} as T,
        success: false,
        error: 'No access token provided'
      };
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          data: {} as T,
          success: false,
          error: data.error?.message || 'Request failed'
        };
      }
      
      return {
        data,
        success: true
      };
    } catch (error) {
      return {
        data: {} as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAdAccounts(): Promise<MetaApiResponse<AdAccount[]>> {
    const response = await this.request<AdAccount[]>(`/me/adaccounts?access_token=${this.accessToken}&fields=name,account_id,currency,timezone_name`);
    return response;
  }
  
  async getCampaigns(adAccountId: string): Promise<MetaApiResponse<Campaign[]>> {
    const response = await this.request<Campaign[]>(`/${adAccountId}/campaigns?access_token=${this.accessToken}&fields=id,name,status,objective,created_time,start_time,stop_time`);
    return response;
  }
  
  async getAdSets(campaignId: string): Promise<MetaApiResponse<AdSet[]>> {
    const response = await this.request<AdSet[]>(`/${campaignId}/adsets?access_token=${this.accessToken}&fields=id,name,status,created_time,start_time,end_time,daily_budget,targeting`);
    return response;
  }
  
  async getAds(adSetId: string): Promise<MetaApiResponse<Ad[]>> {
    const response = await this.request<Ad[]>(`/${adSetId}/ads?access_token=${this.accessToken}&fields=id,name,status,created_time,creative`);
    return response;
  }
  
  async getLeads(formId: string): Promise<MetaApiResponse<Lead[]>> {
    const response = await this.request<Lead[]>(`/${formId}/leads?access_token=${this.accessToken}&fields=id,created_time,field_data`);
    return response;
  }
  
  async getInsights(objectId: string, objectType: 'campaign' | 'adset' | 'ad'): Promise<MetaApiResponse<any>> {
    const response = await this.request<any>(`/${objectId}/insights?access_token=${this.accessToken}`);
    return response;
  }
}

export default MetaApiService;