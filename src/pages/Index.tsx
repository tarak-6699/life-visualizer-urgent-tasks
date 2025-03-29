
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Target, 
  CheckSquare, 
  Sparkles, 
  ArrowRight, 
  Zap,
  Star,
  Calendar,
  LineChart,
  Users,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Animation for elements to fade in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Navigation Bar with subtle glassmorphism */}
      <header className="w-full bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center mr-4">
            <Zap className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold text-2xl tracking-tight">LifeTracker</span>
          </div>
          
          <div className="flex-1" />
          
          {user ? (
            <Button asChild variant="default" className="animate-pulse">
              <Link to="/dashboard">
                <ArrowRight className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild variant="default" className="hover:scale-105 transition-transform">
              <Link to="/auth">
                <ArrowRight className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </header>
      
      {/* Hero Section with animated gradient */}
      <div 
        className="pt-24 pb-20 px-4 md:px-6 text-center relative overflow-hidden border-b"
        style={{
          background: "linear-gradient(to bottom right, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))"
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 pattern-dots pattern-indigo-500 pattern-bg-white pattern-size-4 pattern-opacity-10"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block mb-6">
            <Badge variant="secondary" className="px-3 py-1 text-sm animate-bounce">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
              <span>Visualize Your Life Journey</span>
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 reveal">
            Transform Your Time Into A <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500">Meaningful Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 md:px-10 reveal">
            LifeTracker helps you visualize your life's journey, set meaningful goals, 
            and build habits that lead to personal fulfillment and success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal">
            <Button size="lg" onClick={handleGetStarted} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 animate-pulse">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/grid')} className="hover:scale-105 transition-transform">
              See Life Visualization
            </Button>
          </div>
        </div>
      </div>
      
      {/* Visually appealing mockup section */}
      <div className="py-20 px-4 bg-muted/50 reveal">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2 space-y-6">
              <Badge className="mb-4">Dashboard Preview</Badge>
              <h2 className="text-3xl font-bold">Your Life at a Glance</h2>
              <p className="text-xl text-muted-foreground">
                LifeTracker's intuitive dashboard gives you a complete view of your goals, tasks, and progress in one place.
              </p>
              <ul className="space-y-2">
                {[
                  { icon: <Target className="h-5 w-5 text-primary" />, text: "Visualize life progress" },
                  { icon: <CheckSquare className="h-5 w-5 text-primary" />, text: "Track daily tasks" },
                  { icon: <Calendar className="h-5 w-5 text-primary" />, text: "Plan your week effectively" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-lg">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0 transition-all duration-700 hover:scale-105">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-xl"></div>
                <div className="relative bg-card border rounded-xl shadow-xl overflow-hidden">
                  <div className="bg-primary/10 h-12 flex items-center px-6 gap-2 border-b">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-4">
                    <img 
                      src="https://placehold.co/800x500/f8fafc/6366f1?text=LifeTracker+Dashboard&font=montserrat" 
                      alt="Dashboard Preview" 
                      className="rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section with animations */}
      <div className="py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl font-bold mb-4">Why Choose LifeTracker?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our unique approach helps you make the most of your limited time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: "Life Visualization",
                description: "View your entire life in weeks. See where you've been and how much time you have left to pursue what matters."
              },
              {
                icon: <Target className="h-6 w-6 text-primary" />,
                title: "Goal Management",
                description: "Break down your ambitions into achievable steps. Set goals with deadlines and track your progress."
              },
              {
                icon: <CheckSquare className="h-6 w-6 text-primary" />,
                title: "Task Tracking",
                description: "Organize daily tasks and link them to your bigger goals. Build momentum with small wins."
              },
              {
                icon: <LineChart className="h-6 w-6 text-primary" />,
                title: "Progress Analytics",
                description: "View detailed analytics about your productivity, goal completion rates, and life progression."
              },
              {
                icon: <Users className="h-6 w-6 text-primary" />,
                title: "Community Support",
                description: "Join a community of like-minded individuals who are committed to personal growth and achievement."
              },
              {
                icon: <Shield className="h-6 w-6 text-primary" />,
                title: "Privacy Focused",
                description: "Your data is secured with enterprise-grade encryption. We prioritize your privacy above all."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 reveal"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-20 px-4 md:px-6 bg-muted/30 reveal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "LifeTracker changed how I view my time. I'm now more intentional about my goals and daily actions.",
                name: "Alex Johnson",
                role: "Product Manager"
              },
              {
                quote: "The life visualization grid was a wake-up call. I've completely reprioritized what matters in my life.",
                name: "Sarah Chen",
                role: "Marketing Director"
              },
              {
                quote: "I've tried many productivity apps, but LifeTracker's goal management system is by far the most effective.",
                name: "Michael Reed",
                role: "Software Engineer"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-card rounded-lg p-8 shadow-md border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex mb-4">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="italic mb-6">"{testimonial.quote}"</p>
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div className="py-20 px-4 md:px-6 bg-muted/50 reveal">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start with a 7-day free trial, no credit card required.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 shadow-sm border relative flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
                onClick={() => navigate('/auth')}
              >
                Start 7-day free trial
              </Button>
            </div>
            
            <div className="bg-card rounded-lg p-8 shadow-md border border-primary relative flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="absolute -top-4 right-4">
                <Badge className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white animate-pulse">Best Value</Badge>
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
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700" 
                size="lg"
                onClick={() => navigate('/auth')}
              >
                Get 7-day free trial
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 px-4 md:px-6 text-center bg-gradient-to-r from-primary/10 to-primary/5 reveal">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your life?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your journey to a more intentional life today.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:scale-105 transition-transform"
          >
            Get Started Now
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-10 px-4 md:px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Zap className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">LifeTracker</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 md:mb-0 md:order-3">
            © {new Date().getFullYear()} LifeTracker. All rights reserved.
          </p>
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
      
      <style>{`
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
          animation: blob 10s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .pattern-dots {
          background-image: radial-gradient(currentColor 2px, transparent 2px);
          background-size: 20px 20px;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
