import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

const NotificationList = ({ type, onEdit }) => {
  const { notifications, deleteNotification } = useNotifications();

  const filteredNotifications = notifications.filter(notification => notification.type === type);

  return (
    <div className="space-y-4">
      {filteredNotifications.map((notification) => (
        <Card key={notification.id} className="hover:bg-gray-50">
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Versão: {notification.version}</h3>
                <ul className="list-disc list-inside">
                  {notification.updateItems.map((item, index) => (
                    <li key={index}>{item.title}: {item.description}</li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(notification)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;