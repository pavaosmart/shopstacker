import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { toast } from "sonner";

const Dashboard = ({ supabase, session }) => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: '',
    taxes: 0,
    market_commissions: 0,
    fixed_fee: 0,
    shipping: 0,
    marketplace_url: '',
    product_image: '',
  });

  const { data: products, isLoading, isError } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

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
        taxes: 0,
        market_commissions: 0,
        fixed_fee: 0,
        shipping: 0,
        marketplace_url: '',
        product_image: '',
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
            name="taxes"
            type="number"
            value={newProduct.taxes}
            onChange={handleInputChange}
            placeholder="Taxes"
          />
          <Input
            name="market_commissions"
            type="number"
            value={newProduct.market_commissions}
            onChange={handleInputChange}
            placeholder="Market Commissions"
          />
          <Input
            name="fixed_fee"
            type="number"
            value={newProduct.fixed_fee}
            onChange={handleInputChange}
            placeholder="Fixed Fee"
          />
          <Input
            name="shipping"
            type="number"
            value={newProduct.shipping}
            onChange={handleInputChange}
            placeholder="Shipping"
          />
          <Input
            name="marketplace_url"
            value={newProduct.marketplace_url}
            onChange={handleInputChange}
            placeholder="Marketplace URL"
          />
          <Input
            name="product_image"
            value={newProduct.product_image}
            onChange={handleInputChange}
            placeholder="Product Image URL"
          />
        </div>
        <Button type="submit" className="mt-4">Add Product</Button>
      </form>

      <h2 className="text-2xl font-bold mb-2">Product List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p>Taxes: ${product.taxes}</p>
            <p>Market Commissions: ${product.market_commissions}</p>
            <p>Fixed Fee: ${product.fixed_fee}</p>
            <p>Shipping: ${product.shipping}</p>
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