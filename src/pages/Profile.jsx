import React from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Profile = () => {
  const { session } = useSupabaseAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
      <div>
        <p><strong>Nome:</strong> {session?.user?.user_metadata?.full_name || 'N/A'}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
        {/* Adicione mais informações do perfil conforme necessário */}
      </div>
    </div>
  );
};

export default Profile;