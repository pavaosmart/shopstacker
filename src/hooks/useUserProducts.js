import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_imported', true);
    
    if (error) throw error;
    return data;
  },
});

export const useUnimportUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productSku) => {
      const { error } = await supabase
        .from('user_products')
        .update({ is_imported: false })
        .eq('sku', productSku);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

export const useHideUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productSku) => {
      const { error } = await supabase
        .from('user_products')
        .update({ is_hidden: true })
        .eq('sku', productSku);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

export const useDeleteUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productSku) => {
      const { error } = await supabase
        .from('user_products')
        .delete()
        .eq('sku', productSku);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

export const useUpdateUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sku, ...updateData }) => {
      const { error } = await supabase
        .from('user_products')
        .update(updateData)
        .eq('sku', sku);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

export const useImportUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('user_products')
        .upsert([
          { 
            ...productData, 
            user_id: user.id, 
            is_imported: true 
          }
        ], 
        { 
          onConflict: 'sku',
          update: { 
            name: productData.name,
            description: productData.description,
            price: productData.price,
            stock_quantity: productData.stock_quantity,
            suggested_price: productData.suggested_price,
            images: productData.images,
            cover_image_index: productData.cover_image_index,
            cost_price: productData.cost_price,
            is_imported: true
          }
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};
