
import React, { useState, useEffect } from 'react';
import { useUser, Goal } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Check } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface GoalEditorProps {
  goal: Goal;
  onSave: () => void;
  onCancel: () => void;
}

const GoalEditor: React.FC<GoalEditorProps> = ({ goal, onSave, onCancel }) => {
  const { updateGoal } = useUser();
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [targetDate, setTargetDate] = useState<Date | null>(goal.targetDate);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    // Reset form if goal changes
    setTitle(goal.title);
    setDescription(goal.description);
    setTargetDate(goal.targetDate);
  }, [goal]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    updateGoal({
      ...goal,
      title: title.trim(),
      description: description.trim(),
      targetDate
    });
    
    onSave();
  };

  const clearDate = () => {
    setTargetDate(null);
    setDatePickerOpen(false);
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-card">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Goal Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter goal title"
          className="w-full"
          autoFocus
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter goal description"
          className="w-full"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Target Date
        </label>
        <div className="flex gap-2 items-center">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {targetDate ? formatDate(targetDate) : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={targetDate || undefined}
                onSelect={(date) => {
                  setTargetDate(date);
                  setDatePickerOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {targetDate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearDate}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default GoalEditor;
