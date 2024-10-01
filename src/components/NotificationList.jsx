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
      <div className="grid grid-cols-6 gap-4 font-semibold text-sm text-gray-600 mb-2">
        <div>Versão</div>
        <div className="col-span-2">Título</div>
        <div>Status</div>
        <div>Data</div>
        <div>Ações</div>
      </div>
      {filteredNotifications.map((notification) => (
        <Card key={notification.id} className="hover:bg-gray-50">
          <CardContent className="py-4">
            <div className="grid grid-cols-6 gap-4 items-center">
              <div className="text-sm font-medium">{notification.version}</div>
              <div className="col-span-2 text-sm">{notification.title}</div>
              <div className="text-sm">{notification.status}</div>
              <div className="text-sm">{new Date(notification.created_at).toLocaleDateString()}</div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => deleteNotification(notification.id)}>
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