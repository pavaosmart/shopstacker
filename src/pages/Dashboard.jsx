import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/supabase';
import { logActivity } from '../utils/logActivity';

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    min_margin: 0,
    sale_price: 0,
    product_cost: 0,
    taxes: 0,
    market_commissions: 0,
    fixed_fee: 0,
    shipping: 0,
    marketplace_url: '',
    product_image: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: products, isLoading, isError, error } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

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
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync(newProduct);
      await logActivity(session.user.id, 'CREATE', `Produto "${newProduct.name}" adicionado`);
      toast.success('Produto adicionado com sucesso');
      setNewProduct({
        name: '',
        min_margin: 0,
        sale_price: 0,
        product_cost: 0,
        taxes: 0,
        market_commissions: 0,
        fixed_fee: 0,
        shipping: 0,
        marketplace_url: '',
        product_image: '',
      });
    } catch (error) {
      toast.error('Falha ao adicionar produto: ' + error.message);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProductMutation.mutateAsync(editingProduct);
      await logActivity(session.user.id, 'UPDATE', `Produto "${editingProduct.name}" atualizado`);
      toast.success('Produto atualizado com sucesso');
      setEditingProduct(null);
    } catch (error) {
      toast.error('Falha ao atualizar produto: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      await logActivity(session.user.id, 'DELETE', `Produto "${name}" excluído`);
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      toast.error('Falha ao excluir produto: ' + error.message);
    }
  };

  const addExampleProducts = async () => {
    const exampleProducts = [
      { name: "Smartphone X", min_margin: 15, sale_price: 999.99, product_cost: 700, taxes: 50, market_commissions: 30, fixed_fee: 5, shipping: 10, marketplace_url: "https://example.com/smartphone-x", product_image: "https://example.com/images/smartphone-x.jpg" },
      { name: "Laptop Pro", min_margin: 20, sale_price: 1499.99, product_cost: 1000, taxes: 100, market_commissions: 50, fixed_fee: 10, shipping: 20, marketplace_url: "https://example.com/laptop-pro", product_image: "https://example.com/images/laptop-pro.jpg" },
      { name: "Wireless Earbuds", min_margin: 30, sale_price: 129.99, product_cost: 80, taxes: 10, market_commissions: 15, fixed_fee: 2, shipping: 5, marketplace_url: "https://example.com/wireless-earbuds", product_image: "https://example.com/images/wireless-earbuds.jpg" },
      { name: "Smart Watch", min_margin: 25, sale_price: 249.99, product_cost: 150, taxes: 20, market_commissions: 25, fixed_fee: 3, shipping: 8, marketplace_url: "https://example.com/smart-watch", product_image: "https://example.com/images/smart-watch.jpg" },
      { name: "4K TV", min_margin: 10, sale_price: 799.99, product_cost: 600, taxes: 40, market_commissions: 35, fixed_fee: 15, shipping: 50, marketplace_url: "https://example.com/4k-tv", product_image: "https://example.com/images/4k-tv.jpg" },
      { name: "Gaming Console", min_margin: 12, sale_price: 399.99, product_cost: 300, taxes: 30, market_commissions: 20, fixed_fee: 5, shipping: 15, marketplace_url: "https://example.com/gaming-console", product_image: "https://example.com/images/gaming-console.jpg" },
    ];

    for (const product of exampleProducts) {
      try {
        await addProductMutation.mutateAsync(product);
        await logActivity(session.user.id, 'CREATE', `Produto de exemplo "${product.name}" adicionado`);
      } catch (error) {
        console.error(`Falha ao adicionar produto de exemplo ${product.name}:`, error);
      }
    }
    toast.success('Produtos de exemplo adicionados com sucesso');
  };

  if (isLoading) return <div>Carregando produtos...</div>;
  if (isError) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard MyShopTools</h1>
      {session && <p className="mb-4">Logado como: {session.user.email}</p>}
      <Button onClick={handleLogout} className="mb-4">Sair</Button>
      <Button onClick={addExampleProducts} className="mb-4 ml-2">Adicionar Produtos de Exemplo</Button>

      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="name"
            value={editingProduct ? editingProduct.name : newProduct.name}
            onChange={handleInputChange}
            placeholder="Nome do Produto"
            required
          />
          <Input
            name="min_margin"
            type="number"
            value={editingProduct ? editingProduct.min_margin : newProduct.min_margin}
            onChange={handleInputChange}
            placeholder="Margem Mínima"
            required
          />
          <Input
            name="sale_price"
            type="number"
            value={editingProduct ? editingProduct.sale_price : newProduct.sale_price}
            onChange={handleInputChange}
            placeholder="Preço de Venda"
            required
          />
          <Input
            name="product_cost"
            type="number"
            value={editingProduct ? editingProduct.product_cost : newProduct.product_cost}
            onChange={handleInputChange}
            placeholder="Custo do Produto"
            required
          />
          <Input
            name="taxes"
            type="number"
            value={editingProduct ? editingProduct.taxes : newProduct.taxes}
            onChange={handleInputChange}
            placeholder="Impostos"
          />
          <Input
            name="market_commissions"
            type="number"
            value={editingProduct ? editingProduct.market_commissions : newProduct.market_commissions}
            onChange={handleInputChange}
            placeholder="Comissões de Marketplace"
          />
          <Input
            name="fixed_fee"
            type="number"
            value={editingProduct ? editingProduct.fixed_fee : newProduct.fixed_fee}
            onChange={handleInputChange}
            placeholder="Taxa Fixa"
          />
          <Input
            name="shipping"
            type="number"
            value={editingProduct ? editingProduct.shipping : newProduct.shipping}
            onChange={handleInputChange}
            placeholder="Custo de Envio"
          />
          <Input
            name="marketplace_url"
            value={editingProduct ? editingProduct.marketplace_url : newProduct.marketplace_url}
            onChange={handleInputChange}
            placeholder="URL do Marketplace"
          />
          <Input
            name="product_image"
            value={editingProduct ? editingProduct.product_image : newProduct.product_image}
            onChange={handleInputChange}
            placeholder="URL da Imagem do Produto"
          />
        </div>
        <Button type="submit" className="mt-4">{editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}</Button>
        {editingProduct && (
          <Button type="button" onClick={() => setEditingProduct(null)} className="mt-4 ml-2">Cancelar Edição</Button>
        )}
      </form>

      <h2 className="text-2xl font-bold mb-2">Lista de Produtos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products && products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p>Preço de Venda: R${product.sale_price}</p>
            <p>Custo do Produto: R${product.product_cost}</p>
            <p>Margem Mínima: {product.min_margin}%</p>
            <img src={product.product_image} alt={product.name} className="w-full h-40 object-cover mt-2 mb-2" />
            <Button onClick={() => setEditingProduct(product)} className="mr-2">Editar</Button>
            <Button onClick={() => handleDeleteProduct(product.id, product.name)} variant="destructive">Excluir</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;