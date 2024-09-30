import React, { useState } from 'react';
import { useCurrentUser, useUpdateUser, useDeleteUser, useAddUser, useUsers } from '../integrations/supabase/hooks/useUsers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Users className="mr-2" />
            Usuários e Permissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
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
            </DialogContent>
          </Dialog>

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
                  <TableCell>{user.full_name || 'Não definido'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" className="mr-2" onClick={() => {
                      setEditedUser(user);
                      setIsEditing(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isEditing && (
        <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }} className="space-y-4">
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
              <Button type="submit">Salvar Alterações</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UsersAndPermissions;