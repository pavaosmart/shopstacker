import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ActivityLogs from './pages/ActivityLogs';
import UsersAndPermissions from './pages/UsersAndPermissions';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';
import UIComponentsPanel from './components/UIComponentsPanel';
import { SupabaseAuthProvider } from './integrations/supabase/auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
            <Route path="/users" element={<UsersAndPermissions />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
          <UIComponentsPanel />
        </Router>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;