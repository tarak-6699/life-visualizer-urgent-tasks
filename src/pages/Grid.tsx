
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import LifeGrid from '@/components/LifeGrid';
import ProgressBar from '@/components/ProgressBar';
import { useLifeProgress } from '@/hooks/useLifeProgress';
import { formatDate } from '@/utils/dateUtils';
import { Clock, Calendar, Calendar as CalendarIcon, Target, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Grid = () => {
  const { user, isProfileSetup } = useUser();
  const navigate = useNavigate();
  const progress = useLifeProgress();
  
  useEffect(() => {
    if (!isProfileSetup) {
      navigate('/');
    }
  }, [isProfileSetup, navigate]);
  
  if (!isProfileSetup || !user?.birthdate) return null;
  
  return (
    <div className="space-y-8 page-transition">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Life in Weeks</h1>
        <p className="text-muted-foreground">
          Visualize your life journey as a grid of weeks - each square represents one week of your life.
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card className="glass-card border-gradient shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Your Life Progress
            </CardTitle>
            <CardDescription>
              Based on your birthdate: {formatDate(user.birthdate)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressBar />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
              <Card className="bg-card/50 border border-muted">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Current Age
                  </h3>
                  <p className="text-2xl font-bold">{progress.age} years</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.floor(progress.age * 12)} months lived
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border border-muted">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    Weeks Lived
                  </h3>
                  <p className="text-2xl font-bold">{progress.pastWeeks.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.floor(progress.pastWeeks / 7).toLocaleString()} days
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border border-muted">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-primary" />
                    Weeks Remaining
                  </h3>
                  <p className="text-2xl font-bold">{progress.weeksLeft.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {progress.yearsLeft} years left
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border border-muted">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-primary" />
                    Completion
                  </h3>
                  <p className="text-2xl font-bold">{progress.percentComplete.toFixed(1)}%</p>
                  <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-purple-500" 
                      style={{ width: `${progress.percentComplete}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-gradient shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Life Grid
              </CardTitle>
              <CardDescription>
                Your life visualized - each cell represents one week.
              </CardDescription>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 hover:bg-primary hover:text-white transition-colors"
              onClick={() => navigate('/goals')}
            >
              Set Goals <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto pb-4">
              <LifeGrid />
            </div>
            
            <p className="text-sm text-muted-foreground mt-6 border-t pt-4">
              <span className="font-medium text-foreground">Perspective</span>: This visualization 
              helps you understand the finite nature of time and make the most of what you 
              have. Each colored square represents a week you've already lived, while empty 
              squares represent future weeks. Use this perspective to prioritize what truly 
              matters in your life.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Grid;
