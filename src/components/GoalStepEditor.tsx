
// In the insert function, make sure to include user_id:
const { error } = await supabase
  .from('goal_steps')
  .insert(steps.map(step => ({
    ...step,
    user_id: user.id // Add this line to include user_id
  })));
