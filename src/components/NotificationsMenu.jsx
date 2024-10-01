import React, { useState } from 'react';
import { Bell } from 'lucide-react';
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
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-3.5 h-3.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
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