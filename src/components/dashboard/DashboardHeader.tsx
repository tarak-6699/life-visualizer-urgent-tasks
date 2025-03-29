
import React from 'react';
import { useUser } from '@/contexts/UserContext';

interface DashboardHeaderProps {
  user: any; // Using any here to match existing implementation
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Dashboard
          <div className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here's your life overview for today.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
