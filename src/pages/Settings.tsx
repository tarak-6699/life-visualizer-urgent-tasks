
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/UserProfile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SubscriptionManager from '@/components/SubscriptionManager';

const Settings = () => {
  const { isProfileSetup } = useUser();
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="space-y-8 page-transition">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, subscription, and application preferences.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile />
          </CardContent>
        </Card>
        
        <SubscriptionManager />
        
        <div className="space-y-6 md:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>About LifeTracker</CardTitle>
              <CardDescription>
                Understanding the purpose behind this app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                LifeTracker visualizes your life in weeks to create awareness of time 
                and help you make the most of it. This visualization was inspired by 
                various productivity experts who recommend seeing life as a finite 
                resource to prioritize what truly matters.
              </p>
              
              <p className="text-sm">
                The grid representation shows your life with each block representing 
                one week. It serves as a powerful reminder to use your time wisely and 
                align your daily actions with your long-term goals.
              </p>
              
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Privacy Note</AlertTitle>
                <AlertDescription>
                  Your data is stored securely in our database. We maintain strict 
                  privacy controls to ensure your information is protected at all times.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your app data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your data is stored securely in our database. You can access and modify 
                your information at any time through your account settings.
              </p>
              
              <div className="space-y-2">
                <button 
                  className="text-sm text-destructive hover:underline"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
                      window.location.href = '/';
                    }
                  }}
                >
                  Reset Application Data
                </button>
                <p className="text-xs text-muted-foreground">
                  This will clear all your data and reset the application to its default state.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
