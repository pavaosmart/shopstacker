import React, { useState } from 'react';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from '../hooks/useAuth';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';

const Estoque = () => {
  const { data: products, isLoading, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const isSupplier = user?.role === 'supplier';

  const handleDelete = async (id) => {
    if (!isSupplier) {
      toast.error('Apenas fornecedores podem excluir produtos.');
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Estoque</h1>
      
      <Button onClick={() => { setIsModalOpen(true); setCurrentProduct(null); }} className="mb-4">
        Adicionar Novo Produto
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{currentProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm 
                product={currentProduct} 
                onSuccess={() => {
                  setIsModalOpen(false);
                  setCurrentProduct(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onDelete={() => handleDelete(product.id)}
            onEdit={() => {
              setCurrentProduct(product);
              setIsModalOpen(true);
            }}
            isSupplier={isSupplier}
          />
        ))}
      </div>
    </div>
  );
};

export default Estoque;