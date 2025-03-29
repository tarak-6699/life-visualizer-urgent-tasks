
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/utils/dateUtils';
import { Loader2 } from 'lucide-react';

interface UserProfileProps {
  className?: string;
  onComplete?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  className,
  onComplete
}) => {
  const { user: contextUser, setUser } = useUser();
  const { user: authUser, profile, updateProfile, isLoading } = useAuth();
  
  const [name, setName] = useState(contextUser?.name || profile?.full_name || '');
  const [birthdate, setBirthdate] = useState(contextUser?.birthdate ? 
    contextUser.birthdate.toISOString().split('T')[0] : '');
  const [lifeExpectancy, setLifeExpectancy] = useState(contextUser?.lifeExpectancy || 90);
  
  useEffect(() => {
    if (profile?.full_name) {
      setName(profile.full_name);
    }
  }, [profile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !birthdate) return;
    
    // Update local context first for immediate UI feedback
    if (contextUser) {
      setUser({
        ...contextUser,
        name,
        birthdate: new Date(birthdate),
        lifeExpectancy: Math.min(lifeExpectancy, 100)
      });
    }
    
    // Then update profile in database if authenticated
    if (authUser) {
      await updateProfile({
        full_name: name,
      });
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthdate">Your Birthdate</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lifeExpectancy">Life Expectancy (years)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="lifeExpectancy"
                type="range"
                min="60"
                max="100"
                step="1"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-8 text-right">{lifeExpectancy}</span>
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            contextUser?.name ? 'Update Profile' : 'Start Tracking Your Life'
          )}
        </Button>
      </form>
      
      {contextUser && contextUser.birthdate && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Your Profile</h3>
          <p className="text-sm text-muted-foreground">Name: {contextUser.name}</p>
          <p className="text-sm text-muted-foreground">
            Birthdate: {formatDate(contextUser.birthdate)}
          </p>
          <p className="text-sm text-muted-foreground">
            Life Expectancy: {contextUser.lifeExpectancy} years
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
