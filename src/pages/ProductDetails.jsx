import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e);
    setImageLoadError(true);
    e.target.src = "/placeholder.svg"; // Replace with a default image path
  };

  if (isLoading) return <div>Carregando detalhes do produto...</div>;
  if (error) return <div>Erro ao carregar detalhes do produto: {error.message}</div>;
  if (!product) return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
      <p>O produto que você está procurando não existe ou foi removido.</p>
      <Button onClick={() => navigate('/products')} className="mt-4">Voltar para a lista de produtos</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {imageLoadError ? (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                  Imagem não disponível
                </div>
              ) : (
                <img 
                  src={product.main_image_url || "/placeholder.svg"}
                  alt={product.name} 
                  className="w-full h-64 object-cover rounded-md mb-4"
                  onError={handleImageError}
                />
              )}
              {product.images && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <img 
                      key={index}
                      src={img}
                      alt={`${product.name} - ${index + 2}`}
                      className="w-full h-20 object-cover rounded-md"
                      onError={handleImageError}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold mb-4">R$ {product.price.toFixed(2)}</p>
              <p className="mb-4">Preço Sugerido: R$ {product.suggested_price?.toFixed(2)}</p>
              <p className="mb-4">{product.description}</p>
              <p className="mb-4">Estoque: {product.stock_quantity}</p>
              <p className="mb-4">SKU: {product.sku}</p>
              <Button>Adicionar ao Carrinho</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;