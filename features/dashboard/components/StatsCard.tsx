import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between min-h-[100px]">
      <div>
        <p className="text-sm text-text-light">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-text-main truncate">{value}</p>
      </div>
      <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
        <Icon className="w-6 h-6 text-text-light" />
      </div>
    </div>
  );
};

export default StatsCard;