import { useState, useEffect } from 'react';

// Dados mockados para simular notificações
const mockNotifications = [
  { id: 1, title: 'Bem-vindo', content: 'Bem-vindo ao nosso sistema!', type: 'message', status: 'pending', created_at: new Date().toISOString() },
  { id: 2, title: 'Atualização', content: 'Nova atualização disponível', type: 'system-update', status: 'pending', created_at: new Date(Date.now() - 86400000).toISOString() },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const fetchNotifications = async () => {
    // Simula uma chamada assíncrona
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNotifications);
      }, 500);
    });
  };

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  const createNotification = (newNotification) => {
    const notification = {
      ...newNotification,
      id: Date.now(),
      created_at: new Date().toISOString(),
      status: 'pending',
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