
import { useState, useEffect } from 'react';

export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt: Date | null;
  dueDate: Date | null;
  priority: TodoPriority;
};

export type TodoFilter = {
  showCompleted: boolean;
  priority: TodoPriority | 'all';
  timeframe: 'all' | 'today' | 'week' | 'month';
};

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('lifetracker-todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : null,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null
      }));
    }
    return [];
  });

  const [filter, setFilter] = useState<TodoFilter>({
    showCompleted: true,
    priority: 'all',
    timeframe: 'all'
  });

  useEffect(() => {
    localStorage.setItem('lifetracker-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, dueDate: Date | null = null, priority: TodoPriority = 'medium') => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      completed: false,
      createdAt: new Date(),
      completedAt: null,
      dueDate,
      priority
    };
    setTodos([newTodo, ...todos]);
    return newTodo;
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date() : null
          };
        }
        return todo;
      })
    );
  };

  const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...updates };
        }
        return todo;
      })
    );
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
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
  });

  // Sort todos: incomplete first, then by due date, then by priority
  const sortedTodos = [...filteredTodos].sort((a, b) => {
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
  });

  const getTodoStats = () => {
    const completed = todos.filter(todo => todo.completed).length;
    const total = todos.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    // Get completion rate by day for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTodos = todos.filter(todo => {
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
  };

  return {
    todos: sortedTodos,
    addTodo,
    toggleTodo,
    updateTodo,
    removeTodo,
    filter,
    setFilter,
    stats: getTodoStats()
  };
}
