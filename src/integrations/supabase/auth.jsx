import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase.js';
import { useQueryClient } from '@tanstack/react-query';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Invalidate and refetch queries when the token is refreshed
        queryClient.invalidateQueries();
      }
    });

    getSession();

    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, [queryClient]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error };
    }
  };

  const register = async (email, password, { name, phone }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { data: null, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      queryClient.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    session,
    loading,
    login,
    register,
    logout,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {!loading && children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};