
import React, { memo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

interface CompletionStatusProps {
  completionData: {
    name: string;
    value: number;
  }[];
  total: number;
}

const CompletionStatus: React.FC<CompletionStatusProps> = ({ completionData, total }) => {
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          Completion Status
        </CardTitle>
        <CardDescription>
          Overall task completion ratio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10B981" /> {/* Completed */}
                  <Cell fill="#94A3B8" /> {/* Pending */}
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

export default memo(CompletionStatus);
