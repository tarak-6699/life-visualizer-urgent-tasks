
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DbGoal } from '@/types/supabase';
import { useUser } from '@/contexts/UserContext';
import { Goal } from '@/contexts/UserContext';

export function useDbGoals() {
  const { user, isSubscribed } = useAuth();
  const { user: contextUser, addGoal: addContextGoal, updateGoal: updateContextGoal, removeGoal: removeContextGoal } = useUser();
  const [goals, setGoals] = useState<DbGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<number>(0);
  const [activeSubscription, setActiveSubscription] = useState<{ unsubscribe: () => void } | null>(null);

  // Fetch goals from database with optimized caching
  const fetchGoals = useCallback(async (force = false) => {
    if (!user) return;
    
    // Skip fetching if we've fetched recently (within 30 seconds) and not forced
    const now = Date.now();
    if (!force && lastFetched > 0 && now - lastFetched < 30000) {
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setGoals(data as DbGoal[]);
        setLastFetched(now);
      }
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast({
        title: 'Failed to load goals',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, lastFetched]);

  // Sync local goals to database when user signs in
  const syncLocalGoals = useCallback(async () => {
    if (!user || !contextUser?.goals?.length) return;
    
    try {
      // For each local goal, add it to the database
      for (const goal of contextUser.goals) {
        const { error } = await supabase
          .from('goals')
          .insert({
            title: goal.title,
            description: goal.description,
            target_date: goal.targetDate ? goal.targetDate.toISOString() : null,
            completed: goal.completed,
            user_id: user.id,
          });
        
        if (error) {
          console.error('Error syncing goal:', error);
        }
      }
      
      // Fetch the updated goals
      fetchGoals(true);
      
      // Clear local goals
      contextUser.goals.forEach(goal => removeContextGoal(goal.id));
      
    } catch (error: any) {
      console.error('Error syncing goals:', error);
    }
  }, [user, contextUser, fetchGoals, removeContextGoal]);

  // Initialize: fetch from DB and sync local if needed
  useEffect(() => {
    if (user) {
      fetchGoals(true);
      if (contextUser?.goals?.length > 0) {
        syncLocalGoals();
      }
    }
    
    // Cleanup function
    return () => {
      if (activeSubscription) {
        activeSubscription.unsubscribe();
      }
    };
  }, [user, fetchGoals, syncLocalGoals, contextUser, activeSubscription]);

  // Subscribe to realtime updates with improved handling
  useEffect(() => {
    if (!user) return;
    
    // Clean up any existing subscription first
    if (activeSubscription) {
      activeSubscription.unsubscribe();
    }
    
    // Create a new subscription with proper event handling
    const channel = supabase
      .channel('goals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Received goals update:', payload);
          // Use a timeout to debounce multiple events
          const timer = setTimeout(() => fetchGoals(true), 300);
          return () => clearTimeout(timer);
        }
      )
      .subscribe();
    
    // Store the subscription for later cleanup
    setActiveSubscription({ unsubscribe: () => channel.unsubscribe() });

    // Clean up subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [user, fetchGoals]);

  // Add goal with optimistic updates
  const addGoal = async (goalData: Omit<Goal, 'id'>) => {
    if (!user) {
      // If no user, add to local state
      addContextGoal(goalData);
      return;
    }
    
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticGoal: DbGoal = {
        id: tempId,
        title: goalData.title,
        description: goalData.description || null,
        target_date: goalData.targetDate ? goalData.targetDate.toISOString() : null,
        completed: goalData.completed || false,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setGoals(prev => [optimisticGoal, ...prev]);
      
      const { data, error } = await supabase
        .from('goals')
        .insert({
          title: goalData.title,
          description: goalData.description,
          target_date: goalData.targetDate ? goalData.targetDate.toISOString() : null,
          completed: goalData.completed !== undefined ? goalData.completed : false,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update with real data
      if (data) {
        setGoals(prev => prev.map(g => g.id === tempId ? data : g));
      } else {
        // If no data returned, fetch all to ensure consistency
        fetchGoals(true);
      }
      
      toast({
        title: 'Goal added',
        description: 'Your goal has been added successfully.',
      });
    } catch (error: any) {
      console.error('Error adding goal:', error);
      // Revert optimistic update
      setGoals(prev => prev.filter(g => !g.id.startsWith('temp-')));
      
      toast({
        title: 'Failed to add goal',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Update goal with optimistic updates
  const updateGoal = async (goalId: string, updates: Partial<Omit<Goal, 'id'>>) => {
    if (!user) {
      // If no user, update in local state
      const existingGoal = contextUser?.goals?.find(g => g.id === goalId);
      if (existingGoal) {
        updateContextGoal({
          ...existingGoal,
          ...updates,
          targetDate: updates.targetDate || existingGoal.targetDate,
        });
      }
      return;
    }
    
    try {
      // Optimistic update
      setGoals(prev => prev.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            title: updates.title !== undefined ? updates.title : goal.title,
            description: updates.description !== undefined ? updates.description : goal.description,
            target_date: updates.targetDate !== undefined ? 
              (updates.targetDate ? updates.targetDate.toISOString() : null) : goal.target_date,
            completed: updates.completed !== undefined ? updates.completed : goal.completed,
            updated_at: new Date().toISOString()
          };
        }
        return goal;
      }));
      
      const updatedData: any = {};
      
      if (updates.title !== undefined) updatedData.title = updates.title;
      if (updates.description !== undefined) updatedData.description = updates.description;
      if (updates.targetDate !== undefined) {
        updatedData.target_date = updates.targetDate ? updates.targetDate.toISOString() : null;
      }
      if (updates.completed !== undefined) updatedData.completed = updates.completed;
      
      const { error } = await supabase
        .from('goals')
        .update(updatedData)
        .eq('id', goalId);
      
      if (error) throw error;
      
      toast({
        title: 'Goal updated',
        description: 'Your goal has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating goal:', error);
      // Revert optimistic update by fetching the actual data
      fetchGoals(true);
      
      toast({
        title: 'Failed to update goal',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Remove goal with optimistic updates
  const removeGoal = async (goalId: string) => {
    if (!user) {
      // If no user, remove from local state
      removeContextGoal(goalId);
      return;
    }
    
    try {
      // Optimistic update
      const goalToRemove = goals.find(g => g.id === goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);
      
      if (error) throw error;
      
      toast({
        title: 'Goal removed',
        description: 'Your goal has been removed.',
      });
    } catch (error: any) {
      console.error('Error removing goal:', error);
      // Revert optimistic removal
      fetchGoals(true);
      
      toast({
        title: 'Failed to remove goal',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Convert DB goals to context format with memoization
  const formattedGoals = useMemo(() => goals.map(dbGoal => ({
    id: dbGoal.id,
    title: dbGoal.title,
    description: dbGoal.description || '',
    targetDate: dbGoal.target_date ? new Date(dbGoal.target_date) : null,
    completed: dbGoal.completed,
  })), [goals]);

  // Combine local and DB goals for non-subscribed users
  const combinedGoals = useMemo(() => 
    isSubscribed
      ? formattedGoals
      : [...formattedGoals, ...(contextUser?.goals || [])],
    [isSubscribed, formattedGoals, contextUser?.goals]
  );

  return {
    goals: combinedGoals,
    isLoading,
    addGoal,
    updateGoal,
    removeGoal,
    refresh: () => fetchGoals(true)
  };
}
