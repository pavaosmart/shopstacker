import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import NotificationCreator from './NotificationCreator';
import NotificationList from './NotificationList';
import { useNotifications } from '../hooks/useNotifications';

const SystemUpdateNotifications = () => {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const { createNotification } = useNotifications();

  const handleCreateNotification = (notification) => {
    createNotification({
      ...notification,
      type: 'system-update',
      title: `Atualização do Sistema: ${notification.version}`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Atualizações do Sistema</h2>
        <Button onClick={() => setIsCreatorOpen(true)}>Criar Notificação</Button>
      </div>
      <NotificationList type="system-update" />
      <NotificationCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSubmit={handleCreateNotification}
        type="system-update"
      />
    </div>
  );
};

export default SystemUpdateNotifications;