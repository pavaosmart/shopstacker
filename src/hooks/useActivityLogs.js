import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const ITEMS_PER_PAGE = 10;

export const useActivityLogs = ({ page, actionFilter, userFilter }) => {
  return useQuery({
    queryKey: ['activityLogs', page, actionFilter, userFilter],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }

      if (userFilter) {
        query = query.eq('user_id', userFilter);
      }

      const { data: logs, error: logsError, count } = await query;

      if (logsError) throw new Error(logsError.message);

      // Fetch user emails for each log entry
      const userIds = [...new Set(logs.map(log => log.user_id))];
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds);

      if (usersError) throw new Error(usersError.message);

      const userMap = Object.fromEntries(users.map(user => [user.id, user.email]));

      const logsWithUserEmails = logs.map(log => ({
        ...log,
        user_email: userMap[log.user_id] || 'Unknown'
      }));

      return { data: logsWithUserEmails, count };
    },
  });
};