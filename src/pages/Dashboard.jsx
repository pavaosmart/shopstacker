import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock_quantity: '' });
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
        .select('name, price, stock_quantity');
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
      {products.map((product, index) => (
        <div key={index} className="mb-2 p-2 border rounded">
          <p>{product.name} - R$ {product.price} - Estoque: {product.stock_quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;