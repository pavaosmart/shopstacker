import React from 'react';
import NotificationManager from '../components/NotificationManager';

const Notifications = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notificações</h1>
      <NotificationManager />
    </div>
  );
};

export default Notifications;