import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const NotificationCreator = ({ isOpen, onClose, onSubmit, type }) => {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    scheduledDate: '',
    scheduledTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...notification, type });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Notificação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={notification.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" name="message" value={notification.message} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="scheduledDate">Data</Label>
              <Input type="date" id="scheduledDate" name="scheduledDate" value={notification.scheduledDate} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="scheduledTime">Hora</Label>
              <Input type="time" id="scheduledTime" name="scheduledTime" value={notification.scheduledTime} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Enviar Agora</Button>
            <Button type="submit" onClick={() => setNotification(prev => ({ ...prev, scheduled: true }))}>Agendar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCreator;