import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Dashboard = () => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock_quantity: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const { data: products, isLoading, refetch } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  useEffect(() => {
    const checkAuth = async () => {
      // Implement your authentication check here
      // If not authenticated, redirect to login
      // navigate('/login');
    };
    checkAuth();
  }, [navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
      });
      toast.success('Produto adicionado com sucesso');
      setNewProduct({ name: '', price: '', stock_quantity: '' });
      refetch();
    } catch (error) {
      toast.error('Erro ao adicionar produto: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !editingProduct.id) {
      toast.error('Erro: Produto inválido para edição');
      return;
    }
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        stock_quantity: parseInt(editingProduct.stock_quantity)
      });
      toast.success('Produto atualizado com sucesso');
      setEditingProduct(null);
      refetch();
    } catch (error) {
      toast.error('Erro ao atualizar produto: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success('Produto excluído com sucesso');
      refetch();
    } catch (error) {
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <Button onClick={() => navigate('/login')} className="mb-4">Sair</Button>

      <form onSubmit={handleAddProduct} className="mb-8">
        <h2 className="mb-2 text-xl font-bold">Adicionar Novo Produto</h2>
        <Input
          placeholder="Nome do Produto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="mb-2"
          required
        />
        <Input
          type="number"
          placeholder="Preço"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="mb-2"
          required
        />
        <Input
          type="number"
          placeholder="Quantidade em Estoque"
          value={newProduct.stock_quantity}
          onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
          className="mb-2"
          required
        />
        <Button type="submit">Adicionar Produto</Button>
      </form>

      <h2 className="mb-2 text-xl font-bold">Lista de Produtos</h2>
      {products && products.map((product) => (
        <div key={product.id} className="mb-4 p-4 border rounded">
          {editingProduct && editingProduct.id === product.id ? (
            <div>
              <Input
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="mb-2"
              />
              <Input
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                className="mb-2"
              />
              <Input
                type="number"
                value={editingProduct.stock_quantity}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value })}
                className="mb-2"
              />
              <Button onClick={handleUpdateProduct} className="mr-2">Salvar</Button>
              <Button onClick={() => setEditingProduct(null)}>Cancelar</Button>
            </div>
          ) : (
            <div>
              <p>{product.name} - R$ {product.price} - Estoque: {product.stock_quantity}</p>
              <Button onClick={() => handleEditProduct(product)} className="mr-2 mt-2">Editar</Button>
              <Button onClick={() => handleDeleteProduct(product.id)} className="mt-2">Excluir</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;