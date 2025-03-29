
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckSquare, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/dateUtils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
}

interface TasksOverviewProps {
  todos: Task[];
}

const TasksOverview: React.FC<TasksOverviewProps> = ({ todos }) => {
  const navigate = useNavigate();
  
  // Filter to show only 3 highest priority incomplete tasks
  const dashboardTodos = useMemo(() => {
    // First filter for incomplete todos
    const incompleteTodos = todos.filter(todo => !todo.completed);
    
    // Then sort by priority and due date
    return [...incompleteTodos].sort((a, b) => {
      // First by priority
      const priorityValue = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityValue[a.priority] - priorityValue[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date (if available)
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      
      return 0;
    }).slice(0, 3);
  }, [todos]);
  
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Open Tasks
          </CardTitle>
          <CardDescription>
            Your high priority tasks that need attention
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/tasks')}
          className="transition-colors hover:bg-primary hover:text-white"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {dashboardTodos.length > 0 ? (
          <div className="space-y-3">
            {dashboardTodos.map(todo => (
              <div key={todo.id} className="p-3 border rounded-md flex items-start gap-3 hover:bg-muted/50 transition-colors">
                <div className={`w-3 h-3 mt-1 rounded-full flex-shrink-0 ${
                  todo.priority === 'high' ? 'bg-red-500 animate-pulse' :
                  todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{todo.text}</p>
                  {todo.dueDate && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      Due: {formatDate(todo.dueDate)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4 transition-colors hover:bg-primary hover:text-white" 
              onClick={() => navigate('/tasks')}
            >
              View all tasks
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-3">No pending tasks</p>
            <Button onClick={() => navigate('/tasks')}>Add Your First Task</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksOverview;
