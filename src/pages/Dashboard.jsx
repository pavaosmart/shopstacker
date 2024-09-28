import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from '../hooks/useProducts';
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock_quantity: 0,
    sku: '',
    category: '',
    marketplace: '',
    marketplace_product_id: '',
    marketplace_status: '',
  });

  const { data: products, isLoading, isError, error } = useProducts();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct]);
      if (error) throw error;
      toast.success('Produto adicionado com sucesso');
      setNewProduct({
        name: '',
        price: 0,
        stock_quantity: 0,
        sku: '',
        category: '',
        marketplace: '',
        marketplace_product_id: '',
        marketplace_status: '',
      });
    } catch (error) {
      toast.error('Falha ao adicionar produto: ' + error.message);
    }
  };

  if (isLoading) return <div>Carregando produtos...</div>;
  if (isError) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard MyShopTools</h1>
      {session && <p className="mb-4">Logado como: {session.user.email}</p>}
      <Button onClick={handleLogout} className="mb-4">Sair</Button>
      <Link to="/activity-logs" className="ml-4">
        <Button>Logs de Atividade</Button>
      </Link>

      <form onSubmit={handleAddProduct} className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Adicionar Novo Produto</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Nome do Produto"
            required
          />
          <Input
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Preço"
            required
          />
          <Input
            name="stock_quantity"
            type="number"
            value={newProduct.stock_quantity}
            onChange={handleInputChange}
            placeholder="Quantidade em Estoque"
            required
          />
          <Input
            name="sku"
            value={newProduct.sku}
            onChange={handleInputChange}
            placeholder="SKU"
          />
          <Input
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            placeholder="Categoria"
          />
          <Input
            name="marketplace"
            value={newProduct.marketplace}
            onChange={handleInputChange}
            placeholder="Marketplace"
          />
          <Input
            name="marketplace_product_id"
            value={newProduct.marketplace_product_id}
            onChange={handleInputChange}
            placeholder="ID do Produto no Marketplace"
          />
          <Input
            name="marketplace_status"
            value={newProduct.marketplace_status}
            onChange={handleInputChange}
            placeholder="Status no Marketplace"
          />
        </div>
        <Button type="submit" className="mt-4">Adicionar Produto</Button>
      </form>

      <h2 className="text-2xl font-bold mb-2">Lista de Produtos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products && products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p>Preço: R${product.price}</p>
            <p>Estoque: {product.stock_quantity}</p>
            <p>SKU: {product.sku}</p>
            <p>Categoria: {product.category}</p>
            <p>Marketplace: {product.marketplace}</p>
            <p>ID no Marketplace: {product.marketplace_product_id}</p>
            <p>Status no Marketplace: {product.marketplace_status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;