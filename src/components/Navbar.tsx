
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  BarChart, 
  CheckSquare, 
  Settings, 
  Menu, 
  X,
  CalendarDays,
  Target,
  LogOut,
  LogIn,
  User
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isProfileSetup } = useUser();
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <BarChart className="h-5 w-5" />,
      showAlways: true
    },
    {
      path: '/grid',
      label: 'Life Grid',
      icon: <LayoutGrid className="h-5 w-5" />,
      showAlways: false
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: <CheckSquare className="h-5 w-5" />,
      showAlways: false
    },
    {
      path: '/goals',
      label: 'Goals',
      icon: <Target className="h-5 w-5" />,
      showAlways: false
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: <CalendarDays className="h-5 w-5" />,
      showAlways: false
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      showAlways: false
    }
  ];
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-[80%] mx-auto flex h-16 items-center px-4 sm:px-6">
        <Link to="/" className="flex items-center mr-4" onClick={closeMenu}>
          <span className="font-semibold text-2xl tracking-tight">LifeTracker</span>
        </Link>
        
        <div className="flex-1" />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            (link.showAlways || isProfileSetup || user) && (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          ))}
        </nav>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-4">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                  <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
                  {user.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="default" className="ml-4">
            <Link to="/auth">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        )}
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-b animate-fade-in">
          <nav className="max-w-[80%] mx-auto flex flex-col py-4">
            {navLinks.map((link) => (
              (link.showAlways || isProfileSetup || user) && (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            ))}
            
            {!user && (
              <Link
                to="/auth"
                onClick={closeMenu}
                className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <LogIn className="h-5 w-5" />
                Sign In / Sign Up
              </Link>
            )}
            
            {user && (
              <button
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
                className="flex items-center gap-2 py-2 text-sm font-medium transition-colors hover:text-red-600 text-red-600"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
