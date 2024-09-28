import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Index = () => {
  const { session } = useSupabaseAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">MyShopTools UI Components</h1>
      <div className="text-center mb-8">
        <Button>Open UI Components Panel</Button>
      </div>
      {!session && (
        <div className="text-center mb-8">
          <Link to="/login" className="text-blue-500 hover:underline mr-4">Login</Link>
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Index;