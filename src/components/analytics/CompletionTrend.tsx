
import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface CompletionTrendProps {
  barChartData: {
    name: string;
    value: number;
    fullDate: Date;
  }[];
}

// Custom tooltip for bar chart to show date and completed tasks
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p className="font-medium">{label}, {formatDate(data.fullDate)}</p>
        <p>{`${payload[0].value} tasks completed`}</p>
      </div>
    );
  }
  return null;
};

const CompletionTrend: React.FC<CompletionTrendProps> = ({ barChartData }) => {
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Task Completion Trend
        </CardTitle>
        <CardDescription>
          Tasks completed over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(CompletionTrend);
