import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ActivityLogs from './components/ActivityLogs';
import UsersAndPermissions from './pages/UsersAndPermissions';
import ComponentesUI from './pages/ComponentesUI';
import { SupabaseAuthProvider } from './integrations/supabase/auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logs" element={<ActivityLogs />} />
            <Route path="/users" element={<UsersAndPermissions />} />
            <Route path="/componentes-ui" element={<ComponentesUI />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;