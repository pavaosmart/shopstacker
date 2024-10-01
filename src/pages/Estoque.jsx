import React, { useState } from 'react';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Edit, Trash2, Plus, Image } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Estoque = () => {
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    stock_quantity: '', 
    markup: '2.5',
    images: []
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: products, isLoading, error } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
        markup: parseFloat(newProduct.markup),
        images: newProduct.images
      });
      setNewProduct({ name: '', price: '', stock_quantity: '', markup: '2.5', images: [] });
      setIsAddDialogOpen(false);
      toast.success('Produto adicionado com sucesso');
    } catch (error) {
      toast.error('Erro ao adicionar produto');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        stock_quantity: parseInt(editingProduct.stock_quantity),
        markup: parseFloat(editingProduct.markup),
        images: editingProduct.images
      });
      setEditingProduct(null);
      toast.success('Produto atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar produto');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir produto');
    }
  };

  const handleImageUpload = (e, isNewProduct = true) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      if (isNewProduct) {
        setNewProduct(prev => ({ ...prev, images: [...prev.images, ...images].slice(0, 9) }));
      } else {
        setEditingProduct(prev => ({ ...prev, images: [...prev.images, ...images].slice(0, 9) }));
      }
    });
  };

  const removeImage = (index, isNewProduct = true) => {
    if (isNewProduct) {
      setNewProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setEditingProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const setCoverImage = (index, isNewProduct = true) => {
    if (isNewProduct) {
      setNewProduct(prev => ({
        ...prev,
        images: [prev.images[index], ...prev.images.filter((_, i) => i !== index)]
      }));
    } else {
      setEditingProduct(prev => ({
        ...prev,
        images: [prev.images[index], ...prev.images.filter((_, i) => i !== index)]
      }));
    }
  };

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Package className="mr-2" />
            Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4">
                <Plus className="mr-2" />
                Adicionar Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <Input
                  placeholder="Nome do Produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Preço"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Quantidade em Estoque"
                  value={newProduct.stock_quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Markup"
                  value={newProduct.markup}
                  onChange={(e) => setNewProduct({ ...newProduct, markup: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagens do Produto</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Produto ${index + 1}`} className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverImage(index)}
                        className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1"
                      >
                        <Image size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="submit">Adicionar Produto</Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products && products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </CardContent>
      </Card>
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(); }} className="space-y-4">
              <Input
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                placeholder="Nome do Produto"
              />
              <Input
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                placeholder="Preço"
              />
              <Input
                type="number"
                value={editingProduct.stock_quantity}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value })}
                placeholder="Quantidade em Estoque"
              />
              <Input
                type="number"
                value={editingProduct.markup}
                onChange={(e) => setEditingProduct({ ...editingProduct, markup: e.target.value })}
                placeholder="Markup"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagens do Produto</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, false)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {editingProduct.images && editingProduct.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Produto ${index + 1}`} className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index, false)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage(index, false)}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1"
                    >
                      <Image size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <Button type="submit">Salvar Alterações</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Estoque;