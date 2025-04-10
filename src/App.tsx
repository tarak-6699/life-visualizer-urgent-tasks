
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

// Import Dashboard directly to avoid lazy loading issues
import Dashboard from "./pages/Dashboard";

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

// Pre-load critical pages
const Index = React.lazy(() => import("./pages/Index"));
const Auth = React.lazy(() => import("./pages/Auth"));

// Use import() directly for other pages to avoid issues with dynamic imports
const Grid = React.lazy(() => import("./pages/Grid"));
const Tasks = React.lazy(() => import("./pages/Tasks"));
const Goals = React.lazy(() => import("./pages/Goals"));
const Calendar = React.lazy(() => import("./pages/Calendar"));
const Settings = React.lazy(() => import("./pages/Settings"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Create a query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      networkMode: 'online',
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <UserProvider>
              <React.Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes that don't use the layout */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Protected routes with AppLayout */}
                  <Route element={<AppLayout />}>
                    <Route 
                      path="/dashboard" 
                      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
                    />
                    <Route 
                      path="/grid" 
                      element={<ProtectedRoute><Grid /></ProtectedRoute>} 
                    />
                    <Route 
                      path="/tasks" 
                      element={<ProtectedRoute><Tasks /></ProtectedRoute>} 
                    />
                    <Route 
                      path="/goals" 
                      element={<ProtectedRoute><Goals /></ProtectedRoute>} 
                    />
                    <Route 
                      path="/calendar" 
                      element={<ProtectedRoute><Calendar /></ProtectedRoute>} 
                    />
                    <Route 
                      path="/settings" 
                      element={<ProtectedRoute><Settings /></ProtectedRoute>} 
                    />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </React.Suspense>
              <Toaster />
              <Sonner />
            </UserProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
