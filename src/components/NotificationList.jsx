import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const NotificationList = ({ type }) => {
  const { notifications } = useNotifications();
  const filteredNotifications = notifications.filter(notification => notification.type === type);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Mensagem</TableHead>
          <TableHead>Data Agendada</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredNotifications.map((notification) => (
          <TableRow key={notification.id}>
            <TableCell>{notification.title}</TableCell>
            <TableCell>{notification.message}</TableCell>
            <TableCell>{notification.scheduledDate} {notification.scheduledTime}</TableCell>
            <TableCell>{notification.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NotificationList;