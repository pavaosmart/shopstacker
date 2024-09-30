import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Layout from './components/Layout';
import Index from './pages/Index';
import Products from './pages/Products';
import Orders from './pages/Orders';
import ActivityLogs from './pages/ActivityLogs';
import UsersAndPermissions from './pages/UsersAndPermissions';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Help from './pages/Help';
import API from './pages/API';
import Profile from './pages/Profile';
import Documentation from './pages/Documentation';
import UIComponentsPanel from './components/UIComponentsPanel';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="activity-logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute><UsersAndPermissions /></ProtectedRoute>} />
              <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              <Route path="help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
              <Route path="api" element={<ProtectedRoute><API /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="documentation" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
            </Route>
          </Routes>
          <UIComponentsPanel />
        </Router>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;