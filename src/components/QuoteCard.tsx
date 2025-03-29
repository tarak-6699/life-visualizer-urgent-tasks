
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// List of motivational quotes
const QUOTES = [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
    author: "Mother Teresa"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Life is 10% what happens to us and 90% how we react to it.",
    author: "Charles R. Swindoll"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "You have within you right now, everything you need to deal with whatever the world can throw at you.",
    author: "Brian Tracy"
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama"
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali"
  },
  {
    text: "You only live once, but if you do it right, once is enough.",
    author: "Mae West"
  }
];

const QuoteCard: React.FC = () => {
  const [quote, setQuote] = useState<{ text: string; author: string }>({ text: "", author: "" });
  
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[randomIndex];
  };
  
  const refreshQuote = () => {
    setQuote(getRandomQuote());
  };
  
  useEffect(() => {
    refreshQuote();
  }, []);
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshQuote} 
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-start gap-3">
          <Quote className="h-10 w-10 text-primary shrink-0 mt-1" />
          <div>
            <p className="text-lg font-medium italic">"{quote.text}"</p>
            <p className="text-sm text-muted-foreground mt-2">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
