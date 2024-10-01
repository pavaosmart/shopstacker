import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessageNotifications from './MessageNotifications';
import SystemUpdateNotifications from './SystemUpdateNotifications';
import ReminderNotifications from './ReminderNotifications';

const NotificationManager = () => {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div>
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