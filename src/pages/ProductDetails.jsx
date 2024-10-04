import React from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) return <div>Carregando detalhes do produto...</div>;
  if (error) return <div>Erro ao carregar detalhes do produto: {error.message}</div>;
  if (!product) return <div>Produto não encontrado</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={product.cover_image || "/placeholder.svg"}
                alt={product.name} 
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <div className="grid grid-cols-4 gap-2">
                {product.additional_images?.map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`${product.name} - ${index + 2}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold mb-4">R$ {product.price.toFixed(2)}</p>
              <p className="mb-4">Preço Sugerido: R$ {product.suggested_price?.toFixed(2)}</p>
              <p className="mb-4">{product.description}</p>
              <p className="mb-4">Estoque: {product.stock_quantity}</p>
              {product.variations && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Variações:</h3>
                  <ul>
                    {Object.entries(product.variations).map(([key, value]) => (
                      <li key={key}>{key}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button>Adicionar ao Carrinho</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;