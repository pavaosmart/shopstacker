import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import ComponentesUI from './pages/ComponentesUI';
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';
import { SupabaseAuthProvider } from './integrations/supabase/auth';

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/componentes-ui" element={<ComponentesUI />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </SupabaseAuthProvider>
  );
}

export default App;