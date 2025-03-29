
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLifeProgress } from '@/hooks/useLifeProgress';
import { useTheme } from 'next-themes';

interface LifeGridProps {
  className?: string;
}

const LifeGrid: React.FC<LifeGridProps> = ({ className }) => {
  const { totalWeeks, pastWeeks, totalYears } = useLifeProgress();
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  // Calculate grid dimensions
  const WEEKS_PER_YEAR = 52;
  const YEARS_PER_ROW = 5;
  const WEEKS_PER_ROW = WEEKS_PER_YEAR * YEARS_PER_ROW;
  const totalRows = Math.ceil(totalYears / YEARS_PER_ROW);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }
    
    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);

  const renderGrid = () => {
    const cells = [] as React.ReactNode[];
    
    // Maximum number of weeks to display (totalYears * WEEKS_PER_YEAR)
    const maxWeeks = totalYears * WEEKS_PER_YEAR;
    
    // Create grid cells
    for (let row = 0; row < totalRows; row++) {
      const rowCells: React.ReactNode[] = [];
      
      // Add year labels for each row
      rowCells.push(
        <div
          key={`year-label-${row}`}
          className="text-xs text-muted-foreground w-10 flex items-center justify-end pr-2"
        >
          Year {row * YEARS_PER_ROW + 1}
        </div>
      );
      
      for (let weekInRow = 0; weekInRow < WEEKS_PER_ROW; weekInRow++) {
        const week = row * WEEKS_PER_ROW + weekInRow;
        
        // Skip if week exceeds the max weeks based on life expectancy
        if (week >= maxWeeks) break;
        
        // Calculate the year and week within the year
        const year = Math.floor(week / WEEKS_PER_YEAR);
        const weekInYear = week % WEEKS_PER_YEAR;
        
        // Add visual separator for year boundaries
        const isYearStart = weekInYear === 0 && week > 0;
        
        // Calculate state of the cell (past, current, future)
        let cellState = 'grid-cell-future';
        let cellColor;
        
        if (week < pastWeeks) {
          cellState = 'grid-cell-past';
          const intensity = Math.max(0.4, 1 - (pastWeeks - week) / pastWeeks);
          
          // Updated color scheme - red for past
          cellColor = isDarkTheme 
            ? `bg-red-700 opacity-${Math.floor(intensity * 100)}`
            : `bg-red-500 opacity-${Math.floor(intensity * 100)}`;
        } else if (week === pastWeeks) {
          cellState = 'grid-cell-current';
          // Blue for present
          cellColor = isDarkTheme ? 'bg-blue-600 animate-pulse' : 'bg-blue-500 animate-pulse';
        } else {
          // Green for future/time left
          cellColor = isDarkTheme ? 'bg-green-800/60' : 'bg-green-200/80';
        }
        
        // Enhanced hover effect
        const hoverEffect = 'hover:scale-125 hover:z-20 transition-transform duration-200';
        
        // Create the animated entry delay based on grid position
        const delay = isVisible ? Math.min(weekInRow * 2 + row * 20, 1000) : 0;
        
        rowCells.push(
          <div
            key={`cell-${week}`}
            className={cn(
              "grid-cell transition-all duration-300",
              cellState,
              cellColor,
              hoverEffect,
              isYearStart ? 'ml-1' : ''
            )}
            style={{ 
              opacity: isVisible ? 1 : 0, 
              transform: isVisible ? 'scale(1)' : 'scale(0.5)',
              transition: `opacity 0.3s ease ${delay}ms, transform 0.3s ease ${delay}ms, background-color 0.5s ease`
            }}
            title={`Year ${year + 1}, Week ${weekInYear + 1}`}
          />
        );
      }
      
      // Only add row if it has cells
      if (rowCells.length > 0) {
        cells.push(
          <div 
            key={`row-${row}`} 
            className="flex flex-wrap w-full items-center" 
            style={{ maxWidth: `calc(${WEEKS_PER_ROW} * 1.25rem + 2.5rem)` }}
          >
            {rowCells}
          </div>
        );
      }
    }
    
    return cells;
  };
  
  const cells = renderGrid();
  
  // Updated legend with better colors
  const legendItems = [
    { label: 'Past Weeks', class: isDarkTheme ? 'bg-red-700' : 'bg-red-500' },
    { label: 'Current Week', class: isDarkTheme ? 'bg-blue-600' : 'bg-blue-500' },
    { label: 'Future Weeks', class: isDarkTheme ? 'bg-green-800/60' : 'bg-green-200/80' },
  ];
  
  return (
    <div className={cn("flex flex-col gap-4", className)} ref={gridRef}>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
        {legendItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${item.class}`} />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="overflow-x-auto pb-4 rounded-lg border border-muted p-4 bg-card/50 shadow-inner">
        <div className="flex flex-col gap-1">
          {cells}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        <p>Each square represents one week of your life. Colored squares show your journey so far.</p>
        <p className="mt-3 font-medium text-foreground">Take time to reflect on how you want to spend your remaining weeks.</p>
      </div>
    </div>
  );
};

export default LifeGrid;
