import React, { useState, useMemo } from 'react';
import { ArrowLeft, Send, Clock, Users, Upload, FileText, Plus, Trash2, Eye, AlertCircle, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaignModule } from '../../contexts/CampaignModuleContext';
import Button from '../../components/shared/ui/Button';
import Input from '../../components/shared/ui/Input';

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, templates, contacts, importJobs, createCampaign } = useCampaignModule();
  
  // Campaign basic info
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  
  // Message type and template
  const [messageType, setMessageType] = useState<'template' | 'free_text'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [messageBody, setMessageBody] = useState('');
  
  // Template variables mapping
  const [variableMappings, setVariableMappings] = useState<Record<string, string>>({});
  
  // Schedule
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Recipients selection type
  const [recipientType, setRecipientType] = useState<'manual' | 'import' | 'meta'>('manual');
  
  // Manual entry
  const [manualPhoneNumbers, setManualPhoneNumbers] = useState('');
  const [saveManualAsContacts, setSaveManualAsContacts] = useState(false);
  const [defaultCountryCode, setDefaultCountryCode] = useState('+1');
  
  // Import leads
  const [selectedImportJobId, setSelectedImportJobId] = useState('');
  const [selectedImportedLeads, setSelectedImportedLeads] = useState<string[]>([]);
  const [convertToContacts, setConvertToContacts] = useState(false);
  const [dedupeKey, setDedupeKey] = useState<'phone' | 'email'>('phone');
  
  // Meta ads
  const [selectedPageId, setSelectedPageId] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [metaDateRange, setMetaDateRange] = useState({ start: '', end: '' });
  const [includeUnsentLeads, setIncludeUnsentLeads] = useState(false);
  const [autoSyncNewLeads, setAutoSyncNewLeads] = useState(false);
  const [triggerFollowUp, setTriggerFollowUp] = useState(false);
  
  // Rate control
  const [rateControl, setRateControl] = useState(60);
  
  // Test send
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Preview recipients
  const [previewRecipients, setPreviewRecipients] = useState<Array<{name: string, phone: string, variables: Record<string, string>}>>([]);

  // Get selected account
  const selectedAccount = useMemo(() => {
    return accounts.find(account => account.id === accountId);
  }, [accounts, accountId]);

  // Get templates for selected account
  const accountTemplates = useMemo(() => {
    return templates.filter(template => template.accountId === accountId && template.status === 'APPROVED');
  }, [templates, accountId]);

  // Get selected template
  const selectedTemplate = useMemo(() => {
    return templates.find(template => template.id === selectedTemplateId);
  }, [templates, selectedTemplateId]);

  // Get import jobs
  const completedImportJobs = useMemo(() => {
    return importJobs.filter(job => job.status === 'completed');
  }, [importJobs]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessageBody(template.components.find(c => c.type === 'BODY')?.text || '');
      // Initialize variable mappings
      const mappings: Record<string, string> = {};
      template.variables.forEach(variable => {
        mappings[variable] = '';
      });
      setVariableMappings(mappings);
    }
  };

  // Handle variable mapping change
  const handleVariableMappingChange = (variable: string, value: string) => {
    setVariableMappings(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  // Validate E.164 phone number format
  const validateE164 = (phone: string): boolean => {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
  };

  // Format phone number with default country code if missing
  const formatPhoneNumber = (phone: string): string => {
    phone = phone.trim();
    if (phone.startsWith('+')) {
      return phone;
    }
    if (phone.startsWith('0')) {
      return defaultCountryCode + phone.substring(1);
    }
    return defaultCountryCode + phone;
  };

  // Handle manual phone numbers change
  const handleManualPhoneNumbersChange = (value: string) => {
    setManualPhoneNumbers(value);
    // Parse and preview recipients
    const phones = value.split('\n').filter(phone => phone.trim() !== '');
    const preview = phones.map((phone, index) => {
      const formattedPhone = formatPhoneNumber(phone);
      return {
        name: `Recipient ${index + 1}`,
        phone: formattedPhone,
        variables: {}
      };
    });
    setPreviewRecipients(preview);
  };

  // Handle import job selection
  const handleImportJobSelect = (jobId: string) => {
    setSelectedImportJobId(jobId);
    // In a real app, you would fetch the leads for this job
    // For now, we'll just create a preview
    const preview = Array(5).fill(0).map((_, index) => ({
      name: `Imported Lead ${index + 1}`,
      phone: `+123456789${index}`,
      variables: {}
    }));
    setPreviewRecipients(preview);
    setSelectedImportedLeads(Array(5).fill(0).map((_, index) => `lead_${index}`));
  };

  // Toggle imported lead selection
  const toggleImportedLeadSelection = (leadId: string) => {
    setSelectedImportedLeads(prev => {
      if (prev.includes(leadId)) {
        return prev.filter(id => id !== leadId);
      } else {
        return [...prev, leadId];
      }
    });
  };

  // Select all imported leads
  const selectAllImportedLeads = () => {
    const allLeadIds = Array(5).fill(0).map((_, index) => `lead_${index}`);
    setSelectedImportedLeads(allLeadIds);
  };

  // Clear all imported lead selections
  const clearAllImportedLeads = () => {
    setSelectedImportedLeads([]);
  };

  // Get recipient count
  const recipientCount = useMemo(() => {
    switch (recipientType) {
      case 'manual':
        return manualPhoneNumbers.split('\n').filter(phone => phone.trim() !== '').length;
      case 'import':
        return selectedImportedLeads.length;
      case 'meta':
        return 0; // In a real app, this would be the count of meta leads
      default:
        return 0;
    }
  }, [recipientType, manualPhoneNumbers, selectedImportedLeads]);

  // Handle send test message
  const handleSendTest = () => {
    if (!testPhoneNumber.trim()) {
      alert('Please enter a test phone number');
      return;
    }
    
    if (!validateE164(testPhoneNumber.trim())) {
      alert('Please enter a valid phone number in E.164 format (e.g., +1234567890)');
      return;
    }
    
    if (!name.trim()) {
      alert('Please enter a campaign name');
      return;
    }
    
    setIsSendingTest(true);
    // Simulate sending test message
    setTimeout(() => {
      setIsSendingTest(false);
      alert('Test message sent successfully!');
    }, 1500);
  };

  // Handle create campaign
  const handleCreateCampaign = () => {
    if (!name.trim()) {
      alert('Please enter a campaign name');
      return;
    }
    
    if (!accountId) {
      alert('Please select a sender profile');
      return;
    }
    
    if (messageType === 'template' && !selectedTemplateId) {
      alert('Please select a template');
      return;
    }
    
    if (scheduleType === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      alert('Please set a scheduled date and time');
      return;
    }
    
    if (recipientCount === 0) {
      alert('Please select at least one recipient');
      return;
    }
    
    // Extract variables from template
    let variables: string[] = [];
    if (messageType === 'template' && selectedTemplate) {
      variables = selectedTemplate.variables;
    } else if (messageType === 'free_text') {
      variables = messageBody.match(/{{(.*?)}}/g)?.map(v => v.slice(2, -2)) || [];
    }
    
    // Create scheduled datetime if needed
    let scheduledAt: string | undefined;
    if (scheduleType === 'scheduled') {
      scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    }
    
    // Determine target query based on recipient type
    let targetQuery: any = { type: 'manual', value: {} };
    switch (recipientType) {
      case 'manual':
        targetQuery = { 
          type: 'manual', 
          value: { 
            phones: manualPhoneNumbers.split('\n').filter(phone => phone.trim() !== '').map(formatPhoneNumber),
            saveAsContacts: saveManualAsContacts,
            defaultCountryCode: defaultCountryCode
          } 
        };
        break;
      case 'import':
        targetQuery = { 
          type: 'imported_csv_job', 
          value: { 
            jobId: selectedImportJobId,
            selectedLeads: selectedImportedLeads,
            convertToContacts: convertToContacts,
            dedupeKey: dedupeKey
          } 
        };
        break;
      case 'meta':
        targetQuery = { 
          type: 'meta_form', 
          value: { 
            pageId: selectedPageId,
            formId: selectedFormId,
            dateRange: metaDateRange,
            includeUnsentLeads: includeUnsentLeads,
            autoSyncNewLeads: autoSyncNewLeads,
            triggerFollowUp: triggerFollowUp
          } 
        };
        break;
    }
    
    const newCampaign = {
      name,
      senderAccountId: accountId,
      messageType,
      messageBody: messageType === 'template' ? messageBody : messageBody,
      variables,
      targetQuery,
      scheduleAt: scheduledAt,
      status: scheduleType === 'immediate' ? 'sending' : 'scheduled',
      createdBy: 'user_1', // In real app, get from auth context
    };
    
    // @ts-ignore - we're adding a temporary id for navigation
    newCampaign.id = `camp_${Date.now()}`;
    
    createCampaign(newCampaign);
    
    alert('Campaign created successfully!');
    // Navigate to the campaign detail page
    // @ts-ignore - we're using the temporary id
    navigate(`/campaigns/${newCampaign.id}`);
  };

  // Get template body text
  const getTemplateBodyText = (template: any) => {
    const bodyComponent = template.components.find((c: any) => c.type === 'BODY');
    return bodyComponent?.text || '';
  };

  // Get template header text
  const getTemplateHeaderText = (template: any) => {
    const headerComponent = template.components.find((c: any) => c.type === 'HEADER');
    return headerComponent?.text || '';
  };

  // Get template buttons
  const getTemplateButtons = (template: any) => {
    const buttonsComponent = template.components.find((c: any) => c.type === 'BUTTONS');
    return buttonsComponent?.buttons || [];
  };

  // Check if there are missing variable mappings
  const hasMissingVariables = useMemo(() => {
    return Object.values(variableMappings).some(value => !value);
  }, [variableMappings]);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/campaigns" className="p-2 rounded-full hover:bg-gray-100 mr-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-text-main">Create Campaign</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-8">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Summer Promotion Sale"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Sender Profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender Profile</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {accounts.filter(a => a.status === 'connected').map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.phoneNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Template Selection */}
          {selectedAccount && accountTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approved Templates</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accountTemplates.map(template => (
                  <div 
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTemplateId === template.id 
                        ? 'border-primary bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        checked={selectedTemplateId === template.id}
                        onChange={() => handleTemplateSelect(template.id)}
                        className="mt-1 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {template.language} • {template.category}
                        </p>
                        <div className="mt-2">
                          {getTemplateHeaderText(template) && (
                            <div className="text-xs bg-gray-100 p-2 rounded mb-1">
                              <span className="font-medium">Header:</span> {getTemplateHeaderText(template)}
                            </div>
                          )}
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {getTemplateBodyText(template).substring(0, 100)}...
                          </div>
                          {getTemplateButtons(template).length > 0 && (
                            <div className="mt-2">
                              {getTemplateButtons(template).map((button: any, idx: number) => (
                                <span key={idx} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                                  {button.text}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={messageType === 'template'}
                  onChange={() => setMessageType('template')}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Template Message</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={messageType === 'free_text'}
                  onChange={() => setMessageType('free_text')}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Free Text Message</span>
              </label>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {messageType === 'template' ? 'Message Template' : 'Message Content'}
            </label>
            <textarea
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder={messageType === 'template' 
                ? 'Select a template above or enter template text here...' 
                : 'Enter your message content here...'}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={messageType === 'template' && !!selectedTemplateId}
            />
            
            {/* Variable Helper */}
            {(messageType === 'template' && selectedTemplate) || (messageType === 'free_text' && messageBody) ? (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Template Variables</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {messageType === 'template' && selectedTemplate ? (
                    selectedTemplate.variables.map(variable => (
                      <div key={variable} className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          {`{{${variable}}}`}
                        </span>
                        <input
                          type="text"
                          value={variableMappings[variable] || ''}
                          onChange={(e) => handleVariableMappingChange(variable, e.target.value)}
                          placeholder={`Map to contact field or enter static value`}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    ))
                  ) : (
                    (messageBody.match(/{{(.*?)}}/g)?.map((variable, index) => {
                      const varName = variable.slice(2, -2);
                      return (
                        <div key={index} className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                            {variable}
                          </span>
                          <input
                            type="text"
                            value={variableMappings[varName] || ''}
                            onChange={(e) => handleVariableMappingChange(varName, e.target.value)}
                            placeholder={`Map to contact field or enter static value`}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        </div>
                      );
                    })) || []
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={scheduleType === 'immediate'}
                  onChange={() => setScheduleType('immediate')}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Send className="w-4 h-4 mr-1" />
                  Send Immediately
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={scheduleType === 'scheduled'}
                  onChange={() => setScheduleType('scheduled')}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule for Later
                </span>
              </label>
            </div>
            
            {scheduleType === 'scheduled' && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Recipients Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Recipients</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  recipientType === 'manual' 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setRecipientType('manual')}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={recipientType === 'manual'}
                    onChange={() => setRecipientType('manual')}
                    className="mt-1 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Manual Entry</h3>
                    <p className="text-sm text-gray-500 mt-1">Paste phone numbers or enter manually</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  recipientType === 'import' 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setRecipientType('import')}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={recipientType === 'import'}
                    onChange={() => setRecipientType('import')}
                    className="mt-1 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Import Leads</h3>
                    <p className="text-sm text-gray-500 mt-1">Upload CSV or select previous import</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  recipientType === 'meta' 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setRecipientType('meta')}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={recipientType === 'meta'}
                    onChange={() => setRecipientType('meta')}
                    className="mt-1 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Meta Lead Ads</h3>
                    <p className="text-sm text-gray-500 mt-1">Use Meta Ads campaign leads</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Manual Entry */}
            {recipientType === 'manual' && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>
                <textarea
                  value={manualPhoneNumbers}
                  onChange={(e) => handleManualPhoneNumbersChange(e.target.value)}
                  placeholder="+1234567890&#10;+1234567891&#10;+1234567892"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Enter one phone number per line. Format: E.164 (+[country code][number])
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Default Country Code</label>
                    <select
                      value={defaultCountryCode}
                      onChange={(e) => setDefaultCountryCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="+1">+1 (US/Canada)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (Australia)</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+49">+49 (Germany)</option>
                      <option value="+33">+33 (France)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <input
                    type="checkbox"
                    id="saveManualAsContacts"
                    checked={saveManualAsContacts}
                    onChange={(e) => setSaveManualAsContacts(e.target.checked)}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="saveManualAsContacts" className="ml-2 text-sm text-gray-700">
                    Save these numbers as contacts or leads after sending
                  </label>
                </div>
              </div>
            )}
            
            {/* Import Leads */}
            {recipientType === 'import' && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Import Leads</h3>
                    <p className="text-sm text-gray-500">Select a previously imported CSV job</p>
                  </div>
                  <Link to="/campaigns/import">
                    <Button variant="outline" size="sm" icon={Upload}>
                      Import New CSV
                    </Button>
                  </Link>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Import Job</label>
                  <select
                    value={selectedImportJobId}
                    onChange={(e) => handleImportJobSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select an import job</option>
                    {completedImportJobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.fileName} ({job.importedRows} leads)
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedImportJobId && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Select Leads</h4>
                        <div className="flex space-x-2">
                          <button 
                            onClick={selectAllImportedLeads}
                            className="text-xs text-primary hover:underline"
                          >
                            Select All
                          </button>
                          <button 
                            onClick={clearAllImportedLeads}
                            className="text-xs text-primary hover:underline"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                        {Array(5).fill(0).map((_, index) => (
                          <div key={index} className="flex items-center px-3 py-2 border-b border-gray-200 last:border-b-0">
                            <input
                              type="checkbox"
                              checked={selectedImportedLeads.includes(`lead_${index}`)}
                              onChange={() => toggleImportedLeadSelection(`lead_${index}`)}
                              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-gray-700">Imported Lead {index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dedupe Key</label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={dedupeKey === 'phone'}
                            onChange={() => setDedupeKey('phone')}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="ml-2 text-sm text-gray-700">Phone Number</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={dedupeKey === 'email'}
                            onChange={() => setDedupeKey('email')}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="ml-2 text-sm text-gray-700">Email Address</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="convertToContacts"
                        checked={convertToContacts}
                        onChange={(e) => setConvertToContacts(e.target.checked)}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="convertToContacts" className="ml-2 text-sm text-gray-700">
                        Automatically convert selected imported leads to contacts
                      </label>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Meta Lead Ads */}
            {recipientType === 'meta' && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Page</label>
                  <select
                    value={selectedPageId}
                    onChange={(e) => setSelectedPageId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a connected page</option>
                    <option value="page_1">Business Page 1</option>
                    <option value="page_2">Business Page 2</option>
                  </select>
                </div>
                
                {selectedPageId && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Lead Form</label>
                      <select
                        value={selectedFormId}
                        onChange={(e) => setSelectedFormId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select a lead form</option>
                        <option value="form_1">Contact Form</option>
                        <option value="form_2">Newsletter Signup</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={metaDateRange.start}
                          onChange={(e) => setMetaDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={metaDateRange.end}
                          onChange={(e) => setMetaDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="includeUnsentLeads"
                          checked={includeUnsentLeads}
                          onChange={(e) => setIncludeUnsentLeads(e.target.checked)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="includeUnsentLeads" className="ml-2 text-sm text-gray-700">
                          Include only unsent leads
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="autoSyncNewLeads"
                          checked={autoSyncNewLeads}
                          onChange={(e) => setAutoSyncNewLeads(e.target.checked)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="autoSyncNewLeads" className="ml-2 text-sm text-gray-700">
                          Auto-sync new leads
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="triggerFollowUp"
                          checked={triggerFollowUp}
                          onChange={(e) => setTriggerFollowUp(e.target.checked)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="triggerFollowUp" className="ml-2 text-sm text-gray-700">
                          Trigger follow-up drip campaign
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Recipient Preview */}
          {previewRecipients.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Recipient Preview</h3>
                <span className="text-sm text-gray-500">{recipientCount} recipients</span>
              </div>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewRecipients.slice(0, 5).map((recipient, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {recipient.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {recipient.phone}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          <div className="max-w-xs truncate">
                            {messageBody.substring(0, 30)}...
                          </div>
                        </td>
                      </tr>
                    ))}
                    {previewRecipients.length > 5 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-center text-sm text-gray-500">
                          + {previewRecipients.length - 5} more recipients
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Missing Variables Warning */}
          {hasMissingVariables && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Missing Variable Mappings</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Some template variables are not mapped. Recipients without these values will receive messages with empty fields.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rate Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate Control: {rateControl} messages per minute
            </label>
            <input
              type="range"
              min="1"
              max="1000"
              value={rateControl}
              onChange={(e) => setRateControl(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 msg/min</span>
              <span>1000 msg/min</span>
            </div>
          </div>

          {/* Test Send */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Test Send</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="text"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                placeholder="Enter test phone number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Button 
                variant="outline" 
                size="md" 
                onClick={handleSendTest}
                disabled={isSendingTest}
              >
                {isSendingTest ? 'Sending...' : 'Send Test'}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
            <Button variant="outline" size="md">
              Save as Draft
            </Button>
            <Button 
              variant="primary" 
              size="md" 
              onClick={handleCreateCampaign}
            >
              Launch Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;