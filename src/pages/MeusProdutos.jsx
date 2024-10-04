import React, { useState } from 'react';
import { useUserProducts, useDeleteUserProduct } from '../hooks/useUserProducts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';

const MeusProdutos = () => {
  const { data: userProducts, isLoading, error } = useUserProducts();
  const deleteUserProductMutation = useDeleteUserProduct();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteUserProductMutation.mutateAsync(id);
      toast.success('Produto excluído com sucesso!');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleManage = (product) => {
    navigate(`/produto/${product.id}`);
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
      <Button onClick={() => setEditModalOpen(true)} className="mb-4">Adicionar Novo Produto</Button>
      {userProducts && userProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userProducts.map((product) => (
            <Card key={product.id} className="w-full h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl truncate">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <img 
                  src={product.images[product.cover_image_index] || '/placeholder.svg'}
                  alt={product.name} 
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <div className="flex mb-4">
                  {product.images.slice(0, 3).map((img, index) => (
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
                <Button onClick={() => handleManage(product)}>Gerenciar</Button>
                <Button onClick={() => openDeleteDialog(product)} variant="destructive">Excluir</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>Você ainda não adicionou nenhum produto.</p>
      )}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct ? 'Editar' : 'Adicionar'} Produto</h2>
            <ProductForm 
              product={selectedProduct} 
              onSuccess={() => {
                setEditModalOpen(false);
                setSelectedProduct(null);
              }} 
            />
            <Button onClick={() => {
              setEditModalOpen(false);
              setSelectedProduct(null);
            }} className="mt-4">Cancelar</Button>
          </div>
        </div>
      )}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => handleDelete(productToDelete.id)}
        productName={productToDelete?.name}
      />
    </div>
  );
};

export default MeusProdutos;