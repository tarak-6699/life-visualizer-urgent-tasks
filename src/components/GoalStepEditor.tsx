import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DbGoalStep } from '@/types/supabase';

interface GoalStep {
  id?: string;
  title: string;
  description?: string;
  order: number;
  completed: boolean;
}

interface GoalStepEditorProps {
  goalId: string;
  existingSteps?: GoalStep[];
  steps?: DbGoalStep[];
  onSave?: () => void;
  onCancel?: () => void;
}

const GoalStepEditor: React.FC<GoalStepEditorProps> = ({ 
  goalId, 
  existingSteps = [], 
  steps = [],
  onSave,
  onCancel
}) => {
  const [localSteps, setLocalSteps] = useState<GoalStep[]>(() => {
    if (steps && steps.length > 0) {
      return steps.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description || '',
        order: step.order,
        completed: step.completed
      }));
    }
    return existingSteps;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const addStep = () => {
    const newStep: GoalStep = {
      title: '',
      description: '',
      order: localSteps.length,
      completed: false
    };
    setLocalSteps([...localSteps, newStep]);
  };

  const removeStep = (index: number) => {
    const newSteps = [...localSteps];
    newSteps.splice(index, 1);
    
    const updatedSteps = newSteps.map((step, idx) => ({
      ...step,
      order: idx
    }));
    
    setLocalSteps(updatedSteps);
  };

  const updateStep = (index: number, field: keyof GoalStep, value: string | boolean) => {
    const newSteps = [...localSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setLocalSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save goal steps",
        variant: "destructive"
      });
      return;
    }

    const invalidStep = localSteps.findIndex(step => !step.title.trim());
    if (invalidStep !== -1) {
      toast({
        title: "Invalid step",
        description: `Step ${invalidStep + 1} must have a title`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const stepsToUpdate = localSteps.filter(step => step.id);
      const stepsToInsert = localSteps.filter(step => !step.id);
      
      if (stepsToUpdate.length > 0) {
        for (const step of stepsToUpdate) {
          const { error } = await supabase
            .from('goal_steps')
            .update({
              title: step.title,
              description: step.description,
              order: step.order,
              completed: step.completed
            })
            .eq('id', step.id);
          
          if (error) throw error;
        }
      }
      
      if (stepsToInsert.length > 0) {
        const { error } = await supabase
          .from('goal_steps')
          .insert(stepsToInsert.map(step => ({
            title: step.title,
            description: step.description,
            order: step.order,
            completed: step.completed,
            goal_id: goalId,
            user_id: user.id
          })));
  
        if (error) throw error;
      }
      
      toast({
        title: "Steps saved",
        description: "Your goal steps have been saved successfully"
      });
      
      if (onSave) onSave();
    } catch (error: any) {
      toast({
        title: "Error saving steps",
        description: error.message || "Failed to save goal steps",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {localSteps.map((step, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-md bg-card">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Step {index + 1}</h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeStep(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Input
                  placeholder="Step Title"
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Step Description (optional)"
                  value={step.description || ''}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addStep}
            className="w-full flex items-center justify-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Step
          </Button>
          
          <div className="flex gap-2 w-full">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            
            <Button 
              type="submit" 
              className={onCancel ? "flex-1" : "w-full"} 
              disabled={isSubmitting || localSteps.length === 0}
            >
              {isSubmitting ? 'Saving...' : 'Save Steps'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GoalStepEditor;
