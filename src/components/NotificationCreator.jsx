import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const NotificationCreator = () => {
  const [notification, setNotification] = useState({
    title: '',
    content: '',
    type: 'message',
  });
  const { createNotification } = useNotifications();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value) => {
    setNotification(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNotification(notification);
    setNotification({ title: '', content: '', type: 'message' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        value={notification.title}
        onChange={handleChange}
        placeholder="Título da Notificação"
        required
      />
      <Textarea
        name="content"
        value={notification.content}
        onChange={handleChange}
        placeholder="Conteúdo da Notificação"
        required
      />
      <Select value={notification.type} onValueChange={handleTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Tipo de Notificação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="message">Mensagem</SelectItem>
          <SelectItem value="update">Atualização do Sistema</SelectItem>
          <SelectItem value="reminder">Lembrete</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Criar Notificação</Button>
    </form>
  );
};

export default NotificationCreator;