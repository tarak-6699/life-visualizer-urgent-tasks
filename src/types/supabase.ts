export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid';
  price_id: string | null;
  quantity: number | null;
  cancel_at_period_end: boolean | null;
  cancel_at: string | null;
  canceled_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  ended_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
};

export type DbGoal = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type DbGoalStep = {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  order: number;
};

export type DbTodo = {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high' | null;
};

export type GoalWithSteps = {
  goal: DbGoal;
  steps: DbGoalStep[];
  completion_percentage: number;
};

export type GoalsByTimeframe = {
  shortTerm: number; 
  mediumTerm: number; 
  longTerm: number;
};

export type GoalsByStatus = {
  completed: number;
  inProgress: number;
}

export type GoalAnalytics = {
  byTimeframe: GoalsByTimeframe;
  byStatus: GoalsByStatus;
  completionRate: number;
  totalGoals: number;
};
