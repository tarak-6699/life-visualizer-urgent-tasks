
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DbGoalStep } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

interface GoalStepEditorProps {
  goalId: string;
  steps: DbGoalStep[];
  onSave: () => void;
  onCancel: () => void;
}

const GoalStepEditor: React.FC<GoalStepEditorProps> = ({ goalId, steps, onSave, onCancel }) => {
  const [localSteps, setLocalSteps] = useState<(DbGoalStep & { isNew?: boolean })[]>(steps);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddStep = () => {
    const newOrder = localSteps.length > 0 
      ? Math.max(...localSteps.map(s => s.order)) + 1 
      : 0;
    
    setLocalSteps([
      ...localSteps, 
      {
        id: `temp-${Date.now()}`,
        goal_id: goalId,
        user_id: '', // Will be set by the server
        title: '',
        description: null,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order: newOrder,
        isNew: true,
      }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    setLocalSteps(localSteps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: string, value: any) => {
    setLocalSteps(localSteps.map((step, i) => {
      if (i === index) {
        return {
          ...step,
          [field]: value,
          updated_at: new Date().toISOString(),
        };
      }
      return step;
    }));
  };

  const handleSave = async () => {
    if (localSteps.some(step => !step.title.trim())) {
      toast({
        variant: "destructive",
        title: "Step title required",
        description: "All steps must have a title.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // For each new step, create it
      const newSteps = localSteps.filter(step => step.isNew);
      const existingSteps = localSteps.filter(step => !step.isNew);

      // Create new steps
      if (newSteps.length > 0) {
        const { error: insertError } = await supabase
          .from('goal_steps')
          .insert(
            newSteps.map(step => ({
              goal_id: goalId,
              title: step.title,
              description: step.description,
              completed: step.completed,
              order: step.order,
            }))
          );

        if (insertError) throw insertError;
      }

      // Update existing steps
      for (const step of existingSteps) {
        const { error: updateError } = await supabase
          .from('goal_steps')
          .update({
            title: step.title,
            description: step.description,
            completed: step.completed,
            order: step.order,
          })
          .eq('id', step.id);

        if (updateError) throw updateError;
      }

      // Get IDs of steps to delete (those that were removed)
      const deletedStepIds = steps
        .filter(origStep => !localSteps.some(s => s.id === origStep.id && !s.isNew))
        .map(step => step.id);

      // Delete removed steps
      if (deletedStepIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('goal_steps')
          .delete()
          .in('id', deletedStepIds);

        if (deleteError) throw deleteError;
      }

      toast({
        title: "Steps saved",
        description: "Goal steps have been updated successfully.",
      });
      onSave();
    } catch (error: any) {
      console.error('Error saving goal steps:', error);
      toast({
        variant: "destructive",
        title: "Failed to save steps",
        description: error.message || "An error occurred while saving steps.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/20 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Goal Steps</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleAddStep}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </Button>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {localSteps.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-2">
            No steps added. Break down your goal into actionable steps.
          </p>
        ) : (
          localSteps.map((step, index) => (
            <div key={step.id} className="border rounded-md p-3 bg-card shadow-sm space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <Checkbox
                    id={`step-${step.id}-complete`}
                    checked={step.completed}
                    disabled={isLoading}
                    onCheckedChange={(checked) => 
                      handleStepChange(index, 'completed', checked === true)
                    }
                  />
                  <div className="flex-1">
                    <Input
                      value={step.title}
                      onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                      placeholder="Step title"
                      disabled={isLoading}
                      className={step.completed ? "line-through text-muted-foreground" : ""}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStep(index)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Textarea
                value={step.description || ''}
                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                placeholder="Step description (optional)"
                rows={2}
                disabled={isLoading}
                className={step.completed ? "line-through text-muted-foreground" : ""}
              />
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Steps
        </Button>
      </div>
    </div>
  );
};

export default GoalStepEditor;
