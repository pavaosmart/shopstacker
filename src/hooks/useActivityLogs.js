import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const ITEMS_PER_PAGE = 10;

export const useActivityLogs = ({ page, actionFilter, userFilter }) => {
  return useQuery({
    queryKey: ['activityLogs', page, actionFilter, userFilter],
    queryFn: async () => {
      // Fetch activity logs
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }

      const { data: logs, error: logsError, count } = await query;
      if (logsError) throw new Error(logsError.message);

      // Fetch user emails separately
      const userIds = [...new Set(logs.map(log => log.user_id))];
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds);

      if (usersError) throw new Error(usersError.message);

      // Create a map of user_id to email
      const userEmailMap = Object.fromEntries(users.map(user => [user.id, user.email]));

      // Combine log data with user emails
      const logsWithUserEmails = logs.map(log => ({
        ...log,
        user_email: userEmailMap[log.user_id] || 'Unknown',
      }));

      // Apply user filter after fetching data
      const filteredLogs = userFilter
        ? logsWithUserEmails.filter(log => log.user_email.toLowerCase().includes(userFilter.toLowerCase()))
        : logsWithUserEmails;

      return {
        data: filteredLogs,
        count: filteredLogs.length, // Update count based on filtered results
      };
    },
  });
};