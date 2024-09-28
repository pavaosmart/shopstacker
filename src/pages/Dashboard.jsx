import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct, checkProductPermissions } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Dashboard = () => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock_quantity: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [hasPermission, setHasPermission] = useState(true);
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useProducts();
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

    const checkPermissions = async () => {
      try {
        const hasAccess = await checkProductPermissions();
        setHasPermission(hasAccess);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasPermission(false);
      }
    };
    checkPermissions();
  }, [navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!hasPermission) {
      toast.error('You do not have permission to add products.');
      return;
    }
    try {
      await addProductMutation.mutateAsync({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
      });
      setNewProduct({ name: '', price: '', stock_quantity: '' });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = async () => {
    if (!hasPermission) {
      toast.error('You do not have permission to update products.');
      return;
    }
    if (!editingProduct || !editingProduct.id) {
      toast.error('Invalid product for editing');
      return;
    }
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        stock_quantity: parseInt(editingProduct.stock_quantity)
      });
      setEditingProduct(null);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!hasPermission) {
      toast.error('You do not have permission to delete products.');
      return;
    }
    try {
      await deleteProductMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;
  if (!hasPermission) return <div>You do not have permission to manage products. Please contact an administrator.</div>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <Button onClick={() => navigate('/login')} className="mb-4">Logout</Button>

      <form onSubmit={handleAddProduct} className="mb-8">
        <h2 className="mb-2 text-xl font-bold">Add New Product</h2>
        <Input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="mb-2"
          required
        />
        <Input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="mb-2"
          required
        />
        <Input
          type="number"
          placeholder="Stock Quantity"
          value={newProduct.stock_quantity}
          onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
          className="mb-2"
          required
        />
        <Button type="submit">Add Product</Button>
      </form>

      <h2 className="mb-2 text-xl font-bold">Product List</h2>
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
              <Button onClick={handleUpdateProduct} className="mr-2">Save</Button>
              <Button onClick={() => setEditingProduct(null)}>Cancel</Button>
            </div>
          ) : (
            <div>
              <p>{product.name} - ${product.price} - Stock: {product.stock_quantity}</p>
              <Button onClick={() => handleEditProduct(product)} className="mr-2 mt-2">Edit</Button>
              <Button onClick={() => handleDeleteProduct(product.id)} className="mt-2">Delete</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;