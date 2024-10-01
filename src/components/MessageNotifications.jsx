import React from 'react';
import NotificationList from './NotificationList';

const MessageNotifications = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Notificações de Mensagens</h2>
      <NotificationList type="message" />
    </div>
  );
};

export default MessageNotifications;