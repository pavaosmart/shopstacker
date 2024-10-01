import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ReminderNotifications = () => {
  const { notifications } = useNotifications();
  const reminders = notifications.filter(notification => notification.type === 'reminder');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lembretes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Conteúdo</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Módulo de Origem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.map((reminder) => (
            <TableRow key={reminder.id}>
              <TableCell>{reminder.title}</TableCell>
              <TableCell>{reminder.content}</TableCell>
              <TableCell>{new Date(reminder.created_at).toLocaleString()}</TableCell>
              <TableCell>{reminder.source_module}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {reminders.length === 0 && (
        <p className="text-center mt-4">Nenhum lembrete encontrado.</p>
      )}
    </div>
  );
};

export default ReminderNotifications;
