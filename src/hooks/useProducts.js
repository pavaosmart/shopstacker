import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, stock_quantity, photos, cover_photo_index');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const photos = [];
      const coverPhotoIndex = formData.get('cover_photo_index');
      
      // Upload photos
      for (let i = 0; i < 9; i++) {
        const photo = formData.get(`photo_${i}`);
        if (photo) {
          const { data, error } = await supabase.storage
            .from('product-photos')
            .upload(`${Date.now()}_${photo.name}`, photo);
          
          if (error) throw new Error(error.message);
          
          photos.push(data.path);
        }
      }
      
      // Create product
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: formData.get('name'),
          description: formData.get('description'),
          price: parseFloat(formData.get('price')),
          stock_quantity: parseInt(formData.get('stock_quantity')),
          photos: photos,
          cover_photo_index: parseInt(coverPhotoIndex)
        }])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
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
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
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
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};