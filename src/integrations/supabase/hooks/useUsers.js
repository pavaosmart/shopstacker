import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### users

| name           | type                     | format   | required |
|----------------|--------------------------|----------|----------|
| id             | integer                  | int8     | true     |
| full_name      | text                     | string   | true     |
| email          | text                     | string   | true     |
| password_hash  | text                     | string   | true     |
| phone_number   | text                     | string   | false    |
| country_code   | character                | char(2)  | false    |
| created_at     | timestamp with time zone | string   | false    |
| last_login     | timestamp with time zone | string   | false    |
| account_status | text                     | string   | false    |
| role           | text                     | string   | false    |

*/

export const useUser = (id) => useQuery({
  queryKey: ['users', id],
  queryFn: () => fromSupabase(supabase.from('users').select('*').eq('id', id).single()),
});

export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: () => fromSupabase(supabase.from('users').select('*')),
});

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUser) => fromSupabase(supabase.from('users').insert([newUser])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('users').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('users').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};