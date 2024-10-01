import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MessageNotifications from './MessageNotifications';
import SystemUpdateNotifications from './SystemUpdateNotifications';
import ReminderNotifications from './ReminderNotifications';
import NotificationCreator from './NotificationCreator';

const NotificationManager = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const handleCreateNotification = (newNotification) => {
    // Here you would typically add the new notification to your state or send it to an API
    console.log('New notification created:', newNotification);
    setIsCreatorOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button onClick={() => setIsCreatorOpen(true)}>Create Notification</Button>
      </div>
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
      <NotificationCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSubmit={handleCreateNotification}
      />
    </div>
  );
};

export default NotificationManager;