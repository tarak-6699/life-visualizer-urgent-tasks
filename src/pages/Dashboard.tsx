
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useDbTodos } from '@/hooks/useDbTodos';
import { useDbGoals } from '@/hooks/useDbGoals';
import QuoteCard from '@/components/QuoteCard';

// Import refactored dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LifeMetrics from '@/components/dashboard/LifeMetrics';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import ProgressOverview from '@/components/dashboard/ProgressOverview';
import TasksOverview from '@/components/dashboard/TasksOverview';
import GoalsOverview from '@/components/dashboard/GoalsOverview';
import ProgressStats from '@/components/dashboard/ProgressStats';
import QuickNavigation from '@/components/dashboard/QuickNavigation';

const Dashboard = () => {
  const { user, isProfileSetup } = useUser();
  const navigate = useNavigate();
  const { todos, stats, refresh: refreshTodos } = useDbTodos();
  const { goals, refresh: refreshGoals } = useDbGoals();
  
  // Force data refresh on component mount
  useEffect(() => {
    refreshTodos();
    refreshGoals();
  }, [refreshTodos, refreshGoals]);
  
  useEffect(() => {
    if (!isProfileSetup) {
      navigate('/');
    }
  }, [isProfileSetup, navigate]);
  
  if (!isProfileSetup) return null;
  
  return (
    <div className="space-y-8 page-transition">
      <DashboardHeader user={user} />
      
      <LifeMetrics />
      
      <QuoteCard />
      
      <DashboardTabs>
        <div className="grid gap-6 md:grid-cols-2">
          <ProgressOverview />
          <TasksOverview todos={todos} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <GoalsOverview goals={goals} className="md:col-span-2" />
          <ProgressStats todos={todos} stats={stats} goals={goals} />
        </div>
      </DashboardTabs>
      
      <QuickNavigation />
    </div>
  );
};

export default Dashboard;
