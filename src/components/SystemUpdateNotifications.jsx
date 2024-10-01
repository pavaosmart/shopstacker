import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import NotificationCreator from './NotificationCreator';
import NotificationList from './NotificationList';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import useNotifications from '../hooks/useNotifications';

const SystemUpdateNotifications = () => {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [deletingNotificationId, setDeletingNotificationId] = useState(null);
  const { createNotification, updateNotification, deleteNotification } = useNotifications();

  const handleCreateOrUpdateNotification = (notification) => {
    if (editingNotification) {
      updateNotification({ ...notification, id: editingNotification.id });
    } else {
      createNotification({
        ...notification,
        type: 'system-update',
        title: `Atualização do Sistema ${notification.version}`
      });
    }
    setEditingNotification(null);
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setIsCreatorOpen(true);
  };

  const handleDelete = (id) => {
    setDeletingNotificationId(id);
  };

  const confirmDelete = () => {
    if (deletingNotificationId) {
      deleteNotification(deletingNotificationId);
      setDeletingNotificationId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Atualizações do Sistema</h2>
        <Button onClick={() => setIsCreatorOpen(true)}>Criar Notificação</Button>
      </div>
      <NotificationList 
        type="system-update" 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <NotificationCreator
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false);
          setEditingNotification(null);
        }}
        onSubmit={handleCreateOrUpdateNotification}
        editingNotification={editingNotification}
      />
      <ConfirmDeleteDialog
        isOpen={!!deletingNotificationId}
        onClose={() => setDeletingNotificationId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SystemUpdateNotifications;