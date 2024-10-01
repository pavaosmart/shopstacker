import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const NotificationDetails = ({ notification, onClose }) => {
  return (
    <Dialog open={!!notification} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{notification.title}</DialogTitle>
          <DialogDescription>
            Tipo: {notification.type}<br />
            Status: {notification.status}<br />
            Data de Envio: {new Date(notification.sendDate).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p>{notification.content}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDetails;