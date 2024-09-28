import React, { useState } from 'react';
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
import UIComponentsPanel from './components/UIComponentsPanel';
import { Menu } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Toaster />
        <Router>
          <div className="relative">
            <button
              onClick={togglePanel}
              className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <UIComponentsPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/logs" element={<ActivityLogs />} />
              <Route path="/users" element={<UsersAndPermissions />} />
              <Route path="/componentes-ui" element={<ComponentesUI />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;