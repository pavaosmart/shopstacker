import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from "sonner";

const handleSupabaseError = (error) => {
  if (error.code === '42501') {
    throw new Error('You do not have permission to perform this action. Please contact an administrator.');
  }
  throw error;
};

const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) handleSupabaseError(error);
  return data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.from('products').insert([{
        ...newProduct,
        user_id: user.id
      }]).select();
      if (error) handleSupabaseError(error);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Ensure price is a valid number
      const updatedProduct = {
        ...product,
        price: parseFloat(product.price) || 0, // Convert to number or use 0 if invalid
      };
      
      const { data, error } = await supabase.from('products')
        .update(updatedProduct)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
      if (error) handleSupabaseError(error);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase.from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) handleSupabaseError(error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const checkProductPermissions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data, error } = await supabase.from('products').select('id').limit(1);
  if (error) {
    if (error.code === '42501') {
      return false;
    }
    throw error;
  }
  return true;
};