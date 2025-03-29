
import React, { useState, useEffect } from 'react';
import { PlusCircle, Target, ChevronDown, ChevronUp, Clock, CalendarIcon, Edit, Trash2, CheckSquare, MoreHorizontal, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDate, formatRelativeTime } from '@/utils/dateUtils';
import { useDbGoals } from '@/hooks/useDbGoals';
import { Goal } from '@/contexts/UserContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import GoalStepEditor from '@/components/GoalStepEditor';
import { Progress } from '@/components/ui/progress';
import { DbGoalStep } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

const TIMEFRAMES = [
  { value: "week", label: "1 Week" },
  { value: "month", label: "1 Month" },
  { value: "quarter", label: "3 Months" },
  { value: "halfYear", label: "6 Months" },
  { value: "year", label: "1 Year" },
  { value: "fiveYear", label: "5 Years" },
  { value: "custom", label: "Custom Date" }
];

const GoalManager: React.FC = () => {
  const { goals, addGoal, updateGoal, removeGoal, isLoading, refresh } = useDbGoals();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [goalSteps, setGoalSteps] = useState<Record<string, DbGoalStep[]>>({});
  const [editingStepsForGoalId, setEditingStepsForGoalId] = useState<string | null>(null);
  const [loadingStepsForGoalId, setLoadingStepsForGoalId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState('month');
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [completed, setCompleted] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const calculateTargetDate = (timeframeValue: string): Date => {
    const now = new Date();
    
    switch (timeframeValue) {
      case 'week':
        return new Date(now.setDate(now.getDate() + 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() + 3));
      case 'halfYear':
        return new Date(now.setMonth(now.getMonth() + 6));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      case 'fiveYear':
        return new Date(now.setFullYear(now.getFullYear() + 5));
      default:
        return new Date(now.setMonth(now.getMonth() + 1)); // Default to 1 month
    }
  };
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    if (value !== 'custom') {
      setTargetDate(calculateTargetDate(value));
    }
  };
  
  const handleAddGoal = () => {
    if (!title || !targetDate) return;
    
    addGoal({
      title,
      description,
      targetDate,
      completed: false
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setTimeframe('month');
    setTargetDate(undefined);
    setCompleted(false);
    setIsAddDialogOpen(false);
  };
  
  const handleEditGoal = () => {
    if (!editingGoal || !title || !targetDate) return;
    
    updateGoal(editingGoal.id, {
      title,
      description,
      targetDate,
      completed
    });
    
    setIsEditDialogOpen(false);
    setEditingGoal(null);
  };
  
  const handleToggleGoalComplete = (goal: Goal, isCompleted: boolean) => {
    updateGoal(goal.id, {
      completed: isCompleted
    });
  };
  
  const handleDeleteGoal = (id: string) => {
    removeGoal(id);
  };
  
  const startEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description);
    setTargetDate(goal.targetDate || undefined);
    setCompleted(goal.completed);
    setTimeframe('custom'); // Default to custom when editing
    setIsEditDialogOpen(true);
  };
  
  const toggleGoalExpansion = (id: string) => {
    if (expandedGoalId === id) {
      setExpandedGoalId(null);
    } else {
      setExpandedGoalId(id);
      if (!goalSteps[id]) {
        fetchGoalSteps(id);
      }
    }
  };

  const fetchGoalSteps = async (goalId: string) => {
    setLoadingStepsForGoalId(goalId);
    try {
      const { data, error } = await supabase
        .from('goal_steps')
        .select('*')
        .eq('goal_id', goalId)
        .order('order', { ascending: true });
      
      if (error) throw error;
      
      setGoalSteps(prev => ({
        ...prev,
        [goalId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching goal steps:', error);
    } finally {
      setLoadingStepsForGoalId(null);
    }
  };

  const refreshGoalSteps = async (goalId: string) => {
    await fetchGoalSteps(goalId);
    setEditingStepsForGoalId(null);
  };
  
  const isLongTerm = (goal: Goal): boolean => {
    if (!goal.targetDate) return false;
    
    const now = new Date();
    const threeMonthsFromNow = new Date(now);
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    
    return goal.targetDate > threeMonthsFromNow;
  };

  const getGoalProgress = (goalId: string): number => {
    const steps = goalSteps[goalId] || [];
    if (steps.length === 0) return 0;
    
    const completedSteps = steps.filter(step => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };
  
  const shortTermGoals = goals.filter(g => !isLongTerm(g)) || [];
  const longTermGoals = goals.filter(isLongTerm) || [];
  
  useEffect(() => {
    // Fetch steps for the expanded goal if not already loaded
    if (expandedGoalId && !goalSteps[expandedGoalId]) {
      fetchGoalSteps(expandedGoalId);
    }
  }, [expandedGoalId]);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Goals</h2>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <Tabs defaultValue="short-term">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="short-term" className="flex-1">Short Term</TabsTrigger>
            <TabsTrigger value="long-term" className="flex-1">Long Term</TabsTrigger>
          </TabsList>
          <TabsContent value="short-term">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="long-term">
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  const GoalList = ({ goals }: { goals: Goal[] }) => (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <p className="text-center py-6 text-muted-foreground">No goals added yet.</p>
      ) : (
        goals.map(goal => {
          const progress = getGoalProgress(goal.id);
          const steps = goalSteps[goal.id] || [];
          const isEditing = editingStepsForGoalId === goal.id;
          const isLoadingSteps = loadingStepsForGoalId === goal.id;

          return (
            <div 
              key={goal.id} 
              className="border rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                onClick={() => toggleGoalExpansion(goal.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`goal-${goal.id}`}
                      checked={goal.completed}
                      onCheckedChange={(checked) => {
                        handleToggleGoalComplete(goal, checked === true);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mr-2"
                    />
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <span className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {goal.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {goal.targetDate && (
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">
                      {formatRelativeTime(goal.targetDate)}
                    </span>
                  )}
                  {expandedGoalId === goal.id ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </div>
              </div>
              
              {expandedGoalId === goal.id && (
                <div className="p-4 border-t bg-muted/30">
                  {goal.description && (
                    <p className="text-sm mb-4">{goal.description}</p>
                  )}
                  
                  {goal.targetDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {/* Goal steps section */}
                  {isEditing ? (
                    <GoalStepEditor 
                      goalId={goal.id}
                      steps={steps}
                      onSave={() => refreshGoalSteps(goal.id)}
                      onCancel={() => setEditingStepsForGoalId(null)}
                    />
                  ) : (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium flex items-center gap-1">
                          <ListTodo className="h-4 w-4" />
                          Steps
                        </h4>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStepsForGoalId(goal.id);
                          }}
                        >
                          {steps.length > 0 ? "Edit Steps" : "Add Steps"}
                        </Button>
                      </div>
                      
                      {isLoadingSteps ? (
                        <div className="space-y-2">
                          {[1, 2].map(i => (
                            <Skeleton key={i} className="h-8 w-full" />
                          ))}
                        </div>
                      ) : steps.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {steps.map(step => (
                            <div 
                              key={step.id} 
                              className="flex items-start gap-2 p-2 border rounded bg-background/60"
                            >
                              <Checkbox 
                                id={`step-${step.id}`}
                                checked={step.completed}
                                onCheckedChange={async (checked) => {
                                  try {
                                    await supabase
                                      .from('goal_steps')
                                      .update({ completed: checked === true })
                                      .eq('id', step.id);
                                    
                                    fetchGoalSteps(goal.id);
                                  } catch (error) {
                                    console.error('Error updating step:', error);
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div>
                                <p className={`text-sm font-medium ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {step.title}
                                </p>
                                {step.description && (
                                  <p className={`text-xs mt-1 ${step.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                    {step.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No steps added yet. Break down your goal to track progress better.
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(goal);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(goal.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Goals</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>
                Create a new goal with a target completion date.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Goal title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="timeframe" className="text-sm font-medium">
                  Timeframe
                </label>
                <Select value={timeframe} onValueChange={handleTimeframeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEFRAMES.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {timeframe === 'custom' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Target Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {targetDate ? formatDate(targetDate) : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={targetDate}
                        onSelect={setTargetDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal}>Add Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
              <DialogDescription>
                Update your goal details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="edit-title"
                  placeholder="Goal title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe your goal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Target Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {targetDate ? formatDate(targetDate) : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={targetDate}
                      onSelect={setTargetDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="completed" 
                  checked={completed} 
                  onCheckedChange={(checked) => setCompleted(checked === true)}
                />
                <label htmlFor="completed" className="text-sm font-medium">
                  Mark as completed
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditGoal}>Update Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="short-term">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="short-term" className="flex-1">Short Term</TabsTrigger>
          <TabsTrigger value="long-term" className="flex-1">Long Term</TabsTrigger>
        </TabsList>
        <TabsContent value="short-term">
          <GoalList goals={shortTermGoals} />
        </TabsContent>
        <TabsContent value="long-term">
          <GoalList goals={longTermGoals} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalManager;
