
import React, { Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LayoutGrid } from 'lucide-react';

// Lazy load the TaskAnalytics component
const TaskAnalytics = lazy(() => import('@/components/TaskAnalytics'));

// Simple loading fallback for TaskAnalytics
const AnalyticsLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

interface DashboardTabsProps {
  children: React.ReactNode;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ children }) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="w-full mb-6 grid grid-cols-2">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <LayoutGrid className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-1">
          <BarChart className="h-4 w-4" />
          <span>Analytics</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        {children}
      </TabsContent>
      
      <TabsContent value="analytics">
        <Suspense fallback={<AnalyticsLoader />}>
          <TaskAnalytics />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
