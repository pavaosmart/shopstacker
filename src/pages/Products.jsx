import React, { useState } from 'react';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Edit, Trash2 } from 'lucide-react';
import Navigation from '../components/Navigation';

const Products = () => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock_quantity: '' });
  const [editingProduct, setEditingProduct] = useState(null);

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
      });
      setNewProduct({ name: '', price: '', stock_quantity: '' });
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
        stock_quantity: parseInt(editingProduct.stock_quantity)
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

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Package className="mr-2" />
              Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mb-4">Adicionar Novo Produto</Button>
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
                  <Button type="submit">Adicionar Produto</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products && products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" className="mr-2" onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
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
              <Button type="submit">Salvar Alterações</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Products;