
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface ProductiveDayProps {
  mostProductiveDay: {
    date: Date;
    completed: number;
  } | null;
}

const ProductiveDay: React.FC<ProductiveDayProps> = ({ mostProductiveDay }) => {
  return (
    <Card className="glass-card border-gradient shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          Most Productive Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mostProductiveDay && mostProductiveDay.completed > 0 ? (
          <div className="text-center py-4">
            <p className="text-2xl font-bold">
              {new Date(mostProductiveDay.date).toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(new Date(mostProductiveDay.date))}
            </p>
            <p className="mt-2">
              {mostProductiveDay.completed} tasks completed
            </p>
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground text-sm">
            No tasks completed in the last 7 days
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(ProductiveDay);
