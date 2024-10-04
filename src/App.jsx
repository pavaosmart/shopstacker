import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Index from './pages/Index';
import Estoque from './pages/Estoque';
import MeusProdutos from './pages/MeusProdutos';
import Market from './pages/Market';
import ProductDetails from './pages/ProductDetails';
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
import Integrations from './pages/APIStore';
import OpenAIIntegration from './components/OpenAIIntegration';
import Profile from './pages/Profile';
import Documentation from './pages/Documentation';
import UIComponentsPanel from './components/UIComponentsPanel';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
                <Route path="meus-produtos" element={<ProtectedRoute><MeusProdutos /></ProtectedRoute>} />
                <Route path="estoque" element={<ProtectedRoute><Estoque /></ProtectedRoute>} />
                <Route path="product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="activity-logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
                <Route path="users" element={<ProtectedRoute><UsersAndPermissions /></ProtectedRoute>} />
                <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
                <Route path="support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="api-integration/openai" element={<ProtectedRoute><OpenAIIntegration /></ProtectedRoute>} />
              </Route>
            </Routes>
            <UIComponentsPanel />
          </Router>
        </AuthProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;