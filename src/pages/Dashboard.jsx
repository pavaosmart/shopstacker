import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
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

  const { data: products, isLoading, isError } = useProducts();
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
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync(newProduct);
      toast.success('Product added successfully');
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
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      await updateProductMutation.mutateAsync({ id, ...updatedData });
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">MyShopTools Dashboard</h1>
      {session && <p className="mb-4">Logged in as: {session.user.email}</p>}
      <Button onClick={handleLogout} className="mb-4">Logout</Button>
      <Link to="/activity-logs" className="ml-4">
        <Button>Activity Logs</Button>
      </Link>

      <form onSubmit={handleAddProduct} className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Add New Product</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
          />
          <Input
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
          />
          <Input
            name="stock_quantity"
            type="number"
            value={newProduct.stock_quantity}
            onChange={handleInputChange}
            placeholder="Stock Quantity"
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
            placeholder="Category"
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
            placeholder="Marketplace Product ID"
          />
          <Input
            name="marketplace_status"
            value={newProduct.marketplace_status}
            onChange={handleInputChange}
            placeholder="Marketplace Status"
          />
        </div>
        <Button type="submit" className="mt-4">Add Product</Button>
      </form>

      <h2 className="text-2xl font-bold mb-2">Product List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products && products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
            <p>SKU: {product.sku}</p>
            <p>Category: {product.category}</p>
            <p>Marketplace: {product.marketplace}</p>
            <p>Marketplace Product ID: {product.marketplace_product_id}</p>
            <p>Marketplace Status: {product.marketplace_status}</p>
            <Button onClick={() => handleUpdateProduct(product.id, { name: product.name + ' (Updated)' })} className="mr-2">
              Update
            </Button>
            <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive">
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;