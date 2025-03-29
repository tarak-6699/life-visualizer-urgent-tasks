import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useUser } from '@/contexts/UserContext';
import { useTodos } from '@/hooks/useTodos';
import { formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Link2, AlertCircle, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

const CalendarPage = () => {
  const { user, isProfileSetup } = useUser();
  const navigate = useNavigate();
  const { todos } = useTodos();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateTodos, setSelectedDateTodos] = useState<any[]>([]);
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if previously connected
    const savedConnection = localStorage.getItem('google-calendar-connection');
    if (savedConnection) {
      setIsConnected(true);
      setGoogleCalendarUrl(savedConnection);
    }
  }, []);
  
  useEffect(() => {
    if (!isProfileSetup) {
      navigate('/');
    }
  }, [isProfileSetup, navigate]);
  
  useEffect(() => {
    if (!date) return;
    
    const filteredTodos = todos.filter(todo => {
      if (!todo.dueDate) return false;
      
      const todoDate = new Date(todo.dueDate);
      return todoDate.getDate() === date.getDate() && 
             todoDate.getMonth() === date.getMonth() && 
             todoDate.getFullYear() === date.getFullYear();
    });
    
    setSelectedDateTodos(filteredTodos);
  }, [date, todos]);
  
  const getDatesWithTasks = () => {
    const dates = new Set<number>();
    
    todos.forEach(todo => {
      if (todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        dates.add(dueDate.getTime());
      }
    });
    
    return Array.from(dates).map(timestamp => new Date(timestamp));
  };
  
  const datesWithTasks = getDatesWithTasks();
  
  const handleConnectGoogleCalendar = () => {
    if (!googleCalendarUrl) {
      toast({
        title: "Error",
        description: "Please enter your Google Calendar URL",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we'd use OAuth for Google Calendar
    // This is a simplified simulation
    localStorage.setItem('google-calendar-connection', googleCalendarUrl);
    setIsConnected(true);
    
    toast({
      title: "Connected to Google Calendar",
      description: "Your calendar has been linked successfully",
    });
  };
  
  const handleDisconnect = () => {
    localStorage.removeItem('google-calendar-connection');
    setIsConnected(false);
    setGoogleCalendarUrl('');
    
    toast({
      title: "Disconnected",
      description: "Your Google Calendar has been unlinked",
    });
  };
  
  if (!isProfileSetup) return null;
  
  return (
    <div className="space-y-8 page-transition">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your schedule and track your tasks over time.
        </p>
      </div>
      
      <Tabs defaultValue="calendar">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="calendar" className="flex-1">Calendar View</TabsTrigger>
          <TabsTrigger value="integration" className="flex-1">Google Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Monthly View</CardTitle>
                <CardDescription>
                  Select a date to view or add tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border p-3 w-full"
                  modifiers={{
                    hasTasks: datesWithTasks
                  }}
                  modifiersStyles={{
                    hasTasks: {
                      fontWeight: 'bold',
                      backgroundColor: 'var(--primary-50)',
                      borderBottom: '2px solid var(--primary)'
                    }
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>
                  {date ? formatDate(date) : 'Select a Date'}
                </CardTitle>
                <CardDescription>
                  Tasks scheduled for this day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateTodos.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedDateTodos.map(todo => (
                      <li 
                        key={todo.id}
                        className={`p-3 rounded-md border ${
                          todo.completed ? 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                            {todo.text}
                          </div>
                          <div className={`w-3 h-3 rounded-full ${todo.priority === 'high' ? 'bg-red-500' : todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    {date ? 'No tasks scheduled for this day' : 'Select a date to view tasks'}
                  </div>
                )}
                
                {date && (
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => navigate('/tasks')}
                  >
                    Add Task for This Day
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="integration">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Google Calendar Integration</CardTitle>
              <CardDescription>
                Connect your Google Calendar to sync events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-green-50 dark:bg-green-950 rounded-md">
                    <Globe className="h-5 w-5 mr-2 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Connected to Google Calendar</p>
                      <p className="text-sm text-muted-foreground truncate">{googleCalendarUrl}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="destructive" onClick={handleDisconnect}>
                      Disconnect Calendar
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-md flex items-start space-x-2 text-sm">
                    <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Note about integration</p>
                      <p className="text-muted-foreground">
                        This is a simulated integration. In a real application, we would use 
                        Google's OAuth flow to properly authenticate and connect to your calendar.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="calendar-url" className="text-sm font-medium">
                      Google Calendar URL
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        id="calendar-url"
                        placeholder="https://calendar.google.com/calendar/..."
                        value={googleCalendarUrl}
                        onChange={(e) => setGoogleCalendarUrl(e.target.value)}
                      />
                      <Button onClick={handleConnectGoogleCalendar}>
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the sharing URL of your Google Calendar
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md mt-6">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5" />
                      How to connect your Google Calendar
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Go to <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Calendar</a></li>
                      <li>Open Calendar Settings</li>
                      <li>Under "Settings for my calendars", select your calendar</li>
                      <li>Find "Integrate calendar" section</li>
                      <li>Copy the "Public URL to this calendar" link</li>
                      <li>Paste it into the field above and click Connect</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarPage;
