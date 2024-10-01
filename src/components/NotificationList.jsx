import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, Copy } from 'lucide-react';
import NotificationDetails from './NotificationDetails';

const NotificationList = () => {
  const { notifications, deleteNotification, cloneNotification } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta notificação?')) {
      deleteNotification(id);
    }
  };

  const handleClone = (notification) => {
    cloneNotification(notification);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Envio</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.id} onClick={() => setSelectedNotification(notification)}>
              <TableCell>{notification.title}</TableCell>
              <TableCell>{notification.type}</TableCell>
              <TableCell>{notification.status}</TableCell>
              <TableCell>{new Date(notification.sendDate).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => setSelectedNotification(notification)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleClone(notification)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(notification.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedNotification && (
        <NotificationDetails
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

export default NotificationList;