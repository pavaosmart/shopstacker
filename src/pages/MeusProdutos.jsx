import React, { useState } from 'react';
import { useUserProducts, useDeleteUserProduct } from '../hooks/useUserProducts';
import ProductCard from '../components/ProductCard';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const MeusProdutos = () => {
  const { data: userProducts, isLoading, error } = useUserProducts();
  const deleteUserProductMutation = useDeleteUserProduct();
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserProductMutation.mutateAsync(productToDelete.id);
      toast.success('Produto excluído com sucesso!');
      setProductToDelete(null);
    } catch (error) {
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Produtos</h1>
      {userProducts && userProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onDelete={() => handleDeleteClick(product)}
              onViewDetails={() => handleViewDetails(product.id)}
            />
          ))}
        </div>
      ) : (
        <p>Você ainda não adicionou nenhum produto.</p>
      )}
      <ConfirmDeleteDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name}
      />
    </div>
  );
};

export default MeusProdutos;