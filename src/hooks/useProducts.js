import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const useProduct = (sku) => useQuery({
  queryKey: ['products', sku],
  queryFn: async () => {
    if (!sku) {
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('user_products')
        .select('*')
        .eq('sku', sku)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  enabled: !!sku,
});

export const useProducts = () => useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('user_products')
      .select('sku, name, description, price, cost_price, stock_quantity, suggested_price, images, cover_image_index')
      .eq('user_id', user.id);

    if (error) throw error;

    return data.map(product => ({
      ...product,
      images: product.images || [],
    }));
  },
});

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { images, ...productData } = newProduct;

      const uploadedImages = await Promise.all(images.map(async (image, index) => {
        const fileName = `${user.id}/${newProduct.sku}_${index}.jpg`;
        const { data, error } = await supabase.storage
          .from('products')
          .upload(fileName, image, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (error) {
          console.error('Error uploading image:', error);
          throw error;
        }

        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
      }));

      const { data, error } = await supabase
        .from('user_products')
        .insert([{ ...productData, user_id: user.id, images: uploadedImages }]);

      if (error) {
        console.error('Error inserting product:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sku) => fromSupabase(supabase.from('user_products').delete().eq('sku', sku)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sku, ...updateData }) => fromSupabase(supabase.from('user_products').update(updateData).eq('sku', sku)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};