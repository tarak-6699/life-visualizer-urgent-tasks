
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp } from 'lucide-react';
import { useLifeProgress } from '@/hooks/useLifeProgress';

const LifeMetrics: React.FC = () => {
  const progress = useLifeProgress();
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="glass-card border-gradient shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Age
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.age} years</div>
          <p className="text-xs text-muted-foreground">
            {progress.pastWeeks.toLocaleString()} weeks lived
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-gradient shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Time Left
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.yearsLeft} years</div>
          <p className="text-xs text-muted-foreground">
            {progress.weeksLeft.toLocaleString()} weeks remaining
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-gradient shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Life Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.percentComplete.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            of your estimated life span
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifeMetrics;
