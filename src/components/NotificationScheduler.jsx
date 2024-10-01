import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NotificationScheduler = () => {
  const [schedule, setSchedule] = useState({
    notificationId: '',
    sendDate: '',
  });
  const { scheduleNotification, notifications } = useNotifications();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleNotification(schedule);
    setSchedule({ notificationId: '', sendDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        name="notificationId"
        value={schedule.notificationId}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Selecione uma Notificação</option>
        {notifications.map(notification => (
          <option key={notification.id} value={notification.id}>
            {notification.title}
          </option>
        ))}
      </select>
      <Input
        type="datetime-local"
        name="sendDate"
        value={schedule.sendDate}
        onChange={handleChange}
        required
      />
      <Button type="submit">Agendar Notificação</Button>
    </form>
  );
};

export default NotificationScheduler;