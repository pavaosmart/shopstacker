import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useImportUserProduct } from '../hooks/useUserProducts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const Market = () => {
  const { data: products, isLoading, error } = useProducts();
  const importUserProductMutation = useImportUserProduct();
  const navigate = useNavigate();

  const handleImport = async (product) => {
    try {
      await importUserProductMutation.mutateAsync({
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        suggested_price: product.suggested_price,
        cover_image: product.cover_image,
        variations: product.variations
      });
      toast.success(`Produto ${product.name} importado com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao importar produto: ${error.message}`);
    }
  };

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mercado</h1>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="w-full h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl truncate">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <img 
                  src={product.cover_image || '/placeholder.svg'}
                  alt={product.name} 
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <div className="space-y-2">
                  <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
                  <p className="text-sm text-gray-600">Preço Sugerido: R$ {product.suggested_price?.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleImport(product)}>Importar</Button>
                <Button onClick={() => navigate(`/product/${product.id}`)}>Detalhes</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
};

export default Market;