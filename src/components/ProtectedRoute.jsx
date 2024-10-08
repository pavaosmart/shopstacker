import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const ProtectedRoute = ({ children }) => {
  const { session } = useSupabaseAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;