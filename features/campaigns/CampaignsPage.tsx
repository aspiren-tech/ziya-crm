import React, { useState } from 'react';
import { Plus, Search, Filter, Link as LinkIcon, Upload, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCampaignModule } from '../../contexts/CampaignModuleContext';
import Button from '../../components/shared/ui/Button';

const CampaignsPage: React.FC = () => {
  const { campaigns } = useCampaignModule();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-main">Campaigns</h1>
          <p className="text-text-light mt-1">Manage your marketing campaigns and track performance.</p>
        </div>
        <Link to="/campaigns/create">
          <Button 
            variant="primary" 
            size="md" 
            icon={Plus}
          >
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <LinkIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Connect Account</h3>
              <p className="text-sm text-gray-500">Connect WhatsApp Business</p>
            </div>
          </div>
          <Link to="/campaigns/accounts">
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
            >
              Connect
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Import Contacts</h3>
              <p className="text-sm text-gray-500">Upload CSV file</p>
            </div>
          </div>
          <Link to="/campaigns/import">
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
            >
              Import
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Create Campaign</h3>
              <p className="text-sm text-gray-500">New marketing campaign</p>
            </div>
          </div>
          <Link to="/campaigns/create">
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
            >
              Create
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Create Template</h3>
              <p className="text-sm text-gray-500">Meta-ready ad blueprint</p>
            </div>
          </div>
          <Link to="/campaigns/templates/new">
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
            >
              Build Template
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-gray-500 mr-2" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="queued">Queued</option>
                <option value="sending">Sending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/campaigns/${campaign.id}`} className="text-sm font-medium text-primary hover:underline">
                      {campaign.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                      campaign.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                      campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.status === 'completed' || campaign.status === 'sending' ? '1,250' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.status === 'completed' ? '98%' : campaign.status === 'sending' ? '75%' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(campaign.scheduleAt || campaign.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;