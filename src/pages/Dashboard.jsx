import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/supabase';
import { logActivity } from '../utils/logActivity';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock_quantity: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const addedProduct = await addProductMutation.mutateAsync({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
      });
      setNewProduct({ name: '', price: '', stock_quantity: '' });
      await logActivity('CREATE_PRODUCT', `Produto "${addedProduct.name}" criado`);
      toast.success('Produto adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast.error('Erro ao adicionar produto');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !editingProduct.id) {
      toast.error('Produto inválido para edição');
      return;
    }
    try {
      const updatedProduct = await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        stock_quantity: parseInt(editingProduct.stock_quantity)
      });
      setEditingProduct(null);
      await logActivity('UPDATE_PRODUCT', `Produto "${updatedProduct.name}" atualizado`);
      toast.success('Produto atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const deletedProduct = await deleteProductMutation.mutateAsync(id);
      await logActivity('DELETE_PRODUCT', `Produto "${deletedProduct.name}" excluído`);
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await logActivity('LOGOUT', 'Usuário fez logout');
      navigate('/login');
    } catch (error) {
      console.error('Erro durante o logout:', error);
      toast.error('Ocorreu um erro durante o logout');
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div>
      <Navigation />
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleLogout} className="mb-4">Logout</Button>

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
                <p>{product.name} - R${product.price} - Estoque: {product.stock_quantity}</p>
                <Button onClick={() => handleEditProduct(product)} className="mr-2 mt-2">Editar</Button>
                <Button onClick={() => handleDeleteProduct(product.id)} className="mt-2">Excluir</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;