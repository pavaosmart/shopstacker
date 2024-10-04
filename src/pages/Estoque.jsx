import React, { useState } from 'react';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from '../hooks/useAuth'; // Assumindo que você tem um hook de autenticação

const Estoque = () => {
  const { data: products, isLoading, error } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const { user } = useAuth(); // Hook para obter informações do usuário atual

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const isSupplier = user?.role === 'supplier'; // Verifica se o usuário é um fornecedor

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isSupplier) {
      toast.error('Apenas fornecedores podem adicionar ou editar produtos.');
      return;
    }

    const formData = new FormData(event.target);
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      stock_quantity: parseInt(formData.get('stock_quantity')),
      suggested_price: parseFloat(formData.get('suggested_price')),
      cover_image: formData.get('cover_image'),
      additional_images: formData.getAll('additional_images'),
      variations: JSON.parse(formData.get('variations') || '[]'),
    };

    try {
      if (currentProduct) {
        await updateProductMutation.mutateAsync({ id: currentProduct.id, ...productData });
        toast.success('Produto atualizado com sucesso!');
      } else {
        await addProductMutation.mutateAsync(productData);
        toast.success('Produto adicionado com sucesso!');
      }
      setIsModalOpen(false);
      setCurrentProduct(null);
    } catch (error) {
      toast.error(`Erro ao ${currentProduct ? 'atualizar' : 'adicionar'} produto: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!isSupplier) {
      toast.error('Apenas fornecedores podem excluir produtos.');
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Estoque</h1>
      
      {isSupplier && (
        <Button onClick={() => { setIsModalOpen(true); setCurrentProduct(null); }} className="mb-4">
          Adicionar Novo Produto
        </Button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{currentProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Título" defaultValue={currentProduct?.name} required />
                <Textarea name="description" placeholder="Descrição" defaultValue={currentProduct?.description} required />
                <Input name="price" type="number" step="0.01" placeholder="Preço" defaultValue={currentProduct?.price} required />
                <Input name="stock_quantity" type="number" placeholder="Quantidade em Estoque" defaultValue={currentProduct?.stock_quantity} required />
                <Input name="suggested_price" type="number" step="0.01" placeholder="Preço Sugerido para Venda" defaultValue={currentProduct?.suggested_price} required />
                <Input name="cover_image" placeholder="URL da Imagem de Capa" defaultValue={currentProduct?.cover_image} required />
                <Input name="additional_images" placeholder="URLs das Imagens Adicionais (separadas por vírgula)" defaultValue={currentProduct?.additional_images?.join(',')} />
                <Textarea name="variations" placeholder="Variações (JSON)" defaultValue={JSON.stringify(currentProduct?.variations || [])} />
                <Button type="submit">Salvar</Button>
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline">Cancelar</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

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
              <p>Preço Sugerido: R$ {product.suggested_price?.toFixed(2)}</p>
              {isSupplier && (
                <div className="mt-4">
                  <Button onClick={() => { setCurrentProduct(product); setIsModalOpen(true); }} className="mr-2">Editar</Button>
                  <Button onClick={() => handleDelete(product.id)} variant="destructive">Excluir</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Estoque;