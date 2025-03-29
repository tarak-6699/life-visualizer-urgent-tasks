
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DbTodo } from '@/types/supabase';
import { useTodos, Todo, TodoPriority, TodoFilter } from '@/hooks/useTodos';

export function useDbTodos() {
  const { user, isSubscribed } = useAuth();
  const localTodos = useTodos();
  const [todos, setTodos] = useState<DbTodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TodoFilter>(localTodos.filter);
  const [lastFetched, setLastFetched] = useState<number>(0);
  const [activeSubscription, setActiveSubscription] = useState<{ unsubscribe: () => void } | null>(null);

  // Fetch todos from database with optimized caching
  const fetchTodos = useCallback(async (force = false) => {
    if (!user) return;
    
    // Skip fetching if we've fetched recently (within 30 seconds) and not forced
    const now = Date.now();
    if (!force && lastFetched > 0 && now - lastFetched < 30000) {
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setTodos(data as DbTodo[]);
        setLastFetched(now);
      }
    } catch (error: any) {
      console.error('Error fetching todos:', error);
      toast({
        title: 'Failed to load tasks',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, lastFetched]);

  // Sync local todos to database when user signs in
  const syncLocalTodos = useCallback(async () => {
    if (!user || !localTodos.todos.length) return;
    
    try {
      // For each local todo, add it to the database
      for (const todo of localTodos.todos) {
        const { error } = await supabase
          .from('todos')
          .insert({
            text: todo.text,
            completed: todo.completed,
            due_date: todo.dueDate ? todo.dueDate.toISOString() : null,
            priority: todo.priority,
            completed_at: todo.completedAt ? todo.completedAt.toISOString() : null,
            user_id: user.id,
          });
        
        if (error) {
          console.error('Error syncing todo:', error);
        }
      }
      
      // Fetch the updated todos
      fetchTodos(true);
      
      // Clear local todos after they've been synced to DB
      localTodos.todos.forEach(todo => localTodos.removeTodo(todo.id));
      
    } catch (error: any) {
      console.error('Error syncing todos:', error);
    }
  }, [user, localTodos, fetchTodos]);

  // Initialize: fetch from DB and sync local if needed
  useEffect(() => {
    if (user) {
      fetchTodos(true);
      if (localTodos.todos.length > 0) {
        syncLocalTodos();
      }
    }
    
    // Cleanup function to ensure we don't have duplicate fetches on re-renders
    return () => {
      if (activeSubscription) {
        activeSubscription.unsubscribe();
      }
    };
  }, [user, fetchTodos, syncLocalTodos, localTodos.todos.length, activeSubscription]);

  // Subscribe to realtime updates with proper cleanup to prevent duplicate tasks
  useEffect(() => {
    if (!user) return;
    
    // Clean up any existing subscription first
    if (activeSubscription) {
      activeSubscription.unsubscribe();
    }
    
    // Create a new subscription
    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Received realtime update:', payload);
          // Use a timeout to debounce multiple events
          const timer = setTimeout(() => fetchTodos(true), 300);
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
  }, [user, fetchTodos]);

  // Add todo with optimistic updates
  const addTodo = async (text: string, dueDate: Date | null = null, priority: TodoPriority = 'medium') => {
    if (!user) {
      return localTodos.addTodo(text, dueDate, priority);
    }
    
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();
      const optimisticTodo: DbTodo = {
        id: tempId,
        text,
        completed: false,
        created_at: now,
        completed_at: null,
        due_date: dueDate ? dueDate.toISOString() : null,
        priority: priority as 'low' | 'medium' | 'high',
        user_id: user.id
      };
      
      setTodos(prev => [optimisticTodo, ...prev]);
      
      const { data, error } = await supabase
        .from('todos')
        .insert({
          text,
          completed: false,
          due_date: dueDate ? dueDate.toISOString() : null,
          priority,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update with real data
      if (data) {
        setTodos(prev => prev.map(t => t.id === tempId ? data as DbTodo : t));
      } else {
        // If no data returned, fetch all to ensure consistency
        fetchTodos(true);
      }
      
      toast({
        title: 'Task added',
        description: 'Your task has been added successfully.',
      });
    } catch (error: any) {
      console.error('Error adding todo:', error);
      // Revert optimistic update
      setTodos(prev => prev.filter(t => !t.id.startsWith('temp-')));
      
      toast({
        title: 'Failed to add task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Toggle todo completion with optimistic updates
  const toggleTodo = async (id: string) => {
    if (!user) {
      return localTodos.toggleTodo(id);
    }
    
    try {
      // Find current todo
      const todoToToggle = todos.find(todo => todo.id === id);
      if (!todoToToggle) return;
      
      const newCompletedStatus = !todoToToggle.completed;
      const completedAt = newCompletedStatus ? new Date().toISOString() : null;
      
      // Optimistic update
      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: newCompletedStatus,
            completed_at: completedAt
          };
        }
        return todo;
      }));
      
      const { error } = await supabase
        .from('todos')
        .update({
          completed: newCompletedStatus,
          completed_at: completedAt,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: newCompletedStatus ? 'Task completed' : 'Task marked incomplete',
        description: `Your task has been ${newCompletedStatus ? 'completed' : 'marked as incomplete'}.`,
      });
    } catch (error: any) {
      console.error('Error toggling todo:', error);
      // Revert optimistic update
      fetchTodos(true);
      
      toast({
        title: 'Failed to update task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Update todo with optimistic updates
  const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    if (!user) {
      return localTodos.updateTodo(id, updates);
    }
    
    try {
      // Optimistic update
      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            text: updates.text !== undefined ? updates.text : todo.text,
            completed: updates.completed !== undefined ? updates.completed : todo.completed,
            completed_at: updates.completed !== undefined ? 
              (updates.completed ? new Date().toISOString() : null) : todo.completed_at,
            due_date: updates.dueDate !== undefined ? 
              (updates.dueDate ? updates.dueDate.toISOString() : null) : todo.due_date,
            priority: updates.priority !== undefined ? 
              (updates.priority as 'low' | 'medium' | 'high') : todo.priority,
          };
        }
        return todo;
      }));
      
      const updatedData: any = {};
      
      if (updates.text !== undefined) updatedData.text = updates.text;
      if (updates.completed !== undefined) {
        updatedData.completed = updates.completed;
        updatedData.completed_at = updates.completed ? new Date().toISOString() : null;
      }
      if (updates.dueDate !== undefined) {
        updatedData.due_date = updates.dueDate ? updates.dueDate.toISOString() : null;
      }
      if (updates.priority !== undefined) updatedData.priority = updates.priority;
      
      const { error } = await supabase
        .from('todos')
        .update(updatedData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating todo:', error);
      // Revert optimistic update
      fetchTodos(true);
      
      toast({
        title: 'Failed to update task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Remove todo with optimistic updates
  const removeTodo = async (id: string) => {
    if (!user) {
      return localTodos.removeTodo(id);
    }
    
    try {
      // Optimistic update
      const todoToRemove = todos.find(t => t.id === id);
      setTodos(prev => prev.filter(t => t.id !== id));
      
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Task removed',
        description: 'Your task has been removed.',
      });
    } catch (error: any) {
      console.error('Error removing todo:', error);
      // Revert optimistic update
      fetchTodos(true);
      
      toast({
        title: 'Failed to remove task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Convert DB todos to the format expected by the app with memoization
  const formattedTodos = useMemo(() => todos.map(dbTodo => ({
    id: dbTodo.id,
    text: dbTodo.text,
    completed: dbTodo.completed,
    createdAt: new Date(dbTodo.created_at),
    completedAt: dbTodo.completed_at ? new Date(dbTodo.completed_at) : null,
    dueDate: dbTodo.due_date ? new Date(dbTodo.due_date) : null,
    priority: dbTodo.priority as TodoPriority || 'medium',
  })), [todos]);

  // Apply filters with memoization
  const filteredTodos = useMemo(() => formattedTodos.filter(todo => {
    // Filter by completion status
    if (!filter.showCompleted && todo.completed) {
      return false;
    }

    // Filter by priority
    if (filter.priority !== 'all' && todo.priority !== filter.priority) {
      return false;
    }

    // Filter by timeframe
    if (filter.timeframe !== 'all' && todo.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (filter.timeframe === 'today') {
        return dueDate.getTime() === today.getTime();
      }
      
      if (filter.timeframe === 'week') {
        const weekLater = new Date(today);
        weekLater.setDate(today.getDate() + 7);
        return dueDate >= today && dueDate <= weekLater;
      }
      
      if (filter.timeframe === 'month') {
        const monthLater = new Date(today);
        monthLater.setMonth(today.getMonth() + 1);
        return dueDate >= today && dueDate <= monthLater;
      }
    }

    return true;
  }), [formattedTodos, filter]);

  // Sort todos with memoization
  const sortedTodos = useMemo(() => [...filteredTodos].sort((a, b) => {
    // Incomplete todos first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by due date (if available)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }
    
    // Then by priority
    const priorityValue = { high: 0, medium: 1, low: 2 };
    return priorityValue[a.priority] - priorityValue[b.priority];
  }), [filteredTodos]);

  // Combine DB todos with local todos for display with memoization
  const displayTodos = useMemo(() => 
    isSubscribed 
      ? sortedTodos 
      : isLoading ? localTodos.todos : [...sortedTodos, ...localTodos.todos],
    [isSubscribed, sortedTodos, isLoading, localTodos.todos]
  );

  // Calculate stats with memoization
  const stats = useMemo(() => {
    const completed = displayTodos.filter(todo => todo.completed).length;
    const total = displayTodos.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    // Get completion rate by day for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTodos = displayTodos.filter(todo => {
        if (!todo.completedAt) return false;
        const completedDate = new Date(todo.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === date.getTime();
      });
      
      return {
        date,
        completed: dayTodos.length
      };
    }).reverse();
    
    return {
      completed,
      total,
      completionRate,
      last7Days
    };
  }, [displayTodos]);

  return {
    todos: displayTodos,
    addTodo,
    toggleTodo,
    updateTodo,
    removeTodo,
    filter,
    setFilter,
    isLoading,
    stats,
    refresh: () => fetchTodos(true)
  };
}
