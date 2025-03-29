
import React from 'react';
import { cn } from '@/lib/utils';
import { useLifeProgress } from '@/hooks/useLifeProgress';

interface ProgressBarProps {
  className?: string;
  showDetails?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  className,
  showDetails = true
}) => {
  const progress = useLifeProgress();
  const { percentComplete } = progress;
  
  // Determine color based on progress percentage
  const getProgressColor = () => {
    if (percentComplete < 25) return 'bg-green-500';
    if (percentComplete < 50) return 'bg-blue-500';
    if (percentComplete < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Life Progress</p>
        <p className="text-sm font-medium">{percentComplete.toFixed(1)}%</p>
      </div>
      
      <div className="h-2.5 w-full bg-secondary overflow-hidden rounded-full">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-in-out",
            getProgressColor()
          )}
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>
      
      {showDetails && (
        <div className="flex flex-wrap justify-between text-xs text-muted-foreground mt-2">
          <div>
            <p>Age: {progress.age} years</p>
            <p>Weeks passed: {progress.pastWeeks.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p>Years left: {progress.yearsLeft.toLocaleString()}</p>
            <p>Weeks left: {progress.weeksLeft.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
