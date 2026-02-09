import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, Image, Play, TrendingUp, MousePointer, Eye, Users } from 'lucide-react';
import Button from '../../../components/shared/ui/Button';
import { useMetaAccount } from '../../../contexts/MetaAccountContext';

interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  created_time: string;
  start_time?: string;
  end_time?: string;
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

interface CampaignDetailViewProps {
  campaignId: string;
  campaignName: string;
  onBack: () => void;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({ campaignId, campaignName, onBack }) => {
  const { fetchAdSets, fetchAds, isLoading, error } = useMetaAccount();
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [activeTab, setActiveTab] = useState<'adsets' | 'ads'>('adsets');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedAdSets, fetchedAds] = await Promise.all([
          fetchAdSets(campaignId),
          fetchAds(campaignId)
        ]);
        setAdSets(fetchedAdSets);
        setAds(fetchedAds);
      } catch (err) {
        console.error('Failed to fetch campaign details:', err);
      }
    };

    loadData();
  }, [campaignId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return `$${amount.toFixed(2)}`;
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="mr-4"
            icon={ArrowLeft}
            iconPosition="left"
          >
            Back to Campaigns
          </Button>
          <h1 className="text-2xl font-bold text-text-main">Campaign: {campaignName}</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('adsets')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'adsets'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ad Sets ({adSets.length})
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ads'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ads ({ads.length})
          </button>
        </nav>
      </div>

      {activeTab === 'adsets' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Set Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adSets.map((adSet) => (
                  <tr key={adSet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{adSet.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(adSet.status)}`}>
                        {adSet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(adSet.created_time).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adSet.start_time ? new Date(adSet.start_time).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adSet.end_time ? new Date(adSet.end_time).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {adSets.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No ad sets found for this campaign</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <MousePointer className="w-4 h-4 mr-1" />
                      CTR
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      CPC
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      CPM
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Conversion Rate
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ad.status)}`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercentage(ad.ctr)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(ad.cpc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(ad.cpm)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercentage(ad.conversion_rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ads.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No ads found for this campaign</p>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading campaign details...</p>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailView;