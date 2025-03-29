
import React, { useState, useEffect } from 'react';
import { useLifeProgress } from '@/hooks/useLifeProgress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const LifeCountdown: React.FC = () => {
  const { yearsLeft } = useLifeProgress();
  const [countdown, setCountdown] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate the initial time left
    const calculateTimeLeft = () => {
      // Calculate the end date based on today + yearsLeft
      const now = new Date();
      
      // Create exact end date that's yearsLeft years from now
      const endDate = new Date(now);
      endDate.setFullYear(endDate.getFullYear() + Math.floor(yearsLeft));
      
      // Add months for fractional years
      const monthsToAdd = Math.floor((yearsLeft % 1) * 12);
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
      
      // Calculate the time difference
      const difference = endDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        return {
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      // Calculate years, months, days, hours, minutes, seconds
      const msPerSecond = 1000;
      const msPerMinute = msPerSecond * 60;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      
      // Calculate each component
      const years = Math.floor(yearsLeft);
      
      // Calculate months remaining after years
      let months = Math.floor((yearsLeft - years) * 12);
      
      // Calculate days remaining
      const currentDate = new Date();
      const futureDate = new Date(currentDate);
      futureDate.setFullYear(futureDate.getFullYear() + years);
      futureDate.setMonth(futureDate.getMonth() + months);
      
      // Adjust for month boundaries
      let days = 0;
      let tempDate = new Date(currentDate);
      tempDate.setFullYear(tempDate.getFullYear() + years);
      tempDate.setMonth(tempDate.getMonth() + months);
      
      // Get the actual number of days in the current month
      const lastDayOfMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
      days = Math.min(lastDayOfMonth - currentDate.getDate(), 
                     difference % msPerDay > 0 ? Math.floor((difference % (msPerDay * 30)) / msPerDay) : 0);
      
      // Time components
      const hours = Math.floor((difference % msPerDay) / msPerHour);
      const minutes = Math.floor((difference % msPerHour) / msPerMinute);
      const seconds = Math.floor((difference % msPerMinute) / msPerSecond);
      
      return { years, months, days, hours, minutes, seconds };
    };
    
    setCountdown(calculateTimeLeft());
    
    // Update the countdown every second
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [yearsLeft]);
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Life Countdown
        </CardTitle>
        <CardDescription>
          Every second counts. Make them meaningful.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2 text-center">
          <div className="p-2">
            <div className="text-2xl font-bold">{countdown.years}</div>
            <div className="text-xs text-muted-foreground">years</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-bold">{countdown.months}</div>
            <div className="text-xs text-muted-foreground">months</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-bold">{countdown.days}</div>
            <div className="text-xs text-muted-foreground">days</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-bold">{countdown.hours}</div>
            <div className="text-xs text-muted-foreground">hours</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-bold">{countdown.minutes}</div>
            <div className="text-xs text-muted-foreground">minutes</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-bold">{countdown.seconds}</div>
            <div className="text-xs text-muted-foreground">seconds</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifeCountdown;
