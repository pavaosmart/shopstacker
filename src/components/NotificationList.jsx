import React from 'react';
import useNotifications from '../hooks/useNotifications';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

const NotificationList = ({ type }) => {
  const { notifications, deleteNotification } = useNotifications();

  const filteredNotifications = notifications.filter(notification => notification.type === type);

  return (
    <div className="space-y-4">
      {filteredNotifications.map((notification) => (
        <Card key={notification.id} className="hover:bg-gray-50">
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{notification.title}</h3>
                <p>{notification.content}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
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