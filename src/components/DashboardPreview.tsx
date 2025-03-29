
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, CheckSquare, Clock, Target } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <div className="bg-background border rounded-xl overflow-hidden p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Alex. Here's your life overview.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 years</div>
            <p className="text-xs text-muted-foreground">
              1,664 weeks lived
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Time Left
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43 years</div>
            <p className="text-xs text-muted-foreground">
              2,236 weeks remaining
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart className="h-4 w-4 text-primary" /> Life Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.7%</div>
            <p className="text-xs text-muted-foreground">
              of your estimated life span
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card className="glass-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Life Progress
            </CardTitle>
            <CardDescription>
              Visual representation of your life journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Simplified Progress Bar */}
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full animate-pulse" 
                style={{ width: '42.7%' }}
              ></div>
            </div>
            
            {/* Simplified Life Grid */}
            <div className="flex flex-wrap gap-1 mt-4">
              {[...Array(100)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-sm transition-all duration-300 ${
                    i < 43 
                      ? `${i % 7 === 0 ? 'bg-primary' : 'bg-primary/70'} animate-pulse` 
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                Open Tasks
              </CardTitle>
              <CardDescription>
                Your pending tasks that need attention
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { text: "Plan next quarter goals", priority: "high" },
                { text: "Complete project presentation", priority: "medium" },
                { text: "Schedule annual health checkup", priority: "high" }
              ].map((todo, index) => (
                <div key={index} className="p-3 border rounded-md flex items-start gap-3 hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 mt-1 rounded-full flex-shrink-0 ${
                    todo.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{todo.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Goals Preview */}
      <Card className="glass-card mt-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Goals
            </CardTitle>
            <CardDescription>
              Your current goals and aspirations
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Run a half marathon", date: "Dec 15, 2023" },
              { title: "Learn Spanish - Intermediate level", date: "Mar 30, 2024" }
            ].map((goal, index) => (
              <div key={index} className="p-3 border rounded-md flex items-center gap-3 hover:bg-muted/50 transition-colors">
                <Target className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{goal.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {goal.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPreview;
