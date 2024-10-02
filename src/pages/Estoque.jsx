import React, { useState } from 'react';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Estoque = () => {
  const { data: products, isLoading, error } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    supplierPrice: '',
    variations: '',
    images: [],
    videos: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: [...prev[name], ...files] }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync(newProduct);
      toast.success('Produto adicionado com sucesso!');
      setNewProduct({ name: '', description: '', supplierPrice: '', variations: '', images: [], videos: [] });
    } catch (error) {
      toast.error('Erro ao adicionar produto: ' + error.message);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Estoque (Fornecedor)</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <Input
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Nome do Produto"
            />
            <Textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              placeholder="Descrição do Produto"
            />
            <Input
              name="supplierPrice"
              type="number"
              value={newProduct.supplierPrice}
              onChange={handleInputChange}
              placeholder="Preço do Fornecedor"
            />
            <Input
              name="variations"
              value={newProduct.variations}
              onChange={handleInputChange}
              placeholder="Variações (separadas por vírgula)"
            />
            <Input
              name="images"
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
            />
            <Input
              name="videos"
              type="file"
              multiple
              onChange={handleFileChange}
              accept="video/*"
            />
            <Button type="submit">Adicionar Produto</Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Preço do Fornecedor: R$ {product.supplierPrice}</p>
              <p>Variações: {product.variations}</p>
              <p>Imagens: {product.images?.length || 0}</p>
              <p>Vídeos: {product.videos?.length || 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Estoque;