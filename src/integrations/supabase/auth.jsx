import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase.js';
import { useQueryClient } from '@tanstack/react-query';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setLoading(false);
      if (event === 'SIGNED_IN') {
        queryClient.invalidateQueries('user');
      }
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Email ou senha incorretos. Por favor, tente novamente.');
        }
        throw error;
      }
      setSession(data.session);
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
      queryClient.invalidateQueries('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Google login error:', error);
      return { data: null, error };
    }
  };

  const loginWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Facebook login error:', error);
      return { data: null, error };
    }
  };

  const value = {
    session,
    loading,
    login,
    register,
    logout,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
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