import React from 'react';
import NotificationList from './NotificationList';

const ReminderNotifications = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lembretes</h2>
      <NotificationList type="reminder" />
    </div>
  );
};

export default ReminderNotifications;