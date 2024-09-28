import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/supabase';
import { logActivity } from '../utils/logActivity';

const defaultProduct = {
  name: '',
  sale_price: 0,
  product_cost: 0,
  taxes: 0,
  shipping: 0,
  marketplace_url: '',
  product_image: '',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [newProduct, setNewProduct] = useState(defaultProduct);
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
      setEditingProduct(prev => ({ ...prev, [name]: value }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync(newProduct);
      await logActivity(session.user.id, 'CREATE', `Produto "${newProduct.name}" adicionado`);
      toast.success('Produto adicionado com sucesso');
      setNewProduct(defaultProduct);
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

  if (isLoading) return <div className="flex justify-center items-center h-screen">Carregando produtos...</div>;
  if (isError) return (
    <div className="flex justify-center items-center h-screen">
      Erro ao carregar produtos: {error.message}. Por favor, tente novamente mais tarde.
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard MyShopTools</h1>
      {session && <p className="mb-4">Logado como: {session.user.email}</p>}
      <Button onClick={handleLogout} className="mb-4">Sair</Button>

      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(defaultProduct).map((field) => (
            <Input
              key={field}
              name={field}
              value={(editingProduct || newProduct)[field] || ''}
              onChange={handleInputChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
              type={['product_cost', 'taxes', 'shipping', 'sale_price'].includes(field) ? 'number' : 'text'}
            />
          ))}
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
            {product.product_cost && <p>Custo do Produto: R${product.product_cost}</p>}
            {product.product_image && <img src={product.product_image} alt={product.name} className="w-full h-40 object-cover mt-2 mb-2" />}
            <Button onClick={() => setEditingProduct(product)} className="mr-2">Editar</Button>
            <Button onClick={() => handleDeleteProduct(product.id, product.name)} variant="destructive">Excluir</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;