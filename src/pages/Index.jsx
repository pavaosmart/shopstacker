import React from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Index = () => {
  const { session } = useSupabaseAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo ao MyShopTools</h1>
      {session ? (
        <p>Olá, {session.user.email}! Você está logado.</p>
      ) : (
        <p>Por favor, faça login para acessar todas as funcionalidades.</p>
      )}
    </div>
  );
};

export default Index;