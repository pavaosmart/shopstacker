import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import NotificationCreator from './NotificationCreator';
import NotificationList from './NotificationList';
import { useNotifications } from '../hooks/useNotifications';

const MessageNotifications = () => {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const { createNotification } = useNotifications();

  const handleCreateNotification = (notification) => {
    createNotification({ ...notification, type: 'message' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notificações de Mensagens</h2>
        <Button onClick={() => setIsCreatorOpen(true)}>Criar Notificação</Button>
      </div>
      <NotificationList type="message" />
      <NotificationCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSubmit={handleCreateNotification}
        type="message"
      />
    </div>
  );
};

export default MessageNotifications;