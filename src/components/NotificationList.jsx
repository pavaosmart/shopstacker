import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

const NotificationList = ({ type }) => {
  const { notifications, deleteNotification } = useNotifications();

  const filteredNotifications = notifications.filter(notification => notification.type === type);

  return (
    <div className="space-y-4">
      {filteredNotifications.map((notification) => (
        <Card key={notification.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atualização do Sistema: {notification.version}
            </CardTitle>
            <div>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => deleteNotification(notification.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p>{notification.message}</p>
            {notification.updateItems && notification.updateItems.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold">Itens da Atualização:</h4>
                <ul className="list-disc pl-5">
                  {notification.updateItems.map((item, index) => (
                    <li key={index}>
                      <span className="font-medium">{item.title}:</span> {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">Status: {notification.status}</p>
            <p className="text-sm text-gray-500">Criado em: {new Date(notification.created_at).toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;