import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserProducts } from '../hooks/useUserProducts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ExportToStoresModal from '../components/ExportToStoresModal';

const ProductDetails = () => {
  const { id } = useParams();
  const { data: userProducts, isLoading, error } = useUserProducts();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  if (isLoading) return <div>Carregando detalhes do produto...</div>;
  if (error) return <div>Erro ao carregar detalhes do produto: {error.message}</div>;

  const product = userProducts.find(p => p.id === id);

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
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name} 
                className="w-full h-64 object-cover rounded-md"
              />
              <div className="mt-4 flex gap-2">
                {product.images.slice(1).map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`${product.name} - ${index + 2}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold mb-4">R$ {product.price.toFixed(2)}</p>
              <p className="mb-4">{product.description}</p>
              <p className="mb-4">Estoque: {product.stock_quantity}</p>
              {product.variations && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Variações:</h3>
                  <ul>
                    {product.variations.map((variation, index) => (
                      <li key={index}>{variation}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button onClick={() => setIsExportModalOpen(true)}>Exportar para as lojas</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ExportToStoresModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)}
        productId={product.id}
      />
    </div>
  );
};

export default ProductDetails;