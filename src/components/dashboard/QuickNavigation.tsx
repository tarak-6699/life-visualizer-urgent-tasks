
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LayoutGrid, CheckSquare, Target, CalendarDays, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickNavigation: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Quick Navigation
        </CardTitle>
        <CardDescription>
          Jump to key sections of your life tracker
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 min-w-[500px]">
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center p-4 space-y-2 hover:bg-primary/10 hover:-translate-y-1 transition-all"
            onClick={() => navigate('/grid')}
          >
            <LayoutGrid className="h-8 w-8 text-primary" />
            <span>Life Grid</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center p-4 space-y-2 hover:bg-primary/10 hover:-translate-y-1 transition-all"
            onClick={() => navigate('/tasks')}
          >
            <CheckSquare className="h-8 w-8 text-primary" />
            <span>Tasks</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center p-4 space-y-2 hover:bg-primary/10 hover:-translate-y-1 transition-all"
            onClick={() => navigate('/goals')}
          >
            <Target className="h-8 w-8 text-primary" />
            <span>Goals</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center p-4 space-y-2 hover:bg-primary/10 hover:-translate-y-1 transition-all"
            onClick={() => navigate('/calendar')}
          >
            <CalendarDays className="h-8 w-8 text-primary" />
            <span>Calendar</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center p-4 space-y-2 hover:bg-primary/10 hover:-translate-y-1 transition-all"
            onClick={() => navigate('/settings')}
          >
            <Clock className="h-8 w-8 text-primary" />
            <span>Profile</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickNavigation;
