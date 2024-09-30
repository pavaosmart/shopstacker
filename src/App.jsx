import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Index from './pages/Index';
import CreateBot from './pages/CreateBot';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/create-bot"
              element={
                <ProtectedRoute>
                  <CreateBot />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;