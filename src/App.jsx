import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ActivityLogs from './pages/ActivityLogs';
import UsersAndPermissions from './pages/UsersAndPermissions';
import Login from './pages/Login';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import UIComponentsPanel from './components/UIComponentsPanel';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="activity-logs" element={<ActivityLogs />} />
              <Route path="users" element={<UsersAndPermissions />} />
            </Route>
          </Routes>
          <UIComponentsPanel />
        </Router>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;