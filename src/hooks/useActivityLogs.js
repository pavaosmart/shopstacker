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

      const { data: logs, error: logsError, count } = await query;

      if (logsError) throw new Error(logsError.message);

      // Fetch user information separately using Supabase auth API
      if (logs && logs.length > 0) {
        const userIds = [...new Set(logs.map(log => log.user_id))];
        
        const { data: users, error: userError } = await supabase.auth.admin.listUsers({
          perPage: userIds.length,
          page: 1,
        });

        if (userError) throw new Error(userError.message);

        const userMap = Object.fromEntries(users.map(user => [user.id, user]));

        return {
          data: logs.map(log => ({
            ...log,
            user_email: userMap[log.user_id]?.email || 'Unknown'
          })),
          count
        };
      }

      return { data: [], count: 0 };
    },
  });
};