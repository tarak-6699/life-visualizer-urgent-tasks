
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDbGoals } from '@/hooks/useDbGoals';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from '@/utils/dateUtils';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = {
  completed: '#10b981', // green
  inProgress: '#3b82f6', // blue
  shortTerm: '#8b5cf6', // purple
  mediumTerm: '#6366f1', // indigo
  longTerm: '#2563eb', // blue
};

const GoalAnalytics = () => {
  const { goals, isLoading } = useDbGoals();
  
  const analytics = useMemo(() => {
    // Skip calculations if still loading
    if (isLoading || !goals.length) {
      return {
        byTimeframe: { shortTerm: 0, mediumTerm: 0, longTerm: 0 },
        byStatus: { completed: 0, inProgress: 0 },
        completionRate: 0,
        totalGoals: 0,
        upcoming: []
      };
    }
    
    const now = new Date();
    const oneMonth = new Date(now);
    oneMonth.setMonth(now.getMonth() + 1);
    
    const threeMonths = new Date(now);
    threeMonths.setMonth(now.getMonth() + 3);
    
    // Calculate goals by timeframe
    const shortTerm = goals.filter(g => g.targetDate && g.targetDate <= oneMonth).length;
    const mediumTerm = goals.filter(g => g.targetDate && g.targetDate > oneMonth && g.targetDate <= threeMonths).length;
    const longTerm = goals.filter(g => g.targetDate && g.targetDate > threeMonths).length;
    
    // Calculate goals by status
    const completed = goals.filter(g => g.completed).length;
    const inProgress = goals.filter(g => !g.completed).length;
    
    // Calculate completion rate
    const completionRate = goals.length ? Math.round((completed / goals.length) * 100) : 0;
    
    // Get upcoming goals (next 7 days)
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    const upcoming = goals
      .filter(g => !g.completed && g.targetDate && g.targetDate >= now && g.targetDate <= nextWeek)
      .sort((a, b) => (a.targetDate && b.targetDate) ? a.targetDate.getTime() - b.targetDate.getTime() : 0)
      .slice(0, 3);
    
    return {
      byTimeframe: { shortTerm, mediumTerm, longTerm },
      byStatus: { completed, inProgress },
      completionRate,
      totalGoals: goals.length,
      upcoming
    };
  }, [goals, isLoading]);
  
  // Data for charts
  const statusData = [
    { name: 'Completed', value: analytics.byStatus.completed },
    { name: 'In Progress', value: analytics.byStatus.inProgress },
  ];
  
  const timeframeData = [
    { name: 'Short Term', value: analytics.byTimeframe.shortTerm },
    { name: 'Medium Term', value: analytics.byTimeframe.mediumTerm },
    { name: 'Long Term', value: analytics.byTimeframe.longTerm },
  ];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
      >
        {name} ({`${(percent * 100).toFixed(0)}%`})
      </text>
    );
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-20" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display message when no goals are available
  if (!goals.length) {
    return (
      <Card className="glass-card bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle>Goal Insights</CardTitle>
          <CardDescription>
            Start by adding some goals to see analytics and insights
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Your goal analytics will appear here once you add your first goal.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Status Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Goal Status</CardTitle>
          <CardDescription>
            {analytics.completionRate}% completion rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={750}
                animationEasing="ease-out"
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? COLORS.completed : COLORS.inProgress} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} goals`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Timeframe Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Goal Timeframes</CardTitle>
          <CardDescription>
            Distribution by time horizon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeframeData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value) => [`${value} goals`, '']} />
              <Bar 
                dataKey="value" 
                animationDuration={750}
                animationEasing="ease-out"
              >
                {timeframeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      index === 0 ? COLORS.shortTerm : 
                      index === 1 ? COLORS.mediumTerm : COLORS.longTerm
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Upcoming Goals */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          <CardDescription>
            Goals due in the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.upcoming.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No goals due in the next 7 days
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.upcoming.map(goal => (
                <div 
                  key={goal.id} 
                  className="p-3 border rounded-md bg-gradient-to-r from-primary/5 to-transparent"
                >
                  <div className="font-medium">{goal.title}</div>
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span>Due: {goal.targetDate ? formatDate(goal.targetDate) : 'No date'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalAnalytics;
