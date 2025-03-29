
import { useUser } from '../contexts/UserContext';

export function useLifeProgress() {
  const { user } = useUser();
  
  if (!user?.birthdate) {
    return {
      age: 0,
      totalWeeks: 0,
      pastWeeks: 0,
      percentComplete: 0,
      weeksLeft: 0,
      yearsLeft: 0,
      totalYears: 0,
    };
  }
  
  const birthdate = new Date(user.birthdate);
  const now = new Date();
  
  // Calculate age
  const ageDate = new Date(now.getTime() - birthdate.getTime());
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  
  // Ensure life expectancy is correctly used
  const lifeExpectancy = Math.min(user.lifeExpectancy || 90, 100);
  
  // Calculate weeks
  const totalYears = lifeExpectancy;
  const totalWeeks = totalYears * 52;
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const pastWeeks = Math.floor((now.getTime() - birthdate.getTime()) / msPerWeek);
  const percentComplete = (pastWeeks / totalWeeks) * 100;
  const weeksLeft = Math.max(0, totalWeeks - pastWeeks);
  const yearsLeft = Math.max(0, lifeExpectancy - age);
  
  return {
    age,
    totalWeeks,
    pastWeeks,
    percentComplete: Math.min(100, Math.max(0, percentComplete)),
    weeksLeft: Math.max(0, weeksLeft),
    yearsLeft: Math.max(0, yearsLeft),
    totalYears,
  };
}
