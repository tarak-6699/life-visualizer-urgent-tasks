
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';

const ProgressOverview: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Life Progress
        </CardTitle>
        <CardDescription>
          Visual representation of your life journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProgressBar />
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <p className="font-medium">View Full Life Grid</p>
            <p className="text-sm text-muted-foreground">
              See your entire life visualized in weeks
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/grid')}
            className="transition-colors hover:bg-primary hover:text-white group"
          >
            View Grid <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;
