import React, { useState } from 'react';
import { BellIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nova mensagem recebida' },
    { id: 2, message: 'Atualização do sistema disponível' },
    { id: 3, message: 'Lembrete: reunião em 30 minutos' },
  ]);

  const clearNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <DropdownMenuItem key={notif.id} onSelect={() => clearNotification(notif.id)}>
              {notif.message}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>Nenhuma notificação</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;