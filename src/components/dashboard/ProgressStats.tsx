
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Zap } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: Date;
  priority: 'high' | 'medium' | 'low';
}

interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

interface Stats {
  completed: number;
  total: number;
  completionRate: number;
}

interface ProgressStatsProps {
  todos: Task[];
  stats: Stats;
  goals: Goal[];
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ todos, stats, goals }) => {
  
  // Calculate current day streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if completed any task today
    const completedToday = todos.some(todo => {
      if (!todo.completedAt) return false;
      const completedDate = new Date(todo.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
    
    if (completedToday) {
      streak = 1;
      let checkDate = new Date(today);
      
      // Check previous days
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        
        const completedOnDay = todos.some(todo => {
          if (!todo.completedAt) return false;
          const completedDate = new Date(todo.completedAt);
          completedDate.setHours(0, 0, 0, 0);
          return completedDate.getTime() === checkDate.getTime();
        });
        
        if (completedOnDay) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  }, [todos]);
  
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Your Progress
        </CardTitle>
        <CardDescription>
          Keep your momentum going
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current streak */}
          <div className="text-center pb-4 border-b">
            <Zap className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
            <div className="text-3xl font-bold">{currentStreak}</div>
            <p className="text-sm text-muted-foreground">
              Day{currentStreak !== 1 ? 's' : ''} streak
            </p>
          </div>
          
          {/* Task statistics */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium">Task Completion</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span>{stats.completed} / {stats.total}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-500" 
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          
          {/* Goals progress */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium">Goals Progress</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span>
                {goals.filter(g => g.completed).length} / {goals.length}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-500" 
                style={{ 
                  width: goals.length ? 
                    `${(goals.filter(g => g.completed).length / goals.length) * 100}%` : 
                    '0%' 
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
