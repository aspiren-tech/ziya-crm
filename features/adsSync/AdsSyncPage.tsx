import React, { useState, useEffect } from 'react';
import type { AdLead } from '../../types';
import AdsLeadsTable from './components/AdsLeadsTable';
import MappingModal from './components/MappingModal';
import CampaignDetailView from './components/CampaignDetailView';
import LeadFormsTable from './components/LeadFormsTable';
import { CheckCircle, Layers, Link, LogIn, XCircle, BarChart3, RefreshCw, Shield, Code2, Activity, Database } from 'lucide-react';
import { useLeads } from '../../contexts/LeadsContext';
import { useMetaAccount } from '../../contexts/MetaAccountContext';
import Button from '../../components/shared/ui/Button';

// Define types for campaigns
interface AdCampaign {
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
  leads_count?: number;
}

// Define types for ad sets and ads
interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  created_time: string;
}

interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  creative_id: string;
  status: string;
  created_time: string;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  conversion_rate?: number;
}

// Define types for lead forms
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

const CONNECTOR_GUIDE = [
    {
        icon: Shield,
        title: 'Auth & Security',
        bullets: [
            'Use META_SYSTEM_USER_TOKEN with ads_read, ads_management, leads_retrieval scopes.',
            'Never expose raw tokens; only mask references when logging.',
            'All calls hit https://graph.facebook.com/{META_API_VERSION}/… over HTTPS.',
        ],
    },
    {
        icon: Activity,
        title: 'Supported Endpoints',
        bullets: [
            'Campaigns, ad sets, ads, insights by date range.',
            'Lead forms + lead submissions with cursor pagination.',
            'Rate limit friendly: retry guidance for (#4) errors.',
        ],
    },
    {
        icon: Database,
        title: 'Payload Contract',
        bullets: [
            'Return machine JSON: {type:"campaigns"| "leads"| "error", ...}.',
            'Include next_cursor for pagination + actions array for UI quick actions.',
            'Map field_data → CRM fields (email, full_name, phone_number, company).',
        ],
    },
    {
        icon: Code2,
        title: 'Publishing & Follow-ups',
        bullets: [
            'Provide Ads Manager links for campaigns and ads.',
            'Offer quick actions: export_csv, create_crm_contacts, view_in_ads_manager.',
            'Support revoke command to drop cached credentials securely.',
        ],
    },
];

const AdsSyncPage: React.FC = () => {
    const { metaAccount, connectAccount, disconnectAccount, refreshAdAccounts, fetchCampaigns, fetchLeadForms, fetchLeadsFromForm, isLoading, error } = useMetaAccount();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [loginError, setLoginError] = useState('');
    const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
    const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
    const [adLeads, setAdLeads] = useState<AdLead[]>([]);
    const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
    const [campaignDetailView, setCampaignDetailView] = useState<{id: string, name: string} | null>(null);
    const [leadFormsView, setLeadFormsView] = useState<{pageId: string, pageName: string} | null>(null);
    const [leadForms, setLeadForms] = useState<LeadForm[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
    const [formLeads, setFormLeads] = useState<LeadFormLead[]>([]);
    const [adSets, setAdSets] = useState<AdSet[]>([]);
    const [ads, setAds] = useState<Ad[]>([]);
    const [localLoading, setLocalLoading] = useState(false); // Local loading state
    const { addLeads, leads: crmLeads } = useLeads();

    // Fetch campaigns when account is connected and ad accounts become available
    useEffect(() => {
        if (metaAccount.isConnected && metaAccount.adAccounts.length > 0 && adCampaigns.length === 0) {
            // Add a small delay to ensure state is fully updated
            const timer = setTimeout(() => {
                handleRefreshCampaigns();
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [metaAccount.isConnected, metaAccount.adAccounts.length]);

    // Add isImported property to adLeads
    const adLeadsWithStatus = adLeads.map(lead => {
        const importedAdLeadIds = new Set(
            crmLeads
                .filter(l => l.id.startsWith('imported_'))
                .map(l => l.id.replace('imported_', ''))
        );
        return {
            ...lead,
            isImported: importedAdLeadIds.has(lead.id)
        };
    });

    const handleToggleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            const allUnimportedLeadIds = adLeadsWithStatus
                .filter(lead => !lead.isImported)
                .map(lead => lead.id);
            setSelectedLeads(new Set(allUnimportedLeadIds));
        } else {
            setSelectedLeads(new Set());
        }
    };

    const handleToggleSelectLead = (leadId: string) => {
        const newSelection = new Set(selectedLeads);
        if (newSelection.has(leadId)) {
            newSelection.delete(leadId);
        } else {
            newSelection.add(leadId);
        }
        setSelectedLeads(newSelection);
    };

    const handleImport = () => {
        const leadsToImport = adLeads.filter(adLead => selectedLeads.has(adLead.id));
        addLeads(leadsToImport);
        
        setSelectedLeads(new Set());
        setIsMappingModalOpen(false);
    };

    const handleImportFormLeads = (leads: LeadFormLead[]) => {
        // Convert LeadFormLead to AdLead format
        const adLeadsToImport: AdLead[] = leads.map(lead => {
            const fullName = lead.field_data.find(field => field.name === 'full_name')?.values[0] || '';
            const email = lead.field_data.find(field => field.name === 'email')?.values[0] || '';
            const phone = lead.field_data.find(field => field.name === 'phone_number')?.values[0] || '';
            const company = lead.field_data.find(field => field.name === 'company_name')?.values[0] || '';
            
            return {
                id: lead.id,
                created_time: lead.created_time,
                ad_name: lead.ad_name,
                campaign_name: lead.campaign_name,
                form_name: 'Lead Form',
                field_data: {
                    full_name: fullName,
                    email: email,
                    phone_number: phone,
                    company_name: company
                }
            };
        });
        
        addLeads(adLeadsToImport);
    };

    const handleConnectClick = () => {
        setIsLoginModalOpen(true);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (accessToken) {
            try {
                await connectAccount(accessToken);
                setIsLoginModalOpen(false);
                setAccessToken('');
                setLoginError('');
            } catch (err) {
                setLoginError(err instanceof Error ? err.message : 'Failed to connect');
            }
        } else {
            setLoginError('Please enter your access token');
        }
    };

    const handleDisconnect = () => {
        disconnectAccount();
        setAdLeads([]);
        setAdCampaigns([]);
        setAdSets([]);
        setAds([]);
        setLeadForms([]);
        setFormLeads([]);
        setSelectedLeads(new Set());
        setSelectedCampaign(null);
        setCampaignDetailView(null);
        setLeadFormsView(null);
        setSelectedFormId(null);
    };

    const handleAccessTokenChange = (value: string) => {
        setAccessToken(value);
        if (loginError) setLoginError('');
    };

    const handleRefreshCampaigns = async () => {
        if (metaAccount.adAccounts.length > 0) {
            try {
                const campaigns = await fetchCampaigns(metaAccount.adAccounts[0].id);
                setAdCampaigns(campaigns);
            } catch (err) {
                console.error('Failed to fetch campaigns:', err);
                // Set an error message to display to the user
                setLoginError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
            }
        } else {
            // Set an error message if no ad accounts are available
            setLoginError('No ad accounts found for this Meta account');
        }
    };

    const handleCampaignSelect = async (campaign: AdCampaign) => {
        setSelectedCampaign(campaign);
        setLocalLoading(true);
        
        try {
            // Fetch ad sets and ads for the selected campaign
            // Note: In a real implementation, you would fetch actual leads based on the campaign
            // For now, we'll keep the dummy data but show the campaign details
            const dummyLeads: AdLead[] = [
                {
                    id: `${campaign.id}_lead_1`,
                    created_time: new Date().toISOString(),
                    ad_name: `${campaign.name} - Ad 1`,
                    campaign_name: campaign.name,
                    form_name: 'Contact Us Form',
                    field_data: {
                        full_name: 'Alice Wonder',
                        email: 'alice.w@example.com',
                        phone_number: '+1-555-111-2222',
                        company_name: 'Wonderland Creations'
                    }
                },
                {
                    id: `${campaign.id}_lead_2`,
                    created_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    ad_name: `${campaign.name} - Ad 2`,
                    campaign_name: campaign.name,
                    form_name: 'Sign Up Form',
                    field_data: {
                        full_name: 'Bob Builder',
                        email: 'bob.b@example.net',
                        phone_number: '+1-555-333-4444',
                    }
                }
            ];
            
            setAdLeads(dummyLeads);
        } catch (err) {
            console.error('Failed to fetch campaign details:', err);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleViewCampaignDetails = (campaignId: string, campaignName: string) => {
        setCampaignDetailView({id: campaignId, name: campaignName});
    };

    const handleViewLeadForms = (pageId: string, pageName: string) => {
        setLeadFormsView({pageId, pageName});
    };

    const handleFetchLeadForms = async (pageId: string) => {
        try {
            const forms = await fetchLeadForms(pageId);
            setLeadForms(forms);
        } catch (err) {
            console.error('Failed to fetch lead forms:', err);
        }
    };

    const handleFetchLeadsFromForm = async (formId: string) => {
        setSelectedFormId(formId);
        setLocalLoading(true);
        
        try {
            const leads = await fetchLeadsFromForm(formId);
            setFormLeads(leads);
        } catch (err) {
            console.error('Failed to fetch leads from form:', err);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleBackToCampaigns = () => {
        setSelectedCampaign(null);
        setAdLeads([]);
        setSelectedLeads(new Set());
        setAdSets([]);
        setAds([]);
    };

    const handleBackFromCampaignDetail = () => {
        setCampaignDetailView(null);
    };

    const handleBackFromLeadForms = () => {
        setLeadFormsView(null);
        setLeadForms([]);
        setSelectedFormId(null);
        setFormLeads([]);
    };

    // Render campaign list view
    const renderCampaignsView = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-text-main">Ad Campaigns</h2>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefreshCampaigns}
                        icon={RefreshCw}
                        iconPosition="left"
                        disabled={isLoading}
                    >
                        Refresh
                    </Button>
                </div>
            </div>
            {error && (
                <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
                    Error: {error}
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objective</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {adCampaigns.map((campaign) => (
                            <tr key={campaign.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
                                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {campaign.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {campaign.objective?.replace('_', ' ') || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {campaign.spend ? `$${campaign.spend.toFixed(2)}` : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {campaign.impressions?.toLocaleString() || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {campaign.clicks?.toLocaleString() || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {campaign.conversions?.toLocaleString() || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewCampaignDetails(campaign.id, campaign.name)}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCampaignSelect(campaign);
                                        }}
                                    >
                                        View Leads
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {adCampaigns.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No campaigns found</p>
                </div>
            )}
        </div>
    );

    // Render leads view
    const renderLeadsView = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToCampaigns}
                    className="mb-2"
                >
                    ← Back to Campaigns
                </Button>
                <h2 className="text-xl font-semibold text-text-main">
                    Leads for "{selectedCampaign?.name}"
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Double-click on any row to view lead details
                </p>
            </div>
            {(isLoading || localLoading) ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading leads...</p>
                </div>
            ) : adLeads.length > 0 ? (
                <>
                    <AdsLeadsTable
                        adLeads={adLeadsWithStatus}
                        selectedLeads={selectedLeads}
                        onToggleSelectAll={handleToggleSelectAll}
                        onToggleSelectLead={handleToggleSelectLead}
                    />
                    <div className="p-4 border-t flex justify-end">
                        <Button
                            onClick={() => setIsMappingModalOpen(true)}
                            variant="primary"
                            size="md"
                            icon={LogIn}
                            iconPosition="left"
                            disabled={selectedLeads.size === 0}
                        >
                            Import {selectedLeads.size > 0 ? `(${selectedLeads.size})` : ''} Selected Leads
                        </Button>
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No leads found for this campaign</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-text-main">Meta Ads Lead Sync</h1>
                {!metaAccount.isConnected ? (
                    <Button
                        onClick={handleConnectClick}
                        variant="primary"
                        size="md"
                        icon={Link}
                        iconPosition="left"
                    >
                        Connect to Meta Account
                    </Button>
                ) : (
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-green-600 font-semibold">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Connected as {metaAccount.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                            ({metaAccount.adAccounts.length} ad account{metaAccount.adAccounts.length !== 1 ? 's' : ''})
                        </div>
                        <Button
                            onClick={handleDisconnect}
                            variant="secondary"
                            size="md"
                            icon={XCircle}
                            iconPosition="left"
                        >
                            Disconnect
                        </Button>
                    </div>
                )}
            </div>

            <section className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                            Meta Ads & Leads Connector
                        </p>
                        <h2 className="text-xl font-bold text-gray-900 mt-1">
                            Machine-friendly API contract for campaigns, ads, insights & lead forms
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            This workspace issues HTTPS calls to Graph using your configured META_API_VERSION, AD_ACCOUNT_ID, and META_SYSTEM_USER_TOKEN.
                            Responses must remain JSON-only for CRM consumption and mask all sensitive credentials.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CONNECTOR_GUIDE.map((card) => (
                        <div key={card.title} className="rounded-lg bg-white/80 p-4 shadow-sm border border-white">
                            <div className="flex items-center gap-3">
                                <card.icon className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                            </div>
                            <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc list-inside">
                                {card.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {!metaAccount.isConnected ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Layers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-text-main">Not Connected</h2>
                    <p className="text-text-light mt-2">
                        Please connect your Meta (Facebook/Instagram) account to fetch and sync your ad leads.
                    </p>
                </div>
            ) : campaignDetailView ? (
                <CampaignDetailView 
                    campaignId={campaignDetailView.id} 
                    campaignName={campaignDetailView.name} 
                    onBack={handleBackFromCampaignDetail} 
                />
            ) : leadFormsView ? (
                <LeadFormsTable
                    leadForms={leadForms}
                    onFetchLeads={handleFetchLeadsFromForm}
                    isFetchingLeads={localLoading}
                    selectedFormId={selectedFormId}
                    leads={formLeads}
                    onImportLeads={handleImportFormLeads}
                    onBack={handleBackFromLeadForms}
                />
            ) : selectedCampaign ? (
                renderLeadsView()
            ) : adCampaigns.length === 0 && (isLoading || localLoading) ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-text-main">Fetching Ad Campaigns</h2>
                    <p className="text-text-light mt-2">
                        Please wait while we fetch your ad campaigns from Meta...
                    </p>
                </div>
            ) : adCampaigns.length === 0 && !isLoading && !localLoading && metaAccount.isConnected ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Layers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-text-main">No Campaigns Found</h2>
                    <p className="text-text-light mt-2">
                        {metaAccount.adAccounts.length > 0 
                            ? "We couldn't find any campaigns in your Meta ad account." 
                            : "No ad accounts found for your Meta account."}
                    </p>
                    <div className="mt-4 space-x-2">
                        {metaAccount.adAccounts.length > 0 && (
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleRefreshCampaigns}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Refreshing...' : 'Refresh Campaigns'}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleDisconnect}
                        >
                            Disconnect Account
                        </Button>
                    </div>
                </div>
            ) : (
                renderCampaignsView()
            )}
            
            {isMappingModalOpen && (
                <MappingModal
                    onClose={() => setIsMappingModalOpen(false)}
                    onConfirmImport={handleImport}
                    selectedCount={selectedLeads.size}
                />
            )}
            
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-center mb-4">Connect to Meta Account</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Enter your Meta access token to connect your account.
                        </p>
                        
                        <form onSubmit={handleLoginSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Access Token
                                </label>
                                <input
                                    type="password"
                                    value={accessToken}
                                    onChange={(e) => handleAccessTokenChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter your access token"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    You can generate an access token from the Meta Developer Portal
                                </p>
                            </div>
                            
                            {loginError && (
                                <div className="mb-4 text-red-600 text-sm text-center">
                                    {loginError}
                                </div>
                            )}
                            
                            {error && (
                                <div className="mb-4 text-red-600 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            
                            <div className="flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    size="md"
                                    onClick={() => {
                                        setIsLoginModalOpen(false);
                                        setLoginError('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    size="md"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Connecting...' : 'Connect'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdsSyncPage;