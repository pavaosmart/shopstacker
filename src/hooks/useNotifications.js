import { useState, useEffect } from 'react';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simula uma chamada assíncrona para carregar notificações
    const fetchNotifications = async () => {
      // Aqui você faria uma chamada real à API
      const mockNotifications = [
        { id: 1, type: 'message', title: 'Nova mensagem', content: 'Você recebeu uma nova mensagem.' },
        { id: 2, type: 'system-update', title: 'Atualização do sistema', content: 'Uma nova versão do sistema está disponível.' },
        { id: 3, type: 'reminder', title: 'Lembrete', content: 'Reunião às 14h.' },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return {
    notifications,
    deleteNotification,
  };
};

export default useNotifications;