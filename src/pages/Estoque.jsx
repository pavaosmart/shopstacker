import React, { useState } from 'react';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ProductForm from '../components/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Estoque = () => {
  const { data: products, isLoading, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id) => {
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
      
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        Adicionar Novo Produto
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
          </DialogHeader>
          <ProductForm onSuccess={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 && (
                <img 
                  src={product.images[product.cover_image_index || 0]} 
                  alt={product.name} 
                  className="w-full h-48 object-cover mb-4"
                />
              )}
              <p>{product.description}</p>
              <p>Preço: R$ {product.price.toFixed(2)}</p>
              <p>Estoque: {product.stock_quantity}</p>
              <p>SKU: {product.sku}</p>
              <p>Preço Sugerido: R$ {product.suggested_price?.toFixed(2)}</p>
              <Button onClick={() => handleDelete(product.id)} variant="destructive" className="mt-2">Excluir</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Estoque;