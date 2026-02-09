// Webhook Handler for Meta Lead Ads
// This would typically be a backend endpoint

interface WebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    changes: Array<{
      field: string;
      value: {
        leadgen_id: string;
        form_id: string;
        leadgen_timestamp: number;
        page_id: string;
        ad_id: string;
        adgroup_id: string;
        campaign_id: string;
      };
    }>;
  }>;
}

interface LeadData {
  id: string;
  created_time: string;
  field_data: Array<{
    name: string;
    values: string[];
  }>;
}

class MetaWebhookHandler {
  private verifyToken: string;
  
  constructor(verifyToken: string) {
    this.verifyToken = verifyToken;
  }

  // Challenge verification for webhook setup
  verifyWebhookChallenge(query: Record<string, string>): { success: boolean; challenge?: string; error?: string } {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    
    if (mode && token) {
      if (mode === 'subscribe' && token === this.verifyToken) {
        console.log('Webhook verified successfully');
        return { success: true, challenge };
      } else {
        return { success: false, error: 'Verification failed' };
      }
    }
    
    return { success: false, error: 'Missing parameters' };
  }
  
  // Handle incoming webhook
  async handleWebhook(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
    try {
      // Process each entry
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'leadgen') {
            const leadId = change.value.leadgen_id;
            const formId = change.value.form_id;
            const campaignId = change.value.campaign_id;
            
            console.log(`New lead generated: ${leadId} from form ${formId} in campaign ${campaignId}`);
            
            // Process the lead
            await this.processLead(leadId, formId, campaignId);
          }
        }
      }
      
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return { success: false, message: 'Error processing webhook' };
    }
  }
  
  // Process a lead
  private async processLead(leadId: string, formId: string, campaignId: string): Promise<void> {
    // In a real implementation, fetch lead data from Meta API:
    // GET /{lead-id}?access_token={access-token}
    
    // For now, we'll simulate the lead data
    const leadData: LeadData = {
      id: leadId,
      created_time: new Date().toISOString(),
      field_data: [
        { name: 'full_name', values: ['John Doe'] },
        { name: 'email', values: ['john.doe@example.com'] },
        { name: 'phone_number', values: ['+1-555-123-4567'] },
        { name: 'company_name', values: ['Example Corp'] }
      ]
    };
    
    // Transform and store lead in CRM
    const transformedLead = this.transformLeadData(leadData, campaignId);
    
    // In a real implementation, this would call your CRM API:
    // await crmApi.createLead(transformedLead);
    
    console.log('Lead processed and stored in CRM:', transformedLead);
  }
  
  // Transform Meta lead data to CRM format
  private transformLeadData(leadData: LeadData, campaignId: string): any {
    // Convert field_data array to object
    const fieldData: Record<string, string> = {};
    leadData.field_data.forEach(field => {
      fieldData[field.name] = field.values[0] || '';
    });
    
    // Transform to CRM lead format
    return {
      id: `imported_${leadData.id}`,
      firstName: fieldData.full_name?.split(' ')[0] || '',
      lastName: fieldData.full_name?.split(' ').slice(1).join(' ') || '',
      company: fieldData.company_name || 'N/A',
      email: fieldData.email || '',
      phone: fieldData.phone_number || '',
      source: `Meta Ad: Campaign ${campaignId}`,
      campaignId: campaignId,
      status: 'New',
      tags: ['Meta Ad', 'Webhook'],
      createdAt: leadData.created_time,
      updatedAt: leadData.created_time,
      notes: [],
      activities: [],
      attachments: []
    };
  }
}

export default MetaWebhookHandler;