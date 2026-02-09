
import React from 'react';
import SalesOverview from './components/SalesOverview';
import MyTasks from './components/MyTasks';
import DealPipeline from './components/DealPipeline';
import LeadConversion from './components/LeadConversion';
import DashboardStats from './components/DashboardStats';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-main">Dashboard</h1>
        <p className="text-text-light mt-1">Here's a snapshot of your business activities.</p>
      </div>
      
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesOverview />
        <MyTasks />
        <DealPipeline />
        <LeadConversion />
      </div>
    </div>
  );
};

export default DashboardPage;