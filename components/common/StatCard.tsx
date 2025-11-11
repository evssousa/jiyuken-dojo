import React from 'react';

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-white shadow-sm rounded-lg p-5 border border-gray-200 flex flex-col ${className}`}>
      <div className="flex items-center text-gray-500 mb-3">
        <div className="mr-3">{icon}</div>
        <h4 className="font-semibold text-sm uppercase tracking-wider">{title}</h4>
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default StatCard;
