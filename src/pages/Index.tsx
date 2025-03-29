
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Target, CheckSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="pt-24 pb-20 px-4 md:px-6 text-center relative overflow-hidden border-b"
        style={{
          background: "linear-gradient(to bottom right, rgba(124, 58, 237, 0.05), rgba(124, 58, 237, 0.1))"
        }}
      >
        <div className="absolute inset-0 pattern-dots pattern-indigo-500 pattern-bg-white pattern-size-4 pattern-opacity-10"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block mb-6">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
              <span>Life Management Reimagined</span>
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Track Your Life's Journey, <span className="text-primary">Achieve Your Goals</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 md:px-10">
            LifeTracker helps you visualize your life, set meaningful goals, 
            and build habits that lead to personal fulfillment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/grid')}>
              See Life Visualization
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose LifeTracker?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our unique approach helps you make the most of your limited time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Life Visualization</h3>
              <p className="text-muted-foreground">
                View your entire life in weeks. See where you've been and how much time you have left to pursue what matters.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Goal Management</h3>
              <p className="text-muted-foreground">
                Break down your ambitions into achievable steps. Set goals with deadlines and track your progress.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Task Tracking</h3>
              <p className="text-muted-foreground">
                Organize daily tasks and link them to your bigger goals. Build momentum with small wins.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div className="py-20 px-4 md:px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start with a 7-day free trial, no credit card required.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 shadow-sm border relative flex flex-col">
              <div className="mb-6">
                <p className="text-lg font-medium mb-2">Monthly</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">$5</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Unlimited goals and tasks</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Progress analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Cloud sync across devices</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/pricing')}
              >
                Start 7-day free trial
              </Button>
            </div>
            
            <div className="bg-card rounded-lg p-8 shadow-sm border border-primary relative flex flex-col">
              <div className="absolute -top-4 right-4">
                <Badge className="px-3 py-1" variant="success">Best Value</Badge>
              </div>
              
              <div className="mb-6">
                <p className="text-lg font-medium mb-2">Yearly</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">$3</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Billed annually at $36</p>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Save 40% compared to monthly</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>All monthly features included</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Exclusive yearly subscriber benefits</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>VIP customer support</span>
                </li>
              </ul>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/pricing')}
              >
                Get 7-day free trial
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 px-4 md:px-6 text-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your life?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your journey to a more intentional life today.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started Now
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-10 px-4 md:px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LifeTracker. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .pattern-dots {
          background-image: radial-gradient(currentColor 2px, transparent 2px);
        }
      `}</style>
    </div>
  );
};

export default Index;
