import React, { useState } from 'react';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Estoque = () => {
  const { data: products, isLoading, error } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock_quantity: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = async () => {
    try {
      await addProductMutation.mutateAsync({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity),
      });
      setNewProduct({ name: '', description: '', price: '', stock_quantity: '' });
      toast.success('Produto adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar produto: ' + error.message);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        stock_quantity: parseInt(editingProduct.stock_quantity),
      });
      setEditingProduct(null);
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar produto: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Estoque</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Adicionar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Nome do Produto"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Descrição"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Preço"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Quantidade em Estoque"
            type="number"
            value={newProduct.stock_quantity}
            onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
            className="mb-2"
          />
          <Button onClick={handleAddProduct}>Adicionar Produto</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
              <p>Preço: R$ {product.price.toFixed(2)}</p>
              <p>Estoque: {product.stock_quantity}</p>
              <div className="mt-4">
                <Button onClick={() => setEditingProduct(product)} className="mr-2">Editar</Button>
                <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive">Excluir</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingProduct && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Editar Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Nome do Produto"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Descrição"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Preço"
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Quantidade em Estoque"
              type="number"
              value={editingProduct.stock_quantity}
              onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value })}
              className="mb-2"
            />
            <Button onClick={handleUpdateProduct}>Atualizar Produto</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Estoque;