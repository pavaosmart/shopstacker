import React from 'react';
import NotificationList from './NotificationList';

const SystemUpdateNotifications = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Atualizações do Sistema</h2>
      <NotificationList type="system-update" />
    </div>
  );
};

export default SystemUpdateNotifications;