import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Layout from './components/Layout';
import Index from './pages/Index';

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
        </Routes>
      </Router>
    </SupabaseAuthProvider>
  );
}

export default App;