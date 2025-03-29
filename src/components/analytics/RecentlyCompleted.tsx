
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Clock } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { Todo } from '@/hooks/useTodos';

interface RecentlyCompletedProps {
  completedTasks: Todo[];
}

const RecentlyCompleted: React.FC<RecentlyCompletedProps> = ({ completedTasks }) => {
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <CheckSquare className="mr-2 h-4 w-4 text-primary" />
          Recently Completed
        </CardTitle>
      </CardHeader>
      <CardContent>
        {completedTasks.length > 0 ? (
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div key={task.id} className="p-2 bg-muted/50 rounded-md text-sm">
                <p className="line-through">{task.text}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  {task.completedAt ? formatDate(task.completedAt) : 'Unknown date'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground text-sm">
            No completed tasks yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(RecentlyCompleted);
