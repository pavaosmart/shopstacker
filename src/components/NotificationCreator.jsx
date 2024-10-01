import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const NotificationCreator = ({ isOpen, onClose, onSubmit, type }) => {
  const [notification, setNotification] = useState({
    version: '',
    message: '',
    scheduledDate: '',
    scheduledTime: '',
  });
  const [showSchedule, setShowSchedule] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (isScheduled) => {
    onSubmit({ ...notification, type, scheduled: isScheduled });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Notificação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor={type === 'system-update' ? 'version' : 'title'}>
              {type === 'system-update' ? 'Versão' : 'Título'}
            </Label>
            <Input
              id={type === 'system-update' ? 'version' : 'title'}
              name={type === 'system-update' ? 'version' : 'title'}
              value={type === 'system-update' ? notification.version : notification.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" name="message" value={notification.message} onChange={handleChange} required />
          </div>
          {showSchedule && (
            <>
              <div>
                <Label htmlFor="scheduledDate">Data</Label>
                <Input type="date" id="scheduledDate" name="scheduledDate" value={notification.scheduledDate} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="scheduledTime">Hora</Label>
                <Input type="time" id="scheduledTime" name="scheduledTime" value={notification.scheduledTime} onChange={handleChange} />
              </div>
            </>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={() => handleSubmit(false)}>Enviar Agora</Button>
          {!showSchedule ? (
            <Button type="button" onClick={() => setShowSchedule(true)}>Agendar</Button>
          ) : (
            <Button type="button" onClick={() => handleSubmit(true)}>Confirmar Agendamento</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCreator;