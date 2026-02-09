import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import Card from './Card';

// Generate mock data for different time periods
const generateSalesData = (period: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  switch (period) {
    case '6months':
      // Next 6 months
      const next6Months = [];
      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth + i) % 12;
        next6Months.push({
          name: months[monthIndex],
          revenue: Math.floor(Math.random() * 10000) + 3000
        });
      }
      return next6Months;
      
    case 'past6months':
      // Past 6 months
      const past6Months = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        past6Months.push({
          name: months[monthIndex],
          revenue: Math.floor(Math.random() * 10000) + 3000
        });
      }
      return past6Months;
      
    case 'year':
      // Full year (All Time)
      return months.map((month, index) => ({
        name: month,
        revenue: Math.floor(Math.random() * 10000) + 3000
      }));
      
    case 'month':
    default:
      // Current month data points (4 weeks)
      return [
        { name: 'Week 1', revenue: 4000 },
        { name: 'Week 2', revenue: 3000 },
        { name: 'Week 3', revenue: 5000 },
        { name: 'Week 4', revenue: 4500 }
      ];
  }
};

const SalesOverview: React.FC = () => {
  const [filter, setFilter] = useState('month');
  
  const data = useMemo(() => generateSalesData(filter), [filter]);

  const filterOptions = [
    { value: 'year', label: 'All Time' },
    { value: 'past6months', label: 'Past 6 Months' },
    { value: 'month', label: 'Current Month' },
    { value: '6months', label: 'Next 6 Months' }
  ];

  const selectedOption = filterOptions.find(option => option.value === filter);
  const selectedIndex = filterOptions.findIndex(option => option.value === filter);

  const handleSliderChange = (index: number) => {
    setFilter(filterOptions[index].value);
  };

  return (
    <Card title="Sales Overview" icon={TrendingUp}>
      {/* Slider Filter */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          {filterOptions.map((option, index) => (
            <span 
              key={option.value}
              className={`px-1 ${index === selectedIndex ? 'text-primary font-medium' : ''}`}
            >
              {option.label}
            </span>
          ))}
        </div>
        <input
          type="range"
          min="0"
          max={filterOptions.length - 1}
          value={selectedIndex}
          onChange={(e) => handleSliderChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="text-center text-sm font-medium text-primary mt-1">
          {selectedOption?.label}
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2a75d1" 
              strokeWidth={2} 
              activeDot={{ r: 8 }} 
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesOverview;