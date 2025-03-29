
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  onSave?: () => void;
}

const GoalStepEditor: React.FC<GoalStepEditorProps> = ({ goalId, existingSteps = [], onSave }) => {
  const [steps, setSteps] = useState<GoalStep[]>(existingSteps);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const addStep = () => {
    const newStep: GoalStep = {
      title: '',
      description: '',
      order: steps.length,
      completed: false
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    
    // Update order for remaining steps
    const updatedSteps = newSteps.map((step, idx) => ({
      ...step,
      order: idx
    }));
    
    setSteps(updatedSteps);
  };

  const updateStep = (index: number, field: keyof GoalStep, value: string | boolean) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
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

    // Validate that all steps have titles
    const invalidStep = steps.findIndex(step => !step.title.trim());
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
      // Include user_id in each step
      const { error } = await supabase
        .from('goal_steps')
        .insert(steps.map(step => ({
          ...step,
          goal_id: goalId,
          user_id: user.id // Add this line to include user_id
        })));

      if (error) throw error;
      
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
          {steps.map((step, index) => (
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
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || steps.length === 0}
          >
            {isSubmitting ? 'Saving...' : 'Save Steps'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GoalStepEditor;
