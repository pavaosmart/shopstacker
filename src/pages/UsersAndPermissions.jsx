import React, { useState } from 'react';
import { useUsers, useAddUser, useUpdateUser, useDeleteUser } from '../integrations/supabase/hooks/useUsers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Navigation from '../components/Navigation';

const UsersAndPermissions = () => {
  const [newUser, setNewUser] = useState({ email: '', full_name: '' });
  const [editingUser, setEditingUser] = useState(null);

  const { data: users, isLoading, error } = useUsers();
  const addUserMutation = useAddUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

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

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await updateUserMutation.mutateAsync(editingUser);
      setEditingUser(null);
      toast.success('Usuário atualizado com sucesso');
    } catch (error) {
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      toast.success('Usuário excluído com sucesso');
    } catch (error) {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar usuários: {error.message}</div>;

  return (
    <div>
      <Navigation />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Usuários e Permissões</h1>

        <form onSubmit={handleAddUser} className="mb-8">
          <h2 className="text-xl font-bold mb-2">Adicionar Novo Usuário</h2>
          <Input
            placeholder="Nome Completo"
            value={newUser.full_name}
            onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
            className="mb-2"
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2"
            required
          />
          <Button type="submit">Adicionar Usuário</Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button onClick={() => setEditingUser(user)} className="mr-2">Editar</Button>
                  <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {editingUser && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Editar Usuário</h2>
            <Input
              placeholder="Nome Completo"
              value={editingUser.full_name}
              onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
              className="mb-2"
            />
            <Input
              type="email"
              placeholder="Email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="mb-2"
            />
            <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
            <Button onClick={() => setEditingUser(null)} variant="outline" className="ml-2">Cancelar</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAndPermissions;