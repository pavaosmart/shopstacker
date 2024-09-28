import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const ITEMS_PER_PAGE = 10;

export const useActivityLogs = ({ page, actionFilter, userFilter }) => {
  return useQuery({
    queryKey: ['activityLogs', page, actionFilter, userFilter],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select('*, users(email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }

      if (userFilter) {
        query = query.eq('user_id', userFilter);
      }

      const { data: logs, error, count } = await query;

      if (error) throw new Error(error.message);

      const logsWithUserEmails = logs.map(log => ({
        ...log,
        user_email: log.users?.email || 'Desconhecido',
      }));

      return {
        data: logsWithUserEmails,
        count,
      };
    },
  });
};