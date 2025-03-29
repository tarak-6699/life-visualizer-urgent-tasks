import React, { createContext, useContext, useState, useEffect } from 'react';

export type User = {
  name: string;
  birthdate: Date | null;
  lifeExpectancy: number;
  goals: Goal[];
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  targetDate: Date | null;
  completed: boolean;
};

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isProfileSetup: boolean;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goal: Goal) => void;
  removeGoal: (id: string) => void;
}

const defaultUser: User = {
  name: '',
  birthdate: null,
  lifeExpectancy: 90,
  goals: [],
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
  isProfileSetup: false,
  addGoal: () => {},
  updateGoal: () => {},
  removeGoal: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('lifetracker-user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      
      // Ensure life expectancy doesn't exceed 100
      const lifeExpectancy = Math.min(parsed.lifeExpectancy || 90, 100);
      
      return {
        ...parsed,
        lifeExpectancy,
        birthdate: parsed.birthdate ? new Date(parsed.birthdate) : null,
        goals: parsed.goals?.map((goal: any) => ({
          ...goal,
          completed: goal.completed !== undefined ? goal.completed : false,
          targetDate: goal.targetDate ? new Date(goal.targetDate) : null
        })) || []
      };
    }
    return null;
  });

  const isProfileSetup = !!user?.name && !!user?.birthdate;

  useEffect(() => {
    if (user) {
      localStorage.setItem('lifetracker-user', JSON.stringify(user));
    }
  }, [user]);

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    if (!user) return;
    
    const newGoal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 9),
      completed: goal.completed !== undefined ? goal.completed : false,
    };
    
    setUser({
      ...user,
      goals: [...user.goals, newGoal]
    });
  };

  const updateGoal = (updatedGoal: Goal) => {
    if (!user) return;
    
    setUser({
      ...user,
      goals: user.goals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    });
  };

  const removeGoal = (id: string) => {
    if (!user) return;
    
    setUser({
      ...user,
      goals: user.goals.filter(goal => goal.id !== id)
    });
  };
  
  const setUserWithConstraints = (newUser: User | null) => {
    if (!newUser) {
      setUser(null);
      return;
    }
    
    const constrainedUser = {
      ...newUser,
      lifeExpectancy: Math.min(newUser.lifeExpectancy || 90, 100)
    };
    
    setUser(constrainedUser);
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser: setUserWithConstraints, 
        isProfileSetup,
        addGoal,
        updateGoal,
        removeGoal
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
