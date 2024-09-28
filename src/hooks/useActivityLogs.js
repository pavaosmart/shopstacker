import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const ITEMS_PER_PAGE = 10;

export const useActivityLogs = ({ page, actionFilter, userFilter }) => {
  return useQuery({
    queryKey: ['activityLogs', page, actionFilter, userFilter],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }

      if (userFilter) {
        query = query.eq('user_id', userFilter);
      }

      const { data, error, count } = await query;

      if (error) throw new Error(error.message);

      // Fetch user information separately
      const userIds = [...new Set(data.map(log => log.user_id))];
      const { data: users, error: userError } = await supabase
        .from('users')  // This is typically the correct table for user information
        .select('id, email')
        .in('id', userIds);

      if (userError) throw new Error(userError.message);

      const userMap = Object.fromEntries(users.map(user => [user.id, user]));

      return {
        data: data.map(log => ({
          ...log,
          user_email: userMap[log.user_id]?.email || 'Unknown'
        })),
        count
      };
    },
  });
};