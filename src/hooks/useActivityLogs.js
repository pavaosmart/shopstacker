import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const ITEMS_PER_PAGE = 10;

export const useActivityLogs = ({ page = 1, actionFilter = '', userFilter = '' } = {}) => {
  return useQuery({
    queryKey: ['activityLogs', page, actionFilter, userFilter],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select('id, user_id, action, description, created_at', { count: 'exact' })
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

      return {
        data: logs,
        count,
      };
    },
  });
};