
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  BarChart, 
  CheckSquare, 
  Settings, 
  CalendarDays,
  Target,
  LogOut,
  LogIn,
  User
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <BarChart className="h-5 w-5" />
    },
    {
      path: '/grid',
      label: 'Life Grid',
      icon: <LayoutGrid className="h-5 w-5" />
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: <CheckSquare className="h-5 w-5" />
    },
    {
      path: '/goals',
      label: 'Goals',
      icon: <Target className="h-5 w-5" />
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: <CalendarDays className="h-5 w-5" />
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was an error signing out."
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // If not authenticated and not on auth or home page, redirect to home
  React.useEffect(() => {
    const publicRoutes = ['/', '/auth'];
    if (!user && !publicRoutes.includes(location.pathname)) {
      navigate('/auth');
    }
  }, [user, location.pathname, navigate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full min-h-screen">
        {user && (
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center p-2">
                <span className="text-xl font-semibold tracking-tight ml-2">LifeTracker</span>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      tooltip={item.label}
                      isActive={isActive(item.path)}
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="p-2">
                <div className="flex items-center gap-2 p-2 mb-2">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                    <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <p className="font-medium text-sm">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
        )}
        
        <SidebarInset>
          {user && (
            <div className="flex items-center h-16 px-4 border-b">
              <SidebarTrigger />
              <div className="flex-1" />
            </div>
          )}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
