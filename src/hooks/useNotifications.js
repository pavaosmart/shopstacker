import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const createNotification = useMutation({
    mutationFn: async (newNotification) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert([newNotification])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const updateNotification = useMutation({
    mutationFn: async (updatedNotification) => {
      const { data, error } = await supabase
        .from('notifications')
        .update(updatedNotification)
        .eq('id', updatedNotification.id)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const deleteNotification = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const cloneNotification = useMutation({
    mutationFn: async (notification) => {
      const { id, created_at, updated_at, ...clonedNotification } = notification;
      clonedNotification.title = `Cópia de ${clonedNotification.title}`;
      const { data, error } = await supabase
        .from('notifications')
        .insert([clonedNotification])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const scheduleNotification = useMutation({
    mutationFn: async ({ notificationId, sendDate }) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ sendDate, status: 'scheduled' })
        .eq('id', notificationId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  return {
    notifications,
    createNotification: createNotification.mutate,
    updateNotification: updateNotification.mutate,
    deleteNotification: deleteNotification.mutate,
    cloneNotification: cloneNotification.mutate,
    scheduleNotification: scheduleNotification.mutate,
  };
};