import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock_quantity: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        fetchProducts();
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity');
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      toast.error('Erro ao carregar produtos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          name: newProduct.name, 
          price: parseFloat(newProduct.price),
          stock_quantity: parseInt(newProduct.stock_quantity),
          user_id: user.id
        }]);
      
      if (error) throw error;
      
      toast.success('Produto adicionado com sucesso');
      setNewProduct({ name: '', price: '', stock_quantity: '' });
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao adicionar produto: ' + error.message);
    }
  };

  const handleEditProduct = async (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          name: editingProduct.name,
          price: parseFloat(editingProduct.price),
          stock_quantity: parseInt(editingProduct.stock_quantity)
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast.success('Produto atualizado com sucesso');
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao atualizar produto: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Produto excluído com sucesso');
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <Button onClick={handleLogout} className="mb-4">Sair</Button>

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
      {products.map((product) => (
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