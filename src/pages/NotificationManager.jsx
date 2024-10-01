import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessageNotifications from '../components/MessageNotifications';
import SystemUpdateNotifications from '../components/SystemUpdateNotifications';
import ReminderNotifications from '../components/ReminderNotifications';

const NotificationManager = () => {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestor de Notificações</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="system-updates">Atualizações do Sistema</TabsTrigger>
          <TabsTrigger value="reminders">Lembretes</TabsTrigger>
        </TabsList>
        <TabsContent value="messages">
          <MessageNotifications />
        </TabsContent>
        <TabsContent value="system-updates">
          <SystemUpdateNotifications />
        </TabsContent>
        <TabsContent value="reminders">
          <ReminderNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationManager;