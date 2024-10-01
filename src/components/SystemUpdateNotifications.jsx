import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import NotificationCreator from './NotificationCreator';
import NotificationList from './NotificationList';

const SystemUpdateNotifications = () => {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const handleCreateNotification = (notification) => {
    // Aqui você implementaria a lógica para salvar a notificação
    console.log('Nova notificação de atualização do sistema:', notification);
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