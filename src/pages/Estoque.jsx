import React, { useState } from 'react';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ProductForm from '../components/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Edit, Eye } from 'lucide-react'; // Add this import

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

      <div className="space-y-4">
        {products?.map((product) => (
          <Card key={product.sku} className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={product.images[product.cover_image_index || 0] || '/placeholder.svg'} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow grid grid-cols-6 gap-4 items-center">
                  <div className="font-semibold col-span-2">{product.name}</div>
                  <div>SKU: {product.sku}</div>
                  <div>R$ {product.price.toFixed(2)}</div>
                  <div>Estoque: {product.stock_quantity}</div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => {/* Implement view details logic */}}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4 text-gray-700" />
                    </Button>
                    <Button
                      onClick={() => {/* Implement edit logic */}}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4 text-gray-700" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.sku)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-gray-700" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Estoque;