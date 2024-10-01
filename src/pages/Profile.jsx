import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileEditor from '../components/UserProfileEditor';
import NotificationSettings from '../components/NotificationSettings';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Profile = () => {
  const { session } = useSupabaseAuth();

  if (!session) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Informações do Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Configurações de Notificações</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UserProfileEditor />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;