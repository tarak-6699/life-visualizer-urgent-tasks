
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskSummaryProps {
  stats: {
    completed: number;
    total: number;
    completionRate: number;
  };
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ stats }) => {
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Task Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Tasks:</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed:</span>
              <span className="font-medium">{stats.completed}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending:</span>
              <span className="font-medium">{stats.total - stats.completed}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion Rate:</span>
              <span className="font-medium">{stats.completionRate.toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-purple-500" 
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(TaskSummary);
