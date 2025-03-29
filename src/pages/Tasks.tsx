
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import TodoList from '@/components/TodoList';
import { useTodos } from '@/hooks/useTodos';

const Tasks = () => {
  const { isProfileSetup } = useUser();
  const navigate = useNavigate();
  const { stats } = useTodos();
  
  useEffect(() => {
    if (!isProfileSetup) {
      navigate('/');
    }
  }, [isProfileSetup, navigate]);
  
  if (!isProfileSetup) return null;
  
  return (
    <div className="space-y-8 page-transition">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
        <p className="text-muted-foreground">
          Track your daily tasks and long-term goals.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-3 glass-card">
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              Manage your to-do list and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodoList />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Task Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed:</span>
                  <span className="font-medium">{stats.completed}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completion Rate:</span>
                  <span className="font-medium">{stats.completionRate.toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Task Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Use priorities to categorize your tasks:
                </p>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>High Priority</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>Medium Priority</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Low Priority</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Task Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  • Break down large goals into smaller tasks
                </p>
                <p>
                  • Focus on high-priority items first
                </p>
                <p>
                  • Schedule time for your most important tasks
                </p>
                <p>
                  • Review and update your tasks daily
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
