import { useState, useEffect } from 'react';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simula uma chamada assíncrona para carregar notificações
    const fetchNotifications = async () => {
      // Aqui você faria uma chamada real à API
      const mockNotifications = [
        {
          id: 1,
          type: 'system-update',
          version: 'beta 1.0',
          updateItems: [
            { title: 'Nova funcionalidade', description: 'Adicionada a capacidade de editar notificações' },
            { title: 'Correção de bug', description: 'Resolvido problema de exibição em telas pequenas' }
          ],
          created_at: new Date().toISOString()
        }
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const createNotification = (newNotification) => {
    const notification = {
      ...newNotification,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const updateNotification = (updatedNotification) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === updatedNotification.id ? { ...notification, ...updatedNotification } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return {
    notifications,
    createNotification,
    updateNotification,
    deleteNotification,
  };
};

export default useNotifications;