
import React, { memo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';
import { TodoPriority } from '@/hooks/useTodos';

interface PriorityDistributionProps {
  priorityData: {
    name: string;
    value: number;
  }[];
}

const PRIORITY_COLORS = {
  high: '#EF4444',  // red
  medium: '#F59E0B', // yellow
  low: '#10B981',   // green
};

const PriorityDistribution: React.FC<PriorityDistributionProps> = ({ priorityData }) => {
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Priority Distribution
        </CardTitle>
        <CardDescription>
          Tasks by priority level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PRIORITY_COLORS[entry.name.toLowerCase() as TodoPriority] || '#8884d8'} 
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No tasks to analyze</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(PriorityDistribution);
