
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import GoalManager from '@/components/GoalManager';
import GoalAnalytics from '@/components/GoalAnalytics';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Goals = () => {
  const { isProfileSetup } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isProfileSetup) {
      navigate('/');
    }
  }, [isProfileSetup, navigate]);
  
  if (!isProfileSetup) return null;
  
  return (
    <div className="space-y-8 page-transition">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
        <p className="text-muted-foreground">
          Set and track your short-term and long-term goals.
        </p>
      </div>
      
      {/* Goal Analytics Section */}
      <Card className="glass-card border-gradient shadow-md">
        <CardHeader>
          <CardTitle>Goal Analytics</CardTitle>
          <CardDescription>
            Visual overview of your goals and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoalAnalytics />
        </CardContent>
      </Card>
      
      {/* Goal Manager Section */}
      <Card className="glass-card border-gradient shadow-md">
        <CardHeader>
          <CardTitle>Goal Management</CardTitle>
          <CardDescription>
            Organize your goals by timeframe and track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoalManager />
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Adding specific deadlines to your goals increases your chances of achieving them.
          </p>
          <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
            Related Tasks <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Goal Tips Accordion */}
      <Card className="glass-card border-gradient shadow-md">
        <CardHeader>
          <CardTitle>Goal-Setting Tips</CardTitle>
          <CardDescription>
            Best practices to help you achieve your goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Make your goals SMART</AccordionTrigger>
              <AccordionContent>
                SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound. 
                This framework helps you create clear, attainable goals with deadlines.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Break down large goals</AccordionTrigger>
              <AccordionContent>
                Divide big goals into smaller, manageable milestones. This makes progress 
                more visible and helps maintain motivation throughout your journey.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Connect goals to tasks</AccordionTrigger>
              <AccordionContent>
                Create specific tasks that directly contribute to achieving your goals. 
                Link each task to a goal to stay focused on what matters most.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Review and adjust regularly</AccordionTrigger>
              <AccordionContent>
                Schedule regular reviews of your goals. Be willing to adjust timelines 
                or approaches while keeping the end objective in mind.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;
