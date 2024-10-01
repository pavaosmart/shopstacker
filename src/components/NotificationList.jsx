import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotificationList = ({ type }) => {
  const { notifications, deleteNotification } = useNotifications();

  const filteredNotifications = notifications.filter(notification => notification.type === type);

  return (
    <div className="space-y-4">
      {filteredNotifications.map((notification) => (
        <Card key={notification.id}>
          <CardHeader>
            <CardTitle>{notification.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{notification.content}</p>
            <p className="text-sm text-gray-500">Status: {notification.status}</p>
            <p className="text-sm text-gray-500">Criado em: {new Date(notification.created_at).toLocaleString()}</p>
            <Button onClick={() => deleteNotification(notification.id)} className="mt-2">Excluir</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;