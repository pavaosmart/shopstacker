import React, { useState } from 'react';
import { useCurrentUser, useUpdateUser } from '../integrations/supabase/hooks/useUsers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navigation from '../components/Navigation';

const UsersAndPermissions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading, error } = useCurrentUser();
  const updateUserMutation = useUpdateUser();

  const [editedUser, setEditedUser] = useState(null);

  const handleUpdateUser = async () => {
    if (!editedUser) return;
    try {
      await updateUserMutation.mutateAsync(editedUser);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar perfil: {error.message}</div>;

  return (
    <div>
      <Navigation />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>

        {isEditing ? (
          <div>
            <Input
              placeholder="Nome Completo"
              value={editedUser.full_name}
              onChange={(e) => setEditedUser({ ...editedUser, full_name: e.target.value })}
              className="mb-2"
            />
            <Input
              type="email"
              placeholder="Email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="mb-2"
            />
            <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="ml-2">Cancelar</Button>
          </div>
        ) : (
          <div>
            <p><strong>Nome:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Button onClick={() => {
              setEditedUser(user);
              setIsEditing(true);
            }} className="mt-2">Editar Perfil</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAndPermissions;