
-- Create goal steps table for breaking down goals into smaller steps
CREATE TABLE IF NOT EXISTS public.goal_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "order" INTEGER NOT NULL DEFAULT 0
);

-- Add Row Level Security
ALTER TABLE public.goal_steps ENABLE ROW LEVEL SECURITY;

-- Create policies to ensure users can only see and manage their own goal steps
CREATE POLICY "Users can view their own goal steps" 
  ON public.goal_steps 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goal steps" 
  ON public.goal_steps 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goal steps" 
  ON public.goal_steps 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal steps" 
  ON public.goal_steps 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add function to update timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp
CREATE TRIGGER update_goal_steps_updated_at
  BEFORE UPDATE ON public.goal_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add Real-time functionality
ALTER TABLE public.goal_steps REPLICA IDENTITY FULL;
