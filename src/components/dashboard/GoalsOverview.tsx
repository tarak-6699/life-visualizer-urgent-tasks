
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Target, Clock, Edit2, ListTodo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/dateUtils';
import GoalEditor from '@/components/GoalEditor';
import { Goal } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface GoalsOverviewProps {
  goals: Goal[];
  className?: string;
}

const GoalsOverview: React.FC<GoalsOverviewProps> = ({ goals, className }) => {
  const navigate = useNavigate();
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalSteps, setGoalSteps] = useState<Record<string, any[]>>({});
  const [loadingGoals, setLoadingGoals] = useState<string[]>([]);
  
  // Get incomplete goals for dashboard display
  const incompleteGoals = goals
    .filter(goal => !goal.completed)
    .slice(0, 3);

  useEffect(() => {
    // Fetch steps for each goal to calculate progress
    const fetchAllGoalSteps = async () => {
      if (incompleteGoals.length === 0) return;
      
      const goalIds = incompleteGoals.map(g => g.id);
      setLoadingGoals(goalIds);
      
      try {
        const { data, error } = await supabase
          .from('goal_steps')
          .select('*')
          .in('goal_id', goalIds);
        
        if (error) throw error;
        
        // Group steps by goal_id
        const stepsByGoal: Record<string, any[]> = {};
        data?.forEach(step => {
          if (!stepsByGoal[step.goal_id]) {
            stepsByGoal[step.goal_id] = [];
          }
          stepsByGoal[step.goal_id].push(step);
        });
        
        setGoalSteps(stepsByGoal);
      } catch (error) {
        console.error('Error fetching goal steps:', error);
      } finally {
        setLoadingGoals([]);
      }
    };
    
    fetchAllGoalSteps();
  }, [incompleteGoals]);

  const getGoalProgress = (goalId: string): number => {
    const steps = goalSteps[goalId] || [];
    if (steps.length === 0) return 0;
    
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };
  
  return (
    <Card className={cn("glass-card border-gradient shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Active Goals
          </CardTitle>
          <CardDescription>
            Your current goals and aspirations
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/goals')}
          className="transition-colors hover:bg-primary hover:text-white"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {incompleteGoals.length > 0 ? (
          <div className="space-y-3">
            {incompleteGoals.map(goal => (
              <div key={goal.id}>
                {editingGoalId === goal.id ? (
                  <GoalEditor 
                    goal={goal}
                    onSave={() => setEditingGoalId(null)}
                    onCancel={() => setEditingGoalId(null)}
                  />
                ) : (
                  <div className="p-3 border rounded-md flex flex-col gap-3 group hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{goal.title}</p>
                        {goal.targetDate && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            Due: {formatDate(goal.targetDate)}
                          </p>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setEditingGoalId(goal.id)}
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                    
                    {loadingGoals.includes(goal.id) ? (
                      <div className="animate-pulse h-2 bg-muted rounded w-full" />
                    ) : (goalSteps[goal.id]?.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <ListTodo className="h-3 w-3" />
                            {goalSteps[goal.id].filter(s => s.completed).length}/{goalSteps[goal.id].length} steps
                          </span>
                          <span>{getGoalProgress(goal.id)}%</span>
                        </div>
                        <Progress value={getGoalProgress(goal.id)} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-2 transition-colors hover:bg-primary hover:text-white" 
              onClick={() => navigate('/goals')}
            >
              View all goals
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Target className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-3">No goals added yet</p>
            <Button onClick={() => navigate('/goals')}>Add Your First Goal</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsOverview;
