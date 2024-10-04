import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const defaultProducts = [
  { id: 1, name: 'BKLGO Full Zip Hoodie', category: 'Clothing', price: 1321, sku: '243598234', stock_quantity: 0 },
  { id: 2, name: 'MacBook Pro', category: 'Electronics', price: 1869, sku: '877712', stock_quantity: 0 },
  { id: 3, name: 'Metro Bar Stool', category: 'Furniture', price: 99, sku: '0134729', stock_quantity: 978 },
  { id: 4, name: 'Alchimia Chair', category: 'Furniture', price: 2999, sku: '113213', stock_quantity: 0 },
  { id: 5, name: 'Fendi Gradient Coat', category: 'Clothing', price: 869, sku: '634729', stock_quantity: 725 },
];

export const useProducts = () => useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .filter('name', 'not.is', null);
      
      if (error) throw new Error(error.message);
      
      // Se não houver produtos no banco de dados ou todos os produtos tiverem nomes nulos, retorne os produtos padrão
      return data.length > 0 ? data : defaultProducts;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Retorne os produtos padrão se houver um erro
      return defaultProducts;
    }
  },
});

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (error) throw new Error(error.message);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select();
      if (error) throw new Error(error.message);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};