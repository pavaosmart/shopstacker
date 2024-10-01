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

  const createReminder = useMutation({
    mutationFn: async (reminderData) => {
      const newReminder = {
        ...reminderData,
        type: 'reminder',
      };
      const { data, error } = await supabase
        .from('notifications')
        .insert([newReminder])
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
    createReminder: createReminder.mutate,
  };
};