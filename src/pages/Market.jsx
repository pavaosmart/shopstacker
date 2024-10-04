import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useImportUserProduct, useUserProducts } from '../hooks/useUserProducts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const Market = () => {
  const { data: products, isLoading, error } = useProducts();
  const { data: userProducts } = useUserProducts();
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
        images: product.images,
        cover_image_index: product.cover_image_index,
        sku: product.sku,
        cost_price: product.cost_price
      });
      toast.success(`Produto ${product.name} importado com sucesso!`);
      navigate('/meus-produtos');
    } catch (error) {
      toast.error(`Erro ao importar produto: ${error.message}`);
    }
  };

  const isProductImported = (sku) => {
    return userProducts?.some(userProduct => userProduct.sku === sku);
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
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4 rounded-md">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[product.cover_image_index || 0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
                  <p className="text-sm text-gray-600">Preço Sugerido: R$ {product.suggested_price?.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isProductImported(product.sku) ? (
                  <Button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed">
                    Importado
                  </Button>
                ) : (
                  <Button onClick={() => handleImport(product)}>Importar</Button>
                )}
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