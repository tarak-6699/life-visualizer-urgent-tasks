
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, CreditCard, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

export const SubscriptionManager = () => {
  const { user, subscription, refreshSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  // Format dates for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  // Calculate days remaining in trial
  const getDaysRemaining = () => {
    if (!subscription?.trial_end) return 0;
    const trialEnd = new Date(subscription.trial_end);
    const today = new Date();
    const diffTime = trialEnd.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isTrialActive = () => {
    if (!subscription?.trial_end) return false;
    return new Date(subscription.trial_end) > new Date();
  };

  const isSubscriptionActive = () => {
    if (!subscription?.current_period_end) return false;
    return (
      subscription.status === 'active' && 
      new Date(subscription.current_period_end) > new Date()
    );
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          Authorization: `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`,
        },
        body: {
          billingCycle,
        }
      });

      if (error) throw error;
      if (!data.url) throw new Error('No checkout URL returned');

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Checkout failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`,
        },
      });

      if (error) throw error;
      
      await refreshSubscription();
      
      toast({
        title: 'Subscription updated',
        description: 'Your subscription status has been refreshed.',
      });
    } catch (error: any) {
      console.error('Error refreshing subscription:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'Could not refresh subscription status.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Sign in to manage your subscription
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>
          Manage your LifeTracker subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {subscription.status}
                </p>
              </div>
              
              {isTrialActive() && (
                <div>
                  <p className="text-sm font-medium">Trial Ends</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(subscription.trial_end)} ({getDaysRemaining()} days left)
                  </p>
                </div>
              )}
              
              {isSubscriptionActive() && (
                <div>
                  <p className="text-sm font-medium">Next Billing Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(subscription.current_period_end)}
                  </p>
                </div>
              )}
            </div>
            
            {isTrialActive() && (
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex flex-row items-start space-x-3">
                  <div className="mt-0.5">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Free Trial Active</p>
                    <p className="text-sm text-muted-foreground">
                      You have {getDaysRemaining()} days left in your free trial. Subscribe now to continue using LifeTracker.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Subscribe to LifeTracker for full access to all features. Your first 7 days are free!
              </p>
            </div>
            
            <Tabs defaultValue="monthly" onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly <Badge variant="secondary" className="ml-2">Save 40%</Badge></TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="space-y-4">
                <div className="rounded-lg border p-4 mt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">$5</h3>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Unlimited goals and tasks</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Progress analytics</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Cloud sync across devices</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Priority customer support</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="yearly" className="space-y-4">
                <div className="rounded-lg border p-4 mt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">$3</h3>
                      <p className="text-sm text-muted-foreground">per month, billed annually ($36/year)</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Save 40% compared to monthly billing</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>All monthly features included</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Exclusive yearly subscriber benefits</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>VIP customer support</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={refreshSubscriptionStatus}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Refresh Status
        </Button>
        
        {!isSubscriptionActive() && (
          <Button onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
            {isTrialActive() ? `Subscribe Now (${billingCycle === 'yearly' ? '$3/mo' : '$5/mo'})` : 'Start Free Trial'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionManager;
