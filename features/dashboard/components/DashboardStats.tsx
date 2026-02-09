import React from 'react';
import StatsCard from './StatsCard';
import { TrendingUp, Flame, CheckSquare, DollarSign } from 'lucide-react';
import { useDeals } from '../../../contexts/DealsContext';
import { useLeads } from '../../../contexts/LeadsContext';
import { useTasks } from '../../../contexts/TasksContext';

const DashboardStats: React.FC = () => {
    const { deals } = useDeals();
    const { leads } = useLeads();
    const { tasks } = useTasks();

    const dealsInPipeline = deals.filter(d => d.stage !== 'Closed - Won' && d.stage !== 'Closed - Lost').length;
    const hotLeads = leads.filter(l => l.score > 80).length;
    const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
    const totalRevenue = deals.filter(d => d.stage === 'Closed - Won').reduce((sum, d) => sum + d.value, 0);

  const stats = [
    { title: 'Deals in Pipeline', value: dealsInPipeline.toString(), icon: TrendingUp },
    { title: 'Hot Leads', value: hotLeads.toString(), icon: Flame },
    { title: 'Active Tasks', value: activeTasks.toString(), icon: CheckSquare },
    { title: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}k`, icon: DollarSign },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
      ))}
    </div>
  );
};

export default DashboardStats;