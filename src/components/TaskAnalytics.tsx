
import React, { useMemo } from 'react';
import { useDbTodos } from '@/hooks/useDbTodos';
import { TodoPriority } from '@/hooks/useTodos';
import CompletionTrend from './analytics/CompletionTrend';
import PriorityDistribution from './analytics/PriorityDistribution';
import CompletionStatus from './analytics/CompletionStatus';
import RecentlyCompleted from './analytics/RecentlyCompleted';
import ProductiveDay from './analytics/ProductiveDay';
import TaskSummary from './analytics/TaskSummary';

const TaskAnalytics: React.FC = () => {
  const { todos, stats } = useDbTodos();
  
  // Get completed tasks
  const completedTasks = useMemo(() => 
    todos.filter(todo => todo.completed).sort((a, b) => 
      b.completedAt && a.completedAt 
        ? b.completedAt.getTime() - a.completedAt.getTime() 
        : 0
    ).slice(0, 5),
    [todos]
  );
  
  // Format data for recharts bar chart with correct day names
  const barChartData = useMemo(() => {
    return stats.last7Days.map(day => {
      const dayDate = new Date(day.date);
      // Format date correctly with locale - get actual day of week name
      return {
        name: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        value: day.completed,
        fullDate: dayDate // Store full date for tooltip
      };
    });
  }, [stats.last7Days]);
  
  // Pie chart data for priority distribution
  const priorityData = useMemo(() => {
    const priorities = { high: 0, medium: 0, low: 0 };
    
    todos.forEach(todo => {
      if (todo.priority) {
        priorities[todo.priority as TodoPriority] += 1;
      } else {
        priorities.medium += 1; // Default to medium if no priority set
      }
    });
    
    return Object.entries(priorities).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    })).filter(item => item.value > 0);
  }, [todos]);
  
  // Pie chart data for completion status
  const completionData = useMemo(() => {
    const completed = stats.completed;
    const total = stats.total;
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: total - completed }
    ].filter(item => item.value > 0);
  }, [stats.completed, stats.total]);
  
  // Get most productive day
  const mostProductiveDay = useMemo(() => {
    if (stats.last7Days.length === 0) return null;
    
    return stats.last7Days.reduce((most, current) => 
      current.completed > most.completed ? current : most, 
      stats.last7Days[0]
    );
  }, [stats.last7Days]);
  
  return (
    <div className="space-y-6">
      <CompletionTrend barChartData={barChartData} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <PriorityDistribution priorityData={priorityData} />
        <CompletionStatus completionData={completionData} total={stats.total} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <RecentlyCompleted completedTasks={completedTasks} />
        <ProductiveDay mostProductiveDay={mostProductiveDay} />
        <TaskSummary stats={stats} />
      </div>
    </div>
  );
};

export default TaskAnalytics;
