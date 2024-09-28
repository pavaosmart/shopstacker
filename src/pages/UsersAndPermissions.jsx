import React, { useState } from 'react';
import { useCurrentUser, useUpdateUser, useDeleteUser, useAddUser, useUsers } from '../integrations/supabase/hooks/useUsers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navigation from '../components/Navigation';

const UsersAndPermissions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: currentUser, isLoading: isCurrentUserLoading, error: currentUserError } = useCurrentUser();
  const { data: users, isLoading: isUsersLoading, error: usersError } = useUsers();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const addUserMutation = useAddUser();

  const [editedUser, setEditedUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', full_name: '' });

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

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      toast.success('Usuário excluído com sucesso');
    } catch (error) {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUserMutation.mutateAsync(newUser);
      setNewUser({ email: '', full_name: '' });
      toast.success('Usuário adicionado com sucesso');
    } catch (error) {
      toast.error(`Erro ao adicionar usuário: ${error.message}`);
    }
  };

  if (isCurrentUserLoading || isUsersLoading) return <div>Carregando...</div>;
  if (currentUserError || usersError) return <div>Erro ao carregar dados: {currentUserError?.message || usersError?.message}</div>;

  return (
    <div>
      <Navigation />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>

        {currentUser && (
          <div className="mb-8">
            {isEditing ? (
              <div>
                <Input
                  placeholder="Nome Completo"
                  value={editedUser?.full_name || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, full_name: e.target.value })}
                  className="mb-2"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={editedUser?.email || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="mb-2"
                />
                <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="ml-2">Cancelar</Button>
              </div>
            ) : (
              <div>
                <p><strong>Nome:</strong> {currentUser.full_name || 'Não definido'}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <Button onClick={() => {
                  setEditedUser(currentUser);
                  setIsEditing(true);
                }} className="mt-2">Editar Perfil</Button>
              </div>
            )}
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Adicionar Novo Usuário</h2>
        <form onSubmit={handleAddUser} className="mb-8">
          <Input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2"
            required
          />
          <Input
            placeholder="Nome Completo"
            value={newUser.full_name}
            onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
            className="mb-2"
            required
          />
          <Button type="submit">Adicionar Usuário</Button>
        </form>

        <h2 className="text-xl font-bold mb-4">Lista de Usuários</h2>
        {users && users.map((user) => (
          <div key={user.id} className="mb-4 p-4 border rounded">
            <p><strong>Nome:</strong> {user.full_name || 'Não definido'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Button onClick={() => handleDeleteUser(user.id)} className="mt-2" variant="destructive">Excluir Usuário</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersAndPermissions;