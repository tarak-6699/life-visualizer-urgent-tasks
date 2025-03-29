
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useDbTodos } from '@/hooks/useDbTodos';
import { formatDate } from '@/utils/dateUtils';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, CheckCircle2, CircleX, Edit, Trash, Clock, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TodoPriorityColors = {
  'high': 'bg-red-500',
  'medium': 'bg-yellow-500',
  'low': 'bg-green-500',
};

const TodoList = () => {
  const { todos, addTodo, toggleTodo, updateTodo, removeTodo, filter, setFilter } = useDbTodos();
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined);
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    addTodo(text, dueDate || null, priority);
    setText('');
    setDueDate(undefined);
    setPriority('medium');
  };

  const startEdit = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    setEditingTodo(id);
    setEditText(todo.text);
    setEditDueDate(todo.dueDate || undefined);
    setEditPriority(todo.priority);
  };

  const handleUpdateTodo = () => {
    if (!editingTodo || !editText.trim()) return;
    
    updateTodo(editingTodo, {
      text: editText,
      dueDate: editDueDate,
      priority: editPriority,
    });
    
    setEditingTodo(null);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const getFilteredTodos = () => {
    return todos.filter(todo => {
      if (!filter.showCompleted && todo.completed) return false;
      if (filter.priority !== 'all' && todo.priority !== filter.priority) return false;
      
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
  };

  return (
    <div className="space-y-6">
      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? formatDate(dueDate) : "Due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
              {dueDate && (
                <div className="p-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDueDate(undefined)}
                  >
                    <CircleX className="mr-2 h-4 w-4" />
                    Clear date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Tasks</SheetTitle>
                <SheetDescription>
                  Customize which tasks are displayed
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Show Completed</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-completed"
                      checked={filter.showCompleted}
                      onCheckedChange={(checked) => 
                        setFilter({...filter, showCompleted: checked === true})
                      }
                    />
                    <label htmlFor="show-completed" className="text-sm">
                      Include completed tasks
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Priority</h3>
                  <Select 
                    value={filter.priority} 
                    onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => 
                      setFilter({...filter, priority: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Timeframe</h3>
                  <Select 
                    value={filter.timeframe} 
                    onValueChange={(value: 'all' | 'today' | 'week' | 'month') => 
                      setFilter({...filter, timeframe: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button 
                    onClick={() => setFilter({
                      showCompleted: true,
                      priority: 'all',
                      timeframe: 'all'
                    })}
                    variant="outline"
                  >
                    Reset Filters
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </form>
      
      {/* Todo List */}
      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">In Progress</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <TodoItems 
            todos={getFilteredTodos()} 
            toggleTodo={toggleTodo}
            startEdit={startEdit}
            removeTodo={removeTodo}
            editingTodo={editingTodo}
            editText={editText}
            setEditText={setEditText}
            editDueDate={editDueDate}
            setEditDueDate={setEditDueDate}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
            handleUpdateTodo={handleUpdateTodo}
            handleCancelEdit={handleCancelEdit}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <TodoItems 
            todos={getFilteredTodos().filter(todo => !todo.completed)} 
            toggleTodo={toggleTodo}
            startEdit={startEdit}
            removeTodo={removeTodo}
            editingTodo={editingTodo}
            editText={editText}
            setEditText={setEditText}
            editDueDate={editDueDate}
            setEditDueDate={setEditDueDate}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
            handleUpdateTodo={handleUpdateTodo}
            handleCancelEdit={handleCancelEdit}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <TodoItems 
            todos={getFilteredTodos().filter(todo => todo.completed)} 
            toggleTodo={toggleTodo}
            startEdit={startEdit}
            removeTodo={removeTodo}
            editingTodo={editingTodo}
            editText={editText}
            setEditText={setEditText}
            editDueDate={editDueDate}
            setEditDueDate={setEditDueDate}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
            handleUpdateTodo={handleUpdateTodo}
            handleCancelEdit={handleCancelEdit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TodoItemsProps {
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    dueDate: Date | null;
    priority: 'low' | 'medium' | 'high';
  }>;
  toggleTodo: (id: string) => void;
  startEdit: (id: string) => void;
  removeTodo: (id: string) => void;
  editingTodo: string | null;
  editText: string;
  setEditText: (text: string) => void;
  editDueDate: Date | undefined;
  setEditDueDate: (date: Date | undefined) => void;
  editPriority: 'low' | 'medium' | 'high';
  setEditPriority: (priority: 'low' | 'medium' | 'high') => void;
  handleUpdateTodo: () => void;
  handleCancelEdit: () => void;
}

const TodoItems: React.FC<TodoItemsProps> = ({
  todos, 
  toggleTodo,
  startEdit,
  removeTodo,
  editingTodo,
  editText,
  setEditText,
  editDueDate,
  setEditDueDate,
  editPriority,
  setEditPriority,
  handleUpdateTodo,
  handleCancelEdit
}) => {
  
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle2 className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>No tasks found.</p>
      </div>
    );
  }
  
  return (
    <ul className="space-y-3">
      {todos.map(todo => (
        <li 
          key={todo.id} 
          className={`flex items-start gap-2 p-3 border rounded-lg ${
            todo.completed ? 'bg-muted/30' : 'bg-background'
          }`}
        >
          {editingTodo === todo.id ? (
            <div className="w-full space-y-3">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
              />
              
              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editDueDate ? formatDate(editDueDate) : "Due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editDueDate}
                      onSelect={setEditDueDate}
                      initialFocus
                    />
                    {editDueDate && (
                      <div className="p-3 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditDueDate(undefined)}
                        >
                          <CircleX className="mr-2 h-4 w-4" />
                          Clear date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                
                <Select value={editPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setEditPriority(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2 ml-auto">
                  <Button size="sm" onClick={handleUpdateTodo}>Save</Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Checkbox 
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${TodoPriorityColors[todo.priority]}`} />
                  <label 
                    htmlFor={`todo-${todo.id}`}
                    className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.text}
                  </label>
                </div>
                
                {todo.dueDate && (
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDate(todo.dueDate)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                      <DialogDescription>
                        Update your task details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Task</label>
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          placeholder="Enter task description"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Due Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editDueDate ? formatDate(editDueDate) : "Select due date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={editDueDate}
                              onSelect={setEditDueDate}
                              initialFocus
                            />
                            {editDueDate && (
                              <div className="p-3 border-t border-border">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditDueDate(undefined)}
                                >
                                  <CircleX className="mr-2 h-4 w-4" />
                                  Clear date
                                </Button>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select value={editPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setEditPriority(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                      <Button onClick={handleUpdateTodo}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeTodo(todo.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
