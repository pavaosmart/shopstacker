import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationList from '../components/NotificationList';
import NotificationCreator from '../components/NotificationCreator';
import NotificationScheduler from '../components/NotificationScheduler';

const NotificationManager = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestor de Notificações</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Lista de Notificações</TabsTrigger>
          <TabsTrigger value="create">Criar Notificação</TabsTrigger>
          <TabsTrigger value="schedule">Agendar Notificação</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <NotificationList />
        </TabsContent>
        <TabsContent value="create">
          <NotificationCreator />
        </TabsContent>
        <TabsContent value="schedule">
          <NotificationScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationManager;