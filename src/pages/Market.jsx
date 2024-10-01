import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import ProductCard from '../components/ProductCard';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Market = () => {
  const queryClient = useQueryClient();
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['market-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addToMyProducts = useMutation({
    mutationFn: async (product) => {
      const { data, error } = await supabase
        .from('user_products')
        .insert([{ ...product, original_product_id: product.id }])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['meus-produtos']);
      toast.success('Produto adicionado à sua lista com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
    },
  });

  if (isLoading) return <div>Carregando produtos do mercado...</div>;
  if (error) return <div>Erro ao carregar produtos do mercado: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mercado</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products && products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />
            <Button
              onClick={() => addToMyProducts.mutate(product)}
              className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white"
            >
              Adicionar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;