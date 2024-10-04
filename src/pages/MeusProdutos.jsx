import React, { useState } from 'react';
import { useUserProducts, useHideUserProduct, useDeleteUserProduct } from '../hooks/useUserProducts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProductDetails from '../components/ProductDetails';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';

const MeusProdutos = () => {
  const { data: userProducts, isLoading, error } = useUserProducts();
  const hideUserProductMutation = useHideUserProduct();
  const deleteUserProductMutation = useDeleteUserProduct();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleHide = async (sku) => {
    try {
      await hideUserProductMutation.mutateAsync(sku);
      toast.success('Produto ocultado com sucesso!');
    } catch (error) {
      toast.error(`Erro ao ocultar produto: ${error.message}`);
    }
  };

  const handleDelete = async (sku) => {
    try {
      await deleteUserProductMutation.mutateAsync(sku);
      toast.success('Produto excluído com sucesso!');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    }
  };

  const handleManage = (product) => {
    setSelectedProduct(product);
    setDetailsModalOpen(true);
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Produtos</h1>
      {userProducts && userProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userProducts.map((product) => (
            <Card key={product.sku} className="w-full h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl truncate">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <img 
                  src={product.images[product.cover_image_index] || '/placeholder.svg'}
                  alt={product.name} 
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <div className="space-y-2">
                  <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Estoque: {product.stock_quantity}</p>
                  <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleManage(product)}>Gerenciar</Button>
                <Button onClick={() => handleHide(product.sku)} variant="secondary">Ocultar</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>Você ainda não importou nenhum produto.</p>
      )}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => handleDelete(productToDelete.sku)}
        productName={productToDelete?.name}
      />
      {detailsModalOpen && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default MeusProdutos;