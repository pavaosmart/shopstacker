import React, { useState } from 'react';
import { useUserProducts, useDeleteUserProduct } from '../hooks/useUserProducts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import ExportToStoresModal from '../components/ExportToStoresModal';

const MeusProdutos = () => {
  const { data: userProducts, isLoading, error } = useUserProducts();
  const deleteUserProductMutation = useDeleteUserProduct();
  const navigate = useNavigate();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteUserProductMutation.mutateAsync(id);
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    }
  };

  const handleExport = (product) => {
    setSelectedProduct(product);
    setExportModalOpen(true);
  };

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Produtos</h1>
      {userProducts && userProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userProducts.map((product) => (
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
                <div className="flex mb-4">
                  {product.additional_images?.slice(0, 3).map((img, index) => (
                    <img 
                      key={index}
                      src={img}
                      alt={`${product.name} - ${index + 2}`}
                      className="w-1/3 h-16 object-cover mr-2 rounded-md"
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
                  <p className="text-sm text-gray-600">Preço Sugerido: R$ {product.suggested_price?.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleExport(product)}>Enviar para Marketplace</Button>
                <Button onClick={() => navigate(`/product/${product.id}`)}>Detalhes</Button>
                <Button onClick={() => handleDelete(product.id)} variant="destructive">Excluir</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>Você ainda não adicionou nenhum produto.</p>
      )}
      <ExportToStoresModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default MeusProdutos;