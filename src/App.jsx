import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ActivityLogs from './components/ActivityLogs';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './integrations/supabase/supabase';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard supabase={supabase} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity-logs"
                element={
                  <ProtectedRoute>
                    <ActivityLogs />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;