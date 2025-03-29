
import { useEffect, useState } from "react";

interface WeekGridProps {
  age?: number;
  yearCount?: number;
  animated?: boolean;
  small?: boolean;
}

const WeekGrid = ({ 
  age = 30, 
  yearCount = 90, 
  animated = true,
  small = false 
}: WeekGridProps) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const weeksPerYear = 52;
  const totalWeeks = yearCount * weeksPerYear;
  const weeksLived = Math.floor(age * weeksPerYear);
  const percentLived = (weeksLived / totalWeeks) * 100;
  
  // Determine how many weeks to show as filled for animation
  const weeksToShow = animated 
    ? Math.floor((animationProgress / 100) * weeksLived)
    : weeksLived;

  useEffect(() => {
    if (animated) {
      let start = 0;
      const animationDuration = 2000; // 2 seconds
      const interval = 20; // Update every 20ms
      const increment = (interval / animationDuration) * 100;
      
      const timer = setInterval(() => {
        start += increment;
        setAnimationProgress(Math.min(start, 100));
        
        if (start >= 100) {
          clearInterval(timer);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [animated]);

  // Grid dimensions
  const cols = 52; // 52 weeks in a year
  const rows = Math.ceil(totalWeeks / cols);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className={`overflow-hidden ${small ? 'max-h-40' : ''}`}>
        <div 
          className={`grid grid-cols-52 gap-0.5 md:gap-1 ${small ? 'gap-px' : ''}`}
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            width: "100%"
          }}
        >
          {Array.from({ length: totalWeeks }).map((_, index) => (
            <div
              key={index}
              className={`
                aspect-square transition-all duration-300
                ${small ? 'w-1 h-1 md:w-1.5 md:h-1.5' : 'w-2 h-2 md:w-3 md:h-3'}
                ${index < weeksToShow ? 'bg-lifeblue' : 'bg-lifegray-200'}
                ${index === weeksToShow - 1 && animated ? 'animate-pulse-soft' : ''}
              `}
            />
          ))}
        </div>
      </div>
      
      {!small && (
        <div className="mt-6 text-center">
          <div className="relative h-2 bg-lifegray-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-lifeblue rounded-full transition-all duration-1000"
              style={{ width: `${animationProgress ? animationProgress : percentLived}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-lifegray-500">
            {Math.round(percentLived)}% of life completed ({yearCount - age} years remaining)
          </p>
        </div>
      )}
    </div>
  );
};

export default WeekGrid;
